"use client";
export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}){
 return <main style={{padding:32}}><h1>페이지를 불러오지 못했습니다.</h1><p>잠시 후 다시 시도해주세요.</p><button onClick={reset}>다시 시도</button></main>;
}
