"use client";

import { useEffect, useMemo, useState } from "react";
import { cultureImages, cultureResources, tripDays, tripNotes, type ScheduleItem, type TripDay } from "./data/trip";

type Tab = "schedule" | "expenses" | "field" | "culture";
type Expense = { id: string; date: string; category: string; item: string; amount: number; currency: string; payer: string; note: string; itemId?: string };
type ExpenseDraft = Omit<Expense, "id"> & { id?: string };
type FieldNote = { id: string; date: string; place: string; person: string; type: string; title: string; body: string; createdAt: string };

const emptyExpense: ExpenseDraft = { date: "2026-08-21", category: "交通", item: "", amount: 0, currency: "RM", payer: "", note: "" };
const emptyFieldNote: Omit<FieldNote, "id" | "createdAt"> = { date: "2026-08-26", place: "", person: "", type: "觀察", title: "", body: "" };

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function formatDate(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function expenseCategoryFor(item: ScheduleItem) {
  const text = `${item.title} ${item.location ?? ""} ${item.note ?? ""}`;
  if (/住宿|入住|飯店|旅館/.test(text)) return "住宿";
  if (/採買|白米|蛋|乾糧|早餐|午餐|晚餐|餐飲/.test(text)) return "採買";
  if (/機場|航|車|移動|Taxi|Grab|車資|→/.test(text)) return "交通";
  return "活動";
}

function expenseSummary(expense?: Expense) {
  return expense ? `${expense.currency} ${Number(expense.amount || 0).toLocaleString()}` : "新增費用";
}

function mergeStoredDays(stored: TripDay[] | null) {
  if (!stored?.length) return tripDays;
  return tripDays.map((baseDay) => {
    const savedDay = stored.find((day) => day.date === baseDay.date);
    if (!savedDay) return baseDay;
    const savedItems = savedDay.items ?? [];
    const items = baseDay.items.map((baseItem) => {
      const savedItem = savedItems.find((item) => item.id === baseItem.id);
      if (!savedItem) return baseItem;
      if (baseItem.locked) return { ...baseItem, status: savedItem.status ?? baseItem.status };
      return { ...baseItem, ...savedItem };
    });
    const addedItems = savedItems.filter((item) => !baseDay.items.some((baseItem) => baseItem.id === item.id));
    return { ...baseDay, ...savedDay, items: [...items, ...addedItems] };
  }).concat(stored.filter((day) => !tripDays.some((baseDay) => baseDay.date === day.date)));
}

function download(filename: string, text: string, type = "application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function csvEscape(value: unknown) {
  const text = String(value ?? "").replaceAll('"', '""');
  return /[",\n]/.test(text) ? `"${text}"` : text;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("schedule");
  const [days, setDays] = useState<TripDay[]>(tripDays);
  const [selectedDate, setSelectedDate] = useState(tripDays[0].date);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [fieldNotes, setFieldNotes] = useState<FieldNote[]>([]);
  const [expenseForm, setExpenseForm] = useState<ExpenseDraft>(emptyExpense);
  const [fieldForm, setFieldForm] = useState(emptyFieldNote);
  const [editingItem, setEditingItem] = useState<{ date: string; item: ScheduleItem } | null>(null);
  const [expenseEditor, setExpenseEditor] = useState<ExpenseDraft | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let reloadingForUpdate = false;
    const timer = window.setTimeout(() => {
      setDays(mergeStoredDays(readStored<TripDay[] | null>("swak-ali-days", null)));
      setExpenses(readStored("swak-ali-expenses", []));
      setFieldNotes(readStored("swak-ali-field-notes", []));
      setStorageReady(true);
    }, 0);
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    const reloadForUpdate = () => {
      if (reloadingForUpdate) return;
      reloadingForUpdate = true;
      window.location.reload();
    };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", reloadForUpdate);
      navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })
        .then((registration) => registration.update())
        .catch(() => undefined);
    }
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      navigator.serviceWorker?.removeEventListener("controllerchange", reloadForUpdate);
    };
  }, []);

  useEffect(() => { if (storageReady) window.localStorage.setItem("swak-ali-days", JSON.stringify(days)); }, [days, storageReady]);
  useEffect(() => { if (storageReady) window.localStorage.setItem("swak-ali-expenses", JSON.stringify(expenses)); }, [expenses, storageReady]);
  useEffect(() => { if (storageReady) window.localStorage.setItem("swak-ali-field-notes", JSON.stringify(fieldNotes)); }, [fieldNotes, storageReady]);

  const selectedDay = days.find((day) => day.date === selectedDate) ?? days[0];
  const completedItems = days.flatMap((day) => day.items).filter((item) => item.status === "done").length;
  const allItems = days.flatMap((day) => day.items).length;
  const totals = useMemo(() => expenses.reduce<Record<string, number>>((result, expense) => {
    result[expense.currency] = (result[expense.currency] ?? 0) + Number(expense.amount || 0);
    return result;
  }, {}), [expenses]);

  function updateItem(date: string, next: ScheduleItem) {
    setDays((current) => current.map((day) => day.date !== date ? day : { ...day, items: day.items.map((item) => item.id === next.id ? next : item) }));
  }

  function addItem(item: ScheduleItem) {
    setDays((current) => current.map((day) => day.date !== selectedDate ? day : { ...day, items: [...day.items, item] }));
    setIsAddingItem(false);
  }

  function openItemExpense(date: string, item: ScheduleItem) {
    const existing = expenses.find((expense) => expense.itemId === item.id);
    setExpenseEditor(existing ?? {
      ...emptyExpense,
      date,
      category: expenseCategoryFor(item),
      item: item.title,
      itemId: item.id,
    });
  }

  function saveExpenseDraft(draft: ExpenseDraft) {
    if (!draft.item.trim() || !draft.amount) return;
    setExpenses((current) => draft.id
      ? current.map((expense) => expense.id === draft.id ? { ...draft, id: draft.id } as Expense : expense)
      : [{ ...draft, id: crypto.randomUUID() } as Expense, ...current]);
    setExpenseEditor(null);
  }

  function deleteExpense(id: string) {
    setExpenses((current) => current.filter((expense) => expense.id !== id));
    setExpenseEditor(null);
  }

  function saveExpense(event: React.FormEvent) {
    event.preventDefault();
    if (!expenseForm.item.trim() || !expenseForm.amount) return;
    setExpenses((current) => [{ ...expenseForm, id: crypto.randomUUID() }, ...current]);
    setExpenseForm({ ...emptyExpense, date: selectedDate });
  }

  function saveFieldNote(event: React.FormEvent) {
    event.preventDefault();
    if (!fieldForm.title.trim() && !fieldForm.body.trim()) return;
    setFieldNotes((current) => [{ ...fieldForm, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...current]);
    setFieldForm({ ...emptyFieldNote, date: selectedDate });
  }

  function exportAll() {
    download("swak-ali-rainforest-records.json", JSON.stringify({ exportedAt: new Date().toISOString(), days, expenses, fieldNotes }, null, 2));
  }

  function exportFieldNotes() {
    const rows = [["日期", "地點", "對象／關係人", "記錄類型", "標題", "內容", "建立時間"], ...fieldNotes.map((note) => [note.date, note.place, note.person, note.type, note.title, note.body, note.createdAt])];
    download("swak-ali-field-notes.csv", `\uFEFF${rows.map((row) => row.map(csvEscape).join(",")).join("\n")}`, "text/csv;charset=utf-8");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">BA</span>
          <div>
            <p className="eyebrow">SARAWAK · 2026</p>
            <h1>雨林行程紀錄</h1>
          </div>
        </div>
        <div className={`offline-pill ${online ? "is-online" : ""}`}><span />{online ? "已連線" : "離線可用"}</div>
      </header>

      <section className="trip-ribbon" aria-label="旅程資訊">
        <div>
          <strong>Swak Ali × Ba Ole</strong>
          <span>8/19–8/30 · 砂拉越</span>
        </div>
        <p><span>行程可修訂</span><span>費用獨立</span><span>記錄可匯出</span></p>
      </section>

      <div className="main-content">
        {tab === "schedule" && <ScheduleView days={days} selectedDate={selectedDate} selectedDay={selectedDay} expenses={expenses} completedItems={completedItems} allItems={allItems} onSelectDate={(date) => { setSelectedDate(date); setExpenseForm((current) => ({ ...current, date })); setFieldForm((current) => ({ ...current, date })); setEditingItem(null); }} onEdit={(item) => setEditingItem({ date: selectedDate, item })} onStatus={(item) => updateItem(selectedDate, { ...item, status: item.status === "done" ? "planned" : "done" })} onExpense={openItemExpense} onAdd={() => setIsAddingItem(true)} />}
        {tab === "expenses" && <ExpensesView expenses={expenses} totals={totals} form={expenseForm} setForm={setExpenseForm} onSave={saveExpense} onDelete={deleteExpense} onExport={exportAll} />}
        {tab === "field" && <FieldView notes={fieldNotes} form={fieldForm} setForm={setFieldForm} onSave={saveFieldNote} onExport={exportFieldNotes} onDelete={(id) => setFieldNotes((current) => current.filter((note) => note.id !== id))} />}
        {tab === "culture" && <CultureView />}
      </div>

      {editingItem && <ItemEditor date={editingItem.date} item={editingItem.item} onClose={() => setEditingItem(null)} onSave={(item) => { updateItem(editingItem.date, item); setEditingItem(null); }} />}
      {isAddingItem && <ItemEditor date={selectedDate} onClose={() => setIsAddingItem(false)} onSave={addItem} />}
      {expenseEditor && <ExpenseEditor draft={expenseEditor} onClose={() => setExpenseEditor(null)} onSave={saveExpenseDraft} onDelete={deleteExpense} />}

      <nav className="bottom-nav" aria-label="主要功能">
        <NavButton active={tab === "schedule"} icon="▦" label="每日行程" onClick={() => setTab("schedule")} />
        <NavButton active={tab === "expenses"} icon="$" label="記帳" onClick={() => setTab("expenses")} count={expenses.length || undefined} />
        <NavButton active={tab === "field"} icon="✎" label="田野記錄" onClick={() => setTab("field")} count={fieldNotes.length || undefined} />
        <NavButton active={tab === "culture"} icon="◌" label="文化資料" onClick={() => setTab("culture")} />
      </nav>
    </main>
  );
}

function ScheduleView({ days, selectedDate, selectedDay, expenses, completedItems, allItems, onSelectDate, onEdit, onStatus, onExpense, onAdd }: { days: TripDay[]; selectedDate: string; selectedDay: TripDay; expenses: Expense[]; completedItems: number; allItems: number; onSelectDate: (date: string) => void; onEdit: (item: ScheduleItem) => void; onStatus: (item: ScheduleItem) => void; onExpense: (date: string, item: ScheduleItem) => void; onAdd: () => void }) {
  return <>
    <section className="section-heading"><div><p className="eyebrow">FIELD ITINERARY</p><h2>每日行程</h2><p className="section-lede">選擇日期，直接查看、修訂或記錄費用。</p></div><button className="ghost-button" onClick={() => download("swak-ali-itinerary.json", JSON.stringify(days, null, 2))}>匯出</button></section>
    <div className="schedule-status"><div className="progress-track"><span style={{ width: `${allItems ? (completedItems / allItems) * 100 : 0}%` }} /></div><small>{completedItems}/{allItems} 項完成</small></div>
    <div className="day-picker" role="list" aria-label="選擇日期">
      {days.map((day) => <button key={day.date} className={day.date === selectedDate ? "day-chip selected" : "day-chip"} onClick={() => onSelectDate(day.date)}><small>{day.weekday}</small><strong>{formatDate(day.date)}</strong><span>{day.area}</span></button>)}
    </div>
    <section className="day-panel">
      <div className="day-panel-top"><div><span className="date-label">{selectedDay.weekday} · {formatDate(selectedDay.date)} · {selectedDay.area}</span><h3>{selectedDay.title}</h3><p>{selectedDay.summary}</p></div><button className="add-button" onClick={onAdd}>＋ 新增行程</button></div>
      <div className="schedule-list">{selectedDay.items.map((item) => <article className={`schedule-item ${item.status}`} key={item.id}>
        <button className="check-button" aria-label={`${item.title}標記完成`} onClick={() => onStatus(item)}>{item.status === "done" ? "✓" : ""}</button>
        <div className="schedule-time">{item.time}</div>
        <div className="schedule-detail"><h4>{item.title}</h4>{item.location && <p className="location">↳ {item.location}</p>}{item.note && <p>{item.note}</p>}{item.details && <ul className="schedule-details">{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}</div>
        <div className="schedule-actions"><button className="expense-link" onClick={() => onExpense(selectedDate, item)} aria-label={`${item.title}新增或編輯費用`}>{expenseSummary(expenses.find((expense) => expense.itemId === item.id))}</button>{item.locked ? <span className="fixed-label">固定資訊</span> : <button className="edit-link" onClick={() => onEdit(item)}>編輯</button>}</div>
      </article>)}</div>
      <div className="schedule-legend"><span><i />固定時間保留原始資料</span><span>其他行程可現場編輯</span></div>
    </section>
    <details className="trip-briefing"><summary>行前提醒與全程固定資訊</summary><ul>{tripNotes.map((note) => <li key={note}>{note}</li>)}</ul></details>
  </>;
}

function ExpensesView({ expenses, totals, form, setForm, onSave, onDelete, onExport }: { expenses: Expense[]; totals: Record<string, number>; form: ExpenseDraft; setForm: React.Dispatch<React.SetStateAction<ExpenseDraft>>; onSave: (event: React.FormEvent) => void; onDelete: (id: string) => void; onExport: () => void }) {
  return <>
    <section className="section-heading"><div><p className="eyebrow">MONEY, SEPARATELY</p><h2>記帳</h2></div><button className="ghost-button" onClick={onExport}>匯出全部</button></section>
    <div className="money-summary"><div><span>目前筆數</span><strong>{expenses.length}</strong><small>筆支出</small></div>{Object.entries(totals).map(([currency, total]) => <div key={currency}><span>{currency} 小計</span><strong>{total.toLocaleString()}</strong><small>現場紀錄</small></div>)}{!Object.keys(totals).length && <div><span>開始後會顯示</span><strong>—</strong><small>各幣別小計</small></div>}</div>
    <form className="entry-form expense-form" onSubmit={onSave}><div className="form-title"><span className="icon-badge">$</span><div><h3>新增支出</h3><p>交通、住宿、採買與活動費用分開留存。</p></div></div><div className="form-grid"><label>日期<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label><label>類別<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>交通</option><option>住宿</option><option>採買</option><option>餐飲</option><option>活動</option><option>其他</option></select></label><label className="wide">項目<input required placeholder="例如：Swak Ali 車資／白米 30 公斤" value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} /></label><label>金額<input required min="0" type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></label><label>幣別<select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}><option>RM</option><option>TWD</option><option>USD</option></select></label><label>付款人<input placeholder="姓名／代墊" value={form.payer} onChange={(e) => setForm({ ...form, payer: e.target.value })} /></label><label className="wide">備註<input placeholder="分攤方式、收據位置等" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label></div><button className="primary-button" type="submit">記下這筆支出</button></form>
    <section className="entry-list"><div className="list-heading"><h3>支出紀錄</h3><span>{expenses.length} 筆</span></div>{expenses.length === 0 ? <EmptyState icon="$" title="還沒有支出" text="第一筆交通或採買費用，可以從上方開始記。" /> : expenses.map((expense) => <article className="expense-row" key={expense.id}><div className="expense-icon">{expense.category === "交通" ? "↗" : expense.category === "採買" ? "＋" : "•"}</div><div className="row-main"><strong>{expense.item}</strong><span>{expense.date} · {expense.category}{expense.payer ? ` · ${expense.payer} 付款` : ""}</span>{expense.note && <small>{expense.note}</small>}</div><div className="row-amount"><strong>{expense.currency} {expense.amount.toLocaleString()}</strong><button onClick={() => onDelete(expense.id)}>刪除</button></div></article>)}</section>
  </>;
}

function FieldView({ notes, form, setForm, onSave, onExport, onDelete }: { notes: FieldNote[]; form: Omit<FieldNote, "id" | "createdAt">; setForm: React.Dispatch<React.SetStateAction<Omit<FieldNote, "id" | "createdAt">>>; onSave: (event: React.FormEvent) => void; onExport: () => void; onDelete: (id: string) => void }) {
  return <>
    <section className="section-heading"><div><p className="eyebrow">FIELD NOTES</p><h2>田野記錄</h2></div><button className="ghost-button" onClick={onExport}>匯出 CSV</button></section>
    <div className="field-intro"><span className="field-mark">◌</span><div><h3>把現場的聲音留下來</h3><p>記錄觀察、訪談、影像線索與策展靈感。資料只存在這台裝置，按下匯出即可帶走。</p></div></div>
    <form className="entry-form field-form" onSubmit={onSave}><div className="form-grid"><label>日期<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label><label>記錄類型<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>觀察</option><option>訪談</option><option>影像</option><option>聲音</option><option>策展靈感</option></select></label><label>地點<input placeholder="例如：Ba Ole 村落" value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} /></label><label>對象／關係人<input placeholder="可留白" value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })} /></label><label className="wide">標題<input placeholder="這筆記錄的主題" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label><label className="wide">內容<textarea rows={5} placeholder="看到什麼、聽到什麼、還需要追問什麼？" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></label></div><button className="primary-button" type="submit">新增田野記錄</button></form>
    <section className="entry-list"><div className="list-heading"><h3>已保存的記錄</h3><span>{notes.length} 筆</span></div>{notes.length === 0 ? <EmptyState icon="✎" title="還沒有田野記錄" text="在村落、移動途中或回到住宿後，都可以補記。" /> : notes.map((note) => <article className="field-row" key={note.id}><div className="field-tag">{note.type}</div><div className="row-main"><strong>{note.title || "未命名記錄"}</strong><span>{note.date} · {note.place || "未填地點"}{note.person ? ` · ${note.person}` : ""}</span><p>{note.body}</p></div><button className="delete-button" onClick={() => onDelete(note.id)}>刪除</button></article>)}</section>
  </>;
}

function CultureView() {
  return <>
    <section className="section-heading"><div><p className="eyebrow">CULTURE LIBRARY</p><h2>文化資料</h2></div><a className="ghost-button link-button" href="https://rainforest-sponsor.vercel.app/" target="_blank" rel="noreferrer">開啟策展網站 ↗</a></section>
    <div className="culture-hero"><div><span className="eyebrow light">REFERENCE, NOT A CHECKLIST</span><h3>在行程之外，理解地方。</h3><p>把提案網站、過去搜集的影像與本南文化相關影片，放在同一個可以現場打開的入口。</p></div><span className="leaf-shape">✦</span></div>
    <section className="image-grid">{cultureImages.map((image) => <figure key={image.src}><img src={image.src} alt={image.title} /><figcaption>{image.title}</figcaption></figure>)}</section>
    <section className="entry-list resource-list"><div className="list-heading"><h3>延伸資料</h3><span>{cultureResources.length} 個入口</span></div>{cultureResources.map((resource) => <a className="resource-row" href={resource.href} target="_blank" rel="noreferrer" key={resource.title}><div className="resource-icon">↗</div><div><span>{resource.type}</span><strong>{resource.title}</strong><small>{resource.description}</small></div><b>開啟</b></a>)}</section>
  </>;
}

function ExpenseEditor({ draft, onClose, onSave, onDelete }: { draft: ExpenseDraft; onClose: () => void; onSave: (draft: ExpenseDraft) => void; onDelete: (id: string) => void }) {
  const [form, setForm] = useState<ExpenseDraft>(draft);
  const valid = form.item.trim() && Number(form.amount) > 0;

  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="新增行程費用"><div className="modal-card expense-modal-card"><div className="modal-head"><div><span className="eyebrow">MONEY ON THE MOVE</span><h3>{draft.id ? "編輯行程費用" : "為行程新增費用"}</h3><p className="modal-context">{draft.itemId ? `已連結到：${draft.item}` : "這筆費用會獨立保存在記帳中"}</p></div><button className="close-button" onClick={onClose} aria-label="關閉">×</button></div><div className="form-grid"><label>日期<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label><label>類別<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>交通</option><option>住宿</option><option>採買</option><option>餐飲</option><option>活動</option><option>其他</option></select></label><label className="wide">項目<input autoFocus required value={form.item} placeholder="例如：船資、門票、採買或住宿" onChange={(e) => setForm({ ...form, item: e.target.value })} /></label><label>金額<input required min="0" type="number" inputMode="decimal" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></label><label>幣別<select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}><option>RM</option><option>TWD</option><option>USD</option></select></label><label>付款人<input placeholder="姓名／代墊" value={form.payer} onChange={(e) => setForm({ ...form, payer: e.target.value })} /></label><label className="wide">備註<input placeholder="分攤方式、收據位置等" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label></div><div className="modal-actions">{draft.id && <button className="delete-button modal-delete" onClick={() => onDelete(draft.id!)}>刪除費用</button>}<button className="ghost-button" onClick={onClose}>取消</button><button className="primary-button" disabled={!valid} onClick={() => valid && onSave(form)}>保存費用</button></div></div></div>;
}

function ItemEditor({ date, item, onClose, onSave }: { date: string; item?: ScheduleItem; onClose: () => void; onSave: (item: ScheduleItem) => void }) {
  const [draft, setDraft] = useState<ScheduleItem>(item ?? { id: crypto.randomUUID(), time: "", title: "", location: "", note: "", locked: false, status: "planned" });
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="編輯行程"><div className="modal-card"><div className="modal-head"><div><span className="eyebrow">EDIT DAY · {formatDate(date)}</span><h3>{item ? "現場修訂行程" : "加入臨時項目"}</h3></div><button className="close-button" onClick={onClose}>×</button></div><div className="form-grid"><label>時間<input value={draft.time} placeholder="例如 15:30" onChange={(e) => setDraft({ ...draft, time: e.target.value })} /></label><label className="wide">項目<input autoFocus value={draft.title} placeholder="項目名稱" onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label><label className="wide">地點<input value={draft.location ?? ""} placeholder="可留白" onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></label><label className="wide">備註／現場變動<textarea rows={4} value={draft.note ?? ""} placeholder="把臨時決定、交通狀況或待確認事項寫在這裡" onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></label></div><div className="modal-actions"><button className="ghost-button" onClick={onClose}>取消</button><button className="primary-button" onClick={() => draft.title.trim() && onSave(draft)}>保存修訂</button></div></div></div>;
}

function NavButton({ active, icon, label, count, onClick }: { active: boolean; icon: string; label: string; count?: number; onClick: () => void }) {
  return <button className={`nav-button ${active ? "active" : ""}`} onClick={onClick}><span className="nav-icon">{icon}</span><span>{label}</span>{count ? <em>{count}</em> : null}</button>;
}

function EmptyState({ icon, title, text }: { icon: string; title: string; text: string }) {
  return <div className="empty-state"><span>{icon}</span><h4>{title}</h4><p>{text}</p></div>;
}
