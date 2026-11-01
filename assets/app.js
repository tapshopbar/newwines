(function(){
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const T = window.TSB, L = window.LADDER, W = window.WINES;
const TYPE_KO = { red:'레드', white:'화이트', sparkling:'스파클링' };
const src = new URLSearchParams(location.search).get('src') || '';
const theme = new URLSearchParams(location.search).get('theme') || T.theme || 'dark';
if (theme === 'light') document.body.classList.add('light');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function log(k){ if (/^(127\.0\.0\.1|localhost)$/.test(location.hostname)) return; try{ const q = new URLSearchParams({a:'log', k, g:'', b:T.branch, d:'', t:'', r:('nw:'+(window.WINE_ID||'hub')+':'+(src||document.referrer)).slice(0,80)}); new Image().src = T.log+'?'+q; }catch(e){} }
document.addEventListener('click', e => { const a = e.target.closest('[data-log]'); if (a) log(a.dataset.log); });


/* 12 사다리 그림 (SVG) = chacha 12 WINES 표. 문구는 원본 그대로. hl = 'red/dry/full/bouquet' 같은 경로, on = 강조할 번호 */
const TREE = (() => {
  const XS = [32, 90, 148, 206, 264, 322];
  const leaves = [
    ['red/sweet/full',1,0,0],['red/sweet/light',2,1,0],['red/dry/full/aroma',3,2,0],['red/dry/full/bouquet',4,3,0],['red/dry/light/floral',5,4,0],['red/dry/light/savory',6,5,0],
    ['white/sweet/full',7,0,1],['white/sweet/light',8,1,1],['white/dry/full',9,2,1],['white/dry/light',10,3,1],
    ['sparkling/sweet',11,4,1],['sparkling/dry',12,5,1]];
  const LBL = {
    sweet:{ko:['달콤'],en:['SWEET']}, dry:{ko:['안달콤'],en:['DRY']},
    full:{ko:['무거운'],en:['FULL-','BODIED']}, light:{ko:['가벼운'],en:['LIGHT-','BODIED']},
    'red/dry/full/aroma':{ko:['과일','꽃향기가','풍부한'],en:['AROMA']},
    'red/dry/full/bouquet':{ko:['과일향보다','오크숙성향이','두드러진'],en:['BOUQUET']},
    'red/dry/light/floral':{ko:['이끼물풀향','딸기향','꽃향'],en:['MOSSY, GRASSY','& FLORAL']},
    'red/dry/light/savory':{ko:['과일향보다','감칠맛','미네랄맛'],en:['SAVORY','& MINERAL']},
    'white/dry/full':{ko:['열대과일','바닐라','꿀, 너트'],en:['TROPICAL','& NUTTY'],desc:1},
    'white/dry/light':{ko:['자몽','레몬','허브, 꽃'],en:['CITRUS, HERBAL','& FLORAL'],desc:1}
  };
  const TOP = { red:['RED','레드'], white:['WHITE','화이트'], sparkling:['SPARK','LING','스파클링'] };
  const RH = 300, Y = { 0:30, 1:100, 2:150, 3:196 }, CY = 270;
  const X = {}, ROW = {};
  leaves.forEach(([k,,i,r]) => { X[k] = XS[i]; ROW[k] = r; });
  const nodes = {};
  leaves.forEach(([k]) => { const p = k.split('/'); for (let d = 1; d <= p.length; d++) { const id = p.slice(0,d).join('/'); (nodes[id] = nodes[id] || []).push(X[k]); } });
  const nx = id => { const a = nodes[id]; return (Math.min(...a) + Math.max(...a)) / 2; };
  return { leaves, LBL, TOP, RH, Y, CY, X, ROW, nodes, nx };
})();
function treeSvg(hl, on){
  const { leaves, LBL, TOP, RH, Y, CY, ROW, nodes, nx } = TREE;
  const pre = new Set(); if (hl) { const p = hl.split('/'); for (let d = 1; d <= p.length; d++) pre.add(p.slice(0,d).join('/')); }
  const onLeaf = leaves.find(l => l[1] === on); if (onLeaf) { const p = onLeaf[0].split('/'); for (let d = 1; d <= p.length; d++) pre.add(p.slice(0,d).join('/')); }
  const rowOf = id => ROW[leaves.find(l => l[0].startsWith(id))[0]] * RH;
  let lines = '', labs = '', lv = '';
  const bottom = {};
  const edge = (t, x1, y1, x2, y2, isOn) => { const m = y1 + (y2 - y1) * .5; const r = Math.min(8, Math.abs(x2 - x1) / 2, (y2 - y1) / 2);
    const dir = x2 > x1 ? 1 : -1;
    const d = Math.abs(x2 - x1) < 1 ? `M${x1} ${y1} V${y2}` : `M${x1} ${y1} V${m - r} Q${x1} ${m} ${x1 + dir*r} ${m} H${x2 - dir*r} Q${x2} ${m} ${x2} ${m + r} V${y2}`;
    lines += `<path class="ln ${t}${isOn?' on':''}" d="${d}"/>`; };
  const label = (id, x, y, t, isOn, force) => {
    const last = id.split('/').pop(), L = force || LBL[id] || LBL[last]; const big = L.ko.length === 1;
    let h = '', yy = y;
    L.ko.forEach(s => { h += `<text class="ko${big?'':' sm'}" x="${x}" y="${yy}">${s}</text>`; yy += big ? 12 : 11.5; });
    yy += big ? 0 : 1.5;
    L.en.forEach(s => { h += `<text class="en" x="${x}" y="${yy}">${s}</text>`; yy += 7.5; });
    labs += `<g class="lab ${t}${isOn?' on':''}">${h}</g>`;
    bottom[id] = yy - 3;
  };
  ['red','white','sparkling'].forEach(t => {
    const oy = rowOf(t), x = nx(t), isOn = pre.has(t), T = TOP[t];
    const txt = T.length === 3 ? `<text x="${x}" y="${oy+Y[0]-4}">${T[0]}</text><text x="${x}" y="${oy+Y[0]+8}">${T[1]}</text>` : `<text x="${x}" y="${oy+Y[0]+2}">${T[0]}</text>`;
    labs += `<g class="topc ${t}${isOn?' on':''}"><circle cx="${x}" cy="${oy+Y[0]}" r="23"/>${txt}</g><text class="topko ${t}${isOn?' on':''}" x="${x}" y="${oy+Y[0]+40}">${T[T.length-1]}</text>`;
    bottom[t] = oy + Y[0] + 46;
  });
  Object.keys(nodes).sort((a,b) => a.split('/').length - b.split('/').length).forEach(id => {
    const p = id.split('/'), d = p.length - 1; if (d === 0) return;
    const t = p[0], oy = rowOf(t), x = nx(id), par = p.slice(0,-1).join('/');
    const y = oy + Y[d];
    edge(t, nx(par), bottom[par] + 3, x, y - 13, pre.has(id));
    if (LBL[id] && LBL[id].desc) { label(id, x, y, t, pre.has(id), LBL[p[d]]); const b = bottom[id], y3 = oy + Y[3];
      lines += `<path class="ln ${t}${pre.has(id)?' on':''}" d="M${x} ${b + 4} V${y3 - 13}"/>`; label(id, x, y3, t, pre.has(id), LBL[id]); }
    else label(id, x, y, t, pre.has(id));
  });
  leaves.forEach(([k, no]) => {
    const t = k.split('/')[0], oy = rowOf(t), x = nx(k), isOn = pre.has(k) || on === no;
    lines += `<path class="ln ${t}${isOn?' on':''}" d="M${x} ${bottom[k] + 4} V${oy + CY - 17}"/>`;
    lv += `<g class="leaf ${t}${on===no?' on':''}" data-no="${no}"><circle cx="${x}" cy="${oy+CY}" r="15"/><text x="${x}" y="${oy+CY}">${no}</text></g>`;
  });
  return `<svg class="tree" viewBox="0 0 354 ${RH*2-6}" role="img" aria-label="12 사다리">${lines}${labs}${lv}</svg>`;
}
const CHACHA = `<div class="chhead"><div class="chb"><i></i>chacha<i></i></div><div class="chw">12 WINES<sup>(R)</sup></div><p>차차 12 와인 사다리타기는 와인을 크게 12가지 카테고리로 나눠서 <br>입맛과 취향에 맞춰 와인을 쉽게 고를 수 있도록 만들었습니다. <br>자신의 기호에 맞는 와인을 골라보세요.</p><small>Copyright © 2014 chacha. all right reserved.</small></div>`;
const board = (hl, on, head, cls) => `<div class="ladboard${cls?' '+cls:''}">${head?CHACHA:''}${treeSvg(hl, on)}</div>`;
const pathOf = no => (TREE.leaves.find(l => l[1] === no) || [''])[0];

const flag = (w) => `<span class="flag"><i><b></b><b></b><b></b></i>${esc(w.country.toUpperCase())} · ${esc(w.region.toUpperCase())}</span>`;
const tagHtml = (t, link) => link ? `<a class="tag" href="../?tag=${t}">#${t}</a>` : `<span class="tag">#${t}</span>`;

function ladderHtml(no){
  const groups = [['RED','red'],['WHITE','white'],['SPARKLING','sparkling']];
  let h = '';
  for (const [g, t] of groups){
    h += `<div class="grp">${g}</div>`;
    L.filter(x => x.type === t).forEach(x => { h += `<button class="cell ${t}${x.no===no?' on':''}" data-no="${x.no}">${x.no}</button>`; });
  }
  return h;
}
function bindLadder(no){
  const tip = $('#ladtip');
  const show = n => { const x = L.find(y => y.no === n); tip.innerHTML = `<b>${n}번</b> · ${x.ko} <span class="muted" style="color:#7a7378">(${x.en})</span><br>${x.ex}${n===no?' ← <b>이 와인</b>':''}`; };
  $$('.tree .leaf').forEach(c => c.addEventListener('click', () => { $$('.tree .leaf').forEach(z => z.classList.remove('pick')); c.classList.add('pick'); show(+c.dataset.no); }));
}

function videoHtml(keys){
  return keys.map(k => { const v = window.VIDEOS[k]; return `<div class="vid" data-k="${k}"><video playsinline preload="none" poster="${v.poster}" src="${v.src}"></video><button class="play" aria-label="재생"><i></i></button><span class="cap">${esc(v.t)}</span></div>`; }).join('');
}
function bindVideos(){
  $$('.vid').forEach(box => {
    const v = box.querySelector('video');
    box.querySelector('.play').addEventListener('click', () => { $$('.vid video').forEach(o => { if (o !== v) { o.pause(); } }); v.controls = true; v.play(); box.classList.add('playing'); log('nw-video-'+box.dataset.k); });
    v.addEventListener('ended', () => { box.classList.remove('playing'); v.controls = false; });
  });
}

function quiz(w){
  const box = $('#quiz'); let i = 0, score = 0;
  const draw = () => {
    if (i >= w.quiz.length){
      const msg = score === 3 ? '와인 박사 인정. 직원한테 자랑해도 돼요.' : score === 2 ? '거의 다 왔어요. 매장에서 라벨 한 번 더 보면 끝.' : '괜찮아요. 번호만 기억하면 돼요.';
      box.innerHTML = `<div class="qres"><b>${score} / ${w.quiz.length}</b><p>${msg}</p><button class="again" id="qre">다시 풀기</button></div>`;
      $('#qre').onclick = () => { i = 0; score = 0; draw(); }; log('nw-quiz-'+score); return;
    }
    const q = w.quiz[i];
    box.innerHTML = `<div class="qprog">${w.quiz.map((_,j)=>`<i class="${j<=i?'on':''}"></i>`).join('')}</div>
      <div class="qq">Q${i+1}. ${esc(q.q)}</div>
      <div class="qa">${q.a.map((a,j)=>`<button data-j="${j}">${esc(a)}</button>`).join('')}</div>
      <div class="qwhy"></div><button class="qnext">${i+1<w.quiz.length?'다음 문제':'결과 보기'}</button>`;
    $$('#quiz .qa button').forEach(b => b.onclick = () => {
      if (box.dataset.lock === '1') return; box.dataset.lock = '1';
      const j = +b.dataset.j; if (j === q.c) score++;
      $$('#quiz .qa button').forEach(x => { const k = +x.dataset.j; if (k === q.c) x.classList.add('ok'); else if (k === j) x.classList.add('no'); });
      box.querySelector('.qwhy').textContent = (j === q.c ? '정답! ' : '아쉽! ') + q.why;
      const n = box.querySelector('.qnext'); n.style.display = 'block'; n.onclick = () => { box.dataset.lock = '0'; i++; draw(); };
    });
  };
  draw();
}

function ctaHtml(w){
  return `<section class="sec cta" id="book"><div class="k">RESERVE</div>
    <h2>${esc(w ? w.short : '새 와인')}, 오늘 저녁<br>청계에서 만나요</h2>
    <p class="muted" style="margin:-6px 0 22px">청계 매대에 몇 병 없어요. 오늘 자리부터.</p>
    <a class="btn" href="${T.naver}" target="_blank" rel="noopener" data-log="nw-naver">예약하러 가기 →</a>
    <div class="ctarow"><a class="btn2" href="tel:${T.tel.replace(/-/g,'')}" data-log="nw-tel">전화하기</a><a class="btn2" href="${T.map}" target="_blank" rel="noopener" data-log="nw-map">길찾기</a></div>
    <a class="btn2" style="margin-top:8px" href="${T.reservation}" target="_blank" rel="noopener" data-log="nw-resv">13명 이상·다른 지점 예약</a>
    <div class="addr">${esc(T.branchFull)}<br>${esc(T.address)}</div></section>`;
}
const footer = () => `<footer><img src="../assets/wordmark.png" alt="TAP SHOP BAR"><div class="slogan">wine is second americano</div>
  <div class="warn">경고: 지나친 음주는 뇌졸중, 기억력 손상이나 치매를 유발합니다.<br>임신 중 음주는 기형아 출생 위험을 높입니다.<br>음주운전은 자신과 다른 사람의 생명을 위태롭게 할 수 있습니다.</div></footer>`;
const sticky = () => `<div class="sticky" id="sticky"><a class="btn" href="${T.naver}" target="_blank" rel="noopener" data-log="nw-naver-sticky">예약하러 가기 →</a></div>`;

function wirePage(){
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); e.target.querySelectorAll('.bar .t b').forEach(b => b.style.width = b.dataset.w); io.unobserve(e.target); } }), {threshold:.15});
  $$('.reveal').forEach(el => io.observe(el));
  const st = $('#sticky'), book = $('#book');
  const onScroll = () => { const r = book.getBoundingClientRect(); st.classList.toggle('show', scrollY > 420 && r.top > innerHeight); };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();
  const sh = $('#share'); if (sh) sh.onclick = async () => { const d = {title:document.title, url:location.href.split('?')[0]}; try{ if (navigator.share) await navigator.share(d); else { await navigator.clipboard.writeText(d.url); sh.textContent='링크 복사됨'; } log('nw-share'); }catch(e){} };
}


const HOME = 'https://tsb.wine/';
const header = (isHub) => `<header class="top"><button class="back" id="goBack">← 뒤로</button><a href="${HOME}" aria-label="탭샵바 홈페이지"><img src="${isHub?'':'../'}assets/wordmark.png" alt="TAP SHOP BAR"></a><a class="back" href="${HOME}">홈페이지</a></header>`;
const navFoot = (isHub) => `<nav class="navfoot">${isHub?'':`<a class="btn2" href="../" data-log="nw-nav-hub">← 새 와인 전체 보기</a>`}<a class="btn2" href="${HOME}" data-log="nw-nav-home">탭샵바 홈페이지 →</a><button class="btn2" id="share">이 페이지 공유하기</button></nav>`;
function bindBack(isHub){
  const b = document.getElementById('goBack'); if (!b) return;
  b.onclick = () => {
    let same = false; try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch(e){}
    if (same && history.length > 1) history.back(); else location.href = isHub ? HOME : '../';
  };
}

/* ========== 와인 상세 ========== */
function renderWine(id){
  const w = W.find(x => x.id === id); const lad = L.find(x => x.no === w.ladder);
  const app = $('#app');
  app.innerHTML = `
  ${header(false)}
  <section class="hero ${w.type}">
    <div class="meta"><span class="badge">NEW IN</span>${flag(w)}</div>
    <h1>${esc(w.nameKo)}</h1><div class="en">${esc(w.nameEn)} ${w.vintage}</div>
    <div class="hook">${esc(w.hook)}</div>
    <img class="bottle" src="${w.img}" alt="${esc(w.nameKo)} 병">
    <div class="tags">${w.tags.map(t => tagHtml(t, true)).join('')}</div>
    <div class="facts"><div><b>No.${w.ladder}</b><span>12 사다리</span></div><div><b>${esc(TYPE_KO[w.type])} · ${esc(w.abv)}</b><span>${esc(w.grapes)}</span></div><div><b>${w.vintage}</b><span>${esc(w.subKo)}</span></div></div>
    ${w.price ? `<a class="price" href="#price">탭샵바 보틀 <b>${w.price.toLocaleString()}원</b> <span>와인숍보다 싸요 ↓</span></a>` : ''}
  </section>

  <section class="sec tight reveal sum"><div class="ol">${w.oneLine.map((t,i)=>`<div><i>${i+1}</i><span>${esc(t)}</span></div>`).join('')}</div></section>

  <section class="sec reveal"><div class="k">12 LADDER</div><h2>와인 이름 몰라도 괜찮아요.<br>번호 하나만 기억하세요</h2>
    <p class="ladintro"><b>12 사다리</b>는 와인을 맛에 따라 1번부터 12번까지 나눈 지도예요. 색, 단맛, 무게, 향 순서로 사다리 타듯 내려가면 내 번호가 나와요.</p>
    <div class="ladcard"><div class="ladhead"><div class="ladno"><small>이 와인은</small>${w.ladder}</div><div class="what"><b>${esc(lad.ko)}</b><span>${esc(lad.en)}</span></div></div>
    ${board(pathOf(w.ladder), w.ladder, true, 'detail')}${w.ladderWhy?`<div class="why"><div class="whyh">왜 ${w.ladder}번이냐면</div>${w.ladderWhy.map((x,i)=>`<div><i>${i+1}</i><span>${x}</span></div>`).join('')}</div>`:''}<div class="ladtip" id="ladtip"></div>
    <div class="ladsrc">다른 번호를 눌러 보세요.</div></div>
    <p class="muted s" style="margin-top:14px">${w.ladder}번이 좋았다면, 다음엔 "${w.ladder}번 와인 다른 거요" 라고만 말해 주세요.</p>
  </section>

  ${priceHtml(w)}

  <section class="sec reveal"><h2>맛 지도</h2>
    <div class="bars">${Object.entries(w.taste).map(([k,v])=>`<div class="bar"><span>${k}</span><div class="t"><b data-w="${v/5*100}%"></b></div></div>`).join('')}</div>
    <div class="notes">${w.notes.map(n=>`<span>${esc(n)}</span>`).join('')}</div>
    <div class="serve">${esc(w.serve)} · ${esc(w.grapes)}</div>
    <h3 class="sub">뭐랑 마셔요?</h3>
    <div class="pair">${w.pair.map(p=>`<div><b>${esc(p.k)}</b><span>${esc(p.d)}</span></div>`).join('')}</div>
  </section>

  <section class="sec reveal"><h2>영상으로 보기</h2><div class="vids">${videoHtml(w.videos)}</div></section>

  ${franceHtml(w)}

  <section class="sec reveal fold"><details><summary><span>${esc(w.short)} 이야기<small>${esc(w.story[0].y)}년부터 지금까지, ${w.story.length}장면</small></span></summary>
    <div class="fbody"><div class="tl">${w.story.map(s=>`<div class="it"><div class="y">${esc(s.y)}</div><div class="t">${esc(s.t)}</div><div class="d">${esc(s.d)}</div></div>`).join('')}</div></div></details>
  </section>

  <section class="sec reveal fold"><details><summary><span>3문제, 와인 박사 테스트<small>눌러서 풀어 보기</small></span></summary><div class="fbody"><div class="quiz" id="quiz"></div></div></details></section>

  <section class="sec reveal faq"><h2>자주 묻는 질문</h2>
    ${w.faq.map(f=>`<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
  </section>

  ${ctaHtml(w)}
  ${navFoot(false)}
  ${footer()}${sticky()}`;
  bindLadder(w.ladder); bindVideos(); quiz(w); wirePage(); bindBack(false);
}


function priceHtml(w){
  if (!w.price || !w.shop) return '';
  const k = w.shop.krw, diff = k - w.price, pct = Math.round(diff / k * 100);
  return `<section class="sec reveal" id="price"><div class="k">PRICE</div><h2>집에 사 가는 값보다 싸요.<br>잔은 우리가 닦아요.</h2>
    <div class="pcard">
      <div class="prow"><div class="pl"><b>국내 와인숍</b><span>온라인 판매가 · ${esc(w.shop.note)}</span></div><div class="pv"><b class="strike">${k.toLocaleString()}원</b></div></div>
      <div class="pbar"><b style="--w:100%"></b></div>
      <div class="prow tsb"><div class="pl"><b>탭샵바 청계</b><span>매장 보틀 가격 · 부가세 포함</span></div><div class="pv"><b>${w.price.toLocaleString()}원</b></div></div>
      <div class="pbar tsb"><b style="--w:${w.price/k*100}%"></b></div>
      <div class="save">${diff.toLocaleString()}원 더 싸요 <span>${pct}%↓</span></div>
    </div>
    <p class="pnote">온라인에서 사면 ${k.toLocaleString()}원. 청계 테이블에서 열면 ${w.price.toLocaleString()}원. 배송도, 설거지도 없어요.</p>
    <p class="psrc">국내 온라인 와인숍 판매가 ${esc(T.shopDate)} 확인 기준 · 판매처·시점에 따라 달라질 수 있어요</p>
  </section>`;
}

function franceHtml(w){
  const F = window.FRANCE;
  const line = w.id === 'pomeys'
    ? '포메이는 등급을 잃고도 <em>소송으로 이름을 지켜낸</em> 집이에요.'
    : '샤니에 가문은 <em>270년 넘게</em> 포도밭을 지켜온 집이에요.';
  return `<section class="sec fr reveal"><div class="k">WHY FRANCE, WHY NOW</div><h2>올해 프랑스,<br>와인이 귀해졌어요</h2>
    <div class="frf">${F.facts.map(f=>`<a href="${f.src}" target="_blank" rel="noopener"><span class="n">${esc(f.n)}</span><span class="t">${esc(f.t)}</span><span class="d">${esc(f.d)} ↗</span></a>`).join('')}</div>
    <div class="frq">덥고, 안 팔리고, 포도밭이 사라지는 중.<br>그래서 지금 잔에 오는 프랑스 와인은<br><em>버텨낸 집</em>의 와인이에요.<br><span class="frs">포도밭은 줄고, 수확은 적어요. 지금 매대에 있는 병이 다예요.</span></div>
    <p class="muted" style="margin-top:12px">${line}</p>
    <div class="hash">#버틴와인 #지금프랑스 #france</div></section>`;
}

/* ========== 허브 (/newwines/) ========== */
function renderHub(){
  const app = $('#app');
  const allTags = ['all','red','white','sparkling','france'];
  const cur = new URLSearchParams(location.search).get('tag') || 'all';
  if (!allTags.includes(cur)) allTags.push(cur);
  app.innerHTML = `
  ${header(true)}
  <section class="hubtop">
    <span class="badge">NEW IN · 탭샵바 청계</span>
    <h1>새 와인이<br>들어왔어요</h1>
    <p class="muted">프랑스가 1957년 이후 가장 적게 만든 해, 버텨낸 두 집의 와인이에요.<br>와인숍보다 싸게, 청계에서 바로. 사진을 눌러 보세요.</p>
  </section>
  <div class="filter">${allTags.map(t=>`<button class="tag${t===cur?' on':''}" data-t="${t}">#${t}</button>`).join('')}</div>
  <div class="duo" id="duo">${W.map(w=>`<a class="tile ${w.type}" data-tags="${w.tags.join(' ')} ${w.type}" href="${w.id}/" data-log="nw-tile-${w.id}">
      <span class="tno">No.${w.ladder}</span>
      <img src="${w.img.replace('../','')}" alt="${esc(w.nameKo)}">
      <span class="tflag"><i><b></b><b></b><b></b></i>${esc(w.regionKo)}</span>
      <span class="tnm">${esc(w.short)}</span>
      <span class="tsub">${esc(TYPE_KO[w.type])} · ${w.vintage}</span>${w.price?`<span class="tpr">${w.shop?`<s>${w.shop.krw.toLocaleString()}원</s> `:''}<b>${w.price.toLocaleString()}원</b></span>`:''}
      <span class="tgo">보러 가기 →</span></a>`).join('')}</div>
  <div class="empty" id="empty">이 태그의 새 와인은 아직 없어요. 곧 들어와요.</div>

  <section class="sec reveal" style="margin-top:34px"><div class="k">FIND YOUR NUMBER</div><h2>내 와인 번호 찾기</h2><p class="ladintro"><b>12 사다리</b>는 와인을 맛에 따라 1~12번으로 나눈 지도예요. 질문 2~4개만 고르면 내 번호가 나와요. 와인 이름 몰라도, 번호만 말하면 돼요.</p>
    <div class="finder" id="finder"></div></section>

  ${ctaHtml(null)}
  ${navFoot(true)}
  ${footer().replace(/\.\.\/assets/g,'assets')}${sticky()}`;
  $$('.filter .tag').forEach(b => b.onclick = () => { $$('.filter .tag').forEach(x=>x.classList.toggle('on', x===b)); filter(b.dataset.t); history.replaceState(null,'', b.dataset.t==='all'?location.pathname:'?tag='+b.dataset.t); });
  filter(cur); finder(); wirePage(); bindBack(true);
}
function filter(t){ let n = 0; $$('.tile').forEach(c => { const ok = t==='all' || c.dataset.tags.split(' ').includes(t); c.classList.toggle('hide', !ok); if (ok) n++; }); $('#empty').style.display = n ? 'none' : 'block'; }

function finder(){
  const box = $('#finder'); let path = [];
  const steps = {
    type:  { q:'오늘은 어떤 색?', o:[['red','레드'],['white','화이트'],['sparkling','스파클링','버블']] },
    sweet: { q:'단맛은?', o:[['sweet','달콤','SWEET'],['dry','안달콤','DRY']] },
    body:  { q:'무게감은?', o:[['full','무거운','FULL-BODIED'],['light','가벼운','LIGHT-BODIED']] },
    rfull: { q:'어떤 향이 끌려요?', o:[['aroma','과일 꽃향기가 풍부한','AROMA'],['bouquet','과일향보다 오크숙성향이 두드러진','BOUQUET']] },
    rlight:{ q:'어떤 향이 끌려요?', o:[['floral','이끼물풀향 딸기향 꽃향','MOSSY, GRASSY & FLORAL'],['savory','과일향보다 감칠맛 미네랄맛','SAVORY & MINERAL']] },
  };
  const resolve = p => {
    const [t,s,b,a] = p;
    if (t==='sparkling') return s ? (s==='sweet'?11:12) : null;
    if (t==='white'){ if(!s||!b) return null; return s==='sweet' ? (b==='full'?7:8) : (b==='full'?9:10); }
    if (t==='red'){ if(!s||!b) return null; if (s==='sweet') return b==='full'?1:2; if(!a) return null; return b==='full' ? (a==='aroma'?3:4) : (a==='floral'?5:6); }
  };
  const next = p => { if (!p.length) return 'type'; const [t,s,b] = p; if (p.length===1) return 'sweet'; if (t==='sparkling') return null; if (p.length===2) return 'body'; if (t==='red' && s==='dry' && p.length===3) return b==='full'?'rfull':'rlight'; return null; };
  const draw = () => {
    const no = resolve(path), st = next(path);
    const rung = board(path.join('/'), no || 0, !path.length || (no && !next(path)));
    if (no && !st){
      const x = L.find(y=>y.no===no), m = W.filter(w=>w.ladder===no);
      box.innerHTML = `<div class="fres"><div class="fstep">YOUR NUMBER</div>${rung}<div class="big">${no}</div><div class="lab">${x.ko}</div><div class="ex">${x.ex}</div>
        <div class="match">${m.length ? `이번에 들어온 새 와인 중 딱 ${no}번이 있어요!${m.map(w=>`<a href="${w.id}/" data-log="nw-finder-${w.id}">${esc(w.nameKo)} 보러 가기 →</a>`).join('')}` : `이번 새 와인은 ${W.map(w=>w.ladder+'번').join('·')}이에요. ${no}번은 매장 탭 와인 64가지 중에 있어요. "<b>${no}번 주세요</b>" 하면 돼요.<a href="#duo">새 와인 두 병 보러 가기 →</a>`}</div>
        <button class="again" id="fre">다시 하기</button></div>`;
      $('#fre').onclick = () => { path = []; draw(); }; log('nw-finder-'+no); return;
    }
    const S = steps[st];
    box.innerHTML = `<div class="fpath">${path.map(v=>`<span>${({red:'레드',white:'화이트',sparkling:'스파클링',sweet:'달콤',dry:'안달콤',full:'무거운',light:'가벼운',aroma:'AROMA',bouquet:'BOUQUET',floral:'FLORAL',savory:'SAVORY'})[v]}</span>`).join('')}</div>
      <div class="fstep">STEP ${path.length+1}</div><div class="fq">${S.q}</div>
      <div class="fopts${S.o.length===3?' three':''}">${S.o.map(([v,l,s])=>`<button data-v="${v}">${l}${s?`<small>${s}</small>`:''}</button>`).join('')}</div>${rung}
      ${path.length?'<button class="again" id="fback">← 뒤로</button>':''}`;
    $$('#finder .fopts button').forEach(b => b.onclick = () => { path.push(b.dataset.v); draw(); });
    const fb = $('#fback'); if (fb) fb.onclick = () => { path.pop(); draw(); };
  };
  draw();
}

if (window.WINE_ID) renderWine(window.WINE_ID); else renderHub();
})();
