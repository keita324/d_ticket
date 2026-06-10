/* 興行詳細ページ：全公演一覧・発売状況・関連レコメンド */

const $ = (sel) => document.querySelector(sel);

const params = new URLSearchParams(location.search);
const ev = EVENTS.find((e) => e.id === params.get("id")) || EVENTS[0];
const st = eventStatus(ev);

/* ---------- ヒーロー ---------- */

document.title = `${ev.title}｜d ticket 改善提案デモ`;
const g = GENRES[ev.genre].grad;
$("#detail-hero").style.backgroundImage =
  `url('${ev.img}'), linear-gradient(135deg, ${g[0]}, ${g[1]})`;
$("#bc-genre").textContent = GENRES[ev.genre].label;
$("#detail-genre").textContent = GENRES[ev.genre].label;
$("#detail-sub").textContent = ev.subTitle;
$("#detail-sub").hidden = !ev.subTitle;
$("#detail-title").textContent = ev.title;
$("#detail-desc").textContent = ev.desc;
$("#detail-key-visual").innerHTML =
  `<img src="${ev.img}" alt="${ev.title}" onerror="this.parentElement.remove()">`;

$("#detail-summary").innerHTML = `
  <span class="item">&#128197; ${firstLastDates(ev)}</span>
  <span class="item">&#128205; ${[...new Set(ev.performances.map((p) => p.venue))].join("／")}</span>
  <span class="item"><span class="badge ${st}">${STATUS_LABEL[st]}</span>&nbsp;${statusNote(ev)}</span>
`;

/* ---------- 公演一覧 ---------- */

function perfRowHTML(p) {
  const d = parseDate(p.date);
  const dowClass = d.getDay() === 0 ? "sun" : d.getDay() === 6 ? "sat" : "";
  const btn =
    st === "onsale"
      ? `<button class="buy-btn onsale" type="button" onclick="alert('（デモ）申込画面へ進みます')">申込む</button>`
      : st === "upcoming"
        ? `<span class="buy-btn upcoming">発売前</span>`
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
        <div class="perf-time">${p.region} ／ 開演 ${p.time}（開場 ${p.open}）</div>
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
  <li>発売状況：<b>${STATUS_LABEL[st]}</b></li>
  <li>${statusNote(ev)}</li>
  <li>お支払い：d払い／dカード／クレジットカード</li>
  <li>チケットはスマートフォンに表示する電子チケットです</li>
`;

/* ---------- モバイル固定CTA（発売中のみ） ---------- */

if (st === "onsale") {
  $("#sticky-cta").classList.add("visible");
  $("#cta-title").textContent = ev.title;
  $("#cta-note").textContent = statusNote(ev);
  $("#cta-btn").addEventListener("click", () => alert("（デモ）申込画面へ進みます"));
}

/* ---------- 関連レコメンド ---------- */

function cardDateHTML(e2) {
  const d = firstDate(e2);
  const dowClass = d.getDay() === 0 ? "sun" : d.getDay() === 6 ? "sat" : "";
  const multi = e2.performances.length > 1
    ? `<span class="multi">〜 ${fmtDate(new Date(Math.max(...e2.performances.map((p) => parseDate(p.date).getTime()))))}</span>`
    : "";
  return `
    <div class="card-date">
      <span class="num">${fmtDate(d)}</span>
      <span class="dow ${dowClass}">(${DOW[d.getDay()]})</span>
      ${multi}
    </div>`;
}

function cardHTML(e2) {
  const s2 = eventStatus(e2);
  const sub = e2.subTitle ? `<span class="card-sub">${e2.subTitle}</span>` : "";
  return `
    <a class="event-card" href="event.html?id=${e2.id}">
      <div class="card-visual">
        ${cardImgTag(e2)}
        <span class="genre-tag">${GENRES[e2.genre].label}</span>
      </div>
      <div class="card-body">
        ${cardDateHTML(e2)}
        ${sub}
        <h3 class="card-title">${e2.title}</h3>
        <span class="card-venue">&#128205; ${[...new Set(e2.performances.map((p) => p.venue))].join("／")}</span>
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
