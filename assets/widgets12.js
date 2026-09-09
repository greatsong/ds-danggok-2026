// 12차시 인터랙티브 위젯 — 슬라이드(teacher/slides/lesson12.html)와 교재(lesson12.html)가 공유한다.
// 각 위젯: <div class="widget" data-w="이름"> 조각 + function initW_이름(root, D). D = window.LESSON_DATA.
// 계약: system/widgets/WIDGET_BRIEF_TEMPLATE.md. <body> 끝에서 로드한다.
  window.LESSON_DATA = {"n":184,"dates":["20250901","20250902","20250903","20250904","20250905","20250908","20250909","20250910","20250911","20250912","20250915","20250916","20250917","20250918","20250919","20250922","20250923","20250924","20250925","20251013","20251014","20251015","20251016","20251017","20251020","20251021","20251022","20251023","20251024","20251027","20251028","20251029","20251030","20251031","20251103","20251104","20251105","20251106","20251107","20251110","20251111","20251114","20251117","20251118","20251119","20251120","20251121","20251124","20251125","20251126","20251127","20251128","20251201","20251202","20251203","20251204","20251205","20251208","20251209","20251217","20251218","20251219","20251222","20251223","20251224","20251226","20251229","20251230","20260202","20260203","20260204","20260205","20260304","20260305","20260306","20260309","20260310","20260311","20260312","20260313","20260316","20260317","20260318","20260319","20260320","20260323","20260324","20260325","20260326","20260327","20260330","20260331","20260401","20260402","20260403","20260406","20260407","20260408","20260409","20260410","20260413","20260414","20260415","20260416","20260417","20260420","20260421","20260422","20260430","20260504","20260506","20260507","20260508","20260511","20260512","20260513","20260514","20260515","20260518","20260519","20260520","20260521","20260522","20260526","20260527","20260528","20260529","20260601","20260602","20260604","20260605","20260608","20260609","20260610","20260611","20260612","20260615","20260616","20260617","20260618","20260619","20260622","20260623","20260624","20260625","20260703","20260706","20260707","20260708","20260709","20260710","20260713","20260714","20260715","20260818","20260819","20260820","20260821","20260824","20260825","20260826","20260827","20260828","20260831","20260901","20260902","20260903","20260904","20260907","20260908","20260909","20260910","20260911","20260914","20260915","20260916","20260917","20260918","20260921","20260922","20260923","20260928","20260929","20260930"],"names":["10월생일후식","3월생일케이크","9월생일케이크","가쓰오브시국","가자미순살튀김","가지나물","간고등어구이","간장찜닭","갈아만든키위주스","감말랭이야채샐러드","감자참치조림","건새우마늘쫑볶음","건새우아욱국","고구마도넛","고구마맛탕","고구마야채튀김","고구마치즈돈까스소스","고구마치즈또띠아","고구마함박소스","고기만두국","고기지짐","고명유부국","고명장국","고추잡채/꽃빵","고추장멸치볶음","고춧잎나물","곤드레나물밥&양념장","곤드레나물밥양념장","골드키위","골드키위케이크","골뱅이소면무침","골뱅이야채무침","곰탕","과일맛음료","과일생크림모찌","과일생크림찹쌀떡","과채주스","국수떡볶이","군만두양념장","궁채나물들깨볶음","귤","귤주스","근대된장국","근대된장무침","김가루밥","김밥맛볶음밥","김치국","김치메밀전병","김치볶음","김치볶음밥","김치어묵국","김치어묵우동","깍두기","깍두기볶음밥","깐쇼새우","깻잎순나물","깻잎쌈무","깻잎지","꼬들단무지무침","꼬치어묵국","꽃만두국","꽈배기","꿀떡","꿀자몽블랙티","꿔바로우&소스","꿔바로우소스","나가사끼짬뽕","나물비빔밥고추장","낙지야채볶음","낙지호롱구이","너비아니조림","누룽지닭죽","다시마감자국","단팥찐빵","단호박묵무침","단호박스프","단호박오리훈제","단호박카레라이스","달걀볶음밥","달걀장조림","달걀찜","달래된장국","달래양념장","달콤한토마토","닭개장","닭고기구이","닭곰탕","닭김치찜","닭꼬치&매콤소스","닭꼬치양념치킨소스","닭날개오븐구이","닭다리닭곰탕","닭다리삼계탕","닭볶음탕","닭카레볶음","더블치즈스테이크소스","더티초코크로와상","도토리묵&양념장","도토리묵무침","도토리묵사발","도토리묵양념장","돈까스샐러드","돈사태김치찜","돈사태떡찜","돈육간장불고기","돈육감자탕","돈육고추장볶음","돈육고추장불고기","돈육고추장찌개","돈육곤약장조림","돈육김치볶음","돈육메추리알조림","돈육불백","돌나물초회","동그랑땡","동그랑땡&케찹","동치미","동파육","돼지갈비찜","두바이쫀득쿠키","두부구이양념장","두부된장국","두부된장찌개","두부쑥갓나물","두부조림","두부카츠돈가스소스","두부튀김칠리S","들기름감자채볶음","등심돈가스브라운","등심돈가스소스","등심돈까스&소스","딸기","딸기맛요구르트","딸기우유","딸기크림빵","떡갈비","떡갈비&소스","떡갈비소스","떡강정","떡꼬치&소스","떡꼬치소스","떡볶이","레드향","레몬크림깐쇼새우","로제분모자떡볶이","마늘쫑무침","마라샹궈","마라탕","마카롱","마파두부","만두탕수","맑은순두부국","맑은콩나물국","맛살달걀볶음","망고야채샐러드","망고우유빙수","매운갈비찜","매운닭볶음","매운닭장각구이","매운어묵꼬치","매운어묵볶음","매콤콩나물무침","메밀막국수","메추리알카레조림","명엽채볶음","모닝마늘빵","목살스테이크","몽글달걀탕","무말랭이무침","무말랭이장아찌","무생채","무쌈","물만두양념장","물비빔쫄면","미나리초무침","미니돈가스&파채","미니돈가스파채","미니온메밀","미니한우쌀국수","미니핫도그케찹","미소국","미역줄기볶음","미트볼데리야끼볶음","밀감푸딩","바나나","바람떡","바베큐폭립","바베큐폭찹","반달단무지","반달스테이크소스","반마리치킨","발효왕만두","방울토마토","배식용김","배추겉절이","배추김치","뱅글뱅글소세지","버섯잡채","벚꽃핀오레오","베리케이크","베이컨감자채전","보쌈김치","복숭아아이스티","볶음낙지소면","볼어묵국","볼어묵볶음","볼어묵조림","봄동겉절이","부추무침","부추해물전","북어국","분홍소시지전","불닭팽이버섯","불마요들기름메밀국수","붕어빵","브로컬리,오징어숙회초장","브로콜리&초장","브로콜리무침","브로콜리쌈다시마초장","브로콜리초장","블루레몬에이드","블루베리&요거트","블루베리샐러드","비건김치만두","비건햄김치볶음밥","비빔국수","뿌리채소고구마맛탕","사과","사과맛요구르트","사과생크림와플","사과앵두스무디","사과치커리생채","삼겹살구이","삼겹살야채구이","삼색과일망고드레싱","삼색피클","삼치감자조림","삼치구이","삼치무조림","삼치양념구이","삼치카레구이","상추&쌈장","상추쌈장","새송이버섯전","새우가스타르s","새우까스칠리S","새우튀김","생선까스콘소스","석박지","성탄케이크","소고기무국","소고기미역국","소고기버섯매운탕","소고기우엉볶음밥","소금우유아이스크림","소떡소떡","소보로토스트","소시지+구운야채","소시지야채볶음","소시지케찹볶음","소시지토스트","쇠고기무국","쇠고기미역국","수박","수육","수제양파고추장아찌","숙주나물무침","순대국","순두부짬뽕국","순두부찌개","순살양념치밥","순살해물아귀찜","슈크림만쥬","슈크림츄스틱","스마일감자튀김","스위티자몽주스","스크램블드에그","스파게티","스팸감자채볶음","스팸마요덮밥","시금치나물","시금치된장국","시래기된장국","시리얼/흰우유","시저샐러드","실곤약야채무침","십원빵","쌈무생채","쌈장","아이스망고","아이스슈","아이스요구르트","아이스크림","아이스홍시","애플망고주스","애호박볶음","애호박새우젓볶음","액상요구르트","야채달걀말이","야채달걀찜","야채모양찐빵","야채튀김","야채햄튀김","양배추샐러드사우전D","양배추쌈/쌈장","양배추쌈/저염쌈장","양상추샐러드","양송이스프","양파무침","어묵바머스터드","어묵바케찹","어묵볶음","어묵튀김","얼갈이된장국","얼갈이된장무침","얼갈이무침","얼큰동태탕","얼큰돼지국밥","얼큰북어국","얼큰소고기무국","얼큰쇠고기무국","얼큰콩나물국","에그타르트","연근부각","연근조림","연두부양념장","열무비빔밥","영양부추무침","오꼬노미야끼","오렌지","오렌지자몽주스","오렌지주스","오리훈제머스터드","오삼불고기","오이,당근,고추쌈장","오이고추된장무침","오이부추무침","오이상추무침","오이새콤무침","오이생채","오이쌈장","오이지무침","오이탕탕이","오이피클","오징어김치전","오징어무국","오징어부추전","오징어숙회초장","오징어야채볶음","오징어초무침","온두부","온두부&김치볶음","온두부김치볶음","올방개묵김가루무침","올방개묵김치무침","요거톡","요구르트","우렁강된장비빔밥","우렁된장찌개","우리밀약과","유부미소국","유자에이드","유채나물무침","육개장","인도난","자두","자두맛음료","자두슬러시","자장면","자장밥","잔멸치볶음","잔치국수","잡채밥","장어덮밥","전복들깨미역국","전통씨앗호떡","제육볶음","젤리","조각배","조각파인애플","조각피자","조랭이떡국","주꾸미돈육볶","주꾸미볶음","주꾸미야채비빔밥","쥐치포조림","지파이","진미채고추장볶음","진미채야채무침","짜사이무침","짜조&칠리파디소스","짜조칠리파디소스","짬뽕국","쫄면야채무침","찐두부","찜닭","차돌박이된장찌개","찰떡아이스","참나물사과무침","참치김치찌개","참치마요구운주먹밥","참치미역국","참치쌈장양배추쌈","참치야채비빔밥","찹쌀호떡아이스크림","채식물만두양념장","채어묵볶음","청경채겉절이","청경채나물","청경채두반장소스","청국장찌개","청사과청귤에이드","청포도","청포도주스","청포묵김가루무침","체리","초당옥수수","초코과자","초코도너츠","초코맛아이스크림","초코수리취떡","초코우유","초코케이크","초코파이","초콜릿칩쿠키","총각김치","추가밥","축하설기","츄러스","치즈가재구이","치즈떡닭갈비","치즈볼","치즈불닭","치즈새우칩","치즈양상추샐러드","치즈핫도그&케찹","치즈핫도그케찹","치킨마요덮밥","치킨샐러드허니머스터드S","치킨스낵랩","치킨텐더머스터드","친환경강황밥","친환경보리밥","친환경잡곡밥","친환경차수수밥","친환경칼슘기장밥","친환경현미밥","친환경흑미밥","카레감자채볶음","카레라이스","칼슘강화귀리밥","칼슘강화기장밥","칼슘강화밥","케이크","코다리강정","코다리조림","코울슬로","코코넛음료","콘치즈버터구이","콩나물밥/양념장","콩나물불고기","크루통스프","크림스프","크림치즈베이글","키위","타워함박스테이크","타코야끼","탄두리치킨","탕수육후르츠소스","토마토스파게티","토마토오이샐러드","토마토카프레제","파김치","파송송달걀국","파채무침","파채소불고기","팽이버섯된장국","팽이장국","포도","포도주스","포테이토치즈스틱","푸딩","풋마늘오징어무침","피자핫도그","한라봉주스","한우쌀국수","한입돈가스파채","핫자몽","해물경단","해물볶음우동","해물순두부찌개","해물완자전","해쉬브라운피자","햄감자볶음","햄전","햄찌개","행운초콜릿","현미육원전","회오리감자","후레쉬업","후리가케김가루밥","후리가케밥","훈제연어&양파소스","훈제연어양파소스","훈제오리야채머스터드","흑임자탕수육소스"],"b":[[2,135,195,197,262,327,451],[42,150,337,376,425,446,464],[4,182,248,280,286,295,363,447],[32,209,248,352,442,478],[155,235,307,426,438,469],[217,248,370,424,430,446,495],[34,52,125,224,266,406,473],[63,195,232,340,358,442,474],[46,52,176,193,253,294,349],[51,52,163,246,426,471],[106,195,237,261,305,359,445],[14,152,195,299,323,384],[159,208,247,248,267,413,447],[7,98,258,289,399,425,443],[195,285,372,379,392,505],[33,144,195,204,301,303,400],[93,161,195,210,387,446,480],[22,77,123,158,195,356],[181,213,248,360,373,379],[0,107,262,298,305,425,451],[27,195,203,466,478,490],[7,55,140,195,297,318,446],[201,225,232,289,340,345,450],[98,195,196,292,426,485],[48,112,170,227,350,381,451],[38,91,248,296,356,388,446],[169,194,264,321,346,451],[39,52,101,205,320,379,451],[58,65,147,195,377,409,426],[40,122,161,195,226,376,447],[21,45,57,195,238,275,328],[96,215,332,399,425,443],[195,222,283,449,465,473],[12,195,197,217,404,451,475],[35,112,195,280,344,371,445],[67,180,195,212,227,244],[21,192,195,217,270,328],[7,10,195,220,321,338,443],[57,73,79,195,313,376,446],[3,28,52,141,279,388],[47,71,98,116,341,426,496],[48,235,260,283,426,469],[40,120,170,195,262,430,451],[11,239,298,399,421,425,442],[20,208,248,265,267,378,447],[122,162,183,194,264,288,446],[90,160,195,434,449,473],[80,179,195,203,261,266,451],[50,107,134,140,407,425,441],[52,128,154,285,426,461,487],[43,52,269,333,428,446,491],[149,188,191,195,369,379,392],[118,161,195,262,298,427,451],[72,170,195,223,227,357,370],[167,195,214,295,325,432,451],[4,52,182,219,421,446,495],[21,145,192,195,364,449,467],[27,40,74,105,193,238,248],[195,266,309,396,430,443,479],[14,93,195,217,252,293,450],[98,112,195,242,316,417,451,466],[65,174,195,342,369,379,473],[82,195,313,376,387,451,464],[98,160,195,268,429,446,463],[16,44,195,249,274,388,462],[52,80,95,294,306,399,443],[68,86,142,172,195,280,452],[21,49,52,131,146,389,440],[118,195,212,262,451,453,491],[56,85,168,195,204,436,451,479],[21,109,195,207,279,498],[131,141,166,177,195,303,426],[105,119,143,161,248,445],[157,195,196,210,324,446,482],[65,78,147,195,308,379],[1,156,195,262,280,298,451],[59,67,131,195,217,466],[16,52,75,228,303,393,446],[112,124,170,195,321,329,442],[47,92,248,254,334,414,447],[7,61,195,200,316,339,445],[70,153,193,355,399,425,443],[172,195,227,261,266,382,447],[104,195,259,269,362,378,441],[52,141,180,202,439,501],[39,52,94,98,214,445,495],[4,22,184,224,387,425],[79,81,195,305,376,421,446],[31,189,248,267,329,444],[277,343,380,426,456,457],[51,195,245,331,408,426],[14,113,192,195,345,432,447],[84,114,148,195,280,446,454],[7,52,108,344,385,445,463],[52,186,193,253,289,303,321],[29,195,243,262,266,451,460],[27,195,206,236,300,381],[93,195,328,329,388,446,476],[86,248,305,366,376,442,488],[180,195,285,379,433,449],[19,182,348,354,412,425,451],[65,188,195,198,339,369,473],[52,103,218,298,399,418,446],[105,123,133,247,248,444,493],[22,52,83,137,208,270],[36,42,140,156,195,408,451],[17,24,195,268,324,459,464],[87,164,179,250,325,425,443],[22,52,141,161,164,279,356],[103,195,295,347,401,422,451],[4,79,248,255,354,363,446],[151,195,266,356,432,443,498],[195,233,242,313,419,442,474],[181,195,273,310,345,395,451],[121,195,223,236,421,459],[46,52,78,124,379,456,468],[52,57,110,281,328,361,446],[178,195,199,391,409,426,471],[171,195,208,272,321,445,504],[217,276,399,425,436,447,503],[72,163,195,234,314,430,443],[169,201,264,329,344,358,446],[21,37,52,302,303,400,411],[35,50,52,129,154,387,451],[132,161,195,250,383,444,458],[60,164,256,280,376,425,441],[18,22,193,195,231,270,499],[15,102,251,353,422,425,445],[124,195,315,345,395,419,446],[105,240,248,258,306,322,450],[112,173,195,287,324,423,426],[195,210,219,299,376,421,445],[83,195,268,271,280,405,443],[9,46,52,89,253,387],[93,195,250,265,446,448,481],[31,129,165,180,195,329,500],[52,100,297,363,438,451,455],[6,67,140,195,410,415],[161,195,205,230,432,443,477],[57,195,213,264,316,379,447],[166,195,420,449,470,473],[11,48,155,187,321,394,451],[22,53,174,182,195,263,276],[41,76,108,126,171,195,446],[193,248,267,335,416,442,486],[22,52,141,161,322,437],[156,195,251,398,451,453,494],[116,223,226,325,326,412,477],[52,111,217,239,446,495,498],[145,195,250,283,311,430,443],[5,23,149,195,289,392,446],[152,197,229,376,402,425,445],[98,208,248,267,292,386,447],[121,190,195,303,341,367,449],[164,195,345,411,445,460,492],[7,52,161,175,192,399,443],[88,105,138,248,336,412,447],[22,45,52,141,280,312,379],[62,107,115,266,366,374,425,445],[4,53,96,121,195,276,306],[13,25,195,313,432,446,497],[8,127,319,351,446,483],[52,166,257,277,343,426,471],[93,182,195,210,314,445,484],[136,195,217,330,370,403,477],[117,124,195,250,407,424,446],[52,130,213,284,307,447],[78,178,195,289,342,390],[25,195,197,251,376,445,453],[67,83,141,195,360,414,502],[79,102,266,282,365,425,446],[52,278,285,363,375,386,442],[195,291,341,384,473,483],[156,195,221,314,381,445,491],[7,99,161,425,431,443,489],[54,105,185,248,299,441,471],[69,195,241,264,358,446,474],[58,64,195,268,368,379,451],[30,208,248,298,317,421,445],[91,195,290,335,344,446,454],[52,112,139,212,399,442,464],[106,210,211,304,397,445,472],[4,26,97,195,345,435],[66,191,195,216,324,359,426]],"paren":[[8,349,"오징어초무침(무x,부찬)"],[9,51,"김치어묵우동(대)"],[12,159,"매운어묵꼬치(소스)"],[14,285,"실곤약야채무침(초)"],[27,101,"돈까스샐러드(허니소스)"],[32,222,"블루베리샐러드(요거D)"],[46,434,"치즈양상추샐러드(발사믹D)"],[49,285,"실곤약야채무침(초)"],[50,43,"근대된장무침(자율)"],[65,306,"양상추샐러드(발사믹D)"],[68,491,"해물완자전(계란)"],[69,168,"무말랭이무침(자율)"],[73,157,"매운닭볶음(정육)"],[84,501,"후리가케밥(소)"],[90,51,"김치어묵우동(대)"],[99,285,"실곤약야채무침(초)"],[100,348,"오징어야채볶음(링)"],[113,395,"찜닭(당면)"],[126,499,"후레쉬업(레몬라임)"],[128,395,"찜닭(당면)"],[129,306,"양상추샐러드(발사믹D)"],[152,292,"아이스크림(컵)"],[159,306,"양상추샐러드(오리엔탈D)"],[160,25,"고춧잎나물(초)"],[168,25,"고춧잎나물(초)"],[169,141,"떡볶이(부찬)"],[171,285,"실곤약야채무침(초)"],[177,368,"자장면(주찬)"]]};
function initW_basket(root, D) {
  // ── 좌표 상수 ────────────────────────────────────────────────
  // 왼쪽 칩 영역 x 24~350, 오른쪽 곡선 x 396~700
  var CX = 24, CLIMIT = 350, CH = 26, CGAP = 31, CTOP = 54, CMAX = 8;
  var PX0 = 396, PX1 = 700, PY0 = 66, PY1 = 250, VMAX = 520;
  var N = D.n, NAMES = D.names, B = D.b, DATES = D.dates;
  var GRAY = '#b9b3a5', SOFT = '#6b7385', INK = '#1c2230';

  var sx = function (i) { return PX0 + i * (PX1 - PX0) / (N - 1); };
  var sy = function (v) { return PY1 - v * (PY1 - PY0) / VMAX; };

  // 글자 폭 어림(한글 1.0em, 숫자·영문 0.58em, 괄호·쉼표 0.35em)
  function tw(s, size) {
    var w = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if ((c >= 0xAC00 && c <= 0xD7A3) || (c >= 0x3130 && c <= 0x318F) || (c >= 0x4E00 && c <= 0x9FFF) || c === 0x2192) w += 1;
      else if (c === 0x28 || c === 0x29 || c === 0x2C || c === 0x2E || c === 0xB7 || c === 0x3A) w += 0.35;
      else if (c === 0x20) w += 0.3;
      else if (c === 0x2F || c === 0x26 || c === 0x2B || c === 0x2D) w += 0.5;
      else w += 0.58;
    }
    return w * size;
  }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function ymd(s) { return s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8); }

  // ── 괄호 대응표: 날짜 → (메뉴 인덱스 → 정리 전 이름) ─────────
  var pmap = {};
  for (var p = 0; p < D.paren.length; p++) {
    var e = D.paren[p];
    if (!pmap[e[0]]) pmap[e[0]] = {};
    pmap[e[0]][e[1]] = e[2];
  }
  function rawOf(d, i) { var m = pmap[d]; return (m && m[i] !== undefined) ? m[i] : null; }

  // ── 누적 메뉴 종류 곡선 두 벌(초기화 때 한 번만 계산) ────────
  function buildCum(rawMode) {
    var seen = {}, k = 0, out = [];
    for (var d = 0; d < N; d++) {
      var row = B[d];
      for (var j = 0; j < row.length; j++) {
        var i = row[j], r = rawMode ? rawOf(d, i) : null;
        var key = r === null ? 'c' + i : 'r' + r;
        if (seen[key] !== 1) { seen[key] = 1; k++; }
      }
      out.push(k);
    }
    return out;
  }
  var CUM = { clean: buildCum(false), raw: buildCum(true) };
  function poly(arr) {
    var s = [];
    for (var i = 0; i < N; i++) s.push(sx(i).toFixed(1) + ',' + sy(arr[i]).toFixed(1));
    return s.join(' ');
  }

  // ── 요소 ─────────────────────────────────────────────────────
  var q = function (s) { return root.querySelector(s); };
  var chips = q('.chips'), sumT = q('.sum');
  var cClean = q('.cclean'), cRaw = q('.craw'), curves = cClean.parentNode;
  var vline = q('.vline'), dot = q('.cdot'), dval = q('.cval');
  var l1 = q('.foot1'), l2 = q('.foot2');
  var out = q('.wout'), slider = q('input[type="range"]');
  var btns = Array.prototype.slice.call(root.querySelectorAll('.wbtn'));

  cClean.setAttribute('points', poly(CUM.clean));
  cRaw.setAttribute('points', poly(CUM.raw));

  var mode = 'clean', day = Math.max(0, Math.min(N - 1, +slider.value || 0));

  // ── 왼쪽: 하루 메뉴 칩 ───────────────────────────────────────
  function drawChips() {
    var row = B[day], buf = [], fold = row.length > CMAX;
    var show = fold ? CMAX - 1 : row.length;
    for (var k = 0; k < show; k++) {
      var i = row[k], top = CTOP + CGAP * k, base = top + 18;
      var raw = rawOf(day, i);
      var label = (mode === 'raw' && raw !== null) ? raw : NAMES[i];
      var cw = Math.min(300, label.length * 15 + 20);
      var cx = CX;
      if (mode === 'clean' && raw !== null) {
        var gw = tw(raw, 14);
        var avail = Math.max(40, CLIMIT - CX - 28 - cw);   // 병기에 쓸 수 있는 폭
        var gwUse = Math.min(gw, avail);
        var adj = gw > avail ? ' textLength="' + gwUse.toFixed(1) + '" lengthAdjust="spacingAndGlyphs"' : '';
        buf.push('<text x="' + CX + '" y="' + base + '" font-size="14" fill="' + GRAY + '"' + adj + '>' + esc(raw) + '</text>');
        buf.push('<text x="' + (CX + gwUse + 6).toFixed(1) + '" y="' + base + '" font-size="14" fill="' + GRAY + '">&#8594;</text>');
        cx = CX + gwUse + 28;
      }
      buf.push('<rect x="' + cx.toFixed(1) + '" y="' + top + '" width="' + cw + '" height="' + CH + '" rx="6" fill="#ffffff" stroke="#e3ddcf"/>');
      buf.push('<text x="' + (cx + 10).toFixed(1) + '" y="' + base + '" font-size="15" fill="' + INK + '">' + esc(label) + '</text>');
    }
    if (fold) {
      var t2 = CTOP + CGAP * (CMAX - 1), lab = '외 ' + (row.length - show) + '개';
      buf.push('<rect x="' + CX + '" y="' + t2 + '" width="' + (lab.length * 15 + 20) + '" height="' + CH + '" rx="6" fill="#ffffff" stroke="#e3ddcf"/>');
      buf.push('<text x="' + (CX + 10) + '" y="' + (t2 + 18) + '" font-size="15" fill="' + SOFT + '">' + lab + '</text>');
    }
    chips.innerHTML = buf.join('');
  }

  // ── 오른쪽: 현재 위치 표시 ───────────────────────────────────
  function drawMark() {
    var v = CUM[mode][day], x = sx(day), y = sy(v);
    vline.setAttribute('x1', x.toFixed(1)); vline.setAttribute('x2', x.toFixed(1));
    dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1));
    var right = x <= 640;
    dval.setAttribute('x', (right ? x + 10 : x - 10).toFixed(1));
    dval.setAttribute('y', Math.max(78, Math.min(244, y + 6)).toFixed(1));
    dval.setAttribute('text-anchor', right ? 'start' : 'end');
    dval.textContent = v + (mode === 'clean' ? '종' : '개');
  }

  function drawFoot() {
    if (mode === 'clean') {
      l1.textContent = '184일 · 506종'; l2.textContent = '괄호 그대로면 510개';
    } else {
      l1.textContent = '184일 · 510개'; l2.textContent = '괄호 제거하면 506종';
    }
  }

  function drawHead() {
    var n = B[day].length, pr = n * (n - 1) / 2;
    sumT.textContent = ymd(DATES[day]) + ' · 메뉴 ' + n + '개 · 만들어지는 쌍 ' + pr + '개';
    out.textContent = ymd(DATES[day]) + ' (' + (day + 1) + '일차)';
  }

  function redraw() { drawHead(); drawChips(); drawMark(); }

  // ── 곡선 색 전환(200ms) ──────────────────────────────────────
  var C1 = [43, 127, 214], C2 = [185, 179, 165], seq = 0, raf = 0;
  function hex(c) {
    return '#' + c.map(function (v) { var s = Math.round(v).toString(16); return s.length < 2 ? '0' + s : s; }).join('');
  }
  function setCurves(k) {           // k 0→1, 현재 기준 곡선이 파랑이 되는 진행률
    var cur = mode === 'clean' ? cClean : cRaw, oth = mode === 'clean' ? cRaw : cClean;
    var a = [], b = [];
    for (var i = 0; i < 3; i++) { a.push(C2[i] + (C1[i] - C2[i]) * k); b.push(C1[i] + (C2[i] - C1[i]) * k); }
    cur.setAttribute('stroke', hex(a)); oth.setAttribute('stroke', hex(b));
  }
  function applyMode(anim) {
    var cur = mode === 'clean' ? cClean : cRaw, oth = mode === 'clean' ? cRaw : cClean;
    cur.setAttribute('stroke-width', '2'); cur.setAttribute('opacity', '1');
    oth.setAttribute('stroke-width', '1.5'); oth.setAttribute('opacity', '.6');
    curves.appendChild(oth); curves.appendChild(cur);   // 현재 기준 곡선을 앞으로
    if (!anim) { setCurves(1); return; }
    var my = ++seq, t0 = -1;
    if (raf) cancelAnimationFrame(raf);
    var step = function (ts) {
      if (my !== seq) return;
      if (t0 < 0) t0 = ts;
      var k = Math.min(1, (ts - t0) / 200);
      setCurves(k);
      if (k < 1) raf = requestAnimationFrame(step); else raf = 0;
    };
    setCurves(0);
    raf = requestAnimationFrame(step);
  }

  // ── 리스너 ───────────────────────────────────────────────────
  slider.addEventListener('input', function () {
    day = Math.max(0, Math.min(N - 1, +slider.value || 0));
    redraw();
  });
  btns.forEach(function (bt) {
    bt.addEventListener('click', function () {
      var m = bt.getAttribute('data-m');
      if (m === mode) return;
      mode = m;
      btns.forEach(function (o) { o.classList.toggle('on', o.getAttribute('data-m') === mode); });
      drawFoot(); drawChips(); drawMark(); applyMode(true);
    });
  });

  drawFoot(); redraw(); applyMode(false);
}

function initW_baseline(root, D) {
  // ── 파생값 — 조립할 때 이 derive 블록을 파일 스코프로 올려 minco와 공유한다 ──
  // single 메뉴별 등장 일수 · dayOf 메뉴별 등장 날짜 · pair 쌍별 동시 일수 3,146개 · rules 양방향 6,292개
  function derive(D) {
    const N = D.n, M = D.names.length;
    const single = new Array(M).fill(0), dayOf = new Array(M);
    for (let i = 0; i < M; i++) dayOf[i] = new Set();
    const pair = new Map();
    for (let d = 0; d < N; d++) {
      const row = D.b[d];
      for (let j = 0; j < row.length; j++) { single[row[j]]++; dayOf[row[j]].add(d); }
      for (let j = 0; j < row.length; j++) for (let k = j + 1; k < row.length; k++) {
        const u = row[j], v = row[k], key = (u < v ? u : v) * 100000 + (u < v ? v : u);
        pair.set(key, (pair.get(key) || 0) + 1);
      }
    }
    function rule(ai, bi, co) {
      const na = single[ai], nb = single[bi], conf = na ? co / na : 0, base = nb / N;
      return { ai: ai, bi: bi, an: D.names[ai], bn: D.names[bi], co: co, na: na, nb: nb, N: N,
        conf: conf, base: base, lift: base ? conf / base : 0, tag: '' };
    }
    const rules = [];
    pair.forEach(function (co, key) {
      const a = Math.floor(key / 100000), b = key % 100000;
      rules.push(rule(a, b, co), rule(b, a, co));
    });
    // 동점 처리: 이름은 글자 코드 순서로 비교해 어느 브라우저에서나 같은 순위가 나오게 한다
    const S = (x, y) => (x < y ? -1 : x > y ? 1 : 0);
    const NC = (p, r) => S(p.an, r.an) || S(p.bn, r.bn);
    const CMP = {
      lift: (p, r) => r.lift - p.lift || r.co - p.co || r.conf - p.conf || NC(p, r),
      conf: (p, r) => r.conf - p.conf || r.co - p.co || r.lift - p.lift || NC(p, r),
      co: (p, r) => r.co - p.co || r.lift - p.lift || r.conf - p.conf || NC(p, r)
    };
    return { N: N, single: single, dayOf: dayOf, pair: pair, rules: rules, rule: rule, CMP: CMP };
  }
  const G = derive(D), CMP = G.CMP, dayOf = G.dayOf;

  // ── 좌표 상수: 자 x 214~700(길이 486), 왼쪽 라벨 폭 180, 수치판 안쪽 392~688 ──
  const X0 = 214, LEN = 486, LABW = 180, CARDX = 392, CARDW = 296;

  // ── 세트 ① 급식 184일 — 동시 5일 이상 26쌍 × 양방향 = 52개 ──
  const mealList = G.rules.filter(r => r.co >= 5).sort(CMP.lift);

  // ── 세트 ② 표 밖 조합 — 이름만 지정하고 값은 같은 데이터에서 계산 ──
  const idxOf = new Map();
  for (let i = 0; i < D.names.length; i++) if (!idxOf.has(D.names[i])) idxOf.set(D.names[i], i);
  const OUT = [['스파게티', '오이피클'], ['떡갈비', '영양부추무침'], ['떡볶이', '배추김치'], ['배추김치', '깍두기']];
  const outList = [];
  for (let i = 0; i < OUT.length; i++) {
    const a = idxOf.get(OUT[i][0]), b = idxOf.get(OUT[i][1]);
    if (a === undefined || b === undefined) continue;
    const key = (a < b ? a : b) * 100000 + (a < b ? b : a);
    const r = G.rule(a, b, G.pair.get(key) || 0);
    r.tag = r.co === 0 ? '동시 0일 · 규칙 후보 아님' : '동시 5일 미만 · 표 밖';
    outList.push(r);
  }

  // ── 세트 ③ 손계산 20일 — 활동지 자작 수치 ──
  function raw(an, bn, co, na, nb, N) {
    const conf = na ? co / na : 0, base = nb / N;
    return { ai: -1, bi: -1, an: an, bn: bn, co: co, na: na, nb: nb, N: N,
      conf: conf, base: base, lift: base ? conf / base : 0, tag: '' };
  }
  const handList = [raw('콜라', '포테토칩', 6, 8, 10, 20), raw('순대국', '석박지', 2, 2, 8, 20)];

  const SETS = {
    meal: { list: mealList, sortable: true },
    out: { list: outList, sortable: false },
    hand: { list: handList, sortable: false }
  };
  function flipOf(r) {
    const f = r.ai >= 0 ? G.rule(r.bi, r.ai, r.co) : raw(r.bn, r.an, r.co, r.nb, r.na, r.N);
    f.tag = r.tag;
    return f;
  }

  // ── 표시용 반올림(계산은 원래 값으로 한다) ──
  const f2 = v => v.toFixed(2);
  const fBase = v => (v < 0.01 ? v.toFixed(3) : v.toFixed(2));
  const fLift = v => (v < 10 ? v.toFixed(2) : v.toFixed(1));

  // 글자 폭: 실제 렌더 길이를 우선 쓰고, 잴 수 없으면 한글 1.0 · 공백 0.3 · 그 밖 0.55로 어림한다
  function guess(s, size) {
    let w = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c === 32) w += size * 0.3;
      else if ((c >= 0xAC00 && c <= 0xD7A3) || (c >= 0x3130 && c <= 0x318F) || (c >= 0x4E00 && c <= 0x9FFF) || c === 0x2192) w += size;
      else w += size * 0.55;
    }
    return w;
  }
  function put(el, s, size) {
    el.textContent = s;
    const m = el.getComputedTextLength ? el.getComputedTextLength() : 0;
    return m > 0 ? m : guess(s, size);
  }

  // ── 요소 ──
  const q = s => root.querySelector(s);
  const ttl = q('.ttl'), bdg = q('.bdg'), bdgBox = q('.bdgbox'), bdgTxt = q('.bdgtxt');
  const bar1 = q('.bar1'), ov1 = q('.ov1'), cap1 = q('.cap1'), val1 = q('.val1'), lead1 = q('.lead1');
  const bar2 = q('.bar2'), val2 = q('.val2'), lead2 = q('.lead2'), baseL = q('.baseL');
  const l1a = q('.l1a'), l1b = q('.l1b'), l2a = q('.l2a'), l2b = q('.l2b');
  const gridG = q('.grid'), gnote = q('.gnote');
  const c1a = q('.c1a'), c1b = q('.c1b'), c2 = q('.c2'), c3 = q('.c3');
  const c4a = q('.c4a'), c4b = q('.c4b'), c5 = q('.c5');
  const rng = q('.rng'), wout = q('.wout'), dirBtn = q('.dir');
  const setBtns = Array.prototype.slice.call(root.querySelectorAll('.wbtn[data-set]'));
  const sortBtns = Array.prototype.slice.call(root.querySelectorAll('.wbtn[data-sort]'));

  // ── 격자: 칸 13×13 · 간격 2 · 좌상단 (24, 196) ──
  const CELL = { free: ['#e3ddcf', '1'], a: ['#2b7fd6', '0.35'], b: ['#b07a00', '0.35'], both: ['#d64545', '1'] };
  function tone(r, d) {
    let a, b;
    if (r.ai >= 0) { a = dayOf[r.ai].has(d); b = dayOf[r.bi].has(d); }
    else { a = d < r.na; b = d < r.co || (d >= r.na && d < r.na + r.nb - r.co); }   // 겹침 → 조건만 → 결과만 → 빈 칸
    return a && b ? CELL.both : a ? CELL.a : b ? CELL.b : CELL.free;
  }
  let layoutKey = '', cells = null;
  function grid(r) {
    const N = r.N, cols = Math.min(23, N), key = N + '/' + cols;
    if (key !== layoutKey) {                       // 행·열이 바뀌면 색을 박아 넣고 다시 그린다(전환 없음)
      layoutKey = key;
      let s = '';
      for (let i = 0; i < N; i++) {
        const t = tone(r, i);
        s += '<rect x="' + (24 + (i % cols) * 15) + '" y="' + (196 + Math.floor(i / cols) * 15) +
          '" width="13" height="13" rx="2" fill="' + t[0] + '" fill-opacity="' + t[1] +
          '" style="transition:fill .18s linear,fill-opacity .18s linear"/>';
      }
      gridG.innerHTML = s;
      cells = gridG.children;
      return true;
    }
    for (let d = 0; d < N; d++) {
      const t = tone(r, d), el = cells[d];
      el.style.fill = t[0];
      el.style.fillOpacity = t[1];
    }
    return false;
  }

  // ── 막대 그리기 ──
  const width = v => { const w = LEN * v; return w <= 0.01 ? 0 : Math.max(w, 3); };   // 최소 폭 3px
  function label(txt, lead, d, ym, s, color) {
    const end = X0 + d;
    if (end > 630) {                               // 자 끝에 닿으면 막대 안쪽 흰 글자
      txt.setAttribute('x', (end - 8).toFixed(1));
      txt.setAttribute('text-anchor', 'end');
      txt.setAttribute('fill', '#ffffff');
      lead.setAttribute('stroke-opacity', '0');
    } else if (d > 0 && d < 26) {                  // 막대가 짧으면 값을 띄우고 가로 지시선으로 잇는다
      txt.setAttribute('x', String(X0 + 32));
      txt.setAttribute('text-anchor', 'start');
      txt.setAttribute('fill', color);
      lead.setAttribute('x1', end.toFixed(1));
      lead.setAttribute('x2', String(X0 + 27));
      lead.setAttribute('y1', String(ym));
      lead.setAttribute('y2', String(ym));
      lead.setAttribute('stroke-opacity', '1');
    } else {
      txt.setAttribute('x', (end + (d === 0 ? 8 : 6)).toFixed(1));
      txt.setAttribute('text-anchor', 'start');
      txt.setAttribute('fill', color);
      lead.setAttribute('stroke-opacity', '0');
    }
    txt.textContent = s;
  }
  function paint(c, b) {
    const d1 = width(c), d2 = width(b), e1 = X0 + d1, bx = X0 + d2;
    bar1.setAttribute('width', d1.toFixed(1));
    bar2.setAttribute('width', d2.toFixed(1));
    cap1.setAttribute('stroke-opacity', d1 === 0 ? '1' : '0');   // 신뢰도 0이면 세로 마감선만
    baseL.setAttribute('x1', bx.toFixed(1));
    baseL.setAttribute('x2', bx.toFixed(1));
    if (e1 >= bx) {
      ov1.setAttribute('x', bx.toFixed(1));
      ov1.setAttribute('width', (e1 - bx).toFixed(1));
      ov1.setAttribute('fill-opacity', '0.55');
    } else {
      ov1.setAttribute('x', e1.toFixed(1));
      ov1.setAttribute('width', (bx - e1).toFixed(1));
      ov1.setAttribute('fill-opacity', '0.25');
    }
    label(val1, lead1, d1, 71, f2(c), '#2b7fd6');
    label(val2, lead2, d2, 119, fBase(b), '#6b7385');
  }

  // ── 애니메이션: rAF 1개로 두 막대와 기준 점선을 함께 굴린다 ──
  let disp = null, raf = 0;
  function roll(c, b, instant) {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (instant || !disp) { disp = { c: c, b: b }; paint(c, b); return; }
    const s = { c: disp.c, b: disp.b };
    let t0 = -1;
    const step = ts => {
      if (t0 < 0) t0 = ts;
      const t = Math.min(1, (ts - t0) / 300), k = 1 - (1 - t) * (1 - t);
      disp = { c: s.c + (c - s.c) * k, b: s.b + (b - s.b) * k };
      paint(disp.c, disp.b);
      if (t < 1) raf = requestAnimationFrame(step);
      else { raf = 0; disp = { c: c, b: b }; }
    };
    raf = requestAnimationFrame(step);
  }

  // ── 두 줄 접기: 한 줄이 한도를 넘으면 조건과 결과를 나누어 적는다 ──
  function fold(a, b, full, head, tail, y1, y2, ym) {
    if (put(a, full, 14) <= LABW) { a.setAttribute('y', String(ym)); b.textContent = ''; return; }
    a.setAttribute('y', String(y1)); put(a, head, 14);
    b.setAttribute('y', String(y2)); b.textContent = tail;
  }
  function badge(r) {
    const t = r.tag || (r.lift >= 0.9 && r.lift <= 1.1 ? '기본 등장률과 비슷함' : '');
    if (!t) { bdg.setAttribute('opacity', '0'); bdgTxt.textContent = ''; return; }
    bdg.setAttribute('opacity', '1');
    const w = put(bdgTxt, t, 14) + 24, x = 700 - w;
    bdgBox.setAttribute('x', x.toFixed(1));
    bdgBox.setAttribute('width', w.toFixed(1));
    bdgBox.setAttribute('stroke', r.tag ? '#e3ddcf' : '#b07a00');
    bdgTxt.setAttribute('x', (x + 12).toFixed(1));
    bdgTxt.setAttribute('fill', r.tag ? '#6b7385' : '#b07a00');
  }

  // ── 상태 ──
  let setKey = 'meal', sortKey = 'lift', idx = 40, flip = false;
  const view = () => (flip ? flipOf(SETS[setKey].list[idx]) : SETS[setKey].list[idx]);

  function draw(instant) {
    const r = view();
    ttl.textContent = r.an + ' → ' + r.bn;
    badge(r);
    fold(l1a, l1b, r.an + ' 나온 날 중 ' + r.bn, r.an + ' 나온 날 중', r.bn, 70, 88, 76);
    fold(l2a, l2b, r.N + '일 전체 중 ' + r.bn, r.N + '일 전체 중', r.bn, 118, 136, 124);
    gnote.setAttribute('opacity', setKey === 'hand' ? '1' : '0');

    const one = '동시 ' + r.co + '칸 · ' + r.an + ' ' + r.na + '칸 · ' + r.bn + ' ' + r.nb + '칸 · 전체 ' + r.N + '칸';
    if (put(c1a, one, 14) <= CARDW) { c1a.setAttribute('y', '212'); c1b.textContent = ''; }
    else {
      c1a.setAttribute('y', '204');
      c1a.textContent = '동시 ' + r.co + '칸 · 전체 ' + r.N + '칸';
      c1b.setAttribute('y', '222');
      c1b.textContent = r.an + ' ' + r.na + '칸 · ' + r.bn + ' ' + r.nb + '칸';
    }
    c2.textContent = '신뢰도 = ' + r.co + ' ÷ ' + r.na + ' = ' + f2(r.conf);
    c3.textContent = '기본 등장률 = ' + r.nb + ' ÷ ' + r.N + ' = ' + fBase(r.base);
    const pre = '향상도 = ' + f2(r.conf) + ' ÷ ' + fBase(r.base) + ' =';
    const pw = put(c4a, pre, 15);
    c4b.setAttribute('x', (CARDX + pw + 8).toFixed(1));
    c4b.textContent = fLift(r.lift);
    const band = r.lift >= 0.9 && r.lift <= 1.1;
    c4a.setAttribute('fill', band ? '#b07a00' : '#1c2230');
    c4b.setAttribute('fill', band ? '#b07a00' : '#1c2230');
    c5.textContent = r.co === 0 ? '독립을 가정한 기대 동시 일수 ≈ ' + (r.na * r.nb / r.N).toFixed(1) + '일' : '';

    const fresh = grid(r);
    wout.textContent = (idx + 1) + ' / ' + SETS[setKey].list.length;
    roll(r.conf, r.base, instant || fresh);
  }
  function go(i, instant) {
    const n = SETS[setKey].list.length;
    idx = i < 0 ? 0 : i > n - 1 ? n - 1 : i;
    flip = false;                                  // 규칙을 옮기면 조건·결과는 사양의 방향으로 돌아온다
    rng.value = String(idx);
    draw(instant);
  }

  for (let i = 0; i < setBtns.length; i++) (function (btn) {
    btn.addEventListener('click', function () {
      const k = btn.getAttribute('data-set');
      if (k === setKey) return;
      setKey = k;
      for (let j = 0; j < setBtns.length; j++) setBtns[j].classList.toggle('on', setBtns[j] === btn);
      const on = SETS[setKey].sortable;
      for (let j = 0; j < sortBtns.length; j++) sortBtns[j].disabled = !on;
      rng.max = String(SETS[setKey].list.length - 1);
      go(0, true);
    });
  })(setBtns[i]);

  for (let i = 0; i < sortBtns.length; i++) (function (btn) {
    btn.addEventListener('click', function () {
      const k = btn.getAttribute('data-sort');
      if (k === sortKey || !SETS[setKey].sortable) return;
      sortKey = k;
      for (let j = 0; j < sortBtns.length; j++) sortBtns[j].classList.toggle('on', sortBtns[j] === btn);
      const keep = SETS.meal.list[idx];
      SETS.meal.list = SETS.meal.list.slice().sort(CMP[k]);   // 보던 규칙을 새 순위에서 다시 찾는다
      const L = SETS.meal.list;
      let at = 0;
      for (let j = 0; j < L.length; j++) if (L[j].ai === keep.ai && L[j].bi === keep.bi) { at = j; break; }
      go(at, false);
    });
  })(sortBtns[i]);

  rng.addEventListener('input', function () { go(Number(rng.value), false); });

  dirBtn.addEventListener('click', function () {
    const S = SETS[setKey], r = view();
    if (S.sortable) {                              // 급식 세트는 뒤집은 규칙도 52개 안에 있다
      const L = S.list;
      for (let j = 0; j < L.length; j++) if (L[j].ai === r.bi && L[j].bi === r.ai) { go(j, false); return; }
      draw(false);
    } else { flip = !flip; draw(false); }
  });

  rng.max = String(SETS.meal.list.length - 1);
  go(40, true);
}

function initW_minco(root, D) {
  // ── 파생값: baseline과 같은 derive(D) ── 메뉴별 등장 일수 → 쌍별 동시 일수 → 양방향 규칙 6,292개
  // widgets12.js에 공용 derive(D)를 두면 이 블록을 그대로 옮기고 G = derive(D)만 남긴다.
  function derive(src) {
    var NM = src.names.length, single = new Array(NM), i, x, y, d;
    for (i = 0; i < NM; i++) single[i] = 0;
    var pairMap = new Map();
    for (d = 0; d < src.b.length; d++) {
      var row = src.b[d];
      for (x = 0; x < row.length; x++) single[row[x]]++;
      for (x = 0; x < row.length; x++)
        for (y = x + 1; y < row.length; y++) {
          var k = row[x] * 100000 + row[y];
          pairMap.set(k, (pairMap.get(k) || 0) + 1);
        }
    }
    var N = src.n, rules = [], hist = {};
    function mk(ai, bi, co) {
      var na = single[ai], nb = single[bi], conf = na ? co / na : 0, base = nb / N;
      return { ai: ai, bi: bi, an: src.names[ai], bn: src.names[bi], co: co, conf: conf, lift: base ? conf / base : 0 };
    }
    pairMap.forEach(function (co, k) {
      var a = Math.floor(k / 100000), b = k % 100000;
      hist[co] = (hist[co] || 0) + 1;
      rules.push(mk(a, b, co));
      rules.push(mk(b, a, co));
    });
    // 동점 처리: 이름은 글자 코드 순서로 비교해 어느 브라우저에서나 같은 순위가 나오게 한다(baseline과 동일)
    var S = function (p, r) { return p < r ? -1 : p > r ? 1 : 0; };
    rules.sort(function (p, r) {
      return r.lift - p.lift || r.co - p.co || r.conf - p.conf || S(p.an, r.an) || S(p.bn, r.bn);
    });
    return { rules: rules, hist: hist, single: single };
  }

  var G = derive(D), rules = G.rules, hist = G.hist, i, p;

  var cos = [];
  for (var h in hist) cos.push(Number(h));
  cos.sort(function (a, b) { return a - b; });
  var TOTAL = 0, TAIL = 0;
  for (i = 0; i < cos.length; i++) { TOTAL += hist[cos[i]]; if (cos[i] >= 2) TAIL += hist[cos[i]]; }

  var TMIN = 1, TMAX = 10;
  // 기준별 값은 한 번만 계산한다 — 슬라이더는 co >= 기준 필터만 건다
  var byT = {};
  for (var t = TMIN; t <= TMAX; t++) {
    var cnt = 0, top = [], best = 0, tie = 0;
    for (p = 0; p < rules.length; p++) {
      if (rules[p].co < t) continue;
      if (!cnt) best = rules[p].lift;
      cnt++;
      if (top.length < 2) top.push(rules[p]);
      if (Math.abs(rules[p].lift - best) <= 1e-9) tie++;
    }
    byT[t] = { cnt: cnt, top: top, best: best, tie: tie };
  }

  var FA = D.names.indexOf('제육볶음'), FB = D.names.indexOf('배추김치'), fixed = null;
  for (p = 0; p < rules.length; p++) if (rules[p].ai === FA && rules[p].bi === FB) { fixed = rules[p]; break; }

  // ── 띠 구간 좌표: 폭 = 쌍 수 비율 × 676 ──
  var X0 = 24, W = 676, X1 = X0 + W, LIM = 712;
  var seg1 = [], seg2 = [], a1 = X0, a2 = X0, w;
  for (i = 0; i < cos.length; i++) {
    w = hist[cos[i]] / TOTAL * W;
    seg1.push({ co: cos[i], x: a1, w: w }); a1 += w;
    if (cos[i] >= 2) { w = hist[cos[i]] / TAIL * W; seg2.push({ co: cos[i], x: a2, w: w }); a2 += w; }
  }
  function cutX(list, th) {
    for (var j = 0; j < list.length; j++) if (list[j].co >= th) return list[j].x;
    return X1;
  }

  function comma(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function shortLift(v) { var s = v.toFixed(2); return s.charAt(s.length - 1) === '0' ? s.slice(0, -1) : s; }
  // 글자 폭: 실제 렌더 길이를 우선 쓰고, 잴 수 없으면 한글 1.0 · 공백 0.3 · 그 밖 0.55로 어림한다
  function guess(s, size) {
    var v = 0, c;
    for (var j = 0; j < s.length; j++) {
      c = s.charCodeAt(j);
      v += c === 32 ? size * 0.3 : (c > 0x1100 ? size : size * 0.55);
    }
    return v;
  }
  function put(el, s, size) {
    el.textContent = s;
    var m = el.getComputedTextLength ? el.getComputedTextLength() : 0;
    return m > 0 ? m : guess(s, size);
  }

  // ── 요소 ──
  var q = function (s) { return root.querySelector(s); };
  var rc1 = root.querySelectorAll('.b1r'), rc2 = root.querySelectorAll('.b2r'), tks = root.querySelectorAll('.tkl');
  var cg1 = q('.cg1'), cg2 = q('.cg2'), cutlab = q('.cutlab'), lk1 = q('.lk1');
  var sum = q('.sum'), sum2 = q('.sum2'), b1in = q('.b1in');
  var slider = q('.thr'), wout = q('.wout'), bdg = q('.bdg');
  var rows = [], s;
  for (i = 1; i <= 3; i++) {
    s = '.r' + i;
    rows.push({ g: q(s), c0: q(s + ' .c0'), c1: q(s + ' .c1'), c2: q(s + ' .c2'), c3: q(s + ' .c3') });
  }

  function lay(nodes, list, y, hh) {
    for (var j = 0; j < nodes.length; j++) {
      if (j >= list.length) { nodes[j].setAttribute('display', 'none'); continue; }
      nodes[j].setAttribute('x', list[j].x.toFixed(2));
      nodes[j].setAttribute('y', String(y));
      nodes[j].setAttribute('width', Math.max(list[j].w, 0.8).toFixed(2));  // 0.8 아래로는 줄이지 않는다(구간을 지우지 않기 위해)
      nodes[j].setAttribute('height', String(hh));
    }
  }
  lay(rc1, seg1, 52, 26);
  lay(rc2, seg2, 112, 22);
  lk1.setAttribute('x1', cutX(seg1, 2).toFixed(2));   // 확대 대상(동시 2일 이상)의 왼쪽 끝

  // 띠 ② 아래 동시 일수 숫자 — 폭 2px대인 9·16·17일은 왼쪽 안내 문구로 대신한다
  (function () {
    var prev = -1e9, j, sg, lab, wd, pos;
    for (j = 0; j < tks.length; j++) {
      sg = seg2[j];
      if (!sg || sg.co > 7) { tks[j].setAttribute('display', 'none'); continue; }
      lab = String(sg.co);
      wd = guess(lab, 14);
      pos = sg.x + sg.w / 2;
      if (pos - wd / 2 < prev + 6) pos = prev + 6 + wd / 2;
      if (pos + wd / 2 > LIM) { tks[j].setAttribute('display', 'none'); continue; }
      tks[j].setAttribute('display', '');
      tks[j].setAttribute('x', pos.toFixed(2));
      tks[j].textContent = lab;
      prev = pos + wd / 2;
    }
  })();

  // ── 조작 ──
  function paint(th) {
    var j, on;
    for (j = 0; j < rc1.length && j < seg1.length; j++) {
      on = seg1[j].co >= th;
      rc1[j].setAttribute('fill', on ? '#2b7fd6' : '#b9b3a5');
      rc1[j].setAttribute('fill-opacity', on ? '1' : '0.45');
    }
    for (j = 0; j < rc2.length && j < seg2.length; j++) {
      on = seg2[j].co >= th;
      rc2[j].setAttribute('fill', on ? '#2b7fd6' : '#b9b3a5');
      rc2[j].setAttribute('fill-opacity', on ? '1' : '0.45');
    }
    b1in.setAttribute('fill', th <= 1 ? '#ffffff' : '#1c2230');
  }

  // 자르는 선은 transform 전환으로 옮긴다 — 화면이 멈춰 있어도 끝 위치에 그대로 놓인다
  function placeCut(xa, xb, th) {
    cg1.style.transform = 'translate(' + xa.toFixed(2) + 'px,0)';
    cg2.style.transform = 'translate(' + xb.toFixed(2) + 'px,0)';
    var lab = '기준 ' + th + '일', wd = put(cutlab, lab, 14);
    if (xa + 6 + wd <= LIM) { cutlab.setAttribute('x', (xa + 6).toFixed(2)); cutlab.setAttribute('text-anchor', 'start'); }
    else { cutlab.setAttribute('x', (xa - 6).toFixed(2)); cutlab.setAttribute('text-anchor', 'end'); }
  }

  function fillRow(slot, r, color) {
    if (!r) { slot.g.setAttribute('display', 'none'); return; }
    slot.g.setAttribute('display', '');
    slot.c0.textContent = r.an + ' → ' + r.bn;
    slot.c1.textContent = String(r.co);
    slot.c2.textContent = r.conf.toFixed(2);
    slot.c3.textContent = r.lift.toFixed(2);
    slot.c0.setAttribute('fill', color); slot.c1.setAttribute('fill', color);
    slot.c2.setAttribute('fill', color); slot.c3.setAttribute('fill', color);
  }

  function table(th) {
    var d = byT[th];
    var head = '기준 ' + th + '일 · 규칙 ' + comma(d.cnt) + '개 · 최고 향상도 ' + shortLift(d.best);
    var hw = put(sum, head, 17), note = '';
    if (th === TMIN) note = '향상도 ' + shortLift(d.best) + '인 규칙 ' + comma(d.tie) + '개';
    else if (th >= 8) note = '남은 규칙은 자주 나오는 메뉴끼리의 겹침';
    sum2.setAttribute('fill', th === TMIN ? '#b07a00' : '#6b7385');
    if (!note) { sum2.textContent = ''; }
    else {
      var nw = put(sum2, note, 14), nx = X0 + hw + 12;   // 요약 줄 바로 뒤에 붙이고, 넘칠 때만 오른쪽으로 물러난다
      if (nx + nw > LIM) { sum2.setAttribute('x', String(LIM)); sum2.setAttribute('text-anchor', 'end'); }
      else { sum2.setAttribute('x', nx.toFixed(2)); sum2.setAttribute('text-anchor', 'start'); }
    }

    fillRow(rows[0], d.top[0], '#1c2230');
    fillRow(rows[1], d.top[1], '#1c2230');
    var alive = fixed.co >= th;                    // 고정 행: 기준에 걸리면 회색 + 배지
    fillRow(rows[2], fixed, alive ? '#2b7fd6' : '#b9b3a5');
    bdg.setAttribute('display', alive ? 'none' : '');
  }

  function set(th, instant) {
    wout.textContent = th + '일';
    paint(th);                                     // 구간 색 250ms 전환
    table(th);                                     // 표는 즉시 교체
    placeCut(cutX(seg1, th), cutX(seg2, th), th);  // 자르는 선 250ms 전환
    if (instant) {                                 // 첫 그림은 전환 없이 놓고, 그 뒤부터 전환을 켠다
      cg1.style.transition = 'transform .25s ease-out';
      cg2.style.transition = 'transform .25s ease-out';
      var tr = 'fill .25s linear,fill-opacity .25s linear', j;
      for (j = 0; j < rc1.length; j++) rc1[j].style.transition = tr;
      for (j = 0; j < rc2.length; j++) rc2[j].style.transition = tr;
    }
  }

  slider.addEventListener('input', function () { set(Number(slider.value), false); });
  set(5, true);
}
  const WIDGET_INIT = {basket: initW_basket, baseline: initW_baseline, minco: initW_minco};
  function initWidgets(scope) { (scope || document).querySelectorAll('.widget[data-w]').forEach(el => { if (el.dataset.ready) return; const f = WIDGET_INIT[el.dataset.w]; if (f) { f(el, window.LESSON_DATA); el.dataset.ready = '1'; } }); }
  window.initWidgets = initWidgets;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initWidgets()); else initWidgets();
