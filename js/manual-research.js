'use strict';
window.RadarManualResearch=(()=>{
  const WORKFLOW='https://github.com/dooney37/tokenomy-korea-monitor/actions/workflows/rwa-monitor.yml';
  let target='', importId='', importRevision='';
  function requestUrl(value){const u=new URL(value.trim());if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.search||u.hash||u.port&&!['80','443'].includes(u.port)||!u.hostname.includes('.')||/^[\d.]+$/.test(u.hostname)||u.hostname.includes(':')||/(^|\.)(localhost|local|internal|test|invalid)$/.test(u.hostname))throw Error('인증정보·쿼리·#이 없는 공개 HTTP(S) 웹페이지 주소를 넣어 주세요. 내부망·IP 주소·서명된 링크는 지원하지 않습니다.');return u.href;}
  function openRun(url=''){
    if(demo){toast('예시 모드를 종료한 뒤 조사해 주세요.');return;}
    target=url;
    $('manualRunContent').innerHTML=`<div class="dialog-heading"><div><span class="eyebrow">GITHUB OWNER APPROVAL</span><h2>${url?'지정 URL 조사 실행':'전체 모니터링 직접 실행'}</h2></div><button class="icon-button close-dialog" aria-label="닫기">×</button></div><div class="info-strip">아직 실행하지 않았습니다. 아래 버튼은 GitHub 실행 화면을 엽니다. 로그인 후 저장소 소유자 권한으로 Run workflow를 눌러야 조사가 시작됩니다.</div>${url?`<label>GitHub의 target_url 칸에 붙여넣을 주소<input id="preparedTargetUrl" type="url" readonly value="${esc(url)}"></label><button class="button secondary" type="button" id="copyTargetUrl">주소 복사</button>`:''}<ol class="manual-instructions"><li>아래 ‘GitHub에서 실행 승인’을 누릅니다. 저장소는 <strong>dooney37/tokenomy-korea-monitor</strong>입니다.</li><li>GitHub의 <strong>Run workflow</strong>를 열고 기본 브랜치 <strong>main</strong>을 선택합니다.</li><li>${url?'업데이트된 target_url 입력란에 위 주소를 붙여넣습니다. 칸이 없으면 수동 조사 기능 업데이트가 필요합니다.':'전체 조사는 <strong>target_url을 비워 둡니다.</strong>'}</li><li>초록색 <strong>Run workflow</strong>로 승인합니다. 실행 중이면 중복 요청하지 말고 완료를 기다려 주세요.</li><li>Pages 배포까지 끝나면 이 화면으로 돌아와 ‘조사결과 다시 읽기’를 누릅니다.</li></ol><p class="footnote">URL·본문 발췌·추출 인물은 공개 피드와 Git 이력에 남습니다. 토큰·개인 메모를 넣지 마세요. 이 버튼은 예약 자체를 복구하지 않으며 GitHub 장애·권한·실행 한도 문제를 우회하지 않습니다. 다른 피드를 연결한 경우에도 이 실행 버튼은 위 고정 저장소를 엽니다.</p><div class="manual-run-actions"><a class="button primary" href="${WORKFLOW}" target="_blank" rel="noopener noreferrer">GitHub에서 실행 승인 ↗</a><button class="button secondary" type="button" id="readAfterManual">조사결과 다시 읽기</button></div><p class="footnote">수동 URL 기능은 수집기·워크플로 v3 업데이트가 필요합니다. 자동 조사 센터의 ‘수동 조사 기능 업데이트 파일’에서 받으세요.</p>`;
    $('manualRunDialog').showModal();renderStatus();
  }
  function renderStatus(){
    const el=$('manualResearchStatus');if(!el)return;
    const run=(monitorFeed?.runs||[]).find(r=>r.mode==='target_url'&&(!target||r.target_url===target));
    if(run){el.textContent=`공개 피드의 지정 URL 조사 기록: ${kstTime(run.finished_at)} · ${run.status==='success'?'페이지 접근 성공':'접근 실패'} · 신규 ${run.new||0} / 변경 ${run.updated||0}건. 현재 준비한 요청이 새로 실행됐다는 확인은 아니며 시각·대상 URL을 실행 기록에서 확인하세요.`;}
    else if(target)el.textContent='URL 요청을 준비했습니다. 아직 실행 승인·접수를 확인하지 않았습니다. GitHub에서 실행 후 완료 시각과 대상 URL을 확인하세요.';
    else el.textContent='무료 구성에서는 실행 화면을 연 뒤 GitHub에서 Run workflow로 직접 승인합니다. 결과 재조회만으로 새 조사가 시작되지는 않습니다.';
  }
  function openImport(id){
    if(demo){toast('예시 모드를 종료한 뒤 실제 연사를 등록하세요.');return;}
    const item=monitorFeed?.items.find(i=>i.id===id);if(!item?.speakers?.length)return;
    importId=id;importRevision=item.revision;
    const mapped={HK:'홍콩',JP:'일본',KR:'한국',SG:'싱가포르',TW:'대만',CN:'중국','Hong Kong':'홍콩',Japan:'일본',Korea:'한국',Singapore:'싱가포르',Taiwan:'대만',China:'중국'};
    const region=mapped[item.region]||item.region;
    $('speakerImportContent').innerHTML=`<div class="dialog-heading"><div><span class="eyebrow">REVIEW BEFORE ADDING</span><h2>추출 연사 검토·선택 등록</h2></div><button type="button" class="icon-button close-dialog" aria-label="닫기">×</button></div><p class="footnote">${link(item.url,'수집 근거 열기 ↗')} · 자동 추출은 참석 확정이 아닙니다. 현재 소속·직함·해당 행사 참석을 확인하세요. 저장은 이 브라우저에만 반영됩니다.</p><label>등록할 행사<select id="importEventTarget"><option value="">새 행사와 함께 등록</option>${data().events.map(e=>`<option value="${esc(e.id)}">${esc(e.name)}</option>`).join('')}</select></label><fieldset id="importNewEvent"><legend>새 행사 정보 · 공식 원문 확인 후 수정</legend><label>공식 행사명<input name="eventName" maxlength="160" value="${esc(item.title.slice(0,160))}" required></label><div class="form-row"><label>시작일<input name="eventDate" type="date" value="${esc(item.event_date||'')}"></label><label>종료일<input name="eventEnd" type="date" value="${esc(item.end_date||'')}"></label></div><label>개최 지역<select name="eventRegion" required><option value="">직접 확인 후 선택</option>${['한국','중국','일본','홍콩','대만','싱가포르','기타 동남아시아'].map(r=>`<option ${r===region?'selected':''}>${r}</option>`).join('')}</select></label><label>공식 행사 근거 URL<input name="eventUrl" type="url" required value="${esc(item.url)}"></label><p class="footnote">일정이 없으면 일정 미확정으로 저장합니다. 기존 행사를 선택하면 기존 행사 내용은 변경하지 않고 연사만 추가합니다.</p></fieldset><h3>등록할 인물을 선택하세요</h3><p class="footnote">이름과 소속은 필수입니다. 모르는 소속은 추정하지 말고 확인 후 입력하세요. 최대 100명을 표시합니다.</p>${item.speakers.slice(0,100).map((s,i)=>`<fieldset class="import-person" data-import-person="${i}"><legend><label class="manual-consent"><input type="checkbox" name="selected" value="${i}"> 이 인물 등록</label></legend><div class="form-row"><label>이름<input data-person="name" maxlength="100" value="${esc(s.name.slice(0,100))}"></label><label>소속<input data-person="company" maxlength="160" value="${esc((s.company||'').slice(0,160))}"></label></div><label>직함<input data-person="role" maxlength="100" value="${esc((s.role||'').slice(0,100))}"></label><label>발표 주제<input data-person="topic" maxlength="300" placeholder="확인한 주제만 입력"></label><label>공식 연사 근거 URL<input data-person="url" type="url" value="${esc(safeUrl(s.url)||item.url)}"></label></fieldset>`).join('')}<label class="manual-consent"><input id="importConfirmed" type="checkbox" required> 공식 근거에서 해당 행사·인물·현직 소속을 직접 확인했습니다.</label><p id="speakerImportFeedback" role="status" class="footnote"></p><div class="dialog-actions"><button type="button" class="button secondary close-dialog">취소</button><button class="button primary" type="submit">선택한 연사 등록</button></div>`;
    $('monitorDetailDialog').close();$('speakerImportDialog').showModal();
    const existing=data().events.find(e=>e.originFindingId===id);if(existing){$('importEventTarget').value=existing.id;toggleEvent();}
  }
  function toggleEvent(){const disabled=!!$('importEventTarget').value;$('importNewEvent').disabled=disabled;$('importNewEvent').hidden=disabled;}
  const normalized=s=>s.normalize('NFKC').replace(/\s+/g,' ').trim().toLowerCase();
  function evidenceUrl(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u.href:'';}catch{return '';}}
  function saveImport(ev){
    ev.preventDefault();const feedback=$('speakerImportFeedback');
    try{
      if(demo)throw Error('예시 모드를 종료하세요.');
      const item=monitorFeed?.items.find(i=>i.id===importId);if(!item||item.revision!==importRevision)throw Error('원본이 갱신되었습니다. 이 창을 닫고 새 내용으로 다시 검토해 주세요.');
      if(!$('importConfirmed').checked)throw Error('공식 근거 확인이 필요합니다.');
      const selected=[...$('speakerImportForm').querySelectorAll('input[name="selected"]:checked')];if(!selected.length)throw Error('등록할 인물을 선택하세요.');
      const people=selected.map(c=>{const row=c.closest('[data-import-person]');const v=Object.fromEntries([...row.querySelectorAll('[data-person]')].map(e=>[e.dataset.person,e.value.trim()]));if(!v.name||!v.company||!evidenceUrl(v.url))throw Error('선택한 인물의 이름·소속·HTTP(S) 근거 URL을 확인하세요.');return {...v,url:evidenceUrl(v.url)};});
      let eventId=$('importEventTarget').value;let newEvent;
      if(eventId&&!data().events.some(e=>e.id===eventId))throw Error('등록할 행사를 다시 선택하세요.');
      if(!eventId){
        const f=$('speakerImportForm').elements;const date=f.eventDate.value;const endDate=f.eventEnd.value;
        if(!f.eventName.value.trim()||!f.eventRegion.value||!evidenceUrl(f.eventUrl.value))throw Error('새 행사의 공식명·지역·근거 URL을 확인하세요.');
        if(endDate&&(!date||endDate<date))throw Error('종료일은 시작일과 같거나 이후여야 합니다.');
        if(date&&!inScope({date})&&!confirm('대상 기간 밖의 행사입니다. 참고용으로 저장할까요?'))return;
        eventId=uid();newEvent={id:eventId,name:f.eventName.value.trim(),date,endDate,region:f.eventRegion.value,city:'',organizer:'',topic:'기타 금융·블록체인',status:date?'스피커 공개':'일정 미확정',checked:localDay(),url:evidenceUrl(f.eventUrl.value),notes:'자동 추출 후 사용자 검수·선택 등록. 수집 원문: '+item.url,originFindingId:item.id};
      }
      let added=0,skipped=0;
      const ok=mutate(d=>{if(newEvent)d.events.push(newEvent);for(const p of people){if(d.speakers.some(s=>s.eventId===eventId&&normalized(s.name)===normalized(p.name)&&normalized(s.company)===normalized(p.company))){skipped++;continue;}d.speakers.push({...p,id:uid(),eventId,stage:'관심 후보',sourceFindingId:item.id,sourceRevision:item.revision});added++;}});
      if(ok){$('speakerImportDialog').close();renderMonitor();toast(`연사 ${added}명 등록 · 동일 행사/이름/소속 중복 ${skipped}명 제외. 기존 기록은 변경하지 않았습니다.`);}
    }catch(e){feedback.textContent=e.message;}
  }
  async function downloadUpdate(){const b=$('downloadManualUpdate');b.disabled=true;try{const mapping={'automation/collector.py':'automation/collector.py','automation/test_collector.py':'automation/test_collector.py','automation/rwa-monitor.yml':'.github/workflows/rwa-monitor.yml','automation/MANUAL.md':'automation/MANUAL.md'};const files={};for(const [source,dest] of Object.entries(mapping)){const r=await fetch(source,{credentials:'same-origin',cache:'no-store'});if(!r.ok)throw Error(source+' HTTP '+r.status);files[dest]=new Uint8Array(await r.arrayBuffer());}download(fflate.zipSync(files,{level:6}),'rwa-radar-manual-v3-update.zip','application/zip');toast('수집기·워크플로 업데이트 ZIP을 받았습니다. automation/MANUAL.md를 따라 주세요.');}catch(e){toast('업데이트 파일 생성 실패: '+e.message);}finally{b.disabled=false;}}
  $('openManualRun').onclick=()=>openRun();
  $('targetResearchForm').onsubmit=ev=>{ev.preventDefault();try{if(!$('targetPublicConsent').checked)throw Error('공개 범위 확인이 필요합니다.');openRun(requestUrl($('targetResearchUrl').value));}catch(e){$('manualResearchStatus').textContent=e.message;}};
  $('refreshManualResults').onclick=()=>loadMonitor(true);
  $('showManualFindings').onclick=()=>{showMonitorTab('findings');$('findingFilter').value='manual';$('findingSearch').value='';findingLimit=30;renderFindings();$('findingsList').scrollIntoView({block:'start',behavior:'smooth'});};
  $('speakerImportForm').onsubmit=saveImport;
  $('downloadManualUpdate').onclick=downloadUpdate;
  document.addEventListener('change',ev=>{if(ev.target.id==='importEventTarget')toggleEvent();});
  document.addEventListener('click',async ev=>{const b=ev.target.closest('button');if(!b)return;if(b.dataset.importSpeakers)openImport(b.dataset.importSpeakers);if(b.id==='readAfterManual'){await loadMonitor(true);renderStatus();}if(b.id==='copyTargetUrl'){try{await navigator.clipboard.writeText(target);toast('주소를 복사했습니다. GitHub target_url 칸에 붙여넣으세요.');}catch{$('preparedTargetUrl').select();toast('자동 복사가 제한되었습니다. 선택된 주소를 직접 복사해 주세요.');}}});
  return {requestUrl,openRun,openImport,renderStatus,downloadUpdate};
})();
