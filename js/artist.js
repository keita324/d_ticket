/* アーティストページ：プロフィール・公演一覧・おすすめ */

const params = new URLSearchParams(location.search);
const artistId = params.get("id");
const artist = ARTISTS[artistId] || Object.values(ARTISTS)[0];
const aid = ARTISTS[artistId] ? artistId : Object.keys(ARTISTS)[0];

document.title = `${artist.name}｜d ticket 改善提案デモ`;

/* ---------- ヒーロー ---------- */

const g = GENRES[artist.genre].grad;
$("#artist-hero").style.background = `linear-gradient(135deg, ${g[0]}, ${g[1]})`;
$("#artist-name").textContent = artist.name;
$("#artist-desc").textContent = artist.desc;

/* フォローボタン（デモ：状態はページ内のみ） */
const followBtn = $("#follow-btn");
followBtn.addEventListener("click", () => {
  const on = followBtn.classList.toggle("following");
  followBtn.innerHTML = on ? "&#10003; フォロー中" : "&#10010; フォローする";
});

/* ---------- 公演一覧 ---------- */

const myEvents = EVENTS
  .filter((e) => e.artistId === aid)
  .sort((a, b) => firstDate(a) - firstDate(b));

$("#artist-grid").innerHTML = myEvents.map(cardHTML).join("");

/* ---------- こちらもおすすめ（他アーティスト・終了分は除外） ---------- */

const others = EVENTS
  .filter((e) => e.artistId !== aid && eventStatus(e) !== "ended")
  .sort((a, b) => firstDate(a) - firstDate(b))
  .slice(0, 4);

$("#other-grid").innerHTML = others.map(cardHTML).join("");
