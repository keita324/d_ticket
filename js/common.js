/* 全ページ共通: カード描画・ハンバーガーメニュー・改善ポイント表示 */

const $ = (sel) => document.querySelector(sel);

/* ---------- イベントカード描画 ---------- */

function cardDateHTML(ev) {
  const d = firstDate(ev);
  const dowClass = d.getDay() === 0 ? "sun" : d.getDay() === 6 ? "sat" : "";
  const multi = ev.performances.length > 1
    ? `<span class="multi">〜 ${fmtDate(lastDate(ev))}</span>`
    : "";
  return `
    <div class="card-date">
      <span class="num">${fmtDate(d)}</span>
      <span class="dow ${dowClass}">(${DOW[d.getDay()]})</span>
      ${multi}
    </div>`;
}

function cardHTML(ev) {
  const st = eventStatus(ev);
  const sub = ev.subTitle ? `<span class="card-sub">${ev.subTitle}</span>` : "";
  return `
    <a class="event-card" href="event.html?id=${ev.id}">
      <div class="card-visual">
        ${cardImgTag(ev)}
        <span class="genre-tag">${GENRES[ev.genre].label}</span>
      </div>
      <div class="card-body">
        ${cardDateHTML(ev)}
        ${sub}
        <h3 class="card-title">${ev.title}</h3>
        <span class="card-venue">&#128205; ${venueSummary(ev)}</span>
        <div class="card-foot">
          <span class="perf-count">全 <b>${ev.performances.length}</b> 公演</span>
          <span class="badge ${st}">${STATUS_LABEL[st]}</span>
        </div>
      </div>
    </a>`;
}

/* ---------- ハンバーガーメニュー ---------- */

function initMenu() {
  const btn = $("#menu-btn");
  const drawer = $("#drawer");
  const backdrop = $("#drawer-backdrop");
  if (!btn || !drawer) return;

  const close = () => {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  };
  btn.addEventListener("click", () => {
    drawer.classList.add("open");
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  });
  backdrop.addEventListener("click", close);
  $("#drawer-close").addEventListener("click", close);
}

/* デモ用リンク（リセール・分配など）はクリックで説明を表示 */
function initDemoLinks() {
  document.querySelectorAll("[data-demo]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      alert("（デモ）" + el.dataset.demo);
    });
  });
}

/* ---------- 改善ポイント表示 ---------- */

function initPointsToggle() {
  const btn = $("#points-toggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.body.classList.toggle("show-points");
    const on = document.body.classList.contains("show-points");
    btn.innerHTML = on ? "&#128161; 改善ポイントを隠す" : "&#128161; 改善ポイントを表示";
  });
}

initMenu();
initDemoLinks();
initPointsToggle();
