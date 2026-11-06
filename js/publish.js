'use strict';
// Explicit source allowlist only. Never reads browser records or a repository snapshot.
window.RadarWebsitePackage=(()=>{
  const paths=Object.freeze([
    'index.html','publish.html','css/style.css','css/monitor.css','css/publish.css',
    'js/app.js','js/monitor.js','js/event-bridge.js','js/event-integration.js',
    'js/recovery-ui.js','js/publish.js','js/vendor/fflate.js','js/vendor/fflate.LICENSE.txt',
    'data/monitor-plan.json','data/monitor-feed.json',
    'automation/collector.py','automation/test_collector.py','automation/rwa-monitor.yml',
    'automation/SETUP.md','automation/KEYWORDS.md','automation/UPDATE.md','PUBLIC-WEBSITE.md'
  ]);
  async function build(){
    if(!window.fflate)throw Error('ZIP 기능을 읽지 못했습니다. 새로고침 후 다시 시도해 주세요.');
    const files={};
    for(const path of paths){
      const response=await fetch(new URL(path,document.baseURI),{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(30000)});
      if(!response.ok)throw Error(path+' 파일 요청 실패: HTTP '+response.status);
      files[path]=new Uint8Array(await response.arrayBuffer());
    }
    files['.nojekyll']=new Uint8Array();
    files['README.md']=fflate.strToU8('# 토크노미 코리아 연사 섭외 모니터링\n\n무료 GitHub Pages 공개용 정적 웹사이트입니다. PUBLIC-WEBSITE.md를 먼저 읽으세요. 기존 tokenomy-korea-monitor 저장소가 아닌 별도 새 공개 저장소에 설치합니다. Source는 Deploy from a branch, main, /(root)입니다. 개인 기록은 포함되지 않으며 같은 링크에서 공동 편집하지 않습니다.\n\n시작: index.html\n공개 안내: publish.html\n조사 피드: https://dooney37.github.io/tokenomy-korea-monitor/monitor-feed.json\n\n실제 공유 주소는 Pages 배포 완료 후 Settings → Pages에서 확인하세요. 다운로드만으로 배포가 완료되지 않습니다.\n');
    return {bytes:fflate.zipSync(files,{level:6}),files:Object.keys(files)};
  }
  async function downloadPackage(){
    const button=document.getElementById('downloadWebsite');
    const status=document.getElementById('downloadStatus');
    button.disabled=true;status.dataset.error='false';status.textContent='공개 파일을 묶는 중입니다… 개인 기록은 읽지 않습니다.';
    let blobUrl;
    try{
      const result=await build();
      blobUrl=URL.createObjectURL(new Blob([result.bytes],{type:'application/zip'}));
      const a=document.createElement('a');a.href=blobUrl;a.download='tokenomy-korea-public-website.zip';document.body.append(a);a.click();a.remove();
      status.textContent='공개용 ZIP을 준비했습니다. 다운로드 폴더를 확인하고 아래 순서로 새 저장소에 올려 주세요. 아직 배포된 상태는 아닙니다.';
    }catch(error){status.dataset.error='true';status.textContent='파일을 묶지 못했습니다: '+error.message+' 다시 시도해 주세요.';}
    finally{button.disabled=false;if(blobUrl)setTimeout(()=>URL.revokeObjectURL(blobUrl),60000);}
  }
  document.getElementById('downloadWebsite')?.addEventListener('click',downloadPackage);
  return Object.freeze({paths,build,downloadPackage});
})();
