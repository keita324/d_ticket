/* 興行詳細ページ：全公演一覧・発売状況・アーティスト他公演・関連レコメンド */

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

/* 出演・主催（アーティストページがあればリンクに） */
$("#detail-artist-link").innerHTML = ev.artistId
  ? `出演・主催：<a href="artist.html?id=${ev.artistId}">${ARTISTS[ev.artistId].name}</a>`
  : `出演・主催：${ev.artist}`;

$("#detail-summary").innerHTML = `
  <span class="item">&#128197; ${firstLastDates(ev)}</span>
  <span class="item">&#128205; ${venueSummary(ev)}</span>
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

/* ---------- このアーティストの他公演 ---------- */

const sameArtist = ev.artistId
  ? EVENTS.filter((e2) => e2.id !== ev.id && e2.artistId === ev.artistId)
      .sort((a, b) => firstDate(a) - firstDate(b))
  : [];

if (sameArtist.length) {
  $("#artist-events-section").hidden = false;
  $("#artist-events-title").textContent = `${ARTISTS[ev.artistId].name} の他公演`;
  $("#artist-page-link").href = `artist.html?id=${ev.artistId}`;
  $("#artist-events-grid").innerHTML = sameArtist.map(cardHTML).join("");
}

/* ---------- 関連レコメンド（同一アーティストは除外） ---------- */

const myRegions = regionsOf(ev);
const related = EVENTS
  .filter((e2) =>
    e2.id !== ev.id &&
    eventStatus(e2) !== "ended" &&
    !(ev.artistId && e2.artistId === ev.artistId))
  .sort((a, b) => {
    const score = (x) =>
      (x.genre === ev.genre ? 2 : 0) + (regionsOf(x).some((r) => myRegions.includes(r)) ? 1 : 0);
    return score(b) - score(a);
  })
  .slice(0, 4);

$("#related-grid").innerHTML = related.map(cardHTML).join("");
