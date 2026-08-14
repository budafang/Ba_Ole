export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  location?: string;
  note?: string;
  details?: string[];
  locked?: boolean;
  status: "planned" | "done" | "skipped";
};

export type TripDay = {
  date: string;
  weekday: string;
  area: string;
  title: string;
  summary: string;
  items: ScheduleItem[];
};

export const tripNotes = [
  "護照、機票與住宿資料建議列印紙本；刷卡房費的信用卡要帶，飯店可能再次過卡作為押金，回台後確認是否退還。",
  "大冠鷲代訂房費的手續費由大家均攤；插座要帶三孔轉接頭，USB 充電線不能只帶 Type-C。",
  "個人用品：墨鏡、個人藥品、藥膏、防蚊液、防曬、擦汗手帕、帽子、雨具、頭燈、包鞋、泳衣、泳帽與餐具；雨林膠鞋可到當地買。",
  "Mulu 國家公園遊客中心可裝飲用水；全程參加人數 PPT 標示 14 人（8 男、6 女）。",
  "需要搭計程車時先分配車長與乘客：第一車海葵家 3 人；第二至第四車負責人／乘客仍待確認。",
  "待確認：詢問紅布條，並借蜂團。",
];

export const tripDays: TripDay[] = [
  {
    date: "2026-08-19",
    weekday: "三",
    area: "亞庇",
    title: "出發與集合",
    summary: "先在第一航廈集合，搭乘固定航班前往亞庇，夜宿 Cotton Houz。",
    items: [
      { id: "d19-1", time: "16:30", title: "集合：第一航廈 1 樓", location: "桃園機場 T1", note: "固定集合時間；先抵達者找合適地點拍集合地照片傳群組。", locked: true, status: "planned" },
      { id: "d19-2", time: "18:50–22:25", title: "亞航 AK1511", location: "TPE → BKI", note: "固定航班，不作為現場行程修改。", details: ["台北 TPE 18:50 起飛", "亞庇 BKI 22:25 抵達"], locked: true, status: "planned" },
      { id: "d19-3", time: "抵達後", title: "亞庇機場 → Cotton Houz", location: "BKI → 住宿", note: "搭 TAXI；先下載 Grab 並綁定信用卡。", details: ["10 人搭 3 部車", "每車預估 RM40；建議綁定信用卡，回台灣後再分攤"], status: "planned" },
      { id: "d19-4", time: "入住", title: "Cotton Houz", location: "亞庇", note: "住宿資料依 PPT 保留；早餐另行處理。", details: ["4 人房 3 間，不含早餐", "PPT 標示房費 MR911.28（6 男 7 女、每人 489 元），人數與前文 10 人不一致，現場確認"], locked: true, status: "planned" },
    ],
  },
  {
    date: "2026-08-20",
    weekday: "四",
    area: "Mulu",
    title: "飛往 Mulu",
    summary: "固定早班流程與航班，下午進行藍洞、鹿洞與蝙蝠出洞。",
    items: [
      { id: "d20-1", time: "07:00", title: "飯店退房、前往機場", location: "Cotton Houz → BKI", note: "固定退房時間。", details: ["10 人搭 3 部車，每車預估 RM40", "抵達機場後先 check in；機場內麥當勞早餐預算約 RM20"], locked: true, status: "planned" },
      { id: "d20-2", time: "07:30", title: "機場報到", location: "亞庇國際機場 BKI", note: "固定報到時間。", locked: true, status: "planned" },
      { id: "d20-3", time: "10:55–11:50", title: "馬航 MH3251", location: "BKI → MZV", note: "固定航班，不作為現場行程修改。", details: ["亞庇國際機場 BKI 10:55 起飛", "Mulu 機場 MZV 11:50 抵達"], locked: true, status: "planned" },
      { id: "d20-4", time: "抵達後", title: "MZV → Mulu 國家公園", location: "約 1.5 公里", note: "叫計程車前往國家公園。", details: ["車資約 RM5／人", "遊客中心可裝飲用水"], status: "planned" },
      { id: "d20-5", time: "14:00–18:30", title: "藍洞 × 鹿洞 × 蝙蝠出洞", location: "Mulu National Park", note: "活動費約 $35；步行約 3 公里。", details: ["藍洞 Lang Cave × 鹿洞 Deer Cave", "記得看鹿洞通道的林肯總統側面剪影", "傍晚在露天看台觀賞 200–300 萬隻蝙蝠集體飛出洞穴"], status: "planned" },
    ],
  },
  {
    date: "2026-08-21",
    weekday: "五",
    area: "Mulu",
    title: "乘船探險日",
    summary: "傳統長舟、風洞、清水洞地下河與夜間野生動物尋蹤。",
    items: [
      { id: "d21-1", time: "08:30–12:30", title: "傳統長舟 × 風洞 × 清水洞", location: "Mulu National Park", note: "活動費約 $70。", details: ["風洞 Wind Cave × 清水洞 Clearwater Cave 地下河游泳", "中午在清水洞野餐與暢泳"], status: "planned" },
      { id: "d21-2", time: "19:30–21:30", title: "夜間野生動物尋蹤", location: "Mulu", note: "Night Walk；活動費約 $45。", details: ["由 Bateu Bungan 頭目的兒子 John 帶領夜觀"], status: "planned" },
    ],
  },
  {
    date: "2026-08-22",
    weekday: "六",
    area: "Miri",
    title: "Mulu → Miri 集合",
    summary: "上午保留彈性，固定下午航班前往 Miri，入住萬豪。",
    items: [
      { id: "d22-1", time: "上午", title: "園區步道／自由活動", location: "Mulu", note: "依前一晚體力現場決定。", details: ["前往機場需提前 1 小時", "也可以在機場吃午餐，餐點選項比公園少"], status: "planned" },
      { id: "d22-2", time: "13:30–14:00", title: "航班前往 Miri", location: "MZV → MYY", note: "固定航班時間。", details: ["Mulu MZV 13:30 起飛", "Miri MYY 14:00 抵達"], locked: true, status: "planned" },
      { id: "d22-3", time: "14:00 後", title: "入住 Miri Marriott Resort & Spa", location: "Miri", note: "可以帶泳衣。", locked: true, status: "planned" },
    ],
  },
  {
    date: "2026-08-23",
    weekday: "日",
    area: "Swak Ali",
    title: "進入 Swak Ali",
    summary: "與翻譯會面、採買糧食，下午安裝太陽能，晚上捐贈。",
    items: [
      { id: "d23-1", time: "上午", title: "Miri → Swak Ali", location: "Swak Ali", note: "預計 5 台車；途中採買物資。", details: ["與翻譯會面", "白米建議每次採買 30 公斤", "乾糧／餅乾、食用油、蒜頭、糖、鹽", "雞翅或冷凍肉品視冰桶與運送時間決定", "咖啡粉／三合一咖啡、茶包、美祿、泡麵"], status: "planned" },
      { id: "d23-2", time: "下午", title: "太陽能系統安裝", location: "Swak Ali", note: "1.62 kW；保留現場調整空間。", status: "planned" },
      { id: "d23-3", time: "晚上", title: "捐贈儀式", location: "Swak Ali", note: "Donation Ceremony；可建立田野觀察記錄。", status: "planned" },
    ],
  },
  {
    date: "2026-08-24",
    weekday: "一",
    area: "Swak Ali → Ba Ole",
    title: "兒童營隊與移動",
    summary: "白天兒童營隊，傍晚視交通與現場狀況移動至 Ba Ole。",
    items: [
      { id: "d24-1", time: "白天", title: "兒童營隊", location: "Swak Ali", note: "Children’s Camp；內容可依現場調整。", details: ["PPT 標示：備案？", "住宿安排與活動節奏現場確認"], status: "planned" },
      { id: "d24-2", time: "傍晚", title: "團隊移動至 Ba Ole", location: "Swak Ali → Ba Ole", note: "依車隊與天候現場決定。", status: "planned" },
    ],
  },
  {
    date: "2026-08-25",
    weekday: "二",
    area: "Ba Ole",
    title: "安裝與營隊開始",
    summary: "上午安裝、午間儀式，下午兒童營隊開始。",
    items: [
      { id: "d25-1", time: "上午", title: "太陽能系統安裝", location: "Ba Ole", note: "2.16 kW；於現場確認施工紀錄。", status: "planned" },
      { id: "d25-2", time: "中午", title: "捐贈儀式", location: "Ba Ole", note: "Donation Ceremony。", status: "planned" },
      { id: "d25-3", time: "下午", title: "兒童營隊開始", location: "Ba Ole", note: "依參與者狀況調整活動節奏。", status: "planned" },
    ],
  },
  {
    date: "2026-08-26",
    weekday: "三",
    area: "Ba Ole",
    title: "雨林體驗與田野日",
    summary: "把完整一天留給體驗、觀察、訪談與影像記錄。",
    items: [
      { id: "d26-1", time: "全天", title: "雨林體驗活動", location: "Ba Ole", note: "活動費約 $80；依安全與天候調整。", status: "planned" },
      { id: "d26-2", time: "穿插進行", title: "田野資料蒐集", location: "Ba Ole", note: "策展主題與文化脈絡現場形成。", details: ["本南人拍照前先確認同意與使用方式", "記錄訪談、影像線索與待追問問題"], status: "planned" },
    ],
  },
  {
    date: "2026-08-27",
    weekday: "四",
    area: "Miri",
    title: "返回 Miri",
    summary: "結束村落行程，回到城市整理裝備與資料。",
    items: [
      { id: "d27-1", time: "全天", title: "Ba Ole → Miri", location: "Miri", note: "預計 5 台車；回程路況保留彈性。", status: "planned" },
      { id: "d27-2", time: "晚上", title: "萬豪酒店／市區自由活動", location: "Miri", note: "萬豪酒店或市區逛逛。", details: ["可整理照片、備份田野記錄"], status: "planned" },
    ],
  },
  {
    date: "2026-08-28",
    weekday: "五",
    area: "亞庇",
    title: "Miri → 亞庇",
    summary: "固定中午航班抵達亞庇，下午保留多個城市方案。",
    items: [
      { id: "d28-1", time: "11:35–12:25", title: "亞航 AK6078", location: "MYY → BKI", note: "固定航班；住宿 A Residence。", details: ["Miri 11:35 起飛", "亞庇 12:25 抵達"], locked: true, status: "planned" },
      { id: "d28-2", time: "抵達後", title: "入住 A Residence", location: "亞庇", note: "住宿點：A Residence。", locked: true, status: "planned" },
      { id: "d28-3", time: "下午／晚上", title: "城市備選行程", location: "亞庇", note: "依體力、天候與星期五休息日現場選擇。", details: ["水上清真寺：星期五是休息日，可改為在外面拍照不進入參觀", "Gaya Street、怡豐茶室、丹絨亞路沙灘 Tanjung Aru Beach", "大茄來海鮮餐廳、菲律賓夜市", "備案：半天跳島或前往機場"], status: "planned" },
    ],
  },
  {
    date: "2026-08-29",
    weekday: "六",
    area: "返台",
    title: "返程",
    summary: "清晨固定退房、報到與航班，返回台灣。",
    items: [
      { id: "d29-1", time: "04:30", title: "飯店退房", location: "A Residence", note: "固定退房時間。", details: ["12 人搭 4 部車"], locked: true, status: "planned" },
      { id: "d29-2", time: "05:00", title: "機場報到", location: "BKI", note: "固定報到時間；預先確認行李與分車。", locked: true, status: "planned" },
      { id: "d29-3", time: "07:25–11:00", title: "亞航 AK1510", location: "BKI → TPE", note: "固定航班；可預訂 AirAsia 機上餐點。", details: ["亞庇 BKI 07:25 起飛", "台北 TPE 11:00 抵達"], locked: true, status: "planned" },
    ],
  },
  {
    date: "2026-08-30",
    weekday: "日",
    area: "TBD",
    title: "結案與雨林分享",
    summary: "PPT 標示 TBD；返台後確認是否完成壯遊結案與分享簡報。",
    items: [
      { id: "d30-1", time: "TBD", title: "壯遊結案", location: "TBD", note: "看能不能完成；日期與形式待確認。", status: "planned" },
      { id: "d30-2", time: "TBD", title: "雨林分享簡報", location: "TBD", note: "每人每天選一張照片。", status: "planned" },
      { id: "d30-3", time: "09/26", title: "國泰卓越獎助計畫提醒", location: "特色獎助類", note: "非本次旅程固定行程，作為後續提醒。", details: ["每案獎助 10–20 萬元", "共 20 名／組；截止資訊依 PPT，提交前再確認官方公告"], status: "planned" },
    ],
  },
];

export const cultureResources = [
  { title: "策展提案網站", type: "網站", description: "雨林贊助與策展提案的公開入口。", href: "https://rainforest-sponsor.vercel.app/" },
  { title: "紀錄片", type: "影片", description: "本南文化相關紀錄片。", href: "https://youtu.be/ikFqQWDauDU" },
  { title: "整理編竹籃用的材料：羅丹", type: "影片", description: "從材料與工藝理解日常文化。", href: "https://youtu.be/nQ9D7LWiwcA" },
  { title: "本南人打獵用的吹箭製作", type: "影片", description: "傳統工具製作與知識傳承。", href: "https://youtu.be/fPfmn3w_tSI" },
  { title: "傳統音樂 Sabe", type: "影片", description: "本南傳統音樂資料。", href: "https://youtu.be/iFEnCaCVh3w" },
  { title: "Oroo 雨林樹語", type: "影片", description: "與雨林、樹木及生活經驗相關的影像。", href: "https://youtu.be/HdAVOCDTEyI" },
];

export const cultureImages = [
  { src: "/culture/樹屋1.JPG", title: "樹屋與生活空間" },
  { src: "/culture/採集文化.JPG", title: "採集文化" },
  { src: "/culture/手工竹籃.jpg", title: "手工竹籃" },
  { src: "/culture/傳統舞蹈.JPG", title: "傳統舞蹈" },
  { src: "/culture/樹語.jpg", title: "樹語" },
  { src: "/culture/香蕉心.jpg", title: "雨林食材" },
];
