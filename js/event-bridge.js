'use strict';
// Read-only projection: no storage writes, no automatic promotion to personal records.
window.RadarEventBridge=(()=>{
  let feed=null;
  const singleBrands=new Set(['teamz','money2020','asian-banker','finsum','digital-assets-asia','hk-web3','toknomy','btcon','koscom','capital-tokyo','onchain-finance-jp','edaily-vaf','liquidity','ccxap','cryptofi','onchain','bot-rwa','beyond']);
  const countryMap={JP:'일본',Japan:'일본',HK:'홍콩','Hong Kong':'홍콩',KR:'한국',Korea:'한국',SG:'싱가포르',Singapore:'싱가포르',CN:'중국',China:'중국',TW:'대만',Taiwan:'대만',TH:'태국',Thailand:'태국',VN:'베트남',Vietnam:'베트남',MY:'말레이시아',Malaysia:'말레이시아',PH:'필리핀',Philippines:'필리핀',ID:'인도네시아',Indonesia:'인도네시아'};
  const normalized=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
  function canonicalUrl(value){try{const u=new URL(value);u.hash='';u.search='';return u.origin+u.pathname.replace(/\/+$/,'');}catch{return '';}}
  function yearOf(item){const explicit=item.event_date?.slice(0,4)||(String(item.title||'').match(/\b20\d{2}\b/)||[])[0];if(explicit)return explicit;const mentions=[...new Set(String(item.summary||'').match(/\b20\d{2}\b/g)||[])];return mentions.length===1?mentions[0]:'미확인';}
  function groupKey(item){const y=yearOf(item);if(singleBrands.has(item.watch_id))return `${item.watch_id}:${y}`;return `${item.watch_id||'discovery'}:${y}:${canonicalUrl(item.url)}`;}
  function score(item){let s=item.source_kind==='official_structured'?10:0;if(item.event_date)s+=5;if(countryMap[item.region]||['한국','일본','홍콩','대만','중국','싱가포르'].includes(item.region))s+=3;if(/summit|forum|conference|festival|money20|포럼|서밋|콘퍼런스/i.test(item.title))s+=5;if(/exhibition|rental|stage|dinner|gala|\bday\s*\d/i.test(item.title))s-=20;return s;}
  function isDismissed(item,reviews){return reviews?.[`${item.id}:${item.revision}`]?.status==='dismissed';}
  function candidateRows(personal=[],reviews={},isDemo=false){
    if(isDemo||!feed)return [];
    const groups=new Map();
    for(const item of feed.items){if(isDismissed(item,reviews))continue;const key=groupKey(item);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item);}
    const rows=[];
    for(const [key,items] of groups){
      items.sort((a,b)=>score(b)-score(a)||a.id.localeCompare(b.id));const lead=items[0];
      const dated=items.filter(i=>i.event_date);const dates=[...new Set(dated.map(i=>i.event_date))];
      // Keep the representative's explicit date, not historical dates or RSS publication times.
      const date=lead.event_date||'';const year=yearOf(lead);const region=countryMap[lead.region]||(['한국','일본','홍콩','대만','중국','싱가포르'].includes(lead.region)?lead.region:'');
      const linked=personal.filter(e=>items.some(i=>e.originFindingId===i.id||(canonicalUrl(e.url)===canonicalUrl(i.url)&&e.date===(i.event_date||'')&&normalized(e.name)===normalized(i.title))));
      const reviewed=items.every(i=>!i.review_required||reviews?.[`${i.id}:${i.revision}`]?.status==='reviewed');
      rows.push({id:'auto:'+key,name:(singleBrands.has(lead.watch_id)?lead.watch_name:lead.title)+(year==='미확인'?' · 연도 미확인':` · ${year}`),date,endDate:lead.end_date||'',region,city:'',organizer:'',topic:'금융 연관성 검수 필요',status:'자동 후보',checked:String(lead.last_seen_at||lead.observed_at||'').slice(0,10),url:lead.url,notes:'자동 수집 근거를 묶은 후보입니다. 독립 행사 수가 아니며 원본은 자동 조사 센터에 유지됩니다.',_auto:true,_groupKey:key,_year:year,_items:items,_lead:lead,_regions:[...new Set(items.map(i=>countryMap[i.region]||i.region).filter(r=>r&&r!=='현행 개최지 미확인'))],_dateConflict:dates.length>1,_linked:linked,_reviewed:reviewed,_urls:[...new Set(items.map(i=>i.url))]});
    }
    return rows.sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')||a.name.localeCompare(b.name));
  }
  function projection(personal=[],reviews={},isDemo=false){const groups=candidateRows(personal,reviews,isDemo);return {manual:personal,groups,unlinked:groups.filter(g=>!g._linked.length),rawCount:isDemo?0:(feed?.items.length||0),feedAvailable:!!feed};}
  return {setFeed(value){feed=value;},projection,canonicalUrl,groupKey,yearOf};
})();
