# 雨林行程紀錄

Swak Ali × Ba Ole 2026 雨林行程的離線優先 PWA。

## 已包含

- 每日行程：8/19–8/29 日期切換、完成狀態、現場編修、臨時新增項目
- 記帳：獨立主頁籤，支援 RM／TWD／USD、付款人、備註與小計
- 田野記錄：日期、地點、對象、記錄類型、標題與內容；可匯出 CSV
- 文化資料：策展提案網站、影片入口與 `01_inbox/雨林文化` 圖片
- 本機保存：行程修訂、記帳與田野記錄保存在裝置的 localStorage
- PWA：`manifest.webmanifest` 與 service worker；部署後可用 Safari 加入 iPhone 主畫面

## 本機預覽

```powershell
node_modules/vinext/dist/cli.js dev
```

若 Windows 路徑含有 `&`，請直接用上面的 Node 指令，不要用 npm script 呼叫 `vinext`。

## 建置

```powershell
node_modules/vinext/dist/cli.js build
```

GitHub／Vercel 建議將這個 `app` 資料夾作為 repository root；Vercel 的 build command 使用 `npm run build`，輸出依 vinext 設定處理。

## 資料來源

初始行程依據 `01_inbox/20260821~20260829馬來西亞雨林行程.pptx` 與 `2025-26鷹二年度行事曆.xlsx` 的「雨林行程Daily」整理。原始檔不在 app 內修改。
