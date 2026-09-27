"use client";
import {useState} from 'react';
import {supabase} from '@/lib/supabase';
export default function ReportButton({type,id}:{type:'post'|'comment'|'review';id:string}){
 const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setMessage('');
  const form=new FormData(e.currentTarget);
  try{
   const {error}=await supabase.rpc('submit_content_report',{p_target_type:type,p_target_id:id,p_reason:form.get('reason'),p_details:form.get('details')});
   setMessage(error?'신고하지 못했어요. 로그인 상태와 하루 10건 제한을 확인해주세요.':'신고가 접수됐습니다. 관리자가 검토합니다.');
   if(!error)setOpen(false);
  }finally{setBusy(false);}
 }
 return <div><button type="button" onClick={()=>setOpen(!open)}>신고</button>{open&&<form onSubmit={submit} style={{padding:12,border:'1px solid #ddd'}}><label>신고 사유 <select name="reason"><option value="privacy">개인정보 노출</option><option value="abuse">혐오·위협·부적절한 내용</option><option value="spam">스팸·광고</option><option value="false_information">허위 정보</option><option value="other">기타</option></select></label><label style={{display:'block'}}>추가 설명 (선택)<textarea name="details" maxLength={1000} placeholder="불필요한 개인정보는 적지 마세요." /></label><button disabled={busy}>신고 접수</button><button type="button" onClick={()=>setOpen(false)}>취소</button></form>}{message&&<span role="status">{message}</span>}</div>;
}
