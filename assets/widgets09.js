// 9차시 인터랙티브 위젯 — 슬라이드(teacher/slides/lesson09.html)와 교재(lesson09.html)가 공유한다.
// 각 위젯: <div class="widget" data-w="이름"> 조각 + function initW_이름(root, D). D = window.LESSON_DATA.
// 계약: system/widgets/WIDGET_BRIEF_TEMPLATE.md. <body> 끝에서 로드한다.
  window.LESSON_DATA = {"audi":[8624,3604,11982,85189,17563,2424803,92271,360799,4500029,164664,10894,9175,2302,407791,1979498,45429,59984,18305,1540233,16916280,1067555,52636,2925401,210768,10816,7370,63425,9312,12783,71643,166061,1438794,206709,69076,1344042,45711,8207,2594460,545602,116465,54826,9319,3924,14097,24026,235159,33774,4001,56231,6091,3683,61616,3762,7888,319083,135798,12813,46280,63443,250842,67329,21127,11794,98458,278409,5951761,8604180,22022,29806,737835,230625,158573,38611,3232828,843211,415690,964710,34000,33273,81767,754046,65526,6731026,521262,276229,73110,410827,13824,3453440,50640,14103,43913,74368,191245,101413,7534,25580,28800,3845,22785,441742,1232,217899,7210,24964,7214,29175,6419,57770,5059,15533,6166,221481,26491,17612,10172,7145,1367031,15309,22455,36194,17436,14862,14867,9645,357540,249736,15323,34694,15968,1953,7066,39175,2025,17124,4597,12346,476133,2614,3736,28422,27131,87040,4084,10800,21784,1615847,7199,1633044,2942352,1590300,30151,1022927,16881,45106,59179,91031,3439,8133,207669,9942,2779,23203,75777,2897,28430,78787,34104,67801,2896778,773600,23192,92744,3673,7695,13170,18567,7932,17746,17896,4619,15602,13055,12896,33691,234543,41274,13670,2920,299942,9515,30056,14433,4761,70388,1211546,30336,15740,6125,13617,12323,81338,3000,159163,4456,131844,1279,28218,12968,9991,69574,53889,10316,8609,19877,13980],"name":["연지구 디 오리지널 4K","줄무늬 파자마를 입은 소년","석류의 빛깔","끝장수사","하얀 차를 탄 여자","보스","삼악도","살인자 리포트","호프","정보원","만남의 집","전력질주","슈가","짱구","휴민트","매드 댄스 오피스","메소드연기","한란","눈동자","왕과 사는 남자","얼굴","나혼자 프린스","어쩔수가없다","연의 편지","사람과 고기","바로 지금 여기","귀시","3670","보이","홈캠","세계의 주인","신의악단","내 이름은","시스터","와일드 씽","신사: 악귀의 속삭임","3학년 2학기","만약에 우리","윗집 사람들","프로젝트 Y","나쁜계집애: 달려라 하니","우리에게는 아직 내일이 있다","블루 아카이브 : 디 오케스트라 인 시네마","극장판 총집편 걸즈 밴드 크라이 청춘광주곡","굿 포츈","하트맨","고고다이노 극장판: 곤충세계 대모험","판결","햄넷","미야자키 하야오의 그대들은 어떻게 살 것인가","다이 마이 러브","센티멘탈 밸류","끝이 없는 스칼렛","코드: G 주목의 시작","신비아파트 10주년 극장판: 한 번 더, 소환","슈퍼걸","정글비트 2","극장판 엉덩이 탐정: 스타 앤드 문","직장상사 길들이기","디스클로저 데이","하우스메이드","바다 탐험대 옥토넛 어보브 앤 비욘드 : 육지생물 구조작전","우리는 매일매일","노 머시: 90분","넘버원","군체","주토피아 2","교생실습","구원자","퍼스트 라이드","프레디의 피자가게 2","트론: 아레스","여행과 나날","살목지","오늘 밤, 세계에서 이 사랑이 사라진다 해도","프레데터: 죽음의 땅","위키드: 포 굿","더 러닝 맨","투게더","스폰지밥 무비: 네모바지를 찾아서","호퍼스","부고니아","아바타: 불과 재","원 배틀 애프터 어나더","브레드이발소: 베이커리타운의 악당들","웨폰","컨저링: 마지막 의식","아기돼지 3형제: 도넛별 대모험","극장판 체인소 맨: 레제편","프랑켄슈타인 : 더 뮤지컬 라이브","바다 탐험대 옥토넛 어보브 앤 비욘드 : 콰지의 깜짝 어드벤처","건국전쟁2","명탐정 코난: 17년 전의 진상","국보","개비의 매직하우스 극장판","파르테노페","그저 사고였을 뿐","난징사진관","말할 수 없는 비밀: 마지막 챕터","프로텍터","8번 출구","2016 방탄소년단 라이브 화양연화 온 스테이지 : 에필로그 리마스터링","극장판 주술회전: 회옥·옥절","워킹맨","중간계","배달의 영웅 : 캐리와 슈퍼콜라2","28년 후: 뼈의 사원","베이비걸","폭풍의 언덕","지드래곤 인 시네마 [위버맨쉬]","아르코","원 인 어 밀리언","만달로리안과 그로구","톰과 제리: 황금나침반 대소동","엄마를 버리러 갑니다","731","스노우 폭스 : 마법의 돌을 찾아서","나우 유 씨 미 3","꼬마돼지 베이브와 타피티","브라이드!","극장판 똘똘이: 아기공룡의 비밀","척의 일생","후지모토 타츠키 17-26 파트 2","후지모토 타츠키 17-26 파트 1","순례자들은 왜 돌아오지 않는가","극장판 주술회전: 시부야사변 X 사멸회유","뽀로로 극장판 스위트캐슬 대모험","뒷자리에 태워줘","프라이메이트","너만 보이는 날","에이티즈 에이 투 지 온 스크린","신세기 에반게리온 극장판 사도신생","케이팝 데몬 헌터스","포레스텔라 : 더 웨이브 인 시네마","피렌체","누벨바그","힌드의 목소리","극장판 짱구는 못말려: 초화려! 작열하는 떡잎마을 댄서즈","힘","파리의 사생활","시라트","파더 마더 시스터 브라더","초속 5센티미터","마이 선샤인","두 검사","콘크리트 마켓","마이클","송 썽 블루","슈퍼 마리오 갤럭시","토이 스토리 5","악마는 프라다를 입는다 2","화양연화 특별판","모아나","스트레이 키즈 : 더 도미네이트 익스피리언스","점보","너자 2","귀신 부르는 앱: 영","키퍼","녹나무의 파수꾼","2024.12.03 그날 조작된 내란, 감춰진 진실","슬라이드 스트럼 뮤트","시크릿 에이전트","짝사랑 세계","아이엠스타!X프리파라 더 무비 -만남의 기적!-","엔하이픈 [워크 더 라인 썸머 에디션] 인 시네마","위 리브 인 타임","네가 마지막으로 남긴 노래","투어스 브이알 콘서트 : 러쉬로드","상자 속의 양","프로젝트 헤일메리","미니언즈 & 몬스터즈","폭탄","명탐정 코난: 세기말의 마술사","스페셜즈","올 그린스","킬 빌: 더 홀 블러디 어페어","펫 트레인","뮤지컬 장수탕 선녀님","크라임 101","쉘터","오피셜히게단디즘 라이브 앳 스타디움 2025","노멀","런닝맨: 라이트&쉐도우","하나 코리아","리 크로닌의 미이라","란 12.3","기동전사 건담: 섬광의 하사웨이 키르케의 마녀","르누아르","극장판 총집편 걸즈 밴드 크라이 있잖아, 미래.","다윗","극장판 반짝반짝 달님이: 싱어롱 파티","고트: 더 레전드","모탈 컴뱃 2","남태령","신극장판 은혼: 요시와라 대염상","백룸","극장판 호빵맨: 세균맨과 그림책의 루룬","극장판 내 마음의 위험한 녀석","맘보 점보","돌핀보이: 푸른 바다의 수호자","사랑의 하츄핑 특별판","너바나 더 밴드 : 전설적 밴드 ‘너바나’와는 별 관련 없는 ‘너바나 더 밴드’의 콤비 맷과 제이. 어느 날 공연을 위해 타임머신을 만드는 황당한 작전을 세우고 처음 만났던 17년 전으로 돌","리마인더스 오브 힘","이상한 과자 가게 전천당","카드캡터 체리 극장판","마티 슈프림","미세스 그린 애플 매지컬 10주년 기념 라이브 ~피오르드~ 온 스크린","플레이브 아시아 투어 [대쉬: 퀀텀 리프] 앙코르 인 시네마","마스터즈 오브 유니버스","에픽: 엘비스 프레슬리 콘서트","극장판 도라에몽: 신 진구의 해저비밀성","그린랜드 2: 마이그레이션","정동원 팬콘서트 필름 : 다시 만나는 길","앤팀 브이알 콘서트 : 바운드리스","극장판 암살교실 모두의 시간","블리치 천년혈전 편 : 화진담"],"stops":[[100000,0.773,0.818],[200000,0.727,0.803],[300000,0.848,0.833],[500000,0.864,0.909],[700000,0.864,0.909],[1000000,0.924,0.939],[1500000,0.97,0.97],[2000000,0.985,0.955],[3000000,1.0,1.0],[5000000,0.985,1.0]],"test":[["연지구 디 오리지널 4K",8624,-2.2043,-6.2598,-7.0779],["줄무늬 파자마를 입은 소년",3604,-4.6993,-4.9867,-7.6602],["석류의 빛깔",11982,-3.2784,-3.7655,-6.3609],["만남의 집",10894,-2.0823,-2.6784,-4.837],["전력질주",9175,-2.0196,-2.6133,-4.9354],["슈가",2302,-2.7476,-3.7277,-4.8278],["얼굴",1067555,-2.6343,-2.7297,-2.1922],["나혼자 프린스",52636,0.0179,-0.528,-3.8333],["어쩔수가없다",2925401,-1.3233,-1.1705,-4.6994],["세계의 주인",166061,-2.2699,-2.8748,-4.4147],["신의악단",1438794,-2.7419,-3.7218,-4.8333],["내 이름은",206709,-2.0195,-2.6132,-4.9375],["나쁜계집애: 달려라 하니",54826,-1.2838,-1.2816,-2.5922],["우리에게는 아직 내일이 있다",9319,-4.7174,-4.9286,-6.53],["블루 아카이브 : 디 오케스트라 인 시네마",3924,-4.6574,-5.1113,-4.6943],["다이 마이 러브",3683,-2.4343,-3.2124,-8.4207],["센티멘탈 밸류",61616,-3.4084,-3.9,-6.1948],["끝이 없는 스칼렛",3762,-4.091,-4.0522,-3.2313],["하우스메이드",67329,-2.5941,-3.0228,-7.4013],["바다 탐험대 옥토넛 어보브 앤 비욘드 : 육지생물 구조작전",21127,-3.7215,-3.3984,-6.1371],["우리는 매일매일",11794,1.0611,-0.0323,-4.8408],["프레디의 피자가게 2",230625,-2.5258,-3.0131,-4.3328],["트론: 아레스",158573,-0.5294,-0.489,-2.9895],["여행과 나날",38611,-5.1963,-5.7683,-4.9472],["호퍼스",754046,-1.3353,-1.5126,-5.8972],["부고니아",65526,-1.5954,-1.635,-7.3011],["아바타: 불과 재",6731026,1.1793,0.8107,2.9051],["바다 탐험대 옥토넛 어보브 앤 비욘드 : 콰지의 깜짝 어드벤처",14103,-3.7554,-3.4358,-5.9002],["건국전쟁2",43913,-4.0644,-4.1686,-4.77],["명탐정 코난: 17년 전의 진상",74368,-3.0855,-2.6598,-2.9282],["8번 출구",441742,-2.4402,-1.8816,-2.4849],["2016 방탄소년단 라이브 화양연화 온 스테이지 : 에필로그 리마스터링",1232,-3.9414,-4.0103,-4.7021],["극장판 주술회전: 회옥·옥절",217899,-2.5155,-2.0959,-1.5157],["아르코",15533,-4.8172,-4.1703,-5.2869],["원 인 어 밀리언",6166,-3.9685,-4.0632,-5.4024],["만달로리안과 그로구",221481,-1.1877,-1.2972,-3.357],["극장판 똘똘이: 아기공룡의 비밀",36194,-1.0735,-1.0627,-2.9641],["척의 일생",17436,-3.29,-4.4569,-8.3235],["후지모토 타츠키 17-26 파트 2",14862,-3.4111,-2.9848,-3.4998],["에이티즈 에이 투 지 온 스크린",1953,-3.9007,-3.9671,-4.8399],["신세기 에반게리온 극장판 사도신생",7066,-3.3751,-2.9505,-3.3076],["케이팝 데몬 헌터스",39175,-3.2304,-2.9977,-5.8137],["시라트",28422,-4.1222,-5.0001,-6.0793],["파더 마더 시스터 브라더",27131,-6.5931,-6.9447,-6.6827],["초속 5센티미터",87040,-4.256,-4.4505,-3.9691],["악마는 프라다를 입는다 2",1590300,-2.41,-3.1851,-8.6325],["화양연화 특별판",30151,-4.1233,-5.0007,-6.1155],["모아나",1022927,-2.0483,-2.6053,-2.5281],["슬라이드 스트럼 뮤트",9942,-2.1396,-2.7373,-4.8045],["시크릿 에이전트",2779,-4.0337,-4.908,-6.2285],["짝사랑 세계",23203,-4.3867,-4.572,-4.9465],["미니언즈 & 몬스터즈",773600,-1.3803,-1.9454,-4.5698],["폭탄",23192,-3.6726,-3.1109,-4.7161],["명탐정 코난: 세기말의 마술사",92744,-3.3646,-2.9356,-3.6451],["오피셜히게단디즘 라이브 앳 스타디움 2025",4619,-6.2723,-5.9279,-5.0601],["노멀",15602,-1.2263,-2.4292,-8.7092],["런닝맨: 라이트&쉐도우",13055,-1.0805,-1.0691,-3.0239],["극장판 반짝반짝 달님이: 싱어롱 파티",9515,-1.1279,-1.1162,-3.1304],["고트: 더 레전드",30056,-1.7049,-1.8806,-6.6179],["모탈 컴뱃 2",14433,-1.83,-1.9344,-4.8203],["사랑의 하츄핑 특별판",12323,-1.2922,-1.2852,-2.9974],["너바나 더 밴드 : 전설적 밴드 ‘너바나’와는 별 관련 없는 ‘너바나 더 밴드’의 콤비 맷과 제이. 어느 날 공연을 위해 타임머신을 만드는 황당한 작전을 세우고 처음 만났던 17년 전으로 돌",81338,-2.5055,-2.8257,-7.5751],["리마인더스 오브 힘",3000,-2.427,-3.2026,-8.6178],["극장판 도라에몽: 신 진구의 해저비밀성",69574,-3.8055,-3.7634,-3.0399],["그린랜드 2: 마이그레이션",53889,-4.6091,-4.6065,-3.8337],["정동원 팬콘서트 필름 : 다시 만나는 길",10316,-3.9101,-3.9775,-4.7836]]};
function initW_sigmoidPath(root, D) {
  // D.test = [영화명, 관객수, z50, z100, z300] 66개(결측 없음). 라벨 기준은 100만(z100, 인덱스 3).
  const T = D.test, N = T.length, LIM = 1000000;
  const X0 = 56, X1 = 556, ZA = -7.5, ZB = 2.5, YT = 44, YB = 268;
  const BX0 = 608, ROW = 636;                     // 띠 착지 시작 x, 선택 줄 최대 폭
  const q = s => root.querySelector(s);
  const xz = z => X0 + (z - ZA) / (ZB - ZA) * (X1 - X0);
  const yp = p => YB - p * (YB - YT);
  const bx = i => BX0 + (i % 8) * 11;
  const sig = z => 1 / (1 + Math.exp(-z));
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const fx = v => v.toFixed(1);

  // 값 준비
  const zs = [], pr = [], act = [];
  for (let i = 0; i < N; i++) {
    zs.push(T[i][3]); pr.push(sig(T[i][3])); act.push(T[i][1] >= LIM ? 1 : 0);
  }

  // 요소
  const curve = q('.curve'), mg = q('.mpts'), bg = q('.bpts'), hg = q('.hits');
  const zone = q('.zone'), tline = q('.tline'), tlab = q('.tlab'), zlab = q('.zlab');
  const n1 = q('.n1'), n2 = q('.n2'), n3 = q('.n3'), n4 = q('.n4'), sel = q('.sel');
  const note1 = q('.note1'), note2 = q('.note2');
  const slider = q('.thr');
  const btnPath = q('.wbtn[data-k="path"]');
  const btnTop = q('.wbtn[data-k="top"]');
  const btnMiss = q('.wbtn[data-k="miss"]');

  // 시그모이드 곡선(0.25 간격)
  const cp = [];
  for (let z = ZA; z <= ZB + 1e-9; z += 0.25) cp.push(fx(xz(z)) + ',' + fx(yp(sig(z))));
  curve.setAttribute('points', cp.join(' '));

  // 66편 점: 실제 성공 #b07a00 r4.5 · 기준 미달 #2b7fd6 반투명 .55 r3.5(선택 강조 stroke가 흐려지지 않게 fill-opacity)
  const rBase = i => (act[i] ? 4.5 : 3.5);
  let mHtml = '', bHtml = '', hHtml = '';
  for (let i = 0; i < N; i++) {
    const cx = fx(xz(zs[i])), cy = fx(yp(pr[i])), r = rBase(i);
    const fill = act[i] ? 'fill="#b07a00"' : 'fill="#2b7fd6" fill-opacity="0.55"';
    mHtml += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" ' + fill + '/>';
    bHtml += '<circle cx="' + bx(i) + '" cy="' + cy + '" r="' + r + '" ' + fill + '/>';
    hHtml += '<circle data-i="' + i + '" cx="' + cx + '" cy="' + cy + '" r="9" fill="transparent" cursor="pointer"><title>'
      + esc(T[i][0]) + '</title></circle>';
  }
  mg.innerHTML = mHtml; bg.innerHTML = bHtml; hg.innerHTML = hHtml;
  const mps = Array.from(mg.children), bps = Array.from(bg.children);

  // 최고 확률 영화, 실제 성공인데 확률이 낮은 영화 순환 목록
  let topI = 0;
  for (let i = 1; i < N; i++) if (pr[i] > pr[topI]) topI = i;
  const missNames = ['얼굴', '신의악단', '악마는 프라다를 입는다 2', '모아나', '어쩔수가없다'];
  const missIdx = [];
  for (const nm of missNames) { const k = T.findIndex(r => r[0] === nm); if (k >= 0) missIdx.push(k); }
  let missCur = 0, pick = -1;

  // 글자 폭 어림(한글 15 · 공백 4.5 · 그 밖 8.3)
  const wch = s => {
    let w = 0;
    for (const ch of s) { const c = ch.codePointAt(0); w += c > 0x2fff ? 15 : (ch === ' ' ? 4.5 : 8.3); }
    return w;
  };
  const num = v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2);
  const people = v => (v >= 10000
    ? Math.round(v / 10000) + '만 명'
    : String(v).replace(/\B(?=(\d{3})+$)/g, ',') + '명');

  // 문턱값에 따른 그림·수치
  function paint() {
    const t = Number(slider.value), ty = yp(t);
    tline.setAttribute('y1', fx(ty)); tline.setAttribute('y2', fx(ty));
    zone.setAttribute('height', fx(Math.max(0, ty - YT)));
    tlab.setAttribute('y', fx(ty >= 68 ? ty - 8 : ty + 18));   // 확률 1 점근선 위로 올라가지 않게 아래쪽으로 옮김
    tlab.textContent = '문턱값 ' + t.toFixed(2);
    zlab.setAttribute('visibility', ty >= 76 ? 'visible' : 'hidden');
    // 문턱선이 점근선 설명을 가로지르지 않게 설명 두 줄을 아래로 내림
    note1.setAttribute('y', ty < 95 ? 110 : 62);
    note2.setAttribute('y', ty < 95 ? 130 : 82);

    let hit = 0, up = 0;
    for (let i = 0; i < N; i++) {
      const pd = pr[i] >= t ? 1 : 0;
      if (pd === act[i]) hit++;
      up += pd;
    }
    n1.textContent = '맞힌 편수 ' + hit + '/' + N;
    n2.textContent = '정확도 ' + (hit / N).toFixed(3);
    n3.textContent = '성공으로 예측 ' + up + '편';
    n4.textContent = '기준 미달로 예측 ' + (N - up) + '편';
    paintSel();
  }

  // 선택 줄과 강조
  function paintSel() {
    const t = Number(slider.value);
    for (let i = 0; i < N; i++) {
      const on = i === pick, r = rBase(i) + (on ? 1.5 : 0);
      for (const c of [mps[i], bps[i]]) {
        c.setAttribute('r', r);
        if (on) { c.setAttribute('stroke', '#1c2230'); c.setAttribute('stroke-width', '2'); }
        else { c.removeAttribute('stroke'); c.removeAttribute('stroke-width'); }
      }
    }
    btnTop.className = 'wbtn' + (pick === topI ? ' on' : '');
    btnMiss.className = 'wbtn' + (missIdx.indexOf(pick) >= 0 ? ' on' : '');

    if (pick < 0) { sel.textContent = '점을 눌러 한 편의 확률 확인'; return; }
    const full = T[pick][0];
    const tail = ' · 가중합 ' + num(zs[pick]) + ' · 확률 ' + pr[pick].toFixed(3)
      + ' · 예측 ' + (pr[pick] >= t ? '성공' : '기준 미달')
      + ' · 실제 ' + (act[pick] ? '성공' : '기준 미달')
      + ' · ' + people(T[pick][1]);
    const ch = Array.from(full);
    let lim = Math.min(20, ch.length);
    let head = ch.slice(0, lim).join('') + (lim < ch.length ? '…' : '');
    while (lim > 4 && wch(head + tail) > ROW) { lim--; head = ch.slice(0, lim).join('') + '…'; }
    sel.innerHTML = '<title>' + esc(full) + '</title>' + esc(head + tail);
  }

  // 경로 애니메이션(0~300ms 상승, 300~560ms 띠로 이동)
  let raf = 0, t0 = 0;
  const outC = k => 1 - Math.pow(1 - k, 3);
  const inOutC = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

  function rest() {
    for (let i = 0; i < N; i++) {
      mps[i].setAttribute('cy', fx(yp(pr[i])));
      bps[i].setAttribute('cx', bx(i));
    }
    bg.removeAttribute('visibility');
  }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } rest(); }

  function frame(ts) {
    if (!t0) t0 = ts;
    const e = ts - t0;
    if (e < 300) {
      const k = outC(e / 300);
      for (let i = 0; i < N; i++) mps[i].setAttribute('cy', fx(YB - (YB - yp(pr[i])) * k));
      raf = requestAnimationFrame(frame);
    } else if (e < 560) {
      const k = inOutC((e - 300) / 260);
      bg.removeAttribute('visibility');
      for (let i = 0; i < N; i++) {
        mps[i].setAttribute('cy', fx(yp(pr[i])));
        bps[i].setAttribute('cx', fx(xz(zs[i]) + (bx(i) - xz(zs[i])) * k));
      }
      raf = requestAnimationFrame(frame);
    } else { raf = 0; rest(); }
  }
  function play() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    t0 = 0;
    bg.setAttribute('visibility', 'hidden');
    for (let i = 0; i < N; i++) {
      mps[i].setAttribute('cy', YB);
      bps[i].setAttribute('cx', fx(xz(zs[i])));
    }
    raf = requestAnimationFrame(frame);
  }

  // 조작
  slider.addEventListener('input', () => { stop(); paint(); });
  btnPath.addEventListener('click', play);
  btnTop.addEventListener('click', () => {
    pick = pick === topI ? -1 : topI;
    missCur = 0;
    paintSel();
  });
  btnMiss.addEventListener('click', () => {
    if (!missIdx.length) return;
    pick = missIdx[missCur % missIdx.length];
    missCur = (missCur + 1) % missIdx.length;
    paintSel();
  });
  hg.addEventListener('click', ev => {
    const el = ev.target.closest('circle[data-i]');
    if (!el) return;
    const i = Number(el.getAttribute('data-i'));
    pick = pick === i ? -1 : i;
    missCur = 0;
    paintSel();
  });

  paint();
}

function initW_twoDials(root, D) {
  // 좌표: 두 층 공통 가로 구간 72~676. 위 = 누적 관객 수 로그 척도(10^3~10^7.25), 아래 = 추정 확률 0~1
  var X0 = 72, X1 = 676, W = X1 - X0, PR = 696;
  var COL = { 500000: 2, 1000000: 3, 3000000: 4 };   // D.test의 z 열 위치
  var NM = { 500000: '50만 명', 1000000: '100만 명', 3000000: '300만 명' };
  var SUCC = [176, 122, 0], MISS = [43, 127, 214];   // #b07a00 · #2b7fd6
  var M = D.test.length, N = D.audi.length;
  var i;

  function LX(v) {                                   // 관객 수 → 위 패널 가로 좌표
    var x = X0 + (Math.log(v) / Math.LN10 - 3) / 4.25 * W;
    return x < X0 ? X0 : x;
  }
  function XP(p) { return X0 + p * W; }              // 확률 → 아래 패널 가로 좌표
  function mix(a, b, t) {
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' +
      Math.round(a[1] + (b[1] - a[1]) * t) + ',' + Math.round(a[2] + (b[2] - a[2]) * t) + ')';
  }
  function tw(s, fs) {                               // 글자 폭 추정: 전각 1.0em, 공백 0.28em, 나머지 0.55em
    var w = 0;
    for (var j = 0; j < s.length; j++) {
      var c = s.charCodeAt(j);
      if (c > 0x2000) w += fs; else if (c === 32) w += fs * 0.28; else w += fs * 0.55;
    }
    return w;
  }
  function probsOf(k) {                              // 사전 계산된 z에서 확률 복원
    var c = COL[k], a = [];
    for (var j = 0; j < M; j++) a.push(1 / (1 + Math.exp(-D.test[j][c])));
    return a;
  }
  function isHit(k, j) { return D.test[j][1] >= k; }
  function cntAll(k) { var c = 0; for (var j = 0; j < N; j++) if (D.audi[j] >= k) c++; return c; }
  function cntTest(k) { var c = 0; for (var j = 0; j < N; j++) if (j % 10 < 3 && D.audi[j] >= k) c++; return c; }

  var q = function (s) { return root.querySelector(s); };
  var upG = q('.dotT'), loG = q('.dotB');
  var lline = q('.lline'), ltext = q('.ltext');
  var tline = q('.tline'), ttext = q('.ttext'), grn = q('.grn');
  var nums = [q('.n1'), q('.n2'), q('.n3'), q('.n4')];
  var btns = Array.prototype.slice.call(root.querySelectorAll('.wbtn'));
  var slider = q('.thr');

  // 66편의 점 두 벌 — 같은 영화는 두 패널에서 같은 순번의 줄에 놓인다
  var s1 = '', s2 = '';
  for (i = 0; i < M; i++) {
    s1 += '<circle cx="' + LX(D.test[i][1]).toFixed(1) + '" cy="' + (62 + (i % 5) * 14) + '" r="3.5"/>';
    s2 += '<circle cx="' + X0 + '" cy="' + (218 + (i % 5) * 14) + '" r="3.5"/>';
  }
  upG.innerHTML = s1;
  loG.innerHTML = s2;
  var upC = upG.children, loC = loG.children;

  var curK = 1000000, curT = 0.5, pCur = probsOf(curK), seq = 0;

  function paintDots(kNew, kOld, a) {                // 색은 정답 층에서만 결정, 두 패널이 같은 색을 쓴다
    for (var j = 0; j < M; j++) {
      var t1 = isHit(kNew, j) ? 1 : 0;
      var t0 = kOld == null ? t1 : (isHit(kOld, j) ? 1 : 0);
      var m = t0 + (t1 - t0) * a;
      var col = mix(MISS, SUCC, m), op = (0.55 + 0.45 * m).toFixed(2), r = (3.5 + m).toFixed(2);
      upC[j].setAttribute('fill', col); upC[j].setAttribute('opacity', op); upC[j].setAttribute('r', r);
      loC[j].setAttribute('fill', col); loC[j].setAttribute('opacity', op); loC[j].setAttribute('r', r);
    }
  }
  function paintLower(px) {
    for (var j = 0; j < M; j++) loC[j].setAttribute('cx', XP(px[j]).toFixed(1));
  }
  function paintMarks(k, t) {                        // 예측이 실제와 다른 점만 빨간 테두리
    for (var j = 0; j < M; j++) {
      if ((pCur[j] >= t) !== isHit(k, j)) {
        loC[j].setAttribute('stroke', '#d64545'); loC[j].setAttribute('stroke-width', '2');
      } else {
        loC[j].setAttribute('stroke', 'none'); loC[j].setAttribute('stroke-width', '0');
      }
    }
  }
  function paintLabelLine(x, k) {
    lline.setAttribute('x1', x.toFixed(1)); lline.setAttribute('x2', x.toFixed(1));
    ltext.textContent = '라벨 기준 ' + NM[k];
    if (PR - x >= 130) { ltext.setAttribute('x', (x + 8).toFixed(1)); ltext.setAttribute('text-anchor', 'start'); }
    else { ltext.setAttribute('x', (x - 8).toFixed(1)); ltext.setAttribute('text-anchor', 'end'); }
  }
  function paintThr(t) {
    var x = XP(t);
    tline.setAttribute('x1', x.toFixed(1)); tline.setAttribute('x2', x.toFixed(1));
    grn.setAttribute('x', x.toFixed(1)); grn.setAttribute('width', (X1 - x).toFixed(1));
    if (X1 - x >= 90) { ttext.setAttribute('x', (x + 8).toFixed(1)); ttext.setAttribute('visibility', 'visible'); }
    else ttext.setAttribute('visibility', 'hidden');
  }
  function paintNums(k, t) {
    var hit = 0, pos = 0;
    for (var j = 0; j < M; j++) {
      var pr = pCur[j] >= t, ac = isHit(k, j);
      if (pr === ac) hit++;
      if (pr) pos++;
    }
    var c66 = cntTest(k);
    var s = [
      '전체 ' + N + '편 중 성공 ' + cntAll(k) + '편',
      '시험 ' + M + '편 중 성공 라벨 ' + c66 + '편' + (c66 <= 3 ? ' · 표본 극소' : ''),
      '정확도 ' + (hit / M).toFixed(3),
      '성공으로 예측 ' + pos + '편'
    ];
    var wArr = [], sum = 0, u;
    for (u = 0; u < 4; u++) { wArr.push(tw(s[u], 15)); sum += wArr[u]; }
    var gap = (648 - sum) / 3;                       // 왼쪽 56, 오른쪽 끝 704 기준으로 고르게 배치
    if (gap < 8) gap = 8; else if (gap > 36) gap = 36;
    var x = 56;
    for (u = 0; u < 4; u++) {
      nums[u].textContent = s[u];
      nums[u].setAttribute('x', x.toFixed(1));
      nums[u].setAttribute('fill', (u === 1 && c66 <= 3) ? '#d64545' : '#1c2230');
      x += wArr[u] + gap;
    }
  }
  function settle(k, t) {
    paintDots(k, null, 1);
    paintLower(pCur);
    paintMarks(k, t);
    paintLabelLine(LX(k), k);
    paintThr(t);
    paintNums(k, t);
  }

  function setLabel(k) {
    if (k === curK) return;
    var oldK = curK, oldP = pCur;
    curK = k; pCur = probsOf(k);
    for (var b = 0; b < btns.length; b++) btns[b].classList.toggle('on', +btns[b].dataset.th === k);
    settle(curK, curT);          // 최종 상태를 먼저 확정한다. 첫 프레임은 화면에 그려지기 전에 실행되므로 깜빡임이 없다
    var x0 = LX(oldK), x1 = LX(curK);
    var token = ++seq, t0 = -1;
    var ease = function (u) { return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var frame = function (ts) {
      if (token !== seq) return;                     // 슬라이더 조작 시 즉시 종료
      if (t0 < 0) t0 = ts;
      var ms = ts - t0;
      var a = ms < 180 ? ms / 180 : 1;               // 0~180ms: 기준선 이동과 색 전환
      var e = ease(ms <= 180 ? 0 : (ms >= 520 ? 1 : (ms - 180) / 340));  // 180~520ms: 아래 점 이동
      paintDots(curK, oldK, a);
      paintLabelLine(x0 + (x1 - x0) * a, curK);
      var px = [];
      for (var j = 0; j < M; j++) px.push(oldP[j] + (pCur[j] - oldP[j]) * e);
      paintLower(px);
      if (ms < 520) requestAnimationFrame(frame); else settle(curK, curT);
    };
    requestAnimationFrame(frame);
  }

  for (i = 0; i < btns.length; i++) {
    (function (b) { b.addEventListener('click', function () { setLabel(+b.dataset.th); }); })(btns[i]);
  }
  slider.addEventListener('input', function () {
    seq++;
    curT = +slider.value;
    settle(curK, curT);
  });

  settle(curK, curT);
}

function initW_labelline(root, D) {
  // ── 임계값 10단계(D.stops와 같은 순서)와 화면 표시 문구
  var STOPS = D.stops;
  var LBL = ['10만 명', '20만 명', '30만 명', '50만 명', '70만 명', '100만 명', '150만 명', '200만 명', '300만 명', '500만 명'];
  var N = D.audi.length, NT = D.test.length;

  // ── 로그 가로축 LX(v) = 56 + (log10(v) − 3) / 4.25 × 374
  var X0 = 56, W = 374, SPAN = 4.25, BASE = 214, BW = 20, BSTEP = W / 17;
  function LX(v) { return X0 + (Math.log10(v) - 3) / SPAN * W; }

  // ── 도수 분포 17구간, 구간 i = [10^(3+0.25i), 10^(3+0.25(i+1)))
  var bin = new Array(N), cnt = [], i, b;
  for (i = 0; i < 17; i++) cnt.push(0);
  for (i = 0; i < N; i++) {
    b = Math.floor((Math.log10(D.audi[i]) - 3) / 0.25);
    if (b < 0) b = 0;
    if (b > 16) b = 16;
    bin[i] = b;
    cnt[b]++;
  }

  // ── 요소
  function q(s) { return root.querySelector(s); }
  var bars = q('.bars'), thrLine = q('.thrline'), thrHandle = q('.thrhandle');
  var bPanel = q('.bpanel'), b1 = q('.b1'), b2 = q('.b2'), b3 = q('.b3');
  var cLog = q('.clog'), cTree = q('.ctree');
  var cover = q('.cover'), cv1 = q('.cv1'), cv2 = q('.cv2');
  var dHead = q('.dhead'), dHi = q('.dhi'), dLo = q('.dlo');
  var slider = q('.thr'), wv = q('.wv'), wtxt = q('.wtxt'), wout = q('.wout'), go = q('.wgo');
  var chips = Array.prototype.slice.call(root.querySelectorAll('.wbtn[data-r]'));

  // ── 문자열 도구
  function comma(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function cut(s) { return s.length > 24 ? s.slice(0, 23) + '…' : s; }
  function setRow(el, head, full, v) {              // 원제목은 <title> 자식으로 보존
    el.innerHTML = '<title>' + esc(full) + '</title>' + esc(head + ' — ' + cut(full) + ' ' + comma(v) + '명');
  }

  // ── 한 임계값의 화면 값 계산
  function calc(t) {
    var above = [], n = 0, k = 0, hi = Infinity, hiI = -1, lo = -Infinity, loI = -1, j, v;
    for (j = 0; j < 17; j++) above.push(0);
    for (j = 0; j < N; j++) {
      v = D.audi[j];
      if (v >= t) { n++; above[bin[j]]++; if (v < hi) { hi = v; hiI = j; } }
      else if (v > lo) { lo = v; loI = j; }
    }
    for (j = 0; j < NT; j++) if (D.test[j][1] >= t) k++;
    return { n: n, k: k, above: above, hi: hi, hiI: hiI, lo: lo, loI: loI };
  }

  // ── 그리기
  function draw(idx) {
    var t = STOPS[idx][0], r = calc(t), h, ha, x, s = '', j;
    for (j = 0; j < 17; j++) {
      x = (X0 + 1 + BSTEP * j).toFixed(1);
      h = cnt[j] * 3.5;
      ha = r.above[j] * 3.5;
      if (h - ha > 0) s += '<rect x="' + x + '" y="' + (BASE - (h - ha)).toFixed(1) + '" width="' + BW + '" height="' + (h - ha).toFixed(1) + '" fill="#b9b3a5"/>';
      if (ha > 0) s += '<rect x="' + x + '" y="' + (BASE - h).toFixed(1) + '" width="' + BW + '" height="' + ha.toFixed(1) + '" fill="#b07a00"/>';
    }
    bars.innerHTML = s;

    var tx = LX(t).toFixed(1);
    thrLine.setAttribute('x1', tx);
    thrLine.setAttribute('x2', tx);
    thrHandle.setAttribute('x', (LX(t) - 5).toFixed(1));

    b1.textContent = '성공 라벨 ' + r.n + '편 · ' + N + '편 중 ' + (r.n / N * 100).toFixed(1) + '%';
    b2.textContent = '기준 미달 ' + (N - r.n) + '편';
    b3.textContent = '시험용 ' + NT + '편 중 성공 라벨 ' + r.k + '편' + (r.k <= 3 ? ' · 표본 극소' : '');
    b3.setAttribute('fill', r.k <= 3 ? '#d64545' : '#b07a00');

    cLog.textContent = STOPS[idx][1].toFixed(3);
    cTree.textContent = STOPS[idx][2].toFixed(3);

    var gap = r.hi - r.lo;
    dHead.textContent = '기준선 양옆 두 편 · 관객 수 차이 ' + comma(gap) + '명';
    dHead.setAttribute('fill', gap < 10000 ? '#d64545' : '#6b7385');
    setRow(dHi, '성공', D.name[r.hiI], r.hi);
    setRow(dLo, '기준 미달', D.name[r.loI], r.lo);

    wv.textContent = LBL[idx];
  }

  // ── 애니메이션(rAF, 재실행 안전)
  var bSeq = 0, cSeq = 0;
  function fadeB() {
    var id = ++bSeq, t0 = 0;
    function step(ts) {
      if (id !== bSeq) return;
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / 180);
      bPanel.setAttribute('opacity', (0.35 + 0.65 * p).toFixed(3));
      if (p < 1) requestAnimationFrame(step);
    }
    bPanel.setAttribute('opacity', '0.35');
    requestAnimationFrame(step);
  }
  function revealC() {
    var id = ++cSeq, t0 = 0;
    function step(ts) {
      if (id !== cSeq) return;
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / 220);
      cover.setAttribute('opacity', (1 - p).toFixed(3));
      if (p < 1) requestAnimationFrame(step);
      else cover.setAttribute('visibility', 'hidden');
    }
    cover.setAttribute('visibility', 'visible');
    requestAnimationFrame(step);
  }
  function sealC(l1, l2) {
    cSeq++;
    cv1.textContent = l1;
    cv2.textContent = l2;
    cover.setAttribute('opacity', '1');
    cover.setAttribute('visibility', 'visible');
  }

  // ── 상태 기계: 0 미제출 / 1 공개 / 2 재학습 대기
  var state = 0, saved = '';
  function reason() {
    var v = wtxt.value.trim(), j;
    if (v.length >= 8) return v;
    for (j = 0; j < chips.length; j++) if (chips[j].classList.contains('on')) return chips[j].getAttribute('data-r');
    return '';
  }
  function refreshBtn() {
    go.disabled = state === 1 ? true : (state === 0 ? !reason() : false);
  }

  slider.addEventListener('input', function () {
    draw(Number(slider.value));
    if (state === 1) { state = 2; sealC('라벨 변경 · 재학습 필요', "'다시 학습' 버튼"); }
    refreshBtn();
  });
  slider.addEventListener('change', function () { fadeB(); });

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var on = c.classList.contains('on');
      chips.forEach(function (o) { o.classList.remove('on'); });
      if (!on) c.classList.add('on');
      refreshBtn();
    });
  });
  wtxt.addEventListener('input', refreshBtn);

  go.addEventListener('click', function () {
    if (go.disabled) return;
    var r = reason();
    if (r) saved = r;
    state = 1;
    draw(Number(slider.value));
    revealC();
    go.textContent = '다시 학습';
    wout.textContent = '내 기준 ' + LBL[Number(slider.value)] + (saved ? ' · ' + saved : '');
    refreshBtn();
  });

  // ── 초기 상태(기준 100만 명, 성능 봉인)
  sealC('기준 제출 후 공개', '사유 선택 또는 8자 이상 입력');
  draw(Number(slider.value));
  refreshBtn();
}

function initW_labelcurve(root, D) {
  // 좌표: 열 개 기준 지점 x = 84 + i×60, 정확도 y = 186 − (acc − 0.70)/0.30 × 122
  const px = i => 84 + i * 60;
  const py = a => 186 - (a - 0.70) / 0.30 * 122;

  const stops = D.stops;                                  // [기준값, 로지스틱, 트리] 10개
  const sub = D.audi.filter((_, i) => i % 10 < 3);        // 시험용 66편
  const ks = stops.map(s => sub.reduce((c, v) => c + (v >= s[0] ? 1 : 0), 0));
  const manLab = t => (t / 10000) + '만';
  const f3 = v => v.toFixed(3);

  const q = s => root.querySelector(s);
  const bars = q('.bars'), curves = q('.curves'), hits = q('.hits');
  const sel = q('.sel'), read = q('.read'), readk = q('.readk');
  const btns = Array.from(root.querySelectorAll('.wbtn'));

  // 성공 라벨 막대 + 값 라벨
  bars.innerHTML = ks.map((k, i) => {
    const h = k / 15 * 30, top = 226 - h;
    return '<rect x="' + (px(i) - 10) + '" y="' + top.toFixed(1) + '" width="20" height="' + h.toFixed(1) + '" fill="#b9b3a5"/>' +
      '<text x="' + px(i) + '" y="' + (top - 6).toFixed(1) + '" font-size="14" text-anchor="middle" fill="#6b7385">' + k + '</text>';
  }).join('');

  // 두 모델의 꺾은선과 지점
  const poly = (j, color) => {
    const pts = stops.map((s, i) => px(i) + ',' + py(s[j]).toFixed(1)).join(' ');
    return '<polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>' +
      stops.map((s, i) => '<circle cx="' + px(i) + '" cy="' + py(s[j]).toFixed(1) + '" r="4" fill="' + color + '"/>').join('');
  };
  curves.innerHTML = poly(1, '#2b7fd6') + poly(2, '#b07a00');

  // 열 개 투명 히트 영역
  hits.innerHTML = stops.map((s, i) =>
    '<rect class="hit" data-i="' + i + '" x="' + (px(i) - 30) + '" y="60" width="60" height="166" fill="transparent" ' +
    'style="cursor:pointer" role="button" aria-label="기준 ' + manLab(s[0]) + ' 명"/>').join('');

  // 선택 이동(세로선 x만 160ms ease-out)
  let cur = 5, seq = 0;
  const ease = t => 1 - (1 - t) * (1 - t);
  const setX = x => { const v = x.toFixed(1); sel.setAttribute('x1', v); sel.setAttribute('x2', v); };
  const curX = () => parseFloat(sel.getAttribute('x1'));

  function moveLine(from, to) {
    const my = ++seq;
    setX(to);                                     // 프레임이 오지 않아도 최종 위치는 맞는다
    if (from === to || typeof requestAnimationFrame !== 'function') return;
    const t0 = Date.now();                        // 클릭 시각 기준. 프레임이 늦게 와도 경과 시간이 맞는다
    const step = () => {
      if (my !== seq) return;                     // 새 선택이 들어오면 이 이동은 끝난다
      const k = Math.min(1, (Date.now() - t0) / 160);
      setX(k >= 1 ? to : from + (to - from) * ease(k));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function setIdx(i, animate) {
    const n = stops.length;
    i = Math.max(0, Math.min(n - 1, i));
    cur = i;
    const s = stops[i], k = ks[i];
    read.firstChild.nodeValue = '기준 ' + manLab(s[0]) + ' 명 · 로지스틱 ' + f3(s[1]) + ' · 트리 ' + f3(s[2]) + ' · ';
    readk.textContent = '시험용 성공 라벨 ' + k + '편';
    readk.setAttribute('fill', k <= 3 ? '#d64545' : '#1c2230');
    btns.forEach(b => {
      const off = (+b.dataset.d < 0 && i === 0) || (+b.dataset.d > 0 && i === n - 1);
      if (off) { b.setAttribute('disabled', ''); } else { b.removeAttribute('disabled'); }
    });
    if (animate) { moveLine(curX(), px(i)); }
    else { seq++; setX(px(i)); }
  }

  root.querySelectorAll('.hit').forEach(r => {
    r.addEventListener('click', () => setIdx(+r.dataset.i, true));
  });
  btns.forEach(b => b.addEventListener('click', () => setIdx(cur + (+b.dataset.d), true)));

  setIdx(5, false);
}
  const WIDGET_INIT = {sigmoidPath: initW_sigmoidPath, twoDials: initW_twoDials, labelline: initW_labelline, labelcurve: initW_labelcurve};
  function initWidgets(scope) { (scope || document).querySelectorAll('.widget[data-w]').forEach(el => { if (el.dataset.ready) return; const f = WIDGET_INIT[el.dataset.w]; if (f) { f(el, window.LESSON_DATA); el.dataset.ready = '1'; } }); }
  window.initWidgets = initWidgets;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initWidgets()); else initWidgets();
