/* =========================================================
   イベントデータ
   - 実イベント4件は 2026年6月時点で d ticket に掲載中のもの
     （画像は d ticket 公式サイト上の素材を直接参照）
   - real: false の4件は機能デモ用の架空イベント
   ========================================================= */

const GENRES = {
  show:      { label: "フェス・ショー", grad: ["#b81e5b", "#5b1240"] },
  fireworks: { label: "花火",           grad: ["#1d3a8f", "#0b1a4a"] },
  music:     { label: "音楽ライブ",     grad: ["#cb0a39", "#5e0a22"] },
  stage:     { label: "舞台・演劇",     grad: ["#5b3a8e", "#2c1a52"] },
  comedy:    { label: "お笑い",         grad: ["#c47e10", "#7a4a05"] },
  classic:   { label: "クラシック",     grad: ["#2c5e42", "#142e20"] },
};

const IMG_BASE = "https://dticket.docomo.ne.jp/11030001/21030001/ticket-resources/stage-img/";

/* アーティスト（公演主体）。id を持つものはアーティストページあり */
const ARTISTS = {
  tgc: {
    name: "TOKYO GIRLS COLLECTION",
    genre: "show",
    desc: "「日本のガールズカルチャーを世界へ」をテーマに開催される、史上最大級のファッションフェスタ。全国各地で公演を展開中。",
  },
  aozora: {
    name: "アオゾラシンフォニー",
    genre: "music",
    desc: "（架空のアーティスト）疾走感あるバンドサウンドが人気の4人組ロックバンド。最新アルバム『AURORA』を引っさげ全国ツアー中。",
  },
  hanamizuki: {
    name: "劇団ハナミズキ",
    genre: "stage",
    desc: "（架空の劇団）緻密な脚本と温度のある芝居に定評のある劇団。代表作『影法師の街』が各演劇賞にノミネート。",
  },
  totophil: {
    name: "東都フィルハーモニー管弦楽団",
    genre: "classic",
    desc: "（架空の楽団）クラシック初心者からファンまで楽しめる、親しみやすいプログラムに定評のあるオーケストラ。",
  },
};

const EVENTS = [
  /* ---------- d ticket 掲載中の実イベント ---------- */
  {
    id: "260718TGCN03",
    real: true,
    artistId: "tgc",
    title: "NAMICS presents TGC 新潟 2026",
    subTitle: "",
    artist: "TOKYO GIRLS COLLECTION",
    genre: "show",
    img: "images/tgc-niigata.jpg",
    desc: "日本最大級のファッションフェスタ「TGC」が新潟に上陸。人気モデル・アーティスト・ゲストが集結する一夜限りのスペシャルステージ。",
    price: [{ name: "アリーナ指定席", yen: 12000 }, { name: "スタンド指定席", yen: 9000 }],
    sale: { start: "2026-06-27T10:00", end: "2026-07-12T23:59" },
    performances: [
      { date: "2026-07-18", time: "14:00", open: "12:30", venue: "朱鷺メッセ 新潟コンベンションセンター", region: "新潟" },
    ],
  },
  {
    id: "260806BWHS01",
    real: true,
    artistId: null,
    title: "2026 びわ湖大花火大会",
    subTitle: "",
    artist: "びわ湖大花火大会実行委員会",
    genre: "fireworks",
    img: IMG_BASE + "260806BWHS01_7_1.png",
    desc: "びわ湖の夜空を彩る夏の風物詩。湖上に打ち上がる大輪を、ゆったり観覧できる有料観覧席でお楽しみいただけます。チケットは d アカウントでお申し込みいただける電子チケットです。",
    price: [{ name: "イス席", yen: 7500 }, { name: "2Fテラス眺望席", yen: 16000 }],
    sale: { start: "2026-05-23T10:00", end: "2026-08-05T23:59" },
    performances: [
      { date: "2026-08-06", time: "19:30", open: "17:00", venue: "滋賀県営大津港沖水面一帯", region: "滋賀" },
    ],
    /* この興行だけ、読みやすさ重視の専用レイアウトで表示する追加情報。
       内容は d ticket 公式（ssw.web.docomo.ne.jp / dticket.docomo.ne.jp）の
       掲載情報に準拠し、見やすく整理したもの。価格はダイナミックプライシング
       適用前の目安。申込状況（受付中／完売）は公式の掲載状況を反映。 */
    detail: {
      overview: [
        { label: "開催日", value: "2026年8月6日（木）" },
        { label: "打上時間", value: "19:30〜20:30（予定）" },
        { label: "会場", value: "滋賀県営大津港沖水面一帯" },
        { label: "対象年齢", value: "3歳以上はチケットが必要です" },
        { label: "チケット", value: "電子チケット（d アカウントの登録が必要・無料）" },
      ],
      /* 席種・料金。yen=目安価格、unit=販売単位、status: available / soldout */
      priceNote: "表示価格はダイナミックプライシング適用前の目安です。最終価格は購入画面でご確認ください。",
      seatGroups: [
        {
          title: "イス席・特典つきイス席",
          seats: [
            { name: "イス席", yen: 7500, unit: "1名", status: "available", note: "スタンダードな指定イス席" },
            { name: "ポムポムプリン オリジナル特典つきイス席", yen: 9100, unit: "1名", status: "available", note: "G/Hエリア確約・限定特典つき" },
          ],
        },
        {
          title: "湖畔・眺望席",
          seats: [
            { name: "2Fテラス眺望席", yen: 16000, unit: "1名", status: "available", note: "高所からゆったり・お茶＆お菓子つき" },
            { name: "台船正面席", yen: 13000, unit: "1名", status: "available", note: "打上台船を正面に・お茶＆お菓子つき" },
            { name: "台船正面席（ペア）", yen: 26000, unit: "2名1組", status: "soldout", note: "" },
            { name: "プレミアムS席", yen: 12500, unit: "1名", status: "soldout", note: "湖畔最前列" },
            { name: "プレミアムA席", yen: 10500, unit: "1名", status: "soldout", note: "湖畔2列目" },
            { name: "ラグーナ レイクサイドイス席", yen: 8500, unit: "1名", status: "soldout", note: "水際に近いエリア" },
          ],
        },
        {
          title: "ペア・グループ・特別席",
          seats: [
            { name: "カップルシート", yen: 28000, unit: "2名1組", status: "soldout", note: "マリーナエリア前方3列" },
            { name: "2名桟敷席", yen: 26000, unit: "2名1組", status: "soldout", note: "" },
            { name: "6名桟敷席", yen: 48000, unit: "6名1組", status: "soldout", note: "" },
            { name: "5名床席（ところ）", yen: 70000, unit: "5名1組", status: "available", note: "飲み放題つき" },
            { name: "エグゼクティブ席", yen: 29000, unit: "1名", status: "soldout", note: "リクライニング・飲み放題・専用トイレ" },
            { name: "マヂかシート", yen: 112000, unit: "2名1組", status: "soldout", note: "桟橋席・リクライニング・専用トイレ" },
            { name: "ラグジュアリーシート", yen: 115000, unit: "2名1組", status: "soldout", note: "プレミアムエリア・ビールサービス" },
          ],
        },
        {
          title: "カメラ撮影席",
          seats: [
            { name: "カメラ指定席", yen: 18000, unit: "1名", status: "available", note: "約1m四方・三脚使用可" },
            { name: "カメラエリア入場券（なぎさ公園）", yen: 15400, unit: "1名", status: "soldout", note: "三脚使用可" },
          ],
        },
        {
          title: "なぎさ公園 エリア内自由（西側）",
          seats: [
            { name: "ファストパス入場券", yen: 6000, unit: "1名", status: "available", note: "優先入場" },
            { name: "一般エリア入場券", yen: 5000, unit: "1名", status: "available", note: "" },
            { name: "車椅子＆同伴者エリア入場券", yen: 13200, unit: "2名1組", status: "soldout", note: "" },
          ],
        },
      ],
      externalNote: "「柳が崎ヨットハーバー」「なぎさ公園エリア（東側）」は別サイト（KKday）にて販売されます。",
      /* 販売スケジュール（先行抽選〜一般発売）。現在は一般発売を受付中 */
      schedule: [
        { name: "第一次先行抽選受付", period: "2026/4/13（月）〜 4/19（日）", result: "結果発表 4/21（火）18:00", state: "ended" },
        { name: "第二次先行抽選受付", period: "2026/4/22（水）〜 4/28（火）", result: "結果発表 4/30（木）18:00 ／ ダイナミックプライシング開始", state: "ended" },
        { name: "第三次先行抽選受付", period: "2026/5/1（金）〜 5/6（水）", result: "結果発表 5/8（金）18:00", state: "ended" },
        { name: "大津市民限定抽選受付", period: "2026/5/1（金）〜 5/6（水）", result: "結果発表 5/8（金）18:00 ／ 当日会場で本人確認", state: "ended" },
        { name: "一般発売", period: "2026/5/23（土）10:00 〜", result: "先着順・なくなり次第終了", state: "onsale" },
      ],
      /* コラボ特典 */
      benefit: {
        title: "ポムポムプリン オリジナル特典つきイス席",
        lead: "対象席種をご購入の方全員に、チケット1枚につき1個プレゼント",
        items: [
          "もれなくもらえる！びわ湖大花火大会限定「ポムポムプリンフォンタブ」（オリジナル絵柄）",
          "「彦根でみつけた ポムポムプリンのイブイブ」割引券（数量限定）",
        ],
        note: "特典はイベント当日、会場内専用ブースにてお渡し予定です。",
      },
      access: "JR「大津駅」より徒歩約15分／JR「膳所駅」より徒歩約15分。会場周辺は大変混雑するため、公共交通機関のご利用にご協力ください。",
      notes: [
        "本公演はダイナミックプライシング（価格変動制）を適用しています（第二次先行抽選以降）。価格は過去の販売動向・残席・天候予報等により変動し、最終価格は購入画面でご確認ください。",
        "申込状況は変動します。最新の空席状況・価格は公式の申込画面でご確認ください。",
        "雨天決行・荒天中止。イベント中止の場合を除き、購入後の返金・キャンセルはできません。",
        "ペットの同伴、傘のご使用はできません（レインコートは可）。三脚はカメラ指定エリアのみ使用可能です。",
        "チケットはスマートフォンに表示する電子チケットです（一部例外を除く）。",
      ],
    },
  },
  {
    id: "260816TGCE03",
    real: true,
    artistId: "tgc",
    title: "TGC MATSUYAMA 2026 by TOKYO GIRLS COLLECTION",
    subTitle: "SBI証券 presents",
    artist: "TOKYO GIRLS COLLECTION",
    genre: "show",
    img: IMG_BASE + "260816TGCE03_7_1.jpg",
    desc: "TGCが愛媛・松山で開催決定。最旬ファッションと豪華アーティストライブを体感できるスペシャルイベント。",
    price: [{ name: "アリーナ指定席", yen: 11000 }, { name: "スタンド指定席", yen: 8500 }],
    sale: { start: "2026-05-24T10:00", end: "2026-08-15T23:59" },
    performances: [
      { date: "2026-08-16", time: "13:00", open: "12:00", venue: "愛媛県武道館", region: "愛媛" },
    ],
  },
  {
    id: "260919TGCK01",
    real: true,
    artistId: "tgc",
    title: "第43回 マイナビ 東京ガールズコレクション 2026 AUTUMN/WINTER",
    subTitle: "",
    artist: "TOKYO GIRLS COLLECTION",
    genre: "show",
    img: IMG_BASE + "260919TGCK01_7_1.jpg",
    desc: "史上最大級のファッションフェスタ、2026年秋冬シーズンの本祭。横浜アリーナで開催される一大エンターテインメント。",
    price: [{ name: "アリーナ指定席", yen: 12000 }, { name: "スタンド指定席", yen: 9500 }],
    sale: { start: "2026-06-20T10:00", end: "2026-09-13T23:59" },
    performances: [
      { date: "2026-09-19", time: "14:00", open: "12:00", venue: "横浜アリーナ", region: "神奈川" },
    ],
  },

  /* ---------- 機能デモ用の架空イベント ---------- */
  {
    id: "demo-aurora",
    real: false,
    artistId: "aozora",
    title: "AURORA NIGHT TOUR 2026",
    subTitle: "",
    artist: "アオゾラシンフォニー",
    genre: "music",
    img: "images/aurora.svg",
    desc: "最新アルバム『AURORA』を引っさげた、バンド史上最大規模のアリーナツアー。全国4都市6公演から日程をえらべます。",
    price: [{ name: "指定席", yen: 9800 }, { name: "注釈付指定席", yen: 8800 }],
    sale: { start: "2026-06-01T10:00", end: "2026-08-30T23:59" },
    performances: [
      { date: "2026-09-05", time: "18:00", open: "16:30", venue: "さいたまスーパーアリーナ", region: "埼玉" },
      { date: "2026-09-06", time: "17:00", open: "15:30", venue: "さいたまスーパーアリーナ", region: "埼玉" },
      { date: "2026-09-12", time: "18:00", open: "16:30", venue: "日本ガイシホール", region: "愛知" },
      { date: "2026-09-26", time: "18:00", open: "16:30", venue: "大阪城ホール", region: "大阪" },
      { date: "2026-09-27", time: "16:00", open: "14:30", venue: "大阪城ホール", region: "大阪" },
      { date: "2026-10-03", time: "17:00", open: "15:30", venue: "マリンメッセ福岡 A館", region: "福岡" },
    ],
  },
  {
    id: "demo-kageboshi",
    real: false,
    artistId: "hanamizuki",
    title: "舞台『影法師の街』",
    subTitle: "再演",
    artist: "劇団ハナミズキ",
    genre: "stage",
    img: "images/kageboshi.svg",
    desc: "昭和の下町を舞台に、ひとつの嘘が家族の運命を変えていく——。演劇賞ノミネート作、待望の再演。",
    price: [{ name: "S席", yen: 11000 }, { name: "A席", yen: 8500 }],
    sale: { start: "2026-06-28T10:00", end: "2026-09-30T23:59" },
    performances: [
      { date: "2026-10-10", time: "13:00", open: "12:15", venue: "シアターコクーン", region: "東京" },
      { date: "2026-10-10", time: "18:00", open: "17:15", venue: "シアターコクーン", region: "東京" },
      { date: "2026-10-11", time: "13:00", open: "12:15", venue: "シアターコクーン", region: "東京" },
    ],
  },
  {
    id: "demo-owarai",
    real: false,
    artistId: null,
    title: "真夏のお笑いフェスタ 2026",
    subTitle: "",
    artist: "人気芸人 総勢30組",
    genre: "comedy",
    img: "images/owarai.svg",
    desc: "テレビでおなじみの実力派から次世代の若手まで。笑って猛暑を吹き飛ばす一夜限りのスペシャルライブ。",
    price: [{ name: "全席指定", yen: 5800 }],
    sale: { start: "2026-05-10T10:00", end: "2026-06-08T23:59" },
    performances: [
      { date: "2026-07-04", time: "18:30", open: "17:45", venue: "NHK大阪ホール", region: "大阪" },
    ],
  },
  {
    id: "demo-phil",
    real: false,
    artistId: "totophil",
    title: "サマーナイト・フィルハーモニー",
    subTitle: "",
    artist: "東都フィルハーモニー管弦楽団",
    genre: "classic",
    img: "images/phil.svg",
    desc: "ドヴォルザーク「新世界より」をメインに贈る夏の特別演奏会。クラシック初心者にもおすすめのプログラム。",
    price: [{ name: "S席", yen: 7000 }, { name: "B席", yen: 4000 }],
    sale: { start: "2026-06-05T10:00", end: "2026-08-21T23:59" },
    performances: [
      { date: "2026-08-22", time: "19:00", open: "18:15", venue: "サントリーホール", region: "東京" },
    ],
  },
];

const REGIONS = [...new Set(EVENTS.flatMap((e) => e.performances.map((p) => p.region)))];

/* ---------- 日付・ステータスユーティリティ ---------- */

const DOW = ["日", "月", "火", "水", "木", "金", "土"];

function parseDate(s) {
  return new Date(s.includes("T") ? s : s + "T00:00");
}

function fmtDate(d) {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function fmtDateFull(d) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${DOW[d.getDay()]})`;
}

function fmtTime(d) {
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/* 発売ステータス: onsale / upcoming / ended */
function eventStatus(ev) {
  const now = Date.now();
  if (now < parseDate(ev.sale.start).getTime()) return "upcoming";
  if (now > parseDate(ev.sale.end).getTime()) return "ended";
  return "onsale";
}

const STATUS_LABEL = { onsale: "発売中", upcoming: "発売前", ended: "受付終了" };

function statusNote(ev) {
  const st = eventStatus(ev);
  if (st === "upcoming") {
    const d = parseDate(ev.sale.start);
    return `${fmtDateFull(d)} ${fmtTime(d)} 発売開始`;
  }
  if (st === "onsale") {
    const d = parseDate(ev.sale.end);
    return `${fmtDateFull(d)} ${fmtTime(d)} 受付終了`;
  }
  return "受付は終了しました";
}

function firstLastDates(ev) {
  const ds = ev.performances.map((p) => parseDate(p.date).getTime());
  const a = new Date(Math.min(...ds));
  const b = new Date(Math.max(...ds));
  return a.getTime() === b.getTime() ? fmtDateFull(a) : `${fmtDateFull(a)} 〜 ${fmtDateFull(b)}`;
}

function firstDate(ev) {
  return new Date(Math.min(...ev.performances.map((p) => parseDate(p.date).getTime())));
}

function lastDate(ev) {
  return new Date(Math.max(...ev.performances.map((p) => parseDate(p.date).getTime())));
}

function regionsOf(ev) {
  return [...new Set(ev.performances.map((p) => p.region))];
}

/* 会場表記: 会場が多いツアーは「全国n都市ツアー」とまとめる */
function venueSummary(ev) {
  const venues = [...new Set(ev.performances.map((p) => p.venue))];
  if (venues.length <= 2) return venues.join("／");
  return `全国${regionsOf(ev).length}都市ツアー`;
}

/* 画像が読めない場合のフォールバック用グラデーション */
function fallbackStyle(ev) {
  const g = GENRES[ev.genre].grad;
  return `background:linear-gradient(135deg,${g[0]},${g[1]})`;
}

function cardImgTag(ev) {
  return `<img src="${ev.img}" alt="${ev.title}" loading="lazy" decoding="async"
            onerror="this.parentElement.setAttribute('style','${fallbackStyle(ev)}');this.remove()">`;
}
