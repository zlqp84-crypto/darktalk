// Keep these projections in sync with the column grants in the P0 migration.
// Never include user_id or embed profiles in a public content response.
export const PUBLIC_POST_COLUMNS = "id,title,content,category,likes_count,comments_count,views_count,created_at,image_urls";
export const PUBLIC_COMMENT_COLUMNS = "id,post_id,content,created_at,likes_count";

export interface PublicPost {
  id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  image_urls: string[];
}

export interface PublicComment {
  id: string;
  post_id: string | null;
  content: string;
  created_at: string;
  likes_count: number;
}

type PostRow = Omit<PublicPost, "category" | "likes_count" | "comments_count" | "views_count" | "created_at"> & {
  category: string | null;
  likes_count: number | null;
  comments_count: number | null;
  views_count: number | null;
  created_at: string | null;
};

// Explicit projection also prevents accidentally forwarding extra fields into
// client-component props if a caller supplies a larger object in the future.
export function toPublicPost(row: PostRow): PublicPost {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category ?? "",
    likes_count: row.likes_count ?? 0,
    comments_count: row.comments_count ?? 0,
    views_count: row.views_count ?? 0,
    created_at: row.created_at ?? "",
    image_urls: row.image_urls,
  };
}

export function toPublicComment(row: Omit<PublicComment, "created_at"> & { created_at: string | null }): PublicComment {
  return {
    id: row.id,
    post_id: row.post_id,
    content: row.content,
    created_at: row.created_at ?? "",
    likes_count: row.likes_count,
  };
}
