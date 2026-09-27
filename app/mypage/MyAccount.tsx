"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {supabase} from '@/lib/supabase';
import {ensureProfile} from '@/lib/ensureProfile';

type Profile={nickname:string;company:string|null;job_title:string|null};
export default function MyAccount(){
 const [profile,setProfile]=useState<Profile|null>(null),[email,setEmail]=useState(''),[ready,setReady]=useState(false),[busy,setBusy]=useState(false),[status,setStatus]=useState<string|null>(null),[message,setMessage]=useState(''),[confirmed,setConfirmed]=useState(false),[refresh,setRefresh]=useState(0);
 useEffect(()=>{let active=true;async function load(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!active)return;
  if(!user){setReady(true);return;}
  if(!(await ensureProfile())){if(active){setMessage('계정 정보를 준비하지 못했습니다. 다시 로그인해주세요.');setReady(true);}return;}
  const [p,r]=await Promise.all([supabase.from('profiles').select('nickname,company,job_title').eq('id',user.id).single(),supabase.rpc('my_account_deletion_request')]);
  if(active){setEmail(user.email??'');setProfile(p.data);setStatus(r.data?.[0]?.status??null);setMessage(p.error||r.error?'일부 계정 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.':'');setReady(true);}
 }void load();return()=>{active=false};},[refresh]);
 async function save(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!profile)return;setBusy(true);try{
  const {data:{user}}=await supabase.auth.getUser();if(!user){setMessage('다시 로그인해주세요.');return;}
  const {error}=await supabase.from('profiles').update({nickname:profile.nickname.trim(),company:profile.company?.trim()||null,job_title:profile.job_title?.trim()||null}).eq('id',user.id);
  setMessage(error?'저장하지 못했습니다. 닉네임 중복과 로그인 상태를 확인해주세요.':'저장했습니다.');
 }finally{setBusy(false);}}
 async function deletion(cancel=false){if(!cancel&&!confirmed)return;setBusy(true);try{
  const {error}=await supabase.rpc(cancel?'cancel_account_deletion':'request_account_deletion');
  if(error)setMessage('요청을 처리하지 못했습니다. 관리자 계정은 권한 이전 후 탈퇴할 수 있습니다.');
  else {setConfirmed(false);setRefresh(x=>x+1);}
 }finally{setBusy(false);}}
 return <><Header/><main style={{maxWidth:720,margin:'32px auto',padding:20}}><h1>내 계정</h1>{!ready?<p>불러오는 중…</p>:!profile?<p><Link href="/login">로그인</Link> 후 계정 정보를 확인할 수 있습니다.</p>:<><p>{email}</p><form onSubmit={save} style={{display:'grid',gap:12}}><label>닉네임 <input required maxLength={40} value={profile.nickname} onChange={e=>setProfile({...profile,nickname:e.target.value})}/></label><label>회사 <input maxLength={200} value={profile.company??''} onChange={e=>setProfile({...profile,company:e.target.value})}/></label><label>직무 <input maxLength={100} value={profile.job_title??''} onChange={e=>setProfile({...profile,job_title:e.target.value})}/></label><button disabled={busy}>프로필 저장</button></form><p>이 정보는 다른 이용자의 게시글·댓글 응답에 포함되지 않습니다. 입력만으로 재직 인증이 되지는 않습니다.</p><p><Link href="/company/write">내 기업 리뷰 관리</Link></p><section style={{border:'1px solid #ddd',padding:20,marginTop:32}}><h2>회원 탈퇴 요청</h2>{status?<><p>{status==='pending'?'탈퇴 요청이 접수되었습니다. 아직 계정 삭제가 완료된 상태는 아닙니다.':'탈퇴 처리 중입니다.'}</p>{status==='pending'&&<button disabled={busy} onClick={()=>deletion(true)}>요청 취소</button>}</>:<><p>탈퇴 요청은 운영자가 확인합니다. 계정·작성 콘텐츠·사진의 처리 범위를 확인한 후 삭제를 진행하며, 접수 즉시 삭제되지는 않습니다.</p><label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>탈퇴 요청을 접수합니다.</label><p><button disabled={busy||!confirmed} onClick={()=>deletion()}>탈퇴 요청</button></p></>}</section></>}{message&&<p role="status">{message}</p>}</main><Footer/></>;
}
