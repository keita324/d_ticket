/* トップページ：注目興行・検索・絞り込み・一覧・レコメンド */

const state = { keyword: "", genre: "", region: "", month: "", onsaleOnly: false };

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

  // 月（公演がある月だけ）
  const monthSel = $("#month-select");
  const months = [...new Set(
    EVENTS.flatMap((e) => e.performances.map((p) => {
      const d = parseDate(p.date);
      return `${d.getFullYear()}-${d.getMonth()}`;
    }))
  )].sort((a, b) => {
    const [ay, am] = a.split("-").map(Number);
    const [by, bm] = b.split("-").map(Number);
    return ay - by || am - bm;
  });
  months.forEach((m) => {
    const [y, mo] = m.split("-").map(Number);
    const o = document.createElement("option");
    o.value = m;
    o.textContent = `${y}年${mo + 1}月`;
    monthSel.appendChild(o);
  });
  monthSel.addEventListener("change", () => { state.month = monthSel.value; render(); });

  // キーワード
  $("#keyword").addEventListener("input", (e) => { state.keyword = e.target.value.trim(); render(); });

  // 発売中のみ
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
    const target = `${ev.title} ${ev.subTitle} ${ev.artist}`.toLowerCase();
    if (!target.includes(kw)) return false;
  }
  if (state.genre && ev.genre !== state.genre) return false;
  if (state.region && !regionsOf(ev).includes(state.region)) return false;
  if (state.month) {
    const hit = ev.performances.some((p) => {
      const d = parseDate(p.date);
      return `${d.getFullYear()}-${d.getMonth()}` === state.month;
    });
    if (!hit) return false;
  }
  if (state.onsaleOnly && eventStatus(ev) !== "onsale") return false;
  return true;
}

/* 現行サイトと同じく公演日の近い順 */
function sortEvents(list) {
  return [...list].sort((a, b) => firstDate(a) - firstDate(b));
}

function render() {
  const list = sortEvents(EVENTS.filter(matches));
  $("#event-grid").innerHTML = list.map(cardHTML).join("");
  $("#result-count").textContent = list.length;
  $("#empty-state").hidden = list.length > 0;

  const filtering = state.keyword || state.genre || state.region || state.month || state.onsaleOnly;
  $("#clear-filters").classList.toggle("visible", !!filtering);
}

/* ---------- 注目興行（発売中で公演日がいちばん近いもの） ---------- */

function renderFeatured() {
  const pick = sortEvents(EVENTS.filter((ev) => eventStatus(ev) === "onsale"))[0]
            || sortEvents(EVENTS)[0];
  const st = eventStatus(pick);
  const p = pick.performances[0];
  const sub = pick.subTitle ? `<span class="sub-title">${pick.subTitle}</span>` : "";
  $("#featured").innerHTML = `
    <div class="featured" data-point="トップで「いま買える注目興行」を提示">
      <div class="featured-visual" style="background-image:url('${pick.img}'),linear-gradient(135deg,${GENRES[pick.genre].grad[0]},${GENRES[pick.genre].grad[1]})"></div>
      <div class="featured-info">
        <span class="pickup-label">PICK UP</span>
        ${sub}
        <h2>${pick.title}</h2>
        <div class="featured-meta">
          <span class="row">&#128197; <b>${firstLastDates(pick)}</b></span>
          <span class="row">&#128205; ${venueSummary(pick)}</span>
          <span class="row">開演 ${p.time}（開場 ${p.open}）</span>
        </div>
        <div class="featured-cta">
          <a class="buy-btn ${st}" href="event.html?id=${pick.id}">${st === "onsale" ? "チケットをえらぶ" : STATUS_LABEL[st]}</a>
          <span class="badge ${st}">${STATUS_LABEL[st]}</span>
        </div>
      </div>
    </div>`;
}

/* ---------- レコメンド（デモ：音楽・フェス好き想定） ---------- */

function renderRecommend() {
  const picks = sortEvents(EVENTS.filter((ev) => eventStatus(ev) !== "ended"))
    .sort((a, b) => {
      const fav = (x) => (x.genre === "music" || x.genre === "show" ? 0 : 1);
      return fav(a) - fav(b);
    })
    .slice(0, 4);
  $("#recommend-strip").innerHTML = picks.map(cardHTML).join("");
}

initFilters();
renderFeatured();
render();
renderRecommend();
