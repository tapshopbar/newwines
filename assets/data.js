/* 탭샵바 NEW IN 와인 데이터
   새 와인이 들어오면 WINES 에 한 덩어리만 추가하고, 같은 모양의 폴더(예: /newwines/새슬러그/index.html)를 복사하면 끝.
   price 를 숫자로 넣으면 가격이 보이고, null 이면 숨김. */

window.TSB = {
  theme: 'light', // 'dark' 로 바꾸면 와인색 바탕 버전
  branch: '청계',
  branchFull: '탭샵바 청계 (삼일빌딩점)',
  address: '서울 종로구 청계천로 85 삼일빌딩 지하1층',
  tel: '0507-1331-4095',
  naver: 'https://m.booking.naver.com/booking/6/bizes/1180715/items/6096170',
  map: 'https://map.naver.com/p/search/%ED%83%AD%EC%83%B5%EB%B0%94%20%EC%B2%AD%EA%B3%84',
  reservation: 'https://tapshopbar.github.io/reservation/', // tsb.wine/reservation 연결되면 교체
  log: 'https://script.google.com/macros/s/AKfycbymH-sSHwMhwbDAPR03wYfIvW25j-ZTxm2i66geBy09zZDuiUPz2fqN6rx_JMKzL1l1lA/exec'
};

/* 나기정 대표님 12 사다리 (Drive: "와인 리스트 12가지 분류 및 추천") */
window.LADDER = [
  { no: 1,  type: 'red',       en: 'Sweet / Full-bodied',  ko: '달콤 · 묵직',            ex: '포트 와인처럼 진하고 달콤' },
  { no: 2,  type: 'red',       en: 'Sweet / Light-bodied', ko: '달콤 · 가벼운',           ex: '브라케토처럼 산뜻하게 달콤' },
  { no: 3,  type: 'red',       en: 'Dry / Full / Aroma',   ko: '드라이 · 묵직 · 과일향',   ex: '말벡·쉬라즈처럼 잘 익은 과일' },
  { no: 4,  type: 'red',       en: 'Dry / Full / Bouquet', ko: '드라이 · 묵직 · 숙성향',   ex: '카베르네 블렌드처럼 오크·삼나무·가죽' },
  { no: 5,  type: 'red',       en: 'Dry / Light / Floral', ko: '드라이 · 가벼운 · 꽃향',   ex: '피노·가메처럼 붉은 꽃과 체리' },
  { no: 6,  type: 'red',       en: 'Dry / Light / Savory', ko: '드라이 · 가벼운 · 짭짤',   ex: '카르메네르처럼 허브·후추' },
  { no: 7,  type: 'white',     en: 'Sweet / Full-bodied',  ko: '달콤 · 묵직',            ex: '모스카토처럼 꿀·살구' },
  { no: 8,  type: 'white',     en: 'Sweet / Light-bodied', ko: '달콤 · 가벼운',           ex: '리슬링처럼 사과·복숭아' },
  { no: 9,  type: 'white',     en: 'Dry / Full / Tropical',ko: '드라이 · 묵직 · 열대과일', ex: '버터리 샤르도네처럼 파인애플·버터' },
  { no: 10, type: 'white',     en: 'Dry / Light / Citrus', ko: '드라이 · 가벼운 · 시트러스', ex: '소비뇽 블랑처럼 레몬·자몽' },
  { no: 11, type: 'sparkling', en: 'Sweet / Casual',       ko: '달콤 · 캐주얼',           ex: '모스카토 다스티처럼 달콤한 버블' },
  { no: 12, type: 'sparkling', en: 'Dry / Crisp',          ko: '드라이 · 쨍한',           ex: '브뤼·까바처럼 드라이한 버블' }
];

window.WINES = [
  {
    id: 'pomeys',
    type: 'red',
    nameKo: '샤또 포메이 크뤼 부르주아',
    nameEn: 'Château Pomeys Cru Bourgeois',
    short: '샤또 포메이',
    vintage: 2020,
    country: 'France', countryKo: '프랑스',
    region: 'Bordeaux', regionKo: '보르도',
    sub: 'Moulis-en-Médoc', subKo: '물리 앙 메독',
    grapes: '메를로 60% · 카베르네 소비뇽 40%',
    size: '750ml',
    price: null,
    ladder: 4,
    tags: ['red', 'france', 'bordeaux', 'crubourgeois', 'newin'],
    img: '../assets/pomeys.png',
    color: '#4A0B18',
    hook: '등급에서 빠지자, 소송까지 걸어서 이름을 되찾은 샤또',
    oneLine: [
      '1932년 첫 크뤼 부르주아 명단부터 이름을 올린 메독의 작은 샤또 (8ha)',
      '검은 과일, 크리미한 탄닌, 생기 있는 산미',
      '평론가 점수 90점대 (공급사 자료)'
    ],
    taste: { 바디: 4, 산미: 3, 탄닌: 3.5, 당도: 1 },
    notes: ['블랙커런트', '블랙체리', '삼나무', '은은한 오크', '초콜릿'],
    story: [
      { y: '1932', t: '첫 크뤼 부르주아 명단', d: '메독의 "부르주아급" 샤또를 처음 줄 세운 해. 포메이는 그때부터 명단에 있었어요.' },
      { y: '2020', t: '새 등급에서 빠짐', d: '2020년 새 등급표가 나오면서 포메이 이름이 빠졌어요.' },
      { y: '2022.05', t: '소송, 그리고 승소', d: '보르도 행정법원에 소송을 걸어 이겼고, 그해 8월 다시 명단에 올랐어요. 모토는 "Bourgeois et fier de l\'être" (부르주아이고, 그게 자랑스럽다).' },
      { y: 'NOW', t: '탭샵바 청계 매대에', d: '버텨서 지킨 이름, 그 2020 빈티지가 청계에 왔어요.' }
    ],
    pair: [
      { k: '스테이크·구운 고기', d: '탄닌이 고기 기름을 깔끔하게 잡아줘요' },
      { k: '하드 치즈', d: '콩테·고다처럼 고소한 치즈' },
      { k: '다크 초콜릿', d: '칼파제르 다크와 함께, 쌀쌀한 날 조합' }
    ],
    serve: '16~18℃ · 열고 20분 기다리면 더 부드러워요',
    videos: ['story', 'noir'],
    quiz: [
      { q: '"크뤼 부르주아"는 어느 지역 등급일까요?', a: ['부르고뉴', '메독 (보르도)', '샴페인'], c: 1, why: '보르도 왼쪽 강변, 메독 지역의 등급이에요.' },
      { q: '포메이가 등급을 되찾은 방법은?', a: ['이름을 바꿈', '소송에서 이김', '새 포도밭을 삼'], c: 1, why: '2022년 5월 보르도 행정법원에서 이겼어요.' },
      { q: '12 사다리에서 포메이는 몇 번?', a: ['3번 과일향', '4번 숙성향', '10번 시트러스'], c: 1, why: '드라이 · 묵직 · 숙성향 = 4번.' }
    ],
    faq: [
      { q: '크뤼 부르주아가 뭐예요?', a: '보르도 메독에서 1855년 그랑 크뤼 바로 아래, "실속 좋은 샤또"를 모은 등급이에요. 지금은 몇 년마다 다시 심사해서 들어가고 빠지기도 해요.' },
      { q: '무거운 레드 처음인데 괜찮을까요?', a: '메를로가 60%라 카베르네만 쓴 와인보다 둥글어요. 처음이면 고기·치즈랑 같이 드셔 보세요.' },
      { q: '어디서 만날 수 있어요?', a: '지금은 탭샵바 청계(삼일빌딩 B1) 매대에 있어요. 수량이 적어서 다 나가면 끝이에요.' }
    ]
  },
  {
    id: 'calcaires-blanc',
    type: 'white',
    nameKo: '레 칼케르 소비뇽 블랑',
    nameEn: 'Les Calcaires Sauvignon Blanc',
    short: '레 칼케르 소블',
    vintage: 2022,
    country: 'France', countryKo: '프랑스',
    region: 'Loire', regionKo: '루아르',
    sub: 'Touraine (Vin de France)', subKo: '투렌 · 뱅 드 프랑스',
    grapes: '소비뇽 블랑 100%',
    size: '750ml',
    price: null,
    ladder: 10,
    tags: ['white', 'france', 'loire', 'sauvignonblanc', 'newin'],
    img: '../assets/calcaires-sb.png',
    color: '#141B33',
    hook: '이름 뜻이 "석회암". 돌 맛이 나는 산뜻한 화이트',
    oneLine: [
      'Calcaires = 조개 화석이 가득한 석회암 땅',
      '설탕 절인 레몬, 자몽, 깔끔한 미네랄',
      '1749년까지 뿌리가 닿는 와인 집안, 피에르 샤니에'
    ],
    taste: { 바디: 2, 산미: 4.5, 탄닌: 0, 당도: 1 },
    notes: ['레몬', '자몽', '라임 껍질', '풋풀', '미네랄'],
    story: [
      { y: '1749', t: '보르도에서 시작', d: '샤니에 가문의 포도 농사 기록은 1749년 보르도까지 거슬러 올라가요.' },
      { y: '1973', t: '루아르로', d: '앙부아즈 성 아래 작은 저장고에서 피에르 샤니에 회사가 시작됐어요.' },
      { y: 'Calcaires', t: '석회암', d: '"레 칼케르"는 화석이 많은 석회암 땅을 뜻해요. 이 땅이 와인에 쨍한 산미와 미네랄을 줘요.' },
      { y: 'NOW', t: '탭샵바 청계 매대에', d: '투렌 포도로 만든 2022 빈티지가 청계에 왔어요.' }
    ],
    pair: [
      { k: '굴·해산물', d: '소비뇽 블랑 + 굴 = 교과서 조합' },
      { k: '염소 치즈·샐러드', d: '루아르 고향 조합, 산미끼리 잘 맞아요' },
      { k: '튀김·치킨', d: '산미가 기름기를 싹 정리해요' }
    ],
    serve: '8~10℃ · 차갑게, 열자마자 바로',
    videos: ['story', 'noir'],
    quiz: [
      { q: '"Les Calcaires"는 무슨 뜻일까요?', a: ['석회암', '달팽이', '햇살'], c: 0, why: '화석이 많은 석회암 땅이라는 뜻이에요.' },
      { q: '루아르 소비뇽 블랑과 가장 유명한 짝꿍은?', a: ['굴', '떡볶이', '마카롱'], c: 0, why: '산미와 미네랄이 굴의 바다 맛을 살려요.' },
      { q: '12 사다리에서 이 와인은 몇 번?', a: ['8번 달콤', '9번 열대과일', '10번 시트러스'], c: 2, why: '드라이 · 가벼운 · 시트러스 = 10번.' }
    ],
    faq: [
      { q: '뉴질랜드 소비뇽 블랑이랑 뭐가 달라요?', a: '뉴질랜드는 패션프루트처럼 향이 크게 터지고, 루아르는 레몬·미네랄 쪽으로 더 단정해요. 음식이랑 같이 먹기 편한 쪽이 루아르예요.' },
      { q: '"뱅 드 프랑스"는 낮은 등급 아닌가요?', a: '지역 규정에 묶이지 않고 여러 밭 포도를 섞을 수 있는 이름이에요. 피에르 샤니에는 투렌 자기 밭 포도를 주로 써요.' },
      { q: '어디서 만날 수 있어요?', a: '지금은 탭샵바 청계(삼일빌딩 B1) 매대에 있어요. 수량이 적어서 다 나가면 끝이에요.' }
    ]
  }
];

window.VIDEOS = {
  story: { src: '../assets/v/story.mp4', poster: '../assets/v/story.jpg', t: '30초 히스토리' },
  noir:  { src: '../assets/v/noir.mp4',  poster: '../assets/v/noir.jpg',  t: '탭샵바의 밤' },
  dance: { src: '../assets/v/dance.mp4', poster: '../assets/v/dance.jpg', t: '병 댄스' }
};

/* 왜 지금 프랑스? (출처 링크 포함, 2026-10 기준) */
window.FRANCE = {
  facts: [
    { n: '약 70년', t: '만에 가장 적은 수확', d: '2026년 프랑스 와인 생산 약 3,500만 hl. 최근 5년 평균보다 14% 적어요.', src: 'https://www.theguardian.com/food/2026/oct/07/french-wine-industry-historic-low-harvest-extreme-summer-heat' },
    { n: '27,000ha', t: '포도밭을 뽑는 중', d: '안 팔리고 덥고 가물어서, 2026년 프랑스는 축구장 수만 개 넓이의 포도밭을 정리해요.', src: 'https://www.vinetur.com/en/20261008108580/france-will-remove-27000-hectares-of-vines-after-demand-for-wine-slumps.html' },
    { n: '-11%', t: '보르도 판매', d: '보르도 와인 판매는 1년 사이 11% 줄었어요.', src: 'https://bordeauxreviews.com/news/2026-10-28/' }
  ]
};
