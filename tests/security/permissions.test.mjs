import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { before, after, test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { PUBLIC_POST_COLUMNS, PUBLIC_COMMENT_COLUMNS, toPublicPost, toPublicComment } from '../../lib/publicContent.ts';

const db = new PGlite();
const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const migrations = [
  '../../supabase/migrations/20260917120000_p0_content_privacy_and_permissions.sql',
  '../../supabase/migrations/20260917121000_p0_image_identity.sql',
];
const A = '10000000-0000-4000-8000-000000000001';
const B = '10000000-0000-4000-8000-000000000002';
const ADMIN = '10000000-0000-4000-8000-000000000003';
const NEW = '10000000-0000-4000-8000-000000000004';
const POST = '20000000-0000-4000-8000-000000000001';
const COMMENT = '30000000-0000-4000-8000-000000000001';
const IMAGE = 'public/40000000-0000-4000-8000-000000000001.jpg';
const denied = (operation) => assert.rejects(operation, (error) => error.code === '42501');

async function asRole(role, sub, aal, run, extraClaims = {}) {
  assert.ok(['anon', 'authenticated'].includes(role));
  await db.exec('begin');
  try {
    await db.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ role, sub, aal, ...extraClaims })]);
    await db.exec(`set local role ${role}`);
    return await run(db);
  } finally {
    // Every mutation, including successful administrator deletes, is rolled back.
    await db.exec('rollback');
  }
}

before(async () => {
  await db.exec(await read('./observed-schema.sql'));
  // Existing public RPC definitions observed on the live database.
  await db.exec(await read('../../supabase/sql/increment_counters.sql'));
  await db.exec(await read('../../supabase/sql/add_admin_support.sql'));
  await db.exec(await read('../../supabase/sql/grant_admin_with_mfa.sql').then(sql => sql.slice(sql.indexOf('create or replace function'))));
  for (const path of migrations) await db.exec(await read(path));
  await db.query('insert into auth.users(id) values ($1),($2),($3),($4)', [A, B, ADMIN, NEW]);
  await db.query("insert into public.profiles(id,nickname,company,is_admin,is_verified) values ($1,'User A','Company A',false,false),($2,'User B','Company B',false,false),($3,'Admin','Ops',true,true)", [A, B, ADMIN]);
  await db.query("insert into public.posts(id,user_id,title,content,category) values ($1,$2,'Fixture post','Fixture content','자유게시판')", [POST, A]);
  await db.query("insert into public.comments(id,post_id,user_id,content) values ($1,$2,$3,'Fixture comment')", [COMMENT, POST, B]);
  await db.query("insert into storage.objects(bucket_id,name,owner_id) values ('post-images',$1,$2)", [IMAGE, A]);
});
after(async () => { await db.close(); });

const actors = [
  ['anon', 'anon', null, null],
  ['user A', 'authenticated', A, 'aal1'],
  ['user B', 'authenticated', B, 'aal1'],
  ['admin aal1', 'authenticated', ADMIN, 'aal1'],
  ['admin aal2', 'authenticated', ADMIN, 'aal2'],
];

for (const [label, role, sub, aal] of actors) {
  test(`${label}: public post/comment projections work and contain no identity fields`, async () => {
    await asRole(role, sub, aal, async tx => {
      for (const [table, fields] of [['posts', PUBLIC_POST_COLUMNS], ['comments', PUBLIC_COMMENT_COLUMNS]]) {
        const { rows } = await tx.query(`select ${fields} from public.${table}`);
        assert.equal(rows.length, 1);
        assert.deepEqual(Object.keys(rows[0]).sort(), fields.split(',').sort());
        assert.ok(!JSON.stringify(rows).includes(A));
        assert.ok(!JSON.stringify(rows).includes(B));
      }
    });
  });
  for (const table of ['posts', 'comments']) {
    for (const expression of ['user_id', '*', `row_to_json(${table})`]) {
      test(`${label}: ${table} ${expression} is denied`, async () => {
        await denied(() => asRole(role, sub, aal, tx => tx.query(`select ${expression} from public.${table}`)));
      });
    }
    test(`${label}: cannot infer author through a user_id filter`, async () => {
      await denied(() => asRole(role, sub, aal, tx => tx.query(`select id from public.${table} where user_id = $1`, [A])));
    });
    test(`${label}: cannot embed original profile through the hidden FK`, async () => {
      await denied(() => asRole(role, sub, aal, tx => tx.query(`select c.id, p.nickname from public.${table} c join public.profiles p on p.id = c.user_id`)));
    });
  }

  test(`${label}: direct profile access stays owner-only`, async () => {
    const run = () => asRole(role, sub, aal, tx => tx.query('select id,nickname,is_admin,is_verified from public.profiles'));
    if (role === 'anon') return denied(run);
    assert.deepEqual((await run()).rows.map(row => row.id), [sub]);
  });

  for (const rpc of ['admin_get_stats()', 'admin_list_posts()', 'admin_list_comments()', 'admin_list_profiles()']) {
    test(`${label}: ${rpc} requires stored admin AND aal2`, async () => {
      const run = () => asRole(role, sub, aal, tx => tx.query(`select * from public.${rpc}`));
      if (sub === ADMIN && aal === 'aal2') assert.ok((await run()).rows.length > 0);
      else await denied(run);
    });
  }

  for (const [rpc, id, table] of [['admin_delete_post', POST, 'posts'], ['admin_delete_comment', COMMENT, 'comments']]) {
    test(`${label}: ${rpc} requires stored admin AND aal2`, async () => {
      const run = () => asRole(role, sub, aal, async tx => {
        await tx.query(`select public.${rpc}($1)`, [id]);
        assert.equal((await tx.query(`select id from public.${table} where id=$1`, [id])).rows.length, 0);
        if (table === 'posts') assert.equal((await tx.query('select id from public.comments where post_id=$1', [POST])).rows.length, 0);
      });
      if (sub === ADMIN && aal === 'aal2') await run();
      else await denied(run);
    });
  }

  test(`${label}: internal admin guard is not an exposed RPC`, async () => {
    await denied(() => asRole(role, sub, aal, tx => tx.query('select public.require_admin_aal2()')));
  });
}

for (const [label, user, other] of [['user A', A, B], ['user B', B, A]]) {
  for (const table of ['posts', 'comments']) {
    const insert = table === 'posts'
      ? "insert into public.posts (user_id,title,content) values ($1,'New','Content') returning id,title"
      : `insert into public.comments (user_id,post_id,content) values ($1,'${POST}','New comment') returning id,post_id,content`;
    test(`${label}: can insert own ${table} and read safe RETURNING fields`, async () => {
      await asRole('authenticated', user, 'aal1', async tx => assert.equal((await tx.query(insert, [user])).rows.length, 1));
    });
    for (const badId of [other, null]) {
      test(`${label}: cannot insert ${table} with ${badId === null ? 'NULL' : 'another user'} author`, async () => {
        await denied(() => asRole('authenticated', user, 'aal1', tx => tx.query(insert, [badId])));
      });
    }
    test(`${label}: database defaults ${table}.user_id to auth.uid()`, async () => {
      await asRole('authenticated', user, 'aal1', async tx => {
        const sql = table === 'posts'
          ? "insert into public.posts(title,content) values ('Default','Content') returning id"
          : `insert into public.comments(post_id,content) values ('${POST}','Default') returning id`;
        const { rows } = await tx.query(sql);
        await tx.exec('reset role');
        assert.equal((await tx.query(`select user_id from public.${table} where id=$1`, [rows[0].id])).rows[0].user_id, user);
      });
    });
    for (const sql of [`update public.${table} set content='Edited'`, `delete from public.${table}`, `truncate public.${table} cascade`]) {
      test(`${label}: ${sql.split(' ')[0]} ${table} is unavailable outside admin RPC`, async () => {
        await denied(() => asRole('authenticated', user, 'aal1', tx => tx.exec(sql)));
      });
    }
  }

  test(`${label}: can edit own allowed profile fields`, async () => {
    await asRole('authenticated', user, 'aal1', async tx => {
      const { rows } = await tx.query("update public.profiles set nickname='Changed nickname',company='Changed company',job_title='Changed job' where id=$1 returning id", [user]);
      assert.equal(rows.length, 1);
    });
  });
  test(`${label}: cannot read or edit another profile`, async () => {
    await asRole('authenticated', user, 'aal1', async tx => {
      assert.equal((await tx.query('select id,nickname from public.profiles where id=$1', [other])).rows.length, 0);
      assert.equal((await tx.query("update public.profiles set nickname='Intruder' where id=$1 returning id", [other])).rows.length, 0);
    });
  });
  for (const field of ['is_admin', 'is_verified']) {
    test(`${label}: cannot update own ${field}`, async () => {
      await denied(() => asRole('authenticated', user, 'aal1', tx => tx.query(`update public.profiles set ${field}=true where id=$1`, [user])));
    });
    test(`${label}: cannot escalate ${field} using UPSERT`, async () => {
      await denied(() => asRole('authenticated', user, 'aal1', tx => tx.query(`insert into public.profiles(id,nickname,${field}) values ($1,'Escalation',true) on conflict(id) do update set ${field}=true`, [user])));
    });
  }
  test(`${label}: cannot change profile ID`, async () => {
    await denied(() => asRole('authenticated', user, 'aal1', tx => tx.query('update public.profiles set id=$1 where id=$2', [other, user])));
  });
  test(`${label}: cannot delete and recreate profile with privileged flags`, async () => {
    await denied(() => asRole('authenticated', user, 'aal1', tx => tx.query('delete from public.profiles where id=$1', [user])));
  });
}

test('new authenticated user: own profile creation preserves false flags', async () => {
  await asRole('authenticated', NEW, 'aal1', async tx => {
    const { rows } = await tx.query("insert into public.profiles(id,nickname,company) values ($1,'New user','Company') returning id,is_admin,is_verified", [NEW]);
    assert.deepEqual(rows[0], { id: NEW, is_admin: false, is_verified: false });
  });
});
for (const field of ['is_admin', 'is_verified']) {
  test(`new authenticated user: INSERT cannot set ${field}`, async () => {
    await denied(() => asRole('authenticated', NEW, 'aal1', tx => tx.query(`insert into public.profiles(id,nickname,${field}) values ($1,'Escalation',true)`, [NEW])));
  });
}
test('user A: cannot create profile for another account', async () => {
  await denied(() => asRole('authenticated', A, 'aal1', tx => tx.query("insert into public.profiles(id,nickname) values ($1,'Other profile')", [NEW])));
});
for (const sql of [
  "insert into public.posts(title,content) values ('Anon','Content')",
  `insert into public.comments(post_id,content) values ('${POST}','Anon')`,
  `insert into public.profiles(id,nickname) values ('${NEW}','Anon')`,
]) {
  test(`anon: ${sql.split('(')[0]} denied`, async () => {
    await denied(() => asRole('anon', null, null, tx => tx.exec(sql)));
  });
}
test('non-admin with aal2 and forged user_metadata is still not admin', async () => {
  await denied(() => asRole('authenticated', A, 'aal2', tx => tx.query('select * from public.admin_list_profiles()'), { user_metadata: { is_admin: true } }));
});
test('stored admin without aal claim is denied', async () => {
  await denied(() => asRole('authenticated', ADMIN, undefined, tx => tx.query('select public.admin_get_stats()')));
});
test('admin aal2: list and stats include all users only through guarded RPC', async () => {
  await asRole('authenticated', ADMIN, 'aal2', async tx => {
    assert.equal((await tx.query('select * from public.admin_list_profiles()')).rows.length, 3);
    assert.deepEqual((await tx.query('select public.admin_get_stats() as stats')).rows[0].stats, { posts: 1, comments: 1, users: 3 });
  });
});
test('anon: existing counter RPC compatibility is retained (P1 controls unchanged)', async () => {
  await asRole('anon', null, null, async tx => {
    await tx.query('select public.increment_post_views($1), public.increment_post_likes($1,1), public.increment_post_comments_count($1,1)', [POST]);
    assert.deepEqual((await tx.query('select views_count,likes_count,comments_count from public.posts where id=$1', [POST])).rows[0], { views_count: 1, likes_count: 1, comments_count: 1 });
  });
});

for (const [label, role, sub, aal] of actors) {
  test(`${label}: storage metadata reveals only own objects`, async () => {
    await asRole(role, sub, aal, async tx => {
      const { rows } = await tx.query("select name,owner_id from storage.objects where bucket_id='post-images'");
      assert.equal(rows.length, sub === A ? 1 : 0);
    });
  });
}
test('user A: upload random public path and delete own image', async () => {
  await asRole('authenticated', A, 'aal1', async tx => {
    await tx.query("insert into storage.objects(bucket_id,name,owner_id) values ('post-images','public/40000000-0000-4000-8000-000000000002.png',$1)", [A]);
    assert.equal((await tx.query("delete from storage.objects where name=$1 returning name", [IMAGE])).rows.length, 1);
  });
});
test('user B: cannot delete user A image', async () => {
  await asRole('authenticated', B, 'aal1', async tx => assert.equal((await tx.query('delete from storage.objects where name=$1 returning name', [IMAGE])).rows.length, 0));
});
for (const [name, owner] of [[`${A}/photo.jpg`, A], [IMAGE, B]]) {
  test(`user A: reject ${owner === B ? 'forged image owner' : 'legacy UID image path'}`, async () => {
    await denied(() => asRole('authenticated', A, 'aal1', tx => tx.query("insert into storage.objects(bucket_id,name,owner_id) values ('post-images',$1,$2)", [name, owner])));
  });
}
test('anon: cannot upload image', async () => {
  await denied(() => asRole('anon', null, null, tx => tx.query("insert into storage.objects(bucket_id,name,owner_id) values ('post-images',$1,$2)", [IMAGE, A])));
});
test('DTOs strip identity fields even if supplied an oversized object', () => {
  const extra = { user_id: A, nickname: 'Real nickname', profiles: { nickname: 'Real nickname', company: 'Company' } };
  assert.deepEqual(Object.keys(toPublicPost({ id: POST, title: 'Title', content: 'Content', category: null, likes_count: null, comments_count: null, views_count: null, created_at: null, image_urls: [], ...extra })).sort(), PUBLIC_POST_COLUMNS.split(',').sort());
  assert.deepEqual(Object.keys(toPublicComment({ id: COMMENT, post_id: POST, content: 'Content', created_at: null, likes_count: 0, ...extra })).sort(), PUBLIC_COMMENT_COLUMNS.split(',').sort());
});

for (const file of ['add_admin_support.sql', 'grant_admin_with_mfa.sql', 'setup_post_images_storage.sql']) {
  test(`legacy ${file} cannot undo P0 permissions`, async () => {
    await assert.rejects(() => db.exec(readLegacy.get(file)), /Deprecated after P0/);
  });
}
const readLegacy = new Map();
before(async () => {
  for (const file of ['add_admin_support.sql', 'grant_admin_with_mfa.sql', 'setup_post_images_storage.sql']) {
    readLegacy.set(file, await read(`../../supabase/sql/${file}`));
  }
});
test('migrations can be applied again without changing data or granting new access', async () => {
  for (const path of migrations) await db.exec(await read(path));
  assert.equal((await db.query('select count(*)::int as n from public.posts')).rows[0].n, 1);
  await denied(() => asRole('authenticated', A, 'aal1', tx => tx.query('update public.profiles set is_admin=true where id=$1', [A])));
});

test('preflight stops on an unreviewed public policy without replacing it', async () => {
  await db.exec('begin');
  try {
    await db.exec('create policy unreviewed_policy on public.posts for select using (true)');
    await assert.rejects(() => read(migrations[0]).then(sql => db.exec(sql)), /unreviewed policies/);
  } finally {
    await db.exec('rollback');
  }
});
test('preflight stops on an unreviewed Storage policy', async () => {
  await db.exec('begin');
  try {
    await db.exec('create policy unreviewed_policy on storage.objects for select using (true)');
    await assert.rejects(() => read(migrations[1]).then(sql => db.exec(sql)), /unreviewed Storage policies/);
  } finally {
    await db.exec('rollback');
  }
});
test('preflight refuses legacy image paths instead of breaking existing attachments', async () => {
  await db.exec('begin');
  try {
    await db.query("insert into storage.objects(bucket_id,name,owner_id) values ('post-images',$1,$2)", [`${A}/legacy.jpg`, A]);
    await assert.rejects(() => read(migrations[1]).then(sql => db.exec(sql)), /legacy image paths/);
  } finally {
    await db.exec('rollback');
  }
});
