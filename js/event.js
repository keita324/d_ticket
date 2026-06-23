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
  `<img src="${ev.img}" alt="${ev.title}" loading="lazy" decoding="async" onerror="this.parentElement.remove()">`;

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

/* =========================================================
   専用レイアウト（びわ湖大花火大会など detail を持つ興行）
   現行の公式ページの掲載内容を、読みやすく整理して表示する
   ========================================================= */

function renderRichDetail(ev) {
  const dt = ev.detail;
  const p = ev.performances[0];

  const overviewHTML = dt.overview
    .map((o) => `<div class="ov-row"><dt>${o.label}</dt><dd>${o.value}</dd></div>`)
    .join("");

  const seatHTML = dt.seatGroups
    .map(
      (g) => `
      <div class="seat-group">
        <h3 class="seat-group-title">${g.title}</h3>
        <div class="seat-table">
          ${g.seats
            .map((s) => {
              const out = s.status === "soldout";
              const stat = out
                ? `<span class="seat-stat out">完売</span>`
                : `<span class="seat-stat ok">受付中</span>`;
              const unit = s.unit ? `<span class="seat-unit">/ ${s.unit}</span>` : "";
              return `
            <div class="seat-row ${out ? "is-soldout" : ""}">
              <div class="seat-name">
                <span class="seat-name-row">${s.name} ${stat}</span>
                ${s.note ? `<span class="seat-note">${s.note}</span>` : ""}
              </div>
              <div class="seat-price">¥${s.yen.toLocaleString()}${unit}</div>
            </div>`;
            })
            .join("")}
        </div>
      </div>`
    )
    .join("");

  const externalHTML = dt.externalNote
    ? `<p class="seat-external">&#8505;&#65039; ${dt.externalNote}</p>`
    : "";

  const scheduleHTML = dt.schedule
    .map((s) => {
      const label = s.state === "onsale" ? "受付中" : s.state === "upcoming" ? "受付前" : "終了";
      return `
      <li class="sch-item ${s.state}">
        <div class="sch-mark"></div>
        <div class="sch-body">
          <div class="sch-head">
            <span class="sch-name">${s.name}</span>
            <span class="badge ${s.state}">${label}</span>
          </div>
          <div class="sch-period">${s.period}</div>
          <div class="sch-result">${s.result}</div>
        </div>
      </li>`;
    })
    .join("");

  const benefitHTML = dt.benefit
    ? `
    <section class="section">
      <div class="section-head"><h2>来場者特典</h2></div>
      <div class="benefit-card">
        <span class="benefit-tag">&#127873; 特典</span>
        <h3>${dt.benefit.title}</h3>
        <p class="benefit-lead">${dt.benefit.lead}</p>
        <ul class="benefit-list">
          ${dt.benefit.items.map((i) => `<li>${i}</li>`).join("")}
        </ul>
        <p class="benefit-note">${dt.benefit.note}</p>
      </div>
    </section>`
    : "";

  const noteHTML = dt.notes.map((n) => `<li>${n}</li>`).join("");

  $("#rich-detail").innerHTML = `
    <p class="detail-desc">${ev.desc}</p>

    <!-- いま申し込めるかを最上部で明示 -->
    <div class="apply-banner ${st}">
      <div class="apply-info">
        <span class="badge ${st}">${STATUS_LABEL[st]}</span>
        <b>${statusNote(ev)}</b>
      </div>
      ${
        st === "onsale"
          ? `<button class="buy-btn onsale" type="button" onclick="alert('（デモ）申込画面へ進みます')">チケットを申し込む</button>`
          : st === "upcoming"
            ? `<span class="buy-btn upcoming">発売前</span>`
            : `<span class="buy-btn ended">受付終了</span>`
      }
    </div>

    <div class="rich-grid">
      <div class="rich-main">
        <section class="section">
          <div class="section-head"><h2>開催概要</h2></div>
          <dl class="overview">${overviewHTML}</dl>
        </section>

        <section class="section">
          <div class="section-head">
            <h2>席種・料金・申込状況</h2>
            <span class="sub">価格は目安（ダイナミックプライシング）</span>
          </div>
          ${seatHTML}
          ${dt.priceNote ? `<p class="price-disclaimer">&#9888;&#65039; ${dt.priceNote}</p>` : ""}
          ${externalHTML}
        </section>

        ${benefitHTML}

        <section class="section">
          <div class="section-head"><h2>アクセス・会場</h2></div>
          <p class="access-text">&#128205; ${dt.access}</p>
        </section>

        <section class="section">
          <div class="section-head"><h2>ご注意</h2></div>
          <ul class="note-list">${noteHTML}</ul>
        </section>
      </div>

      <aside class="rich-side">
        <div class="side-card sticky-side">
          <h3>販売スケジュール</h3>
          <ol class="schedule">${scheduleHTML}</ol>
          <p class="point-note">&#128176; d払いなら <b>dポイント5%還元</b>（デモ表示）</p>
        </div>
      </aside>
    </div>
  `;

  $("#rich-detail").hidden = false;
  $("#default-detail").hidden = true;
}

if (ev.detail) {
  renderRichDetail(ev);
}
