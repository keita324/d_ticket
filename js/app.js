/* トップページ：検索・絞り込み・一覧・レコメンド */

const state = { keyword: "", genre: "", region: "", month: "", onsaleOnly: false };

const $ = (sel) => document.querySelector(sel);

/* ---------- フィルタUIの初期化 ---------- */

function initFilters() {
  // ジャンルチップ
  const chipWrap = $("#genre-chips");
  const allChip = document.createElement("button");
  allChip.className = "chip active";
  allChip.textContent = "すべて";
  allChip.dataset.genre = "";
  chipWrap.appendChild(allChip);
  Object.entries(GENRES).forEach(([key, g]) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = g.label;
    b.dataset.genre = key;
    chipWrap.appendChild(b);
  });
  chipWrap.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.genre = chip.dataset.genre;
    chipWrap.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip));
    render();
  });

  // エリア
  const regionSel = $("#region-select");
  REGIONS.forEach((r) => {
    const o = document.createElement("option");
    o.value = r;
    o.textContent = r;
    regionSel.appendChild(o);
  });
  regionSel.addEventListener("change", () => { state.region = regionSel.value; render(); });

  // 月（今日から4ヶ月分）
  const monthSel = $("#month-select");
  for (let i = 0; i < 4; i++) {
    const d = new Date(TODAY.getFullYear(), TODAY.getMonth() + i, 1);
    const o = document.createElement("option");
    o.value = `${d.getFullYear()}-${d.getMonth()}`;
    o.textContent = `${d.getFullYear()}年${d.getMonth() + 1}月`;
    monthSel.appendChild(o);
  }
  monthSel.addEventListener("change", () => { state.month = monthSel.value; render(); });

  // キーワード
  $("#keyword").addEventListener("input", (e) => { state.keyword = e.target.value.trim(); render(); });

  // 受付中のみ
  $("#onsale-only").addEventListener("change", (e) => { state.onsaleOnly = e.target.checked; render(); });

  // クリア
  $("#clear-filters").addEventListener("click", () => {
    state.keyword = ""; state.genre = ""; state.region = ""; state.month = ""; state.onsaleOnly = false;
    $("#keyword").value = "";
    regionSel.value = "";
    monthSel.value = "";
    $("#onsale-only").checked = false;
    chipWrap.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.genre === ""));
    render();
  });
}

/* ---------- 絞り込みロジック ---------- */

function matches(ev) {
  if (state.keyword) {
    const kw = state.keyword.toLowerCase();
    if (!ev.title.toLowerCase().includes(kw) && !ev.artist.toLowerCase().includes(kw)) return false;
  }
  if (state.genre && ev.genre !== state.genre) return false;
  if (state.region && !regionsOf(ev).includes(state.region)) return false;
  if (state.month) {
    const hit = ev.performances.some((p) => {
      const d = addDays(p.d);
      return `${d.getFullYear()}-${d.getMonth()}` === state.month;
    });
    if (!hit) return false;
  }
  if (state.onsaleOnly && eventStatus(ev) !== "onsale") return false;
  return true;
}

/* 受付中 → 受付前 → 終了、同ステータス内は初日が近い順 */
const STATUS_ORDER = { onsale: 0, upcoming: 1, ended: 2 };

function sortEvents(list) {
  return [...list].sort((a, b) => {
    const s = STATUS_ORDER[eventStatus(a)] - STATUS_ORDER[eventStatus(b)];
    if (s !== 0) return s;
    return Math.min(...a.performances.map((p) => p.d)) - Math.min(...b.performances.map((p) => p.d));
  });
}

/* ---------- カード描画 ---------- */

function cardHTML(ev) {
  const st = eventStatus(ev);
  const regions = regionsOf(ev);
  return `
    <a class="event-card" href="event.html?id=${ev.id}">
      <div class="card-visual" style="${visualStyle(ev)}">
        <span class="genre-tag">${GENRES[ev.genre].label}</span>
        <span class="visual-title">${ev.title}</span>
      </div>
      <div class="card-body">
        <span class="card-artist">${ev.artist}</span>
        <h3 class="card-title">${ev.title}</h3>
        <div class="card-info">
          <span class="row"><span class="ico">&#128197;</span>${firstLastDates(ev)}</span>
          <span class="row"><span class="ico">&#128205;</span>${regions.join("・")}</span>
        </div>
        <div class="card-foot">
          <span class="perf-count">全 <b>${ev.performances.length}</b> 公演</span>
          <span class="badge ${st}">${STATUS_LABEL[st]}</span>
        </div>
      </div>
    </a>`;
}

function render() {
  const list = sortEvents(EVENTS.filter(matches));
  $("#event-grid").innerHTML = list.map(cardHTML).join("");
  $("#result-count").textContent = list.length;
  $("#empty-state").hidden = list.length > 0;

  const filtering = state.keyword || state.genre || state.region || state.month || state.onsaleOnly;
  $("#clear-filters").classList.toggle("visible", !!filtering);
}

/* ---------- レコメンド（デモ：音楽好き想定で受付中/受付前の音楽系を優先） ---------- */

function renderRecommend() {
  const picks = sortEvents(
    EVENTS.filter((ev) => eventStatus(ev) !== "ended")
  ).sort((a, b) => {
    const am = a.genre === "music" || a.genre === "festival" ? 0 : 1;
    const bm = b.genre === "music" || b.genre === "festival" ? 0 : 1;
    return am - bm;
  }).slice(0, 4);
  $("#recommend-strip").innerHTML = picks.map(cardHTML).join("");
}

/* ---------- 改善ポイント表示 ---------- */

function initPointsToggle() {
  const btn = $("#points-toggle");
  btn.addEventListener("click", () => {
    document.body.classList.toggle("show-points");
    const on = document.body.classList.contains("show-points");
    btn.innerHTML = on ? "&#128161; 改善ポイントを隠す" : "&#128161; 改善ポイントを表示";
  });
}

initFilters();
render();
renderRecommend();
initPointsToggle();
