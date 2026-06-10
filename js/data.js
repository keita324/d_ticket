/* =========================================================
   デモ用データ
   掲載のアーティスト・公演はすべて架空です。
   日付は「閲覧日」を基準に自動生成されるため、
   いつ開いても受付中／受付前／受付終了が混在して表示されます。
   ========================================================= */

const GENRES = {
  music:    { label: "音楽ライブ",   grad: ["#cb0a39", "#7a0e2e"] },
  festival: { label: "フェス",       grad: ["#e6552b", "#a92808"] },
  stage:    { label: "舞台・演劇",   grad: ["#5b3a8e", "#2c1a52"] },
  sports:   { label: "スポーツ",     grad: ["#006298", "#003a5c"] },
  comedy:   { label: "お笑い",       grad: ["#e6a722", "#b07408"] },
  classic:  { label: "クラシック",   grad: ["#3d6b4f", "#1f3d2c"] },
};

const REGIONS = ["東京", "神奈川", "千葉", "愛知", "大阪", "福岡", "北海道", "宮城"];

/* d: 公演日（今日からの日数）, s/e: 受付開始・終了（今日からの日数） */
const EVENTS = [
  {
    id: "aurora-tour",
    title: "AURORA NIGHT TOUR 2026",
    artist: "アオゾラシンフォニー",
    genre: "music",
    desc: "全国5都市をめぐるホールツアー。最新アルバム『AURORA』を引っさげた、バンド史上最大規模の公演です。",
    price: [{ name: "指定席", yen: 9800 }, { name: "ファミリー席", yen: 9800 }],
    sale: { s: -20, e: 24 },
    performances: [
      { d: 38, time: "18:00", venue: "東京ガーデンシアター", region: "東京" },
      { d: 39, time: "17:00", venue: "東京ガーデンシアター", region: "東京" },
      { d: 52, time: "18:00", venue: "Zepp Nagoya", region: "愛知" },
      { d: 66, time: "18:00", venue: "大阪城ホール", region: "大阪" },
      { d: 80, time: "17:00", venue: "マリンメッセ福岡 A館", region: "福岡" },
    ],
  },
  {
    id: "starlight-fes",
    title: "STARLIGHT FES 2026",
    artist: "出演アーティスト多数",
    genre: "festival",
    desc: "真夏の夜空の下で楽しむ2DAYS野外フェス。総勢40組以上のアーティストが出演予定。",
    price: [{ name: "1日券", yen: 13500 }, { name: "2日通し券", yen: 24000 }],
    sale: { s: -8, e: 30 },
    performances: [
      { d: 45, time: "11:00", venue: "幕張海浜公園 特設会場", region: "千葉" },
      { d: 46, time: "11:00", venue: "幕張海浜公園 特設会場", region: "千葉" },
    ],
  },
  {
    id: "kageboshi-stage",
    title: "舞台『影法師の街』",
    artist: "劇団ハナミズキ",
    genre: "stage",
    desc: "昭和の下町を舞台に、ひとつの嘘が家族の運命を変えていく——。読売演劇大賞ノミネート作の再演。",
    price: [{ name: "S席", yen: 11000 }, { name: "A席", yen: 8500 }],
    sale: { s: 6, e: 40 },
    performances: [
      { d: 55, time: "13:00", venue: "シアターコクーン", region: "東京" },
      { d: 55, time: "18:00", venue: "シアターコクーン", region: "東京" },
      { d: 56, time: "13:00", venue: "シアターコクーン", region: "東京" },
      { d: 62, time: "14:00", venue: "森ノ宮ピロティホール", region: "大阪" },
      { d: 63, time: "14:00", venue: "森ノ宮ピロティホール", region: "大阪" },
    ],
  },
  {
    id: "vleague-final",
    title: "バレーボール プレミアファイナル 2026",
    artist: "プレミアリーグ",
    genre: "sports",
    desc: "今シーズンの頂点を決める決勝シリーズ。手に汗握る3番勝負をアリーナで体感しよう。",
    price: [{ name: "アリーナSS", yen: 12000 }, { name: "スタンド指定", yen: 6500 }],
    sale: { s: -15, e: 10 },
    performances: [
      { d: 18, time: "14:00", venue: "有明アリーナ", region: "東京" },
      { d: 19, time: "14:00", venue: "有明アリーナ", region: "東京" },
      { d: 20, time: "13:00", venue: "有明アリーナ", region: "東京" },
    ],
  },
  {
    id: "warai-live",
    title: "真夏のお笑いフェスタ 2026",
    artist: "人気芸人 総勢30組",
    genre: "comedy",
    desc: "テレビでおなじみの実力派から次世代の若手まで。笑って猛暑を吹き飛ばす一夜限りのスペシャルライブ。",
    price: [{ name: "全席指定", yen: 5800 }],
    sale: { s: -30, e: -2 },
    performances: [
      { d: 12, time: "18:30", venue: "NHK大阪ホール", region: "大阪" },
    ],
  },
  {
    id: "phil-summer",
    title: "サマーナイト・フィルハーモニー",
    artist: "東都フィルハーモニー管弦楽団",
    genre: "classic",
    desc: "ドヴォルザーク「新世界より」をメインに贈る夏の特別演奏会。クラシック初心者にもおすすめのプログラム。",
    price: [{ name: "S席", yen: 7000 }, { name: "B席", yen: 4000 }],
    sale: { s: -10, e: 35 },
    performances: [
      { d: 48, time: "19:00", venue: "サントリーホール", region: "東京" },
      { d: 70, time: "15:00", venue: "ミューザ川崎シンフォニーホール", region: "神奈川" },
    ],
  },
  {
    id: "neon-parade",
    title: "NEON PARADE ARENA TOUR",
    artist: "ネオンパレード",
    genre: "music",
    desc: "SNS総フォロワー800万人超、今最も勢いのある5人組がついにアリーナへ。新曲を含む全25曲を披露予定。",
    price: [{ name: "指定席", yen: 10800 }, { name: "注釈付指定席", yen: 9800 }],
    sale: { s: 10, e: 45 },
    performances: [
      { d: 75, time: "18:00", venue: "さいたまスーパーアリーナ", region: "東京" },
      { d: 76, time: "16:00", venue: "さいたまスーパーアリーナ", region: "東京" },
      { d: 90, time: "18:00", venue: "大阪城ホール", region: "大阪" },
      { d: 91, time: "16:00", venue: "大阪城ホール", region: "大阪" },
    ],
  },
  {
    id: "hokkaido-jazz",
    title: "札幌ジャズストリート 2026",
    artist: "国内外ジャズプレイヤー多数",
    genre: "music",
    desc: "札幌の街全体がステージになる3日間。国内外の一流プレイヤーが奏でる極上のスウィングを。",
    price: [{ name: "1日パス", yen: 6000 }],
    sale: { s: -5, e: 50 },
    performances: [
      { d: 85, time: "12:00", venue: "札幌市民交流プラザ ほか", region: "北海道" },
      { d: 86, time: "12:00", venue: "札幌市民交流プラザ ほか", region: "北海道" },
      { d: 87, time: "12:00", venue: "札幌市民交流プラザ ほか", region: "北海道" },
    ],
  },
  {
    id: "sendai-baseball",
    title: "東北ドリームマッチ 2026",
    artist: "プロ野球OBオールスターズ",
    genre: "sports",
    desc: "レジェンドたちが杜の都に集結。世代を超えて楽しめる夢の親善試合。収益の一部は震災復興支援へ。",
    price: [{ name: "内野指定", yen: 4500 }, { name: "外野自由", yen: 2500 }],
    sale: { s: -12, e: 28 },
    performances: [
      { d: 42, time: "13:00", venue: "楽天モバイルパーク宮城", region: "宮城" },
    ],
  },
  {
    id: "musical-luna",
    title: "ミュージカル『月光のルナ』",
    artist: "ルナ・カンパニー",
    genre: "stage",
    desc: "月をなくした夜の世界で、少女ルナが光を取り戻す旅に出る。家族で楽しめるオリジナルミュージカル。",
    price: [{ name: "S席", yen: 9500 }, { name: "A席", yen: 7000 }, { name: "こども(S席)", yen: 5000 }],
    sale: { s: -25, e: -3 },
    performances: [
      { d: 8, time: "12:30", venue: "日生劇場", region: "東京" },
      { d: 8, time: "17:00", venue: "日生劇場", region: "東京" },
      { d: 9, time: "12:30", venue: "日生劇場", region: "東京" },
    ],
  },
  {
    id: "acoustic-hall",
    title: "Acoustic Letters 〜弾き語りの夜〜",
    artist: "ハルカワミナト",
    genre: "music",
    desc: "シンガーソングライター ハルカワミナトによる、年に一度のアコースティックワンマン。",
    price: [{ name: "全席指定", yen: 6800 }],
    sale: { s: -3, e: 20 },
    performances: [
      { d: 33, time: "18:30", venue: "Bunkamuraオーチャードホール", region: "東京" },
      { d: 41, time: "18:30", venue: "名古屋市芸術創造センター", region: "愛知" },
    ],
  },
  {
    id: "rakugo-yose",
    title: "納涼 名人寄席",
    artist: "落語名人会",
    genre: "comedy",
    desc: "人間国宝級の名人から人気の若手まで。夏の夜にしっとり笑える、贅沢な寄席をお届けします。",
    price: [{ name: "全席指定", yen: 4800 }],
    sale: { s: 14, e: 55 },
    performances: [
      { d: 95, time: "17:00", venue: "有楽町よみうりホール", region: "東京" },
    ],
  },
];

/* ---------- 日付・ステータスユーティリティ ---------- */

const TODAY = (() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; })();

function addDays(days) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + days);
  return d;
}

const DOW = ["日", "月", "火", "水", "木", "金", "土"];

function fmtDate(d) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function fmtDateFull(d) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${DOW[d.getDay()]})`;
}

/* 受付ステータス: onsale / upcoming / ended */
function eventStatus(ev) {
  if (ev.sale.s > 0) return "upcoming";
  if (ev.sale.e < 0) return "ended";
  return "onsale";
}

const STATUS_LABEL = { onsale: "受付中", upcoming: "受付前", ended: "受付終了" };

function statusNote(ev) {
  if (eventStatus(ev) === "upcoming") {
    return `${fmtDateFull(addDays(ev.sale.s))} 10:00 受付開始`;
  }
  if (eventStatus(ev) === "onsale") {
    return `${fmtDateFull(addDays(ev.sale.e))} 23:59 受付終了`;
  }
  return "受付は終了しました";
}

function firstLastDates(ev) {
  const ds = ev.performances.map((p) => p.d);
  const a = addDays(Math.min(...ds));
  const b = addDays(Math.max(...ds));
  return a.getTime() === b.getTime() ? fmtDateFull(a) : `${fmtDateFull(a)} 〜 ${fmtDateFull(b)}`;
}

function regionsOf(ev) {
  return [...new Set(ev.performances.map((p) => p.region))];
}

function visualStyle(ev) {
  const g = GENRES[ev.genre].grad;
  return `background:linear-gradient(135deg,${g[0]},${g[1]})`;
}
