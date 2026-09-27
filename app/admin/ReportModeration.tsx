"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {supabase} from '@/lib/supabase';
type Report={id:string;target_type:string;target_id:string;reason:string;details:string;created_at:string;target_path:string|null;target_content:string};
export default function ReportModeration(){
 const [rows,setRows]=useState<Report[]>([]),[page,setPage]=useState(0),[refresh,setRefresh]=useState(0),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{let active=true;async function load(){const {data,error}=await supabase.rpc('admin_content_reports',{p_offset:page*50});if(active){setRows(data??[]);setMessage(error?'신고 조회에 실패했습니다. 관리자 OTP 인증을 확인해주세요.':'');}}void load();return()=>{active=false};},[page,refresh]);
 async function resolve(id:string,status:string){setBusy(true);try{const {error}=await supabase.rpc('resolve_content_report',{p_id:id,p_status:status});setMessage(error?'처리하지 못했습니다. 다시 시도해주세요.':'처리 상태를 저장했습니다.');if(!error)setRefresh(x=>x+1);}finally{setBusy(false);}}
 return <section style={{padding:20,border:'1px solid #ddd',borderRadius:12,marginBottom:24}}><h2>콘텐츠 신고</h2><p>원문을 확인하고 필요한 콘텐츠 조치를 먼저 진행한 뒤 처리 완료로 표시하세요. 이 버튼은 콘텐츠를 삭제하지 않습니다.</p>{message&&<p role="status">{message}</p>}{rows.length===0&&<p>대기 중인 신고가 없습니다.</p>}{rows.map(r=><article key={r.id} style={{padding:12,borderTop:'1px solid #ddd',overflowWrap:'anywhere'}}><p>{r.target_type} · {r.reason} · {new Date(r.created_at).toLocaleString('ko-KR')}</p><p>대상 ID: {r.target_id}</p><blockquote style={{whiteSpace:'pre-wrap'}}>{r.target_content}</blockquote>{r.target_path&&<Link href={r.target_path}>원문 확인</Link>}<p style={{whiteSpace:'pre-wrap'}}>{r.details}</p><button disabled={busy} onClick={()=>resolve(r.id,'resolved')}>처리 완료</button> <button disabled={busy} onClick={()=>resolve(r.id,'dismissed')}>기각</button></article>)}<button disabled={busy||page===0} onClick={()=>setPage(page-1)}>이전</button> {page+1}페이지 <button disabled={busy||rows.length<50} onClick={()=>setPage(page+1)}>다음</button></section>;
}
