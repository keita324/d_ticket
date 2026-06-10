/* 興行詳細ページ：全公演一覧・受付状況・関連レコメンド */

const $ = (sel) => document.querySelector(sel);

const params = new URLSearchParams(location.search);
const ev = EVENTS.find((e) => e.id === params.get("id")) || EVENTS[0];
const st = eventStatus(ev);

/* ---------- ヒーロー ---------- */

document.title = `${ev.title}｜d ticket 改善提案デモ`;
$("#detail-hero").style.cssText = visualStyle(ev);
$("#bc-genre").textContent = GENRES[ev.genre].label;
$("#detail-genre").textContent = GENRES[ev.genre].label;
$("#detail-title").textContent = ev.title;
$("#detail-artist").textContent = ev.artist;
$("#detail-desc").textContent = ev.desc;

$("#detail-summary").innerHTML = `
  <span class="item">&#128197; ${firstLastDates(ev)}</span>
  <span class="item">&#128205; ${regionsOf(ev).join("・")}</span>
  <span class="item"><span class="badge ${st}">${STATUS_LABEL[st]}</span>&nbsp;${statusNote(ev)}</span>
`;

/* ---------- 公演一覧 ---------- */

function perfRowHTML(p) {
  const d = addDays(p.d);
  const dowClass = d.getDay() === 0 ? "sun" : d.getDay() === 6 ? "sat" : "";
  const btn =
    st === "onsale"
      ? `<button class="buy-btn onsale" type="button" onclick="alert('（デモ）申込画面へ進みます')">申込む</button>`
      : st === "upcoming"
        ? `<span class="buy-btn upcoming">受付開始前</span>`
        : `<span class="buy-btn ended">受付終了</span>`;
  const note =
    st === "upcoming"
      ? `<div class="perf-note next">&#9200; ${statusNote(ev)}</div>`
      : st === "onsale"
        ? `<div class="perf-note">${statusNote(ev)}</div>`
        : "";
  return `
    <div class="perf-row ${st === "ended" ? "is-ended" : ""}">
      <div class="perf-date">
        <div class="md">${fmtDate(d)}</div>
        <div class="dow ${dowClass}">${DOW[d.getDay()]}曜日</div>
      </div>
      <div class="perf-main">
        <div class="perf-venue">${p.venue}</div>
        <div class="perf-time">${p.region} ／ 開演 ${p.time}（開場は1時間前）</div>
        ${note}
      </div>
      <div class="perf-action">
        <span class="badge ${st}">${STATUS_LABEL[st]}</span>
        ${btn}
      </div>
    </div>`;
}

$("#perf-list").innerHTML = ev.performances.map(perfRowHTML).join("");

/* ---------- サイドバー ---------- */

$("#price-list").innerHTML = ev.price
  .map((p) => `<div class="price-row"><span>${p.name}</span><b>¥${p.yen.toLocaleString()}</b></div>`)
  .join("");

$("#sale-info").innerHTML = `
  <li>受付状況：<b>${STATUS_LABEL[st]}</b></li>
  <li>${statusNote(ev)}</li>
  <li>お支払い：d払い／dカード／クレジットカード</li>
  <li>チケットはスマートフォンに表示する電子チケットです</li>
`;

/* ---------- モバイル固定CTA（受付中のみ） ---------- */

if (st === "onsale") {
  $("#sticky-cta").classList.add("visible");
  $("#cta-title").textContent = ev.title;
  $("#cta-note").textContent = statusNote(ev);
  $("#cta-btn").addEventListener("click", () => alert("（デモ）申込画面へ進みます"));
}

/* ---------- 関連レコメンド ---------- */

function cardHTML(e2) {
  const s2 = eventStatus(e2);
  return `
    <a class="event-card" href="event.html?id=${e2.id}">
      <div class="card-visual" style="${visualStyle(e2)}">
        <span class="genre-tag">${GENRES[e2.genre].label}</span>
        <span class="visual-title">${e2.title}</span>
      </div>
      <div class="card-body">
        <span class="card-artist">${e2.artist}</span>
        <h3 class="card-title">${e2.title}</h3>
        <div class="card-info">
          <span class="row"><span class="ico">&#128197;</span>${firstLastDates(e2)}</span>
          <span class="row"><span class="ico">&#128205;</span>${regionsOf(e2).join("・")}</span>
        </div>
        <div class="card-foot">
          <span class="perf-count">全 <b>${e2.performances.length}</b> 公演</span>
          <span class="badge ${s2}">${STATUS_LABEL[s2]}</span>
        </div>
      </div>
    </a>`;
}

const myRegions = regionsOf(ev);
const related = EVENTS
  .filter((e2) => e2.id !== ev.id && eventStatus(e2) !== "ended")
  .sort((a, b) => {
    const score = (x) =>
      (x.genre === ev.genre ? 2 : 0) + (regionsOf(x).some((r) => myRegions.includes(r)) ? 1 : 0);
    return score(b) - score(a);
  })
  .slice(0, 4);

$("#related-grid").innerHTML = related.map(cardHTML).join("");

/* ---------- 改善ポイント表示 ---------- */

$("#points-toggle").addEventListener("click", () => {
  document.body.classList.toggle("show-points");
  const on = document.body.classList.contains("show-points");
  $("#points-toggle").innerHTML = on ? "&#128161; 改善ポイントを隠す" : "&#128161; 改善ポイントを表示";
});
