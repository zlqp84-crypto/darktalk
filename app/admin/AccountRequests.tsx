"use client";
import {useEffect,useState} from 'react';
import {supabase} from '@/lib/supabase';
type Request={id:string;status:string;created_at:string};
export default function AccountRequests(){
 const [rows,setRows]=useState<Request[]>([]),[error,setError]=useState(false);
 useEffect(()=>{let active=true;async function load(){const r=await supabase.rpc('admin_account_deletion_requests');if(active){setRows(r.data??[]);setError(!!r.error);}}void load();return()=>{active=false};},[]);
 return <section style={{padding:20,border:'1px solid #ddd',borderRadius:12,marginBottom:24}}><h2>회원 탈퇴 요청</h2><p>계정·콘텐츠·Storage 사진의 실제 삭제와 사후 확인이 필요합니다. 이 목록은 접수 현황이며 삭제 완료 목록이 아닙니다.</p>{error?<p role="alert">조회에 실패했습니다. 관리자 OTP 인증을 확인해주세요.</p>:rows.length===0?<p>접수된 요청이 없습니다.</p>:rows.map(r=><p key={r.id}>{r.id} · {r.status} · {new Date(r.created_at).toLocaleString('ko-KR')}</p>)}</section>;
}
