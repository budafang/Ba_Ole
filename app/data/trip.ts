export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  location?: string;
  note?: string;
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

export const tripDays: TripDay[] = [
  {
    date: "2026-08-19",
    weekday: "三",
    area: "亞庇",
    title: "出發與集合",
    summary: "先在第一航廈集合，夜宿 Cotton Houz。",
    items: [
      { id: "d19-1", time: "16:30", title: "第一航廈集合", location: "桃園機場 T1", note: "先到者拍集合地點照片傳群組", status: "planned" },
      { id: "d19-2", time: "18:50–22:25", title: "亞航 AK1511", location: "TPE → BKI", note: "抵達後搭 Taxi／Grab 前往住宿", status: "planned" },
      { id: "d19-3", time: "晚上", title: "入住 Cotton Houz", location: "亞庇", note: "10 人分 3 部車；車資回台後再分攤", status: "planned" },
    ],
  },
  {
    date: "2026-08-20",
    weekday: "四",
    area: "Mulu",
    title: "飛往 Mulu",
    summary: "從亞庇轉機進入雨林入口，下午安排洞穴行程。",
    items: [
      { id: "d20-1", time: "07:00", title: "飯店退房、前往機場", location: "Cotton Houz → BKI", note: "早餐可在機場內解決，預算約 RM20", status: "planned" },
      { id: "d20-2", time: "10:55–11:50", title: "馬航 MH3251", location: "BKI → MZV", note: "抵達後到 Mulu 國家公園約 1.5 公里", status: "planned" },
      { id: "d20-3", time: "14:00–18:30", title: "藍洞 × 鹿洞 × 蝙蝠出洞", location: "Mulu National Park", note: "步行約 3 公里；門票／活動約 $35", status: "planned" },
    ],
  },
  {
    date: "2026-08-21",
    weekday: "五",
    area: "Mulu",
    title: "乘船探險日",
    summary: "傳統長舟、風洞、清水洞；晚間依體力決定是否夜觀。",
    items: [
      { id: "d21-1", time: "08:30–12:30", title: "風洞 × 清水洞地下河", location: "Mulu National Park", note: "清水洞野餐與暢泳；活動約 $70", status: "planned" },
      { id: "d21-2", time: "19:30–21:30", title: "夜間野生動物尋蹤", location: "Mulu", note: "由 Bateu Bungan 頭目的兒子 John 帶領；約 $45", status: "planned" },
    ],
  },
  {
    date: "2026-08-22",
    weekday: "六",
    area: "Miri",
    title: "Mulu → Miri 集合",
    summary: "上午保留彈性，提早到機場或在園區步道散步。",
    items: [
      { id: "d22-1", time: "上午", title: "園區步道／自由活動", location: "Mulu", note: "依前一晚體力現場決定", status: "planned" },
      { id: "d22-2", time: "13:30–14:00", title: "航班前往 Miri", location: "MZV → MYY", note: "可提前 1 小時到機場，機場午餐選項較少", status: "planned" },
      { id: "d22-3", time: "下午", title: "入住美里萬豪", location: "Miri Marriott Resort & Spa", note: "可以帶泳衣", status: "planned" },
    ],
  },
  {
    date: "2026-08-23",
    weekday: "日",
    area: "Swak Ali",
    title: "進入 Swak Ali",
    summary: "採買糧食、與翻譯會面，下午啟動太陽能系統安裝。",
    items: [
      { id: "d23-1", time: "上午", title: "Miri → Swak Ali", location: "Swak Ali", note: "預計 5 台車；中間採買白米、蛋、水、乾糧與調味料", status: "planned" },
      { id: "d23-2", time: "下午", title: "太陽能系統安裝", location: "Swak Ali", note: "1.62 kW；保留現場調整空間", status: "planned" },
      { id: "d23-3", time: "傍晚／晚上", title: "捐贈儀式", location: "Swak Ali", note: "Donation Ceremony；可建立田野觀察記錄", status: "planned" },
    ],
  },
  {
    date: "2026-08-24",
    weekday: "一",
    area: "Swak Ali",
    title: "兒童營隊與移動",
    summary: "白天兒童營隊，傍晚視交通與現場狀況移動至 Ba Ole。",
    items: [
      { id: "d24-1", time: "全天", title: "兒童營隊", location: "Swak Ali", note: "活動內容可依現場需要調整；住宿安排待確認", status: "planned" },
      { id: "d24-2", time: "傍晚", title: "團隊移動至 Ba Ole", location: "Swak Ali → Ba Ole", note: "依車隊與天候現場決定", status: "planned" },
    ],
  },
  {
    date: "2026-08-25",
    weekday: "二",
    area: "Ba Ole",
    title: "安裝與營隊開始",
    summary: "上午安裝、午間儀式，下午兒童營隊開始。",
    items: [
      { id: "d25-1", time: "上午", title: "太陽能系統安裝", location: "Ba Ole", note: "2.16 kW；於現場確認施工紀錄", status: "planned" },
      { id: "d25-2", time: "中午", title: "捐贈儀式", location: "Ba Ole", note: "Donation Ceremony", status: "planned" },
      { id: "d25-3", time: "下午", title: "兒童營隊開始", location: "Ba Ole", note: "可依參與者狀況調整活動節奏", status: "planned" },
    ],
  },
  {
    date: "2026-08-26",
    weekday: "三",
    area: "Ba Ole",
    title: "雨林體驗與田野日",
    summary: "把完整一天留給體驗、觀察、訪談與影像記錄。",
    items: [
      { id: "d26-1", time: "全天", title: "雨林體驗活動", location: "Ba Ole", note: "活動費約 $80；依安全與天候調整", status: "planned" },
      { id: "d26-2", time: "穿插進行", title: "田野資料蒐集", location: "Ba Ole", note: "策展主題、文化脈絡與本南人影像記錄", status: "planned" },
    ],
  },
  {
    date: "2026-08-27",
    weekday: "四",
    area: "Miri",
    title: "返回 Miri",
    summary: "結束村落行程，回到城市整理裝備與資料。",
    items: [
      { id: "d27-1", time: "全天", title: "Ba Ole → Miri", location: "Miri", note: "預計 5 台車；回程路況保留彈性", status: "planned" },
      { id: "d27-2", time: "晚上", title: "萬豪酒店／市區自由活動", location: "Miri", note: "可整理照片、備份田野記錄", status: "planned" },
    ],
  },
  {
    date: "2026-08-28",
    weekday: "五",
    area: "亞庇",
    title: "Miri → 亞庇",
    summary: "抵達後保留多個城市方案，當天依體力與天候選擇。",
    items: [
      { id: "d28-1", time: "11:35–12:25", title: "亞航 AK6078", location: "Miri → BKI", note: "住宿：A Residence", status: "planned" },
      { id: "d28-2", time: "下午／晚上", title: "城市備選行程", location: "亞庇", note: "水上清真寺、Gaya Street、怡豐茶室、丹絨亞路、海鮮餐廳、菲律賓夜市或半天跳島", status: "planned" },
    ],
  },
  {
    date: "2026-08-29",
    weekday: "六",
    area: "返台",
    title: "返程",
    summary: "清晨離開住宿，搭機返回台灣。",
    items: [
      { id: "d29-1", time: "04:30", title: "飯店退房", location: "A Residence", note: "12 人搭 4 部車", status: "planned" },
      { id: "d29-2", time: "05:00", title: "機場報到", location: "BKI", note: "建議預先確認行李與集合分車", status: "planned" },
      { id: "d29-3", time: "07:25–11:00", title: "亞航 AK1510", location: "BKI → TPE", note: "可預訂 AirAsia 機上餐點", status: "planned" },
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
