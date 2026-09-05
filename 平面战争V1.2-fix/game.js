"use strict";

const CELL = 40;
const DIRS4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const DIRS8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

const MAPS = {
  small: { w: 45, h: 40, cities: 3, label: "小地图" },
  normal: { w: 55, h: 50, cities: 4, label: "普通地图" },
  large: { w: 65, h: 60, cities: 5, label: "大地图" },
  huge: { w: 75, h: 60, cities: 6, label: "超大地图" },
};

const SCENARIO_MAPS = {
  plains: {
    id: "plains",
    label: "平原对决",
    w: 55,
    h: 50,
    cities: 4,
    ocean: false,
    blurb: "左右对称的标准战场。林丘稀疏，中央留出通道，无海洋。",
    citySpots: [
      { x: 8, y: 14, owner: "player" },
      { x: 19, y: 11, owner: "player" },
      { x: 19, y: 38, owner: "player" },
      { x: 8, y: 41, owner: "player" },
      { x: 46, y: 14, owner: "ai" },
      { x: 35, y: 11, owner: "ai" },
      { x: 35, y: 38, owner: "ai" },
      { x: 46, y: 41, owner: "ai" },
    ],
    forest: [
      [12, 6, 2], [21, 18, 2], [21, 31, 2], [14, 25, 2],
      [6, 22, 1], [24, 7, 1], [16, 44, 2], [4, 8, 1], [10, 36, 1],
    ],
    hills: [
      [15, 20, 1], [23, 24, 1], [10, 32, 1], [25, 13, 1], [17, 40, 1], [22, 8, 1],
    ],
    peaks: [
      [26, 24], [26, 25], [11, 4], [9, 47],
    ],
  },
  strait: {
    id: "strait",
    label: "中央海峡",
    w: 55,
    h: 50,
    cities: 4,
    ocean: true,
    keepSplit: true,
    blurb: "中间一条南北向海峡，左右大陆对称。地面无法步行过海，须靠海军或空军投送。双方前排城市贴岸，可直接部署舰船。",
    citySpots: [
      { x: 9, y: 16, owner: "player" },
      { x: 23, y: 11, owner: "player" },
      { x: 23, y: 38, owner: "player" },
      { x: 9, y: 41, owner: "player" },
      { x: 45, y: 16, owner: "ai" },
      { x: 31, y: 11, owner: "ai" },
      { x: 31, y: 38, owner: "ai" },
      { x: 45, y: 41, owner: "ai" },
    ],
    strait: { from: 24, to: 27 },
    oceanExtra: [
      [23, 7], [23, 8], [23, 20], [23, 21], [23, 22], [23, 33], [23, 34],
    ],
    capes: [
      [24, 14], [24, 15], [24, 27], [24, 28],
    ],
    islands: [
      [27, 6, 1], [26, 24, 1], [27, 43, 1],
    ],
    forest: [
      [12, 6, 2], [16, 22, 2], [16, 32, 2], [6, 24, 1], [14, 44, 2], [4, 10, 1], [18, 8, 1],
    ],
    hills: [
      [15, 20, 1], [11, 30, 1], [18, 42, 1], [20, 16, 1], [7, 8, 1],
    ],
    peaks: [
      [11, 4], [8, 47], [19, 26],
    ],
  },
  mountains: {
    id: "mountains",
    label: "中央山脉",
    w: 55,
    h: 50,
    cities: 4,
    ocean: false,
    blurb: "中央一道南北山脉，地面只能走北口、南口，或穿过预挖的中央隧道。林丘在山前，适合卡口和空军翻山。",
    citySpots: [
      { x: 8, y: 14, owner: "player" },
      { x: 19, y: 11, owner: "player" },
      { x: 19, y: 38, owner: "player" },
      { x: 8, y: 41, owner: "player" },
      { x: 46, y: 14, owner: "ai" },
      { x: 35, y: 11, owner: "ai" },
      { x: 35, y: 38, owner: "ai" },
      { x: 46, y: 41, owner: "ai" },
    ],
    ridge: { from: 26, to: 27 },
    ridgePasses: [[6, 9], [40, 43]],
    ridgeHills: true,
    tunnels: [
      [26, 24], [27, 24], [26, 25], [27, 25],
    ],
    forest: [
      [12, 6, 2], [18, 18, 2], [18, 32, 2], [14, 25, 2],
      [6, 22, 1], [16, 44, 2], [4, 8, 1], [21, 8, 1],
    ],
    hills: [
      [15, 20, 1], [21, 14, 1], [10, 32, 1], [17, 40, 1], [22, 8, 1], [12, 28, 1],
    ],
    peaks: [
      [11, 4], [9, 47],
    ],
  },
  woods: {
    id: "woods",
    label: "密林丘陵",
    w: 55,
    h: 50,
    cities: 4,
    ocean: false,
    blurb: "无海洋。森林与丘陵密布，直射常被挡住。步兵穿林、迫击炮和攻城炮更有价值，坦克不宜硬闯。",
    citySpots: [
      { x: 8, y: 14, owner: "player" },
      { x: 19, y: 11, owner: "player" },
      { x: 19, y: 38, owner: "player" },
      { x: 8, y: 41, owner: "player" },
      { x: 46, y: 14, owner: "ai" },
      { x: 35, y: 11, owner: "ai" },
      { x: 35, y: 38, owner: "ai" },
      { x: 46, y: 41, owner: "ai" },
    ],
    forest: [
      [10, 6, 3], [18, 5, 2], [24, 8, 2],
      [16, 15, 2], [22, 14, 2],
      [12, 22, 3], [20, 21, 2], [25, 23, 2], [7, 20, 2],
      [13, 30, 3], [21, 29, 2], [24, 34, 2], [8, 28, 2],
      [16, 42, 3], [22, 40, 2], [10, 45, 2], [5, 36, 2],
      [4, 12, 2], [26, 16, 2], [17, 35, 2], [6, 8, 1], [14, 10, 1],
    ],
    hills: [
      [14, 10, 2], [23, 18, 2], [11, 18, 1], [19, 25, 2],
      [25, 12, 1], [15, 33, 2], [22, 36, 2], [9, 34, 1],
      [26, 28, 2], [12, 42, 1], [20, 7, 1], [7, 24, 1], [21, 44, 1],
    ],
    peaks: [
      [11, 3], [8, 47], [24, 25],
    ],
  },
  isles: {
    id: "isles",
    label: "群岛",
    w: 55,
    h: 50,
    cities: 4,
    ocean: true,
    oceanFill: true,
    keepSplit: true,
    blurb: "海洋为主，左右各有本岛与前线岛。地面不能涉水，必须靠海军投送或空军飞越。中部有几座无主小岛。",
    citySpots: [
      { x: 14, y: 15, owner: "player" },
      { x: 23, y: 12, owner: "player" },
      { x: 23, y: 37, owner: "player" },
      { x: 14, y: 40, owner: "player" },
      { x: 40, y: 15, owner: "ai" },
      { x: 31, y: 12, owner: "ai" },
      { x: 31, y: 37, owner: "ai" },
      { x: 40, y: 40, owner: "ai" },
    ],
    islands: [
      [9, 15, 5], [9, 40, 5], [19, 12, 4], [19, 37, 4],
      [27, 24, 2], [27, 8, 1], [27, 42, 1], [16, 26, 2],
    ],
    forest: [
      [9, 15, 2], [9, 40, 2], [19, 12, 1], [19, 37, 1], [16, 26, 1],
    ],
    hills: [
      [11, 18, 1], [21, 14, 1], [10, 38, 1], [20, 35, 1], [8, 13, 1],
    ],
    peaks: [
      [7, 12], [8, 43],
    ],
  },
  rift: {
    id: "rift",
    label: "裂谷关隘",
    w: 55,
    h: 50,
    cities: 4,
    ocean: false,
    blurb: "中央一道单格宽的南北裂谷（山峰），只有北、中、南三个关口能走。比中央山脉更窄、更卡。",
    citySpots: [
      { x: 8, y: 14, owner: "player" },
      { x: 19, y: 11, owner: "player" },
      { x: 19, y: 38, owner: "player" },
      { x: 8, y: 41, owner: "player" },
      { x: 46, y: 14, owner: "ai" },
      { x: 35, y: 11, owner: "ai" },
      { x: 35, y: 38, owner: "ai" },
      { x: 46, y: 41, owner: "ai" },
    ],
    ridge: { from: 27, to: 27 },
    ridgePasses: [[5, 8], [23, 26], [41, 44]],
    ridgeHills: true,
    forest: [
      [12, 6, 2], [18, 18, 1], [18, 32, 1], [6, 22, 1], [16, 44, 2],
    ],
    hills: [
      [22, 7, 1], [22, 24, 1], [22, 42, 1], [15, 20, 1], [10, 32, 1],
    ],
    peaks: [
      [11, 4], [9, 47],
    ],
  },
};

function mapInfo(key) {
  if (key === "custom") {
    const name = (game && game.mapName) || "自定义地图";
    return { label: name, w: game && game.w, h: game && game.h, cities: 0 };
  }
  return SCENARIO_MAPS[key] || MAPS[key] || null;
}

function clampMapMoney(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return 1000;
  return Math.max(0, Math.min(99999, v));
}

function copyTerrainBytes(src, w, h) {
  const terrain = new Uint8Array(w * h);
  if (!src) return terrain;
  const len = Math.min(terrain.length, src.length);
  for (let i = 0; i < len; i++) terrain[i] = src[i] & 255;
  return terrain;
}

function terrainHasOcean(terrain) {
  if (!terrain) return false;
  for (let i = 0; i < terrain.length; i++) {
    if (terrain[i] === TERRAIN.OCEAN) return true;
  }
  return false;
}

const TERRAIN = { PLAIN: 0, FOREST: 1, HILL: 2, PEAK: 3, ROAD: 4, TUNNEL: 5, OCEAN: 6 };
const TERRAIN_NAMES = ["平地", "森林", "丘陵", "山峰", "道路", "穿山隧道", "海洋"];
const TERRAIN_TIPS = [
  "平地 · 消耗 1",
  "森林 · 步兵消耗 1 / 车辆 2 · 步兵受击 −1 · 挡住直射",
  "丘陵 · 步兵消耗 2 / 车辆 3 · 受击 −1 · 直射射程 +1 · 挡住直射",
  "山峰 · 地面无法进入 · 不可部署可移动单位 · 挡住直射和曲射",
  "道路 · 从此格走出视为 0.5 格",
  "穿山隧道 · 可穿过，连通的隧道视为同一通道（进出 1 格）",
  "海洋 · 地面无法经过或停留 · 空军可飞越 · 海军可通行",
];
const SETTINGS_KEY = "planeWar_v06_settings";
const SAVE_KEY = "planeWar_v08_save";
const DEFAULT_SETTINGS = { atkPreview: true, compHud: true, autoSaveTurns: 10, music: true };
const NET_PORT = 8765;
const UI_DESIGN_W = 1600;
const UI_DESIGN_H = 900;

function isTouchUi() {
  if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return true;
  return Math.min(window.innerWidth, window.innerHeight) < 720;
}

function applyUiScale() {
  const root = document.documentElement;
  if (isTouchUi()) {
    root.classList.add("touch-ui");
    root.style.setProperty("--ui-sx", "1");
    root.style.setProperty("--ui-sy", "1");
    return;
  }
  root.classList.remove("touch-ui");
  const sx = window.innerWidth / UI_DESIGN_W;
  const sy = window.innerHeight / UI_DESIGN_H;
  root.style.setProperty("--ui-sx", String(sx));
  root.style.setProperty("--ui-sy", String(sy));
}
applyUiScale();

function clampAutoSaveTurns(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return DEFAULT_SETTINGS.autoSaveTurns;
  return Math.max(5, Math.min(50, v));
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return {
        atkPreview: DEFAULT_SETTINGS.atkPreview,
        compHud: DEFAULT_SETTINGS.compHud,
        autoSaveTurns: DEFAULT_SETTINGS.autoSaveTurns,
        music: DEFAULT_SETTINGS.music !== false,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      atkPreview: parsed.atkPreview !== false,
      compHud: parsed.compHud !== false,
      autoSaveTurns: parsed.autoSaveTurns == null
        ? DEFAULT_SETTINGS.autoSaveTurns
        : clampAutoSaveTurns(parsed.autoSaveTurns),
      music: parsed.music !== false,
    };
  } catch (err) {
    return {
      atkPreview: DEFAULT_SETTINGS.atkPreview,
      compHud: DEFAULT_SETTINGS.compHud,
      autoSaveTurns: DEFAULT_SETTINGS.autoSaveTurns,
      music: DEFAULT_SETTINGS.music !== false,
    };
  }
}
function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) { /* ignore quota / private mode */ }
}
function syncSettingsForm() {
  const atk = $("opt-atk-preview");
  const hud = $("opt-comp-hud");
  const mus = $("opt-music");
  const auto = $("opt-autosave");
  if (atk) atk.checked = !!settings.atkPreview;
  if (hud) hud.checked = !!settings.compHud;
  if (mus) mus.checked = settings.music !== false;
  if (auto) auto.value = String(settings.autoSaveTurns);
}
function readSettingsForm() {
  const atk = $("opt-atk-preview");
  const hud = $("opt-comp-hud");
  const mus = $("opt-music");
  const auto = $("opt-autosave");
  if (atk) settings.atkPreview = !!atk.checked;
  if (hud) settings.compHud = !!hud.checked;
  if (mus) settings.music = !!mus.checked;
  if (auto) {
    settings.autoSaveTurns = clampAutoSaveTurns(auto.value);
    auto.value = String(settings.autoSaveTurns);
  }
  saveSettings();
  if (game) updatePills();
  refreshBgm();
}

let settings = loadSettings();
let menuMode = "vsai";
const net = {
  base: "",
  room: "",
  seq: 0,
  timer: 0,
  miss: 0,
  status: "",
  lastPush: 0,
  chat: [],
  chatSeen: 0,
};

const UNITS = {
  line: {
    id: "line", name: "填线兵", cost: 150, hp: 4, move: 3, range: 0, attacks: 1, soldier: true,
    role: "士兵", blurb: "廉价近战步兵，伤害 1.5。进林不减速；林中受地面伤害 −1。",
    dmg() { return 1.5; },
  },
  elite: {
    id: "elite", name: "精英兵", cost: 250, hp: 5.5, move: 3, range: 0, attacks: 1, soldier: true,
    role: "士兵", blurb: "精锐近战步兵，伤害 2。进林不减速；林中受地面伤害 −1。",
    dmg() { return 2; },
  },
  ifv: {
    id: "ifv", name: "步战车", cost: 600, hp: 5, move: 6, range: 2, attacks: 1, soldier: false, direct: true,
    role: "装甲", blurb: "移动 6。近战与远程同伤：基础 2.5，打士兵 4，攻城 1.5。射程 2，每回合远程 1 次，移动后仍可开火。直射会被森林、丘陵或山峰挡住。林中输出 −1。",
    dmg(kind) { return kind === "city" ? 1.5 : kind === "soldier" ? 4 : 2.5; },
  },
  light: {
    id: "light", name: "轻型坦克", cost: 800, hp: 8, move: 5, range: 2, attacks: 1, soldier: false, direct: true,
    role: "坦克", blurb: "移动 5。近战与远程同伤：4；打非士兵 5，攻城 4。射程 2，每回合远程 1 次，移动后仍可开火。直射会被森林、丘陵或山峰挡住。林中输出 −1。",
    dmg(kind) { return kind === "city" ? 4 : kind === "soldier" ? 4 : 5; },
  },
  heavy: {
    id: "heavy", name: "重型坦克", cost: 1100, hp: 10, move: 5, range: 2, attacks: 1, soldier: false, direct: true,
    role: "坦克", blurb: "移动 5。近战与远程伤害 5。射程 2，每回合远程 1 次，移动后仍可开火。直射会被森林、丘陵或山峰挡住。林中输出 −1。",
    dmg() { return 5; },
  },
  spg: {
    id: "spg", name: "自行火炮", cost: 700, hp: 5, move: 3, range: 5, attacks: 1, soldier: false, direct: true,
    role: "远程", blurb: "射程 5。基础 3，攻城 4，打轻/重坦 5。直射会被森林、丘陵或山峰挡住。丘陵上射程 +1。",
    dmg(kind) { return kind === "city" ? 4 : kind === "tank" ? 5 : 3; },
  },
  at: {
    id: "at", name: "反坦克炮", cost: 550, hp: 3, move: 1, range: 5, attacks: 1, soldier: false, direct: true,
    role: "远程", blurb: "射程 5，移动 1。基础 2.5，打城市、坦克、步战车或自行火炮 4。直射会被森林、丘陵或山峰挡住。丘陵上射程 +1。",
    dmg(kind) { return kind === "city" || kind === "tank" || kind === "ifv" || kind === "spg" ? 4 : 2.5; },
  },
  coast: {
    id: "coast", name: "岸防炮", cost: 750, hp: 5, move: 1, range: 5, attacks: 1, soldier: false, direct: true, noMelee: true, needsOcean: true,
    role: "远程",
    blurb: "每回合最多移动 1 格。射程 5。对舰 4，对地 2，攻城 3。只能部署在挨着海洋的陆地。无法近战。直射会被森林、丘陵或山峰挡住。丘陵上射程 +1。无海洋时无法购买。",
    dmg(kind) { return kind === "navy" ? 4 : kind === "city" ? 3 : 2; },
  },
  siege: {
    id: "siege", name: "攻城炮", cost: 800, hp: 8, move: 2, range: 6, attacks: 1, soldier: false,
    role: "远程", blurb: "射程 6。基础 4，攻城 8。曲射可越过森林和丘陵，但会被山峰挡住。",
    dmg(kind) { return kind === "city" ? 8 : 4; },
  },
  mg: {
    id: "mg", name: "机关枪队", cost: 550, hp: 4, move: 2, range: 3, attacks: 2, soldier: false, direct: true,
    role: "远程", blurb: "射程 3，每回合两次攻击。基础 2.5，打士兵 3.5。直射会被森林、丘陵或山峰挡住。丘陵上射程 +1。",
    dmg(kind) { return kind === "soldier" ? 3.5 : 2.5; },
  },
  mortar: {
    id: "mortar", name: "迫击炮", cost: 650, hp: 4, move: 2, range: 6, attacks: 1, soldier: false,
    role: "远程", blurb: "射程 6，落点伤害 4、周围一圈减半。选格轰击 3×3，可误伤友军。2 回合内只能攻击 1 次，且不能同回合移动并攻击。曲射可越过森林和丘陵，但会被山峰挡住。",
    dmg() { return 4; },
    splash: true,
    noMoveAndAttack: true,
    attackEvery: 2,
  },
  aa: {
    id: "aa", name: "防空炮", cost: 550, hp: 5, move: 0, range: 6, rangeAir: 6, attacks: 1, soldier: false, direct: true,
    role: "防空", blurb: "无法移动。对空伤害 4，对地伤害 2，射程 6。受到空军伤害减半；被任意空军对地远程打中时，飞机承受本单位对空伤害的一半作为反击。点「攻击空军」打飞机。可部署在山峰上，地面单位无法接近。对地直射会被森林、丘陵或山峰挡住；对空不受地形影响。丘陵或山峰上射程 +1。",
    dmg() { return 2; },
    dmgAir() { return 4; },
    fromAir: 0.5,
    immobile: true,
  },
  spaa: {
    id: "spaa", name: "自行防空炮", cost: 600, hp: 4, move: 3, range: 4, rangeAir: 4, attacks: 1, soldier: false, direct: true,
    role: "防空", blurb: "移动 3。对空伤害 3.5，对地伤害 2，射程 4。比防空炮弱，但能跟着部队走，移动后仍可开火。点「攻击空军」打飞机。受到攻击机、战斗机伤害减半，轰炸机仍全额；被任意空军对地远程打中时，飞机承受本单位对空伤害的一半作为反击。对地直射会被挡住；丘陵上射程 +1。",
    dmg() { return 2; },
    dmgAir() { return 3.5; },
    fromAir: { atk: 0.5, fighter: 0.5 },
  },
  atk: {
    id: "atk", name: "攻击机", cost: 650, hp: 5, move: 6, range: 4, rangeAir: 4, attacks: 1, soldier: false, air: true,
    role: "空军", blurb: "对地伤害 4，对空伤害 3，射程 4。直线飞行（含斜角）。只能部署在机场或航空母舰，无法近战与防守。先移动后攻击，攻击后本回合不能再移动。可误伤友军。",
    dmg() { return 4; },
    dmgAir() { return 3; },
  },
  fighter: {
    id: "fighter", name: "战斗机", cost: 450, hp: 5, move: 8, range: 3, rangeAir: 3, attacks: 2, soldier: false, air: true,
    role: "空军", blurb: "伤害 2，射程 3，每回合攻击 2 次。直线飞行（含斜角）。只能部署在机场或航空母舰，无法近战与防守。先移动后攻击，攻击后本回合不能再移动。可误伤友军。",
    dmg() { return 2; },
    dmgAir() { return 2; },
  },
  lbomber: {
    id: "lbomber", name: "轻型轰炸机", cost: 1000, hp: 9, move: 6, range: 1, rangeAir: 3, attacks: 1, soldier: false, air: true,
    role: "空军", blurb: "对地/城市伤害 3（3×3 全额），对空伤害 2。对地射程 1，对空射程 3。直线飞行（含斜角）。先移动后攻击，攻击后本回合不能再移动。可误伤友军。",
    dmg() { return 3; },
    dmgAir() { return 2; },
    splash: true,
    splashRadius: 1,
    splashFull: true,
    splashGroundOnly: true,
  },
  hbomber: {
    id: "hbomber", name: "重型轰炸机", cost: 1500, hp: 9, move: 6, range: 1, rangeAir: 3, attacks: 1, soldier: false, air: true,
    role: "空军", blurb: "对地/城市伤害 6.5（5×5 全额），对空伤害 2。对地射程 1，对空射程 3。直线飞行（含斜角）。先移动后攻击，攻击后本回合不能再移动。可误伤友军。",
    dmg() { return 6.5; },
    dmgAir() { return 2; },
    splash: true,
    splashRadius: 2,
    splashFull: true,
    splashGroundOnly: true,
  },
  engineer: {
    id: "engineer", name: "军事工程师", cost: 300, hp: 1, move: 3, range: 0, attacks: 0, soldier: false, civilian: true,
    role: "平民",
    blurb: "平民单位，无法攻击，被击即死。可与相邻军事地面单位组成护卫队（同格，随护卫移动，无法被攻击）。在平地花 75 元铺路；非山峰、非海洋花 500 元建前线要塞；相邻山峰（含斜角）花 300 元开穿山隧道。修建 1 座前线要塞或开通 2 条隧道后撤离。",
    dmg() { return 0; },
  },
  transport: {
    id: "transport", name: "运输船", cost: 300, hp: 8, move: 5, range: 1, attacks: 1, soldier: false, navy: true,
    role: "海军",
    blurb: "只能在海洋或沿海城市部署与移动。远程伤害 1，射程 1，移动 5。可载 6 名士兵或军事工程师，另可载 2 辆坦克/步战车/自行火炮，或 1 支护卫队。相邻友军可上船。受空军伤害 −1。",
    dmg() { return 1; },
    noMelee: true,
  },
  destroyer: {
    id: "destroyer", name: "驱逐舰", cost: 850, hp: 8, move: 3, range: 3, rangeAir: 3, attacks: 1, soldier: false, navy: true,
    role: "海军",
    blurb: "只能在海洋或沿海城市行动。近战 4，远程 3（对空 4），对地远程为 3×3 全额，射程 3，移动 3。受空军伤害 −1。",
    dmg() { return 3; },
    meleeDmg() { return 4; },
    dmgAir() { return 4; },
    splash: true,
    splashRadius: 1,
    splashFull: true,
    splashGroundOnly: true,
  },
  cruiser: {
    id: "cruiser", name: "巡洋舰", cost: 900, hp: 10, move: 3, range: 3, attacks: 1, soldier: false, navy: true,
    role: "海军",
    blurb: "只能在海洋或沿海城市行动。远程伤害对海军 5，对空 4，打陆地单位或城市仅 1。射程 3，移动 3。无法近战。受空军伤害 −1。",
    dmg(kind) { return kind === "navy" ? 5 : kind === "air" ? 4 : 1; },
    noMelee: true,
  },
  battleship: {
    id: "battleship", name: "战列舰", cost: 1800, hp: 16, move: 2, range: 4, attacks: 1, soldier: false, navy: true,
    role: "海军",
    blurb: "只能在海洋或沿海城市行动。近战 5（仅对舰），远程 4 可打击地面单位、城市与建筑。射程 4，移动 2。受空军伤害 −1。",
    dmg() { return 4; },
    meleeDmg() { return 5; },
    noLand: true,
  },
  carrier: {
    id: "carrier", name: "航空母舰", cost: 1300, hp: 8, move: 3, range: 0, attacks: 0, soldier: false, navy: true,
    role: "海军",
    blurb: "只能在海洋或沿海城市行动。无法攻击，移动 3。攻击机和战斗机可降落，相当于移动机场（最多 4 架）。受空军伤害 −1。",
    dmg() { return 0; },
    noMelee: true,
    capacity: 4,
  },
};

const BUILDINGS = {
  airport: {
    id: "airport", name: "机场", cost: 300, hp: 8, capacity: 4,
    role: "建筑",
    blurb: "只能建在控制区的平地，一格一座。友军空军只能部署在机场，每座最多停 4 架。飞到机场格可选择降落停场，停场每回合回复 2 点生命，停场中无法被攻击。右键查看停场。生命 8，打到 0 即摧毁。处于敌方控制区时易主。",
  },
  fortress: {
    id: "fortress", name: "前线要塞", cost: 500, hp: 10, capacity: 2,
    role: "建筑",
    blurb: "军事工程师建造，可建在非山峰、非海洋、非城市、无建筑的格子，不要求原控制区。建成后周围 3×3 变为控制区。可同时容纳 2 个地面单位。内部单位免疫近战与直射；生命 10，每回合回复 1。摧毁后内部单位被挤到相邻格，无空位则死亡。每名工程师建成 1 座要塞后撤离。",
  },
};

const SHOP_SECTIONS = [
  { title: "地面", ids: ["line", "elite", "ifv", "light", "heavy", "spg", "at", "coast", "aa", "spaa", "siege", "mg", "mortar"] },
  { title: "平民", ids: ["engineer"] },
  { title: "海军", ids: ["transport", "destroyer", "cruiser", "battleship", "carrier"], ocean: true },
  { title: "空军", ids: ["atk", "fighter", "lbomber", "hbomber"] },
  { title: "建筑", ids: ["airport"] },
];
const SHOP_ORDER = SHOP_SECTIONS.flatMap((s) => s.ids);

const AIR_MAX_DIST = 20;
const AIRPORT_CAP = 4;
const CARRIER_CAP = 4;
const SOLDIER_TURN_LIMIT = 6;
const TRANSPORT_SOLDIER_CAP = 6;
const TRANSPORT_VEHICLE_CAP = 2;
const TRANSPORT_VEHICLES = { light: 1, heavy: 1, ifv: 1, spg: 1 };
const CITY_LOSS_COMP_BASE = 1750;
const CITY_LOSS_COMP_STEP = 500;
const CITY_CONTROL_BASE = 1;
const CITY_CONTROL_MAX_EXTRA = 2;
const CITY_CONTROL_START_TURN = 10;
const CITY_CONTROL_EVERY = 15;
const DEFAULT_TURN_START = 0;
const DEFAULT_TURN_END = 500;

const AI_DIFF_TABLE = {
  easy: {
    id: "easy", label: "简单",
    playerMoney: 1.15, cpuMoney: 0.82,
    incomeCpu: 0.88, shotMul: 1.55, meleeMul: 1.45,
    allinLeft: 8, allinBoost: false, reserveMul: 1.35,
    mistake: 0.14, openAggro: 0.22,
  },
  normal: {
    id: "normal", label: "普通",
    playerMoney: 1, cpuMoney: 1,
    incomeCpu: 1, shotMul: 1, meleeMul: 1,
    allinLeft: 12, allinBoost: false, reserveMul: 1,
    mistake: 0, openAggro: 0.5,
  },
  hard: {
    id: "hard", label: "困难",
    playerMoney: 0.88, cpuMoney: 1.25,
    incomeCpu: 1.12, shotMul: 0.5, meleeMul: 0.55,
    allinLeft: 18, allinBoost: true, reserveMul: 0.65,
    mistake: 0, openAggro: 0.7,
  },
};

function normalizeAiDiff(id) {
  if (id === "normal" || id === "hard" || id === "easy") return id;
  return "easy";
}

function aiDiff() {
  const id = normalizeAiDiff(game && game.aiDiff);
  return AI_DIFF_TABLE[id] || AI_DIFF_TABLE.easy;
}

function applyAiDiffStartingMoney() {
  if (!game || game.mode !== "vsai") return;
  const d = aiDiff();
  const human = humanOwner();
  const cpu = cpuOwner();
  game.money[human] = Math.max(0, Math.round((game.money[human] || 0) * d.playerMoney));
  game.money[cpu] = Math.max(0, Math.round((game.money[cpu] || 0) * d.cpuMoney));
}


const AI_STYLE_IDS = ["aggressive", "balanced", "conservative"];
const AI_STYLE_NAMES = { aggressive: "猛攻", balanced: "均衡", conservative: "稳守" };
const AI_OFFENSE_TYPES = { light: 1, heavy: 1, siege: 1, mortar: 1, spg: 1, ifv: 1, atk: 1, lbomber: 1, hbomber: 1, destroyer: 1, cruiser: 1, battleship: 1 };
const AI_DEFENSE_TYPES = { at: 1, mg: 1, line: 1, elite: 1, fighter: 1, aa: 1, spaa: 1, engineer: 1, transport: 1, carrier: 1, coast: 1 };

const $ = (id) => document.getElementById(id);

let game = null;
let cam = { x: 0, y: 0, zoom: 1 };
let hover = null;
let keys = Object.create(null);
let anim = null;
let fx = [];
let lastTs = 0;
let loopOn = false;
let toastTimer = 0;
let drag = null;
let nextId = 1;
let audioCtx = null;
let skipClick = false;
let cityCardTimer = 0;

function rand(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
function cheb(ax, ay, bx, by) {
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by));
}
function manh(ax, ay, bx, by) {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}
function round2(n) {
  return Math.round(n * 100) / 100;
}
function hpText(n) {
  const v = round2(n);
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}
function ownerName(o) {
  return o === "player" ? "蓝方" : "红方";
}
function isPvp() {
  return !!(game && (game.mode === "hotseat" || game.mode === "online"));
}
function localOwner() {
  if (!game) return "player";
  if (game.mode === "hotseat") return game.phase === "ai" ? "ai" : "player";
  if (game.mode === "online" || game.mode === "vsai") return game.localSide === "ai" ? "ai" : "player";
  return "player";
}
function foeOwner(owner) {
  return (owner || localOwner()) === "player" ? "ai" : "player";
}
function cpuOwner() {
  if (!game || game.tutorial || game.mode !== "vsai") return "ai";
  return game.localSide === "ai" ? "player" : "ai";
}
function humanOwner() {
  return cpuOwner() === "ai" ? "player" : "ai";
}
function actingOwner() {
  if (!game) return "player";
  return game.phase === "ai" ? "ai" : "player";
}
function canLocalAct() {
  if (!game || game.over || game.busy || game.editor) return false;
  if (game.tutorial) return game.phase === "player";
  if (game.mode === "online") {
    if (net.status === "wait") return false;
    return actingOwner() === localOwner();
  }
  if (game.mode === "hotseat") return game.phase === "player" || game.phase === "ai";
  return actingOwner() === localOwner();
}
function isMine(owner) {
  return owner === localOwner();
}
function selectedMine() {
  return !!(game && game.selected && game.selected.owner === localOwner());
}
function syncSideTheme() {
  if (typeof document === "undefined") return;
  document.body.dataset.side = localOwner();
}

function fogActive() {
  return !!(game && game.fog && !game.editor && !game.tutorial && !game.devFogReveal);
}
function fogViewer() {
  return localOwner();
}
function ensureFogSeen() {
  if (!game) return;
  const n = game.w * game.h;
  if (!game.fogSeen) game.fogSeen = {};
  for (const side of ["player", "ai"]) {
    const cur = game.fogSeen[side];
    if (!cur || cur.length !== n) game.fogSeen[side] = new Uint8Array(n);
    else if (!(cur instanceof Uint8Array)) {
      const a = new Uint8Array(n);
      for (let i = 0; i < n && i < cur.length; i++) a[i] = cur[i] ? 1 : 0;
      game.fogSeen[side] = a;
    }
  }
}
function stampFogVision(grid, cx, cy, range) {
  if (!grid || range < 0) return;
  const x0 = Math.max(0, cx - range);
  const y0 = Math.max(0, cy - range);
  const x1 = Math.min(game.w - 1, cx + range);
  const y1 = Math.min(game.h - 1, cy + range);
  const w = game.w;
  for (let y = y0; y <= y1; y++) {
    const row = y * w;
    for (let x = x0; x <= x1; x++) grid[row + x] = 1;
  }
}
function fogUnitVisionRange(u) {
  if (!u || u.hp <= 0) return 0;
  if (isAboard(u) || isEscorted(u)) return 0;
  if (isAir(u)) return u.parked ? 2 : 5;
  if (u.type === "engineer") return 2;
  return 3;
}
function computeFogVision(owner) {
  const vis = new Uint8Array(game.w * game.h);
  if (!game || !owner) return vis;
  for (const u of game.units) {
    if (u.owner !== owner) continue;
    const r = fogUnitVisionRange(u);
    if (r > 0) stampFogVision(vis, u.x, u.y, r);
  }
  for (const c of game.cities) {
    if (c.owner === owner) stampFogVision(vis, c.x, c.y, 2);
  }
  for (const b of game.buildings) {
    if (b.owner !== owner) continue;
    if (b.type === "airport") stampFogVision(vis, b.x, b.y, 3);
    else if (b.type === "fortress") stampFogVision(vis, b.x, b.y, 2);
  }
  return vis;
}
function markFogSeen(owner, vis) {
  ensureFogSeen();
  const seen = game.fogSeen && game.fogSeen[owner];
  if (!seen || !vis) return;
  const n = Math.min(seen.length, vis.length);
  for (let i = 0; i < n; i++) {
    if (vis[i]) seen[i] = 1;
  }
}
function refreshFogMaps() {
  if (!game) return;
  if (!fogActive()) {
    game.fogVis = { player: null, ai: null };
    return;
  }
  ensureFogSeen();
  const pVis = computeFogVision("player");
  const aVis = computeFogVision("ai");
  game.fogVis = { player: pVis, ai: aVis };
  markFogSeen("player", pVis);
  markFogSeen("ai", aVis);
}
function fogVisible(owner, x, y) {
  if (!fogActive()) return true;
  if (!owner || !inBounds(x, y)) return false;
  if (!game.fogVis || !game.fogVis[owner]) refreshFogMaps();
  const vis = game.fogVis && game.fogVis[owner];
  if (!vis) return true;
  return !!vis[x + y * game.w];
}
function fogSeenAt(owner, x, y) {
  if (!fogActive()) return true;
  if (!owner || !inBounds(x, y)) return false;
  ensureFogSeen();
  const seen = game.fogSeen && game.fogSeen[owner];
  if (!seen) return false;
  return !!seen[x + y * game.w];
}
function fogCanSeeEnemy(owner, unit) {
  if (!unit) return false;
  if (!fogActive()) return true;
  if (unit.owner === owner) return true;
  return fogVisible(owner, unit.x, unit.y);
}
function fogStructureMode(owner, obj) {
  if (!obj) return "hide";
  if (!fogActive() || !owner) return "full";
  if (obj.owner === owner) return "full";
  if (fogVisible(owner, obj.x, obj.y)) return "full";
  if (fogSeenAt(owner, obj.x, obj.y)) return "ghost";
  return "hide";
}
function fogVisibleStack(stack, owner) {
  if (!stack || !stack.length) return stack || [];
  if (!fogActive()) return stack;
  const who = owner || fogViewer();
  return stack.filter((u) => u.owner === who || fogVisible(who, u.x, u.y));
}
function serializeFogSeen() {
  const n = game.w * game.h;
  const pack = (arr) => {
    const out = new Array(n);
    for (let i = 0; i < n; i++) out[i] = arr && arr[i] ? 1 : 0;
    return out;
  };
  const fs = game.fogSeen || {};
  return { player: pack(fs.player), ai: pack(fs.ai) };
}
function restoreFogSeen(g, w, h) {
  const n = w * h;
  const load = (src) => {
    const a = new Uint8Array(n);
    if (!src) return a;
    const len = Math.min(n, src.length);
    for (let i = 0; i < len; i++) a[i] = src[i] ? 1 : 0;
    return a;
  };
  const fs = (g && g.fogSeen) || {};
  return { player: load(fs.player), ai: load(fs.ai) };
}
function emptyFogSeen(w, h) {
  const n = w * h;
  return { player: new Uint8Array(n), ai: new Uint8Array(n) };
}

function isAirLayer() {
  return !!(game && game.layer === "air");
}
function setMapLayer(layer, opts) {
  if (!game) return;
  opts = opts || {};
  if (opts.fromUser && tutBlocked("layer")) {
    tutBlockToast();
    return;
  }
  const next = layer === "air" ? "air" : "ground";
  const changed = game.layer !== next;
  game.layer = next;
  updateLayerSwitch();
  if (changed && opts.notify) toast(next === "air" ? "已切换到空域" : "已切换到地面");
  if (opts.fromUser) tutEmit("layer", { layer: next, changed });
}
function toggleMapLayer() {
  if (!game) return;
  setMapLayer(isAirLayer() ? "ground" : "air", { notify: true, fromUser: true });
}
function updateLayerSwitch() {
  const air = isAirLayer();
  const pulse = game && game.tutorial ? game.tutPulseLayer : null;
  if ($("btn-layer-ground")) {
    $("btn-layer-ground").classList.toggle("active", !air);
    $("btn-layer-ground").classList.toggle("tut-pulse", pulse === "ground" || pulse === true);
  }
  if ($("btn-layer-air")) {
    $("btn-layer-air").classList.toggle("active", air);
    $("btn-layer-air").classList.toggle("tut-pulse", pulse === "air" || pulse === true);
  }
  const wrap = $("stage-wrap");
  if (wrap) wrap.classList.toggle("air-view", air);
  const tag = $("layer-tag");
  if (tag) tag.textContent = air ? "空域" : "地面";
}
function inBounds(x, y) {
  return x >= 0 && y >= 0 && x < game.w && y < game.h;
}

function displayCoord(x, y) {
  return `(${(x | 0) + 1}, ${(y | 0) + 1})`;
}

function clientToCanvas(mx, my) {
  const canvas = $("board");
  const rect = canvas.getBoundingClientRect();
  const cssW = canvas.clientWidth || rect.width || 1;
  const cssH = canvas.clientHeight || rect.height || 1;
  const rw = rect.width || 1;
  const rh = rect.height || 1;
  return {
    x: (mx - rect.left) * (cssW / rw),
    y: (my - rect.top) * (cssH / rh),
    cssW,
    cssH,
    rect,
  };
}

function makeCity(x, y, owner, extra) {
  extra = extra || {};
  const lastUp = extra.lastUpgradeTurn || {};
  return {
    x,
    y,
    owner,
    hp: extra.hp != null ? extra.hp : 10,
    maxHp: extra.maxHp != null ? extra.maxHp : 10,
    lastHitTurn: extra.lastHitTurn != null ? extra.lastHitTurn : -99,
    incomeBonus: extra.incomeBonus || 0,
    incomeUpgrades: extra.incomeUpgrades || 0,
    hpUpgrades: extra.hpUpgrades || 0,
    lastUpgradeTurn: { player: lastUp.player != null ? lastUp.player : -99, ai: lastUp.ai != null ? lastUp.ai : -99 },
    uncapturable: !!extra.uncapturable,
  };
}

function cityUncapturable(city) {
  if (!city) return false;
  if (city.uncapturable) return true;
  if (!game || !game.campaign || !game.campaign.atkHome) return false;
  return game.campaign.atkHome.some((c) => c.x === city.x && c.y === city.y);
}

function cityIncomeOf(city) {
  return 100 + (city.incomeBonus || 0);
}

function ownerIncome(owner) {
  return game.cities.filter((c) => c.owner === owner).reduce((s, c) => s + cityIncomeOf(c), 0);
}

function cityIncomeCost(city) {
  return 200 + 100 * (city.incomeUpgrades || 0);
}

function isCityTruce(city) {
  if (!game || game.turn < 10) return false;
  const last = city.lastHitTurn == null ? -99 : city.lastHitTurn;
  return game.turn - last >= 3;
}

function cityUpgradeReady(city, owner) {
  if (!city.lastUpgradeTurn) city.lastUpgradeTurn = { player: -99, ai: -99 };
  const last = city.lastUpgradeTurn[owner];
  if (last == null || last < 0) return true;
  return game.turn - last >= 5;
}

function cityUpgradeWait(city, owner) {
  if (cityUpgradeReady(city, owner)) return 0;
  const last = city.lastUpgradeTurn[owner];
  return Math.max(0, 5 - (game.turn - last));
}

function cityCanUpgrade(city, owner) {
  return !!city && city.owner === owner && isCityTruce(city) && cityUpgradeReady(city, owner);
}

function markCityHit(city) {
  if (!city) return;
  city.lastHitTurn = game.turn;
}

function justEnteredTruce(city) {
  if (!game || game.turn < 10) return false;
  const last = city.lastHitTurn == null ? -99 : city.lastHitTurn;
  const idle = game.turn - last;
  if (game.turn === 10) return idle >= 3;
  return idle === 3;
}

function isAir(unit) {
  return !!(unit && UNITS[unit.type] && UNITS[unit.type].air);
}
function isAirType(typeId) {
  return !!(UNITS[typeId] && UNITS[typeId].air);
}
function isNavy(unit) {
  return !!(unit && UNITS[unit.type] && UNITS[unit.type].navy);
}
function isNavyType(typeId) {
  return !!(UNITS[typeId] && UNITS[typeId].navy);
}
function isAboard(unit) {
  return !!(unit && unit.aboard);
}
function canCarrierHangar(unit) {
  return !!(unit && (unit.type === "atk" || unit.type === "fighter"));
}
function shopDef(id) {
  return UNITS[id] || BUILDINGS[id] || null;
}
function isBuildingType(id) {
  return !!BUILDINGS[id];
}

function unitKind(unit) {
  const t = UNITS[unit.type];
  if (t.air) return "air";
  if (t.navy) return "navy";
  if (t.soldier) return "soldier";
  if (unit.type === "light" || unit.type === "heavy") return "tank";
  if (unit.type === "ifv" || unit.type === "spg") return unit.type;
  return "nonsoldier";
}

function attackRangeOf(unit, mode) {
  const def = UNITS[unit.type];
  let r = (mode === "air" && def.rangeAir != null) ? def.rangeAir : (def.range || 0);
  if (r > 0 && isDirectFire(unit) && isElevated(unit.x, unit.y)) r += 1;
  return r;
}
function canShootAir(unit) {
  return !!(unit && UNITS[unit.type] && UNITS[unit.type].rangeAir != null);
}
function isImmobile(unit) {
  const def = unit && UNITS[unit.type];
  return !!(def && (def.immobile || def.move <= 0));
}
function fromAirScale(attacker, defender) {
  if (!isAir(attacker) || !defender || isAir(defender)) return 1;
  const s = UNITS[defender.type].fromAir;
  if (s == null) return 1;
  if (typeof s === "number") return s;
  if (typeof s === "object") {
    const v = s[attacker.type];
    return v == null ? 1 : v;
  }
  return 1;
}

function isAaUnit(unit) {
  return !!(unit && (unit.type === "aa" || unit.type === "spaa"));
}

/** Air that ground-attacks AA takes half of that AA's anti-air damage as return fire. */
function aaFlakBacklash(attacker, defender) {
  if (!attacker || !defender || !isAir(attacker) || isAir(defender)) return 0;
  if (defender.owner === attacker.owner) return 0;
  if (!isAaUnit(defender) || defender.hp <= 0) return 0;
  const def = UNITS[defender.type];
  if (!def || !def.dmgAir) return 0;
  return round2(def.dmgAir() * 0.5);
}

function applyAaFlak(attacker, defender) {
  const flak = aaFlakBacklash(attacker, defender);
  if (flak <= 0 || !attacker || attacker.hp <= 0) return { backlash: 0, attackerDead: false };
  attacker.hp = round2(attacker.hp - flak);
  spawnFx(attacker.x, attacker.y, `防空 -${hpText(flak)}`, "#9fd0ff");
  log(`${UNITS[attacker.type].name} 攻击防空单位，受到防空反击 ${hpText(flak)}（对空伤害一半）。`, "sys");
  let attackerDead = false;
  if (attacker.hp <= 0) {
    attackerDead = true;
    log(`${UNITS[attacker.type].name} 被防空反击歼灭。`, "sys");
    noteUnitKill(defender, attacker);
    removeUnit(attacker);
    spawnFx(attacker.x, attacker.y + 0.25, "歼灭", "#fff");
    beep("die");
  }
  return { backlash: flak, attackerDead };
}

function fromAirLabel(def) {
  if (!def) return "";
  if (def.navy) return "受到空军伤害 −1";
  if (def.fromAir == null) return "";
  if (typeof def.fromAir === "number") return `受到空军伤害 ×${def.fromAir}`;
  const names = { atk: "攻击机", fighter: "战斗机", lbomber: "轻型轰炸机", hbomber: "重型轰炸机" };
  const parts = [];
  for (const id of Object.keys(def.fromAir)) {
    parts.push(`${names[id] || id} ×${def.fromAir[id]}`);
  }
  return parts.length ? "受到 " + parts.join("、") : "";
}
function garrisonSplit(raw, unit, opts) {
  opts = opts || {};
  let toU = raw / 2;
  let toC = raw / 2;
  const extra = Math.max(
    (opts.isMelee && unit && unit.defending) ? 1 : 0,
    opts.mit || 0
  );
  if (extra) toU = Math.max(0, toU - extra);
  if (opts.attacker && unit) toU *= fromAirScale(opts.attacker, unit);
  toU = round2(toU);
  toC = round2(toC);
  let overflow = 0;
  const hp = unit ? Math.max(0, unit.hp) : 0;
  if (unit && toU > hp) {
    overflow = round2(toU - hp);
    toU = round2(hp);
    toC = round2(toC + overflow);
  }
  return { toU, toC, overflow };
}

function usesGroundSplash(unit, mode) {
  const def = UNITS[unit.type];
  if (!def.splash) return false;
  if (def.splashGroundOnly && mode === "air") return false;
  return true;
}

function previewDamageInfo(attacker, tx, ty, mode, dmgScale, isMelee) {
  const scale = dmgScale != null ? dmgScale : 1;
  const labels = [];
  if (!attacker || !inBounds(tx, ty)) return labels;
  if (mode === "air") {
    const airs = flyingAirAt(tx, ty).filter((u) => u.id !== attacker.id && fogCanSeeEnemy(attacker.owner, u));
    if (!airs.length) return labels;
    const target = airs.find((u) => u.owner !== attacker.owner) || airs[0];
    const raw = round2(damageOf(attacker, { unit: target, air: target }, "air") * scale);
    if (raw > 0) labels.push({ x: tx, y: ty, text: `-${hpText(raw)}`, color: "#9fd0ff" });
    return labels;
  }
  const tile = getTile(tx, ty);
  const shieldFort = isFortress(tile.building) && tile.unit && !isAir(attacker) && (isMelee || isDirectFire(attacker));
  let unit = shieldFort ? null : tile.unit;
  if (fogActive()) {
    const who = attacker.owner;
    if (unit && unit.owner !== who && !fogVisible(who, tx, ty)) unit = null;
    if (tile.city && tile.city.owner !== who && !fogVisible(who, tx, ty)) tile.city = null;
    if (tile.building && tile.building.owner !== who && !fogVisible(who, tx, ty)) tile.building = null;
  }
  if (!unit && !tile.city && !tile.building) return labels;
  const raw = round2(damageOf(attacker, { unit, city: tile.city, building: tile.building }, "ground") * scale);
  const mit = !isAir(attacker) ? groundMitigation(attacker, unit, tx, ty, isMelee) : 0;
  if (unit && isCivilian(unit)) {
    labels.push({ x: tx, y: ty, text: "击毙", color: "#ff8a7a" });
  } else if (unit && tile.city) {
    const split = garrisonSplit(raw, unit, { isMelee, attacker, mit });
    labels.push({ x: tx, y: ty, text: `-${hpText(split.toU)}/-${hpText(split.toC)}`, color: "#ffd27a" });
  } else if (unit) {
    let d = raw;
    if (mit) d = Math.max(0, round2(d - mit));
    d = round2(d * fromAirScale(attacker, unit));
    if (isAir(attacker) && isNavy(unit)) d = Math.max(0, round2(d - 1));
    labels.push({ x: tx, y: ty, text: `-${hpText(d)}`, color: "#ff8a7a" });
    if (isMelee && unit.owner !== attacker.owner) {
      const atkDmg = meleeDmgVs(attacker, unit);
      const defDmg = meleeDmgVs(unit, attacker);
      if (defDmg > atkDmg) {
        const back = round2((defDmg - atkDmg) / 2);
        if (back > 0) labels.push({ x: attacker.x, y: attacker.y, text: `反伤-${hpText(back)}`, color: "#ffd27a" });
      }
    } else if (!isMelee && unit.owner !== attacker.owner) {
      const flak = aaFlakBacklash(attacker, unit);
      if (flak > 0) labels.push({ x: attacker.x, y: attacker.y, text: `防空-${hpText(flak)}`, color: "#9fd0ff" });
    }
  } else if (tile.city) {
    labels.push({ x: tx, y: ty, text: `-${hpText(raw)}`, color: "#ffb070" });
  } else if (tile.building) {
    labels.push({ x: tx, y: ty, text: `-${hpText(raw)}`, color: "#ffb070" });
  }
  return labels;
}

function collectAttackPreview(sel, hoverTile, atkMode) {
  const labels = [];
  if (!sel || !hoverTile || !inBounds(hoverTile.x, hoverTile.y)) return labels;
  const r = attackRangeOf(sel, atkMode);
  if (cheb(sel.x, sel.y, hoverTile.x, hoverTile.y) > r || (hoverTile.x === sel.x && hoverTile.y === sel.y)) return labels;
  if (shotBlocked(sel, atkMode, hoverTile.x, hoverTile.y)) return labels;
  if (usesGroundSplash(sel, atkMode)) {
    const radius = UNITS[sel.type].splashRadius != null ? UNITS[sel.type].splashRadius : 1;
    const seen = new Set();
    for (const cell of splashCells(hoverTile.x, hoverTile.y, radius)) {
      const scale = UNITS[sel.type].splashFull || cell.center ? 1 : 0.5;
      for (const lab of previewDamageInfo(sel, cell.x, cell.y, "ground", scale, false)) {
        const k = lab.x + "," + lab.y + ":" + lab.text;
        if (seen.has(k)) continue;
        seen.add(k);
        labels.push(lab);
      }
    }
    return labels;
  }
  return previewDamageInfo(sel, hoverTile.x, hoverTile.y, atkMode, 1, false);
}

function damageOf(attacker, target, mode) {
  const def = UNITS[attacker.type];
  if (mode === "air") {
    const u = target.air || target.unit;
    return def.dmgAir ? def.dmgAir(u ? unitKind(u) : "air") : def.dmg("air");
  }
  if (target.city && target.unit) {
    return Math.max(def.dmg("city"), def.dmg(unitKind(target.unit)));
  }
  if (target.unit) return def.dmg(unitKind(target.unit));
  return def.dmg("city");
}

function meleeDmgVs(attacker, defender) {
  if (isAir(attacker) || isAir(defender)) return 0;
  const def = UNITS[attacker.type];
  if (!def || def.noMelee) return 0;
  const kind = unitKind(defender);
  if (def.meleeDmg) return def.meleeDmg(kind);
  return def.dmg(kind);
}

function isCivilian(unit) {
  return !!(unit && UNITS[unit.type] && UNITS[unit.type].civilian);
}
function isCivilianType(typeId) {
  return !!(UNITS[typeId] && UNITS[typeId].civilian);
}
function isMilitaryGround(unit) {
  return !!(unit && !isAir(unit) && !isNavy(unit) && !isCivilian(unit) && !isAboard(unit));
}
function isEscorted(unit) {
  return !!(unit && unit.escortedBy);
}
function unitById(id) {
  if (id == null || !game) return null;
  return game.units.find((u) => u.id === id) || null;
}
function escortPassenger(unit) {
  return unit && unit.escorting ? unitById(unit.escorting) : null;
}
function escortHost(unit) {
  return unit && unit.escortedBy ? unitById(unit.escortedBy) : null;
}
function moveExceptIds(unit) {
  const ids = [unit.id];
  const p = escortPassenger(unit);
  if (p) ids.push(p.id);
  return ids;
}
function isFortress(b) {
  return !!(b && b.type === "fortress");
}
function isTunnelAt(x, y) {
  return terrainAt(x, y) === TERRAIN.TUNNEL;
}
function isRoadAt(x, y) {
  return terrainAt(x, y) === TERRAIN.ROAD;
}
function groundUnitsAt(x, y, exceptId) {
  const ex = exceptId == null ? null : (Array.isArray(exceptId) ? exceptId : [exceptId]);
  return game.units.filter((u) => u.x === x && u.y === y && !isAir(u) && !isNavy(u) && !isAboard(u) && !(ex && ex.includes(u.id)));
}
function groundUnitAt(x, y, exceptId) {
  const here = groundUnitsAt(x, y, exceptId);
  const vis = here.filter((u) => !isEscorted(u));
  return vis.find((u) => !isCivilian(u)) || vis[0] || null;
}
function groundCapacity(x, y) {
  const b = buildingAt(x, y);
  if (isFortress(b)) return (BUILDINGS.fortress && BUILDINGS.fortress.capacity) || 2;
  return 1;
}
function groundOccupancy(x, y, exceptId) {
  return groundUnitsAt(x, y, exceptId).length;
}

function isSoldierType(typeId) {
  return !!(UNITS[typeId] && UNITS[typeId].soldier);
}
function isSoldierUnit(unit) {
  return !!(unit && isSoldierType(unit.type));
}
function groundClassConflict(typeId, x, y, exceptId) {
  const def = UNITS[typeId];
  if (!def || def.air || def.navy || def.civilian) return false;
  const incomingSoldier = !!def.soldier;
  const here = groundUnitsAt(x, y, exceptId).filter((u) => !isEscorted(u) && !isCivilian(u));
  return here.some((u) => isSoldierUnit(u) !== incomingSoldier);
}
function fortressAt(x, y) {
  const b = buildingAt(x, y);
  return isFortress(b) ? b : null;
}
function inFortress(unit) {
  return !!(unit && !isAir(unit) && !isNavy(unit) && !isAboard(unit) && fortressAt(unit.x, unit.y));
}
function ownerFortresses(owner) {
  return game.buildings.filter((b) => b.type === "fortress" && b.owner === owner);
}
function airUnitsAt(x, y, exceptId) {
  return game.units.filter((u) => u.x === x && u.y === y && isAir(u) && u.id !== exceptId);
}
function flyingAirAt(x, y, exceptId) {
  return airUnitsAt(x, y, exceptId).filter((u) => !u.parked);
}
function isParked(unit) {
  return !!(unit && unit.parked && isAir(unit));
}
function navyUnitsAt(x, y, exceptId) {
  const ex = exceptId == null ? null : (Array.isArray(exceptId) ? exceptId : [exceptId]);
  return game.units.filter((u) => u.x === x && u.y === y && isNavy(u) && !isAboard(u) && !(ex && ex.includes(u.id)));
}
function navyUnitAt(x, y, exceptId) {
  return navyUnitsAt(x, y, exceptId)[0] || null;
}
function tileTouchesOcean(x, y) {
  for (const [dx, dy] of DIRS8) {
    const nx = x + dx, ny = y + dy;
    if (inBounds(nx, ny) && isOceanAt(nx, ny)) return true;
  }
  return isOceanAt(x, y);
}
function cityTouchesOcean(c) {
  if (!c) return false;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (inBounds(c.x + dx, c.y + dy) && isOceanAt(c.x + dx, c.y + dy)) return true;
    }
  }
  return false;
}
function isCoastalCityAt(x, y) {
  const c = cityAt(x, y);
  return !!(c && cityTouchesOcean(c));
}
function navyCanStand(x, y) {
  if (!inBounds(x, y)) return false;
  return isOceanAt(x, y) || isCoastalCityAt(x, y);
}
function ownerCarriers(owner) {
  return game.units.filter((u) => u.type === "carrier" && u.owner === owner && u.hp > 0);
}
function hangarOccupancy(x, y, owner) {
  return airUnitsAt(x, y).filter((u) => u.owner === owner).length;
}
function hangarCapacityAt(x, y, owner, plane) {
  const b = buildingAt(x, y);
  if (b && b.type === "airport" && b.owner === owner) return BUILDINGS.airport.capacity || AIRPORT_CAP;
  if (plane && !canCarrierHangar(plane)) return 0;
  const ship = navyUnitsAt(x, y).find((s) => s.type === "carrier" && s.owner === owner);
  if (ship) return UNITS.carrier.capacity || CARRIER_CAP;
  return 0;
}
function homeAirportAt(unit, x, y) {
  if (!unit) return null;
  const tx = x != null ? x : unit.x;
  const ty = y != null ? y : unit.y;
  const b = buildingAt(tx, ty);
  if (b && b.type === "airport" && b.owner === unit.owner) return b;
  if (canCarrierHangar(unit)) {
    const ship = navyUnitsAt(tx, ty).find((s) => s.type === "carrier" && s.owner === unit.owner);
    if (ship) return ship;
  }
  return null;
}
function canLand(unit) {
  if (!isAir(unit) || unit.parked || unit.justDeployed || unit.hp <= 0) return false;
  return !!homeAirportAt(unit);
}
function canTakeOff(unit) {
  if (!isAir(unit) || !unit.parked || unit.justDeployed || unit.hp <= 0) return false;
  if (unit.landedTurn === game.turn) return false;
  return true;
}
function airWantsHangar(unit) {
  if (!isAir(unit)) return false;
  return unit.hp < UNITS[unit.type].hp;
}
function buildingAt(x, y) {
  return game.buildings.find((b) => b.x === x && b.y === y) || null;
}
function cityAt(x, y) {
  return game.cities.find((c) => c.x === x && c.y === y) || null;
}

function getTile(x, y) {
  const gnd = groundUnitAt(x, y);
  const navy = navyUnitAt(x, y);
  return {
    unit: gnd || navy,
    ground: gnd,
    navy,
    airUnits: airUnitsAt(x, y),
    city: cityAt(x, y),
    building: buildingAt(x, y),
    terrain: terrainAt(x, y),
  };
}

function combatUnitAt(attacker, x, y, opts) {
  const gnd = groundUnitAt(x, y);
  const navy = navyUnitAt(x, y);
  if (isNavy(attacker) && navy && navy.owner !== attacker.owner) return navy;
  const meleeOnlySea = !!(UNITS[attacker.type] && UNITS[attacker.type].noLand && opts && opts.melee);
  if (meleeOnlySea) return navy && navy.owner !== attacker.owner ? navy : null;
  return gnd || navy;
}

function terrainAt(x, y) {
  if (!game || !game.terrain || !inBounds(x, y)) return TERRAIN.PLAIN;
  return game.terrain[x + y * game.w] || TERRAIN.PLAIN;
}

function terrainName(t) {
  return TERRAIN_NAMES[t] || "平地";
}

function isDirectFire(unit) {
  const def = unit && UNITS[unit.type];
  return !!(def && def.direct);
}

function needsGroundLoS(unit, mode) {
  if (!unit || mode === "air" || isAir(unit)) return false;
  return isDirectFire(unit);
}

function isElevated(x, y) {
  const t = terrainAt(x, y);
  return t === TERRAIN.HILL || t === TERRAIN.PEAK;
}

function isPeakAt(x, y) {
  return terrainAt(x, y) === TERRAIN.PEAK;
}

function isOceanAt(x, y) {
  return terrainAt(x, y) === TERRAIN.OCEAN;
}

function isImpassableGround(x, y) {
  const t = terrainAt(x, y);
  return t === TERRAIN.PEAK || t === TERRAIN.OCEAN;
}

function canDeployTypeOn(typeId, x, y) {
  if (isOceanAt(x, y)) return false;
  if (typeId === "coast") return !isPeakAt(x, y) && tileTouchesOcean(x, y);
  if (!isPeakAt(x, y)) return true;
  const def = UNITS[typeId];
  if (!def || def.air) return false;
  return !!(def.immobile || def.move <= 0);
}

function blocksDirectLoS(x, y) {
  const t = terrainAt(x, y);
  return t === TERRAIN.FOREST || t === TERRAIN.HILL || t === TERRAIN.PEAK;
}

function blocksIndirectLoS(x, y) {
  return terrainAt(x, y) === TERRAIN.PEAK;
}

function hasLoS(x0, y0, x1, y1, blocks) {
  blocks = blocks || blocksDirectLoS;
  if (x0 === x1 && y0 === y1) return true;
  if (cheb(x0, y0, x1, y1) <= 1) return true;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const nx = Math.abs(dx);
  const ny = Math.abs(dy);
  const sx = dx > 0 ? 1 : -1;
  const sy = dy > 0 ? 1 : -1;
  let x = x0;
  let y = y0;
  let ix = 0;
  let iy = 0;
  while (ix < nx || iy < ny) {
    const xDen = nx === 0 ? Infinity : (ix + 0.5) / nx;
    const yDen = ny === 0 ? Infinity : (iy + 0.5) / ny;
    if (xDen < yDen) {
      x += sx;
      ix += 1;
    } else if (yDen < xDen) {
      y += sy;
      iy += 1;
    } else {
      if (blocks(x + sx, y) || blocks(x, y + sy)) return false;
      x += sx;
      y += sy;
      ix += 1;
      iy += 1;
    }
    if (x === x1 && y === y1) return true;
    if (blocks(x, y)) return false;
  }
  return true;
}

function shotBlocked(unit, mode, x, y) {
  if (!unit || mode === "air" || isAir(unit)) return false;
  if (needsGroundLoS(unit, mode)) return !hasLoS(unit.x, unit.y, x, y, blocksDirectLoS);
  return !hasLoS(unit.x, unit.y, x, y, blocksIndirectLoS);
}

function moveBudget(unit) {
  if (!unit) return 0;
  const m = UNITS[unit.type].move || 0;
  if (isAir(unit)) return m;
  return m * 2;
}

function enterCost(unit, x, y) {
  if (!unit || isAir(unit)) return 1;
  if (isNavy(unit)) return navyCanStand(x, y) ? 2 : 99;
  const t = terrainAt(x, y);
  if (t === TERRAIN.PEAK || t === TERRAIN.OCEAN) return 99;
  if (UNITS[unit.type].soldier || isCivilian(unit)) {
    if (t === TERRAIN.HILL) return 4;
    return 2;
  }
  if (t === TERRAIN.FOREST) return 4;
  if (t === TERRAIN.HILL) return 6;
  return 2;
}

function stepCost(unit, ox, oy, nx, ny) {
  if (!unit || isAir(unit)) return 1;
  if (isNavy(unit)) return navyCanStand(nx, ny) ? 2 : 99;
  if (isImpassableGround(nx, ny)) return 99;
  if (terrainAt(ox, oy) === TERRAIN.ROAD) return 1;
  return enterCost(unit, nx, ny);
}

function moveCostAt(unit, x, y) {
  return enterCost(unit, x, y);
}

function tunnelComponentCells(x, y) {
  if (!isTunnelAt(x, y)) return [];
  const cells = [{ x, y }];
  const seen = new Set([x + "," + y]);
  for (let i = 0; i < cells.length; i++) {
    const p = cells[i];
    for (const [dx, dy] of DIRS4) {
      const nx = p.x + dx, ny = p.y + dy;
      if (!inBounds(nx, ny) || !isTunnelAt(nx, ny)) continue;
      const k = nx + "," + ny;
      if (seen.has(k)) continue;
      seen.add(k);
      cells.push({ x: nx, y: ny });
    }
  }
  return cells;
}

function tunnelExitsAt(x, y) {
  let start = null;
  if (isTunnelAt(x, y)) start = { x, y };
  else {
    for (const [dx, dy] of DIRS4) {
      const nx = x + dx, ny = y + dy;
      if (inBounds(nx, ny) && isTunnelAt(nx, ny)) {
        start = { x: nx, y: ny };
        break;
      }
    }
  }
  if (!start) return [];
  const exits = new Map();
  for (const c of tunnelComponentCells(start.x, start.y)) {
    for (const [dx, dy] of DIRS4) {
      const nx = c.x + dx, ny = c.y + dy;
      if (!inBounds(nx, ny)) continue;
      if (isTunnelAt(nx, ny) || isImpassableGround(nx, ny)) continue;
      exits.set(nx + "," + ny, { x: nx, y: ny });
    }
  }
  return [...exits.values()];
}

function terrainAttackPenalty(attacker) {
  if (!attacker || isAir(attacker)) return 0;
  if (terrainAt(attacker.x, attacker.y) !== TERRAIN.FOREST) return 0;
  const k = unitKind(attacker);
  return k === "tank" || k === "ifv" ? 1 : 0;
}

function groundMitigation(attacker, defender, tx, ty, isMelee) {
  if (!attacker || isAir(attacker)) return 0;
  const atkPen = terrainAttackPenalty(attacker);
  if (cityAt(tx, ty)) return Math.min(1, atkPen);
  let cover = 0;
  if (defender && !isAir(defender)) {
    const ter = terrainAt(tx, ty);
    if (ter === TERRAIN.FOREST && UNITS[defender.type].soldier) cover = 1;
    else if (ter === TERRAIN.HILL) cover = 1;
  }
  const defRed = (isMelee && defender && defender.defending) ? 1 : 0;
  return Math.min(1, Math.max(cover, defRed, atkPen));
}

function stampTerrain(terrain, w, h, cx, cy, radius, kind, jitter, blocked) {
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const i = x + y * w;
      if (blocked && blocked[i]) continue;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (dx === 0 && dy === 0) terrain[i] = kind;
      else if (d <= radius - 0.25 - Math.random() * jitter) terrain[i] = kind;
    }
  }
}

function ensureGroundConnected(terrain, w, h) {
  const passable = (i) => terrain[i] !== TERRAIN.PEAK && terrain[i] !== TERRAIN.OCEAN;
  const flood = () => {
    const seen = new Uint8Array(w * h);
    let start = -1;
    for (let i = 0; i < w * h; i++) {
      if (passable(i)) { start = i; break; }
    }
    if (start < 0) return seen;
    const q = [start];
    seen[start] = 1;
    for (let n = 0; n < q.length; n++) {
      const p = q[n];
      const x = p % w, y = (p / w) | 0;
      for (const [dx, dy] of DIRS4) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const np = nx + ny * w;
        if (seen[np] || !passable(np)) continue;
        seen[np] = 1;
        q.push(np);
      }
    }
    return seen;
  };
  for (let guard = 0; guard < 48; guard++) {
    const seen = flood();
    let cuts = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = x + y * w;
        if (terrain[i] !== TERRAIN.PEAK && terrain[i] !== TERRAIN.OCEAN) continue;
        let reach = false, unreach = false;
        for (const [dx, dy] of DIRS4) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const np = nx + ny * w;
          if (!passable(np)) continue;
          if (seen[np]) reach = true;
          else unreach = true;
        }
        if (reach && unreach) {
          terrain[i] = terrain[i] === TERRAIN.PEAK ? TERRAIN.HILL : TERRAIN.PLAIN;
          cuts += 1;
        }
      }
    }
    if (!cuts) break;
  }
}

function isCoastalCity(c, w, h) {
  return c.y <= 1 || c.y >= h - 2 || c.x <= 1 || c.x >= w - 2;
}

function cityControlHasOcean(terrain, w, h, c) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const x = c.x + dx, y = c.y + dy;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      if (terrain[x + y * w] === TERRAIN.OCEAN) return true;
    }
  }
  return false;
}

function paintOceanInCityControl(terrain, w, h, city) {
  if (!city) return;
  let ox = 0, oy = -1, best = Infinity;
  const opts = [
    [city.y, 0, -1],
    [h - 1 - city.y, 0, 1],
    [city.x, -1, 0],
    [w - 1 - city.x, 1, 0],
  ];
  for (const [d, dx, dy] of opts) {
    if (d < best) {
      best = d;
      ox = dx;
      oy = dy;
    }
  }
  const spots = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const x = city.x + dx, y = city.y + dy;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      spots.push({ x, y, score: dx * ox + dy * oy });
    }
  }
  spots.sort((a, b) => b.score - a.score);
  const nPaint = Math.min(3, spots.length);
  for (let i = 0; i < nPaint; i++) {
    terrain[spots[i].x + spots[i].y * w] = TERRAIN.OCEAN;
  }
  if (city.x >= 0 && city.y >= 0 && city.x < w && city.y < h) {
    terrain[city.x + city.y * w] = TERRAIN.PLAIN;
  }
}

function ensureOceanInCityControl(terrain, w, h, cities) {
  if (!cities || !cities.length) return;
  for (const owner of ["player", "ai"]) {
    const mine = cities.filter((c) => c.owner === owner);
    if (!mine.length) continue;
    if (mine.some((c) => cityControlHasOcean(terrain, w, h, c))) continue;
    let city = mine[0];
    let best = Infinity;
    for (const c of mine) {
      const d = Math.min(c.y, h - 1 - c.y, c.x, w - 1 - c.x);
      if (d < best) {
        best = d;
        city = c;
      }
    }
    paintOceanInCityControl(terrain, w, h, city);
  }
}

function makeOceanPaint(terrain, w, h, blocked) {
  return function paint(x, y) {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = x + y * w;
    if (blocked[i]) return;
    terrain[i] = TERRAIN.OCEAN;
  };
}

function paintEdgeOcean(paint, w, h, prefer, opts) {
  opts = opts || {};
  const sides = ["n", "s", "e", "w"];
  for (let i = sides.length - 1; i > 0; i--) {
    const j = rand(0, i);
    const tmp = sides[i];
    sides[i] = sides[j];
    sides[j] = tmp;
  }
  const idx = sides.indexOf(prefer);
  if (idx > 0) {
    sides[idx] = sides[0];
    sides[0] = prefer;
  }
  let nSides = 1;
  if (opts.split) nSides = 1;
  else if (opts.central) nSides = Math.random() < 0.4 ? 1 : (w >= 70 ? rand(1, 2) : 1);
  else nSides = w >= 70 ? rand(1, 2) : 1;
  const maxFrac = opts.split ? 0.16 : opts.central ? 0.2 : 0.26;
  const depthBase = Math.max(3, Math.round(Math.min(w, h) / (opts.split ? 14 : 11)));
  for (let s = 0; s < nSides; s++) {
    const side = sides[s];
    if (opts.split && (side === "e" || side === "w")) continue;
    if (side === "n" || side === "s") {
      for (let x = 0; x < w; x++) {
        const depth = clamp(depthBase + rand(-2, 3), 2, Math.max(2, Math.floor(h * maxFrac)));
        for (let d = 0; d < depth; d++) paint(x, side === "n" ? d : h - 1 - d);
      }
    } else {
      for (let y = 0; y < h; y++) {
        const depth = clamp(depthBase + rand(-2, 3), 2, Math.max(2, Math.floor(w * Math.min(0.2, maxFrac))));
        for (let d = 0; d < depth; d++) paint(side === "w" ? d : w - 1 - d, y);
      }
    }
  }
}

function cityMiddleGap(cities, w) {
  let pMax = Math.floor(w / 2) - 3;
  let aMin = Math.floor(w / 2) + 3;
  if (cities && cities.length) {
    pMax = 0;
    aMin = w - 1;
    for (const c of cities) {
      if (c.owner === "player") pMax = Math.max(pMax, c.x);
      else aMin = Math.min(aMin, c.x);
    }
  }
  return { lo: pMax + 1, hi: aMin - 1, pMax, aMin };
}

function paintCentralOcean(paint, terrain, w, h, blocked, split, cities) {
  const gap = cityMiddleGap(cities, w);
  const lo = Math.max(2, gap.lo);
  const hi = Math.min(w - 3, gap.hi);
  const band = hi - lo + 1;
  const midX = Math.floor((lo + hi) / 2) + (band > 4 ? rand(-1, 1) : 0);
  const midY = Math.floor(h / 2) + rand(-Math.max(1, Math.floor(h * 0.05)), Math.max(1, Math.floor(h * 0.05)));
  if (band < 3) return;
  const maxHalf = Math.max(1, Math.min(Math.floor((band - 1) / 2), Math.floor(w * 0.12) + 2));
  if (split) {
    let cx = midX;
    const minHalf = Math.min(2, maxHalf);
    const belly = clamp(Math.round(Math.min(band, w * 0.24) * 0.45) + rand(0, 1), minHalf + 1, maxHalf);
    for (let y = 0; y < h; y++) {
      if (Math.random() < 0.5) cx += rand(-1, 1);
      cx = clamp(cx, lo + minHalf, hi - minHalf);
      const t = y / Math.max(1, h - 1);
      const bellyT = Math.sin(t * Math.PI);
      const half = clamp(Math.round(minHalf + bellyT * (belly - minHalf) + rand(-1, 1)), minHalf, maxHalf);
      const left = Math.max(lo, cx - half);
      const right = Math.min(hi, cx + half);
      for (let x = left; x <= right; x++) paint(x, y);
    }
    return;
  }
  const rx = clamp(Math.round(Math.min(band, w * 0.3) * (0.42 + Math.random() * 0.2)), 4, maxHalf);
  const ry = clamp(Math.round(h * (0.22 + Math.random() * 0.14)), 8, Math.floor(h * 0.38));
  for (let y = midY - ry - 3; y <= midY + ry + 3; y++) {
    for (let x = midX - rx - 3; x <= midX + rx + 3; x++) {
      if (x < lo || x > hi) continue;
      const nx = (x - midX) / Math.max(1, rx);
      const ny = (y - midY) / Math.max(1, ry);
      if (nx * nx + ny * ny <= 1.08 + (Math.random() - 0.5) * 0.35) paint(x, y);
    }
  }
  const extra = 2 + rand(0, 2);
  for (let i = 0; i < extra; i++) {
    stampTerrain(
      terrain, w, h,
      clamp(midX + rand(-rx, rx), lo, hi),
      clamp(midY + rand(-ry + 1, ry - 1), 3, h - 4),
      rand(3, 5), TERRAIN.OCEAN, 1.15, blocked
    );
  }
}

function landFloodFrom(terrain, w, h, sx, sy) {
  const passable = (i) => terrain[i] !== TERRAIN.PEAK && terrain[i] !== TERRAIN.OCEAN;
  const seen = new Uint8Array(w * h);
  let start = sx + sy * w;
  if (start < 0 || start >= w * h) return seen;
  if (!passable(start)) {
    terrain[start] = TERRAIN.PLAIN;
  }
  const q = [start];
  seen[start] = 1;
  for (let n = 0; n < q.length; n++) {
    const p = q[n];
    const x = p % w, y = (p / w) | 0;
    for (const [dx, dy] of DIRS4) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const np = nx + ny * w;
      if (seen[np] || !passable(np)) continue;
      seen[np] = 1;
      q.push(np);
    }
  }
  return seen;
}

function carveLandPath(terrain, w, h, x0, y0, x1, y1) {
  let x = x0, y = y0;
  let guard = w * h;
  const fill = (cx, cy) => {
    if (cx < 0 || cy < 0 || cx >= w || cy >= h) return;
    const i = cx + cy * w;
    if (terrain[i] === TERRAIN.PEAK) terrain[i] = TERRAIN.HILL;
    else if (terrain[i] === TERRAIN.OCEAN) terrain[i] = TERRAIN.PLAIN;
  };
  while ((x !== x1 || y !== y1) && guard-- > 0) {
    fill(x, y);
    if (x !== x1 && (y === y1 || Math.random() < 0.5)) x += x < x1 ? 1 : -1;
    else y += y < y1 ? 1 : -1;
  }
  fill(x1, y1);
}

function ensureOwnerCitiesConnected(terrain, w, h, cities) {
  if (!cities || !cities.length) return;
  for (const owner of ["player", "ai"]) {
    const mine = cities.filter((c) => c.owner === owner);
    if (mine.length < 2) continue;
    for (let iter = 0; iter < mine.length; iter++) {
      const seen = landFloodFrom(terrain, w, h, mine[0].x, mine[0].y);
      let disconnected = null;
      for (let i = 1; i < mine.length; i++) {
        if (!seen[mine[i].x + mine[i].y * w]) {
          disconnected = mine[i];
          break;
        }
      }
      if (!disconnected) break;
      let nearest = mine[0];
      let best = cheb(mine[0].x, mine[0].y, disconnected.x, disconnected.y);
      for (const c of mine) {
        if (!seen[c.x + c.y * w]) continue;
        const d = cheb(c.x, c.y, disconnected.x, disconnected.y);
        if (d < best) {
          best = d;
          nearest = c;
        }
      }
      carveLandPath(terrain, w, h, disconnected.x, disconnected.y, nearest.x, nearest.y);
    }
  }
}

function generateOcean(terrain, w, h, cities) {
  const blocked = new Uint8Array(w * h);
  if (cities) {
    for (const c of cities) {
      if (c.x >= 0 && c.y >= 0 && c.x < w && c.y < h) blocked[c.x + c.y * w] = 1;
    }
  }
  const paint = makeOceanPaint(terrain, w, h, blocked);
  const prefer = pickSharedOceanEdge(cities, h);
  const roll = Math.random();
  const split = roll >= 0.75;
  const central = !split && roll >= 0.32;
  paintEdgeOcean(paint, w, h, prefer, { split, central });
  if (split || central) paintCentralOcean(paint, terrain, w, h, blocked, split, cities);
  const lakes = (split || central)
    ? rand(0, 1)
    : Math.max(1, Math.round((w * h) / 680));
  for (let i = 0; i < lakes; i++) {
    stampTerrain(terrain, w, h, rand(3, w - 4), rand(3, h - 4), rand(2, 5), TERRAIN.OCEAN, 1.05, blocked);
  }
  ensureOceanInCityControl(terrain, w, h, cities);
}

function generateTerrain(w, h, cities, withOcean) {
  const terrain = new Uint8Array(w * h);
  const blocked = new Uint8Array(w * h);
  if (cities) {
    for (const c of cities) {
      if (c.x >= 0 && c.y >= 0 && c.x < w && c.y < h) blocked[c.x + c.y * w] = 1;
    }
  }
  const area = w * h;
  const forestPatches = Math.max(5, Math.round(area / 130));
  const hillPatches = Math.max(3, Math.round(area / 170));
  const peakPatches = Math.max(2, Math.round(area / 400));
  for (let i = 0; i < forestPatches; i++) {
    stampTerrain(terrain, w, h, rand(1, w - 2), rand(1, h - 2), rand(2, 5), TERRAIN.FOREST, 1.1, blocked);
  }
  for (let i = 0; i < hillPatches; i++) {
    stampTerrain(terrain, w, h, rand(1, w - 2), rand(1, h - 2), rand(1, 3), TERRAIN.HILL, 0.8, blocked);
  }
  const hillCells = [];
  for (let i = 0; i < terrain.length; i++) {
    if (terrain[i] === TERRAIN.HILL && !blocked[i]) hillCells.push(i);
  }
  for (let i = 0; i < peakPatches; i++) {
    let cell;
    if (hillCells.length) cell = hillCells[rand(0, hillCells.length - 1)];
    else cell = rand(1, w - 2) + rand(1, h - 2) * w;
    if (blocked[cell]) continue;
    terrain[cell] = TERRAIN.PEAK;
    if (Math.random() < 0.4) {
      const [dx, dy] = DIRS4[rand(0, 3)];
      const nx = (cell % w) + dx, ny = ((cell / w) | 0) + dy;
      if (nx > 0 && ny > 0 && nx < w - 1 && ny < h - 1 && !blocked[nx + ny * w]) {
        terrain[nx + ny * w] = TERRAIN.PEAK;
      }
    }
  }
  if (cities) {
    for (const c of cities) {
      if (c.x >= 0 && c.y >= 0 && c.x < w && c.y < h) terrain[c.x + c.y * w] = TERRAIN.PLAIN;
    }
  }
  if (withOcean) generateOcean(terrain, w, h, cities);
  ensureGroundConnected(terrain, w, h);
  if (withOcean) {
    ensureOwnerCitiesConnected(terrain, w, h, cities);
    ensureOceanInCityControl(terrain, w, h, cities);
    if (cities) {
      for (const c of cities) {
        if (c.x >= 0 && c.y >= 0 && c.x < w && c.y < h) terrain[c.x + c.y * w] = TERRAIN.PLAIN;
      }
    }
  }
  return terrain;
}

function makeTutorialTerrain(w, h, cities) {
  const terrain = new Uint8Array(w * h);
  const forest = [
    [8, 8], [8, 9], [9, 8], [9, 9], [10, 8], [10, 9],
    [1, 1], [2, 1], [1, 2], [2, 2],
    [14, 8], [15, 8], [14, 9], [15, 9], [15, 7],
  ];
  const hills = [
    [12, 1], [13, 1], [12, 2],
    [0, 8], [1, 8], [1, 9],
    [16, 3], [16, 4],
  ];
  const peaks = [
    [16, 8], [16, 9],
  ];
  for (const [x, y] of forest) {
    if (x >= 0 && y >= 0 && x < w && y < h) terrain[x + y * w] = TERRAIN.FOREST;
  }
  for (const [x, y] of hills) {
    if (x >= 0 && y >= 0 && x < w && y < h) terrain[x + y * w] = TERRAIN.HILL;
  }
  for (const [x, y] of peaks) {
    if (x >= 0 && y >= 0 && x < w && y < h) terrain[x + y * w] = TERRAIN.PEAK;
  }
  if (cities) {
    for (const c of cities) {
      if (c.x >= 0 && c.y >= 0 && c.x < w && c.y < h) terrain[c.x + c.y * w] = TERRAIN.PLAIN;
    }
  }
  return terrain;
}

function buildScenarioTerrain(scen) {
  const w = scen.w, h = scen.h;
  const terrain = new Uint8Array(w * h);
  if (scen.oceanFill) terrain.fill(TERRAIN.OCEAN);
  const paint = (x, y, kind, landOnly) => {
    const put = (px, py) => {
      if (px < 0 || py < 0 || px >= w || py >= h) return;
      if (landOnly && terrain[px + py * w] === TERRAIN.OCEAN) return;
      terrain[px + py * w] = kind;
    };
    put(x, y);
    const mx = w - 1 - x;
    if (mx !== x) put(mx, y);
  };
  const stamp = (cx, cy, r, kind, landOnly) => {
    r = r || 0;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r + 0.35) paint(cx + dx, cy + dy, kind, landOnly);
      }
    }
  };
  for (const p of scen.islands || []) stamp(p[0], p[1], p[2] || 0, TERRAIN.PLAIN);
  const onLand = !!scen.oceanFill;
  for (const p of scen.forest || []) stamp(p[0], p[1], p[2] || 1, TERRAIN.FOREST, onLand);
  for (const p of scen.hills || []) stamp(p[0], p[1], p[2] || 1, TERRAIN.HILL, onLand);
  for (const p of scen.peaks || []) paint(p[0], p[1], TERRAIN.PEAK, onLand);
  if (scen.ridge) {
    const from = scen.ridge.from;
    const to = scen.ridge.to;
    const passes = scen.ridgePasses || [];
    const inPass = (y) => passes.some((p) => y >= p[0] && y <= p[1]);
    for (let x = from; x <= to; x++) {
      for (let y = 0; y < h; y++) {
        if (!inPass(y)) paint(x, y, TERRAIN.PEAK);
      }
    }
    if (scen.ridgeHills) {
      const hx = from - 1;
      for (let y = 0; y < h; y++) {
        if (!inPass(y)) paint(hx, y, TERRAIN.HILL);
      }
    }
  }
  for (const p of scen.tunnels || []) paint(p[0], p[1], TERRAIN.TUNNEL);
  if (scen.strait) {
    const from = scen.strait.from;
    const to = scen.strait.to;
    for (let x = from; x <= to; x++) {
      for (let y = 0; y < h; y++) paint(x, y, TERRAIN.OCEAN);
    }
  }
  for (const p of scen.oceanExtra || []) paint(p[0], p[1], TERRAIN.OCEAN);
  for (const p of scen.capes || []) paint(p[0], p[1], TERRAIN.PLAIN);
  if (!scen.oceanFill) {
    for (const p of scen.islands || []) stamp(p[0], p[1], p[2] || 0, TERRAIN.PLAIN);
  }
  if (scen.citySpots) {
    for (const c of scen.citySpots) {
      if (c.x >= 0 && c.y >= 0 && c.x < w && c.y < h) terrain[c.x + c.y * w] = TERRAIN.PLAIN;
    }
  }
  if (!scen.keepSplit) ensureGroundConnected(terrain, w, h);
  if (scen.citySpots) {
    for (const c of scen.citySpots) {
      if (c.x >= 0 && c.y >= 0 && c.x < w && c.y < h) terrain[c.x + c.y * w] = TERRAIN.PLAIN;
    }
  }
  return terrain;
}

function loadScenarioCities(scen) {
  return (scen.citySpots || []).map((c) => makeCity(c.x, c.y, c.owner));
}

const CAMPAIGN_KEY = "planeWar_v08_campaign";
const CAMPAIGN_MISSIONS = [
  {
    id: "plains", map: "plains", title: "平原突击",
    blurb: "开阔地对攻。进攻方只留后方 2 城、经费更足，须占领全部城市；防守方保有 4 城，前线预置要塞。",
    endTurn: 55, atkMoney: 2400, defMoney: 1000,
  },
  {
    id: "woods", map: "woods", title: "密林穿插",
    blurb: "林丘密布，直射常被挡住。进攻方靠步兵、迫击炮和空军撕口并占领全部城市；防守方卡林守城。",
    endTurn: 60, atkMoney: 2400, defMoney: 1100,
  },
  {
    id: "strait", map: "strait", title: "强渡海峡",
    blurb: "中间海峡切断地面。进攻方必须靠海军或空军投送，登陆后占领全部城市；防守方岸防火力和要塞等着。",
    endTurn: 65, atkMoney: 2800, defMoney: 1200,
  },
  {
    id: "isles", map: "isles", title: "群岛登陆",
    blurb: "海洋为主。进攻方要从本岛打上对方前线岛，再拔本岛，占领全部城市。",
    endTurn: 65, atkMoney: 2800, defMoney: 1200,
  },
  {
    id: "mountains", map: "mountains", title: "翻越山脉",
    blurb: "中央山脉只留北南山口和一条隧道。进攻方须翻过关口占领全部城市；防守方在口子上筑垒。",
    endTurn: 60, atkMoney: 2500, defMoney: 1100,
  },
  {
    id: "rift", map: "rift", title: "决战关隘",
    blurb: "单格裂谷三关口。进攻方须连克全部防守方城市。",
    endTurn: 65, atkMoney: 2600, defMoney: 1200,
  },
];

function defaultCampaignProgress() {
  return { attackUnlocked: 0, defendUnlocked: 0, attackCleared: [], defendCleared: [] };
}

function loadCampaignProgress() {
  try {
    const raw = localStorage.getItem(CAMPAIGN_KEY);
    if (!raw) return defaultCampaignProgress();
    const p = JSON.parse(raw);
    const clamp = (n) => Math.max(0, Math.min(CAMPAIGN_MISSIONS.length - 1, n | 0));
    const ids = new Set(CAMPAIGN_MISSIONS.map((m) => m.id));
    const clean = (arr) => (Array.isArray(arr) ? arr.filter((id) => ids.has(id)) : []);
    return {
      attackUnlocked: clamp(p.attackUnlocked),
      defendUnlocked: clamp(p.defendUnlocked),
      attackCleared: clean(p.attackCleared),
      defendCleared: clean(p.defendCleared),
    };
  } catch (err) {
    return defaultCampaignProgress();
  }
}

function saveCampaignProgress(p) {
  try { localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(p)); } catch (err) { /* ignore */ }
}

function campaignMissionById(id) {
  return CAMPAIGN_MISSIONS.find((m) => m.id === id) || null;
}

function campaignUnlockedIndex(role) {
  const p = loadCampaignProgress();
  return role === "defend" ? p.defendUnlocked : p.attackUnlocked;
}

function noteCampaignWin(camp) {
  if (!camp || !camp.missionId) return;
  const p = loadCampaignProgress();
  const idx = CAMPAIGN_MISSIONS.findIndex((m) => m.id === camp.missionId);
  if (idx < 0) return;
  const role = camp.role === "defend" ? "defend" : "attack";
  const clearedKey = role === "defend" ? "defendCleared" : "attackCleared";
  const unlockKey = role === "defend" ? "defendUnlocked" : "attackUnlocked";
  if (!p[clearedKey].includes(camp.missionId)) p[clearedKey].push(camp.missionId);
  p[unlockKey] = Math.max(p[unlockKey], Math.min(CAMPAIGN_MISSIONS.length - 1, idx + 1));
  saveCampaignProgress(p);
}

function campaignRearSpots(spots, owner, keep) {
  const mine = (spots || []).filter((s) => s.owner === owner).slice();
  const cx = 27;
  mine.sort((a, b) => Math.abs(b.x - cx) - Math.abs(a.x - cx));
  return mine.slice(0, keep);
}

function campaignFortOk(x, y) {
  if (!game || !inBounds(x, y)) return false;
  const t = terrainAt(x, y);
  if (t === TERRAIN.PEAK || t === TERRAIN.OCEAN) return false;
  if (cityAt(x, y) || buildingAt(x, y)) return false;
  return true;
}

function campaignFindFort(x, y) {
  if (campaignFortOk(x, y)) return { x, y };
  for (let r = 1; r <= 3; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (campaignFortOk(x + dx, y + dy)) return { x: x + dx, y: y + dy };
      }
    }
  }
  return null;
}

function campaignFortCandidates(scen, defender) {
  const out = [];
  const towardCenter = defender === "ai" ? -1 : 1;
  if (scen.ridge && scen.ridgePasses) {
    const x = defender === "ai" ? (scen.ridge.to + 1) : (scen.ridge.from - 1);
    for (const pair of scen.ridgePasses) {
      const y = (pair[0] + pair[1]) >> 1;
      out.push({ x, y });
    }
  } else if (scen.strait) {
    const x = defender === "ai" ? scen.strait.to + 2 : scen.strait.from - 2;
    out.push({ x, y: 16 }, { x, y: 33 });
  } else {
    const spots = (scen.citySpots || []).filter((s) => s.owner === defender).slice();
    const cx = (scen.w || 55) / 2;
    spots.sort((a, b) => Math.abs(a.x - cx) - Math.abs(b.x - cx));
    const step = scen.oceanFill ? 2 : 3;
    for (const c of spots.slice(0, 2)) {
      out.push({ x: c.x + towardCenter * step, y: c.y });
    }
  }
  return out;
}

function applyCampaignSetup(info) {
  const mission = campaignMissionById(info && info.missionId);
  const scen = SCENARIO_MAPS[game.sizeKey] || (mission && SCENARIO_MAPS[mission.map]) || null;
  if (!mission || !scen) return;
  const role = info.role === "defend" ? "defend" : "attack";
  const attacker = role === "attack" ? "player" : "ai";
  const defender = attacker === "player" ? "ai" : "player";
  const atkSpots = campaignRearSpots(scen.citySpots, attacker, 2);
  const defSpots = (scen.citySpots || []).filter((s) => s.owner === defender);
  game.cities = [
    ...atkSpots.map((c) => makeCity(c.x, c.y, attacker, { uncapturable: true })),
    ...defSpots.map((c) => makeCity(c.x, c.y, defender)),
  ];
  game.money = {
    player: role === "attack" ? mission.atkMoney : mission.defMoney,
    ai: role === "attack" ? mission.defMoney : mission.atkMoney,
  };
  game.endTurn = mission.endTurn;
  game.startTurn = 0;
  game.turn = 0;
  game.hold = false;
  game.campaign = {
    missionId: mission.id,
    role,
    attacker,
    defender,
    captureNeed: defSpots.length,
    defHome: defSpots.map((c) => ({ x: c.x, y: c.y })),
    atkHome: atkSpots.map((c) => ({ x: c.x, y: c.y })),
  };
  game.aiStyle = role === "attack" ? "conservative" : "aggressive";
  game.aiMood = role === "attack" ? 18 : -28;
  game.aiCounterUntil = -1;
  const forts = [];
  const seen = new Set();
  for (const raw of campaignFortCandidates(scen, defender)) {
    const pos = campaignFindFort(raw.x, raw.y);
    if (!pos) continue;
    const key = pos.x + "," + pos.y;
    if (seen.has(key)) continue;
    seen.add(key);
    forts.push({
      id: nextId++,
      type: "fortress",
      owner: defender,
      x: pos.x,
      y: pos.y,
      hp: BUILDINGS.fortress.hp,
      maxHp: BUILDINGS.fortress.hp,
    });
  }
  game.buildings = (game.buildings || []).concat(forts);
  game.mapName = mission.title;
}

function campaignTakenCount() {
  if (!game || !game.campaign || !game.campaign.defHome) return 0;
  return game.campaign.defHome.filter((c) => {
    const now = cityAt(c.x, c.y);
    return now && now.owner === game.campaign.attacker;
  }).length;
}

function campaignDefHeldCount() {
  if (!game || !game.campaign || !game.campaign.defHome) return 0;
  return game.campaign.defHome.filter((c) => {
    const now = cityAt(c.x, c.y);
    return now && now.owner === game.campaign.defender;
  }).length;
}

function campaignCaptureNeed() {
  if (!game || !game.campaign) return 0;
  const n = (game.campaign.defHome || []).length;
  if (n) return n;
  return game.campaign.captureNeed || 0;
}

function checkCampaignCapture() {
  if (!game || !game.campaign || game.over || game.tutorial) return false;
  const need = campaignCaptureNeed();
  const taken = campaignTakenCount();
  if (need <= 0 || taken < need) return false;
  const atk = game.campaign.attacker;
  const def = game.campaign.defender;
  const title = missionTitleOf(game.campaign);
  wipe(def);
  endGame(atk === "player" ? "blue" : "red", `${atk === "player" ? "蓝" : "红"}方占领全部城市，达成「${title}」进攻目标。`);
  return true;
}

function missionTitleOf(camp) {
  const m = camp && campaignMissionById(camp.missionId);
  return (m && m.title) || "攻防战役";
}

function selectedCampaignRole() {
  const btn = document.querySelector("#campaign-role-picks .mode-pick.selected");
  return btn && btn.dataset.role === "defend" ? "defend" : "attack";
}

function selectedCampaignMission() {
  const btn = document.querySelector("#campaign-picks .map-pick.selected");
  if (!btn || !btn.dataset.mission) return null;
  return campaignMissionById(btn.dataset.mission);
}

function renderCampaignPicks() {
  const box = $("campaign-picks");
  if (!box) return;
  const role = selectedCampaignRole();
  const prog = loadCampaignProgress();
  const cleared = new Set(role === "defend" ? prog.defendCleared : prog.attackCleared);
  const prev = box.querySelector(".map-pick.selected");
  const prevId = prev && prev.dataset.mission;
  box.innerHTML = CAMPAIGN_MISSIONS.map((m, i) => {
    const done = cleared.has(m.id);
    const meta = `${done ? "已通关 · " : ""}限时 ${m.endTurn} 回合 · 占领全部城市`;
    return `<button class="map-pick" data-mission="${m.id}" type="button">
      <span class="map-name">${i + 1}. ${m.title}</span>
      <span class="map-size">${SCENARIO_MAPS[m.map] ? SCENARIO_MAPS[m.map].label : m.map}</span>
      <span class="map-meta">${meta}</span>
    </button>`;
  }).join("");
  box.querySelectorAll(".map-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      box.querySelectorAll(".map-pick").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
  let pick = prevId && box.querySelector(`.map-pick[data-mission="${prevId}"]`);
  if (!pick) pick = box.querySelector(".map-pick");
  if (pick) pick.classList.add("selected");
  const note = $("campaign-progress-note");
  if (note) {
    const nClear = (role === "defend" ? prog.defendCleared : prog.attackCleared).length;
    const roleName = role === "defend" ? "防守" : "进攻";
    note.textContent = `${roleName}可任选 6 关开打。已通关 ${nClear}/${CAMPAIGN_MISSIONS.length}。`;
  }
}

function setupCampaignEndButtons(won) {
  const nextBtn = $("btn-next-mission");
  const again = $("btn-again");
  if (!nextBtn || !again) return;
  const series = game && game.series && game.series.kind === "online-campaign" ? game.series : null;
  if (series) {
    const host = game.mode === "online" && localOwner() === "player";
    const needSecond = series.gameIndex === 0;
    nextBtn.textContent = "进入第二局";
    nextBtn.classList.toggle("hidden", !(needSecond && host));
    again.classList.toggle("primary", !(needSecond && host));
    again.classList.toggle("ghost", !!(needSecond && host));
    const wp = (series.wins && series.wins.player) || 0;
    const wa = (series.wins && series.wins.ai) || 0;
    if ($("end-kicker")) $("end-kicker").textContent = needSecond ? "第一局结束" : "两局结束";
    if (!needSecond && $("end-desc")) {
      const extra = `两局战绩 蓝 ${wp} : 红 ${wa}` + (wp === wa ? "，各胜一局。" : (wp > wa ? "，蓝方领先。" : "，红方领先。"));
      $("end-desc").textContent = (($("end-desc").textContent || "") + " " + extra).trim();
    } else if (needSecond && !host && $("end-desc")) {
      $("end-desc").textContent = (($("end-desc").textContent || "") + " 等待蓝方开启第二局（换边）。").trim();
    }
    return;
  }
  nextBtn.textContent = "下一关";
  const camp = game && game.campaign;
  const idx = camp ? CAMPAIGN_MISSIONS.findIndex((m) => m.id === camp.missionId) : -1;
  const hasNext = !!(won && camp && idx >= 0 && idx + 1 < CAMPAIGN_MISSIONS.length);
  nextBtn.classList.toggle("hidden", !hasNext);
  again.classList.toggle("primary", !hasNext);
  again.classList.toggle("ghost", hasNext);
  if (won && camp && idx === CAMPAIGN_MISSIONS.length - 1) {
    if ($("end-kicker")) $("end-kicker").textContent = "战役通关";
  }
}

function startCampaignMission(mission, role, fog, devTest) {
  enterGameScreen();
  newGame(mission.map, {
    ocean: !!(SCENARIO_MAPS[mission.map] && SCENARIO_MAPS[mission.map].ocean),
    fog: !!fog,
    hold: false,
    devTest: !!devTest,
    mode: "vsai",
    localSide: "player",
    startTurn: 0,
    endTurn: mission.endTurn,
    aiDiff: selectedDifficulty(),
    campaign: { missionId: mission.id, role: role === "defend" ? "defend" : "attack" },
  });
  startLoop();
  requestAnimationFrame(() => {
    resizeCanvas();
    if (game) fitCam();
  });
  kickoffCpuIfNeeded();
}

function startNextCampaignMission() {
  if (game && game.series && game.series.kind === "online-campaign") {
    startOnlineCampaignNext();
    return;
  }
  if (!game || !game.campaign) return;
  const idx = CAMPAIGN_MISSIONS.findIndex((m) => m.id === game.campaign.missionId);
  const next = CAMPAIGN_MISSIONS[idx + 1];
  if (!next) return;
  const role = game.campaign.role;
  const fog = !!game.fog;
  const keepDiff = game.aiDiff;
  const keepDev = !!game.devTest;
  startCampaignMission(next, role, fog, keepDev);
}


function cloneSeries(src) {
  if (!src || src.kind !== "online-campaign") return null;
  const ids = CAMPAIGN_MISSIONS.map((m) => m.id);
  const maps = (src.maps || []).filter((id) => ids.indexOf(id) >= 0).slice(0, 2);
  if (maps.length < 2) return null;
  return {
    kind: "online-campaign",
    maps: [maps[0], maps[1]],
    firstAttacker: src.firstAttacker === "ai" ? "ai" : "player",
    gameIndex: src.gameIndex ? 1 : 0,
    wins: {
      player: (src.wins && src.wins.player) || 0,
      ai: (src.wins && src.wins.ai) || 0,
    },
    fog: !!src.fog,
  };
}

function pickOnlineCampaignSeries(fog) {
  const ids = CAMPAIGN_MISSIONS.map((m) => m.id);
  const i = Math.floor(Math.random() * ids.length);
  const a = ids.splice(i, 1)[0];
  const b = ids[Math.floor(Math.random() * ids.length)];
  return {
    kind: "online-campaign",
    maps: [a, b],
    firstAttacker: Math.random() < 0.5 ? "player" : "ai",
    gameIndex: 0,
    wins: { player: 0, ai: 0 },
    fog: !!fog,
  };
}

function seriesAttackerAt(series, index) {
  const first = series.firstAttacker === "ai" ? "ai" : "player";
  if (!index) return first;
  return first === "player" ? "ai" : "player";
}

function selectedOnlineCampaign() {
  return !!( $("opt-online-campaign") && $("opt-online-campaign").checked );
}

function startOnlineCampaignGame(series, index, opts) {
  opts = opts || {};
  const s = cloneSeries(series);
  if (!s) return false;
  const mission = campaignMissionById(s.maps[index ? 1 : 0]);
  if (!mission) return false;
  s.gameIndex = index ? 1 : 0;
  const atk = seriesAttackerAt(s, s.gameIndex);
  enterGameScreen();
  if ($("modal-end")) $("modal-end").classList.add("hidden");
  newGame(mission.map, {
    ocean: !!(SCENARIO_MAPS[mission.map] && SCENARIO_MAPS[mission.map].ocean),
    fog: !!s.fog,
    hold: false,
    mode: "online",
    localSide: "player",
    startTurn: 0,
    endTurn: mission.endTurn,
    campaign: { missionId: mission.id, role: atk === "player" ? "attack" : "defend" },
    series: s,
  });
  const g1 = missionTitleOf({ missionId: s.maps[0] });
  const g2 = missionTitleOf({ missionId: s.maps[1] });
  const firstName = s.firstAttacker === "player" ? "蓝方" : "红方";
  log(`联机攻防两局：${g1} → ${g2}。第一局 ${firstName} 进攻，第二局换边。当前第 ${s.gameIndex + 1} 局。`, "sys");
  startLoop();
  requestAnimationFrame(() => {
    resizeCanvas();
    if (game) fitCam();
  });
  if (opts.push !== false) netPush(true);
  updatePills();
  return true;
}

function startOnlineCampaignNext() {
  if (!game || !game.series || game.series.kind !== "online-campaign") return;
  if (game.mode !== "online" || localOwner() !== "player") {
    toast("请等待蓝方开启第二局");
    return;
  }
  if (game.series.gameIndex >= 1) return;
  const series = cloneSeries(game.series);
  startOnlineCampaignGame(series, 1);
}


function ownerAirports(owner) {
  return game.buildings.filter((b) => b.type === "airport" && b.owner === owner);
}

function nearestAirport(owner, x, y) {
  let best = null, d = Infinity;
  for (const b of ownerAirports(owner)) {
    const dd = cheb(x, y, b.x, b.y);
    if (dd < d) {
      d = dd;
      best = b;
    }
  }
  for (const c of ownerCarriers(owner)) {
    const dd = cheb(x, y, c.x, c.y);
    if (dd < d) {
      d = dd;
      best = c;
    }
  }
  return best;
}

function airInSupply(owner, x, y) {
  const a = nearestAirport(owner, x, y);
  return !!(a && cheb(x, y, a.x, a.y) <= AIR_MAX_DIST);
}

function airportOccupancy(b) {
  if (!b) return 0;
  return airUnitsAt(b.x, b.y).filter((u) => u.owner === b.owner).length;
}

function airportHasRoom(b) {
  return !!(b && b.type === "airport" && airportOccupancy(b) < (BUILDINGS.airport.capacity || AIRPORT_CAP));
}

function airDeployTiles(owner, typeId) {
  const spots = ownerAirports(owner).filter((b) => airportHasRoom(b)).map((b) => ({ x: b.x, y: b.y }));
  if (!typeId || canCarrierHangar({ type: typeId })) {
    for (const c of ownerCarriers(owner)) {
      if (hangarOccupancy(c.x, c.y, owner) < (UNITS.carrier.capacity || CARRIER_CAP)) spots.push({ x: c.x, y: c.y });
    }
  }
  return spots;
}

function buildTiles(owner) {
  const tiles = [];
  for (const t of ownerControlTiles(owner)) {
    const x = t.x, y = t.y;
    if (cityAt(x, y)) continue;
    if (buildingAt(x, y)) continue;
    if (controlOwner(x, y) !== owner) continue;
    if (terrainAt(x, y) !== TERRAIN.PLAIN) continue;
    tiles.push({ x, y });
  }
  return tiles;
}

function cityControlExtra() {
  if (!game) return 0;
  if (game.turn < CITY_CONTROL_START_TURN) return 0;
  return Math.min(
    CITY_CONTROL_MAX_EXTRA,
    1 + Math.floor((game.turn - CITY_CONTROL_START_TURN) / CITY_CONTROL_EVERY)
  );
}

function cityControlRadius() {
  return CITY_CONTROL_BASE + cityControlExtra();
}

function cityControlNextTurn() {
  const extra = cityControlExtra();
  if (extra >= CITY_CONTROL_MAX_EXTRA) return null;
  return CITY_CONTROL_START_TURN + extra * CITY_CONTROL_EVERY;
}

function maybeExpandCityControl() {
  if (!game) return;
  const extra = cityControlExtra();
  const prev = game.cityControlExtra || 0;
  if (extra === prev) return;
  game.cityControlExtra = extra;
  if (extra <= 0) return;
  const span = cityControlRadius() * 2 + 1;
  log(`所有城市控制区扩大 1 圈，现为 ${span}×${span}（第 ${extra}/${CITY_CONTROL_MAX_EXTRA} 圈）。`, "sys");
  toast(`城市控制区扩大至 ${span}×${span}`);
  syncAirportOwners();
}

function controlOwner(x, y) {
  const r = cityControlRadius();
  let best = null, bestD = Infinity;
  for (const c of game.cities) {
    const d = cheb(c.x, c.y, x, y);
    if (d > r) continue;
    if (d < bestD) {
      bestD = d;
      best = c.owner;
    }
  }
  if (best) return best;
  const here = buildingAt(x, y);
  if (isFortress(here)) return here.owner;
  for (const b of game.buildings) {
    if (b.type !== "fortress") continue;
    if (cheb(b.x, b.y, x, y) <= 1) return b.owner;
  }
  return null;
}

function ownerControlTiles(owner) {
  const set = new Map();
  const addR = (cx, cy, r) => {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const x = cx + dx, y = cy + dy;
        if (!inBounds(x, y)) continue;
        if (controlOwner(x, y) !== owner) continue;
        set.set(x + "," + y, { x, y });
      }
    }
  };
  const r = cityControlRadius();
  for (const c of game.cities) {
    if (c.owner === owner) addR(c.x, c.y, r);
  }
  for (const b of game.buildings) {
    if (b.type === "fortress" && b.owner === owner) addR(b.x, b.y, 1);
  }
  return [...set.values()];
}

function deployTiles(owner, typeId) {
  const set = new Map();
  if (typeId && isNavyType(typeId)) {
    for (const t of ownerControlTiles(owner)) {
      const x = t.x, y = t.y;
      if (!navyCanStand(x, y)) continue;
      if (navyUnitAt(x, y)) continue;
      set.set(x + "," + y, { x, y });
    }
    return [...set.values()];
  }
  for (const t of ownerControlTiles(owner)) {
    const x = t.x, y = t.y;
    if (groundOccupancy(x, y) >= groundCapacity(x, y)) continue;
    if (typeId && groundClassConflict(typeId, x, y)) continue;
    if (typeId && !canDeployTypeOn(typeId, x, y)) continue;
    set.set(x + "," + y, { x, y });
  }
  return [...set.values()];
}

function lastVehicleTurn(owner, typeId) {
  const t = game.vehicleTurn[owner][typeId];
  return t === undefined ? -99 : t;
}

function canBuyVehicle(owner, typeId) {
  return game.turn - lastVehicleTurn(owner, typeId) >= 2;
}

function soldierBuyLimitReached(owner) {
  return game.turn >= 10 && game.soldierBought[owner] >= SOLDIER_TURN_LIMIT;
}

function tutEmit(evt, data) {
  if (game && typeof game.tutHook === "function") game.tutHook(evt, data || {});
}

function tutBlocked(action) {
  if (!game || !game.tutorial) return false;
  const allow = game.tutAllow || {};
  if (allow.all) return false;
  return !allow[action];
}

function tutBlockToast() {
  toast(game.tutHint || "请按教学提示操作");
}

function tutTileOk(x, y) {
  if (!game || !game.tutorial || !game.tutLockTiles) return true;
  const tiles = game.tutTiles || [];
  if (!tiles.length) return true;
  return tiles.some((t) => t.x === x && t.y === y);
}

function makeUnit(type, owner, x, y, extra) {
  const def = UNITS[type];
  extra = extra || {};
  return {
    id: nextId++,
    type,
    owner,
    x,
    y,
    hp: extra.hp != null ? extra.hp : def.hp,
    moved: !!extra.moved,
    acted: !!extra.acted,
    justDeployed: !!extra.justDeployed,
    attacksLeft: extra.attacksLeft != null ? extra.attacksLeft : def.attacks,
    idleTurns: extra.idleTurns || 0,
    defending: !!extra.defending,
    lastAttackTurn: extra.lastAttackTurn != null ? extra.lastAttackTurn : null,
    parked: !!extra.parked,
    landedTurn: extra.landedTurn != null ? extra.landedTurn : null,
    escorting: extra.escorting != null ? extra.escorting : null,
    escortedBy: extra.escortedBy != null ? extra.escortedBy : null,
    tunnelsDug: extra.tunnelsDug || 0,
    aboard: extra.aboard != null ? extra.aboard : null,
  };
}

function tutQuietTurn() {
  if (!game) return;
  settleIdle("player");
  game.turn += 1;
  game.phase = "player";
  game.busy = false;
  for (const u of game.units) {
    if (u.owner !== "player") continue;
    u.moved = false;
    u.acted = false;
    u.justDeployed = false;
    refreshAttacks(u);
  }
  game.soldierBought.player = 0;
  game.pendingBuy = null;
  game.selected = null;
  game.ranged = false;
  game.airAtk = false;
  updatePills();
  renderInspect();
  renderShop();
}

function alreadyAttacked(unit) {
  return unit.lastAttackTurn === game.turn;
}

function attackReady(unit) {
  const every = UNITS[unit.type].attackEvery || 1;
  const last = unit.lastAttackTurn == null ? -99 : unit.lastAttackTurn;
  return game.turn - last >= every;
}

function refreshAttacks(unit) {
  unit.attacksLeft = attackReady(unit) ? UNITS[unit.type].attacks : 0;
}

function spendAttack(unit) {
  unit.attacksLeft -= 1;
  unit.lastAttackTurn = game.turn;
}

function attackDeniedToast(unit) {
  const every = UNITS[unit.type].attackEvery || 1;
  if (every > 1 && unit.lastAttackTurn != null && unit.lastAttackTurn !== game.turn) {
    toast(`该单位 ${every} 回合内只能攻击 1 次`);
    return;
  }
  toast("该单位本回合没有攻击次数");
}

function cannotMoveAndAttack(unit) {
  return !!UNITS[unit.type].noMoveAndAttack;
}

function mustMoveThenAttack(unit) {
  return isAir(unit);
}

function canUnitMove(unit) {
  if (isAboard(unit)) return false;
  if (isEscorted(unit)) return false;
  if (isImmobile(unit) || unit.moved || unit.justDeployed) return false;
  if (cannotMoveAndAttack(unit) && alreadyAttacked(unit)) return false;
  if (mustMoveThenAttack(unit) && alreadyAttacked(unit)) return false;
  if (isParked(unit) && unit.landedTurn === game.turn) return false;
  return true;
}

function canUnitAttack(unit) {
  if (isCivilian(unit) || isEscorted(unit) || isAboard(unit)) return false;
  if (unit.justDeployed || unit.attacksLeft <= 0) return false;
  if (cannotMoveAndAttack(unit) && unit.moved) return false;
  if (isParked(unit)) return false;
  return true;
}

function splashCells(cx, cy, radius) {
  radius = radius == null ? 1 : radius;
  const cells = [];
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const x = cx + dx, y = cy + dy;
      if (inBounds(x, y)) cells.push({ x, y, center: dx === 0 && dy === 0 });
    }
  }
  return cells;
}

function cityOnNSEdge(c, edge, h) {
  return edge === "s" ? c.y >= h - 2 : c.y <= 1;
}

function pickSharedOceanEdge(cities, h, edge) {
  if (edge === "n" || edge === "s") return edge;
  let nScore = 0, sScore = 0;
  if (cities) {
    for (const c of cities) {
      if (c.y <= 1) nScore += 1;
      if (c.y >= h - 2) sScore += 1;
    }
  }
  return sScore > nScore ? "s" : "n";
}

function snapCityToCoast(city, cities, w, h, n, targetY) {
  const minD = n >= 6 ? 6 : 7;
  const others = cities.filter((c) => c !== city);
  const ok = (x, y) => {
    if (x < 1 || y < 1 || x > w - 2 || y > h - 2) return false;
    return others.every((c) => cheb(c.x, c.y, x, y) >= minD);
  };
  if (ok(city.x, targetY)) {
    city.y = targetY;
    return true;
  }
  for (let s = 0; s < w; s++) {
    const x = clamp(city.x + ((s % 2 ? 1 : -1) * Math.ceil(s / 2)), 1, w - 2);
    if (ok(x, targetY)) {
      city.x = x;
      city.y = targetY;
      return true;
    }
  }
  return false;
}

function ensureCoastalCity(cities, w, h, n, edge) {
  if (!cities || !cities.length) return;
  edge = pickSharedOceanEdge(cities, h, edge);
  const targetY = edge === "s" ? h - 2 : 1;
  for (const owner of ["player", "ai"]) {
    const mine = cities.filter((c) => c.owner === owner);
    if (!mine.length) continue;
    if (mine.some((c) => cityOnNSEdge(c, edge, h))) continue;
    let best = mine[0];
    let bestD = Math.abs(best.y - targetY);
    for (const c of mine) {
      const d = Math.abs(c.y - targetY);
      if (d < bestD) {
        best = c;
        bestD = d;
      }
    }
    snapCityToCoast(best, cities, w, h, n, targetY);
  }
}

function placeCities(w, h, n, withOcean) {
  const cities = [];
  const margin = 1;
  const minD = n >= 6 ? 6 : 7;
  const oceanEdge = withOcean ? (Math.random() < 0.5 ? "n" : "s") : null;
  const coastY = oceanEdge === "s" ? h - 1 - margin : oceanEdge === "n" ? margin : null;
  const ok = (x, y) => {
    if (x < margin || y < margin || x > w - 1 - margin || y > h - 1 - margin) return false;
    return cities.every((c) => cheb(c.x, c.y, x, y) >= minD);
  };
  const tryPlace = (owner, x0, x1) => {
    for (let i = 0; i < n; i++) {
      let done = false;
      const preferCoast = withOcean && i === 0 && coastY != null;
      for (let t = 0; t < 800; t++) {
        const x = rand(x0, x1);
        const y = preferCoast ? coastY : rand(margin, h - 1 - margin);
        if (!ok(x, y)) continue;
        cities.push(makeCity(x, y, owner));
        done = true;
        break;
      }
      if (!done && preferCoast) {
        const col = owner === "player" ? Math.min(3, x1) : Math.max(w - 4, x0);
        for (let s = 0; s < w; s++) {
          const x = clamp(col + ((s % 2 ? 1 : -1) * Math.ceil(s / 2)), x0, x1);
          if (ok(x, coastY)) {
            cities.push(makeCity(x, coastY, owner));
            done = true;
            break;
          }
        }
      }
      if (!done) {
        const col = owner === "player" ? Math.min(3, x1) : Math.max(w - 4, x0);
        const y = margin + Math.round(((i + 1) * (h - 1 - 2 * margin)) / (n + 1));
        let x = col, yy = y, found = false;
        for (let k = 0; k < h && !found; k++) {
          yy = clamp(y + ((k % 2 ? 1 : -1) * Math.ceil(k / 2)), margin, h - 1 - margin);
          for (let s = 0; s < w; s++) {
            x = clamp(col + ((s % 2 ? 1 : -1) * Math.ceil(s / 2)), x0, x1);
            if (ok(x, yy)) {
              cities.push(makeCity(x, yy, owner));
              found = true;
              break;
            }
          }
        }
        if (!found) {
          for (let yy2 = margin; yy2 <= h - 1 - margin; yy2++) {
            for (let xx = x0; xx <= x1; xx++) {
              if (ok(xx, yy2)) {
                cities.push(makeCity(xx, yy2, owner));
                found = true;
                break;
              }
            }
            if (found) break;
          }
        }
      }
    }
  };
  const mid = Math.floor(w / 2);
  tryPlace("player", margin, Math.max(margin, mid - 3));
  tryPlace("ai", Math.min(w - 1 - margin, mid + 3), w - 1 - margin);
  if (withOcean) ensureCoastalCity(cities, w, h, n, oceanEdge);
  return cities;
}

function bfs(unit, maxCost, attackTarget) {
  const w = game.w, h = game.h;
  const dist = new Int16Array(w * h);
  const prev = new Int32Array(w * h);
  dist.fill(-1);
  prev.fill(-1);
  const start = unit.x + unit.y * w;
  dist[start] = 0;
  const buckets = [];
  for (let i = 0; i <= maxCost; i++) buckets.push([]);
  buckets[0].push(start);
  const flying = isAir(unit);
  const ship = isNavy(unit);
  const pass = (x, y) => {
    if (flying) return true;
    if (ship) {
      if (!navyCanStand(x, y) && !(attackTarget && attackTarget.x === x && attackTarget.y === y)) return false;
      const n = navyUnitAt(x, y, unit.id);
      if (n) {
        if (n.owner !== unit.owner) return !!(attackTarget && attackTarget.x === x && attackTarget.y === y);
        return false;
      }
      return true;
    }
    if (isImpassableGround(x, y)) return false;
    const u = groundUnitAt(x, y, moveExceptIds(unit));
    if (u) {
      if (u.owner !== unit.owner) {
        return !!(attackTarget && attackTarget.x === x && attackTarget.y === y);
      }
      return true;
    }
    const c = cityAt(x, y);
    if (c && c.owner !== unit.owner) {
      return !!(attackTarget && attackTarget.x === x && attackTarget.y === y);
    }
    const b = buildingAt(x, y);
    if (b && b.owner !== unit.owner) {
      return !!(attackTarget && attackTarget.x === x && attackTarget.y === y);
    }
    return true;
  };
  for (let d = 0; d <= maxCost; d++) {
    const bucket = buckets[d];
    for (let i = 0; i < bucket.length; i++) {
      const p = bucket[i];
      if (dist[p] !== d) continue;
      const x = p % w, y = (p / w) | 0;
      for (const [dx, dy] of (flying ? DIRS8 : DIRS4)) {
        const nx = x + dx, ny = y + dy;
        if (!inBounds(nx, ny)) continue;
        const np = nx + ny * w;
        if (!pass(nx, ny)) continue;
        const step = flying ? 1 : stepCost(unit, x, y, nx, ny);
        const nd = d + step;
        if (nd > maxCost) continue;
        if (dist[np] === -1 || nd < dist[np]) {
          dist[np] = nd;
          prev[np] = p;
          buckets[nd].push(np);
        }
      }
      if (!flying && !ship) {
        for (const e of tunnelExitsAt(x, y)) {
          if (e.x === x && e.y === y) continue;
          if (!pass(e.x, e.y)) continue;
          const np = e.x + e.y * w;
          const nd = d + 2;
          if (nd > maxCost) continue;
          if (dist[np] === -1 || nd < dist[np]) {
            dist[np] = nd;
            prev[np] = p;
            buckets[nd].push(np);
          }
        }
      }
    }
  }
  return { dist, prev };
}

function terrainGoalDist(unit, gx, gy) {
  const w = game.w, h = game.h;
  const dist = new Int16Array(w * h);
  dist.fill(-1);
  if (!inBounds(gx, gy)) return dist;
  const flying = isAir(unit);
  const buckets = [[gx + gy * w]];
  dist[gx + gy * w] = 0;
  for (let d = 0; d < buckets.length; d++) {
    const bucket = buckets[d];
    if (!bucket) continue;
    for (let i = 0; i < bucket.length; i++) {
      const p = bucket[i];
      if (dist[p] !== d) continue;
      const x = p % w, y = (p / w) | 0;
      for (const [dx, dy] of (flying ? DIRS8 : DIRS4)) {
        const nx = x + dx, ny = y + dy;
        if (!inBounds(nx, ny)) continue;
        if (!flying && isNavy(unit) && !navyCanStand(nx, ny) && !(nx === gx && ny === gy)) continue;
        if (!flying && !isNavy(unit) && isImpassableGround(nx, ny) && !(nx === gx && ny === gy)) continue;
        const np = nx + ny * w;
        const step = flying ? 1 : stepCost(unit, x, y, nx, ny);
        const nd = d + step;
        if (dist[np] === -1 || nd < dist[np]) {
          dist[np] = nd;
          while (buckets.length <= nd) buckets.push([]);
          buckets[nd].push(np);
        }
      }
      if (!flying && !isNavy(unit)) {
        for (const e of tunnelExitsAt(x, y)) {
          if (e.x === x && e.y === y) continue;
          if (isImpassableGround(e.x, e.y) && !(e.x === gx && e.y === gy)) continue;
          const np = e.x + e.y * w;
          const nd = d + 2;
          if (dist[np] === -1 || nd < dist[np]) {
            dist[np] = nd;
            while (buckets.length <= nd) buckets.push([]);
            buckets[nd].push(np);
          }
        }
      }
    }
  }
  return dist;
}

function tileTacticsBonus(unit, x, y) {
  if (!unit || isAir(unit)) return 0;
  if (isNavy(unit)) return isCoastalCityAt(x, y) ? 4 : 0;
  const ter = terrainAt(x, y);
  if (ter === TERRAIN.ROAD) return 2;
  if (UNITS[unit.type].soldier || isCivilian(unit)) return ter === TERRAIN.FOREST ? 3 : 0;
  if (unit.type === "ifv" || unit.type === "light" || unit.type === "heavy") {
    if (ter === TERRAIN.FOREST) return -6;
    if (ter === TERRAIN.HILL) return -2;
    return 0;
  }
  if (ter === TERRAIN.OCEAN) return -80;
  if (ter === TERRAIN.PEAK) return isImmobile(unit) ? 14 : -80;
  if (isDirectFire(unit)) {
    if (ter === TERRAIN.HILL) return 8;
    if (ter === TERRAIN.FOREST) return -3;
  }
  return 0;
}

function canStop(unit, x, y) {
  if (unit.x === x && unit.y === y) {
    if (isAir(unit) && !airInSupply(unit.owner, x, y)) return false;
    return true;
  }
  if (isAir(unit)) {
    if (!airInSupply(unit.owner, x, y)) return false;
    const airs = airUnitsAt(x, y, unit.id);
    const cap = hangarCapacityAt(x, y, unit.owner, unit);
    if (cap) {
      if (airs.some((u) => u.owner !== unit.owner)) return false;
      return airs.filter((u) => u.owner === unit.owner).length < cap;
    }
    return airs.length === 0;
  }
  if (isNavy(unit)) {
    if (!navyCanStand(x, y)) return false;
    if (navyUnitAt(x, y, unit.id)) return false;
    const c = cityAt(x, y);
    if (c && c.owner !== unit.owner) return false;
    return true;
  }
  if (isImpassableGround(x, y)) return false;
  if (groundOccupancy(x, y, moveExceptIds(unit)) >= groundCapacity(x, y)) return false;
  if (groundClassConflict(unit.type, x, y, moveExceptIds(unit))) return false;
  const c = cityAt(x, y);
  if (c && c.owner !== unit.owner) return false;
  const b = buildingAt(x, y);
  if (b && b.owner !== unit.owner) return false;
  return true;
}

function reconstruct(prev, x, y) {
  const w = game.w;
  const path = [];
  let p = x + y * w;
  while (p !== -1) {
    path.push({ x: p % w, y: (p / w) | 0 });
    p = prev[p];
  }
  path.reverse();
  return path;
}

function chebPath(from, to) {
  const path = [{ x: from.x, y: from.y }];
  let x = from.x, y = from.y;
  while (x !== to.x || y !== to.y) {
    if (x < to.x) x += 1;
    else if (x > to.x) x -= 1;
    if (y < to.y) y += 1;
    else if (y > to.y) y -= 1;
    path.push({ x, y });
  }
  return path;
}

function moveRange(unit) {
  if (isAir(unit)) {
    const tiles = [];
    const m = UNITS[unit.type].move;
    for (let y = Math.max(0, unit.y - m); y <= Math.min(game.h - 1, unit.y + m); y++) {
      for (let x = Math.max(0, unit.x - m); x <= Math.min(game.w - 1, unit.x + m); x++) {
        const d = cheb(unit.x, unit.y, x, y);
        if (d > 0 && d <= m && canStop(unit, x, y)) tiles.push({ x, y, d });
      }
    }
    return { dist: null, tiles };
  }
  const budget = moveBudget(unit);
  const { dist } = bfs(unit, budget, null);
  const tiles = [];
  for (let y = 0; y < game.h; y++) {
    for (let x = 0; x < game.w; x++) {
      const d = dist[x + y * game.w];
      if (d > 0 && d <= budget && canStop(unit, x, y)) tiles.push({ x, y, d });
    }
  }
  return { dist, tiles };
}

function meleeTargets(unit) {
  const list = [];
  if (isAir(unit) || isCivilian(unit) || isAboard(unit)) return list;
  const def = UNITS[unit.type];
  if (!def || def.noMelee || def.attacks <= 0) return list;
  const budget = moveBudget(unit);
  const add = (x, y) => {
    const { dist, prev } = bfs(unit, budget, { x, y });
    const d = dist[x + y * game.w];
    if (d > 0 && d <= budget) list.push({ x, y, d, prev, dist });
  };
  for (const u of game.units) {
    if (u.owner === unit.owner || isAir(u) || isEscorted(u) || isAboard(u)) continue;
    if (!fogCanSeeEnemy(unit.owner, u)) continue;
    if (def.noLand && !isNavy(u)) continue;
    if (isNavy(unit) && !isNavy(u) && def.noLand) continue;
    add(u.x, u.y);
  }
  if (!def.noLand) {
    const aiKnows = game.mode === "vsai" && unit.owner === cpuOwner();
    for (const c of game.cities) {
      if (c.owner === unit.owner) continue;
      if (fogActive() && !aiKnows && fogStructureMode(unit.owner, c) === "hide") continue;
      add(c.x, c.y);
    }
    for (const b of game.buildings) {
      if (b.owner === unit.owner) continue;
      if (fogActive() && !aiKnows && fogStructureMode(unit.owner, b) === "hide") continue;
      add(b.x, b.y);
    }
  }
  return list;
}

function beep(kind) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "square";
    const now = audioCtx.currentTime;
    const table = { buy: 520, move: 240, hit: 160, cap: 420, die: 90, end: 300 };
    o.frequency.value = table[kind] || 200;
    g.gain.setValueAtTime(0.04, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(now);
    o.stop(now + 0.13);
  } catch (_) { /* ignore */ }
}

const BGM_FILES = {
  early: "music/bgm-early.ogg",
  mid: "music/bgm-mid.ogg",
  climax: "music/bgm-climax.ogg",
};
let bgmAudio = null;
let bgmTrack = null;
let bgmWantPlay = false;

function musicEnabled() {
  return !settings || settings.music !== false;
}

function ensureBgmAudio() {
  if (!bgmAudio) {
    bgmAudio = new Audio();
    bgmAudio.loop = true;
    bgmAudio.preload = "auto";
    bgmAudio.volume = 0.38;
  }
  return bgmAudio;
}

function stopBgm() {
  bgmWantPlay = false;
  if (bgmAudio) {
    try { bgmAudio.pause(); } catch (_) { /* ignore */ }
  }
}

function setBgmTrack(name) {
  if (!musicEnabled() || !name || !BGM_FILES[name]) {
    stopBgm();
    return;
  }
  bgmWantPlay = true;
  const a = ensureBgmAudio();
  const src = BGM_FILES[name];
  const needLoad = bgmTrack !== name || !a.src || a.src.indexOf(src) < 0;
  bgmTrack = name;
  if (needLoad) {
    a.src = src;
    try { a.load(); } catch (_) { /* ignore */ }
  }
  const play = () => {
    if (!bgmWantPlay || !musicEnabled()) return;
    const p = a.play();
    if (p && p.catch) p.catch(() => { /* autoplay blocked until gesture */ });
  };
  if (needLoad) a.addEventListener("canplay", play, { once: true });
  play();
}

/** early / mid / climax based on cities, clock, campaign, hold. */
function bgmMood() {
  if (!game || game.tutorial || game.editor) return null;
  if (game.over) return null;
  const me = typeof localOwner === "function" ? localOwner() : "player";
  const foe = me === "player" ? "ai" : "player";
  const mc = cityCount(me);
  const fc = cityCount(foe);
  const total = Math.max(1, mc + fc);
  const ratio = mc / total;
  const left = game.endTurn != null ? Math.max(0, (game.endTurn | 0) - (game.turn | 0)) : 99;
  if (mc <= 0 || fc <= 0) return "climax";
  if (ratio <= 0.34 || ratio >= 0.66) return "climax";
  if (game.endTurn != null && left <= 12) return "climax";
  if (game.hold && game.holdScore && game.holdTarget != null) {
    const mine = me === "player" ? (game.holdScore.player || 0) : (game.holdScore.ai || 0);
    const theirs = me === "player" ? (game.holdScore.ai || 0) : (game.holdScore.player || 0);
    const t = game.holdTarget | 0;
    if (mine >= t - 3 || theirs >= t - 3) return "climax";
  }
  if (game.campaign) {
    try {
      if (game.campaign.attacker === me && typeof campaignTakenCount === "function") {
        const need = (game.campaign.defHome || []).length || game.campaign.captureNeed || 0;
        if (need && campaignTakenCount() >= need - 1) return "climax";
      }
      if (game.campaign.defender === me && typeof campaignDefHeldCount === "function") {
        if (campaignDefHeldCount() <= 1) return "climax";
      }
    } catch (_) { /* ignore */ }
  }
  const turn = game.turn | 0;
  const end = game.endTurn != null ? (game.endTurn | 0) : 60;
  const progress = end > 0 ? turn / end : turn / 40;
  if (turn <= 15 || progress < 0.28) return "early";
  return "mid";
}

function refreshBgm() {
  if (!musicEnabled()) {
    stopBgm();
    return;
  }
  if (!game || game.over || game.tutorial || game.editor) {
    stopBgm();
    return;
  }
  const mood = bgmMood();
  if (mood) setBgmTrack(mood);
  else stopBgm();
}

function log(msg, cls) {
  if (game) {
    if (!game.logLines) game.logLines = [];
    game.logLines.push({ t: msg, c: cls || "" });
    if (game.logLines.length > 80) game.logLines.shift();
  }
  const box = $("log");
  if (!box) return;
  const line = document.createElement("div");
  if (cls) line.className = cls;
  line.textContent = msg;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

function emptyOwnerStats() {
  return { bought: 0, built: 0, spent: 0, killed: 0, lost: 0, captured: 0, citiesLost: 0, razed: 0, damage: 0 };
}

function makeBattleStats() {
  return { player: emptyOwnerStats(), ai: emptyOwnerStats() };
}

function ensureStats() {
  if (!game) return null;
  if (!game.stats) game.stats = makeBattleStats();
  if (!game.stats.player) game.stats.player = emptyOwnerStats();
  if (!game.stats.ai) game.stats.ai = emptyOwnerStats();
  if (!game.reportEvents) game.reportEvents = [];
  return game.stats;
}

function ownerStats(owner) {
  const s = ensureStats();
  if (!s) return emptyOwnerStats();
  if (!s[owner]) s[owner] = emptyOwnerStats();
  return s[owner];
}

function noteSpend(owner, amount, kind) {
  if (!owner || !amount) return;
  const s = ownerStats(owner);
  s.spent += amount;
  if (kind === "unit") s.bought += 1;
  if (kind === "building") s.built += 1;
}

function noteUnitLost(unit) {
  if (!unit || !unit.owner || unit._countedLost) return;
  unit._countedLost = true;
  ownerStats(unit.owner).lost += 1;
}

function noteUnitKill(killer, victim) {
  if (!killer || !victim || killer.owner === victim.owner) return;
  ownerStats(killer.owner).killed += 1;
}

function noteDamage(owner, amount) {
  if (!owner || !amount) return;
  const s = ownerStats(owner);
  s.damage = round2(s.damage + amount);
}

function noteReport(text, cls) {
  if (!game || !text) return;
  ensureStats();
  game.reportEvents.push({ turn: game.turn, t: text, c: cls || "sys" });
  if (game.reportEvents.length > 48) game.reportEvents.shift();
}

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
}

function notePlayerPulse(kind, n) {
  if (!game || game.tutorial || isPvp() || game.mode !== "vsai") return;
  if (actingOwner() !== localOwner()) return;
  if (!game.playerPulse) game.playerPulse = { atk: 0, cityHit: 0, capture: 0, buyOff: 0, buyDef: 0 };
  game.playerPulse[kind] = (game.playerPulse[kind] || 0) + (n == null ? 1 : n);
}

function spawnFx(x, y, text, color) {
  fx.push({ x, y, text, color, born: performance.now() });
}

function spawnCustomMapPieces(custom) {
  const skipped = [];
  const buildings = [];
  for (const raw of custom.buildings || []) {
    if (!raw || !BUILDINGS[raw.type] || (raw.type !== "airport" && raw.type !== "fortress")) {
      skipped.push(1);
      continue;
    }
    const def = BUILDINGS[raw.type];
    buildings.push({
      id: nextId++,
      type: raw.type,
      owner: raw.owner === "ai" ? "ai" : "player",
      x: raw.x | 0,
      y: raw.y | 0,
      hp: def.hp,
      maxHp: def.hp,
    });
  }
  game.buildings = buildings;
  const units = [];
  for (const raw of custom.units || []) {
    if (!raw || !UNITS[raw.type]) {
      skipped.push(1);
      continue;
    }
    const owner = raw.owner === "ai" ? "ai" : "player";
    const u = makeUnit(raw.type, owner, raw.x | 0, raw.y | 0, {
      justDeployed: false,
      moved: false,
      acted: false,
    });
    u.attacksLeft = UNITS[raw.type].attacks;
    units.push(u);
  }
  game.units = units;
  for (const u of game.units) {
    if (isAir(u)) u.parked = !!homeAirportAt(u);
  }
  if (skipped.length) toast("已跳过部分无效单位或建筑");
}

function newGame(sizeKey, opts) {
  opts = opts || {};
  const custom = opts.customMap || null;
  const scen = custom ? null : (SCENARIO_MAPS[sizeKey] || null);
  const spec = custom
    ? { w: custom.w, h: custom.h, cities: (custom.cities || []).length, label: custom.name || "自定义地图" }
    : (scen || MAPS[sizeKey] || MAPS.normal);
  const withOcean = custom
    ? terrainHasOcean(custom.terrain)
    : (scen ? !!scen.ocean : !!opts.ocean);
  const diffId = normalizeAiDiff(opts.aiDiff);
  const openingAggressive = Math.random() < (AI_DIFF_TABLE[diffId] || AI_DIFF_TABLE.easy).openAggro;
  const hasPieces = !!(custom && ((custom.units && custom.units.length) || (custom.buildings && custom.buildings.length)));
  const startTurn = (!opts.startTurnFilled && hasPieces) ? 1 : clampTurnStart(opts.startTurn);
  const endTurn = clampTurnEnd(opts.endTurn, startTurn);
  nextId = 1;
  game = {
    sizeKey: custom ? "custom" : (scen ? scen.id : sizeKey),
    mapName: custom ? (custom.name || "自定义地图") : (spec.label || null),
    w: spec.w,
    h: spec.h,
    cities: custom
      ? (custom.cities || []).map((c) => makeCity(c.x | 0, c.y | 0, c.owner === "ai" ? "ai" : "player"))
      : (scen ? loadScenarioCities(scen) : placeCities(spec.w, spec.h, spec.cities, withOcean)),
    terrain: null,
    units: [],
    buildings: [],
    money: custom
      ? {
        player: clampMapMoney(custom.money && custom.money.player),
        ai: clampMapMoney(custom.money && custom.money.ai),
      }
      : { player: 1000, ai: 1000 },
    vehicleTurn: { player: Object.create(null), ai: Object.create(null) },
    soldierBought: { player: 0, ai: 0 },
    aiDiff: diffId,
    aiStyle: openingAggressive ? "aggressive" : "balanced",
    aiMood: openingAggressive ? -28 : 0,
    aiCounterUntil: -1,
    lostCities: { player: [], ai: [] },
    cityLossComp: { player: CITY_LOSS_COMP_BASE, ai: CITY_LOSS_COMP_BASE },
    playerPulse: { atk: 0, cityHit: 0, capture: 0, buyOff: 0, buyDef: 0 },
    turn: startTurn,
    startTurn,
    endTurn,
    phase: "player",
    selected: null,
    pendingBuy: null,
    cheatPlace: null,
    ranged: false,
    airAtk: false,
    tunnelPick: false,
    layer: "ground",
    busy: false,
    over: null,
    hoverPath: [],
    cityControlExtra: 0,
    withOcean,
    stats: makeBattleStats(),
    reportEvents: [],
    mode: opts.mode || "vsai",
    localSide: opts.localSide === "ai" ? "ai" : "player",
    fog: !!opts.fog,
    fogSeen: emptyFogSeen(spec.w, spec.h),
    fogVis: { player: null, ai: null },
    hold: !!opts.hold,
    holdScore: { player: 0, ai: 0 },
    holdTarget: 12,
    devTest: !!opts.devTest,
    devFogReveal: false,
    campaign: null,
    series: null,
    logLines: [],
  };
  if (opts.series) game.series = cloneSeries(opts.series);
  game.holdTarget = holdTargetFor(game);
  game.terrain = custom
    ? copyTerrainBytes(custom.terrain, spec.w, spec.h)
    : (scen ? buildScenarioTerrain(scen) : generateTerrain(spec.w, spec.h, game.cities, withOcean));
  if (custom) spawnCustomMapPieces(custom);
  if (opts.campaign) applyCampaignSetup(opts.campaign);
  applyAiDiffStartingMoney();
  game.cityControlExtra = cityControlExtra();
  fx = [];
  anim = null;
  hover = null;
  $("log").innerHTML = "";
  hideCityCard();
  const modeLabel = game.mode === "hotseat" ? "热座对战" : game.mode === "online" ? "联机对战" : "人机对战";
  if (startTurn <= 0) {
    log(`战役开始（${modeLabel}）。第 0 回合为准备阶段，只能购买并部署单位。限时至第 ${endTurn} 回合。`, "sys");
  } else {
    log(`战役开始（${modeLabel}）。从第 ${startTurn} 回合开战，限时至第 ${endTurn} 回合。`, "sys");
  }
  if (game.mode === "vsai") {
    log(game.localSide === "ai" ? "你指挥红方，电脑指挥蓝方。蓝方先手。" : "你指挥蓝方，电脑指挥红方。", "sys");
    log(`人机难度：${aiDiff().label}。`, "sys");
  }
  if (custom) {
    log(`自定义地图：${game.mapName} ${spec.w}×${spec.h}。预放单位开局即可行动。`, "sys");
  } else if (scen) {
    log(`固定地图：${spec.label} ${spec.w}×${spec.h}，各方 ${spec.cities} 座城市。地形与城市位置已预设。`, "sys");
    if (scen.blurb) log(scen.blurb, "sys");
  } else {
    log(`${spec.label} ${spec.w}×${spec.h}，各方 ${spec.cities} 座城市。城市已随机落成。`, "sys");
    log(withOcean
      ? "地图生成了平地、森林、丘陵、山峰与海洋。地面单位无法进入海洋；海军可在海洋与沿海城市行动。空军可以飞越。"
      : "地图生成了平地、森林、丘陵与山峰。悬停格子可查看地形；山峰挡住直射和曲射，地面无法进入。", "sys");
  }
  if (game.fog) log("战争迷雾已开启。", "sys");
  if (game.hold) log("据点争夺已开启。每 10 回合按占城计分，先到 " + game.holdTarget + " 分获胜。", "sys");
  if (game.devTest) log("开发者测试模式已开启。可用顶部或左下「作弊」菜单。", "sys");
  if (game.campaign) {
    const m = campaignMissionById(game.campaign.missionId);
    const atkName = game.campaign.attacker === "player" ? "蓝方" : "红方";
    const defName = game.campaign.defender === "player" ? "蓝方" : "红方";
    const you = game.campaign.attacker === localOwner() ? "进攻" : "防守";
    log(`攻防战役「${missionTitleOf(game.campaign)}」：你担任${you}。${atkName}进攻（开局 ${game.money[game.campaign.attacker]} 元，2 座后方城市），${defName}防守（开局 ${game.money[game.campaign.defender]} 元，4 座城市与前线要塞）。`, "sys");
    log(`进攻方占领全部城市即胜；防守方撑到第 ${game.endTurn} 回合仍保有任何一座原城市即胜。进攻方初始 2 城不能被占领。`, "sys");
    if (m && m.blurb) log(m.blurb, "sys");
  }

  if (startTurn >= 1) {
    grantCityIncome();
    if (!(game.mode === "vsai" && game.localSide === "ai")) beginTurn("player");
  }
  renderShop();
  renderInspect();
  updatePills();
  updateLayerSwitch();
  syncOnlineUi();
  syncCheatUi();
  fitCam();
}

function newTutorialGame() {
  nextId = 1;
  game = {
    sizeKey: "tutorial",
    w: 18,
    h: 11,
    cities: [
      makeCity(2, 5, "player"),
      makeCity(9, 5, "ai"),
      makeCity(15, 5, "ai"),
    ],
    terrain: null,
    units: [],
    buildings: [],
    money: { player: 1000, ai: 1000 },
    vehicleTurn: { player: Object.create(null), ai: Object.create(null) },
    soldierBought: { player: 0, ai: 0 },
    aiDiff: "easy",
    aiStyle: "balanced",
    aiMood: 0,
    aiCounterUntil: -1,
    lostCities: { player: [], ai: [] },
    cityLossComp: { player: CITY_LOSS_COMP_BASE, ai: CITY_LOSS_COMP_BASE },
    playerPulse: { atk: 0, cityHit: 0, capture: 0, buyOff: 0, buyDef: 0 },
    turn: 0,
    phase: "player",
    selected: null,
    pendingBuy: null,
    cheatPlace: null,
    ranged: false,
    airAtk: false,
    tunnelPick: false,
    layer: "ground",
    busy: false,
    over: null,
    hoverPath: [],
    cityControlExtra: 0,
    withOcean: false,
    mode: "vsai",
    localSide: "player",
    fog: false,
    fogSeen: emptyFogSeen(18, 11),
    fogVis: { player: null, ai: null },
    hold: false,
    holdScore: { player: 0, ai: 0 },
    holdTarget: 12,
    tutorial: true,
    tutNoVictory: true,
    tutAllow: { inspect: true },
    tutTiles: [],
    tutLockTiles: false,
    tutShop: null,
    tutHint: "",
    tutPulseRanged: false,
    tutPulseAir: false,
    tutPulseLayer: null,
    tutPulseUpgrade: null,
    tutHook: null,
    logLines: [],
    stats: makeBattleStats(),
    reportEvents: [],
    startTurn: 0,
    endTurn: DEFAULT_TURN_END,
  };
  game.terrain = makeTutorialTerrain(18, 11, game.cities);
  fx = [];
  anim = null;
  hover = null;
  $("log").innerHTML = "";
  hideCityCard();
  log("新手教程开始。红方在教学中不会行动。", "sys");
  renderShop();
  renderInspect();
  updatePills();
  updateLayerSwitch();
  fitCam();
}

function fitCam() {
  const wrap = $("stage-wrap");
  const zx = wrap.clientWidth / (game.w * CELL);
  const zy = wrap.clientHeight / (game.h * CELL);
  cam.zoom = clamp(Math.min(zx, zy) * 0.96, 0.16, 1.15);
  cam.x = (wrap.clientWidth - game.w * CELL * cam.zoom) / 2;
  cam.y = (wrap.clientHeight - game.h * CELL * cam.zoom) / 2;
}

function resizeCanvas() {
  const canvas = $("board");
  const wrap = $("stage-wrap");
  if (!canvas) return { w: 1, h: 1, dpr: 1 };
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, wrap ? wrap.clientWidth : 1);
  const h = Math.max(1, wrap ? wrap.clientHeight : 1);
  const bw = Math.max(1, Math.round(w * dpr));
  const bh = Math.max(1, Math.round(h * dpr));
  if (canvas.width !== bw) canvas.width = bw;
  if (canvas.height !== bh) canvas.height = bh;
  const cssW = w + "px";
  const cssH = h + "px";
  if (canvas.style.width !== cssW) canvas.style.width = cssW;
  if (canvas.style.height !== cssH) canvas.style.height = cssH;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h, dpr };
}

function screenToTile(mx, my) {
  const p = clientToCanvas(mx, my);
  const z = cam.zoom || 1;
  const col = Math.floor((p.x - cam.x) / z / CELL);
  const row = Math.floor((p.y - cam.y) / z / CELL);
  if (!game || !inBounds(col, row)) return null;
  return { x: col, y: row };
}

function minimapRect() {
  const wrap = $("stage-wrap");
  const maxW = 168;
  const scale = maxW / game.w;
  const w = game.w * scale;
  const h = game.h * scale;
  return { x: 10, y: wrap.clientHeight - h - 10, w, h, scale };
}

function cityCount(owner) {
  return game.cities.filter((c) => c.owner === owner).length;
}

function holdTargetFor(g) {
  return Math.max(12, Math.floor(((g && g.cities) || []).length / 2) * 4);
}

function updatePills() {
  if (!game) return;
  syncSideTheme();
  refreshBgm();
  const me = localOwner();
  let prep;
  if (game.turn === 0) {
    prep = isPvp()
      ? (game.phase === "player" ? "蓝方准备" : "红方准备")
      : "准备阶段";
  } else {
    prep = game.phase === "player" ? "蓝方行动" : "红方行动";
  }
  if (game.mode === "online" && actingOwner() !== me && !game.over) prep += " · 等待对方";
  if (game.mode === "hotseat") prep += me === "player" ? " · 蓝方操作" : " · 红方操作";
  const cap = game.endTurn != null ? game.endTurn : DEFAULT_TURN_END;
  $("pill-turn").textContent = `第 ${game.turn}/${cap} 回合 · ${prep}`;
  $("pill-money").textContent = `金钱 ${game.money[me]} 元`;
  const extra = cityControlExtra();
  $("pill-cities").textContent = extra
    ? `城市 ${cityCount(me)} / ${game.cities.length} · 控制 ${cityControlRadius() * 2 + 1}×${cityControlRadius() * 2 + 1}`
    : `城市 ${cityCount(me)} / ${game.cities.length}`;
  const pillHold = $("pill-hold");
  if (pillHold) {
    if (game.hold) {
      const hs = game.holdScore || { player: 0, ai: 0 };
      const ht = game.holdTarget != null ? game.holdTarget : holdTargetFor(game);
      pillHold.textContent = `据点 ${hs.player} : ${hs.ai} / ${ht}`;
      pillHold.classList.remove("hidden");
    } else {
      pillHold.classList.add("hidden");
    }
  }
  const pillCamp = $("pill-campaign");
  if (pillCamp) {
    if (game.campaign) {
      const roleName = game.campaign.attacker === localOwner() ? "进攻" : "防守";
      const taken = campaignTakenCount();
      const need = campaignCaptureNeed();
      const seriesBit = (game.series && game.series.kind === "online-campaign")
        ? ` · ${game.series.gameIndex + 1}/2`
        : "";
      pillCamp.textContent = `${roleName} · ${missionTitleOf(game.campaign)}${seriesBit} · 占城 ${taken}/${need} · 限 ${game.endTurn}`;
      pillCamp.classList.remove("hidden");
    } else {
      pillCamp.classList.add("hidden");
    }
  }
  $("pill-income").textContent = game.turn === 0 ? "收入 +0 元" : `收入 +${ownerIncome(me)} 元`;
  const pillComp = $("pill-comp");
  if (pillComp) {
    pillComp.classList.toggle("hidden", !settings.compHud);
    pillComp.textContent = `失城补偿 ${cityLossCompOf(me)} 元`;
  }
  const endOff = !canLocalAct() || !!game.over || tutBlocked("endTurn");
  $("btn-end").disabled = endOff;
  $("btn-end-float").disabled = endOff;
  const idleOff = endOff;
  if ($("btn-next-idle")) $("btn-next-idle").disabled = idleOff;
  if ($("btn-next-idle-float")) $("btn-next-idle-float").disabled = idleOff;
  const pulseEnd = !!(game.tutorial && game.tutAllow && game.tutAllow.endTurn && !endOff);
  $("btn-end").classList.toggle("tut-pulse", pulseEnd);
  $("btn-end-float").classList.toggle("tut-pulse", pulseEnd);
  $("board").style.cursor = game.pendingBuy || game.cheatPlace || game.ranged || game.tunnelPick ? "crosshair" : "default";
  const waitOnline = game.mode === "online" && !game.over && (net.status === "wait" || actingOwner() !== me);
  const cpuActing = !!(game.mode === "vsai" && !game.tutorial && !game.over && actingOwner() === cpuOwner());
  if ($("ai-banner")) {
    $("ai-banner").classList.toggle("hidden", !cpuActing);
    if (cpuActing) $("ai-banner").textContent = cpuOwner() === "ai" ? "红方正在行动…" : "蓝方正在行动…";
  }
  if ($("net-banner")) {
    $("net-banner").classList.toggle("hidden", !waitOnline);
    if (waitOnline) {
      $("net-banner").textContent = net.status === "wait" ? "等待对手加入…" : (actingOwner() === "player" ? "等待蓝方行动…" : "等待红方行动…");
    }
  }
  if ($("btn-save")) {
    $("btn-save").classList.remove("hidden");
    $("btn-save").disabled = !canSaveGame();
  }
}

function renderShop() {
  const box = $("shop");
  box.innerHTML = "";
  const me = localOwner();
  const zone = me === "player" ? "蓝区" : "红区";
  const hint = $("shop-hint");
  if (hint) {
    if (game.turn >= 10) {
      hint.textContent = `士兵本回合还可买 ${Math.max(0, SOLDIER_TURN_LIMIT - (game.soldierBought[me] || 0))} 个`;
    } else {
      hint.textContent = `左击选择，地面在${zone}右击部署，空军在机场右击，建筑在控制区右击`;
    }
  }
  const soldierLocked = soldierBuyLimitReached(me);
  for (const sec of SHOP_SECTIONS) {
    if (sec.ocean && !game.withOcean) continue;
    const head = document.createElement("div");
    head.className = "shop-sec";
    head.textContent = sec.title;
    box.appendChild(head);
    for (const id of sec.ids) {
      const u = shopDef(id);
      if (u && u.needsOcean && !game.withOcean) continue;
      const isBld = isBuildingType(id);
      const btn = document.createElement("button");
      btn.className = "shop-item" + (isAirType(id) ? " air" : "") + (isNavyType(id) ? " navy" : "") + (isBld ? " bld" : "") + (isCivilianType(id) ? " civ" : "");
      const poor = game.money[me] < u.cost;
      const vLock = (isBld || !u.soldier) && !canBuyVehicle(me, id);
      const sLock = !isBld && u.soldier && soldierLocked;
      const locked = vLock || sLock;
      if (game.pendingBuy === id) btn.classList.add("active");
      if (poor) btn.classList.add("poor");
      if (locked) btn.classList.add("locked");
      if (game.tutorial && game.tutShop === id) btn.classList.add("tut-pulse");
      let extra = "";
      if (vLock) extra = isBld ? "<br/>该建筑冷却中" : "<br/>该兵种冷却中";
      else if (sLock) extra = "<br/>本回合士兵额度已满";
      btn.innerHTML = `<b>${u.name}</b><span class="price">${u.cost} 元</span><br/>${u.blurb}${extra}`;
      btn.addEventListener("click", () => {
        if (!canLocalAct() || game.over) return;
        if (game.tutorial && game.tutShop && id !== game.tutShop) {
          toast(`请选择「${shopDef(game.tutShop).name}」`);
          return;
        }
        if (tutBlocked("shop")) {
          tutBlockToast();
          return;
        }
        if (vLock) {
          toast(isBld ? "该建筑 2 回合内只能建造 1 次" : "该非士兵单位 2 回合内只能购买 1 次");
          return;
        }
        if (sLock) {
          toast("第 10 回合起每回合士兵总共最多购买 6 个");
          return;
        }
        if (poor) {
          toast("金钱不足");
          return;
        }
        game.pendingBuy = game.pendingBuy === id ? null : id;
        game.selected = null;
        game.ranged = false;
        game.airAtk = false;
        if (game.pendingBuy === id) setMapLayer(isAirType(id) ? "air" : "ground");
        renderShop();
        renderInspect();
        updatePills();
        if (game.pendingBuy === id) tutEmit("shop", { id });
      });
      box.appendChild(btn);
    }
  }
}

function hideCityCard() {
  const card = $("city-card");
  if (card) card.classList.add("hidden");
  clearTimeout(cityCardTimer);
  if (game) {
    game.inspectedCity = null;
    game.inspectedBuilding = null;
  }
}

function positionCityCard(city) {
  const card = $("city-card");
  const canvas = $("board");
  if (!card || !city || !canvas) return;
  const sx = canvas.offsetLeft + cam.x + (city.x + 0.5) * CELL * cam.zoom;
  const sy = canvas.offsetTop + cam.y + city.y * CELL * cam.zoom;
  card.style.left = `${sx}px`;
  card.style.top = `${sy}px`;
}

function cityUpgradeEffectsHtml(city) {
  const bonus = city.incomeBonus || 0;
  const incN = city.incomeUpgrades || 0;
  const hpN = city.hpUpgrades || 0;
  const truce = isCityTruce(city);
  const last = city.lastHitTurn == null ? -99 : city.lastHitTurn;
  const idle = last < 0 ? "从未被攻击" : `${game.turn - last} 回合前`;
  return `
    <div class="stat-row"><span>每回合收益</span><span>${cityIncomeOf(city)} 元${bonus ? `（基础 100 + ${bonus}）` : ""}</span></div>
    <div class="stat-row"><span>经济升级</span><span>${incN} 次</span></div>
    <div class="stat-row"><span>工事升级</span><span>${hpN} 次（上限 ${city.maxHp}）</span></div>
    <div class="stat-row"><span>修战</span><span>${truce ? "已进入" : game.turn < 10 ? "第 10 回合起" : `未进入（上次挨打 ${idle}）`}</span></div>
  `;
}

function bindCityUpgradeButtons(city) {
  const box = $("inspect");
  box.querySelectorAll("[data-city-up]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!game || game.over || game.busy) return;
      if (!canLocalAct()) return toast("请在己方回合升级");
      const kind = btn.getAttribute("data-city-up");
      const err = tryUpgradeCity(localOwner(), city, kind);
      if (err) return toast(err);
      renderShop();
      updatePills();
      showCityInfo(city, { silent: true });
    });
  });
}

function hideUnitActionButtons() {
  if ($("btn-ranged")) $("btn-ranged").classList.add("hidden");
  if ($("btn-air-atk")) $("btn-air-atk").classList.add("hidden");
  if ($("btn-land")) $("btn-land").classList.add("hidden");
  if ($("btn-takeoff")) $("btn-takeoff").classList.add("hidden");
  ["btn-escort", "btn-unescort", "btn-road", "btn-fort", "btn-tunnel", "btn-board", "btn-unload"].forEach((id) => {
    if ($(id)) $(id).classList.add("hidden");
  });
}

function showCityInfo(city, opts) {
  game.inspectedCity = city;
  game.inspectedBuilding = null;
  game.ranged = false;
  game.airAtk = false;
  const garr = groundUnitAt(city.x, city.y);
  const owner = ownerName(city.owner);
  const ownerTag = city.owner === localOwner() ? "me" : "foe";
  const mine = isMine(city.owner);
  const truce = isCityTruce(city);
  const ready = cityUpgradeReady(city, localOwner());
  const canAct = mine && truce && ready && canLocalAct();
  const incCost = cityIncomeCost(city);
  let extra = "";
  if (mine) {
    let hint = "";
    if (game.turn < 10) hint = "第 10 回合起，3 回合未被攻击后进入修战，方可升级。";
    else if (!truce) hint = "需连续 3 回合未被攻击才会进入修战。";
    else if (!ready) hint = `5 回合内每座城市只能升级 1 次，还需 ${cityUpgradeWait(city, localOwner())} 回合。`;
    extra = `
      <div class="city-upgrades">
        <p class="muted" style="margin:8px 0 6px">升级选项（修战中每座城市每 5 回合限 1 次）</p>
        <button class="upgrade-btn${canAct && game.money[localOwner()] >= incCost ? "" : " poor"}${game.tutorial && (game.tutPulseUpgrade === "income" || game.tutPulseUpgrade === true) ? " tut-pulse" : ""}" data-city-up="income" ${canAct ? "" : "disabled"}>
          <b>经济</b><span class="price">${incCost} 元</span><br/>每回合此城收益 +100，下次价格再 +100
        </button>
        <button class="upgrade-btn${canAct && game.money[localOwner()] >= 600 ? "" : " poor"}${game.tutorial && (game.tutPulseUpgrade === "hp" || game.tutPulseUpgrade === true) ? " tut-pulse" : ""}" data-city-up="hp" ${canAct ? "" : "disabled"}>
          <b>工事</b><span class="price">600 元</span><br/>生命上限 +5，并回复 5 点生命
        </button>
        ${hint ? `<p class="muted" style="margin-top:6px">${hint}</p>` : ""}
      </div>
    `;
  }
  $("inspect").innerHTML = `
    <p><b>城市</b> · ${owner}
      ${isMine(city.owner) ? '<span class="tag def">己方</span>' : '<span class="tag enemy">敌方</span>'}
      ${cityUncapturable(city) ? '<span class="tag def">不可占领</span>' : ""}
      ${truce ? '<span class="tag truce">修战</span>' : ""}
    </p>
    <p class="city-hp-big">${hpText(city.hp)} <span>/ ${city.maxHp}</span></p>
    <div class="stat-row"><span>位置</span><span>${displayCoord(city.x, city.y)}</span></div>
    <div class="stat-row"><span>驻守</span><span>${garr ? `${UNITS[garr.type].name} ${hpText(garr.hp)}/${UNITS[garr.type].hp}` : "无"}</span></div>
    ${cityUpgradeEffectsHtml(city)}
    <p class="muted" style="margin-top:8px">${(() => {
      const r = cityControlRadius();
      const extraNow = cityControlExtra();
      const span = r * 2 + 1;
      const next = cityControlNextTurn();
      const grow = extraNow
        ? `当前控制区 ${span}×${span}（已扩大 ${extraNow}/${CITY_CONTROL_MAX_EXTRA} 圈）。`
        : "周围 8 格（含斜角）为控制区。";
      const soon = next ? `第 ${next} 回合将再扩大 1 圈。` : extraNow >= CITY_CONTROL_MAX_EXTRA ? "控制区已扩至上限。" : "";
      const capHint = cityUncapturable(city) ? "此城是进攻方初始城市，不能被敌方占领。" : "近战把生命打到 0 并进入此格即可占领。";
      return grow + soon + capHint + "驻守单位会使伤害平分，打单位溢出的伤害转给城市。被占领后升级效果仍保留。";
    })()}</p>
    ${extra}
  `;
  hideUnitActionButtons();
  bindCityUpgradeButtons(city);
  const card = $("city-card");
  const bonus = city.incomeBonus || 0;
  card.innerHTML = `
    <div class="city-card-owner">${owner}城市 · ${displayCoord(city.x, city.y)}${cityUncapturable(city) ? " · 不可占领" : ""}${truce ? " · 修战" : ""}</div>
    <div class="city-card-hp">${hpText(city.hp)} <span>/ ${city.maxHp}</span></div>
    ${garr ? `<div class="city-card-garr">驻守 ${UNITS[garr.type].name} ${hpText(garr.hp)}/${UNITS[garr.type].hp}</div>` : ""}
    <div class="city-card-garr">收益 ${cityIncomeOf(city)} 元${bonus ? `（+${bonus}）` : ""}</div>
  `;
  card.classList.remove("hidden");
  positionCityCard(city);
  clearTimeout(cityCardTimer);
  cityCardTimer = setTimeout(hideCityCard, 5000);
  if (!(opts && opts.silent)) {
    log(`查看${owner}城市 ${displayCoord(city.x, city.y)} 生命 ${hpText(city.hp)}/${city.maxHp}。`, ownerTag);
    tutEmit("inspectCity", { city });
  }
}

function showAirportInfo(b, opts) {
  game.inspectedBuilding = b;
  game.inspectedCity = null;
  game.ranged = false;
  game.airAtk = false;
  const def = BUILDINGS[b.type] || BUILDINGS.airport;
  const here = airUnitsAt(b.x, b.y).filter((u) => u.owner === b.owner);
  const parkedN = here.filter((u) => u.parked).length;
  const owner = ownerName(b.owner);
  const ownerTag = b.owner === localOwner() ? "me" : "foe";
  const cap = def.capacity || AIRPORT_CAP;
  const list = here.length
    ? here.map((u) => {
        const ud = UNITS[u.type];
        const st = u.parked ? "停场" : (u.justDeployed ? "新部署" : "空域");
        return `<button class="upgrade-btn" data-air-id="${u.id}"><b>${ud.name}</b>　${hpText(u.hp)}/${ud.hp} · ${st}</button>`;
      }).join("")
    : `<p class="muted">当前没有友军空军。</p>`;
  $("inspect").innerHTML = `
    <p><b>${def.name}</b> · ${owner}
      ${isMine(b.owner) ? '<span class="tag def">己方</span>' : '<span class="tag enemy">敌方</span>'}
      <span class="tag air">建筑</span>
    </p>
    <p class="city-hp-big">${hpText(b.hp)} <span>/ ${b.maxHp}</span></p>
    <div class="stat-row"><span>位置</span><span>${displayCoord(b.x, b.y)}</span></div>
    <div class="stat-row"><span>占用</span><span>${here.length} / ${cap}（停场 ${parkedN}）</span></div>
    <p class="muted" style="margin:8px 0 6px">友军空军（每座最多 ${cap} 架）</p>
    ${list}
    <p class="muted" style="margin-top:8px">空军只能部署在机场，且不能远离最近友军机场或航母超过 ${AIR_MAX_DIST} 格。飞到本格可降落停场，停场每回合回复 2 点生命且无法被攻击。点「起飞」或直接移动即可升空。除防空炮和自行防空炮外，地面单位无法攻击空军。生命打到 0 即摧毁，停场空军一并消灭。</p>
  `;
  hideUnitActionButtons();
  $("inspect").querySelectorAll("[data-air-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number(btn.getAttribute("data-air-id"));
      const u = game.units.find((n) => n.id === id);
      if (!u) return;
      hideCityCard();
      game.selected = u;
      game.pendingBuy = null;
      game.ranged = false;
      game.airAtk = false;
      renderShop();
      renderInspect();
    });
  });
  const card = $("city-card");
  card.innerHTML = `
    <div class="city-card-owner">${owner}机场 · ${displayCoord(b.x, b.y)}</div>
    <div class="city-card-hp">${here.length} <span>/ ${cap}</span></div>
    <div class="city-card-garr">生命 ${hpText(b.hp)}/${b.maxHp}</div>
  `;
  card.classList.remove("hidden");
  positionCityCard(b);
  clearTimeout(cityCardTimer);
  cityCardTimer = setTimeout(hideCityCard, 5000);
  if (!(opts && opts.silent)) {
    log(`查看${owner}机场 ${displayCoord(b.x, b.y)}，占用 ${here.length}/${cap}，停场 ${parkedN}。`, ownerTag);
    tutEmit("inspectAirport", { building: b });
  }
}

function showFortressInfo(b, opts) {
  game.inspectedBuilding = b;
  game.inspectedCity = null;
  game.ranged = false;
  game.airAtk = false;
  const def = BUILDINGS.fortress;
  const here = groundUnitsAt(b.x, b.y);
  const owner = ownerName(b.owner);
  const ownerTag = b.owner === localOwner() ? "me" : "foe";
  const cap = def.capacity || 2;
  const list = here.length
    ? here.map((u) => `<div class="stat-row"><span>${UNITS[u.type].name}${isEscorted(u) ? "（护卫）" : ""}</span><span>${hpText(u.hp)}/${UNITS[u.type].hp}</span></div>`).join("")
    : `<p class="muted">内部没有地面单位。</p>`;
  $("inspect").innerHTML = `
    <p><b>${def.name}</b> · ${owner}
      ${isMine(b.owner) ? '<span class="tag def">己方</span>' : '<span class="tag enemy">敌方</span>'}
      <span class="tag">建筑</span>
    </p>
    <p class="city-hp-big">${hpText(b.hp)} <span>/ ${b.maxHp}</span></p>
    <div class="stat-row"><span>位置</span><span>${displayCoord(b.x, b.y)}</span></div>
    <div class="stat-row"><span>驻守</span><span>${here.length} / ${cap}</span></div>
    <div class="stat-row"><span>回复</span><span>每回合 +1</span></div>
    ${list}
    <p class="muted" style="margin-top:8px">${def.blurb}</p>
  `;
  hideUnitActionButtons();
  const card = $("city-card");
  card.innerHTML = `
    <div class="city-card-owner">${owner}要塞 · ${displayCoord(b.x, b.y)}</div>
    <div class="city-card-hp">${hpText(b.hp)} <span>/ ${b.maxHp}</span></div>
    <div class="city-card-garr">驻守 ${here.length}/${cap}</div>
  `;
  card.classList.remove("hidden");
  positionCityCard(b);
  clearTimeout(cityCardTimer);
  cityCardTimer = setTimeout(hideCityCard, 5000);
  if (!(opts && opts.silent)) {
    log(`查看${owner}前线要塞 ${displayCoord(b.x, b.y)}，生命 ${hpText(b.hp)}/${b.maxHp}，驻守 ${here.length}/${cap}。`, ownerTag);
  }
}

function renderInspect() {
  const el = $("inspect");
  const rangedBtn = $("btn-ranged");
  const airBtn = $("btn-air-atk");
  const landBtn = $("btn-land");
  const takeoffBtn = $("btn-takeoff");
  const u = game && game.selected;
  if (!u) {
    el.innerHTML = `<p class="muted inspect-empty">左上角切换地面/空域。悬停格子查看平地/森林/丘陵/山峰。右击单位查看数据，右击城市/机场查看详情。选中友军后左击移动；地面层可近战。空军和防空单位需点「攻击地面」或「攻击空军」后再点目标。飞到友军机场可降落停场。</p>`;
    hideUnitActionButtons();
    return;
  }
  const def = UNITS[u.type];
  const mine = isMine(u.owner);
  const flying = isAir(u);
  const playerTurn = mine && canLocalAct();
  const canShoot = playerTurn && def.range > 0 && canUnitAttack(u);
  const showLand = playerTurn && flying && canLand(u);
  const showTakeoff = playerTurn && flying && canTakeOff(u);
  rangedBtn.classList.toggle("hidden", !canShoot);
  rangedBtn.classList.toggle("active", !!(game.ranged && !game.airAtk));
  rangedBtn.classList.toggle("tut-pulse", !!(game.tutorial && game.tutPulseRanged && canShoot && !game.ranged));
  if (flying || canShootAir(u)) {
    rangedBtn.textContent = game.ranged && !game.airAtk ? "取消地面" : `攻击地面（${u.attacksLeft}）`;
  } else {
    rangedBtn.textContent = game.ranged ? "取消远程" : `远程攻击（${u.attacksLeft}）`;
  }
  if (airBtn) {
    airBtn.classList.toggle("hidden", !(canShootAir(u) && canShoot));
    airBtn.classList.toggle("active", !!(game.ranged && game.airAtk));
    airBtn.classList.toggle("tut-pulse", !!(game.tutorial && game.tutPulseAir && canShoot && !(game.ranged && game.airAtk)));
    airBtn.textContent = game.ranged && game.airAtk ? "取消空军" : `攻击空军（${u.attacksLeft}）`;
  }
  if (landBtn) {
    landBtn.classList.toggle("hidden", !showLand);
    landBtn.classList.remove("active");
  }
  if (takeoffBtn) {
    takeoffBtn.classList.toggle("hidden", !showTakeoff);
    takeoffBtn.classList.remove("active");
  }
  const escortBtn = $("btn-escort");
  const unescortBtn = $("btn-unescort");
  const roadBtn = $("btn-road");
  const fortBtn = $("btn-fort");
  const tunnelBtn = $("btn-tunnel");
  const boardBtn = $("btn-board");
  const unloadBtn = $("btn-unload");
  const showEscort = playerTurn && !u.justDeployed && (
    (isMilitaryGround(u) && !isImmobile(u) && !u.escorting && adjacentCivilian(u))
    || (isCivilian(u) && !isEscorted(u) && adjacentMilitary(u))
  );
  const showUnescort = playerTurn && (u.escorting || isEscorted(u));
  const engReady = playerTurn && u.type === "engineer" && !u.justDeployed && !isEscorted(u);
  if (escortBtn) {
    escortBtn.classList.toggle("hidden", !showEscort);
    escortBtn.classList.remove("active");
  }
  if (unescortBtn) {
    unescortBtn.classList.toggle("hidden", !showUnescort);
    unescortBtn.classList.remove("active");
  }
  if (roadBtn) {
    roadBtn.classList.toggle("hidden", !(engReady && terrainAt(u.x, u.y) === TERRAIN.PLAIN && !cityAt(u.x, u.y)));
    roadBtn.classList.remove("active");
  }
  if (fortBtn) {
    fortBtn.classList.toggle("hidden", !(engReady && !isImpassableGround(u.x, u.y) && !cityAt(u.x, u.y) && !buildingAt(u.x, u.y)));
    fortBtn.classList.remove("active");
  }
  if (tunnelBtn) {
    const peaks = nearbyPeaks(u);
    tunnelBtn.classList.toggle("hidden", !(engReady && peaks.length));
    tunnelBtn.classList.toggle("active", !!(game.tunnelPick && engReady));
    tunnelBtn.textContent = game.tunnelPick ? "取消开隧道" : "开隧道 300";
  }
  const shipHere = u.type === "transport" ? u : adjacentTransport(u);
  const canBoard = playerTurn && !isNavy(u) && !isAir(u) && !isAboard(u) && !u.justDeployed && shipHere && !canBoardTransport(shipHere, u);
  const canUnload = playerTurn && u.type === "transport" && transportCargo(u).length && !u.justDeployed;
  if (boardBtn) {
    boardBtn.classList.toggle("hidden", !canBoard);
    boardBtn.classList.remove("active");
  }
  if (unloadBtn) {
    unloadBtn.classList.toggle("hidden", !canUnload);
    unloadBtn.classList.remove("active");
  }
  const ap = flying ? nearestAirport(u.owner, u.x, u.y) : null;
  const apDist = ap ? cheb(u.x, u.y, ap.x, ap.y) : null;
  el.innerHTML = `
    <p><b>${def.name}</b> · ${ownerName(u.owner)}
      ${flying ? '<span class="tag air">空军</span>' : ""}
      ${isNavy(u) ? '<span class="tag air">海军</span>' : ""}
      ${u.parked ? '<span class="tag def">停场</span>' : ""}
      ${u.defending ? '<span class="tag def">防守</span>' : ""}
      ${isCivilian(u) ? '<span class="tag">平民</span>' : ""}
      ${u.escorting || isEscorted(u) ? '<span class="tag def">护卫队</span>' : ""}
      ${inFortress(u) ? '<span class="tag def">要塞</span>' : ""}
      ${isAboard(u) ? '<span class="tag def">在舰上</span>' : ""}
      ${u.justDeployed ? '<span class="tag">新部署</span>' : ""}
    </p>
    <div class="stat-row"><span>生命</span><span>${hpText(u.hp)} / ${def.hp}</span></div>
    <div class="stat-row"><span>位置</span><span>${displayCoord(u.x, u.y)}</span></div>
    <div class="stat-row"><span>移动</span><span>${isImmobile(u) ? "无法移动" : (isEscorted(u) && escortHost(u) ? "随护卫（上限 " + UNITS[escortHost(u).type].move + "）" : def.move)}${flying ? "（含斜角，直线飞）" : ""}${u.moved ? "（本回合已移动）" : (flying && alreadyAttacked(u) ? "（已攻击，不能再移动）" : "")}</span></div>
    <div class="stat-row"><span>攻击次数</span><span>${isCivilian(u) ? "无法攻击" : `${u.attacksLeft} / ${def.attacks}${def.attackEvery > 1 && !attackReady(u) && u.lastAttackTurn !== game.turn ? "（冷却中）" : ""}`}</span></div>
    <div class="stat-row"><span>射程</span><span>${def.rangeAir != null
      ? `对地 ${attackRangeOf(u, "ground")} / 对空 ${attackRangeOf(u, "air")}`
      : (def.range ? attackRangeOf(u, "ground") + " 格（含斜角）" : "仅近战")}${isDirectFire(u) && isElevated(u.x, u.y) ? (isPeakAt(u.x, u.y) ? "（山峰 +1）" : "（丘陵 +1）") : ""}</span></div>
    ${flying ? "" : `<div class="stat-row"><span>地形</span><span>${terrainName(terrainAt(u.x, u.y))}</span></div>`}
    <div class="stat-row"><span>身份</span><span>${def.role}${def.civilian ? " · 平民" : def.soldier ? " · 士兵" : flying ? " · 空军" : " · 非士兵"}</span></div>
    ${flying
      ? `<div class="stat-row"><span>补给半径</span><span>${apDist != null ? apDist + " / " + AIR_MAX_DIST : "无机场/航母"}</span></div>
         <div class="stat-row"><span>状态</span><span>${u.parked ? "停场中，每回合回复 2 点生命，无法被攻击" : (homeAirportAt(u) ? "位于友军机场，可降落停场" : "空域飞行")}</span></div>
         <div class="stat-row"><span>限制</span><span>无法近战、无法进入防守、先移动后攻击</span></div>`
      : `<div class="stat-row"><span>空闲</span><span>${u.idleTurns} 回合${u.idleTurns >= 1 && u.defending ? "（防守）" : ""}</span></div>
         ${fromAirLabel(def) ? `<div class="stat-row"><span>防空</span><span>${fromAirLabel(def)}</span></div>` : ""}`}
    ${def.attackEvery > 1 ? `<div class="stat-row"><span>攻击间隔</span><span>每 ${def.attackEvery} 回合 1 次</span></div>` : ""}
    ${def.noMoveAndAttack ? '<div class="stat-row"><span>限制</span><span>不能同回合移动并攻击</span></div>' : ""}
    ${u.type === "engineer" ? `<div class="stat-row"><span>工事</span><span>建 1 座要塞或开 2 条隧道后撤离（隧道 ${u.tunnelsDug || 0}/2）</span></div>` : ""}
    ${u.type === "transport" ? `<div class="stat-row"><span>装载</span><span>人员 ${cargoPersonnel(u).length}/${TRANSPORT_SOLDIER_CAP}　车辆 ${cargoVehicles(u).length}/${TRANSPORT_VEHICLE_CAP}${cargoEscorts(u).length ? "　护卫队 1" : ""}</span></div>` : ""}
    ${u.type === "carrier" ? `<div class="stat-row"><span>机库</span><span>${hangarOccupancy(u.x, u.y, u.owner)}/${CARRIER_CAP}（攻击机/战斗机）</span></div>` : ""}
    <p class="muted" style="margin-top:8px">${def.blurb}</p>
  `;
}

function grantCityIncome() {
  if (game.turn < 1) return;
  for (const owner of ["player", "ai"]) {
    const n = cityCount(owner);
    let gain = ownerIncome(owner);
    if (game.mode === "vsai" && owner === cpuOwner()) {
      gain = Math.round(gain * aiDiff().incomeCpu);
    }
    game.money[owner] += gain;
    log(`${ownerName(owner)}拥有 ${n} 座城市，收入 +${gain} 元。`, owner === localOwner() ? "me" : "foe");
  }
  if (isPvp()) toast(`蓝方 +${ownerIncome("player")} 元，红方 +${ownerIncome("ai")} 元`);
  else toast(`城市收入 +${ownerIncome(localOwner())} 元`);
  renderShop();
  updatePills();
}

function beginTurn(owner) {
  if (owner === "player") maybeExpandCityControl();
  if (game.turn >= 1) {
    for (const c of game.cities) {
      if (c.owner === owner) c.hp = Math.min(c.maxHp, c.hp + 2);
    }
    for (const b of game.buildings) {
      if (isFortress(b) && b.owner === owner) {
        b.hp = Math.min(b.maxHp, b.hp + 1);
      }
    }
    for (const u of game.units) {
      if (u.owner !== owner) continue;
      if (u.defending) u.hp = Math.min(UNITS[u.type].hp, round2(u.hp + 1));
      if (isParked(u)) {
        const max = UNITS[u.type].hp;
        if (u.hp < max) {
          const before = u.hp;
          u.hp = Math.min(max, round2(u.hp + 2));
          const got = round2(u.hp - before);
          if (got > 0) spawnFx(u.x, u.y, `+${hpText(got)}`, "#7dcf6b");
        }
      }
    }
  }
  for (const u of game.units) {
    if (u.owner !== owner) continue;
    u.moved = false;
    u.acted = false;
    u.justDeployed = false;
    refreshAttacks(u);
  }
  game.soldierBought[owner] = 0;
  crashAirOutOfSupply(owner);
  game.pendingBuy = null;
  game.selected = null;
  game.ranged = false;
  game.airAtk = false;
  game.tunnelPick = false;
  renderShop();
  renderInspect();
  const entered = game.cities.filter((c) => c.owner === owner && justEnteredTruce(c));
  if (entered.length) {
    log(`${ownerName(owner)} ${entered.length} 座城市进入修战${isMine(owner) ? "，右键城市可升级" : ""}。`, owner === localOwner() ? "me" : "foe");
    if (isMine(owner)) toast(`${entered.length} 座城市进入修战，右键可升级`);
  }
  updatePills();
}

function settleIdle(owner) {
  for (const u of game.units) {
    if (u.owner !== owner) continue;
    if (isAir(u) || isCivilian(u)) {
      u.idleTurns = 0;
      u.defending = false;
      continue;
    }
    if (u.justDeployed) continue;
    if (u.acted) u.idleTurns = 0;
    else {
      u.idleTurns += 1;
      if (u.idleTurns >= 1) u.defending = true;
    }
  }
}

function checkTurnLimit() {
  if (!game || game.over || game.tutorial) return false;
  const cap = game.endTurn != null ? game.endTurn : DEFAULT_TURN_END;
  if (game.turn < cap) return false;
  return endByTurnLimit();
}

function awardHoldScore() {
  if (!game || !game.hold || game.over || game.tutorial || game.editor) return false;
  if (game.turn < 10 || game.turn % 10 !== 0) return false;
  const p = cityCount("player");
  const a = cityCount("ai");
  if (!game.holdScore) game.holdScore = { player: 0, ai: 0 };
  game.holdScore.player += p;
  game.holdScore.ai += a;
  log(`据点结算（第 ${game.turn} 回合）：蓝方 +${p} → ${game.holdScore.player}，红方 +${a} → ${game.holdScore.ai}。目标 ${game.holdTarget}。`, "sys");
  toast(`据点 ${game.holdScore.player} : ${game.holdScore.ai} / ${game.holdTarget}`);
  updatePills();
  return checkHoldVictory();
}
function checkHoldVictory() {
  if (!game.hold || game.over) return false;
  const p = game.holdScore.player, a = game.holdScore.ai, t = game.holdTarget;
  if (p >= t && a >= t) {
    if (p === a) { endGame("draw", `双方据点同为 ${p}，同时达到 ${t}。`); return true; }
    const blue = p > a;
    endGame(blue ? "blue" : "red", `${blue ? "蓝" : "红"}方据点 ${blue ? p : a} : ${blue ? a : p}，率先达到 ${t}。`);
    return true;
  }
  if (p >= t) { endGame("blue", `蓝方据点 ${p} 分，率先达到 ${t}。`); return true; }
  if (a >= t) { endGame("red", `红方据点 ${a} 分，率先达到 ${t}。`); return true; }
  return false;
}

function endByTurnLimit() {
  if (!game || game.over) return true;
  const p = cityCount("player");
  const a = cityCount("ai");
  const pu = game.units.filter((u) => u.owner === "player").length;
  const au = game.units.filter((u) => u.owner === "ai").length;
  const pm = game.money.player || 0;
  const am = game.money.ai || 0;
  const cap = game.endTurn != null ? game.endTurn : DEFAULT_TURN_END;
  let kind;
  let desc;
  if (game.hold) {
    const hp = (game.holdScore && game.holdScore.player) || 0;
    const ha = (game.holdScore && game.holdScore.ai) || 0;
    if (hp !== ha) {
      kind = hp > ha ? "blue" : "red";
      desc = `到达第 ${cap} 回合上限。据点 ${hp} : ${ha}，${hp > ha ? "蓝" : "红"}方领先。`;
    } else if (p !== a) {
      kind = p > a ? "blue" : "red";
      desc = `到达第 ${cap} 回合上限。据点 ${hp} : ${ha} 持平，城市 ${p} : ${a}，${p > a ? "蓝" : "红"}方领先。`;
    } else if (pu !== au) {
      kind = pu > au ? "blue" : "red";
      desc = `到达第 ${cap} 回合上限。据点 ${hp} : ${ha} 持平，城市相同，部队 ${pu} : ${au}，${pu > au ? "蓝" : "红"}方领先。`;
    } else if (pm !== am) {
      kind = pm > am ? "blue" : "red";
      desc = `到达第 ${cap} 回合上限。据点 ${hp} : ${ha} 持平，城市与部队相同，金钱 ${pm} : ${am}，${pm > am ? "蓝" : "红"}方领先。`;
    } else {
      kind = "draw";
      desc = `到达第 ${cap} 回合上限。据点 ${hp} : ${ha}，双方城市、部队、金钱均持平。`;
    }
    endGame(kind, desc);
    return true;
  }
  if (game.campaign) {
    const held = campaignDefHeldCount();
    const def = game.campaign.defender;
    const atk = game.campaign.attacker;
    if (held > 0) {
      kind = def === "player" ? "blue" : "red";
      desc = `到达第 ${cap} 回合上限。防守方仍保有 ${held} 座原城市，防守成功。`;
    } else {
      kind = atk === "player" ? "blue" : "red";
      desc = `到达第 ${cap} 回合上限。防守方原城市尽失，进攻方达成目标。`;
    }
    endGame(kind, desc);
    return true;
  }
  if (p !== a) {
    kind = p > a ? "blue" : "red";
    desc = `到达第 ${cap} 回合上限。城市 ${p} : ${a}，${p > a ? "蓝" : "红"}方领先。`;
  } else if (pu !== au) {
    kind = pu > au ? "blue" : "red";
    desc = `到达第 ${cap} 回合上限。城市相同，部队 ${pu} : ${au}，${pu > au ? "蓝" : "红"}方领先。`;
  } else if (pm !== am) {
    kind = pm > am ? "blue" : "red";
    desc = `到达第 ${cap} 回合上限。城市与部队相同，金钱 ${pm} : ${am}，${pm > am ? "蓝" : "红"}方领先。`;
  } else {
    kind = "draw";
    desc = `到达第 ${cap} 回合上限。双方城市、部队、金钱均持平。`;
  }
  endGame(kind, desc);
  return true;
}

function checkVictory(reasonOwnerLost) {
  if (game.tutorial && game.tutNoVictory) return false;
  if (checkCampaignCapture()) return true;
  const p = cityCount("player");
  const a = cityCount("ai");
  if (p === 0) {
    wipe("player");
    endGame("red", "蓝方城市全部失守，蓝军建制崩溃。");
    return true;
  }
  if (a === 0) {
    wipe("ai");
    endGame("blue", "红方城市全部易手。");
    return true;
  }
  if (p === game.cities.length) {
    wipe("ai");
    endGame("blue", "蓝方占领了地图上的全部城市。");
    return true;
  }
  if (a === game.cities.length) {
    wipe("player");
    endGame("red", "红方占领了全部城市。");
    return true;
  }
  return false;
}

function wipe(owner) {
  const n = game.units.filter((u) => u.owner === owner).length;
  const b = game.buildings.filter((x) => x.owner === owner).length;
  for (const u of game.units) {
    if (u.owner === owner) noteUnitLost(u);
  }
  game.units = game.units.filter((u) => u.owner !== owner);
  game.buildings = game.buildings.filter((x) => x.owner !== owner);
  if (n) {
    log(`${ownerName(owner)}全军覆没，${n} 支部队消失。`, "sys");
    noteReport(`${ownerName(owner)}全军覆没，${n} 支部队消失。`);
  } else if (b) log(`${ownerName(owner)}建筑被一并清除。`, "sys");
}

function endGame(kind, desc, fromNet) {
  if (game.over) return;
  const draw = kind === "draw";
  const blueWin = !draw && (kind === "blue" || kind === "victory");
  const redWin = !draw && (kind === "red" || kind === "defeat");
  game.over = draw ? "draw" : (blueWin ? "blue" : (redWin ? "red" : kind));
  game.busy = false;
  game.phase = "end";
  stopBgm();
  let title;
  let color;
  if (draw) {
    title = "平局";
    color = "var(--gold)";
  } else if (game.mode === "hotseat") {
    title = blueWin ? "蓝方胜利" : "红方胜利";
    color = blueWin ? "var(--player)" : "var(--enemy)";
  } else if (game.mode === "online" || game.mode === "vsai") {
    const iWon = (blueWin && localOwner() === "player") || (redWin && localOwner() === "ai");
    title = iWon ? "胜利" : "战败";
    color = iWon ? "var(--player)" : "var(--enemy)";
  } else {
    title = blueWin ? "胜利" : "战败";
    color = blueWin ? "var(--player)" : "var(--enemy)";
  }
  $("end-kicker").textContent = "战役结束";
  $("end-title").textContent = title;
  $("end-title").style.color = color;
  $("end-desc").textContent = desc;
  let campWon = false;
  if (game.campaign && !draw && game.mode !== "online" && !(game.series && game.series.kind === "online-campaign")) {
    campWon = (blueWin && localOwner() === "player") || (redWin && localOwner() === "ai");
    if (campWon) noteCampaignWin(game.campaign);
  }
  if (game.series && game.series.kind === "online-campaign" && !fromNet && !draw) {
    if (blueWin) game.series.wins.player = (game.series.wins.player || 0) + 1;
    else game.series.wins.ai = (game.series.wins.ai || 0) + 1;
  }
  setupCampaignEndButtons(campWon);
  renderEndReport();
  $("modal-end").classList.remove("hidden");
  log(title + "。", "sys");
  updatePills();
  if (game.mode === "online" && !fromNet) netPush(true);
}

function reportEventList() {
  const ev = (game.reportEvents || []).slice();
  if (ev.length) return ev;
  return (game.logLines || []).filter((l) => /攻占|被摧毁|全军覆没|易主/.test((l && l.t) || ""));
}

function renderEndReport() {
  const box = $("end-report");
  if (!box) return;
  if (!game || game.tutorial) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }
  const st = ensureStats() || makeBattleStats();
  const p = Object.assign(emptyOwnerStats(), st.player);
  const a = Object.assign(emptyOwnerStats(), st.ai);
  const spec = mapInfo(game.sizeKey);
  const mapName = spec ? `${spec.label} ${game.w}×${game.h}` : `${game.w}×${game.h}`;
  const modeName = game.campaign ? ("攻防战役·" + (game.campaign.role === "defend" ? "防守" : "进攻") + "·" + missionTitleOf(game.campaign)) : (game.mode === "hotseat" ? "热座对战" : game.mode === "online" ? "联机对战" : "人机对战");
  const ocean = game.withOcean ? "有海洋" : "无海洋";
  const remain = (owner) => game.units.filter((u) => u.owner === owner).length;
  const row = (label, left, right) =>
    `<div class="end-report-row"><span class="me">${left}</span><span class="lbl">${label}</span><span class="foe">${right}</span></div>`;
  const events = reportEventList();
  const eventHtml = events.length
    ? events.map((e) => {
        const turn = e.turn != null ? `第 ${e.turn} 回合 ` : "";
        const cls = e.c ? ` class="${e.c}"` : "";
        return `<div${cls}>${turn}${e.t || ""}</div>`;
      }).join("")
    : `<div class="end-report-empty">没有记录到关键战事。</div>`;
  box.innerHTML = `
    <div class="end-report-meta">第 ${game.turn} 回合${game.endTurn != null ? ` / ${game.endTurn}` : ""} · ${modeName} · ${mapName} · ${ocean}</div>
    <div class="end-report-head"><span class="me">蓝方</span><span></span><span class="foe">红方</span></div>
    ${row("占领城市", p.captured, a.captured)}
    ${row("失去城市", p.citiesLost, a.citiesLost)}
    ${row("歼灭敌军", p.killed, a.killed)}
    ${row("己方损失", p.lost, a.lost)}
    ${row("采购单位", p.bought, a.bought)}
    ${row("建造建筑", p.built, a.built)}
    ${row("摧毁建筑", p.razed, a.razed)}
    ${row("造成伤害", hpText(p.damage), hpText(a.damage))}
    ${row("军费支出", p.spent + " 元", a.spent + " 元")}
    ${row("剩余金钱", (game.money.player || 0) + " 元", (game.money.ai || 0) + " 元")}
    ${row("剩余部队", remain("player"), remain("ai"))}
    <h3>关键战事</h3>
    <div class="end-report-events">${eventHtml}</div>
  `;
  box.classList.remove("hidden");
}

function tryBuild(owner, typeId, x, y) {
  const def = BUILDINGS[typeId];
  if (!def) return "未知建筑";
  if (owner === "player" && tutBlocked("deploy")) return game.tutHint || "请按教学提示操作";
  if (owner === "player" && !tutTileOk(x, y)) return "请建造到闪光格子";
  if (game.money[owner] < def.cost) return "金钱不足";
  if (!canBuyVehicle(owner, typeId)) return "该建筑 2 回合内只能建造 1 次";
  if (controlOwner(x, y) !== owner) return "建筑只能建在己方控制区";
  if (terrainAt(x, y) !== TERRAIN.PLAIN) return "机场只能建在平地";
  if (cityAt(x, y)) return "该格已有城市";
  if (buildingAt(x, y)) return "一个格子只能建一个建筑";
  game.money[owner] -= def.cost;
  noteSpend(owner, def.cost, "building");
  game.vehicleTurn[owner][typeId] = game.turn;
  const b = {
    id: nextId++,
    type: typeId,
    owner,
    x, y,
    hp: def.hp,
    maxHp: def.hp,
  };
  game.buildings.push(b);
  log(`${ownerName(owner)}建造 ${def.name} 于 ${displayCoord(x, y)}。`, owner === localOwner() ? "me" : "foe");
  beep("buy");
  spawnFx(x, y, def.name, owner === "player" ? "#7ec8ff" : "#ff8b84");
  if (isMine(owner)) {
    notePlayerPulse("buyDef");
    game.pendingBuy = null;
    renderShop();
    updatePills();
    notifyStateChanged();
  }
  tutEmit("buy", { typeId, x, y, building: b });
  return null;
}

function tryBuy(owner, typeId, x, y) {
  if (isBuildingType(typeId)) return tryBuild(owner, typeId, x, y);
  const def = UNITS[typeId];
  if (!def) return "未知单位";
  if (owner === "player" && tutBlocked("deploy")) return game.tutHint || "请按教学提示操作";
  if (owner === "player" && game.tutorial && game.tutShop && typeId !== game.tutShop) {
    return `请部署${UNITS[game.tutShop].name}`;
  }
  if (owner === "player" && !tutTileOk(x, y)) return "请部署到闪光格子";
  if (game.money[owner] < def.cost) return "金钱不足";
  if (!def.soldier && !canBuyVehicle(owner, typeId)) return "该非士兵单位 2 回合内只能购买 1 次";
  if (def.soldier && soldierBuyLimitReached(owner)) return "第 10 回合起每回合士兵总共最多购买 6 个";
  if (def.navy && !game.withOcean) return "未生成海洋，无法购买海军";
  if (def.needsOcean && !game.withOcean) return "未生成海洋，无法购买岸防炮";
  if (def.air) {
    const hangar = homeAirportAt({ type: typeId, owner }, x, y);
    if (!hangar) return canCarrierHangar({ type: typeId }) ? "空军只能部署在己方机场或航空母舰" : "空军只能部署在己方机场";
    const cap = hangarCapacityAt(x, y, owner, { type: typeId });
    if (hangarOccupancy(x, y, owner) >= cap) return "该机库已停满";
  } else if (def.navy) {
    const spots = deployTiles(owner, typeId);
    if (!spots.some((s) => s.x === x && s.y === y)) return "海军只能部署在己方控制区内的海洋或沿海城市";
    if (navyUnitAt(x, y)) return "该格已有舰船";
  } else {
    const spots = deployTiles(owner, typeId);
    if (!spots.some((s) => s.x === x && s.y === y)) return "只能部署在己方城市或控制区空格";
    if (groundOccupancy(x, y) >= groundCapacity(x, y)) return "该格已有单位";
    if (groundClassConflict(typeId, x, y)) return "士兵与非士兵不能部署在同一格";
    if (!canDeployTypeOn(typeId, x, y)) {
      if (typeId === "coast") return "岸防炮只能部署在挨着海洋的陆地";
      return isOceanAt(x, y) ? "不能把地面单位部署在海洋" : "不能把可移动单位部署在山峰";
    }
  }
  game.money[owner] -= def.cost;
  noteSpend(owner, def.cost, "unit");
  if (!def.soldier) game.vehicleTurn[owner][typeId] = game.turn;
  if (def.soldier) game.soldierBought[owner] += 1;
  const unit = {
    id: nextId++,
    type: typeId,
    owner,
    x, y,
    hp: def.hp,
    moved: true,
    acted: true,
    justDeployed: true,
    attacksLeft: 0,
    idleTurns: 0,
    defending: false,
    lastAttackTurn: null,
    parked: false,
    landedTurn: null,
    escorting: null,
    escortedBy: null,
    tunnelsDug: 0,
    aboard: null,
  };
  game.units.push(unit);
  if (def.air) {
    const hangar = homeAirportAt(unit);
    if (hangar && hangar.type === "carrier") {
      unit.parked = true;
      unit.landedTurn = game.turn;
    }
  }
  log(`${ownerName(owner)}部署 ${def.name} 于 ${displayCoord(x, y)}。`, owner === localOwner() ? "me" : "foe");
  beep("buy");
  if (isMine(owner)) {
    if (AI_OFFENSE_TYPES[typeId]) notePlayerPulse("buyOff");
    else notePlayerPulse("buyDef");
    game.pendingBuy = null;
    renderShop();
    updatePills();
    notifyStateChanged();
  }
  tutEmit("buy", { typeId, x, y, unit });
  return null;
}

function removeUnit(unit) {
  if (!unit) return;
  const civ = escortPassenger(unit);
  if (civ) {
    civ.escortedBy = null;
    log(`${UNITS[civ.type].name} 失去护卫。`, "sys");
  }
  const host = escortHost(unit);
  if (host) host.escorting = null;
  if (isNavy(unit)) {
    const cargo = game.units.filter((u) => u.aboard === unit.id);
    for (const u of cargo) {
      log(`${UNITS[u.type].name} 随舰沉没。`, "sys");
      spawnFx(u.x, u.y, "沉没", "#fff");
      u.aboard = null;
      noteUnitLost(u);
      game.units = game.units.filter((n) => n.id !== u.id);
      if (game.selected && game.selected.id === u.id) game.selected = null;
    }
    if (unit.type === "carrier") {
      const parked = airUnitsAt(unit.x, unit.y).filter((u) => u.owner === unit.owner && u.parked);
      for (const u of parked) {
        log(`${UNITS[u.type].name} 随机场沉没。`, "sys");
        spawnFx(u.x, u.y, "歼灭", "#fff");
        noteUnitLost(u);
        game.units = game.units.filter((n) => n.id !== u.id);
        if (game.selected && game.selected.id === u.id) game.selected = null;
      }
    }
  }
  noteUnitLost(unit);
  game.units = game.units.filter((u) => u.id !== unit.id);
  if (game.selected && game.selected.id === unit.id) game.selected = null;
  if (isNavy(unit) && unit.type === "carrier") crashAirOutOfSupply(unit.owner);
}

function crashAirOutOfSupply(owner) {
  const doomed = game.units.filter((u) => u.owner === owner && isAir(u) && !airInSupply(u.owner, u.x, u.y));
  for (const u of doomed) {
    log(`${UNITS[u.type].name} 超出机场作战半径，坠毁。`, "sys");
    spawnFx(u.x, u.y, "坠毁", "#ff8a7a");
    removeUnit(u);
  }
}

function ejectFortressUnits(b) {
  const units = groundUnitsAt(b.x, b.y);
  const spots = [];
  const dirs = DIRS4.concat(DIRS8.filter((d) => Math.abs(d[0]) + Math.abs(d[1]) === 2));
  const used = new Set();
  for (const [dx, dy] of dirs) {
    const x = b.x + dx, y = b.y + dy;
    if (!inBounds(x, y) || isImpassableGround(x, y)) continue;
    if (cityAt(x, y) && cityAt(x, y).owner !== b.owner) continue;
    const nb = buildingAt(x, y);
    if (nb && nb.owner !== b.owner) continue;
    if (groundOccupancy(x, y) >= groundCapacity(x, y)) continue;
    const k = x + "," + y;
    if (used.has(k)) continue;
    spots.push({ x, y });
    used.add(k);
  }
  for (const u of units) {
    if (u.escortedBy) u.escortedBy = null;
    if (u.escorting) {
      const p = escortPassenger(u);
      if (p) p.escortedBy = null;
      u.escorting = null;
    }
    const spot = spots.shift();
    if (!spot) {
      log(`${UNITS[u.type].name} 要塞坍塌，无处可站，被活埋。`, "sys");
      spawnFx(u.x, u.y, "活埋", "#ff8a7a");
      removeUnit(u);
      continue;
    }
    u.x = spot.x;
    u.y = spot.y;
    spawnFx(spot.x, spot.y, "撤出", "#d4b46a");
  }
}

function syncAirportOwners() {
  if (!game) return;
  for (const b of game.buildings.slice()) {
    if (b.type !== "airport") continue;
    const own = controlOwner(b.x, b.y);
    if (!own || own === b.owner) continue;
    const old = b.owner;
    const parked = airUnitsAt(b.x, b.y).filter((u) => u.owner === old && u.parked);
    for (const u of parked) {
      log(`${UNITS[u.type].name} 随机场易主被扣押消灭。`, "sys");
      spawnFx(u.x, u.y, "歼灭", "#fff");
      removeUnit(u);
    }
    b.owner = own;
    log(`${ownerName(own)}接管机场 ${displayCoord(b.x, b.y)}，原属${ownerName(old)}。`, own === localOwner() ? "me" : "foe");
    noteReport(`${ownerName(own)}接管机场 ${displayCoord(b.x, b.y)}，原属${ownerName(old)}。`, own === localOwner() ? "me" : "foe");
    spawnFx(b.x, b.y, "易主", own === "player" ? "#7ec8ff" : "#ff8b84");
    crashAirOutOfSupply(old);
  }
}

function destroyBuilding(b, attacker) {
  if (!b) return;
  const stationed = airUnitsAt(b.x, b.y).filter((u) => u.owner === b.owner);
  if (isFortress(b)) ejectFortressUnits(b);
  game.buildings = game.buildings.filter((x) => x.id !== b.id);
  if (game.inspectedBuilding && game.inspectedBuilding.id === b.id) hideCityCard();
  if (attacker && attacker.owner && attacker.owner !== b.owner) ownerStats(attacker.owner).razed += 1;
  const bName = BUILDINGS[b.type] ? BUILDINGS[b.type].name : "建筑";
  log(`${bName} ${displayCoord(b.x, b.y)} 被摧毁。`, "sys");
  noteReport(`${bName} ${displayCoord(b.x, b.y)} 被摧毁。`);
  spawnFx(b.x, b.y, "摧毁", "#ffb070");
  for (const u of stationed) {
    log(`${UNITS[u.type].name} 随机场被摧毁。`, "sys");
    spawnFx(u.x, u.y, "歼灭", "#fff");
    removeUnit(u);
  }
  crashAirOutOfSupply(b.owner);
  syncAirportOwners();
}

function adjacentCivilian(unit) {
  if (!isMilitaryGround(unit) || isImmobile(unit)) return null;
  let found = null;
  for (const u of game.units) {
    if (u.owner !== unit.owner || !isCivilian(u) || isEscorted(u) || u.id === unit.id) continue;
    if (cheb(unit.x, unit.y, u.x, u.y) === 1) {
      found = u;
      break;
    }
  }
  return found;
}

function adjacentMilitary(unit) {
  if (!isCivilian(unit) || isEscorted(unit)) return null;
  let found = null;
  for (const u of game.units) {
    if (u.owner !== unit.owner || !isMilitaryGround(u) || isImmobile(u) || u.escorting) continue;
    if (cheb(unit.x, unit.y, u.x, u.y) === 1) {
      found = u;
      break;
    }
  }
  return found;
}

function formEscort(military, civilian) {
  if (!military || !civilian) return "没有目标";
  if (!isMilitaryGround(military) || isImmobile(military)) return "该单位无法护送";
  if (!isCivilian(civilian)) return "只能护送平民";
  if (military.owner !== civilian.owner) return "只能护送友军平民";
  if (military.escorting) return "已经在护送";
  if (isEscorted(civilian)) return "该平民已有护卫";
  if (cheb(military.x, military.y, civilian.x, civilian.y) !== 1) return "必须与平民相邻";
  if (isOceanAt(military.x, military.y)) return "无法护送到海洋上";
  if (isPeakAt(military.x, military.y)) return "无法护送到山峰上";
  if (groundOccupancy(military.x, military.y, military.id) + 1 > groundCapacity(military.x, military.y)) {
    return "目标格子无法再容纳平民";
  }
  civilian.x = military.x;
  civilian.y = military.y;
  military.escorting = civilian.id;
  civilian.escortedBy = military.id;
  log(`${UNITS[military.type].name} 与 ${UNITS[civilian.type].name} 组成护卫队。`, military.owner === localOwner() ? "me" : "foe");
  spawnFx(military.x, military.y, "护卫", "#d4b46a");
  beep("buy");
  if (isMine(military.owner)) {
    toast("已组成护卫队，移动由军事单位决定");
    notifyStateChanged();
  }
  renderInspect();
  return null;
}

function dismissEscort(unit) {
  const military = unit.escorting ? unit : escortHost(unit);
  const civilian = military ? escortPassenger(military) : null;
  if (!military || !civilian) return "当前没有护卫队";
  const spot = nearestAdjacent({ x: military.x, y: military.y }, military.x, military.y, civilian);
  if (!spot) return "周围没有空位，无法解除护卫";
  civilian.x = spot.x;
  civilian.y = spot.y;
  civilian.escortedBy = null;
  military.escorting = null;
  log(`${UNITS[civilian.type].name} 解除护卫，位于 ${displayCoord(spot.x, spot.y)}。`, civilian.owner === localOwner() ? "me" : "foe");
  spawnFx(spot.x, spot.y, "解除", "#d4b46a");
  if (isMine(unit.owner)) {
    toast("已解除护卫队");
    notifyStateChanged();
  }
  renderInspect();
  return null;
}

function nearbyPeaks(unit) {
  const list = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const x = unit.x + dx, y = unit.y + dy;
      if (inBounds(x, y) && isPeakAt(x, y)) list.push({ x, y });
    }
  }
  return list;
}

function engineerCanAct(unit) {
  if (!unit || !isCivilian(unit) || unit.type !== "engineer") return false;
  if (!isPvp() && unit.owner === cpuOwner()) return true;
  return isMine(unit.owner) && canLocalAct() && !unit.justDeployed && !isEscorted(unit);
}

function finishEngineerWork(unit, kind) {
  if (!unit || unit.type !== "engineer") return false;
  if (kind === "tunnel") {
    unit.tunnelsDug = (unit.tunnelsDug || 0) + 1;
    if (unit.tunnelsDug < 2) return false;
  }
  const owner = unit.owner;
  const why = kind === "fortress" ? "建成前线要塞" : "开通第 2 条穿山隧道";
  log(`${ownerName(owner)}军事工程师${why}后撤离。`, owner === localOwner() ? "me" : "foe");
  spawnFx(unit.x, unit.y + 0.28, "撤离", "#d4c48a");
  if (game.selected && game.selected.id === unit.id) {
    game.selected = null;
    game.tunnelPick = false;
  }
  removeUnit(unit);
  if (isMine(owner)) toast(`工程师${why}，已撤离`);
  return true;
}

function transportCargo(ship) {
  if (!ship) return [];
  return game.units.filter((u) => u.aboard === ship.id);
}
function cargoSoldiers(ship) {
  return transportCargo(ship).filter((u) => UNITS[u.type] && UNITS[u.type].soldier);
}
function cargoPersonnel(ship) {
  return transportCargo(ship).filter((u) => {
    const d = UNITS[u.type];
    if (!d || isEscorted(u)) return false;
    return !!(d.soldier || d.civilian);
  });
}
function cargoVehicles(ship) {
  return transportCargo(ship).filter((u) => TRANSPORT_VEHICLES[u.type] && !u.escorting && !isEscorted(u));
}
function cargoEscorts(ship) {
  return transportCargo(ship).filter((u) => u.escorting);
}
function adjacentTransport(unit) {
  if (!unit) return null;
  let best = null, bestD = 99;
  for (const ship of game.units) {
    if (ship.owner !== unit.owner || ship.type !== "transport" || ship.hp <= 0) continue;
    const d = cheb(ship.x, ship.y, unit.x, unit.y);
    if (d <= 1 && d < bestD) {
      best = ship;
      bestD = d;
    }
  }
  return best;
}
function canBoardTransport(ship, unit) {
  if (!ship || ship.type !== "transport" || !unit) return "没有运输船";
  if (ship.owner !== unit.owner) return "只能登上友军运输船";
  if (isNavy(unit) || isAir(unit) || isAboard(unit)) return "该单位无法上船";
  if (isEscorted(unit)) return "护卫中的平民随护卫上船";
  if (cheb(ship.x, ship.y, unit.x, unit.y) > 1) return "必须与运输船相邻";
  if (UNITS[unit.type].soldier || isCivilian(unit)) {
    if (cargoPersonnel(ship).length >= TRANSPORT_SOLDIER_CAP) return "人员舱已满（6）";
    return null;
  }
  if (unit.escorting) {
    if (cargoEscorts(ship).length >= 1) return "已有护卫队在船上";
    if (cargoVehicles(ship).length) return "车辆舱已占用，无法再载护卫队";
    return null;
  }
  if (TRANSPORT_VEHICLES[unit.type]) {
    if (cargoEscorts(ship).length) return "已载护卫队，无法再载车辆";
    if (cargoVehicles(ship).length >= TRANSPORT_VEHICLE_CAP) return "车辆舱已满（2）";
    return null;
  }
  return "运输船不能装载该单位";
}
function boardTransport(ship, unit) {
  const err = canBoardTransport(ship, unit);
  if (err) return err;
  const extra = [];
  if (unit.escorting) {
    const p = escortPassenger(unit);
    if (p) extra.push(p);
  }
  unit.aboard = ship.id;
  unit.x = ship.x;
  unit.y = ship.y;
  unit.defending = false;
  markAct(unit, true);
  for (const p of extra) {
    p.aboard = ship.id;
    p.x = ship.x;
    p.y = ship.y;
  }
  log(`${UNITS[unit.type].name}${extra.length ? "（护卫队）" : ""} 登上运输船。`, unit.owner === localOwner() ? "me" : "foe");
  spawnFx(ship.x, ship.y, "上船", "#7ec8ff");
  if (game.selected && game.selected.id === unit.id) game.selected = ship;
  if (isMine(unit.owner)) {
    toast("已上船");
    renderInspect();
    notifyStateChanged();
  }
  return null;
}
function unloadSpotsAround(ship, unit) {
  const spots = [];
  for (const [dx, dy] of DIRS4.concat(DIRS8.filter((d) => Math.abs(d[0]) + Math.abs(d[1]) === 2))) {
    const x = ship.x + dx, y = ship.y + dy;
    if (!inBounds(x, y) || isOceanAt(x, y) || isImpassableGround(x, y)) continue;
    if (groundOccupancy(x, y) >= groundCapacity(x, y)) continue;
    if (groundClassConflict(unit.type, x, y)) continue;
    const c = cityAt(x, y);
    if (c && c.owner !== unit.owner) continue;
    const b = buildingAt(x, y);
    if (b && b.owner !== unit.owner) continue;
    spots.push({ x, y });
  }
  if (isCoastalCityAt(ship.x, ship.y) && groundOccupancy(ship.x, ship.y) < groundCapacity(ship.x, ship.y)
    && !groundClassConflict(unit.type, ship.x, ship.y)) {
    spots.unshift({ x: ship.x, y: ship.y });
  }
  return spots;
}
function unloadTransport(ship) {
  if (!ship || ship.type !== "transport") return "只有运输船能下船";
  const cargo = transportCargo(ship);
  if (!cargo.length) return "船上没有单位";
  const used = new Set();
  let landed = 0;
  for (const u of cargo) {
    if (isEscorted(u)) continue;
    const spots = unloadSpotsAround(ship, u).filter((s) => !used.has(s.x + "," + s.y));
    const spot = spots[0];
    if (!spot) continue;
    used.add(spot.x + "," + spot.y);
    u.aboard = null;
    u.x = spot.x;
    u.y = spot.y;
    const p = escortPassenger(u);
    if (p && p.aboard === ship.id) {
      p.aboard = null;
      p.x = spot.x;
      p.y = spot.y;
    }
    landed += 1;
  }
  if (!landed) return "周围没有可登陆的空地";
  markAct(ship, false);
  log(`${UNITS[ship.type].name} 卸载 ${landed} 支部队。`, ship.owner === localOwner() ? "me" : "foe");
  spawnFx(ship.x, ship.y, "下船", "#d4b46a");
  if (isMine(ship.owner)) {
    toast(`已下船 ${landed} 支部队`);
    renderInspect();
    notifyStateChanged();
  }
  return null;
}
function syncShipFollowers(ship, ox, oy) {
  if (!isNavy(ship)) return;
  for (const u of game.units) {
    if (u.aboard === ship.id) {
      u.x = ship.x;
      u.y = ship.y;
    }
  }
  if (ship.type === "carrier") {
    for (const u of game.units) {
      if (isAir(u) && u.parked && u.owner === ship.owner && u.x === ox && u.y === oy) {
        u.x = ship.x;
        u.y = ship.y;
      }
    }
  }
}

function tryPaveRoad(unit) {
  if (!engineerCanAct(unit) && isMine(unit.owner)) return "现在不能施工";
  if (unit.type !== "engineer") return "只有军事工程师能铺路";
  if (isEscorted(unit)) return "护卫中无法施工";
  if (unit.justDeployed) return "新部署单位当回合不能行动";
  if (terrainAt(unit.x, unit.y) !== TERRAIN.PLAIN) return "只能在平地上铺路";
  if (cityAt(unit.x, unit.y)) return "不能在城市格铺路";
  if (game.money[unit.owner] < 75) return "金钱不足";
  game.money[unit.owner] -= 75;
  noteSpend(unit.owner, 75);
  game.terrain[unit.x + unit.y * game.w] = TERRAIN.ROAD;
  markAct(unit, true);
  log(`${ownerName(unit.owner)}军事工程师在 ${displayCoord(unit.x, unit.y)} 铺设道路（-75 元）。`, unit.owner === localOwner() ? "me" : "foe");
  spawnFx(unit.x, unit.y, "道路", "#d4b46a");
  beep("buy");
  if (isMine(unit.owner)) {
    toast("已铺路，从此格走出视为 0.5 格");
    updatePills();
    renderInspect();
    renderShop();
    notifyStateChanged();
  }
  return null;
}

function tryBuildFortressHere(unit) {
  if (unit.type !== "engineer") return "只有军事工程师能建要塞";
  if (isEscorted(unit)) return "护卫中无法施工";
  if (unit.justDeployed) return "新部署单位当回合不能行动";
  if (isOceanAt(unit.x, unit.y)) return "不能在海洋上建造要塞";
  if (isPeakAt(unit.x, unit.y)) return "不能在山峰上建造要塞";
  if (cityAt(unit.x, unit.y)) return "不能在城市格建造要塞";
  if (buildingAt(unit.x, unit.y)) return "该格已有建筑";
  if (game.money[unit.owner] < 500) return "金钱不足";
  game.money[unit.owner] -= 500;
  noteSpend(unit.owner, 500, "building");
  const def = BUILDINGS.fortress;
  const b = {
    id: nextId++,
    type: "fortress",
    owner: unit.owner,
    x: unit.x,
    y: unit.y,
    hp: def.hp,
    maxHp: def.hp,
  };
  game.buildings.push(b);
  markAct(unit, true);
  log(`${ownerName(unit.owner)}在 ${displayCoord(b.x, b.y)} 建造前线要塞（-500 元），周围 3×3 成为控制区。`, unit.owner === localOwner() ? "me" : "foe");
  spawnFx(b.x, b.y, "要塞", unit.owner === "player" ? "#7ec8ff" : "#ff8b84");
  beep("buy");
  syncAirportOwners();
  const gone = finishEngineerWork(unit, "fortress");
  if (isMine(unit.owner)) {
    if (!gone) toast("前线要塞建成，内部单位免疫近战与直射");
    updatePills();
    renderInspect();
    renderShop();
    notifyStateChanged();
  }
  return null;
}

function tryDigTunnel(unit, x, y) {
  if (unit.type !== "engineer") return "只有军事工程师能开隧道";
  if (isEscorted(unit)) return "护卫中无法施工";
  if (unit.justDeployed) return "新部署单位当回合不能行动";
  if (!inBounds(x, y) || !isPeakAt(x, y)) return "只能把相邻山峰改为穿山隧道";
  if (cheb(unit.x, unit.y, x, y) !== 1) return "必须与目标山峰相邻（含斜角）";
  if (game.money[unit.owner] < 300) return "金钱不足";
  game.money[unit.owner] -= 300;
  noteSpend(unit.owner, 300);
  game.terrain[x + y * game.w] = TERRAIN.TUNNEL;
  markAct(unit, true);
  log(`${ownerName(unit.owner)}将 ${displayCoord(x, y)} 开辟为穿山隧道（-300 元）。四向相邻的隧道自动连通。`, unit.owner === localOwner() ? "me" : "foe");
  spawnFx(x, y, "隧道", "#c8c6c0");
  beep("buy");
  const dug = (unit.tunnelsDug || 0) + 1;
  const gone = finishEngineerWork(unit, "tunnel");
  if (isMine(unit.owner)) {
    if (!gone) toast(`穿山隧道已开通。还可再开 ${2 - dug} 条，或修建 1 座要塞后撤离`);
    game.tunnelPick = false;
    updatePills();
    renderInspect();
    renderShop();
    notifyStateChanged();
  }
  return null;
}

function markAct(unit, alsoMove) {
  unit.acted = true;
  unit.defending = false;
  unit.idleTurns = 0;
  if (alsoMove) unit.moved = true;
}

function doLand(unit) {
  if (unit.owner === "player" && tutBlocked("land")) return tutBlockToast();
  if (!isAir(unit)) return;
  if (unit.parked) return toast("已经停在机场里");
  if (unit.justDeployed) return toast("新部署单位当回合不能行动");
  const ap = homeAirportAt(unit);
  if (!ap) return toast("只能在友军机场降落");
  unit.parked = true;
  unit.landedTurn = game.turn;
  markAct(unit, true);
  game.ranged = false;
  game.airAtk = false;
  log(`${UNITS[unit.type].name} 降落停场于 ${displayCoord(ap.x, ap.y)}。`, unit.owner === localOwner() ? "me" : "foe");
  spawnFx(ap.x, ap.y, "降落", "#9ad0ff");
  if (isMine(unit.owner)) toast("已降落，停场期间每回合回复 2 点生命");
  renderInspect();
  updatePills();
  tutEmit("land", { unit, x: ap.x, y: ap.y });
  notifyStateChanged();
}

function doTakeOff(unit) {
  if (unit.owner === "player" && tutBlocked("takeoff")) return tutBlockToast();
  if (!isAir(unit) || !unit.parked) return;
  if (unit.justDeployed) return toast("新部署单位当回合不能行动");
  if (unit.landedTurn === game.turn) return toast("本回合刚降落，不能再起飞");
  unit.parked = false;
  unit.landedTurn = null;
  log(`${UNITS[unit.type].name} 从机场起飞。`, unit.owner === localOwner() ? "me" : "foe");
  spawnFx(unit.x, unit.y, "起飞", "#9ad0ff");
  if (isMine(unit.owner)) toast("已起飞");
  renderInspect();
  updatePills();
  tutEmit("takeoff", { unit, x: unit.x, y: unit.y });
  notifyStateChanged();
}

function applyDamage(attacker, tx, ty, isMelee, opts) {
  opts = opts || {};
  const mode = opts.mode || "ground";
  const tile = getTile(tx, ty);
  if (mode === "air") {
    const airs = flyingAirAt(tx, ty).filter((u) => u.id !== attacker.id);
    if (!airs.length) return { raw: 0, unitDead: false, city: null, unit: null, attackerDead: false, backlash: 0, empty: true };
    let target = opts.targetId ? airs.find((u) => u.id === opts.targetId) : null;
    if (!target) target = airs.find((u) => u.owner !== attacker.owner) || airs[0];
    const raw = round2(damageOf(attacker, { unit: target, air: target }, "air") * (opts.dmgScale != null ? opts.dmgScale : 1));
    target.hp = round2(target.hp - raw);
    spawnFx(tx, ty, `-${hpText(raw)}`, "#9fd0ff");
    beep("hit");
    if (attacker.owner === localOwner()) notePlayerPulse("atk");
    noteDamage(attacker.owner, raw);
    const unitDead = target.hp <= 0;
    if (unitDead) {
      log(`${UNITS[target.type].name} 被歼灭。`, "sys");
      noteUnitKill(attacker, target);
      removeUnit(target);
      spawnFx(tx, ty + 0.25, "歼灭", "#fff");
      beep("die");
    }
    return { raw, unitDead, city: null, unit: unitDead ? null : target, attackerDead: false, backlash: 0 };
  }
  const focus = combatUnitAt(attacker, tx, ty, { melee: isMelee });
  if (focus) tile.unit = focus;
  if (!tile.unit && !tile.city && !tile.building) return { raw: 0, unitDead: false, city: null, unit: null, attackerDead: false, backlash: 0, empty: true };
  if (isMelee && UNITS[attacker.type] && UNITS[attacker.type].noLand && !(tile.unit && isNavy(tile.unit))) {
    return { raw: 0, unitDead: false, city: null, unit: null, attackerDead: false, backlash: 0, empty: true };
  }
  const shieldFort = isFortress(tile.building) && tile.unit && !isAir(attacker) && !isNavy(attacker) && mode !== "air"
    && (isMelee || isDirectFire(attacker));
  if (shieldFort) tile.unit = null;
  const foeUnit = tile.unit && tile.unit.owner !== attacker.owner ? tile.unit : null;
  const scale = opts.dmgScale != null ? opts.dmgScale : 1;
  let raw = round2(damageOf(attacker, tile, "ground") * scale);
  const mit = (mode !== "air" && !isAir(attacker))
    ? groundMitigation(attacker, tile.unit, tx, ty, isMelee)
    : 0;
  const parts = [];
  if (tile.unit && isCivilian(tile.unit)) {
    tile.unit.hp = 0;
    spawnFx(tx, ty, "击毙", "#ff8a7a");
    parts.push("平民被击毙");
  } else if (tile.unit && tile.city) {
    const split = garrisonSplit(raw, tile.unit, { isMelee, attacker, mit });
    const toU = split.toU;
    const toC = split.toC;
    tile.unit.hp = round2(tile.unit.hp - toU);
    tile.city.hp = Math.max(0, round2(tile.city.hp - toC));
    if (toC > 0) markCityHit(tile.city);
    spawnFx(tx, ty - 0.15, `-${hpText(toU)} / -${hpText(toC)}`, "#ffd27a");
    parts.push(split.overflow > 0
      ? `驻守平分 单位${hpText(toU)} 城市${hpText(toC)}（溢出 ${hpText(split.overflow)}）`
      : `驻守平分 单位${hpText(toU)} 城市${hpText(toC)}`);
  } else if (tile.unit) {
    let d = raw;
    if (mit) d = Math.max(0, round2(d - mit));
    d = round2(d * fromAirScale(attacker, tile.unit));
    if (isAir(attacker) && isNavy(tile.unit)) d = Math.max(0, round2(d - 1));
    tile.unit.hp = round2(tile.unit.hp - d);
    spawnFx(tx, ty, `-${hpText(d)}`, "#ff8a7a");
    parts.push(`单位受伤 ${hpText(d)}`);
  } else if (tile.city) {
    const d = round2(raw);
    tile.city.hp = Math.max(0, round2(tile.city.hp - d));
    if (d > 0) markCityHit(tile.city);
    spawnFx(tx, ty, `-${hpText(d)}`, "#ffb070");
    parts.push(`城市受伤 ${hpText(d)}`);
  } else if (tile.building) {
    const d = round2(raw);
    tile.building.hp = round2(tile.building.hp - d);
    spawnFx(tx, ty, `-${hpText(d)}`, "#ffb070");
    parts.push(`建筑受伤 ${hpText(d)}`);
  }
  beep("hit");
  if (attacker.owner === localOwner()) {
    notePlayerPulse("atk");
    if (tile.city && tile.city.owner === foeOwner(localOwner())) notePlayerPulse("cityHit");
  }
  noteDamage(attacker.owner, raw);
  const victim = tile.unit;
  const unitDead = victim && victim.hp <= 0;
  if (unitDead) {
    log(`${UNITS[victim.type].name} 被歼灭。`, "sys");
    noteUnitKill(attacker, victim);
    removeUnit(victim);
    spawnFx(tx, ty + 0.25, "歼灭", "#fff");
    beep("die");
  }
  if (tile.building && tile.building.hp <= 0) destroyBuilding(tile.building, attacker);
  let backlash = 0;
  let attackerDead = false;
  const skipBack = opts.noBacklash || isAir(attacker) || (foeUnit && isAir(foeUnit));
  if (foeUnit && !skipBack) {
    const atkDmg = meleeDmgVs(attacker, foeUnit);
    const defDmg = meleeDmgVs(foeUnit, attacker);
    if (defDmg > atkDmg) {
      backlash = round2((defDmg - atkDmg) / 2);
      if (backlash > 0) {
        attacker.hp = round2(attacker.hp - backlash);
        spawnFx(attacker.x, attacker.y, `反击 -${hpText(backlash)}`, "#ffd27a");
        parts.push(`反伤 ${hpText(backlash)}`);
        log(`${UNITS[attacker.type].name} 受到反伤 ${hpText(backlash)}（对方近战 ${hpText(defDmg)} > 己方 ${hpText(atkDmg)}）。`, "sys");
        if (attacker.hp <= 0) {
          attackerDead = true;
          log(`${UNITS[attacker.type].name} 被反伤歼灭。`, "sys");
          noteUnitKill(foeUnit, attacker);
          removeUnit(attacker);
          spawnFx(attacker.x, attacker.y + 0.25, "歼灭", "#fff");
          beep("die");
        }
      }
    }
  }
  // Air ranged/splash vs AA: always take half of AA dmgAir (was skipped by noBacklash/isAir).
  if (!attackerDead && foeUnit && isAir(attacker) && mode === "ground" && !opts.empty) {
    const flak = applyAaFlak(attacker, foeUnit);
    if (flak.backlash > 0) {
      backlash = round2(backlash + flak.backlash);
      parts.push(`防空反击 ${hpText(flak.backlash)}`);
    }
    if (flak.attackerDead) attackerDead = true;
  }
  return { raw, unitDead, city: getTile(tx, ty).city, unit: getTile(tx, ty).unit, attackerDead, backlash };
}

function nearestAdjacent(from, tx, ty, mover) {
  let best = null, bestD = Infinity;
  for (const [dx, dy] of DIRS4) {
    const x = tx + dx, y = ty + dy;
    if (!inBounds(x, y)) continue;
    if (isNavy(mover)) {
      if (!navyCanStand(x, y) || navyUnitAt(x, y, mover.id)) continue;
    } else {
      if (isImpassableGround(x, y)) continue;
      if (groundUnitAt(x, y, mover.id)) continue;
    }
    const c = cityAt(x, y);
    if (c && c.owner !== mover.owner) continue;
    const b = buildingAt(x, y);
    if (b && b.owner !== mover.owner) continue;
    const d = (x - from.x) * (x - from.x) + (y - from.y) * (y - from.y);
    if (d < bestD) {
      bestD = d;
      best = { x, y };
    }
  }
  return best;
}

function tryUpgradeCity(owner, city, kind) {
  if (!game || game.over) return "战役已结束";
  if (owner === "player" && tutBlocked("upgrade")) return game.tutHint || "请按教学提示操作";
  if (isMine(owner) && !canLocalAct()) return "请在己方行动阶段升级";
  if (city.owner !== owner) return "只能升级友军城市";
  if (game.turn < 10) return "第 10 回合起才能修战升级";
  if (!isCityTruce(city)) return "城市未进入修战（需 3 回合内未被攻击）";
  if (!cityUpgradeReady(city, owner)) return `5 回合内每座城市只能升级 1 次，还需 ${cityUpgradeWait(city, owner)} 回合`;
  if (!city.lastUpgradeTurn) city.lastUpgradeTurn = { player: -99, ai: -99 };
  if (kind === "income") {
    const cost = cityIncomeCost(city);
    if (game.money[owner] < cost) return "金钱不足";
    game.money[owner] -= cost;
    noteSpend(owner, cost);
    city.incomeUpgrades = (city.incomeUpgrades || 0) + 1;
    city.incomeBonus = (city.incomeBonus || 0) + 100;
    city.lastUpgradeTurn[owner] = game.turn;
    log(`${ownerName(owner)}升级城市 ${displayCoord(city.x, city.y)}：每回合收益 +100，现 ${cityIncomeOf(city)} 元。下次经济升级 ${cityIncomeCost(city)} 元。`, owner === localOwner() ? "me" : "foe");
    spawnFx(city.x, city.y, "收益+100", "#d4b46a");
    beep("buy");
    if (owner === "player") tutEmit("upgrade", { city, kind });
    notifyStateChanged();
    return null;
  }
  if (kind === "hp") {
    if (game.money[owner] < 600) return "金钱不足";
    game.money[owner] -= 600;
    noteSpend(owner, 600);
    city.maxHp += 5;
    city.hp = Math.min(city.maxHp, round2(city.hp + 5));
    city.hpUpgrades = (city.hpUpgrades || 0) + 1;
    city.lastUpgradeTurn[owner] = game.turn;
    log(`${ownerName(owner)}升级城市 ${displayCoord(city.x, city.y)}：生命上限 +5 并回复 5，现 ${hpText(city.hp)}/${city.maxHp}。`, owner === localOwner() ? "me" : "foe");
    spawnFx(city.x, city.y, "上限+5", "#7dcf6b");
    beep("buy");
    if (owner === "player") tutEmit("upgrade", { city, kind });
    notifyStateChanged();
    return null;
  }
  return "未知升级";
}

function cityLossCompOf(owner) {
  if (!game.cityLossComp) game.cityLossComp = { player: CITY_LOSS_COMP_BASE, ai: CITY_LOSS_COMP_BASE };
  const v = game.cityLossComp[owner];
  return typeof v === "number" ? v : CITY_LOSS_COMP_BASE;
}

function captureCity(city, unit) {
  if (cityUncapturable(city) && city.owner !== unit.owner) return;
  const old = city.owner;
  city.owner = unit.owner;
  city.hp = 1;
  markCityHit(city);
  unit.x = city.x;
  unit.y = city.y;
  const comp = cityLossCompOf(old);
  const capturerPrev = cityLossCompOf(unit.owner);
  game.money[old] += comp;
  game.cityLossComp[old] = comp + CITY_LOSS_COMP_STEP;
  game.cityLossComp[unit.owner] = CITY_LOSS_COMP_BASE;
  if (unit.owner === localOwner()) notePlayerPulse("capture");
  ownerStats(unit.owner).captured += 1;
  ownerStats(old).citiesLost += 1;
  noteReport(`${ownerName(unit.owner)}攻占城市 ${displayCoord(city.x, city.y)}，原属${ownerName(old)}。`, unit.owner === localOwner() ? "me" : "foe");
  if (!game.lostCities) game.lostCities = { player: [], ai: [] };
  game.lostCities[old] = (game.lostCities[old] || []).filter((p) => !(p.x === city.x && p.y === city.y));
  game.lostCities[old].push({ x: city.x, y: city.y, turn: game.turn });
  game.lostCities[unit.owner] = (game.lostCities[unit.owner] || []).filter((p) => !(p.x === city.x && p.y === city.y));
  if (old === cpuOwner()) game.aiCounterUntil = Math.max(game.aiCounterUntil || 0, game.turn + 5);
  log(`${ownerName(unit.owner)}攻占城市 ${displayCoord(city.x, city.y)}，原属${ownerName(old)}。该城生命变为 1。`, unit.owner === localOwner() ? "me" : "foe");
  log(`${ownerName(old)}失去城市，获得补偿 ${comp} 元。下次失城补偿 ${comp + CITY_LOSS_COMP_STEP} 元。`, old === localOwner() ? "me" : "foe");
  if (capturerPrev > CITY_LOSS_COMP_BASE) {
    log(`${ownerName(unit.owner)}攻占城市，失城补偿重置为 ${CITY_LOSS_COMP_BASE} 元。`, unit.owner === localOwner() ? "me" : "foe");
  }
  tutEmit("capture", { city, old, unit });
  beep("cap");
  spawnFx(city.x, city.y, "占领", unit.owner === "player" ? "#7ec8ff" : "#ff8b84");
  if (isMine(old)) {
    toast(`城市失守，补偿 +${comp} 元`);
    renderShop();
    updatePills();
  }
  syncAirportOwners();
  if (!game.tutorial && game.mode === "vsai") aiPlanCampaign();
}

function animateTo(unit, path) {
  return new Promise((resolve) => {
    if (!path || path.length <= 1) {
      resolve();
      return;
    }
    anim = { unit, path, i: 0, t: 0, resolve };
  });
}

function syncEscortPos(unit) {
  const p = escortPassenger(unit);
  if (p) {
    p.x = unit.x;
    p.y = unit.y;
  }
}

async function doMove(unit, x, y) {
  if (unit.owner === "player" && tutBlocked("move")) return tutBlockToast();
  if (unit.owner === "player" && !tutTileOk(x, y)) return toast("请移动到闪光格子");
  if (isAboard(unit)) return toast("载员随运输船移动，请先下船");
  if (isEscorted(unit)) return toast("护卫中的平民随护卫移动");
  if (isImmobile(unit)) return toast("该单位无法移动");
  if (unit.moved || unit.justDeployed) return toast("该单位本回合无法再移动");
  if (cannotMoveAndAttack(unit) && alreadyAttacked(unit)) return toast("该单位不能在同一回合移动并攻击");
  if (mustMoveThenAttack(unit) && alreadyAttacked(unit)) return toast("空军必须先移动后攻击");
  if (isParked(unit) && unit.landedTurn === game.turn) return toast("本回合刚降落，不能再起飞");
  let path;
  if (isAir(unit)) {
    const d = cheb(unit.x, unit.y, x, y);
    if (!(d > 0 && d <= UNITS[unit.type].move) || !canStop(unit, x, y)) {
      toast("无法移动到该格");
      return;
    }
    path = chebPath(unit, { x, y });
  } else {
    const budget = moveBudget(unit);
    const { dist, prev } = bfs(unit, budget, null);
    const d = dist[x + y * game.w];
    if (!(d > 0 && d <= budget) || !canStop(unit, x, y)) {
      toast("无法移动到该格");
      return;
    }
    path = reconstruct(prev, x, y);
  }
  if (isParked(unit)) unit.parked = false;
  markAct(unit, true);
  await animateTo(unit, path);
  const ox = unit.x, oy = unit.y;
  unit.x = x;
  unit.y = y;
  syncEscortPos(unit);
  syncShipFollowers(unit, ox, oy);
  log(`${UNITS[unit.type].name}${escortPassenger(unit) ? "（护卫队）" : ""} 移动至 (${x},${y})。`, unit.owner === localOwner() ? "me" : "foe");
  beep("move");
  renderInspect();
  tutEmit("move", { unit, x, y });
  notifyStateChanged();
}

async function doMelee(unit, x, y) {
  if (unit.owner === "player" && tutBlocked("melee")) return tutBlockToast();
  if (isAir(unit)) return toast("空军单位无法近战攻击");
  if (isCivilian(unit)) return toast("平民单位无法发动攻击");
  if (isImmobile(unit)) return toast("该单位无法近战突击");
  if (unit.justDeployed) return toast("新部署单位当回合不能行动");
  if (unit.moved) return toast("该单位本回合已经移动，无法近战突击");
  if (cannotMoveAndAttack(unit) && alreadyAttacked(unit)) return toast("该单位不能在同一回合移动并攻击");
  if (unit.attacksLeft <= 0) return attackDeniedToast(unit);
  const from = { x: unit.x, y: unit.y };
  const budget = moveBudget(unit);
  const { dist, prev } = bfs(unit, budget, { x, y });
  const d = dist[x + y * game.w];
  if (!(d > 0 && d <= budget)) {
    toast("无法突击到该目标");
    return;
  }
  const path = reconstruct(prev, x, y);
  const tileBefore = getTile(x, y);
  if (!tileBefore.unit && !tileBefore.city && !tileBefore.building) return;
  if ((tileBefore.unit && tileBefore.unit.owner === unit.owner)
    || (!tileBefore.unit && tileBefore.city && tileBefore.city.owner === unit.owner)
    || (!tileBefore.unit && !tileBefore.city && tileBefore.building && tileBefore.building.owner === unit.owner)) {
    toast("不能攻击友军");
    return;
  }
  markAct(unit, true);
  spendAttack(unit);
  const walk = path.slice(0, Math.max(1, path.length - 1));
  await animateTo(unit, walk);
  let pre = { x: from.x, y: from.y };
  for (const p of walk) {
    const blocked = isNavy(unit)
      ? (!navyCanStand(p.x, p.y) || !!navyUnitAt(p.x, p.y, unit.id))
      : isImpassableGround(p.x, p.y) || groundOccupancy(p.x, p.y, moveExceptIds(unit)) >= groundCapacity(p.x, p.y);
    const enemyCity = game.cities.some((c) => c.x === p.x && c.y === p.y && c.owner !== unit.owner);
    const enemyBld = game.buildings.some((b) => b.x === p.x && b.y === p.y && b.owner !== unit.owner);
    if (!blocked && !enemyCity && !enemyBld) pre = p;
  }
  unit.x = pre.x;
  unit.y = pre.y;
  syncEscortPos(unit);
  const res = applyDamage(unit, x, y, true);
  log(`${UNITS[unit.type].name} 近战攻击 (${x},${y})。`, unit.owner === localOwner() ? "me" : "foe");
  if (res.attackerDead) {
    renderInspect();
    updatePills();
    return;
  }
  const city = game.cities.find((c) => c.x === x && c.y === y);
  const occ = groundUnitAt(x, y);
  const canCapture = city && city.owner !== unit.owner && city.hp <= 0 && !occ && !cityUncapturable(city);
  if (city && city.owner !== unit.owner && city.hp <= 0 && !occ && cityUncapturable(city)) {
    toast("进攻方初始城市无法被占领");
  }
  if (canCapture) {
    await animateTo(unit, [ { x: unit.x, y: unit.y }, { x, y } ]);
    captureCity(city, unit);
    if (checkVictory()) return;
  } else if (res.unitDead && !city && canStop(unit, x, y)) {
    await animateTo(unit, [ { x: unit.x, y: unit.y }, { x, y } ]);
    unit.x = x;
    unit.y = y;
  } else if (res.unitDead && city && city.owner === unit.owner && canStop(unit, x, y)) {
    await animateTo(unit, [ { x: unit.x, y: unit.y }, { x, y } ]);
    unit.x = x;
    unit.y = y;
  } else {
    const stand = nearestAdjacent(from, x, y, unit) || { x: unit.x, y: unit.y };
    await animateTo(unit, [ { x: unit.x, y: unit.y }, stand ]);
    unit.x = stand.x;
    unit.y = stand.y;
  }
  syncEscortPos(unit);
  renderInspect();
  updatePills();
  tutEmit("melee", { unit, x, y });
  notifyStateChanged();
}

async function doRanged(unit, x, y, mode) {
  if (unit.owner === "player" && tutBlocked("ranged")) return tutBlockToast();
  if (isCivilian(unit)) return toast("平民单位无法发动攻击");
  if (unit.justDeployed) return toast("新部署单位当回合不能行动");
  if (isParked(unit)) return toast("停场空军需要先起飞才能攻击");
  if (unit.attacksLeft <= 0) return attackDeniedToast(unit);
  if (cannotMoveAndAttack(unit) && unit.moved) return toast("该单位不能在同一回合移动并攻击");
  const def = UNITS[unit.type];
  const flying = isAir(unit);
  const atkMode = mode || (canShootAir(unit) && game.airAtk ? "air" : "ground");
  const range = attackRangeOf(unit, atkMode);
  if (!range) return toast("该单位没有远程攻击");
  if (cheb(unit.x, unit.y, x, y) > range || (unit.x === x && unit.y === y)) {
    toast("目标不在射程内");
    return;
  }
  if (shotBlocked(unit, atkMode, x, y)) {
    toast(needsGroundLoS(unit, atkMode) ? "没有视线，森林、丘陵或山峰挡住了直射" : "山峰挡住了弹道");
    return;
  }
  if (def.noLand && atkMode === "ground") {
    const n = navyUnitAt(x, y);
    const gnd = groundUnitAt(x, y);
    const city = cityAt(x, y);
    const bld = buildingAt(x, y);
    if ((!n || n.owner === unit.owner) && !gnd && !city && !bld) {
      toast("没有可攻击目标");
      return;
    }
  }
  if (usesGroundSplash(unit, atkMode)) {
    markAct(unit, false);
    spendAttack(unit);
    spawnFx(x, y, "轰", "#ffb070");
    let hits = 0;
    const radius = def.splashRadius != null ? def.splashRadius : 1;
    for (const cell of splashCells(x, y, radius)) {
      const before = getTile(cell.x, cell.y);
      if (!before.unit && !before.city && !before.building) continue;
      applyDamage(unit, cell.x, cell.y, false, {
        noBacklash: true,
        dmgScale: def.splashFull || cell.center ? 1 : 0.5,
        mode: "ground",
      });
      hits += 1;
    }
    log(`${def.name} ${flying ? "对地轰炸" : "炮击"} (${x},${y})${hits ? `，命中 ${hits} 处` : ""}。`, unit.owner === localOwner() ? "me" : "foe");
    if (!hits) toast("落点附近没有单位、城市或建筑");
    if (unit.attacksLeft <= 0 || unit.hp <= 0) {
      game.ranged = false;
      game.airAtk = false;
    }
    renderInspect();
    updatePills();
    checkVictory();
    tutEmit("ranged", { unit, x, y, splash: true, hits, mode: atkMode });
    notifyStateChanged();
    return;
  }
  const tile = getTile(x, y);
  if (atkMode === "air") {
    const airs = flyingAirAt(x, y).filter((u) => u.id !== unit.id);
    if (!airs.length) {
      const parkedHere = airUnitsAt(x, y).some((u) => u.parked && u.id !== unit.id);
      return toast(parkedHere ? "停场中的空军无法被攻击" : "该格没有空军单位");
    }
    if (!canShootAir(unit)) return toast("该单位无法攻击空军");
    if (!flying) {
      const foe = airs.find((u) => u.owner !== unit.owner);
      if (!foe) return toast("不能攻击友军");
    }
  } else {
    if (!tile.unit && !tile.city && !tile.building) return toast("没有可攻击目标");
    if (!flying) {
      if ((tile.unit && tile.unit.owner === unit.owner) || (!tile.unit && tile.city && tile.city.owner === unit.owner)
        || (!tile.unit && !tile.city && tile.building && tile.building.owner === unit.owner)) {
        toast("不能攻击友军");
        return;
      }
    }
  }
  markAct(unit, false);
  spendAttack(unit);
  const res = applyDamage(unit, x, y, false, { mode: atkMode, noBacklash: flying });
  log(`${def.name} ${atkMode === "air" ? "对空打击" : flying ? "对地打击" : "远程打击"} (${x},${y})。`, unit.owner === localOwner() ? "me" : "foe");
  if (unit.attacksLeft <= 0 || res.attackerDead) {
    game.ranged = false;
    game.airAtk = false;
  }
  renderInspect();
  updatePills();
  checkVictory();
  tutEmit("ranged", { unit, x, y, splash: false, mode: atkMode });
  notifyStateChanged();
}

function cancelMode() {
  game.pendingBuy = null;
  game.ranged = false;
  game.airAtk = false;
  game.tunnelPick = false;
  renderShop();
  renderInspect();
  updatePills();
}

async function finishRoundToBlue() {
  if (awardHoldScore()) return; // ended by points
  if (checkTurnLimit()) return;
  game.turn += 1;
  game.phase = "player";
  log(`—— 第 ${game.turn} 回合 ——`, "sys");
  grantCityIncome();
  beginTurn("player");
  maybeAutoSave();
}

function prepareRedTurn() {
  game.phase = "ai";
  game.pendingBuy = null;
  game.selected = null;
  game.ranged = false;
  game.airAtk = false;
  game.tunnelPick = false;
  if (game.turn >= 1) beginTurn("ai");
  else {
    renderShop();
    renderInspect();
    updatePills();
  }
}

async function endPlayerTurn() {
  if (!game || game.over || game.busy || game.editor) return;
  if (!canLocalAct()) return;
  if (tutBlocked("endTurn")) return tutBlockToast();
  const who = actingOwner();
  cancelMode();
  game.selected = null;
  settleIdle(who);
  if (game.tutorial) {
    game.busy = true;
    updatePills();
    renderInspect();
    await sleep(220);
    if (!game || game.over) return;
    game.turn += 1;
    game.phase = "player";
    game.busy = false;
    log(`—— 第 ${game.turn} 回合 ——`, "sys");
    grantCityIncome();
    beginTurn("player");
    tutEmit("endTurn");
    return;
  }
  if (game.mode === "hotseat") {
    game.busy = true;
    updatePills();
    renderInspect();
    if (who === "player") {
      await showHandover("ai");
      if (!game || game.over) return;
      prepareRedTurn();
      focusOwnerCities("ai");
      game.busy = false;
      updatePills();
      return;
    }
    await showHandover("player");
    if (!game || game.over) return;
    finishRoundToBlue();
    focusOwnerCities("player");
    game.busy = false;
    updatePills();
    return;
  }
  if (game.mode === "online") {
    game.busy = true;
    if (who === "player") {
      prepareRedTurn();
      game.busy = false;
      await netPush(true);
      updatePills();
      renderInspect();
      toast("等待红方行动…");
      return;
    }
    finishRoundToBlue();
    game.busy = false;
    await netPush(true);
    updatePills();
    renderInspect();
    toast("等待蓝方行动…");
    return;
  }
  game.busy = true;
  updatePills();
  renderInspect();
  if (who === "player") {
    if (cpuOwner() === "ai") {
      game.phase = "ai";
      if (game.turn >= 1) beginTurn("ai");
      else {
        renderShop();
        renderInspect();
        updatePills();
      }
      await runAI();
      if (!game || game.over) return;
      settleIdle("ai");
      finishRoundToBlue();
    } else {
      prepareRedTurn();
    }
  } else {
    finishRoundToBlue();
    if (!game || game.over) return;
    if (cpuOwner() === "player") {
      await runAI();
      if (!game || game.over) return;
      settleIdle("player");
      prepareRedTurn();
    }
  }
  game.busy = false;
  updatePills();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function enemyCities() {
  return game.cities.filter((c) => c.owner === humanOwner());
}
function myCities() {
  return game.cities.filter((c) => c.owner === cpuOwner());
}
function aiFrontDelta(a, b) {
  const dir = cpuOwner() === "ai" ? -1 : 1;
  const ax = a.x * dir, bx = b.x * dir;
  return game.aiStyle === "conservative" ? ax - bx : bx - ax;
}
function aiFoeEdgeX() {
  return cpuOwner() === "ai" ? 0 : game.w - 1;
}

function nearestOf(unit, list) {
  let best = null, d = Infinity;
  for (const t of list) {
    const dd = manh(unit.x, unit.y, t.x, t.y);
    if (dd < d) {
      d = dd;
      best = t;
    }
  }
  return best;
}

function aiIncomingTo(x, y) {
  let dmg = 0, n = 0;
  if (!game) return { dmg: 0, n: 0 };
  for (const u of game.units) {
    if (u.owner !== humanOwner() || u.hp <= 0 || isAboard(u) || isEscorted(u) || isCivilian(u)) continue;
    if (isAir(u) && u.parked) continue;
    const def = UNITS[u.type];
    if (!def) continue;
    if (def.noMelee && !(def.range > 0)) continue;
    const range = attackRangeOf(u, "ground") || 0;
    const d = cheb(u.x, u.y, x, y);
    if (d <= 0) continue;
    let hit = 0;
    if (range > 0 && d <= range && (isAir(u) || !shotBlocked(u, "ground", x, y))) hit = 1;
    else if (!def.noMelee && !isAir(u) && d === 1) hit = 1;
    else if (!def.noMelee && !isAir(u) && (def.move || 0) > 0 && d <= (def.move || 0) + 1) hit = 0.45;
    if (!hit) continue;
    const raw = damageOf(u, { city: cityAt(x, y), unit: groundUnitAt(x, y) }, "ground") || 1;
    dmg += raw * hit;
    n += 1;
  }
  return { dmg, n };
}

function threatOn(city) {
  if (!city) return false;
  const inc = aiIncomingTo(city.x, city.y);
  if (inc.n >= 2) return true;
  if (inc.n >= 1 && (inc.dmg >= 2 || city.hp <= city.maxHp * 0.75)) return true;
  return false;
}

function aiLostCities() {
  const lost = (game.lostCities && game.lostCities[cpuOwner()]) || [];
  return enemyCities().filter((c) => lost.some((p) => p.x === c.x && p.y === c.y));
}

function cityGarrisonStrength(city) {
  if (!city) return 0;
  let s = city.hp * 0.7;
  const g = groundUnitAt(city.x, city.y);
  if (g && g.owner === city.owner) s += UNITS[g.type].cost / 40 + g.hp * 1.2;
  for (const u of game.units) {
    if (u.owner !== city.owner || isAir(u)) continue;
    const d = manh(u.x, u.y, city.x, city.y);
    if (d > 0 && d <= 4) s += (UNITS[u.type].cost / 90 + u.hp * 0.35) / d;
  }
  return s;
}

function weakEnemyCities() {
  return aiCapturableCities().slice().sort((a, b) => {
    const da = cityGarrisonStrength(a);
    const db = cityGarrisonStrength(b);
    if (da !== db) return da - db;
    return a.hp - b.hp;
  });
}

function isWeakCity(city, cutoff) {
  return cityGarrisonStrength(city) < (cutoff != null ? cutoff : 14);
}

function campaignCity() {
  const m = aiMission();
  if (m && (m.kind === "capture" || m.kind === "push" || m.kind === "recap" || m.kind === "land") && m.x != null) {
    const mc = cityAt(m.x, m.y);
    if (mc && mc.owner !== cpuOwner() && !cityUncapturable(mc)) return mc;
  }
  if (!game || !game.aiCampaign) return null;
  const c = cityAt(game.aiCampaign.x, game.aiCampaign.y);
  return c && c.owner !== cpuOwner() && !cityUncapturable(c) ? c : null;
}

function aiCampaignDefHomes() {
  if (!game || !game.campaign || !game.campaign.defHome) return [];
  const out = [];
  for (const p of game.campaign.defHome) {
    const c = cityAt(p.x, p.y);
    if (c && c.owner !== cpuOwner() && !cityUncapturable(c)) out.push(c);
  }
  return out;
}

function aiCampaignTurnsLeft() {
  if (!game || game.endTurn == null) return 99;
  return Math.max(0, (game.endTurn | 0) - (game.turn | 0));
}

function aiGarrisonKind(typeId) {
  return typeId === "line" || typeId === "elite" || typeId === "at" || typeId === "mg" || typeId === "aa";
}

function aiHeldCapturableCities() {
  return myCities().filter((c) => !cityUncapturable(c));
}

function aiCampaignBehindSchedule() {
  const remain = aiCampaignDefHomes().length;
  if (!remain) return false;
  const left = aiCampaignTurnsLeft();
  return left <= 16 || left < remain * 12;
}

function aiCampaignRemainingHomes() {
  if (!game || !game.campaign || !game.campaign.defHome) return [];
  const owner = game.campaign.defender;
  const out = [];
  for (const p of game.campaign.defHome) {
    const c = cityAt(p.x, p.y);
    if (c && c.owner === owner) out.push(c);
  }
  return out;
}

function aiCampaignRecaptureTargets() {
  if (!game || !game.campaign || game.campaign.defender !== cpuOwner()) return [];
  const atk = game.campaign.attacker;
  const out = [];
  for (const p of game.campaign.defHome || []) {
    const c = cityAt(p.x, p.y);
    if (c && c.owner === atk && !cityUncapturable(c)) out.push(c);
  }
  out.sort((a, b) => cityGarrisonStrength(a) - cityGarrisonStrength(b) || a.hp - b.hp);
  return out;
}

function aiGarrisonTargets() {
  const rush = aiCampaignBehindSchedule();
  return aiHeldCapturableCities().filter((c) => {
    if (cityAboutToFall(c)) return true;
    if (rush) return false;
    return !groundUnitAt(c.x, c.y);
  }).sort((a, b) => {
    const fa = cityAboutToFall(a) ? 0 : 1;
    const fb = cityAboutToFall(b) ? 0 : 1;
    return fa - fb || a.hp - b.hp;
  });
}

function aiShouldStayOnCity(unit) {
  if (!unit || !game) return false;
  if (isAir(unit) || isNavy(unit) || isCivilian(unit) || isAboard(unit)) return false;
  const here = cityAt(unit.x, unit.y);
  if (!here || here.owner !== cpuOwner() || cityUncapturable(here)) return false;
  const falling = cityAboutToFall(here);
  if (falling) return true;
  const occ = groundUnitAt(unit.x, unit.y);
  if (occ && occ.id !== unit.id) return false;
  if (aiEndgame().allin && game.campaign && game.campaign.attacker === cpuOwner()) return false;
  // Layered defense: only true garrison types sit the city; fire/screen leave
  const layer = aiDefensePreferredLayer(unit.type);
  if (layer === "fire" || layer === "screen") {
    if (!(falling || (threatOn(here) && aiGarrisonKind(unit.type)))) return false;
  }
  if (game.campaign && game.campaign.attacker === cpuOwner()) {
    if (!aiGarrisonKind(unit.type)) return false;
    if (aiCampaignBehindSchedule() || aiEndgame().allin) return false;
    return true;
  }
  if (game.campaign && game.campaign.defender === cpuOwner()) {
    const remaining = aiCampaignRemainingHomes();
    const onHome = remaining.some((c) => c.x === here.x && c.y === here.y);
    if (onHome && (aiCampaignTurtle() || remaining.length <= 2)) return layer !== "fire";
    if (aiGarrisonKind(unit.type) && remaining.length <= 2) return true;
    if (onHome && layer === "garrison" && aiDefenseNeedsGarrison(here)) return true;
    return false;
  }
  // Skirmish / consolidate: garrison kinds hold threatened or empty cities
  if (aiDefenseWantsLayers() && layer === "garrison" && aiDefenseNeedsGarrison(here)) return true;
  return false;
}

function aiDefenseWantsLayers() {
  if (!game || game.tutorial) return false;
  if (aiEndgame().allin) return false;
  const doc = aiDoctrine();
  if (doc.campaignDefend) return true;
  if (doc.consolidate || aiEndgame().consolidate) return true;
  if (doc.holdSoon) return true;
  const miss = aiMission();
  if (miss && (miss.kind === "defend" || miss.kind === "hold")) return true;
  if (!doc.campaignAttack && game.aiStyle === "conservative") return true;
  return false;
}

function aiDefensePreferredLayer(typeId) {
  if (typeId === "mortar" || typeId === "siege" || typeId === "spg" || typeId === "at" || typeId === "coast") return "fire";
  if (typeId === "aa" || typeId === "mg") return "garrison";
  if (typeId === "line" || typeId === "elite") return "garrison";
  if (typeId === "ifv" || typeId === "light" || typeId === "heavy" || typeId === "spaa") return "screen";
  if (typeId === "engineer") return "screen";
  return "screen";
}

function aiDefenseHomes() {
  if (game.campaign && game.campaign.defender === cpuOwner()) {
    const rem = aiCampaignRemainingHomes();
    if (rem.length) return rem;
  }
  return myCities().filter((c) => !cityUncapturable(c));
}

function aiDefenseNeedsGarrison(city) {
  if (!city || city.owner !== cpuOwner() || cityUncapturable(city)) return false;
  if (cityAboutToFall(city) || threatOn(city)) return true;
  return !groundUnitAt(city.x, city.y);
}

function aiTileCrowd(x, y) {
  return game.units.filter((u) => u.owner === cpuOwner() && !isAir(u) && !isNavy(u) && !isAboard(u) && !isCivilian(u) && u.x === x && u.y === y).length;
}

function aiTileCap(x, y) {
  const fort = fortressAt(x, y);
  if (fort) return (BUILDINGS.fortress && BUILDINGS.fortress.capacity) || 2;
  if (cityAt(x, y)) return 1;
  return 1;
}

function aiPickOpenTile(unit, list) {
  if (!unit || !list || !list.length) return null;
  let best = null, bd = Infinity;
  for (const t of list) {
    if (!t || !inBounds(t.x, t.y)) continue;
    if (isOceanAt(t.x, t.y) || isPeakAt(t.x, t.y) || isImpassableGround(t.x, t.y)) continue;
    const crowd = aiTileCrowd(t.x, t.y);
    const cap = aiTileCap(t.x, t.y);
    if (crowd >= cap && !(unit.x === t.x && unit.y === t.y)) continue;
    const d = (isNavy(unit) || isAir(unit) ? manh(unit.x, unit.y, t.x, t.y) : aiPathDist(unit.x, unit.y, t.x, t.y)) + crowd * 4;
    if (d < bd) {
      bd = d;
      best = t;
    }
  }
  return best;
}

function aiScreenPosts(anchor) {
  const posts = [];
  const seen = Object.create(null);
  const add = (x, y) => {
    if (!inBounds(x, y) || isOceanAt(x, y) || isPeakAt(x, y) || isImpassableGround(x, y)) return;
    const k = x + "," + y;
    if (seen[k]) return;
    seen[k] = 1;
    posts.push({ x, y });
  };
  for (const f of ownerFortresses(cpuOwner())) add(f.x, f.y);
  const homes = aiDefenseHomes();
  const foeX = typeof aiFoeEdgeX === "function" ? aiFoeEdgeX() : ((game.w / 2) | 0);
  for (const h of homes) {
    const dx = foeX > h.x ? 1 : (foeX < h.x ? -1 : 0);
    for (const dist of [2, 3, 4]) {
      add(h.x + dx * dist, h.y);
      add(h.x + dx * dist, h.y - 1);
      add(h.x + dx * dist, h.y + 1);
    }
  }
  if (anchor) {
    const dx = foeX > anchor.x ? 1 : -1;
    for (const dist of [2, 3]) add(anchor.x + dx * dist, anchor.y);
  }
  return posts;
}

function aiFireSupportTiles(anchor) {
  const posts = [];
  const seen = Object.create(null);
  const add = (x, y) => {
    if (!inBounds(x, y) || isOceanAt(x, y) || isPeakAt(x, y) || isImpassableGround(x, y)) return;
    if (cityAt(x, y)) return; // keep cities for garrison
    const k = x + "," + y;
    if (seen[k]) return;
    seen[k] = 1;
    posts.push({ x, y });
  };
  const screens = aiScreenPosts(anchor);
  const homes = aiDefenseHomes();
  for (const s of screens.slice(0, 8)) {
    const home = homes.length ? nearestOf(s, homes) : null;
    if (!home) continue;
    const dx = Math.sign(home.x - s.x);
    const dy = Math.sign(home.y - s.y);
    for (const back of [1, 2, 3]) {
      add(s.x + dx * back, s.y + dy * back);
      add(s.x + dx * back, s.y);
    }
  }
  for (const c of homes.filter((h) => threatOn(h) || cityAboutToFall(h) || h === anchor)) {
    for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2], [3, 0], [-3, 0], [2, 1], [-2, 1], [1, 2], [-1, 2]]) {
      add(c.x + dx, c.y + dy);
    }
  }
  return posts;
}


function aiUnitCombatPower(u) {
  if (!u || u.hp <= 0) return 0;
  const def = UNITS[u.type];
  if (!def) return 0;
  let p = (def.cost || 0) / 45 + u.hp * 0.85;
  if (def.soldier) p += 1.2;
  if ((def.range || 0) >= 3) p += 2;
  if (u.type === "heavy" || u.type === "elite" || u.type === "siege") p += 2.5;
  return p;
}

/** Visible enemy combat mass near a point (ground + nearby air pressure). */
function aiEnemyPowerNear(x, y, radius) {
  radius = radius != null ? radius : 4;
  if (!game) return { power: 0, n: 0, air: 0 };
  let power = 0, n = 0, air = 0;
  for (const u of game.units) {
    if (u.owner !== humanOwner() || u.hp <= 0 || isAboard(u) || isEscorted(u) || isCivilian(u)) continue;
    if (isAir(u) && u.parked) continue;
    if (!fogCanSeeEnemy(cpuOwner(), u)) continue;
    const d = cheb(u.x, u.y, x, y);
    if (isAir(u)) {
      if (d <= radius + 1) {
        air += 1;
        power += aiUnitCombatPower(u) * 0.55;
      }
      continue;
    }
    if (d > radius) continue;
    const falloff = d <= 1 ? 1 : (d <= 2 ? 0.85 : (d <= 3 ? 0.65 : 0.45));
    power += aiUnitCombatPower(u) * falloff;
    n += 1;
  }
  return { power, n, air };
}

function aiFriendlyPowerNear(x, y, radius) {
  radius = radius != null ? radius : 4;
  if (!game) return { power: 0, n: 0 };
  let power = 0, n = 0;
  for (const u of game.units) {
    if (u.owner !== cpuOwner() || u.hp <= 0) continue;
    if (isAir(u) || isNavy(u) || isCivilian(u) || isAboard(u)) continue;
    const d = cheb(u.x, u.y, x, y);
    if (d > radius) continue;
    const falloff = d <= 1 ? 1 : (d <= 2 ? 0.9 : 0.7);
    power += aiUnitCombatPower(u) * falloff;
    n += 1;
  }
  return { power, n };
}

/**
 * Detect a crisis: enemy mass near AI cities / front contact / pressured units.
 * Cached per turn+owner on game._aiCrisis.
 */
function aiFindCrisis() {
  if (!game || game.tutorial) return null;
  const cache = game._aiCrisis;
  if (cache && cache.turn === (game.turn | 0) && cache.who === cpuOwner()) return cache.hit || null;

  const candidates = [];
  const seen = Object.create(null);
  const pushCand = (x, y, kind, city) => {
    if (!inBounds(x, y)) return;
    const k = x + "," + y;
    if (seen[k]) return;
    seen[k] = 1;
    candidates.push({ x, y, kind, city: city || null });
  };

  for (const c of myCities()) {
    if (cityUncapturable(c)) continue;
    pushCand(c.x, c.y, "city", c);
  }
  for (const f of ownerFortresses(cpuOwner())) pushCand(f.x, f.y, "fort", null);

  // Contact / pressure hexes from friendly ground under enemy threat
  for (const u of game.units) {
    if (u.owner !== cpuOwner() || u.hp <= 0) continue;
    if (isAir(u) || isNavy(u) || isCivilian(u) || isAboard(u)) continue;
    const thr = aiTileThreat(cpuOwner(), u.x, u.y);
    if (thr < 6) continue;
    pushCand(u.x, u.y, "contact", cityAt(u.x, u.y));
  }

  const miss = aiMission();
  if (miss && miss.x != null && (miss.kind === "defend" || miss.kind === "hold")) {
    pushCand(miss.x, miss.y, "mission", cityAt(miss.x, miss.y));
  }

  let best = null;
  for (const c of candidates) {
    const foe = aiEnemyPowerNear(c.x, c.y, 4);
    if (foe.n < 2 && foe.power < 9) continue;
    const fri = aiFriendlyPowerNear(c.x, c.y, 4);
    const city = c.city || cityAt(c.x, c.y);
    const onHome = !!(city && city.owner === cpuOwner() && !cityUncapturable(city));
    const falling = onHome && cityAboutToFall(city);
    const threatened = onHome && threatOn(city);
    const ratio = fri.power > 0.5 ? foe.power / fri.power : foe.power;
    let severity = 0;
    if (foe.n >= 4 || foe.power >= 22) severity = 3;
    else if (foe.n >= 3 || foe.power >= 14 || ratio >= 1.7) severity = 2;
    else if (foe.n >= 2 || foe.power >= 9 || ratio >= 1.35) severity = 1;
    if (falling) severity = Math.max(severity, 3);
    else if (threatened) severity = Math.max(severity, 2);
    if (foe.air >= 2) severity = Math.max(severity, Math.min(3, severity + 1));
    // Quiet front parking: need clear mass advantage to count as crisis
    if (!onHome && severity < 2 && ratio < 1.5) continue;
    if (severity < 1) continue;
    // Prefer crises on/near homes over pure contact
    const homeBias = onHome ? 4 : (c.kind === "fort" ? 2 : 0);
    const score = severity * 20 + foe.power + ratio * 4 + homeBias + (falling ? 12 : 0) + (threatened ? 6 : 0) - fri.power * 0.35;
    if (!best || score > best.score) {
      best = {
        x: c.x, y: c.y, kind: c.kind, city, onHome, falling, threatened,
        severity, foeN: foe.n, foePower: foe.power, friN: fri.n, friPower: fri.power,
        ratio, score, air: foe.air,
      };
    }
  }

  // Require meaningful crisis (not every 2-unit skirmish)
  const hit = best && best.severity >= 2 ? best : null;
  game._aiCrisis = { turn: game.turn | 0, who: cpuOwner(), hit };
  return hit;
}

function aiCrisisStaging(crisis) {
  if (!crisis) return null;
  const city = crisis.city || cityAt(crisis.x, crisis.y);
  if (city && city.owner === cpuOwner()) {
    const g = groundUnitAt(city.x, city.y);
    if (!g || g.owner === cpuOwner()) return { x: city.x, y: city.y };
  }
  const ring = [];
  const foeX = typeof aiFoeEdgeX === "function" ? aiFoeEdgeX() : ((game.w / 2) | 0);
  const back = foeX > crisis.x ? -1 : 1;
  for (const [dx, dy] of [[0, 0], [back, 0], [back, 1], [back, -1], [0, 1], [0, -1], [back * 2, 0], [1, 0], [-1, 0]]) {
    ring.push({ x: crisis.x + dx, y: crisis.y + dy });
  }
  // Prefer open tiles a step toward home / away from foe edge
  const dummy = { x: crisis.x, y: crisis.y, type: "line", owner: cpuOwner(), id: -1 };
  const pick = aiPickOpenTile(dummy, ring);
  return pick || { x: crisis.x, y: crisis.y };
}

/** True if this unit is the last useful garrison on a non-crisis home that still needs holding. */
function aiIsEssentialLocalGarrison(unit, crisis) {
  if (!unit || aiShouldStayOnCity(unit)) return true;
  const here = cityAt(unit.x, unit.y);
  if (!here || here.owner !== cpuOwner() || cityUncapturable(here)) return false;
  if (crisis && crisis.onHome && crisis.city && crisis.city.x === here.x && crisis.city.y === here.y) return false;
  if (!(threatOn(here) || cityAboutToFall(here) || aiDefenseNeedsGarrison(here))) return false;
  // Another garrison type already covers this city
  const others = game.units.filter((u) => u.owner === cpuOwner() && u.id !== unit.id && u.hp > 0
    && !isAir(u) && !isNavy(u) && !isCivilian(u) && !isAboard(u)
    && manh(u.x, u.y, here.x, here.y) <= 2 && aiGarrisonKind(u.type));
  if (others.length) return false;
  // Local threat comparable to crisis — stay
  if (crisis) {
    const local = aiEnemyPowerNear(here.x, here.y, 3);
    if (local.power >= crisis.foePower * 0.75 && local.n >= 2) return true;
  }
  return aiGarrisonKind(unit.type) && (threatOn(here) || cityAboutToFall(here));
}

function aiHomesSpareForCrisis(crisis) {
  const homes = aiDefenseHomes();
  if (!homes.length) return true;
  // Never strip every home when crisis is not on a home
  const criticalEmpty = homes.filter((c) => {
    if (crisis && crisis.city && c.x === crisis.city.x && c.y === crisis.city.y) return false;
    return !groundUnitAt(c.x, c.y) && (threatOn(c) || cityAboutToFall(c));
  });
  if (criticalEmpty.length) return false;
  const covered = homes.filter((c) => groundUnitAt(c.x, c.y) || (crisis && crisis.city && c.x === crisis.city.x && c.y === crisis.city.y)).length;
  return covered >= Math.max(1, Math.ceil(homes.length * 0.5));
}

/**
 * Spare rear / other-front units march to reinforce a crisis mass.
 * Returns staging goal or null.
 */
function aiReinforceCrisisGoal(unit) {
  if (!unit || !game || game.tutorial) return null;
  if (isAir(unit) || isNavy(unit) || isCivilian(unit) || isAboard(unit)) return null;
  if (unit.escorting) return null;
  const crisis = aiFindCrisis();
  if (!crisis || crisis.severity < 2) return null;
  if (aiIsEssentialLocalGarrison(unit, crisis)) return null;
  if (!aiHomesSpareForCrisis(crisis)) return null;

  const dist = isAir(unit) || isNavy(unit)
    ? manh(unit.x, unit.y, crisis.x, crisis.y)
    : aiPathDist(unit.x, unit.y, crisis.x, crisis.y);
  if (dist >= 800) return null;
  // Already in/near the fight — let normal goals handle
  if (dist <= 3) return null;

  // Don't abandon a closer threat of similar severity
  const localFoe = aiEnemyPowerNear(unit.x, unit.y, 3);
  if (localFoe.n >= 2 && localFoe.power >= crisis.foePower * 0.85 && dist > 6) return null;

  // Prefer mobile screen / assault types; allow garrison kinds only when far and spare
  const layer = aiDefensePreferredLayer(unit.type);
  if (layer === "garrison" && dist > 14 && crisis.severity < 3 && !crisis.falling) return null;

  // Campaign attacker: only peel for home crises (don't abort the push for contact elsewhere)
  const doc = aiDoctrine();
  if (doc.campaignAttack && !crisis.onHome && crisis.severity < 3) return null;
  if (doc.allin && !crisis.onHome && !crisis.falling) return null;

  const stage = aiCrisisStaging(crisis);
  return stage || { x: crisis.x, y: crisis.y };
}

function aiDefenseSpareForRecap() {
  const homes = aiDefenseHomes();
  if (!homes.length) return true;
  const criticalEmpty = homes.filter((c) => !groundUnitAt(c.x, c.y) && (threatOn(c) || cityAboutToFall(c)));
  if (criticalEmpty.length) return false;
  const covered = homes.filter((c) => groundUnitAt(c.x, c.y)).length;
  return covered >= Math.max(1, homes.length - 1);
}

function aiWeakRecaptureTargets() {
  const out = [];
  const seen = Object.create(null);
  const add = (c) => {
    if (!c || cityUncapturable(c)) return;
    const k = c.x + "," + c.y;
    if (seen[k]) return;
    if (!(isWeakCity(c, 18) || c.hp <= 4 || !groundUnitAt(c.x, c.y))) return;
    seen[k] = 1;
    out.push(c);
  };
  for (const c of aiCampaignRecaptureTargets()) add(c);
  for (const c of aiLostCities()) add(c);
  out.sort((a, b) => cityGarrisonStrength(a) - cityGarrisonStrength(b) || a.hp - b.hp);
  return out;
}

/** Front screen / second-line fire / city garrison — avoid piling one choke. */
function aiDefenseGoal(unit, miss) {
  if (!unit || isAir(unit) || isNavy(unit) || isCivilian(unit) || isAboard(unit)) return null;
  if (!aiDefenseWantsLayers()) return null;
  const anchor = (miss && miss.x != null) ? { x: miss.x, y: miss.y } : (aiDefenseHomes()[0] || null);
  const layer = aiDefensePreferredLayer(unit.type);
  const homes = aiDefenseHomes();

  // Peel spare units from quiet sectors toward enemy mass / threatened home
  const reinforce = aiReinforceCrisisGoal(unit);
  if (reinforce) return reinforce;

  // Mobile wave: retake empty/weak lost homes when spare
  if ((layer === "screen" || unit.type === "line" || unit.type === "elite" || unit.type === "ifv" || unit.type === "light")
    && aiDefenseSpareForRecap() && !(aiEndgame().consolidate && aiCampaignTurtle())) {
    const steal = aiWeakRecaptureTargets();
    if (steal.length) {
      const t = nearestOfPath(unit, steal);
      if (t && aiPathDist(unit.x, unit.y, t.x, t.y) <= 18) return t;
    }
  }

  const need = homes.filter((c) => aiDefenseNeedsGarrison(c)).sort((a, b) => {
    const pa = cityAboutToFall(a) ? 0 : threatOn(a) ? 1 : 2;
    const pb = cityAboutToFall(b) ? 0 : threatOn(b) ? 1 : 2;
    return pa - pb || aiPathDist(unit.x, unit.y, a.x, a.y) - aiPathDist(unit.x, unit.y, b.x, b.y);
  });

  if (layer === "garrison" || (need.length && (unit.type === "line" || unit.type === "elite" || unit.type === "mg" || unit.type === "aa"))) {
    for (const c of need) {
      const g = groundUnitAt(c.x, c.y);
      if (!g || g.id === unit.id || cityAboutToFall(c) || threatOn(c)) {
        if (aiTileCrowd(c.x, c.y) < aiTileCap(c.x, c.y) || (unit.x === c.x && unit.y === c.y)) return c;
      }
    }
    // cities full: overflow garrison types to screen, not pile
    if (layer === "garrison") {
      const openHome = homes.filter((c) => aiTileCrowd(c.x, c.y) < aiTileCap(c.x, c.y));
      const pick = aiPickOpenTile(unit, openHome);
      if (pick && (threatOn(pick) || cityAboutToFall(pick) || !groundUnitAt(pick.x, pick.y))) return pick;
    }
  }

  if (layer === "fire") {
    const fire = aiPickOpenTile(unit, aiFireSupportTiles(anchor));
    if (fire) return fire;
    // fallback: stand off threatened city
    if (need.length) {
      const c = need[0];
      const ring = [];
      for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2], [3, 0], [-3, 0]]) {
        ring.push({ x: c.x + dx, y: c.y + dy });
      }
      const p = aiPickOpenTile(unit, ring);
      if (p) return p;
    }
  }

  // screen / default front
  const screens = aiScreenPosts(anchor);
  const front = aiPickOpenTile(unit, screens);
  if (front) return front;
  if (homes.length) return aiPickOpenTile(unit, homes) || nearestOfPath(unit, homes);
  return anchor;
}

function aiCampaignTurtle() {
  if (!game || !game.campaign || game.campaign.defender !== cpuOwner()) return false;
  if (campaignDefHeldCount() <= 0) return false;
  const left = aiCampaignTurnsLeft();
  if (left <= 10) return true;
  if (campaignDefHeldCount() <= 2 && left <= 18) return true;
  return false;
}

function aiTurnsLeft() {
  if (!game || game.endTurn == null) return 99;
  return Math.max(0, (game.endTurn | 0) - (game.turn | 0));
}

/** Turns until the next hold scoring (0 = score fires when this round finishes). */
function aiHoldTurnsToScore() {
  if (!game || !game.hold) return 99;
  const t = game.turn | 0;
  if (t < 10) return Math.max(0, 10 - t);
  return (10 - (t % 10)) % 10;
}

function aiHoldScores() {
  const hs = game.holdScore || { player: 0, ai: 0 };
  const meKey = cpuOwner() === "player" ? "player" : "ai";
  const foeKey = meKey === "player" ? "ai" : "player";
  return { me: hs[meKey] || 0, foe: hs[foeKey] || 0, target: game.holdTarget | 0 };
}

/**
 * Endgame / clock doctrine:
 * - allin: few turns left → gamble for cities
 * - consolidate: enough lead / points → dig in
 * - holdPark: 2–3 turns before hold score → sit cities (and steal if behind)
 */
function aiEndgame() {
  if (!game || game.tutorial) {
    return { mode: "idle", label: "", allin: false, consolidate: false, holdPark: false, left: 99 };
  }
  const left = aiTurnsLeft();
  const diff = aiDiff();
  const out = {
    mode: "idle",
    label: "",
    allin: false,
    consolidate: false,
    holdPark: false,
    left,
  };

  if (game.hold) {
    const toScore = aiHoldTurnsToScore();
    const sc = aiHoldScores();
    const myCities = cityCount(cpuOwner());
    const foeCities = cityCount(humanOwner());
    const projMe = sc.me + myCities;
    const projFoe = sc.foe + foeCities;
    if (toScore <= 3) {
      out.holdPark = true;
      out.mode = "holdPark";
      out.label = toScore === 0 ? "据点结算占城" : ("据点倒计时" + toScore);
      if (projMe >= sc.target && projMe > projFoe) {
        out.consolidate = true;
        out.label = "据点锁定胜势";
      } else if (sc.me >= sc.target) {
        out.consolidate = true;
        out.label = "据点够分巩固";
      }
    } else if (sc.me >= sc.target) {
      out.consolidate = true;
      out.mode = "consolidate";
      out.label = "据点够分巩固";
    } else if (sc.me > sc.foe && left <= 14 && projMe >= projFoe + 2) {
      out.consolidate = true;
      out.mode = "consolidate";
      out.label = "据点领先巩固";
    }
  }

  if (game.campaign && game.campaign.attacker === cpuOwner()) {
    if (aiCampaignBehindSchedule() || left <= diff.allinLeft || (diff.allinBoost && left <= diff.allinLeft + 6)) {
      out.allin = true;
      out.consolidate = false;
      out.holdPark = false;
      out.mode = "allin";
      out.label = left <= Math.max(5, (diff.allinLeft / 2) | 0) ? "限时豪赌破城" : "日程赶工破城";
    } else if (campaignTakenCount() >= 2 && left > 18 && !out.holdPark) {
      out.consolidate = true;
      if (out.mode === "idle") {
        out.mode = "consolidate";
        out.label = "占城巩固";
      }
    }
  } else if (game.campaign && game.campaign.defender === cpuOwner()) {
    if (aiCampaignTurtle()) {
      out.consolidate = true;
      out.allin = false;
      out.mode = "consolidate";
      out.label = "限时死守";
    }
  } else if (!(game.hold && out.holdPark)) {
    const mine = cityCount(cpuOwner());
    const theirs = cityCount(humanOwner());
    const pressure = diff.allinLeft + (diff.allinBoost ? 4 : 0);
    if (left <= pressure && mine < theirs) {
      out.allin = true;
      out.mode = "allin";
      out.label = "限时追分破城";
    } else if (left <= pressure && mine > theirs) {
      out.consolidate = true;
      out.mode = "consolidate";
      out.label = "限时护城";
    } else if (left <= Math.max(5, (diff.allinLeft / 2) | 0)) {
      if (mine <= theirs) {
        out.allin = true;
        out.mode = "allin";
        out.label = "终局豪赌";
      } else {
        out.consolidate = true;
        out.mode = "consolidate";
        out.label = "终局护城";
      }
    }
  }

  if (out.holdPark && game.hold) {
    out.allin = false;
    if (!out.mode || out.mode === "idle" || out.mode === "allin") out.mode = out.consolidate ? "consolidate" : "holdPark";
  }
  if (out.allin && diff.id === "easy" && left > 6 && !aiCampaignBehindSchedule()) {
    // Simple: less eager to all-in unless truly late
    out.allin = false;
    out.mode = out.consolidate ? "consolidate" : "idle";
    if (!out.consolidate) out.label = "";
  }
  return out;
}

function aiResetPathCache() {
  if (game) {
    game._aiPath = null;
    game._aiLand = null;
    game._aiNavalPipe = null;
  }
}

function aiPathDist(ax, ay, bx, by) {
  if (ax === bx && ay === by) return 0;
  if (!game) return manh(ax, ay, bx, by);
  if (!game._aiPath || game._aiPath.turn !== game.turn || game._aiPath.who !== cpuOwner()) {
    game._aiPath = { turn: game.turn, who: cpuOwner(), dest: Object.create(null) };
  }
  const key = bx + "," + by;
  let dist = game._aiPath.dest[key];
  if (!dist) {
    dist = aiGroundFlood([{ x: bx, y: by }]);
    game._aiPath.dest[key] = dist;
  }
  const d = dist[ax + ay * game.w];
  return d >= 0 ? d : 800 + manh(ax, ay, bx, by);
}

function nearestOfPath(unit, list) {
  if (!unit || !list || !list.length) return null;
  const navy = isNavy(unit);
  const flying = isAir(unit);
  let best = null, d = Infinity;
  for (const t of list) {
    const dd = flying || navy ? manh(unit.x, unit.y, t.x, t.y) : aiPathDist(unit.x, unit.y, t.x, t.y);
    if (dd < d) {
      d = dd;
      best = t;
    }
  }
  return best;
}

function aiUnreachableFrom(ax, ay, bx, by) {
  return aiPathDist(ax, ay, bx, by) >= 800;
}

function aiCityUnreachableFromHomes(city) {
  if (!city) return false;
  const homes = myCities();
  if (!homes.length) return true;
  return homes.every((h) => aiUnreachableFrom(h.x, h.y, city.x, city.y));
}

function aiFocusCity() {
  const camp = campaignCity();
  const homes = aiCampaignDefHomes();
  const ready = homes.filter((c) => c.hp <= 4).sort((a, b) => a.hp - b.hp);
  if (ready.length) return ready[0];
  if (camp && camp.hp <= 6) return camp;
  return camp || homes[0] || null;
}

function aiLandingTarget() {
  if (!game || !game.withOcean) return null;
  if (game._aiLand && game._aiLand.turn === game.turn && game._aiLand.who === cpuOwner()) return game._aiLand.dest;
  const pool = [];
  const camp = campaignCity();
  if (camp) pool.push(camp);
  const extra = aiCampaignDefHomes().length ? aiCampaignDefHomes() : aiCapturableCities();
  for (const c of extra) {
    if (!pool.some((p) => p.x === c.x && p.y === c.y)) pool.push(c);
  }
  let best = null, bd = Infinity;
  for (const c of pool) {
    if (!aiCityUnreachableFromHomes(c)) continue;
    const beach = cityTouchesOcean(c) ? c : aiBeachNear(c);
    if (!beach) continue;
    const homes = myCities();
    const d = homes.length ? manh(homes[0].x, homes[0].y, beach.x, beach.y) : 99;
    if (d < bd) {
      bd = d;
      best = cityTouchesOcean(c) ? c : beach;
    }
  }
  game._aiLand = { turn: game.turn, who: cpuOwner(), dest: best };
  return best;
}

function aiBeachNear(city) {
  if (!city || !game) return null;
  let best = null, bd = 99;
  for (let y = 0; y < game.h; y++) {
    for (let x = 0; x < game.w; x++) {
      if (!isOceanAt(x, y)) continue;
      let land = false;
      for (const [dx, dy] of DIRS4) {
        const nx = x + dx, ny = y + dy;
        if (inBounds(nx, ny) && !isOceanAt(nx, ny) && !isPeakAt(nx, ny)) land = true;
      }
      if (!land) continue;
      const d = manh(x, y, city.x, city.y);
      if (d < bd) {
        bd = d;
        best = { x, y };
      }
    }
  }
  return best;
}

function aiWantLanding(unit) {
  if (!unit || !game || !game.withOcean) return false;
  if (isAir(unit) || isNavy(unit) || isCivilian(unit) || isAboard(unit)) return false;
  const dest = aiLandingTarget();
  if (!dest) return false;
  const city = cityAt(dest.x, dest.y) || dest;
  return aiUnreachableFrom(unit.x, unit.y, city.x, city.y);
}

function aiMayBoard(unit) {
  if (!unit || !aiWantLanding(unit)) return false;
  if (aiShouldStayOnCity(unit)) return false;
  const here = cityAt(unit.x, unit.y);
  if (here && here.owner === cpuOwner() && !cityUncapturable(here) && aiGarrisonKind(unit.type) && !aiCampaignBehindSchedule()) {
    return false;
  }
  return true;
}

function aiApproachShipTile(unit, ship) {
  if (!unit || !ship) return null;
  let best = null, bd = Infinity;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const x = ship.x + dx, y = ship.y + dy;
      if (!inBounds(x, y) || isOceanAt(x, y) || isImpassableGround(x, y)) continue;
      const d = aiPathDist(unit.x, unit.y, x, y);
      if (d < bd) {
        bd = d;
        best = { x, y };
      }
    }
  }
  return best;
}

function aiShipHasRoom(ship, unit) {
  if (!ship || !unit || ship.type !== "transport") return false;
  const dist = cheb(ship.x, ship.y, unit.x, unit.y);
  if (dist <= 1) return !canBoardTransport(ship, unit);
  const ox = unit.x, oy = unit.y;
  unit.x = ship.x;
  unit.y = ship.y;
  const err = canBoardTransport(ship, unit);
  unit.x = ox;
  unit.y = oy;
  return !err;
}

function aiBestPickupShip(unit) {
  let best = null, bd = Infinity;
  for (const ship of game.units) {
    if (ship.owner !== cpuOwner() || ship.type !== "transport" || ship.hp <= 0) continue;
    if (!aiShipHasRoom(ship, unit)) continue;
    const tile = aiApproachShipTile(unit, ship);
    const d = tile ? aiPathDist(unit.x, unit.y, tile.x, tile.y) : manh(unit.x, unit.y, ship.x, ship.y) + 20;
    if (d < bd) {
      bd = d;
      best = ship;
    }
  }
  return best;
}

function aiNavyStandNear(x, y) {
  let best = null, bd = Infinity;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const nx = x + dx, ny = y + dy;
      if (!navyCanStand(nx, ny)) continue;
      const c = cityAt(nx, ny);
      if (c && c.owner !== cpuOwner()) continue;
      const d = Math.abs(dx) + Math.abs(dy);
      if (d < bd) {
        bd = d;
        best = { x: nx, y: ny };
      }
    }
  }
  return best;
}

function aiTransportPickupGoal(ship) {
  const pipe = aiNavalPipe();
  if (pipe.phase === "sail" || pipe.phase === "beach") {
    // Empty hulls still ferry a second wave if waiters remain
  }
  const waiters = game.units.filter((u) => u.owner === cpuOwner() && aiMayBoard(u) && !isAboard(u));
  if (waiters.length) {
    const u = nearestOf(ship, waiters);
    return aiNavyStandNear(u.x, u.y) || { x: u.x, y: u.y };
  }
  if (pipe.phase === "assault" || pipe.phase === "idle") {
    const coasts = myCities().filter((c) => cityTouchesOcean(c));
    if (coasts.length) return nearestOf(ship, coasts);
  }
  const coasts = myCities().filter((c) => cityTouchesOcean(c));
  if (coasts.length) return nearestOf(ship, coasts);
  return pipe.beach || null;
}

function aiMusterCoast(unit) {
  if (!unit || !game) return null;
  const coasts = myCities().filter((c) => cityTouchesOcean(c));
  if (coasts.length) return nearestOfPath(unit, coasts) || coasts[0];
  let best = null, bd = Infinity;
  for (let y = 0; y < game.h; y++) {
    for (let x = 0; x < game.w; x++) {
      if (isOceanAt(x, y) || isImpassableGround(x, y) || isPeakAt(x, y)) continue;
      let ocean = false;
      for (const [dx, dy] of DIRS4) {
        const nx = x + dx, ny = y + dy;
        if (inBounds(nx, ny) && isOceanAt(nx, ny)) ocean = true;
      }
      if (!ocean) continue;
      const d = aiPathDist(unit.x, unit.y, x, y);
      if (d < bd) {
        bd = d;
        best = { x, y };
      }
    }
  }
  return best;
}

function aiNavalBeachStand(dest) {
  if (!dest) return null;
  if (navyCanStand(dest.x, dest.y)) return dest;
  const near = aiNavyStandNear(dest.x, dest.y);
  if (near) return near;
  const city = cityAt(dest.x, dest.y) || dest;
  const beach = aiBeachNear(city);
  if (beach && navyCanStand(beach.x, beach.y)) return beach;
  return beach ? (aiNavyStandNear(beach.x, beach.y) || beach) : null;
}

function aiNavalCargoScore(ship) {
  if (!ship) return 0;
  return cargoPersonnel(ship).length + cargoVehicles(ship).length * 2 + cargoEscorts(ship).length;
}

function aiNavalCargoReady(ship) {
  if (!ship || ship.type !== "transport") return false;
  const n = aiNavalCargoScore(ship);
  if (n <= 0) return false;
  if (n >= 3) return true;
  if (cargoPersonnel(ship).length >= TRANSPORT_SOLDIER_CAP - 1) return true;
  if (cargoVehicles(ship).length >= TRANSPORT_VEHICLE_CAP) return true;
  const nearWait = game.units.some((u) => {
    if (u.owner !== cpuOwner() || !aiMayBoard(u) || isAboard(u)) return false;
    if (!aiShipHasRoom(ship, u)) return false;
    return cheb(ship.x, ship.y, u.x, u.y) <= 3;
  });
  return !nearWait;
}

function aiNavalCanUnload(ship, beach) {
  if (!ship || !transportCargo(ship).length) return false;
  const stand = beach || aiNavalBeachStand(aiLandingTarget());
  if (!stand) return manh(ship.x, ship.y, (aiLandingTarget() || ship).x, (aiLandingTarget() || ship).y) <= 2;
  if (manh(ship.x, ship.y, stand.x, stand.y) > 2) return false;
  const cargo = transportCargo(ship);
  return cargo.some((u) => unloadSpotsAround(ship, u).length > 0);
}

function aiNavalAshoreForce(dest) {
  if (!dest || !game) return [];
  const city = cityAt(dest.x, dest.y) || dest;
  return game.units.filter((u) => {
    if (u.owner !== cpuOwner() || u.hp <= 0) return false;
    if (isAir(u) || isNavy(u) || isCivilian(u) || isAboard(u)) return false;
    if (aiUnreachableFrom(u.x, u.y, city.x, city.y)) return false;
    const homes = myCities();
    const toDest = aiPathDist(u.x, u.y, city.x, city.y);
    const toHome = homes.length ? Math.min(...homes.map((h) => aiPathDist(u.x, u.y, h.x, h.y))) : 99;
    return toDest <= 14 && toDest + 2 <= toHome;
  });
}

function aiNavalPipe() {
  if (!game || !game.withOcean) return { phase: "idle", label: "", dest: null, beach: null };
  const dest = aiLandingTarget();
  if (!dest) {
    const idle = { phase: "idle", label: "", dest: null, beach: null, turn: game.turn, who: cpuOwner() };
    game._aiNavalPipe = idle;
    return idle;
  }
  const beach = aiNavalBeachStand(dest);
  const ships = game.units.filter((u) => u.owner === cpuOwner() && u.type === "transport" && u.hp > 0);
  const waiters = game.units.filter((u) => u.owner === cpuOwner() && aiMayBoard(u) && !isAboard(u));
  const loaded = ships.filter((s) => transportCargo(s).length > 0);
  const readySail = loaded.filter((s) => aiNavalCargoReady(s));
  const atBeach = loaded.filter((s) => aiNavalCanUnload(s, beach));
  const ashore = aiNavalAshoreForce(dest);
  const miss = aiMission();
  const wantLand = !!(miss && miss.kind === "land") || waiters.length > 0 || loaded.length > 0;

  let phase = "idle";
  let label = "";
  if (atBeach.length) {
    phase = "beach";
    label = "滩头卸载";
  } else if (readySail.length || (loaded.length && !waiters.some((u) => loaded.some((s) => cheb(s.x, s.y, u.x, u.y) <= 4 && aiShipHasRoom(s, u))))) {
    phase = "sail";
    label = "护航过海";
  } else if (ships.length && (waiters.length || loaded.length)) {
    phase = "embark";
    label = "装载上船";
  } else if (ashore.length >= 1 && (!waiters.length || ashore.length >= 2)) {
    phase = "assault";
    label = "登陆攻城";
  } else if (wantLand || waiters.length) {
    phase = waiters.length && !ships.length ? "muster" : (waiters.length ? "muster" : "embark");
    label = ships.length ? "集结登船" : "集结等船";
  }

  const out = { phase, label, dest, beach, ships: ships.length, waiters: waiters.length, loaded: loaded.length, ashore: ashore.length, turn: game.turn, who: cpuOwner() };
  game._aiNavalPipe = out;
  return out;
}

function aiAttackCityForUnit(unit) {
  const homes = aiCampaignDefHomes();
  if (!homes.length) return campaignCity();
  const ready = homes.filter((c) => c.hp <= 4 || isWeakCity(c, 12));
  if (ready.length) return nearestOfPath(unit, ready);
  const persist = campaignCity();
  if (persist && persist.hp > 1) {
    const others = homes.filter((c) => c.x !== persist.x || c.y !== persist.y);
    if (others.length >= 1 && !aiCampaignBehindSchedule()) {
      const second = nearestOfPath({ x: persist.x, y: persist.y }, others) || others[0];
      const d1 = aiPathDist(unit.x, unit.y, persist.x, persist.y);
      const d2 = second ? aiPathDist(unit.x, unit.y, second.x, second.y) : 999;
      if (second && d2 + 3 < d1) return second;
      if (second && Math.abs(d1 - d2) <= 10 && (unit.id % 2)) return second;
    }
    return persist;
  }
  return nearestOfPath(unit, homes) || persist;
}

function aiForceCount(typeId) {
  return game.units.filter((u) => u.owner === cpuOwner() && u.type === typeId && u.hp > 0).length;
}

/** Hard per-mode quotas. Buy fills deficits in ORDER before soft scoring. */
function aiRatioTable() {
  const doc = aiDoctrine();
  const miss = aiMission();
  const win = (typeof aiFireWindow === "function") ? aiFireWindow() : { ready: true, aa: [] };
  const airFoe = game.units.filter((u) => u.owner === humanOwner() && isAir(u) && !u.parked).length;
  const aaNear = !!(win.aa && win.aa.length);
  const ocean = !!game.withOcean;
  const land = !!(miss && miss.kind === "land") || doc.map === "strait" || doc.map === "isles";
  const table = Object.create(null);

  // Skirmish baseline
  table.line = 2;
  table.elite = 0;
  table.ifv = 1;
  table.siege = 1;
  table.mortar = 0;
  table.spg = 0;
  table.light = 0;
  table.heavy = 0;
  table.mg = 0;
  table.at = 0;
  table.aa = 0;
  table.spaa = 0;
  table.airport = 0;
  table.atk = 0;
  table.fighter = 0;
  table.lbomber = 0;
  table.hbomber = 0;
  table.transport = 0;
  table.destroyer = 0;
  table.cruiser = 0;
  table.battleship = 0;
  table.engineer = 0;

  if (doc.campaignAttack) {
    table.line = 3;
    table.elite = 2;
    table.ifv = 2;
    table.siege = 2;
    table.mortar = 1;
    table.airport = 1;
    table.light = 1;
    table.hbomber = aaNear && !win.ready ? 0 : 1;
    table.lbomber = aaNear && !win.ready ? 0 : 1;
    table.atk = aaNear ? 1 : 0;
    table.spg = aaNear ? 1 : 0;
    table.aa = airFoe > 0 ? 1 : 0;
    table.fighter = airFoe >= 2 ? 1 : 0;
    if (aiCampaignBehindSchedule()) {
      table.siege = 3;
      table.hbomber = Math.max(table.hbomber, 1);
      table.ifv = 3;
    }
  } else if (doc.campaignDefend) {
    table.line = 4;
    table.elite = 2;
    table.mg = 1;
    table.at = 1;
    table.aa = 1;
    table.airport = 1;
    table.ifv = 1;
    table.siege = aiCampaignTurtle() ? 0 : 1;
    table.heavy = 0;
    table.light = 0;
    table.engineer = 1;
    if (!aiCampaignTurtle() && aiCampaignRecaptureTargets().length) {
      table.ifv = 2;
      table.line = 5;
      table.siege = 1;
    }
  } else {
    // Encounter
    if (game.aiStyle === "aggressive") {
      table.line = 2;
      table.ifv = 2;
      table.siege = 1;
      table.light = 1;
      table.airport = needAirPower() ? 1 : 0;
    } else if (game.aiStyle === "conservative") {
      table.line = 3;
      table.elite = 1;
      table.mg = 1;
      table.at = 1;
      table.aa = airFoe > 0 ? 1 : 0;
      table.ifv = 1;
    } else {
      table.line = 2;
      table.ifv = 1;
      table.siege = 1;
      table.airport = needAirPower() ? 1 : 0;
    }
  }

  if (doc.map === "plains") {
    table.light = Math.max(table.light, 1);
    table.heavy = Math.max(table.heavy, doc.campaignDefend ? 0 : 1);
    table.siege = Math.max(table.siege, 1);
  } else if (doc.map === "woods" || doc.map === "mountains" || doc.map === "rift") {
    table.line = Math.max(table.line, table.line + 1);
    table.siege = Math.max(table.siege, doc.campaignDefend ? table.siege : table.siege + 1);
    table.mortar = Math.max(table.mortar, 1);
    table.ifv = Math.max(table.ifv, 1);
    table.engineer = Math.max(table.engineer, 1);
  }

  if (ocean && land) {
    table.transport = Math.max(table.transport, 1);
    table.destroyer = Math.max(table.destroyer, 1);
    table.cruiser = Math.max(table.cruiser, doc.campaignAttack ? 1 : 0);
    table.line = Math.max(table.line, 3);
  } else if (ocean && (doc.navy > 1.2 || doc.campaignAttack)) {
    table.transport = Math.max(table.transport, doc.map === "strait" || doc.map === "isles" ? 1 : 0);
  }

  if (doc.fog) {
    table.airport = Math.max(table.airport, 1);
    table.fighter = Math.max(table.fighter, 1);
    table.atk = Math.max(table.atk, 1);
  }
  if (doc.holdSoon) {
    table.line = Math.max(table.line, table.line + 1);
    table.ifv = Math.max(table.ifv, table.ifv + 1);
    table.elite = Math.max(table.elite, 1);
  }
  if (doc.allin) {
    table.siege = Math.max(table.siege, 2);
    table.hbomber = Math.max(table.hbomber, 1);
    table.line = Math.max(table.line, 3);
    table.mortar = Math.max(table.mortar, 1);
  }
  if (doc.consolidate && !doc.allin) {
    table.line = Math.max(table.line, 3);
    table.mg = Math.max(table.mg, 1);
    table.aa = Math.max(table.aa, 1);
    table.at = Math.max(table.at, 1);
  }
  if (miss && miss.kind === "defend") {
    table.line = Math.max(table.line, 3);
    table.mg = Math.max(table.mg, 1);
    table.aa = Math.max(table.aa, airFoe > 0 ? 1 : table.aa);
    table.mortar = Math.max(table.mortar, 1);
    table.at = Math.max(table.at, 1);
    table.ifv = Math.max(table.ifv, 1);
  }
  if (doc.campaignDefend && !doc.allin) {
    table.mortar = Math.max(table.mortar, 1);
    table.at = Math.max(table.at, 1);
    table.line = Math.max(table.line, 3);
  }
  if (miss && miss.kind === "capture" && aaNear) {
    table.atk = Math.max(table.atk, 1);
    table.siege = Math.max(table.siege, 2);
    table.hbomber = Math.min(table.hbomber, win.ready ? table.hbomber : 0);
  }
  return table;
}

/** Fill order: core infantry/siege first, then support, air last. */
const AI_RATIO_ORDER = [
  "line", "elite", "siege", "mortar", "ifv", "airport", "transport",
  "atk", "spg", "aa", "spaa", "destroyer", "cruiser", "mg", "at",
  "light", "heavy", "fighter", "hbomber", "lbomber", "engineer", "battleship",
];

function aiCompositionNeed() {
  const table = aiRatioTable();
  const need = [];
  const seen = Object.create(null);
  const push = (id) => {
    if (!id || seen[id]) return;
    if ((table[id] || 0) <= 0) return;
    if (aiForceCount(id) >= table[id]) return;
    seen[id] = 1;
    need.push(id);
  };
  // Mission buy list first (still gated by table mins when possible)
  const miss = aiMission();
  if (miss && miss.buy) {
    for (const id of miss.buy) push(id);
  }
  for (const id of AI_RATIO_ORDER) push(id);
  return need;
}

function aiRatioDeficit(id) {
  const table = aiRatioTable();
  const want = table[id] || 0;
  if (want <= 0) return 0;
  return Math.max(0, want - aiForceCount(id));
}

function aiRatioOver(id) {
  const table = aiRatioTable();
  const want = table[id] || 0;
  const have = aiForceCount(id);
  if (want <= 0) return have; // no quota: soft-cap extras lightly via have
  return Math.max(0, have - want);
}


function cityAboutToFall(city) {
  if (!city || city.owner !== cpuOwner()) return false;
  if (cityUncapturable(city)) return false;
  const g = groundUnitAt(city.x, city.y);
  const hp = city.hp + (g && g.owner === city.owner ? g.hp * 0.5 : 0);
  const inc = aiIncomingTo(city.x, city.y);
  if (inc.n < 1) return false;
  if (inc.dmg >= hp * 0.5) return true;
  if (inc.n >= 2 && city.hp <= 6) return true;
  if (inc.dmg >= 3 && city.hp <= 4) return true;
  return false;
}

function aiTileThreat(owner, x, y) {
  let t = 0;
  for (const u of game.units) {
    if (u.owner === owner || u.hp <= 0 || isAboard(u) || isEscorted(u) || isCivilian(u)) continue;
    if (isAir(u) && u.parked) continue;
    const def = UNITS[u.type];
    if (!def) continue;
    const range = attackRangeOf(u, "ground") || 0;
    const d = cheb(u.x, u.y, x, y);
    if (d <= 1 && !isAir(u) && !def.noMelee) t += 8;
    else if (range > 0 && d <= range && (isAir(u) || !shotBlocked(u, "ground", x, y))) {
      t += isAir(u) ? 3 : (range >= 4 ? 6 : 4);
    } else if (d <= 2 && !isAir(u) && !def.noMelee) t += 2;
  }
  return t;
}

function aiObjectiveBonus(x, y) {
  const camp = campaignCity();
  const miss = aiMissionPoint();
  let s = 0;
  const focus = miss || (camp ? { x: camp.x, y: camp.y } : null);
  if (focus) {
    const d = manh(x, y, focus.x, focus.y);
    const weight = miss && (miss.kind === "defend" || miss.kind === "hold") ? 1.15 : 1;
    if (d === 0) s += 48 * weight;
    else if (d <= 2) s += 24 * weight;
    else if (d <= 5) s += 11 * weight;
    else if (d <= 8) s += 4 * weight;
    else s -= 14;
  }
  const crisis = typeof aiFindCrisis === "function" ? aiFindCrisis() : null;
  if (crisis && crisis.severity >= 2) {
    const d = manh(x, y, crisis.x, crisis.y);
    const w = crisis.severity >= 3 ? 1.25 : 1;
    if (d <= 1) s += 30 * w;
    else if (d <= 3) s += 16 * w;
    else if (d <= 6) s += 7 * w;
  }
  for (const c of myCities()) {
    if (cityUncapturable(c)) continue;
    const d = manh(x, y, c.x, c.y);
    if (cityAboutToFall(c)) {
      if (d <= 2) s += 28;
      else if (d <= 4) s += 12;
    } else if (d <= 2) s += 8;
  }
  return s;
}

function aiGroundFlood(seeds, extraPass) {
  const w = game.w, h = game.h;
  const dist = new Int16Array(w * h);
  dist.fill(-1);
  const q = [];
  const pass = (x, y) => {
    if (!inBounds(x, y) || isOceanAt(x, y)) return false;
    if (extraPass && extraPass.has(x + "," + y)) return true;
    return !isPeakAt(x, y);
  };
  for (const s of seeds) {
    if (!s || !pass(s.x, s.y)) continue;
    const i = s.x + s.y * w;
    if (dist[i] >= 0) continue;
    dist[i] = 0;
    q.push(i);
  }
  for (let qi = 0; qi < q.length; qi++) {
    const p = q[qi];
    const x = p % w, y = (p / w) | 0;
    const d = dist[p];
    for (const [dx, dy] of DIRS4) {
      const nx = x + dx, ny = y + dy;
      if (!pass(nx, ny)) continue;
      const np = nx + ny * w;
      if (dist[np] >= 0) continue;
      dist[np] = d + 1;
      q.push(np);
    }
  }
  return dist;
}

function aiStandBy(x, y) {
  let best = null, bestS = Infinity;
  const homes = myCities();
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const sx = x + dx, sy = y + dy;
      if (!inBounds(sx, sy) || isImpassableGround(sx, sy)) continue;
      const c = cityAt(sx, sy);
      if (c && c.owner !== cpuOwner()) continue;
      const home = homes.length ? Math.min(...homes.map((h) => manh(sx, sy, h.x, h.y))) : 0;
      const score = home + aiTileThreat(cpuOwner(), sx, sy) * 3;
      if (score < bestS) {
        bestS = score;
        best = { x: sx, y: sy };
      }
    }
  }
  return best;
}

function aiPickTargetCity() {
  const persist = campaignCity();
  const doc = aiDoctrine();
  let cities = aiCapturableCities();
  if (doc.campaignDefend) {
    if (aiCampaignTurtle()) return null;
    const recap = aiCampaignRecaptureTargets().filter((c) => isWeakCity(c, 18) || c.hp <= 5);
    if (recap.length) return recap[0];
    if (campaignDefHeldCount() <= 2) return null;
  }
  if (doc.campaignAttack) {
    const homes = aiCampaignDefHomes();
    if (homes.length) cities = homes;
    const ready = homes.filter((c) => c.hp <= 4 || isWeakCity(c, 12));
    if (ready.length) {
      ready.sort((a, b) => a.hp - b.hp || cityGarrisonStrength(a) - cityGarrisonStrength(b));
      return ready[0];
    }
    if (persist && cities.some((c) => c.x === persist.x && c.y === persist.y) && persist.hp > 1) return persist;
  }
  if (!cities.length) return null;
  const mine = game.units.filter((u) => u.owner === cpuOwner() && !isAir(u) && !isCivilian(u) && !isAboard(u));
  let best = null, bestS = -Infinity;
  for (const c of cities) {
    let s = 0;
    s -= cityGarrisonStrength(c) * (doc.campaignAttack ? 0.85 : 1.4);
    s -= c.hp * (doc.campaignAttack ? 1.6 : 3);
    s += mine.filter((u) => aiPathDist(u.x, u.y, c.x, c.y) <= 12).length * (doc.campaignAttack ? 16 : 10);
    s -= game.units.filter((u) => u.owner === humanOwner() && !isAir(u) && manh(u.x, u.y, c.x, c.y) <= 5).length * 4;
    const home = nearestOfPath({ x: c.x, y: c.y }, myCities());
    s -= (home ? aiPathDist(c.x, c.y, home.x, home.y) : 40) * (doc.campaignAttack ? 1.25 : 0.85);
    if (aiLostCities().some((p) => p.x === c.x && p.y === c.y)) s += 30;
    if (isWeakCity(c, 16)) s += 18;
    if (persist && persist.x === c.x && persist.y === c.y) s += doc.campaignAttack ? 80 : 36;
    if (s > bestS) {
      bestS = s;
      best = c;
    }
  }
  return best;
}

function aiPlanTunnels(target) {
  if (!target) return [];
  const seeds = myCities().concat(ownerFortresses(cpuOwner()));
  const extra = new Set();
  const picks = [];
  const doc = aiDoctrine();
  // Only dig when the main route is blocked/long; mountains/rift may need 2
  const want = (doc.map === "mountains" || doc.map === "rift") ? 2 : 1;
  for (let n = 0; n < want; n++) {
    const distA = aiGroundFlood(seeds, extra);
    const distB = aiGroundFlood([target], extra);
    const current = distA[target.x + target.y * game.w];
    // Must unlock unreachable or save ≥8 path; skip if already a short open route
    if (current >= 0 && current <= 10 && n === 0) break;
    let best = null, bestVia = current >= 0 ? current - 8 : 9999;
    for (let y = 0; y < game.h; y++) {
      for (let x = 0; x < game.w; x++) {
        if (!isPeakAt(x, y) || extra.has(x + "," + y)) continue;
        let a = Infinity, b = Infinity, stand = null;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = x + dx, ny = y + dy;
            if (!inBounds(nx, ny) || isOceanAt(nx, ny)) continue;
            const open = extra.has(nx + "," + ny) || !isPeakAt(nx, ny);
            if (!open) continue;
            const i = nx + ny * game.w;
            if (distA[i] >= 0 && distA[i] < a) {
              a = distA[i];
              stand = { x: nx, y: ny };
            }
            if (distB[i] >= 0 && distB[i] < b) b = distB[i];
          }
        }
        if (a === Infinity || b === Infinity || !stand) continue;
        const via = a + 2 + b;
        if (via < bestVia) {
          bestVia = via;
          best = { x, y, stand, via };
        }
      }
    }
    if (!best) break;
    picks.push(best);
    extra.add(best.x + "," + best.y);
  }
  return picks;
}

function aiPlanFortress(target) {
  if (!target) return null;
  const existing = ownerFortresses(cpuOwner());
  if (existing.some((f) => manh(f.x, f.y, target.x, target.y) <= 6)) return null;
  const r = cityControlRadius();
  let best = null, bestS = 8;
  const x0 = Math.max(0, Math.min(...myCities().map((c) => c.x), target.x) - 2);
  const x1 = Math.min(game.w - 1, Math.max(...myCities().map((c) => c.x), target.x) + 2);
  const y0 = Math.max(0, Math.min(...myCities().map((c) => c.y), target.y) - 4);
  const y1 = Math.min(game.h - 1, Math.max(...myCities().map((c) => c.y), target.y) + 4);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (isPeakAt(x, y) || isOceanAt(x, y) || isTunnelAt(x, y)) continue;
      if (cityAt(x, y) || buildingAt(x, y)) continue;
      const dT = manh(x, y, target.x, target.y);
      if (dT < 3 || dT > 10) continue;
      const home = nearestOf({ x, y }, myCities());
      const dHome = home ? manh(x, y, home.x, home.y) : 99;
      if (dHome < r + 3) continue;
      if (controlOwner(x, y) === humanOwner()) continue;
      const ter = terrainAt(x, y);
      let s = 36 - dT * 3 + Math.min(8, dHome);
      if (ter === TERRAIN.PLAIN) s += 6;
      else if (ter === TERRAIN.HILL) s += 2;
      else if (ter === TERRAIN.FOREST) s -= 5;
      else if (ter === TERRAIN.ROAD) s += 4;
      s -= aiTileThreat(cpuOwner(), x, y) * 4;
      if (controlOwner(x, y) === cpuOwner()) s -= 10;
      if (s > bestS) {
        bestS = s;
        best = { x, y };
      }
    }
  }
  return best;
}

function aiPlanRoads(dest) {
  if (!dest) return [];
  const starts = myCities().concat(ownerFortresses(cpuOwner()));
  if (!starts.length) return [];
  let start = starts[0], bd = manh(start.x, start.y, dest.x, dest.y);
  for (const s of starts) {
    const d = manh(s.x, s.y, dest.x, dest.y);
    if (d < bd) {
      bd = d;
      start = s;
    }
  }
  const roads = [];
  const seen = new Set([start.x + "," + start.y]);
  let x = start.x, y = start.y;
  for (let step = 0; step < 42; step++) {
    const remain = manh(x, y, dest.x, dest.y);
    if (remain <= 1) break;
    let next = null, nextS = Infinity;
    for (const [dx, dy] of DIRS4) {
      const nx = x + dx, ny = y + dy;
      if (!inBounds(nx, ny) || isOceanAt(nx, ny)) continue;
      const key = nx + "," + ny;
      if (seen.has(key)) continue;
      const peak = isPeakAt(nx, ny) ? 20 : 0;
      const s = manh(nx, ny, dest.x, dest.y) + peak;
      if (s < nextS) {
        nextS = s;
        next = { x: nx, y: ny, peak };
      }
    }
    if (!next) break;
    seen.add(next.x + "," + next.y);
    x = next.x;
    y = next.y;
    if (next.peak) continue;
    if (terrainAt(x, y) === TERRAIN.PLAIN && !cityAt(x, y) && !buildingAt(x, y) && !isRoadAt(x, y)) {
      roads.push({ x, y });
    }
  }
  // Only keep corridor tiles on the main axis; short paths don't need paving
  if (bd <= 8) return [];
  return roads.filter((r) => aiRoadOnMainAxis(r.x, r.y, dest)).slice(0, 5);
}

function aiPlanCampaign() {
  if (!game || game.tutorial) return;
  const target = aiPickTargetCity();
  if (!target) {
    game.aiCampaign = null;
    game.aiEscortMap = Object.create(null);
    return;
  }
  const doc = aiDoctrine();
  let tunnels = aiPlanTunnels(target).filter((t) => aiTunnelWorth(t, target));
  const fortress = (doc.campaignAttack || aiEndgame().allin) ? null : aiPlanFortress(target);
  let roads = aiPlanRoads(fortress || target).filter((r) => aiRoadOnMainAxis(r.x, r.y, target)).slice(0, 5);
  if (aiEndgame().allin) {
    tunnels = tunnels.slice(0, 1);
    roads = [];
  }
  game.aiCampaign = { x: target.x, y: target.y, city: target, tunnels, fortress, roads };
  aiAssignEscorts();
}

function aiMission() {
  if (!game || !game.aiMission) return null;
  if (game.aiMission.turn !== (game.turn | 0) || game.aiMission.who !== cpuOwner()) return null;
  return game.aiMission;
}

function aiMissionPoint() {
  const m = aiMission();
  return m && m.x != null ? { x: m.x, y: m.y, kind: m.kind } : null;
}

function aiSetMission(kind, dest, buy, label) {
  const m = {
    turn: game.turn | 0,
    who: cpuOwner(),
    kind: kind || "push",
    x: dest ? dest.x : null,
    y: dest ? dest.y : null,
    buy: (buy || []).slice(),
    label: label || "",
  };
  game.aiMission = m;
  if (dest && (kind === "capture" || kind === "push" || kind === "recap" || kind === "land")) {
    const city = cityAt(dest.x, dest.y);
    if (city && city.owner !== cpuOwner() && !cityUncapturable(city)) {
      if (!game.aiCampaign) {
        game.aiCampaign = { x: city.x, y: city.y, city, tunnels: [], fortress: null, roads: [] };
      } else {
        game.aiCampaign.x = city.x;
        game.aiCampaign.y = city.y;
        game.aiCampaign.city = city;
      }
    }
  }
  return m;
}

/** One shared goal for this AI turn: buy / move / shoot all follow it. */
function aiPlanTurnMission() {
  if (!game || game.tutorial) {
    if (game) game.aiMission = null;
    return null;
  }
  const doc = aiDoctrine();
  const falling = myCities().filter((c) => cityAboutToFall(c) && !cityUncapturable(c)).sort((a, b) => a.hp - b.hp);

  const eg = aiEndgame();
  if (doc.holdSoon || eg.holdPark) {
    const sc = aiHoldScores();
    const projMe = sc.me + cityCount(cpuOwner());
    const projFoe = sc.foe + cityCount(humanOwner());
    const behind = projMe <= projFoe || projMe < sc.target;
    if (behind) {
      const steal = aiCapturableCities().filter((c) => !cityUncapturable(c) && (isWeakCity(c, 16) || c.hp <= 5 || !groundUnitAt(c.x, c.y)))
        .sort((a, b) => (groundUnitAt(a.x, a.y) ? 1 : 0) - (groundUnitAt(b.x, b.y) ? 1 : 0) || a.hp - b.hp || cityGarrisonStrength(a) - cityGarrisonStrength(b));
      if (steal.length) {
        return aiSetMission("capture", steal[0], ["line", "elite", "ifv", "mg"], eg.label || "据点抢城");
      }
    }
    const park = myCities().filter((c) => !groundUnitAt(c.x, c.y) || threatOn(c) || cityAboutToFall(c));
    const dest = (park.length ? park : myCities()).slice().sort((a, b) => a.hp - b.hp)[0];
    if (dest) return aiSetMission("hold", dest, ["line", "elite", "ifv", "mg"], eg.label || "据点占城");
  }

  if (eg.consolidate && !eg.allin && !doc.campaignAttack) {
    const park = myCities().filter((c) => !cityUncapturable(c)).sort((a, b) => {
      const ta = (cityAboutToFall(a) || threatOn(a)) ? 0 : 1;
      const tb = (cityAboutToFall(b) || threatOn(b)) ? 0 : 1;
      const ea = groundUnitAt(a.x, a.y) ? 1 : 0;
      const eb = groundUnitAt(b.x, b.y) ? 1 : 0;
      return ta - tb || ea - eb || a.hp - b.hp;
    });
    if (park.length) return aiSetMission("defend", park[0], ["line", "elite", "mg", "aa", "at"], eg.label || "巩固防线");
  }

  if (eg.allin) {
    const focus = aiFocusCity() || campaignCity() || weakEnemyCities()[0] || aiCapturableCities()[0];
    if (focus && !cityUncapturable(focus)) {
      return aiSetMission("capture", focus, ["siege", "line", "hbomber", "ifv", "mortar", "atk", "airport"], eg.label || "限时豪赌破城");
    }
  }

  if (falling.length) {
    const urgent = falling[0];
    const nearSave = game.units.some((u) => u.owner === cpuOwner() && !isAir(u) && !isNavy(u) && !isCivilian(u)
      && aiPathDist(u.x, u.y, urgent.x, urgent.y) <= 10);
    if (!doc.campaignAttack || nearSave) {
      return aiSetMission("defend", urgent, ["line", "elite", "mg", "at", "aa"], "救援危城");
    }
  }

  // Enemy massed in one sector — pull spare forces from quiet fronts / rear
  {
    const crisis = aiFindCrisis();
    if (crisis && crisis.severity >= 2 && (crisis.onHome || crisis.severity >= 3)) {
      const allow = (!doc.campaignAttack || crisis.onHome || crisis.severity >= 3)
        && !(doc.allin && !crisis.onHome);
      if (allow) {
        const dest = crisis.city || { x: crisis.x, y: crisis.y };
        return aiSetMission("defend", dest, ["line", "elite", "ifv", "mg", "at", "aa", "light"], "危机支援");
      }
    }
  }

  if (doc.campaignDefend) {
    const remaining = aiCampaignRemainingHomes();
    const turtle = aiCampaignTurtle() || (remaining.length > 0 && remaining.length <= 2);
    const recap = aiWeakRecaptureTargets();
    if (!turtle && recap.length && aiDefenseSpareForRecap()) {
      return aiSetMission("recap", recap[0], ["line", "ifv", "light", "elite"], "反夺失城");
    }
    if (turtle && remaining.length) {
      const threatened = remaining.filter((c) => cityAboutToFall(c) || threatOn(c)).sort((a, b) => a.hp - b.hp);
      const empty = remaining.filter((c) => !groundUnitAt(c.x, c.y));
      const dest = threatened[0] || empty[0] || remaining[0];
      return aiSetMission("defend", dest, ["line", "elite", "mg", "at", "aa", "mortar", "airport"], "死守关隘");
    }
    if (remaining.length) {
      const threatened = remaining.filter((c) => cityAboutToFall(c) || threatOn(c)).sort((a, b) => a.hp - b.hp);
      const empty = remaining.filter((c) => !groundUnitAt(c.x, c.y));
      const dest = threatened[0] || empty[0] || remaining[0];
      return aiSetMission("defend", dest, ["line", "elite", "mg", "aa", "at", "mortar", "ifv"], "分层防守");
    }
  }

  if (game.withOcean) {
    const land = aiLandingTarget();
    if (land) {
      const sample = game.units.find((u) => u.owner === cpuOwner() && !isAir(u) && !isNavy(u) && !isCivilian(u) && !isAboard(u));
      const city = cityAt(land.x, land.y) || land;
      if (sample && aiUnreachableFrom(sample.x, sample.y, city.x, city.y)) {
        const pipe0 = aiNavalPipe();
        const lab = pipe0.label || "航渡登陆";
        return aiSetMission("land", land, ["transport", "line", "ifv", "destroyer", "cruiser"], lab);
      }
    }
  }

  const focus = aiFocusCity() || campaignCity() || (aiCapturableCities()[0] || null);
  if (focus && !cityUncapturable(focus)) {
    const aaNear = game.units.some((u) => u.owner === humanOwner() && isAaUnit(u) && manh(u.x, u.y, focus.x, focus.y) <= 8);
    const buy = doc.campaignAttack
      ? (aaNear
        ? ["line", "siege", "atk", "spg", "mortar", "ifv", "airport", "light", "hbomber"]
        : ["line", "siege", "ifv", "airport", "hbomber", "mortar", "light"])
      : ["siege", "ifv", "light", "line", "mortar"];
    const eg2 = aiEndgame();
    const label = eg2.allin ? (eg2.label || "限时豪赌破城") : (doc.campaignAttack ? "破城突击" : "进攻目标城");
    return aiSetMission("capture", focus, buy, label);
  }

  if (doc.fog) {
    const scout = { x: aiFoeEdgeX(), y: (game.h / 2) | 0 };
    return aiSetMission("scout", scout, ["airport", "fighter", "atk"], "侦察开雾");
  }

  const weak = weakEnemyCities()[0] || null;
  if (weak) return aiSetMission("push", weak, ["ifv", "line", "siege"], "推进压迫");

  const edge = { x: aiFoeEdgeX(), y: (game.h / 2) | 0 };
  return aiSetMission("push", edge, ["line", "ifv"], "前线推进");
}


function aiEnemyAaNear(x, y, radius) {
  radius = radius != null ? radius : 6;
  if (!game) return [];
  return game.units.filter((u) => {
    if (u.owner === cpuOwner() || !isAaUnit(u) || u.hp <= 0) return false;
    if (!fogCanSeeEnemy(cpuOwner(), u)) return false;
    const reach = Math.max(radius, attackRangeOf(u, "air") || UNITS[u.type].range || 0);
    return cheb(u.x, u.y, x, y) <= reach;
  });
}

function aiFocusGarrison(city) {
  city = city || aiFocusCity() || campaignCity();
  if (!city) return null;
  const g = groundUnitAt(city.x, city.y);
  return g && g.owner !== cpuOwner() ? g : null;
}

/** Soften AA + garrison before heavy bombers / reckless city dive. */
function aiFireWindow(city) {
  city = city || aiFocusCity() || campaignCity();
  if (!city) return { ready: true, aa: [], garrison: null, city: null };
  const aa = aiEnemyAaNear(city.x, city.y, 6).filter((a) => manh(a.x, a.y, city.x, city.y) <= 6);
  const garrison = aiFocusGarrison(city);
  const softGarrison = !garrison || garrison.hp <= 2 || (UNITS[garrison.type] && UNITS[garrison.type].soldier && garrison.hp <= 3);
  const softCity = city.hp <= 5;
  let ready = aa.length === 0 && (softGarrison || softCity);
  if (aiEndgame().allin) {
    // Time pressure: accept thinner window (≤1 AA or city already cracked)
    ready = aa.length <= 1 || softCity || city.hp <= 8;
  }
  return { ready, aa, garrison, city };
}

function aiShotHitsAa(attacker, tx, ty, mode) {
  if (!attacker || !isAir(attacker) || mode === "air") return null;
  const def = UNITS[attacker.type];
  if (usesGroundSplash(attacker, "ground")) {
    const radius = def.splashRadius != null ? def.splashRadius : 1;
    for (const cell of splashCells(tx, ty, radius)) {
      const u = groundUnitAt(cell.x, cell.y);
      if (u && u.owner !== attacker.owner && isAaUnit(u) && fogCanSeeEnemy(attacker.owner, u)) return u;
    }
    return null;
  }
  const u = groundUnitAt(tx, ty);
  if (u && u.owner !== attacker.owner && isAaUnit(u) && fogCanSeeEnemy(attacker.owner, u)) return u;
  return null;
}

function aiIsHeavyAir(unit) {
  return !!(unit && (unit.type === "hbomber" || unit.type === "lbomber"));
}

function aiShouldSuppressAa(unit) {
  if (!unit || unit.owner !== cpuOwner()) return false;
  const win = aiFireWindow();
  if (!win.aa || !win.aa.length) return false;
  if (aiIsHeavyAir(unit)) return true;
  if (unit.type === "atk" || unit.type === "siege" || unit.type === "mortar" || unit.type === "spg" || unit.type === "fighter") return true;
  return false;
}


function aiRoadOnMainAxis(x, y, dest) {
  dest = dest || (game.aiCampaign && game.aiCampaign.city) || campaignCity() || aiFocusCity();
  if (!dest) return false;
  const homes = myCities();
  if (!homes.length) return false;
  const home = nearestOf({ x, y }, homes) || homes[0];
  const direct = manh(home.x, home.y, dest.x, dest.y);
  const via = manh(x, y, home.x, home.y) + manh(x, y, dest.x, dest.y);
  if (via > direct + 2) return false;
  // Cross-track distance from the home→dest segment
  const dx = dest.x - home.x, dy = dest.y - home.y;
  const len2 = dx * dx + dy * dy;
  if (len2 <= 0) return manh(x, y, home.x, home.y) <= 2;
  const t = ((x - home.x) * dx + (y - home.y) * dy) / len2;
  if (t < 0.05 || t > 0.95) return false;
  const px = home.x + t * dx, py = home.y + t * dy;
  return Math.abs(x - px) + Math.abs(y - py) <= 2;
}

function aiTunnelWorth(t, target) {
  if (!t || !target) return false;
  if (!isPeakAt(t.x, t.y)) return false;
  const seeds = myCities().concat(ownerFortresses(cpuOwner()));
  if (!seeds.length) return false;
  const distA = aiGroundFlood(seeds, null);
  const current = distA[target.x + target.y * game.w];
  if (current < 0) return true;
  if (current <= 10) return false;
  if (t.via != null) return t.via <= current - 8;
  return true;
}

function aiEngineerJobWorth(job) {
  if (!job) return false;
  const dest = (game.aiCampaign && game.aiCampaign.city) || campaignCity() || aiFocusCity();
  if (job.kind === "tunnel") {
    if (!dest) return isPeakAt(job.x, job.y);
    return aiTunnelWorth(job, dest);
  }
  if (job.kind === "road") {
    if (aiEndgame().allin) return false;
    return aiRoadOnMainAxis(job.x, job.y, dest);
  }
  if (job.kind === "fortress") {
    const doc = aiDoctrine();
    if (doc.campaignAttack || aiEndgame().allin) return false;
    return !!(doc.campaignDefend || doc.consolidate || game.aiStyle === "conservative");
  }
  return false;
}

function aiEngineerJob(eng) {
  if (!eng || eng.type !== "engineer" || !game.aiCampaign) return null;
  const camp = game.aiCampaign;
  const onRoad = terrainAt(eng.x, eng.y) === TERRAIN.PLAIN && !cityAt(eng.x, eng.y)
    && (camp.roads || []).some((r) => r.x === eng.x && r.y === eng.y);
  if (onRoad) {
    const job = { kind: "road", x: eng.x, y: eng.y, standX: eng.x, standY: eng.y };
    if (aiEngineerJobWorth(job)) return job;
  }
  for (const t of camp.tunnels || []) {
    if (!isPeakAt(t.x, t.y)) continue;
    if (!aiTunnelWorth(t, camp.city || { x: camp.x, y: camp.y })) continue;
    const stand = (t.stand && !isImpassableGround(t.stand.x, t.stand.y)) ? t.stand : aiStandBy(t.x, t.y);
    if (!stand) continue;
    return { kind: "tunnel", x: t.x, y: t.y, standX: stand.x, standY: stand.y };
  }
  if (camp.fortress) {
    const f = camp.fortress;
    if (!cityAt(f.x, f.y) && !buildingAt(f.x, f.y) && !isPeakAt(f.x, f.y) && !isOceanAt(f.x, f.y)) {
      const job = { kind: "fortress", x: f.x, y: f.y, standX: f.x, standY: f.y };
      if (aiEngineerJobWorth(job)) return job;
    }
  }
  let best = null, bd = Infinity;
  for (const r of camp.roads || []) {
    if (terrainAt(r.x, r.y) !== TERRAIN.PLAIN || cityAt(r.x, r.y) || buildingAt(r.x, r.y)) continue;
    if (!aiRoadOnMainAxis(r.x, r.y, camp.city || { x: camp.x, y: camp.y })) continue;
    const d = manh(eng.x, eng.y, r.x, r.y);
    if (d < bd) {
      bd = d;
      best = r;
    }
  }
  if (best) return { kind: "road", x: best.x, y: best.y, standX: best.x, standY: best.y };
  return null;
}

function aiEscortPref(u) {
  // Prefer cheap infantry / MG; never prefer assault armor
  return ({ line: 60, elite: 48, mg: 40, at: 18, spaa: 14, ifv: 8, light: 6, heavy: 3, spg: 0 }[u.type]) || 6;
}

function aiAssaultPool() {
  return game.units.filter((x) => x.owner === cpuOwner() && x.hp > 0 && !isAboard(x)
    && (x.type === "ifv" || x.type === "light" || x.type === "heavy" || x.type === "line" || x.type === "elite"
      || x.type === "siege" || x.type === "spg" || x.type === "mortar")
    && !x.escorting);
}

function aiIsSoleAssaultEscort(u) {
  if (!u) return true;
  // Never bind the only siege / only IFV / last two assault pieces
  if (u.type === "siege" || u.type === "spg" || u.type === "mortar") return true;
  const same = game.units.filter((x) => x.owner === cpuOwner() && x.type === u.type && x.hp > 0 && !x.escorting).length;
  if ((u.type === "ifv" || u.type === "light" || u.type === "heavy") && same <= 2) return true;
  const pool = aiAssaultPool();
  if (pool.length <= 2 && pool.some((x) => x.id === u.id)) return true;
  // Keep at least one free IFV/light for the push if any siege exists
  const hasSiege = game.units.some((x) => x.owner === cpuOwner() && (x.type === "siege" || x.type === "spg" || x.type === "mortar") && x.hp > 0);
  if (hasSiege && (u.type === "ifv" || u.type === "light") && same <= 2) return true;
  return false;
}

function aiEscortAllowed(u) {
  if (!u) return false;
  if (u.type === "siege" || u.type === "spg" || u.type === "mortar") return false;
  if (aiIsSoleAssaultEscort(u)) return false;
  const n = game.units.filter((x) => x.owner === cpuOwner() && x.type === u.type && x.hp > 0).length;
  if (u.type === "ifv" && n <= 2) return false;
  if ((u.type === "light" || u.type === "heavy") && n <= 1) return false;
  if ((u.type === "line" || u.type === "elite") && n <= 1) return false;
  return true;
}

function aiAssignEscorts() {
  const map = Object.create(null);
  if (!game) return;
  const engs = game.units.filter((u) => u.owner === cpuOwner() && u.type === "engineer" && !isEscorted(u) && u.hp > 0 && !isAboard(u));
  const pool = game.units.filter((u) => u.owner === cpuOwner() && isMilitaryGround(u) && !isImmobile(u) && !u.escorting && u.hp > 0 && !isAboard(u) && aiEscortAllowed(u));
  pool.sort((a, b) => aiEscortPref(b) - aiEscortPref(a) || manh(a.x, a.y, 0, 0) - manh(b.x, b.y, 0, 0));
  for (const e of engs) {
    const job = aiEngineerJob(e);
    if (!job || !aiEngineerJobWorth(job)) continue;
    const danger = aiTileThreat(cpuOwner(), e.x, e.y) + aiTileThreat(cpuOwner(), job.standX, job.standY);
    const dist = manh(e.x, e.y, job.standX, job.standY);
    // Roads: only escort if hot or far; tunnels/fortress more often need cover
    if (job.kind === "road" && danger < 5 && dist <= 8) continue;
    if (job.kind === "road" && aiEndgame().allin) continue;
    let best = null, bd = 99;
    for (const u of pool) {
      if (map[u.id]) continue;
      if (aiIsSoleAssaultEscort(u)) continue;
      const d = manh(u.x, u.y, e.x, e.y);
      const score = d - aiEscortPref(u) * 0.05;
      if (score < bd) {
        bd = score;
        best = u;
      }
    }
    if (best && manh(best.x, best.y, e.x, e.y) <= 10) map[best.id] = e.id;
  }
  game.aiEscortMap = map;
}

function aiEngineerReserve() {
  let r = 0;
  for (const u of game.units) {
    if (u.owner !== cpuOwner() || u.type !== "engineer" || u.hp <= 0) continue;
    const job = aiEngineerJob(u);
    if (!job) continue;
    const d = manh(u.x, u.y, job.standX, job.standY);
    if (job.kind === "fortress" && d <= 6 && game.money[cpuOwner()] >= 500) r = Math.max(r, 500);
    else if (job.kind === "tunnel" && d <= 5) r = Math.max(r, 300);
    else if (job.kind === "road" && d <= 3) r = Math.max(r, 75);
  }
  return r;
}

function aiEscortDest(job, military) {
  if (!job) return null;
  const dest = { x: job.standX, y: job.standY };
  if (job.kind === "tunnel") return dest;
  if (military && cheb(military.x, military.y, dest.x, dest.y) === 1) return { x: military.x, y: military.y };
  let best = null, bd = Infinity;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const x = dest.x + dx, y = dest.y + dy;
      if (!inBounds(x, y) || isImpassableGround(x, y)) continue;
      const c = cityAt(x, y);
      if (c && c.owner !== cpuOwner()) continue;
      const d = military ? manh(military.x, military.y, x, y) : 0;
      if (d < bd) {
        bd = d;
        best = { x, y };
      }
    }
  }
  return best || dest;
}

function aiUnescortForJob(military, dest) {
  const civilian = escortPassenger(military);
  if (!civilian) return false;
  const dropOn = dest && cheb(military.x, military.y, dest.x, dest.y) === 1;
  if (dropOn && !isImpassableGround(dest.x, dest.y)
    && groundOccupancy(dest.x, dest.y, civilian.id) < groundCapacity(dest.x, dest.y)) {
    const c = cityAt(dest.x, dest.y);
    const b = buildingAt(dest.x, dest.y);
    if (!(c && c.owner !== civilian.owner) && !(b && b.owner !== civilian.owner)) {
      civilian.x = dest.x;
      civilian.y = dest.y;
      civilian.escortedBy = null;
      military.escorting = null;
      log(`${UNITS[civilian.type].name} 解除护卫，位于 ${displayCoord(dest.x, dest.y)}。`, civilian.owner === localOwner() ? "me" : "foe");
      spawnFx(dest.x, dest.y, "解除", "#d4b46a");
      return true;
    }
  }
  return dismissEscort(military) == null;
}

function needAirPower() {
  const foeAir = game.units.filter((u) => u.owner === humanOwner() && isAir(u)).length;
  if (foeAir > 0) return true;
  if (aiLostCities().length) return true;
  if (weakEnemyCities().some((c) => isWeakCity(c, 16))) return true;
  if (game.aiStyle === "aggressive") return true;
  if (game.turn >= 3) return true;
  return false;
}

function aiCountering() {
  return (game.aiCounterUntil >= 0 && game.turn <= game.aiCounterUntil) || aiLostCities().length > 0;
}

function aiCapturableCities() {
  return enemyCities().filter((c) => !cityUncapturable(c));
}

function aiDoctrine() {
  const doc = {
    lockStyle: null,
    captureWeight: 1,
    defendHome: 1,
    navy: 1,
    siege: 1,
    infantry: 1,
    armor: 1,
    air: 1,
    airport: 1,
    transport: 1,
    campaignAttack: false,
    campaignDefend: false,
    holdSoon: false,
    fog: false,
    map: "",
  };
  if (!game) return doc;
  const key = game.sizeKey || "";
  doc.map = key;
  if (key === "strait" || key === "isles") {
    doc.navy = 1.75;
    doc.transport = 1.8;
    doc.armor = 0.8;
  } else if (key === "mountains" || key === "rift") {
    doc.infantry = 1.5;
    doc.siege = 1.4;
    doc.armor = 0.55;
  } else if (key === "woods") {
    doc.infantry = 1.45;
    doc.siege = 1.3;
    doc.armor = 0.6;
  } else if (key === "plains") {
    doc.armor = 1.4;
    doc.siege = 1.2;
  }
  const cpu = cpuOwner();
  if (game.campaign) {
    if (game.campaign.attacker === cpu) {
      doc.campaignAttack = true;
      doc.captureWeight = 3.4;
      doc.siege *= 1.85;
      doc.air *= 1.55;
      doc.armor *= 1.35;
      doc.infantry *= 1.15;
      doc.transport *= 1.45;
      doc.airport *= 1.35;
      const taken = campaignTakenCount();
      const holding = aiHeldCapturableCities().some((c) => cityAboutToFall(c));
      if (holding) {
        doc.defendHome = 1.8;
      } else if (taken >= 2 && !aiCampaignBehindSchedule()) {
        doc.defendHome = 1.35;
      } else {
        doc.defendHome = 0.85;
      }
    } else if (game.campaign.defender === cpu) {
      doc.campaignDefend = true;
      doc.defendHome = 2.4;
      const turtle = aiCampaignTurtle() || campaignDefHeldCount() <= 2;
      const recap = !turtle && aiCampaignRecaptureTargets().some((c) => isWeakCity(c, 16) || c.hp <= 4);
      doc.captureWeight = turtle ? 0.15 : (recap ? 1.6 : 0.7);
      doc.infantry *= 1.3;
      doc.armor *= recap ? 0.95 : 0.72;
    }
  }
  const eg = aiEndgame();
  doc.allin = !!eg.allin;
  doc.consolidate = !!eg.consolidate;
  if (game.hold) {
    doc.holdSoon = !!eg.holdPark || aiHoldTurnsToScore() <= 3;
    doc.captureWeight *= doc.holdSoon ? 1.55 : 1.15;
    doc.defendHome *= doc.holdSoon ? 1.7 : 1.2;
    doc.infantry *= 1.12;
    if (eg.consolidate) {
      doc.defendHome *= 1.45;
      doc.captureWeight *= 0.65;
    }
  }
  if (eg.allin) {
    doc.captureWeight *= 1.85;
    doc.siege *= 1.35;
    doc.air *= 1.25;
    doc.defendHome *= 0.45;
    doc.lockStyle = "aggressive";
  } else if (eg.consolidate && !doc.holdSoon) {
    doc.defendHome *= 1.55;
    doc.captureWeight *= 0.55;
    doc.lockStyle = doc.lockStyle || "conservative";
  }
  if (game.fog) {
    doc.fog = true;
    doc.air *= 1.35;
    doc.airport *= 1.45;
  }
  return doc;
}

function aiFogScoutGoal(unit) {
  if (!unit || !game || !game.fog) return null;
  const cities = enemyCities();
  const dest = cities.length ? nearestOf(unit, cities) : { x: aiFoeEdgeX(), y: (game.h / 2) | 0 };
  const step = isAir(unit) ? 2 : 2;
  let best = null, bd = Infinity;
  for (let y = 0; y < game.h; y += step) {
    for (let x = 0; x < game.w; x += step) {
      if (fogVisible(cpuOwner(), x, y)) continue;
      if (isPeakAt(x, y) || (isOceanAt(x, y) && !isAir(unit))) continue;
      const toDest = manh(x, y, dest.x, dest.y);
      const toMe = manh(unit.x, unit.y, x, y);
      const corridor = Math.abs((x - unit.x) * (dest.y - unit.y) - (y - unit.y) * (dest.x - unit.x));
      const unseen = fogSeenAt(cpuOwner(), x, y) ? 10 : 0;
      const d = toMe * 1.05 + toDest * 0.75 + corridor * 0.12 + unseen;
      if (d < bd) {
        bd = d;
        best = { x, y };
      }
    }
  }
  return best;
}

function airApproach(unit, target) {
  if (!target) return null;
  if (!isAir(unit)) return target;
  const r = Math.max(1, attackRangeOf(unit, "ground") || 1);
  if (!cityAt(target.x, target.y) && !buildingAt(target.x, target.y)) return target;
  let best = null, bd = Infinity;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx === 0 && dy === 0) continue;
      if (cheb(0, 0, dx, dy) > r) continue;
      const x = target.x + dx, y = target.y + dy;
      if (!inBounds(x, y)) continue;
      if (!airInSupply(unit.owner, x, y)) continue;
      const d = cheb(unit.x, unit.y, x, y);
      const extra = flyingAirAt(x, y, unit.id).length ? 8 : 0;
      const score = d + extra;
      if (score < bd) {
        bd = score;
        best = { x, y };
      }
    }
  }
  return best || target;
}

function withUnitAt(unit, x, y, fn) {
  const ox = unit.x, oy = unit.y;
  unit.x = x;
  unit.y = y;
  try {
    return fn();
  } finally {
    unit.x = ox;
    unit.y = oy;
  }
}

function adaptAiStyle() {
  if (!game || game.tutorial) return;
  const pulse = game.playerPulse || {};
  const foe = game.units.filter((u) => u.owner === humanOwner());
  let threat = 0;
  for (const c of myCities()) {
    if (cityUncapturable(c)) continue;
    const inc = aiIncomingTo(c.x, c.y);
    threat += inc.dmg * 3 + inc.n * 4;
    if (c.hp <= c.maxHp * 0.5) threat += 12;
    if (c.hp <= 3) threat += 18;
  }
  const holdCities = myCities().filter((c) => !cityUncapturable(c));
  const frontFoe = foe.filter((u) => {
    const home = nearestOf(u, holdCities.length ? holdCities : myCities());
    return home && manh(u.x, u.y, home.x, home.y) <= 6;
  }).length;
  threat += frontFoe * 4;
  threat += (pulse.atk || 0) * 3;
  threat += (pulse.cityHit || 0) * 10;
  threat += (pulse.capture || 0) * 8;
  threat += (pulse.buyOff || 0) * 5;
  threat -= (pulse.buyDef || 0) * 3;
  threat -= (cityCount(cpuOwner()) - cityCount(humanOwner())) * 8;
  threat -= 10;
  if ((pulse.capture || 0) > 0) game.aiCounterUntil = Math.max(game.aiCounterUntil || 0, game.turn + 5);
  const playerHome = foe.filter((u) => {
    const h = nearestOf(u, enemyCities());
    return h && manh(u.x, u.y, h.x, h.y) <= 6;
  }).length;
  if (foe.length && playerHome / foe.length > 0.7 && frontFoe <= 1) threat -= 22;
  threat += foe.filter((u) => u.type === "light" || u.type === "heavy").length * 3;
  threat += foe.filter((u) => u.type === "ifv").length * 2;
  game.aiMood = clamp(Math.round((game.aiMood || 0) * 0.55 + threat * 0.45), -80, 80);
  let next = "balanced";
  if (game.aiMood > 18) next = "conservative";
  else if (game.aiMood < -12) next = "aggressive";
  const doc = aiDoctrine();
  if (aiCountering() && !doc.campaignDefend) {
    next = "aggressive";
    game.aiMood = Math.min(game.aiMood, -10);
  }
  if (doc.campaignAttack) {
    const taken = campaignTakenCount();
    const holding = aiHeldCapturableCities().some((c) => cityAboutToFall(c));
    if (holding) next = "conservative";
    else if (taken >= 2 && !aiCampaignBehindSchedule()) next = game.aiMood < -22 ? "aggressive" : "balanced";
    else next = game.aiMood > 28 ? "balanced" : "aggressive";
  } else if (doc.campaignDefend) {
    if (aiCampaignTurtle() || campaignDefHeldCount() <= 2) next = "conservative";
    else if (aiCampaignRecaptureTargets().some((c) => isWeakCity(c, 16) || c.hp <= 4)) next = "aggressive";
    else next = game.aiMood < -18 ? "balanced" : "conservative";
  } else if (doc.lockStyle) {
    next = doc.lockStyle;
  }
  const egS = aiEndgame();
  if (egS.allin) next = "aggressive";
  else if (egS.consolidate && !egS.holdPark) next = "conservative";
  else if (egS.holdPark && egS.consolidate) next = "conservative";
  if (next !== game.aiStyle) {
    game.aiStyle = next;
  }
  game.playerPulse = { atk: 0, cityHit: 0, capture: 0, buyOff: 0, buyDef: 0 };
}

function aiDeploySpot(typeId) {
  if (isBuildingType(typeId)) {
    const spots = buildTiles(cpuOwner());
    if (!spots.length) return null;
    spots.sort((a, b) => aiFrontDelta(a, b) || a.y - b.y);
    return spots[0];
  }
  if (isAirType(typeId)) {
    const spots = airDeployTiles(cpuOwner(), typeId);
    return spots[0] || null;
  }
  if (isNavyType(typeId)) {
    const spots = deployTiles(cpuOwner(), typeId);
    if (!spots.length) return null;
    spots.sort((a, b) => aiFrontDelta(a, b) || a.y - b.y);
    return spots[0];
  }
  const spots = deployTiles(cpuOwner(), typeId);
  if (!spots.length) return null;
  const style = game.aiStyle;
  const camp = campaignCity();
  if (typeId === "engineer") {
    spots.sort((a, b) => {
      const dest = camp || { x: aiFoeEdgeX(), y: (game.h / 2) | 0 };
      const ta = aiTileThreat(cpuOwner(), a.x, a.y);
      const tb = aiTileThreat(cpuOwner(), b.x, b.y);
      return (ta - tb) || aiPathDist(a.x, a.y, dest.x, dest.y) - aiPathDist(b.x, b.y, dest.x, dest.y) || a.y - b.y;
    });
    return spots[0];
  }
  const threatened = myCities().filter((c) => {
    if (cityUncapturable(c)) return false;
    return cityAboutToFall(c) || ((threatOn(c) || c.hp < c.maxHp) && style === "conservative");
  });
  for (const c of threatened) {
    const hit = spots.find((s) => s.x === c.x && s.y === c.y);
    if (hit) return hit;
  }
  const doc = aiDoctrine();
  const garrisonType = typeId && (UNITS[typeId].soldier || typeId === "at" || typeId === "mg");
  if (garrisonType && doc.campaignAttack) {
    for (const c of aiGarrisonTargets()) {
      const hit = spots.find((s) => s.x === c.x && s.y === c.y);
      if (hit) return hit;
    }
  }
  const garrison = !doc.campaignAttack && (style === "conservative" || game.turn <= 1 || doc.campaignDefend) && garrisonType;
  if (garrison) {
    const empty = myCities().filter((c) => !groundUnitAt(c.x, c.y) && (style === "conservative" || doc.campaignDefend || cityAboutToFall(c) || game.turn <= 1));
    for (const c of empty) {
      const hit = spots.find((s) => s.x === c.x && s.y === c.y);
      if (hit) return hit;
    }
  }
  spots.sort((a, b) => {
    const dest = camp || (threatened[0] || null);
    const edge = aiFoeEdgeX();
    const da = dest ? aiPathDist(a.x, a.y, dest.x, dest.y) : (threatened.length ? Math.min(...threatened.map((c) => aiPathDist(a.x, a.y, c.x, c.y))) : Math.abs(a.x - edge));
    const db = dest ? aiPathDist(b.x, b.y, dest.x, dest.y) : (threatened.length ? Math.min(...threatened.map((c) => aiPathDist(b.x, b.y, c.x, c.y))) : Math.abs(b.x - edge));
    const ta = deployTerrainBias(typeId, a.x, a.y);
    const tb = deployTerrainBias(typeId, b.x, b.y);
    return da - db || ta - tb || aiFrontDelta(a, b) || a.y - b.y;
  });
  return spots[0];
}

function deployTerrainBias(typeId, x, y) {
  const ter = terrainAt(x, y);
  if (isBuildingType(typeId)) return ter === TERRAIN.PLAIN ? 0 : 40;
  if (ter === TERRAIN.OCEAN) return 90;
  if (ter === TERRAIN.PEAK) {
    const def = UNITS[typeId];
    return def && (def.immobile || def.move <= 0) ? -16 : 80;
  }
  if (typeId === "aa" || typeId === "at" || typeId === "mg" || typeId === "spaa" || typeId === "coast") {
    if (ter === TERRAIN.HILL) return -10;
    if (ter === TERRAIN.FOREST) return 5;
    return 0;
  }
  if (UNITS[typeId] && UNITS[typeId].soldier) {
    if (ter === TERRAIN.FOREST) return -4;
    if (ter === TERRAIN.HILL) return 1;
    return 0;
  }
  if (ter === TERRAIN.FOREST) return 7;
  if (ter === TERRAIN.HILL) return 5;
  return 0;
}

function aiBuyOne(typeId) {
  const spot = aiDeploySpot(typeId);
  if (!spot) return false;
  const err = tryBuy(cpuOwner(), typeId, spot.x, spot.y);
  return !err;
}

function aiCanBuy(id) {
  const def = shopDef(id);
  if (!def) return false;
  if (game.money[cpuOwner()] < def.cost + (id === "engineer" ? 0 : aiEngineerReserve())) return false;
  if (isBuildingType(id)) {
    if (!canBuyVehicle(cpuOwner(), id)) return false;
    return buildTiles(cpuOwner()).length > 0;
  }
  if (def.soldier && soldierBuyLimitReached(cpuOwner())) return false;
  if (!def.soldier && !canBuyVehicle(cpuOwner(), id)) return false;
  if (def.navy) {
    if (!game.withOcean) return false;
    return deployTiles(cpuOwner(), id).length > 0;
  }
  if (def.needsOcean) {
    if (!game.withOcean) return false;
    return deployTiles(cpuOwner(), id).length > 0;
  }
  if (def.air && !airDeployTiles(cpuOwner(), id).length) return false;
  return true;
}

function aiBuyScore(id) {
  const style = game.aiStyle;
  const money = game.money[cpuOwner()];
  const def = shopDef(id);
  const mine = game.units.filter((u) => u.owner === cpuOwner());
  const foe = game.units.filter((u) => u.owner === humanOwner());
  const nMine = (t) => mine.filter((u) => u.type === t).length;
  const nFoe = (t) => foe.filter((u) => u.type === t).length;
  const soldiersMine = nMine("line") + nMine("elite");
  const tanksFoe = nFoe("light") + nFoe("heavy");
  const soldiersFoe = nFoe("line") + nFoe("elite");
  const artyFoe = nFoe("spg") + nFoe("siege") + nFoe("mortar") + nFoe("at");
  const threatN = myCities().filter((c) => threatOn(c)).length;
  let s = 8;
  if (id === "at") s += tanksFoe * 24 + nFoe("ifv") * 14 + nFoe("spg") * 10 - nMine("at") * 16;
  if (id === "mg") s += soldiersFoe * 11 + nFoe("elite") * 6 - nMine("mg") * 18;
  if (id === "mortar") s += soldiersFoe * 6 + (style === "aggressive" ? 14 : 4) - nMine("mortar") * 20;
  if (id === "spg") s += tanksFoe * 14 - nMine("spg") * 14;
  if (id === "siege") s += (style === "conservative" ? 2 : 18) + (cityCount(humanOwner()) >= cityCount(cpuOwner()) ? 12 : 0) - nMine("siege") * 16;
  if (id === "heavy") s += (style === "aggressive" ? 22 : 8) + artyFoe * 5 - nMine("heavy") * 18;
  if (id === "light") s += (style === "aggressive" ? 18 : 8) + artyFoe * 6 - nMine("light") * 15;
  if (id === "ifv") s += (style === "aggressive" ? 16 : 10) + soldiersFoe * 5 + threatN * 2 - nMine("ifv") * 13;
  if (id === "elite") s += (style === "conservative" ? 12 : 5) + (soldiersMine < 3 ? 14 : 0) - nMine("elite") * 4;
  if (id === "line") s += 8 + (soldiersMine < 2 ? 18 : 0) + (style === "conservative" ? 8 : 0) + threatN * 3 - nMine("line") * 2;
  const airFoe = foe.filter((u) => isAir(u)).length;
  const airMine = mine.filter((u) => isAir(u)).length;
  const apMine = ownerAirports(cpuOwner()).length;
  const lostN = aiLostCities().length;
  const weakN = weakEnemyCities().filter((c) => isWeakCity(c, 16)).length;
  const wantAir = needAirPower();
  if (id === "airport") {
    s += apMine === 0 ? (wantAir ? 58 : 40) : (wantAir && apMine < 2 ? 24 : 8);
    s -= apMine * 16;
    if (apMine >= 3) s -= 40;
    if (style === "aggressive" && apMine < 2) s += 12;
    if (game.turn >= 1 && apMine === 0 && money >= 300) s += 18;
  }
  if (id === "aa") s += airFoe * 28 + (airFoe > 0 ? 18 : 2) + threatN * 2 - nMine("aa") * 12;
  if (id === "spaa") s += airFoe * 22 + (airFoe > 0 ? 14 : 0) + (style === "aggressive" ? 8 : 4) + nMine("light") * 3 + nMine("heavy") * 3 - nMine("spaa") * 13 - nMine("aa") * 3;
  if (id === "engineer") {
    const camp = game.aiCampaign;
    const jobs = camp && ((camp.tunnels && camp.tunnels.length) || camp.fortress || (camp.roads && camp.roads.length));
    s += 14 + (jobs ? 24 : 8) + (style === "aggressive" ? 8 : 4);
    if (nMine("engineer") === 0 && (nMine("line") + nMine("elite") + nMine("ifv") + nMine("light") > 0)) s += 16;
    if (game.turn === 0 && nMine("line") + nMine("elite") === 0) s -= 18;
    s -= nMine("engineer") * 22;
    if (nMine("engineer") >= 2) s -= 30;
  }
  if (id === "fighter") s += airFoe * 24 + (airFoe > airMine ? 22 : 10) + 8 - nMine("fighter") * 10;
  if (id === "atk") s += (lostN + weakN) * 12 + (style === "aggressive" ? 20 : 10) + nFoe("line") * 3 - nMine("atk") * 9;
  if (id === "lbomber") s += weakN * 14 + lostN * 12 + (style === "conservative" ? 8 : 18) - nMine("lbomber") * 11;
  if (id === "hbomber") s += (weakN + lostN) * 12 + (style === "aggressive" || aiCountering() ? 24 : 12) - nMine("hbomber") * 12;
  const obj = campaignCity();
  if (obj) {
    if (id === "siege") s += 16 + (obj.hp >= 6 ? 10 : 0);
    if (id === "ifv" || id === "light" || id === "heavy") s += 8;
    if (id === "mortar" || id === "spg") s += 6;
  }
  const shipsFoe = foe.filter((u) => isNavy(u)).length;
  const coastN = myCities().filter((c) => cityTouchesOcean(c)).length;
  if (id === "transport") s += coastN * 10 + (soldiersMine >= 3 ? 18 : 6) - nMine("transport") * 14;
  if (id === "coast") s += shipsFoe * 28 + coastN * 8 + (game.withOcean ? 16 : -99) - nMine("coast") * 14;
  if (id === "destroyer") s += shipsFoe * 24 + (game.withOcean ? 16 : -99) - nMine("destroyer") * 11;
  if (id === "cruiser") s += weakN * 8 + (game.withOcean ? 14 : -99) - nMine("cruiser") * 11;
  if (id === "battleship") s += shipsFoe * 18 + (style === "aggressive" ? 20 : 10) + (game.withOcean ? 12 : -99) - nMine("battleship") * 13;
  if (id === "carrier") s += (wantAir ? 26 : 10) + nMine("atk") * 5 + nMine("fighter") * 4 - nMine("carrier") * 15;
  if (def && def.navy && !game.withOcean) s = -99;
  if (wantAir && def && def.air) s += 18;
  if (wantAir && id === "airport") s += 12;
  if (aiCountering() && (id === "atk" || id === "lbomber" || id === "hbomber" || id === "ifv" || id === "light" || id === "siege")) s += 14;
  if (def && def.air && apMine === 0) s = -99;
  if (threatN && (id === "line" || id === "elite" || id === "mg" || id === "at" || id === "aa" || id === "spaa")) s += 6 + threatN * 5;
  if (style === "aggressive" && AI_OFFENSE_TYPES[id]) s += 16;
  if (style === "conservative" && AI_DEFENSE_TYPES[id]) s += 12;
  if (game.turn <= 1 && def && def.soldier) s += 10;
  if (game.withOcean && def && def.navy && nMine(id) === 0) s += 10;
  if (style === "conservative" && (id === "heavy" || id === "mortar")) s -= 10;
  if (style === "conservative" && def && !def.soldier && !isBuildingType(id) && money - def.cost < 220 && soldiersMine < 2) s -= 28;
  if (game.turn === 0 && !mine.some((u) => !UNITS[u.type].soldier) && def && !def.soldier && !isBuildingType(id)) s += 22;
  if (game.turn >= 10 && def && def.soldier && soldierBuyLimitReached(cpuOwner())) s = -99;
  s -= nMine(id) * 5;
  const doc = aiDoctrine();
  if (s > -50 && def) {
    if (id === "transport") s *= doc.transport;
    else if (def.navy || id === "coast") s *= doc.navy;
    if (id === "siege" || id === "mortar" || id === "spg") s *= doc.siege;
    if (def.soldier || id === "mg" || id === "at") s *= doc.infantry;
    if (id === "light" || id === "heavy" || id === "ifv") s *= doc.armor;
    if (def.air) s *= doc.air;
    if (id === "airport") s *= doc.airport;
  }
  if (doc.campaignAttack) {
    const rush = aiCampaignBehindSchedule();
    const heldOpen = aiGarrisonTargets().length;
    if (id === "line" || id === "elite") s += nMine(id) < 2 ? 36 : 10;
    if (heldOpen && (id === "line" || id === "elite" || id === "mg" || id === "at")) s += 26;
    if (id === "ifv") s += 32 - nMine("ifv") * 8;
    if (id === "light") s += 28 - nMine("light") * 9;
    if (id === "heavy") s += 22 - nMine("heavy") * 10;
    if (id === "siege") s += 40 + (rush ? 16 : 0) - nMine("siege") * 8;
    if (id === "mortar" || id === "spg") s += 22;
    if (id === "hbomber") s += 34 + (rush ? 18 : 0) - nMine("hbomber") * 6;
    if (id === "lbomber") s += 28 + (rush ? 12 : 0) - nMine("lbomber") * 7;
    if (id === "atk") s += 16;
    if (id === "airport") s += apMine === 0 ? 48 : (apMine < 2 ? 18 : -8);
    if (id === "transport") s += (game.withOcean ? 36 : -20) + (soldiersMine >= 1 ? 12 : 0);
    if (id === "engineer") s += (doc.map === "mountains" || doc.map === "rift" || doc.map === "woods") ? 18 : 4;
    if (id === "coast") s -= 18;
    if (id === "aa" || id === "spaa") s += airFoe > 0 ? 32 - nMine(id) * 8 : -6;
    if (id === "mg") s += heldOpen ? 14 : -6;
    if (id === "fighter" && airFoe === 0) s -= 14;
    s -= 22; // spend on units, not idle cash
    if (def && (def.soldier || AI_OFFENSE_TYPES[id] || id === "airport" || id === "transport" || id === "engineer")) s += 22;
  }
  if (doc.campaignDefend) {
    if (id === "line" || id === "elite" || id === "mg" || id === "at" || id === "aa" || id === "airport") s += 16;
    if (id === "engineer") s += 14;
    if (id === "heavy") s -= 20;
    const held = campaignDefHeldCount();
    if (held > 0 && held <= 2) {
      if (id === "line" || id === "elite" || id === "mg" || id === "at" || id === "aa") s += 24;
      if (id === "heavy" || id === "light") s -= 8;
    }
    if (aiCampaignTurtle()) {
      if (id === "line" || id === "elite" || id === "mg" || id === "at" || id === "aa") s += 20;
      if (id === "heavy" || id === "light" || id === "siege") s -= 16;
    } else {
      const recap = aiCampaignRecaptureTargets();
      if (recap.some((c) => isWeakCity(c, 16) || c.hp <= 4)) {
        if (id === "ifv" || id === "line" || id === "elite") s += 18;
      }
    }
  }
  if (doc.holdSoon) {
    if (def && def.soldier) s += 14;
    if (id === "ifv") s += 12;
  }
  if (doc.fog) {
    if (id === "fighter" || id === "atk") s += 16;
    if (id === "airport") s += 14;
  }
  const miss = aiMission();
  if (miss && miss.buy && miss.buy.indexOf(id) >= 0) {
    s += 28 - miss.buy.indexOf(id) * 3;
    if (miss.kind === "land" && id === "transport") s += 20;
    if ((miss.kind === "defend" || miss.kind === "hold") && (id === "line" || id === "elite" || id === "mg")) s += 12;
    if ((miss.kind === "capture" || miss.kind === "push" || miss.kind === "recap") && (id === "siege" || id === "hbomber" || id === "ifv")) s += 14;
  }
  const deficit = aiRatioDeficit(id);
  if (deficit > 0) s += 40 + deficit * 18;
  const over = aiRatioOver(id);
  if (over > 0) s -= 12 * over;
  const table = aiRatioTable();
  if ((table[id] || 0) <= 0 && over >= 1 && id !== "line") s -= 20;
  return s;
}

function aiWantType() {
  let best = null, bestS = 2;
  for (const id of SHOP_ORDER) {
    if (!aiCanBuy(id)) continue;
    const s = aiBuyScore(id);
    if (s > bestS) {
      bestS = s;
      best = id;
    }
  }
  return best;
}

function aiUpgradeCities() {
  const doc = aiDoctrine();
  const style = game.aiStyle;
  let reserve = style === "conservative" ? 400 : style === "aggressive" ? 80 : 220;
  if (doc.campaignAttack) reserve = aiCampaignBehindSchedule() ? 520 : 300;
  if (aiEndgame().allin) reserve = Math.min(reserve, 60);
  if (aiEndgame().consolidate && !aiEndgame().allin) reserve = Math.max(reserve, 280);
  reserve = Math.round(reserve * aiDiff().reserveMul);
  let cities = game.cities.filter((c) => c.owner === cpuOwner());
  if (doc.campaignAttack) {
    cities = cities.slice().sort((a, b) => {
      const ua = cityUncapturable(a) ? 1 : 0;
      const ub = cityUncapturable(b) ? 1 : 0;
      return ua - ub || a.hp - b.hp;
    });
  }
  for (const city of cities) {
    if (!cityCanUpgrade(city, cpuOwner())) continue;
    const incCost = cityIncomeCost(city);
    const threatened = threatOn(city) || cityAboutToFall(city) || city.hp <= Math.ceil(city.maxHp * 0.4);
    let kind = null;
    if (threatened && game.money[cpuOwner()] >= 600 + reserve) kind = "hp";
    else if (game.money[cpuOwner()] >= incCost + reserve) kind = "income";
    else if (game.money[cpuOwner()] >= 600 + reserve && !cityUncapturable(city)) kind = "hp";
    if (!kind) continue;
    const err = tryUpgradeCity(cpuOwner(), city, kind);
    if (!err) {
      renderShop();
      updatePills();
    }
  }
}

function aiBuyFromRatio() {
  for (const id of aiCompositionNeed()) {
    if (aiCanBuy(id) && aiBuyOne(id)) return true;
  }
  return false;
}

function aiCampaignAttackOpener() {
  // Opener is now the ratio table for campaign attack.
  return aiBuyFromRatio();
}

function aiBuyPhase() {
  aiUpgradeCities();
  const doc = aiDoctrine();
  // Hard quotas first — fill the ratio table before soft wants.
  let fillGuard = 0;
  const fillMax = doc.campaignAttack ? 18 : (doc.campaignDefend ? 14 : 12);
  while (fillGuard++ < fillMax && aiBuyFromRatio()) { /* ratio fill */ }
  if (needAirPower() && ownerAirports(cpuOwner()).length === 0 && aiCanBuy("airport")) {
    aiBuyOne("airport");
  }
  const max = doc.campaignAttack ? 16 : (game.aiStyle === "aggressive" || aiCountering() ? 14 : game.aiStyle === "conservative" ? 8 : 12);
  let guard = 0;
  while (guard++ < max) {
    const t = aiWantType();
    if (!t) break;
    // Soft buys: avoid piling far over quota.
    if (aiRatioOver(t) >= 2 && !AI_OFFENSE_TYPES[t] && t !== "line" && t !== "elite") break;
    if (!aiBuyOne(t)) break;
  }
}

function stepToward(unit, tx, ty) {
  if (unit && unit.x === tx && unit.y === ty) return null;
  if (isAir(unit)) {
    const { tiles } = moveRange(unit);
    let best = null, bestScore = Infinity;
    const scout = game.fog && (unit.type === "fighter" || unit.type === "atk");
    for (const t of tiles) {
      let score = cheb(t.x, t.y, tx, ty) * 10 + t.d;
      if (scout && !fogVisible(cpuOwner(), t.x, t.y)) score -= 8;
      if (score < bestScore) {
        bestScore = score;
        best = t;
      }
    }
    return best;
  }
  const { tiles } = moveRange(unit);
  const remain = terrainGoalDist(unit, tx, ty);
  let best = null, bestScore = Infinity;
  const cautious = isCivilian(unit) || unit.escorting;
  const destCity = cityAt(tx, ty);
  for (const t of tiles) {
    const left = remain[t.x + t.y * game.w];
    if (left < 0) continue;
    let score = left * 10 + t.d - tileTacticsBonus(unit, t.x, t.y);
    if (cautious) score += aiTileThreat(unit.owner, t.x, t.y) * 14;
    if (game.fog && !isNavy(unit) && unit.owner === cpuOwner()) {
      const vis = fogVisible(cpuOwner(), t.x, t.y);
      const seen = fogSeenAt(cpuOwner(), t.x, t.y);
      if (!vis && !seen) score += destCity ? 16 : 90;
      else if (!vis) score += 6;
    }
    if (score < bestScore) {
      bestScore = score;
      best = t;
    }
  }
  return best;
}

function mortarAimScore(unit, cx, cy) {
  const style = game.aiStyle;
  let score = 0;
  let enemyHits = 0;
  let allyHits = 0;
  const full = UNITS[unit.type].dmg();
  for (const cell of splashCells(cx, cy)) {
    const tile = getTile(cell.x, cell.y);
    const scale = cell.center ? 1 : 0.5;
    const split = tile.unit && tile.city ? garrisonSplit(full * scale, tile.unit, { attacker: unit }) : null;
    if (tile.unit) {
      const self = tile.unit.id === unit.id;
      const ally = tile.unit.owner === unit.owner;
      const dmg = split ? split.toU : full * scale;
      const kill = tile.unit.hp <= dmg;
      const val = UNITS[tile.unit.type].cost / 40 + (kill ? 18 : 6);
      if (self) score -= 80;
      else if (ally) {
        allyHits += 1;
        score -= style === "conservative" ? val * 3.5 : val * 2.4;
      } else if (fogCanSeeEnemy(unit.owner, tile.unit)) {
        enemyHits += 1;
        score += val;
      }
    }
    if (tile.city) {
      const ally = tile.city.owner === unit.owner;
      const cityDmg = split ? split.toC : full * scale;
      const val = 22 + (tile.city.maxHp - tile.city.hp) * 2;
      if (ally) {
        allyHits += 1;
        score -= style === "conservative" ? val * 3 : val * 2.2;
      } else {
        enemyHits += 1;
        score += val;
        if (tile.city.hp <= cityDmg) score += 12 + (game.hold ? 10 : 0);
        if (unit.owner === cpuOwner()) {
          const camp = aiFocusCity() || campaignCity();
          if (camp && camp.x === tile.city.x && camp.y === tile.city.y) score += 24;
          else if (camp) score -= 10;
          const near = game.units.filter((u) => u.owner === cpuOwner() && !isAir(u) && !isAboard(u) && manh(u.x, u.y, tile.city.x, tile.city.y) <= 1).length;
          if (near && tile.city.hp <= 5) score -= 40;
        }
      }
    }
  }
  if (enemyHits === 0) return -999;
  if (allyHits > 0 && (style === "conservative" || aiDoctrine().campaignAttack)) return -999;
  if (allyHits > 0) score -= allyHits * 28;
  return score;
}

function bestMortarAim(unit) {
  const def = UNITS[unit.type];
  let best = null;
  let bestScore = game.aiStyle === "aggressive" ? 4 : game.aiStyle === "conservative" ? 16 : 8;
  const r = def.range;
  for (let y = Math.max(0, unit.y - r); y <= Math.min(game.h - 1, unit.y + r); y++) {
    for (let x = Math.max(0, unit.x - r); x <= Math.min(game.w - 1, unit.x + r); x++) {
      if (x === unit.x && y === unit.y) continue;
      if (cheb(unit.x, unit.y, x, y) > r) continue;
      if (shotBlocked(unit, "ground", x, y)) continue;
      const s = mortarAimScore(unit, x, y);
      if (s > bestScore) {
        bestScore = s;
        best = { x, y };
      }
    }
  }
  return best;
}

function shotValue(unit, x, y, mode) {
  const def = UNITS[unit.type];
  mode = mode || "ground";
  if (x === unit.x && y === unit.y) return -999;
  if (cheb(unit.x, unit.y, x, y) > attackRangeOf(unit, mode)) return -999;
  if (shotBlocked(unit, mode, x, y)) return -999;
  if (mode === "air") {
    const airs = flyingAirAt(x, y).filter((u) => u.id !== unit.id);
    if (!airs.length) return -999;
    const foe = airs.find((u) => u.owner !== unit.owner && fogCanSeeEnemy(unit.owner, u));
    const ally = airs.find((u) => u.owner === unit.owner);
    const target = foe || ally;
    const dmg = damageOf(unit, { unit: target, air: target }, "air");
    let s = 0;
    if (foe) {
      if (foe.hp <= dmg) s += 40 + UNITS[foe.type].cost / 24;
      else s += dmg * 5 + UNITS[foe.type].cost / 60;
    } else if (ally) {
      s -= game.aiStyle === "aggressive" ? 8 : 40;
    }
    return s;
  }
  const tile = getTile(x, y);
  if (tile.unit && tile.unit.owner !== unit.owner && !fogCanSeeEnemy(unit.owner, tile.unit)) {
    tile.unit = null;
    tile.ground = null;
    tile.navy = null;
  }
  if (def.noLand && !(tile.navy || (tile.unit && isNavy(tile.unit))) && !tile.ground && !tile.city && !tile.building) return -999;
  if (!tile.unit && !tile.city && !tile.building) return -999;
  const friendlyFire = isAir(unit);
  if (!friendlyFire) {
    if (tile.unit && tile.unit.owner === unit.owner) return -80;
    if (!tile.unit && tile.city && tile.city.owner === unit.owner) return -50;
    if (!tile.unit && !tile.city && tile.building && tile.building.owner === unit.owner) return -40;
  }
  const dmg = damageOf(unit, tile, "ground");
  const mit = isAir(unit) ? 0 : groundMitigation(unit, tile.unit, x, y, false);
  const split = tile.unit && tile.city ? garrisonSplit(dmg, tile.unit, { attacker: unit, mit }) : null;
  let s = 0;
  if (tile.unit) {
    const toU = split ? split.toU : dmg;
    const hit = split ? toU : Math.max(0, toU - mit);
    const val = tile.unit.hp <= hit ? 36 + UNITS[tile.unit.type].cost / 28 : hit * 4 + UNITS[tile.unit.type].cost / 70;
    if (tile.unit.owner === unit.owner) s -= val * (game.aiStyle === "aggressive" ? 0.5 : 2);
    else {
      s += val;
      if (unit.owner === cpuOwner()) s += aiObjectiveBonus(x, y);
      if (!def.splash && !isAir(unit)) {
        const atkDmg = meleeDmgVs(unit, tile.unit);
        const defDmg = meleeDmgVs(tile.unit, unit);
        const back = defDmg > atkDmg ? (defDmg - atkDmg) / 2 : 0;
        if (back >= unit.hp) s -= 80;
        else s -= back * 6;
      }
    }
  }
  if (tile.city) {
    const toC = split ? split.toC : dmg;
    const val = toC * 7 + (tile.city.maxHp - tile.city.hp) * 0.35 + (tile.city.hp <= toC ? 24 : 0);
    if (tile.city.owner === unit.owner) s -= val * (game.aiStyle === "aggressive" ? 0.4 : 2);
    else {
      s += val;
      if (unit.type === "siege") s += 10;
      if (unit.owner === cpuOwner()) {
        if (aiLostCities().some((c) => c.x === tile.city.x && c.y === tile.city.y)) s += 32;
        if (isWeakCity(tile.city, 14)) s += 20;
        const camp = aiFocusCity() || campaignCity();
        if (camp && camp.x === tile.city.x && camp.y === tile.city.y) s += aiDoctrine().campaignAttack ? 70 : 42;
        else if (camp && tile.city) s -= 14;
      }
    }
  }
  if (tile.building && !tile.unit && !tile.city) {
    const val = dmg * 5 + (tile.building.hp <= dmg ? 20 : 0);
    if (tile.building.owner === unit.owner) s -= 50;
    else s += val;
  }
  if (unit.owner === cpuOwner() && mode === "ground") {
    const win = aiFireWindow();
    if (tile.unit && tile.unit.owner !== unit.owner && isAaUnit(tile.unit)) {
      if (isAir(unit)) {
        const flak = aaFlakBacklash(unit, tile.unit);
        s -= 30 + flak * 16;
        if (aiIsHeavyAir(unit)) s -= 50;
      } else if (!win.ready) {
        s += 36 + (tile.unit.hp <= dmg ? 20 : 0);
      } else {
        s += 10;
      }
    }
    if (win.garrison && tile.unit && tile.unit.id === win.garrison.id && !isAir(unit)) {
      s += win.ready ? 8 : 28;
    }
    if (win.city && tile.city && tile.city.x === win.city.x && tile.city.y === win.city.y) {
      if (isAir(unit) && aiIsHeavyAir(unit) && !win.ready) s -= 40;
      else if (!isAir(unit) && !win.ready) s += 12;
    }
  }
  return s;
}

function collectShots(unit, mode) {
  mode = mode || "ground";
  const seen = new Set();
  const shots = [];
  const add = (x, y) => {
    const k = x + "," + y + ":" + mode;
    if (seen.has(k)) return;
    seen.add(k);
    const score = shotValue(unit, x, y, mode);
    if (score > -15) shots.push({ x, y, score, mode });
  };
  if (mode === "air") {
    for (const u of game.units) {
      if (isAir(u) && !u.parked && u.id !== unit.id && fogCanSeeEnemy(unit.owner, u)) add(u.x, u.y);
    }
  } else {
    for (const c of enemyCities()) add(c.x, c.y);
    for (const b of game.buildings) add(b.x, b.y);
    for (const u of game.units) {
      if (!isAir(u) && !isAboard(u) && u.id !== unit.id && fogCanSeeEnemy(unit.owner, u)) add(u.x, u.y);
    }
  }
  shots.sort((a, b) => b.score - a.score);
  return shots;
}

function bomberAimScore(unit, cx, cy) {
  const def = UNITS[unit.type];
  const style = game.aiStyle;
  const radius = def.splashRadius != null ? def.splashRadius : 1;
  const full = def.dmg();
  let score = 0;
  let enemyHits = 0;
  let allyHits = 0;
  for (const cell of splashCells(cx, cy, radius)) {
    const tile = getTile(cell.x, cell.y);
    const scale = def.splashFull || cell.center ? 1 : 0.5;
    const split = tile.unit && tile.city ? garrisonSplit(full * scale, tile.unit, { attacker: unit }) : null;
    if (tile.unit) {
      const self = tile.unit.id === unit.id;
      const ally = tile.unit.owner === unit.owner;
      const dmg = split ? split.toU : full * scale;
      const kill = tile.unit.hp <= dmg;
      const val = UNITS[tile.unit.type].cost / 40 + (kill ? 18 : 6);
      if (self) score -= 80;
      else if (ally) {
        allyHits += 1;
        score -= style === "conservative" ? val * 3.5 : val * 2.4;
      } else if (fogCanSeeEnemy(unit.owner, tile.unit)) {
        enemyHits += 1;
        score += val;
      }
    }
    if (tile.city) {
      const ally = tile.city.owner === unit.owner;
      const cityDmg = split ? split.toC : full * scale;
      const val = 22 + (tile.city.maxHp - tile.city.hp) * 2;
      if (ally) {
        allyHits += 1;
        score -= style === "conservative" ? val * 3 : val * 2.2;
      } else {
        enemyHits += 1;
        score += val;
        if (tile.city.hp <= cityDmg) score += 12 + (game.hold ? 10 : 0);
        if (unit.owner === cpuOwner()) {
          if (aiLostCities().some((c) => c.x === tile.city.x && c.y === tile.city.y)) score += 28;
          if (isWeakCity(tile.city, 14)) score += 16;
          const camp = aiFocusCity() || campaignCity();
          if (camp && camp.x === tile.city.x && camp.y === tile.city.y) score += 30;
          else if (camp) score -= 12;
          const near = game.units.filter((u) => u.owner === cpuOwner() && !isAir(u) && !isAboard(u) && manh(u.x, u.y, tile.city.x, tile.city.y) <= 1).length;
          if (near && tile.city.hp <= 5) score -= 40;
        }
      }
    }
    if (tile.building && !tile.unit) {
      const ally = tile.building.owner === unit.owner;
      const val = 14;
      if (ally) {
        allyHits += 1;
        score -= 20;
      } else {
        enemyHits += 1;
        score += val;
      }
    }
  }
  if (enemyHits === 0) return -999;
  if (allyHits > 0 && (style === "conservative" || aiDoctrine().campaignAttack)) return -999;
  if (allyHits > 0) score -= allyHits * 28;
  if (unit.owner === cpuOwner() && isAir(unit)) {
    const aaHit = aiShotHitsAa(unit, cx, cy, "ground");
    if (aaHit) {
      const flak = aaFlakBacklash(unit, aaHit);
      score -= 35 + flak * 18;
      if (aiIsHeavyAir(unit)) score -= 40;
    }
    const win = aiFireWindow();
    if (win.city && cheb(cx, cy, win.city.x, win.city.y) <= 2) {
      if (!win.ready) {
        if (win.aa.length) score -= 50;
        if (win.garrison && win.garrison.hp > 3) score -= 22;
      } else {
        score += 18;
      }
    }
  }
  return score;
}

function bestBomberAim(unit) {
  const r = attackRangeOf(unit, "ground");
  let best = null;
  let bestScore = game.aiStyle === "aggressive" ? 4 : game.aiStyle === "conservative" ? 16 : 8;
  for (let y = Math.max(0, unit.y - r); y <= Math.min(game.h - 1, unit.y + r); y++) {
    for (let x = Math.max(0, unit.x - r); x <= Math.min(game.w - 1, unit.x + r); x++) {
      if (x === unit.x && y === unit.y) continue;
      if (cheb(unit.x, unit.y, x, y) > r) continue;
      const s = bomberAimScore(unit, x, y);
      if (s > bestScore) {
        bestScore = s;
        best = { x, y, score: s, mode: "ground" };
      }
    }
  }
  return best;
}

function bestShotFrom(unit, x, y) {
  return withUnitAt(unit, x, y, () => {
    if (isAir(unit) || canShootAir(unit)) {
      let best = null;
      if (usesGroundSplash(unit, "ground")) {
        const aim = bestBomberAim(unit);
        if (aim) best = aim;
      } else {
        const g = collectShots(unit, "ground")[0];
        if (g) best = g;
      }
      const a = collectShots(unit, "air")[0];
      if (a && (!best || a.score > best.score)) best = a;
      return best;
    }
    if (UNITS[unit.type].splash) {
      const aim = bestMortarAim(unit);
      if (!aim) return null;
      return { x: aim.x, y: aim.y, score: mortarAimScore(unit, aim.x, aim.y), mode: "ground" };
    }
    return collectShots(unit, "ground")[0] || null;
  });
}

function meleeValue(unit, x, y) {
  if (isAir(unit)) return -999;
  const tile = getTile(x, y);
  if (tile.unit && tile.unit.owner !== unit.owner && !fogCanSeeEnemy(unit.owner, tile.unit)) {
    tile.unit = null;
    tile.ground = null;
    tile.navy = null;
  }
  if (!tile.unit && !tile.city && !tile.building) return -999;
  if (tile.unit && tile.unit.owner === unit.owner) return -999;
  if (!tile.unit && tile.city && tile.city.owner === unit.owner) return -999;
  if (!tile.unit && !tile.city && tile.building && tile.building.owner === unit.owner) return -999;
  const dmg = damageOf(unit, tile);
  const mit = groundMitigation(unit, tile.unit, x, y, true);
  const split = tile.unit && tile.city ? garrisonSplit(dmg, tile.unit, { isMelee: true, attacker: unit, mit }) : null;
  let s = 0;
  if (tile.city && tile.city.owner !== unit.owner) {
    const toC = split ? split.toC : dmg;
    const toU = split ? split.toU : 0;
    const locked = cityUncapturable(tile.city);
    s += locked ? toC * 2 : toC * 8;
    const canCap = !locked && tile.city.hp - toC <= 0 && (!tile.unit || tile.unit.hp - toU <= 0);
    if (canCap) s += 90 + (game.hold ? 10 : 0);
    else if (!locked && tile.city.hp - toC <= 0) s += 18 + (game.hold ? 8 : 0);
    else if (!locked && tile.city.hp <= 4) s += 10;
    else if (!locked && !canCap) {
      if (!tile.unit && tile.city.hp >= 6) s -= 60;
      else if (tile.city.hp >= 8) s -= 30;
    }
    if (unit.owner === cpuOwner()) {
      if (aiLostCities().some((c) => c.x === tile.city.x && c.y === tile.city.y)) s += 48;
      if (isWeakCity(tile.city, 14)) s += 22;
      const camp = aiFocusCity() || campaignCity();
      if (camp && camp.x === tile.city.x && camp.y === tile.city.y) s += aiDoctrine().campaignAttack ? 80 : 50;
      else if (camp && !canCap) s -= 16;
    }
  }
  if (tile.unit && tile.unit.owner !== unit.owner) {
    const toU = split ? split.toU : Math.max(0, dmg - mit);
    const atkDmg = meleeDmgVs(unit, tile.unit);
    const defDmg = meleeDmgVs(tile.unit, unit);
    const back = defDmg > atkDmg ? (defDmg - atkDmg) / 2 : 0;
    const capturing = tile.city && tile.city.owner !== unit.owner && !cityUncapturable(tile.city) && tile.city.hp - (split ? split.toC : dmg) <= 0 && (!tile.unit || tile.unit.hp - toU <= 0);
    if (back >= unit.hp && !capturing) s -= 70;
    else s -= back * 5;
    s += 6;
    if (tile.unit.hp <= toU) s += UNITS[tile.unit.type].cost / 18 + 28;
    else s += toU * 5 + UNITS[tile.unit.type].cost / 60;
    if (myCities().some((c) => manh(tile.unit.x, tile.unit.y, c.x, c.y) <= 2)) s += 16;
    if (unit.owner === cpuOwner()) s += aiObjectiveBonus(x, y);
  }
  if (tile.building && !tile.unit && !tile.city && tile.building.owner !== unit.owner) {
    s += dmg * 5 + (tile.building.hp <= dmg ? 22 : 4);
  }
  return s;
}

function aiMoveGoal(unit) {
  const style = game.aiStyle;
  const def = UNITS[unit.type];
  const flying = isAir(unit);
  const camp = campaignCity();
  const doc = aiDoctrine();

  if (unit.type === "engineer") {
    const job = aiEngineerJob(unit);
    if (job) return { x: job.standX, y: job.standY };
    const rush = (camp && !cityUncapturable(camp)) ? camp : nearestOfPath(unit, aiCapturableCities());
    if (rush && aiUnreachableFrom(unit.x, unit.y, rush.x, rush.y)) return nearestOfPath(unit, myCities());
    return rush;
  }
  if (unit.escorting) {
    const civ = escortPassenger(unit);
    if (civ && civ.type === "engineer") {
      const job = aiEngineerJob(civ);
      const dest = aiEscortDest(job, unit);
      if (dest) return dest;
    }
  }
  if (game.aiEscortMap && game.aiEscortMap[unit.id]) {
    const eng = unitById(game.aiEscortMap[unit.id]);
    if (eng && eng.hp > 0 && !isEscorted(eng)) return { x: eng.x, y: eng.y };
  }

  const miss = aiMission();
  // Even during capture/push, peel spare units toward a home-sector crisis
  if (!flying) {
    const crisisPull = aiReinforceCrisisGoal(unit);
    if (crisisPull) {
      const crisis = aiFindCrisis();
      if (crisis && (crisis.onHome || !(miss && (miss.kind === "capture" || miss.kind === "push" || miss.kind === "land")))) {
        return crisisPull;
      }
      if (crisis && miss && (miss.kind === "capture" || miss.kind === "push") && crisis.severity >= 3) {
        return crisisPull;
      }
    }
  }
  if (miss && miss.x != null && !flying) {
    if (miss.kind === "hold" || miss.kind === "defend") {
      if (def.soldier || unit.type === "at" || unit.type === "mg" || unit.type === "aa" || unit.type === "ifv" || isMilitaryGround(unit) || unit.type === "mortar" || unit.type === "siege" || unit.type === "spg") {
        const layered = aiDefenseGoal(unit, miss);
        if (layered) return layered;
        return { x: miss.x, y: miss.y };
      }
    }
    if (miss.kind === "land") {
      const pipe = aiNavalPipe();
      if (pipe.phase === "assault" && pipe.dest && !aiUnreachableFrom(unit.x, unit.y, pipe.dest.x, pipe.dest.y)) {
        return { x: pipe.dest.x, y: pipe.dest.y };
      }
      if (aiMayBoard(unit)) {
        const ship = adjacentTransport(unit) || aiBestPickupShip(unit);
        if (ship) return aiApproachShipTile(unit, ship) || { x: ship.x, y: ship.y };
        const muster = aiMusterCoast(unit);
        if (muster) return muster;
      }
    }
    if ((miss.kind === "capture" || miss.kind === "push" || miss.kind === "recap") && !aiShouldStayOnCity(unit)) {
      const win = aiFireWindow();
      if (!win.ready && (unit.type === "siege" || unit.type === "mortar" || unit.type === "spg" || unit.type === "at" || unit.type === "ifv" || unit.type === "light")) {
        if (win.aa && win.aa.length) {
          const aa = nearestOfPath(unit, win.aa) || nearestOf(unit, win.aa);
          if (aa) return aa;
        }
        if (win.garrison) return win.garrison;
      }
      if (!(def.soldier && doc.campaignAttack && aiGarrisonTargets().length && aiShouldStayOnCity(unit))) {
        const city = cityAt(miss.x, miss.y);
        if (!city || !cityUncapturable(city)) return { x: miss.x, y: miss.y };
      }
    }
  }
  if (miss && miss.x != null && flying) {
    if (miss.kind === "scout" && (unit.type === "fighter" || unit.type === "atk")) {
      return airApproach(unit, { x: miss.x, y: miss.y });
    }
    const win = aiFireWindow();
    if ((miss.kind === "capture" || miss.kind === "push" || miss.kind === "recap" || miss.kind === "land") && win.aa && win.aa.length && !win.ready) {
      if (unit.type === "atk" || unit.type === "fighter") {
        const aa = nearestOf(unit, win.aa);
        if (aa) return airApproach(unit, aa);
      }
      if (aiIsHeavyAir(unit)) {
        // Orbit short of the AA bubble until ground/atk clears it
        const home = nearestAirport(unit.owner, unit.x, unit.y);
        if (home && airWantsHangar(unit)) return home;
        const city = win.city || cityAt(miss.x, miss.y);
        if (city) {
          const safe = airApproach(unit, city);
          if (safe && win.aa.some((a) => cheb(safe.x, safe.y, a.x, a.y) <= 2)) {
            return home || { x: unit.x, y: unit.y };
          }
        }
      }
    }
    if (miss.kind === "capture" || miss.kind === "push" || miss.kind === "recap" || miss.kind === "land") {
      const city = cityAt(miss.x, miss.y);
      if (city && !cityUncapturable(city)) return airApproach(unit, city);
      return airApproach(unit, { x: miss.x, y: miss.y });
    }
    if (miss.kind === "defend" || miss.kind === "hold") {
      return airApproach(unit, { x: miss.x, y: miss.y });
    }
  }

  if (unit.type === "spaa") {
    const foeAir = game.units.filter((u) => u.owner === humanOwner() && isAir(u) && !u.parked && fogCanSeeEnemy(cpuOwner(), u));
    if (foeAir.length) {
      const nearCamp = camp ? foeAir.filter((u) => manh(u.x, u.y, camp.x, camp.y) <= 10) : foeAir;
      return nearestOf(unit, nearCamp.length ? nearCamp : foeAir);
    }
  }

  if (flying) {
    if (airWantsHangar(unit) && (style === "conservative" || unit.hp <= UNITS[unit.type].hp * 0.6)) {
      const home = nearestAirport(unit.owner, unit.x, unit.y);
      if (home) return home;
    }
    if (unit.type === "fighter") {
      const foeAir = game.units.filter((u) => u.owner === humanOwner() && isAir(u) && !u.parked && fogCanSeeEnemy(cpuOwner(), u));
      if (foeAir.length) return nearestOf(unit, foeAir);
    }
    if (camp && !cityUncapturable(camp)) return airApproach(unit, camp);
    const cities = weakEnemyCities();
    const cityGoal = cities[0] || nearestOf(unit, aiCapturableCities());
    if (cityGoal) return airApproach(unit, cityGoal);
    if (doc.campaignDefend) {
      const threatened = myCities().filter((c) => cityAboutToFall(c) || threatOn(c));
      if (threatened.length) return airApproach(unit, nearestOf(unit, threatened));
      const forts = ownerFortresses(cpuOwner());
      if (forts.length) return airApproach(unit, nearestOf(unit, forts));
    }
    if (doc.fog && (unit.type === "fighter" || unit.type === "atk")) {
      const scout = aiFogScoutGoal(unit);
      if (scout) return airApproach(unit, scout);
    }
    return null;
  }

  if (!flying && aiMayBoard(unit)) {
    const pipe = aiNavalPipe();
    if (pipe.phase === "assault" && pipe.dest && !aiUnreachableFrom(unit.x, unit.y, pipe.dest.x, pipe.dest.y)) {
      return { x: pipe.dest.x, y: pipe.dest.y };
    }
    const ship = adjacentTransport(unit) || aiBestPickupShip(unit);
    if (ship) return aiApproachShipTile(unit, ship) || { x: ship.x, y: ship.y };
    const muster = aiMusterCoast(unit);
    if (muster) return muster;
  }

  // Cross-map reinforce: spare rear / other-front units join the crisis mass
  if (!flying) {
    const reinforce = aiReinforceCrisisGoal(unit);
    if (reinforce) return reinforce;
  }

  const falling = myCities().filter((c) => cityAboutToFall(c) && !cityUncapturable(c)).sort((a, b) => a.hp - b.hp);
  const defender = !flying && (def.soldier || unit.type === "at" || unit.type === "mg" || unit.type === "aa");
  if (falling.length) {
    const c = nearestOfPath(unit, falling);
    if (c) {
      const near = aiPathDist(unit.x, unit.y, c.x, c.y) <= 8 || unit.hp < UNITS[unit.type].hp * 0.4;
      if (doc.campaignAttack) {
        if (defender || aiPathDist(unit.x, unit.y, c.x, c.y) <= 5) return c;
      } else if (defender || near) {
        return c;
      }
    }
  }

  if (doc.campaignAttack && defender) {
    const needs = aiGarrisonTargets();
    if (needs.length) return nearestOfPath(unit, needs);
    const here = cityAt(unit.x, unit.y);
    if (here && here.owner === cpuOwner() && !cityUncapturable(here)) return here;
  }

  if (doc.campaignDefend || (aiDefenseWantsLayers() && !doc.campaignAttack)) {
    const layered = aiDefenseGoal(unit, miss);
    if (layered) return layered;
    const remaining = aiCampaignRemainingHomes();
    const turtle = aiCampaignTurtle() || (remaining.length > 0 && remaining.length <= 2);
    if (turtle && remaining.length) {
      const threatened = remaining.filter((c) => cityAboutToFall(c) || threatOn(c)).sort((a, b) => a.hp - b.hp);
      const empty = remaining.filter((c) => !groundUnitAt(c.x, c.y));
      if (threatened.length) return nearestOfPath(unit, threatened);
      if (empty.length && defender) return nearestOfPath(unit, empty);
      return nearestOfPath(unit, remaining);
    }
    const threatened = myCities().filter((c) => cityAboutToFall(c) || threatOn(c)).sort((a, b) => a.hp - b.hp);
    if (threatened.length && defender) return nearestOfPath(unit, threatened);
    const forts = ownerFortresses(cpuOwner());
    if (forts.length) return aiPickOpenTile(unit, forts) || nearestOfPath(unit, forts);
    return remaining[0] || { x: (game.w / 2) | 0, y: unit.y };
  }
  if (doc.holdSoon && !flying && (def.soldier || isMilitaryGround(unit) || unit.type === "at" || unit.type === "mg" || unit.type === "aa")) {
    const park = myCities().filter((c) => !groundUnitAt(c.x, c.y) || threatOn(c) || cityAboutToFall(c));
    if (park.length) return nearestOfPath(unit, park);
  }
  if (doc.campaignAttack) {
    const aim = aiAttackCityForUnit(unit);
    if (aim && !cityUncapturable(aim)) return aim;
  }
  if (camp && !cityUncapturable(camp)) return camp;
  const lost = aiLostCities().filter((c) => !cityUncapturable(c));
  if (lost.length) return nearestOfPath(unit, lost);
  const weak = weakEnemyCities();
  return weak[0] || nearestOfPath(unit, aiCapturableCities());
}

function aiShotMin() {
  let base;
  if (aiEndgame().allin) base = 1;
  else if (aiDoctrine().campaignAttack) base = 2;
  else if (aiCountering()) base = 3;
  else if (aiEndgame().consolidate) base = game.aiStyle === "aggressive" ? 6 : 10;
  else base = game.aiStyle === "conservative" ? 12 : game.aiStyle === "aggressive" ? 4 : 7;
  const mul = aiDiff().shotMul;
  return Math.max(1, Math.round(base * mul));
}

async function aiFire(unit) {
  const def = UNITS[unit.type];
  if (!canUnitAttack(unit) || def.range <= 0 || unit.hp <= 0) return false;
  const minScore = aiShotMin();
  if (isAir(unit) || canShootAir(unit)) {
    let shot = bestShotFrom(unit, unit.x, unit.y);
    if (!shot || shot.score < minScore) return false;
    if (aiDiff().mistake > 0 && Math.random() < aiDiff().mistake && shot.score < minScore * 2.2) return false;
    if (isAir(unit) && (shot.mode || "ground") === "ground") {
      const aaHit = aiShotHitsAa(unit, shot.x, shot.y, "ground");
      const win = aiFireWindow();
      if (aiIsHeavyAir(unit)) {
        if (!aiEndgame().allin) {
          if (aaHit && !win.ready) return false;
          if (!win.ready && win.city && cheb(shot.x, shot.y, win.city.x, win.city.y) <= 2 && win.aa.length) return false;
        }
      } else if (unit.type === "atk" && aaHit && aaHit.hp > def.dmg() * 1.2 && win.aa.length > 1) {
        // Prefer peeling one AA only if kill is plausible; else leave to ground
        if (aaHit.hp > 4) return false;
      }
    }
    await doRanged(unit, shot.x, shot.y, shot.mode || "ground");
    if (def.attacks > 1 && unit.hp > 0 && canUnitAttack(unit)) {
      const again = bestShotFrom(unit, unit.x, unit.y);
      if (again && again.score >= minScore) {
        await sleep(180);
        await doRanged(unit, again.x, again.y, again.mode || "ground");
      }
    }
    return true;
  }
  if (def.splash) {
    const aim = bestMortarAim(unit);
    if (!aim || mortarAimScore(unit, aim.x, aim.y) < minScore) return false;
    await doRanged(unit, aim.x, aim.y, "ground");
    return true;
  }
  const shots = collectShots(unit, "ground");
  if (!shots[0] || shots[0].score < minScore) return false;
  await doRanged(unit, shots[0].x, shots[0].y, "ground");
  if (def.attacks > 1 && unit.hp > 0 && canUnitAttack(unit)) {
    const again = collectShots(unit, "ground");
    if (again[0] && again[0].score >= minScore) {
      await sleep(180);
      await doRanged(unit, again[0].x, again[0].y, "ground");
    }
  }
  return true;
}

async function aiActRanged(unit) {
  const def = UNITS[unit.type];
  const canMove = canUnitMove(unit);
  const canAtk = canUnitAttack(unit);
  if (!canMove && !canAtk) return;
  const noBoth = cannotMoveAndAttack(unit);
  const minScore = aiShotMin();
  let bestPos = { x: unit.x, y: unit.y };
  let bestShot = canAtk ? bestShotFrom(unit, unit.x, unit.y) : null;
  let bestScore = bestShot ? bestShot.score : -999;
  if (canMove) {
    const hereGood = !!(bestShot && bestShot.score >= minScore);
    if (!(noBoth && canAtk && hereGood)) {
      const stops = moveRange(unit).tiles;
      const camp = campaignCity();
      const nowD = camp ? manh(unit.x, unit.y, camp.x, camp.y) : 0;
      for (const t of stops) {
        const sh = bestShotFrom(unit, t.x, t.y);
        let sc = sh ? sh.score : -40;
        sc += tileTacticsBonus(unit, t.x, t.y);
        if (camp) {
          const closer = nowD - manh(t.x, t.y, camp.x, camp.y);
          sc += closer * (aiDoctrine().campaignAttack ? 12 : 7);
          if (sh && aiObjectiveBonus(sh.x, sh.y) < 0 && closer > 0) sc -= 10;
        }
        if (noBoth && canAtk && hereGood) sc -= 8;
        if (sc > bestScore) {
          bestScore = sc;
          bestPos = t;
          bestShot = sh;
        }
      }
    }
  }
  if (noBoth) {
    if (canAtk && bestShot && bestShot.score >= minScore && bestPos.x === unit.x && bestPos.y === unit.y) {
      await doRanged(unit, bestShot.x, bestShot.y, bestShot.mode || "ground");
      return;
    }
    if (canMove && (bestPos.x !== unit.x || bestPos.y !== unit.y)) {
      await doMove(unit, bestPos.x, bestPos.y);
      return;
    }
    const goal = aiMoveGoal(unit);
    if (canMove && goal) {
      const step = stepToward(unit, goal.x, goal.y);
      if (step) await doMove(unit, step.x, step.y);
    }
    return;
  }
  if (canMove && (bestPos.x !== unit.x || bestPos.y !== unit.y)) {
    await doMove(unit, bestPos.x, bestPos.y);
  } else if (canMove && !(bestShot && bestShot.score >= minScore)) {
    const goal = aiMoveGoal(unit);
    if (goal) {
      const dest = airApproach(unit, goal) || goal;
      const step = stepToward(unit, dest.x, dest.y);
      if (step) await doMove(unit, step.x, step.y);
    }
  }
  if (unit.hp > 0 && canUnitAttack(unit)) await aiFire(unit);
}

async function aiActUnit(unit) {
  if (unit.justDeployed || unit.hp <= 0 || isAboard(unit)) return;
  if (fogActive()) refreshFogMaps();
  if (aiShouldStayOnCity(unit)) {
    if (UNITS[unit.type] && UNITS[unit.type].range > 0 && canUnitAttack(unit)) await aiFire(unit);
    return;
  }
  if (!isAir(unit) && !isNavy(unit) && !isCivilian(unit) && aiMayBoard(unit)) {
    const ship = adjacentTransport(unit);
    if (ship && !canBoardTransport(ship, unit)) {
      boardTransport(ship, unit);
      return;
    }
  }

  const escortEngId = game.aiEscortMap && game.aiEscortMap[unit.id];
  if (isMilitaryGround(unit) && !unit.escorting && !isImmobile(unit)) {
    const civ = adjacentCivilian(unit);
    if (civ) {
      if (escortEngId) {
        if (escortEngId === civ.id) formEscort(unit, civ);
      } else {
        const reserved = Object.values(game.aiEscortMap || {}).includes(civ.id);
        if (!reserved && civ.type === "engineer" && aiEscortAllowed(unit) && !aiIsSoleAssaultEscort(unit)) {
          const job = aiEngineerJob(civ);
          if (job && aiEngineerJobWorth(job)) formEscort(unit, civ);
        } else if (!reserved && civ.type !== "engineer") {
          formEscort(unit, civ);
        }
      }
    }
  }
  if (escortEngId && !unit.escorting && isMilitaryGround(unit)) {
    const eng = unitById(escortEngId);
    if (eng && eng.hp > 0 && !isEscorted(eng)) {
      if (cheb(unit.x, unit.y, eng.x, eng.y) === 1) formEscort(unit, eng);
      else {
        if (canUnitAttack(unit) && UNITS[unit.type].range > 0) await aiFire(unit);
        if (unit.hp > 0 && canUnitMove(unit)) {
          const step = stepToward(unit, eng.x, eng.y);
          if (step) await doMove(unit, step.x, step.y);
        }
        if (unit.hp > 0 && !unit.escorting && cheb(unit.x, unit.y, eng.x, eng.y) === 1) formEscort(unit, eng);
      }
    }
  }
  if (unit.escorting) {
    const civ = escortPassenger(unit);
    if (civ && civ.type === "engineer") {
      const job = aiEngineerJob(civ);
      if (job) {
        const work = { x: job.standX, y: job.standY };
        const dest = aiEscortDest(job, unit) || work;
        if (cheb(unit.x, unit.y, work.x, work.y) === 1) {
          aiUnescortForJob(unit, work);
          return;
        }
        if (UNITS[unit.type].range > 0 && canUnitAttack(unit)) await aiFire(unit);
        if (unit.hp > 0 && canUnitMove(unit)) {
          const step = stepToward(unit, dest.x, dest.y);
          if (step) await doMove(unit, step.x, step.y);
        }
        if (unit.hp > 0 && unit.escorting && cheb(unit.x, unit.y, work.x, work.y) === 1) aiUnescortForJob(unit, work);
        return;
      }
    }
  }

  if (isCivilian(unit)) {
    if (unit.type === "engineer" && !isEscorted(unit)) {
      const job = aiEngineerJob(unit);
      const assigned = game.units.find((u) => game.aiEscortMap && game.aiEscortMap[u.id] === unit.id);
      if (assigned && !isEscorted(unit) && cheb(assigned.x, assigned.y, unit.x, unit.y) > 1 && cheb(assigned.x, assigned.y, unit.x, unit.y) <= 5) {
        return;
      }
      if (job) {
        if (job.kind === "fortress" && unit.x === job.x && unit.y === job.y && game.money[cpuOwner()] >= 500) {
          const err = tryBuildFortressHere(unit);
          if (!err) return;
        }
        if (job.kind === "road" && unit.x === job.x && unit.y === job.y && game.money[cpuOwner()] >= 75) {
          const err = tryPaveRoad(unit);
          if (!err) return;
        }
        if (job.kind === "tunnel" && game.money[cpuOwner()] >= 300) {
          const pk = nearbyPeaks(unit).find((p) => p.x === job.x && p.y === job.y)
            || nearbyPeaks(unit).find((p) => (game.aiCampaign.tunnels || []).some((t) => t.x === p.x && t.y === p.y && isPeakAt(t.x, t.y)));
          if (pk) {
            const err = tryDigTunnel(unit, pk.x, pk.y);
            if (!err) return;
          }
        }
      } else if (game.money[cpuOwner()] >= 75 && terrainAt(unit.x, unit.y) === TERRAIN.PLAIN && !cityAt(unit.x, unit.y) && aiTileThreat(cpuOwner(), unit.x, unit.y) < 4
        && !aiEndgame().allin && aiRoadOnMainAxis(unit.x, unit.y)) {
        const err = tryPaveRoad(unit);
        if (!err) return;
      }
    }
    if (unit.hp > 0 && canUnitMove(unit)) {
      const goal = aiMoveGoal(unit) || nearestOf(unit, aiCapturableCities());
      if (goal) {
        const step = stepToward(unit, goal.x, goal.y);
        if (step) await doMove(unit, step.x, step.y);
      }
    }
    return;
  }
  if (isNavy(unit)) {
    if (unit.type === "transport") {
      const pipe = aiNavalPipe();
      const land = pipe.dest || aiLandingTarget();
      const beach = pipe.beach || aiNavalBeachStand(land);
      // Pick up adjacent waiters first
      const near = game.units.filter((u) => u.owner === cpuOwner() && aiMayBoard(u) && cheb(u.x, u.y, unit.x, unit.y) <= 1);
      let boarded = false;
      for (const u of near) {
        if (!canBoardTransport(unit, u)) {
          boardTransport(unit, u);
          boarded = true;
        }
      }
      const cargo = transportCargo(unit);
      if (cargo.length) {
        // Hold for stragglers if not ready and not already at beach
        if (!aiNavalCargoReady(unit) && !aiNavalCanUnload(unit, beach) && near.some((u) => aiMayBoard(u) && aiShipHasRoom(unit, u))) {
          return;
        }
        if (aiNavalCanUnload(unit, beach) || (beach && manh(unit.x, unit.y, beach.x, beach.y) <= 2 && aiNavalCargoReady(unit))) {
          unloadTransport(unit);
          return;
        }
        if (canUnitMove(unit) && beach) {
          const stand = navyCanStand(beach.x, beach.y) ? beach : (aiNavyStandNear(beach.x, beach.y) || beach);
          const step = stepToward(unit, stand.x, stand.y);
          if (step) await doMove(unit, step.x, step.y);
        }
        if (unit.hp > 0 && aiNavalCanUnload(unit, beach)) unloadTransport(unit);
        return;
      }
      if (boarded) return;
      const pick = aiTransportPickupGoal(unit);
      if (canUnitMove(unit) && pick) {
        const stand = navyCanStand(pick.x, pick.y) ? pick : aiNavyStandNear(pick.x, pick.y);
        if (stand) {
          const step = stepToward(unit, stand.x, stand.y);
          if (step) await doMove(unit, step.x, step.y);
        }
      }
      // After moving, try board again
      if (unit.hp > 0) {
        const again = game.units.filter((u) => u.owner === cpuOwner() && aiMayBoard(u) && cheb(u.x, u.y, unit.x, unit.y) <= 1);
        for (const u of again) {
          if (!canBoardTransport(unit, u)) boardTransport(unit, u);
        }
      }
      return;
    }
    await aiActRanged(unit);
    if (unit.hp > 0 && canUnitMove(unit) && canUnitAttack(unit)) {
      const meleeNow = meleeTargets(unit)[0];
      if (meleeNow) await doMelee(unit, meleeNow.x, meleeNow.y);
    }
    if (unit.hp > 0 && canUnitMove(unit)) {
      const camp = campaignCity();
      const foeShip = game.units.filter((u) => u.owner === humanOwner() && isNavy(u) && fogCanSeeEnemy(cpuOwner(), u)).sort((a, b) => manh(unit.x, unit.y, a.x, a.y) - manh(unit.x, unit.y, b.x, b.y))[0];
      const pipe = aiNavalPipe();
      const land = pipe.dest || aiLandingTarget();
      const boats = game.units.filter((u) => u.owner === cpuOwner() && u.type === "transport" && u.hp > 0);
      const loaded = boats.filter((t) => transportCargo(t).length).sort((a, b) => manh(unit.x, unit.y, a.x, a.y) - manh(unit.x, unit.y, b.x, b.y))[0]
        || boats[0];
      const coast = land || (camp && !cityUncapturable(camp) && cityTouchesOcean(camp) ? camp : null) || aiCapturableCities().filter((c) => cityTouchesOcean(c))[0];
      let goal = foeShip || aiMoveGoal(unit);
      if (pipe.phase === "sail" || pipe.phase === "beach" || pipe.phase === "embark") {
        goal = loaded || coast || goal;
      } else if (loaded && land) {
        goal = loaded;
      } else {
        goal = coast || goal;
      }
      if (goal) {
        const step = stepToward(unit, goal.x, goal.y);
        if (step) await doMove(unit, step.x, step.y);
      }
    }
    if (unit.hp > 0 && canUnitAttack(unit)) await aiFire(unit);
    return;
  }
  if (isAir(unit)) {
    if (unit.parked) {
      const hurt = airWantsHangar(unit);
      const urgent = aiCountering() || (unit.type === "fighter" && game.units.some((n) => n.owner === humanOwner() && isAir(n) && !n.parked && fogCanSeeEnemy(cpuOwner(), n)));
      if (hurt && !(urgent && unit.hp > UNITS[unit.type].hp * 0.4)) return;
      if (!canTakeOff(unit)) return;
      doTakeOff(unit);
    }
    await aiActRanged(unit);
    if (unit.hp > 0 && canLand(unit) && airWantsHangar(unit)) doLand(unit);
    return;
  }
  const def = UNITS[unit.type];
  const style = game.aiStyle;
  const canMeleeNow = canUnitMove(unit) && canUnitAttack(unit);

  if (canMeleeNow) {
    const caps = [];
    for (const c of aiCapturableCities()) {
      const { dist } = bfs(unit, moveBudget(unit), { x: c.x, y: c.y });
      const d = dist[c.x + c.y * game.w];
      if (d > 0 && d <= moveBudget(unit)) {
        const dmg = damageOf(unit, getTile(c.x, c.y));
        const occ = getTile(c.x, c.y).unit;
        const split = occ ? garrisonSplit(dmg, occ, { isMelee: true, attacker: unit }) : null;
        const cityDmg = split ? split.toC : dmg;
        if (c.hp - cityDmg <= 0 && (!occ || occ.hp - (split ? split.toU : 0) <= 0)) caps.push(c);
      }
    }
    if (caps.length) {
      const t = nearestOf(unit, caps);
      await doMelee(unit, t.x, t.y);
      return;
    }
  }

  if (game.over) return;
  let meleeBest = null, meleeScore = -1;
  if (canMeleeNow && unit.hp > 0) {
    for (const t of meleeTargets(unit)) {
      const score = meleeValue(unit, t.x, t.y);
      if (score > meleeScore) {
        meleeScore = score;
        meleeBest = t;
      }
    }
  }
  if (game.fog && meleeBest && !fogVisible(cpuOwner(), meleeBest.x, meleeBest.y)) {
    const visCity = cityAt(meleeBest.x, meleeBest.y);
    const visBld = buildingAt(meleeBest.x, meleeBest.y);
    const known = (visCity && fogStructureMode(cpuOwner(), visCity) !== "hide")
      || (visBld && fogStructureMode(cpuOwner(), visBld) !== "hide");
    if (!known) {
      meleeBest = null;
      meleeScore = -1;
    }
  }
  const meleeMin = Math.max(1, Math.round((aiEndgame().allin ? 3 : (aiCountering() ? 6 : style === "aggressive" ? 8 : style === "conservative" ? 18 : 12)) * aiDiff().meleeMul));
  let shotNow = null;
  if (def.range > 0 && canUnitAttack(unit)) shotNow = bestShotFrom(unit, unit.x, unit.y);
  const shotScore = shotNow ? shotNow.score : -999;
  if (meleeBest && meleeScore >= meleeMin && meleeScore + 4 >= shotScore) {
    const camp = campaignCity();
    const local = camp && manh(meleeBest.x, meleeBest.y, camp.x, camp.y) > 8
      && !myCities().some((c) => cityAboutToFall(c) && manh(meleeBest.x, meleeBest.y, c.x, c.y) <= 4);
    if (!(local && meleeScore < meleeMin + 22)) {
      await doMelee(unit, meleeBest.x, meleeBest.y);
      return;
    }
  }

  if (def.range > 0) {
    await aiActRanged(unit);
    return;
  }

  if (unit.hp > 0 && canUnitMove(unit)) {
    const goal = aiMoveGoal(unit);
    if (goal) {
      const dest = airApproach(unit, goal) || goal;
      const step = stepToward(unit, dest.x, dest.y);
      if (step) await doMove(unit, step.x, step.y);
    }
  }
}

function aiUnitPriority(u) {
  let p = UNITS[u.type].cost;
  const def = UNITS[u.type];
  if (u.escorting) p += 5200;
  if (game.aiEscortMap && game.aiEscortMap[u.id]) p += 4600;
  if (u.type === "engineer") p += 1700;
  if (canUnitMove(u) && canUnitAttack(u) && !isAir(u)) {
    for (const c of aiCapturableCities()) {
      const { dist } = bfs(u, moveBudget(u), { x: c.x, y: c.y });
      const d = dist[c.x + c.y * game.w];
      if (d > 0 && d <= moveBudget(u)) {
        const tile = getTile(c.x, c.y);
        const dmg = damageOf(u, tile);
        const occ = tile.unit;
        const split = occ ? garrisonSplit(dmg, occ, { isMelee: true, attacker: u }) : null;
        if (c.hp - (split ? split.toC : dmg) <= 0 && (!occ || occ.hp - (split ? split.toU : 0) <= 0)) {
          p += 8000;
          const camp = campaignCity();
          if (camp && camp.x === c.x && camp.y === c.y) p += 2500;
          if (aiLostCities().some((x) => x.x === c.x && x.y === c.y)) p += 1800;
        }
      }
    }
  }
  if (isAir(u)) p += 500;
  const camp = campaignCity();
  if (camp && manh(u.x, u.y, camp.x, camp.y) <= def.move + 8) p += 1400;
  const falling = myCities().filter((c) => cityAboutToFall(c));
  if (falling.some((c) => manh(u.x, u.y, c.x, c.y) <= 7)) p += 900;
  const win = aiFireWindow();
  if (win && !win.ready) {
    if (u.type === "siege" || u.type === "mortar" || u.type === "spg" || u.type === "atk") p += 3200;
    if (u.type === "ifv" || u.type === "light" || u.type === "at") p += 1800;
    if (aiIsHeavyAir(u)) p -= 2500;
  } else if (win && win.ready && aiIsHeavyAir(u)) {
    p += 2200;
  }
  const pipeP = aiNavalPipe();
  if (pipeP.phase === "sail" || pipeP.phase === "beach" || pipeP.phase === "embark") {
    if (u.type === "transport") p += 2800;
    if (u.type === "destroyer" || u.type === "cruiser" || u.type === "battleship") p += 1600;
    if (aiMayBoard(u)) p += 900;
  } else if (pipeP.phase === "muster" && aiMayBoard(u)) {
    p += 700;
  } else if (pipeP.phase === "assault" && !isNavy(u) && !isAir(u) && !isAboard(u)) {
    p += 1100;
  }
  const egP = aiEndgame();
  if (egP.allin) {
    if (u.type === "siege" || u.type === "hbomber" || u.type === "mortar" || u.type === "spg") p += 2400;
    if (u.type === "line" || u.type === "ifv" || u.type === "light") p += 900;
  } else if (egP.holdPark || egP.consolidate) {
    if (UNITS[u.type] && UNITS[u.type].soldier) p += 1200;
    if (u.type === "mg" || u.type === "aa" || u.type === "at") p += 800;
  }
  return p;
}

async function runAI() {
  const me = cpuOwner();
  if (fogActive()) refreshFogMaps();
  aiResetPathCache();
  $("ai-banner").classList.remove("hidden");
  adaptAiStyle();
  aiPlanCampaign();
  aiPlanTurnMission();
  if (typeof aiFindCrisis === "function") aiFindCrisis();
  const miss = aiMission();
  const pipe = aiNavalPipe();
  const egB = aiEndgame();
  const side = me === "ai" ? "红方" : "蓝方";
  const lab = (miss && miss.kind === "land" && pipe.label) ? pipe.label
    : ((egB.allin || egB.holdPark || egB.consolidate) && miss && miss.label) ? miss.label
    : (miss && miss.label);
  const diffBit = aiDiff().id !== "normal" ? `（${aiDiff().label}）` : "";
  $("ai-banner").textContent = lab
    ? `${side}${diffBit}：${lab}…`
    : `${side}${diffBit}正在行动…`;
  await sleep(220);
  aiBuyPhase();
  updatePills();
  const units = game.units.filter((u) => u.owner === me && !u.justDeployed);
  units.sort((a, b) => aiUnitPriority(b) - aiUnitPriority(a));
  for (const u of units) {
    if (game.over) break;
    if (!game.units.includes(u)) continue;
    await aiActUnit(u);
    await sleep(140);
  }
  $("ai-banner").classList.add("hidden");
}

async function kickoffCpuIfNeeded() {
  if (!game || game.over || game.tutorial || game.editor || game.mode !== "vsai") return;
  if (actingOwner() !== cpuOwner()) return;
  game.busy = true;
  updatePills();
  renderInspect();
  if (game.turn >= 1) beginTurn(cpuOwner());
  await runAI();
  if (!game || game.over) return;
  settleIdle(cpuOwner());
  if (cpuOwner() === "player") prepareRedTurn();
  else finishRoundToBlue();
  game.busy = false;
  updatePills();
}

function worldX(x, y) {
  return cam.x + x * CELL * cam.zoom;
}
function worldY(x, y) {
  return cam.y + y * CELL * cam.zoom;
}

function drawUnitIcon(ctx, type, color, cx, cy, s) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s / 20, s / 20);
  ctx.strokeStyle = "#0b0e0b";
  ctx.lineWidth = 1.2;
  ctx.fillStyle = color;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const hull = () => {
    ctx.beginPath();
    ctx.roundRect(-8, -5, 16, 10, 2);
    ctx.fill();
    ctx.stroke();
  };
  if (type === "line" || type === "elite") {
    ctx.beginPath();
    ctx.arc(0, -3.2, type === "elite" ? 3.4 : 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-4, 1);
    ctx.lineTo(0, 8);
    ctx.lineTo(4, 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(3, 0);
    ctx.lineTo(10, -2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    if (type === "elite") {
      ctx.fillStyle = "#f3e2a1";
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(1.4, -5);
      ctx.lineTo(-1.4, -5);
      ctx.fill();
    }
  } else if (type === "engineer") {
    ctx.beginPath();
    ctx.arc(0, -3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-4, 1);
    ctx.lineTo(0, 8);
    ctx.lineTo(4, 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.rotate(0.5);
    ctx.fillRect(2, -1, 8, 2.2);
    ctx.fillRect(8, -2.4, 2.4, 5);
    ctx.restore();
  } else if (type === "ifv") {
    hull();
    ctx.fillRect(-6, 3.5, 3, 2.5);
    ctx.fillRect(3, 3.5, 3, 2.5);
    ctx.fillRect(-6, -8.5, 3, 2.5);
    ctx.fillRect(3, -8.5, 3, 2.5);
    ctx.fillRect(4, -1.5, 8, 2);
  } else if (type === "transport" || type === "destroyer" || type === "cruiser" || type === "battleship" || type === "carrier") {
    const big = type === "battleship" || type === "carrier";
    ctx.beginPath();
    ctx.moveTo(big ? -12 : -10, 0);
    ctx.lineTo(big ? -8 : -6, -5);
    ctx.lineTo(big ? 8 : 7, -5);
    ctx.lineTo(big ? 12 : 10, 0);
    ctx.lineTo(big ? 8 : 7, 5);
    ctx.lineTo(big ? -8 : -6, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (type === "carrier") {
      ctx.fillRect(-6, -1.4, 12, 2.8);
    } else if (type === "transport") {
      ctx.fillRect(-4, -2, 8, 4);
    } else {
      ctx.fillRect(2, -1.2, type === "battleship" ? 10 : 8, 2.4);
    }
  } else if (type === "light" || type === "heavy") {
    ctx.beginPath();
    ctx.roundRect(type === "heavy" ? -10 : -8, -6, type === "heavy" ? 20 : 16, 12, 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-1, 0, type === "heavy" ? 4 : 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(2, -1.2, type === "heavy" ? 12 : 9, 2.4);
  } else if (type === "spg") {
    hull();
    ctx.translate(0, -1);
    ctx.rotate(-0.7);
    ctx.fillRect(0, -1.4, 12, 2.8);
  } else if (type === "at") {
    ctx.beginPath();
    ctx.moveTo(-8, 6);
    ctx.lineTo(-2, -6);
    ctx.lineTo(4, -6);
    ctx.lineTo(8, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(0, -2, 13, 2);
  } else if (type === "coast") {
    ctx.beginPath();
    ctx.roundRect(-9, -2, 18, 10, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-7, 7, 5, 3);
    ctx.fillRect(2, 7, 5, 3);
    ctx.fillRect(-4, -6, 8, 5);
    ctx.save();
    ctx.translate(2, -1);
    ctx.rotate(-0.4);
    ctx.fillRect(0, -2, 14, 3.6);
    ctx.restore();
  } else if (type === "siege") {
    ctx.beginPath();
    ctx.arc(-4, 4, 4, 0, Math.PI * 2);
    ctx.arc(5, 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-6, -2, 12, 5);
    ctx.rotate(-0.5);
    ctx.fillRect(0, -3, 11, 4);
  } else if (type === "mg") {
    ctx.beginPath();
    ctx.arc(-4, -2, 2.4, 0, Math.PI * 2);
    ctx.arc(3, -2, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-7, 2, 14, 5);
    ctx.fillRect(2, -1, 10, 2);
  } else if (type === "aa") {
    ctx.beginPath();
    ctx.arc(0, 4, 6.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-5, 1, 10, 3);
    ctx.fillRect(-1.6, -11, 3.2, 14);
    ctx.fillRect(-3.5, -12, 7, 2.6);
  } else if (type === "spaa") {
    hull();
    ctx.fillRect(-6, 3.5, 3, 2.5);
    ctx.fillRect(3, 3.5, 3, 2.5);
    ctx.fillRect(-1.4, -11, 2.8, 12);
    ctx.fillRect(-3.2, -12, 6.4, 2.4);
  } else if (type === "mortar") {
    ctx.beginPath();
    ctx.roundRect(-7, -2, 14, 8, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-6, 5, 4, 3);
    ctx.fillRect(2, 5, 4, 3);
    ctx.save();
    ctx.translate(-1, 0);
    ctx.rotate(-1.05);
    ctx.fillRect(0, -1.6, 13, 3.2);
    ctx.fillStyle = "#0b0e0b";
    ctx.fillRect(11, -1, 3, 2);
    ctx.restore();
  } else if (type === "atk") {
    ctx.beginPath();
    ctx.moveTo(11, 0);
    ctx.lineTo(-4, -3);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-4, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-1, 0);
    ctx.lineTo(-8, -7);
    ctx.lineTo(-3, 0);
    ctx.lineTo(-8, 7);
    ctx.closePath();
    ctx.fill();
  } else if (type === "fighter") {
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-2, -2.4);
    ctx.lineTo(-9, 0);
    ctx.lineTo(-2, 2.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(-6, -8);
    ctx.lineTo(-2, 0);
    ctx.lineTo(-6, 8);
    ctx.closePath();
    ctx.fill();
  } else if (type === "lbomber" || type === "hbomber") {
    const big = type === "hbomber";
    ctx.beginPath();
    ctx.roundRect(big ? -11 : -9, big ? -4.2 : -3.4, big ? 22 : 18, big ? 8.4 : 6.8, 3);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-2, 0);
    ctx.lineTo(big ? -10 : -8, big ? -9 : -7);
    ctx.lineTo(2, 0);
    ctx.lineTo(big ? -10 : -8, big ? 9 : 7);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(big ? 6 : 5, -1.2, 6, 2.4);
  }
  ctx.restore();
}

function draw() {
  const canvas = $("board");
  if (!canvas) return;
  const { w, h, dpr } = resizeCanvas();
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (!game) return;

  if (fogActive()) refreshFogMaps();
  const fogOn = fogActive();
  const fogWho = fogOn ? fogViewer() : null;
  const fogVisArr = fogOn && fogWho && game.fogVis ? game.fogVis[fogWho] : null;
  const fogSeenArr = fogOn && fogWho && game.fogSeen ? game.fogSeen[fogWho] : null;
  const fogI = (x, y) => x + y * game.w;

  const airView = isAirLayer();
  ctx.fillStyle = airView ? "#0c141c" : "#10160f";
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(cam.x, cam.y);
  ctx.scale(cam.zoom, cam.zoom);

  const z = cam.zoom;
  const x0 = clamp(Math.floor(-cam.x / z / CELL) - 1, 0, game.w);
  const y0 = clamp(Math.floor(-cam.y / z / CELL) - 1, 0, game.h);
  const x1 = clamp(Math.ceil((w - cam.x) / z / CELL) + 1, 0, game.w);
  const y1 = clamp(Math.ceil((h - cam.y) / z / CELL) + 1, 0, game.h);

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const ter = terrainAt(x, y);
      const n = (x * 19 + y * 13) % 5;
      if (airView) {
        if (ter === TERRAIN.OCEAN) ctx.fillStyle = n < 2 ? "#143a58" : n < 4 ? "#12344e" : "#164262";
        else if (ter === TERRAIN.FOREST) ctx.fillStyle = n < 2 ? "#1a3030" : "#16282c";
        else if (ter === TERRAIN.PEAK) ctx.fillStyle = n < 2 ? "#4a4e54" : "#3e4248";
        else if (ter === TERRAIN.TUNNEL) ctx.fillStyle = n < 2 ? "#2a2e34" : "#24282e";
        else if (ter === TERRAIN.HILL) ctx.fillStyle = n < 2 ? "#2c3438" : "#262e34";
        else if (ter === TERRAIN.ROAD) ctx.fillStyle = n < 2 ? "#3a4030" : "#32382a";
        else ctx.fillStyle = n < 2 ? "#243848" : n < 4 ? "#1e3344" : "#1a2d3c";
      } else if (ter === TERRAIN.OCEAN) {
        ctx.fillStyle = n < 2 ? "#1b5a7e" : n < 4 ? "#185272" : "#22688c";
      } else if (ter === TERRAIN.FOREST) {
        ctx.fillStyle = n < 2 ? "#1f3a1e" : n < 4 ? "#1a3319" : "#243f22";
      } else if (ter === TERRAIN.PEAK) {
        ctx.fillStyle = n < 2 ? "#6a6870" : n < 4 ? "#5c5a62" : "#74727a";
      } else if (ter === TERRAIN.HILL) {
        ctx.fillStyle = n < 2 ? "#4a4436" : n < 4 ? "#403a2e" : "#524c3c";
      } else if (ter === TERRAIN.ROAD) {
        ctx.fillStyle = n < 2 ? "#8a7a4a" : "#7a6c42";
      } else if (ter === TERRAIN.TUNNEL) {
        ctx.fillStyle = n < 2 ? "#3a3c42" : "#2e3036";
      } else {
        ctx.fillStyle = n < 2 ? "#3a4a32" : n < 4 ? "#33442d" : "#2f3e2a";
      }
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
  }

  for (const c of game.cities) {
    if (fogOn && c.owner !== fogWho && !(fogVisArr && fogVisArr[fogI(c.x, c.y)])) continue;
    const landCol = airView
      ? (c.owner === "player" ? "rgba(58,140,220,0.12)" : "rgba(210,70,64,0.12)")
      : (c.owner === "player" ? "rgba(58,140,220,0.28)" : "rgba(210,70,64,0.28)");
    const oceanCol = airView
      ? (c.owner === "player" ? "rgba(80,190,255,0.22)" : "rgba(224,86,78,0.22)")
      : (c.owner === "player" ? "rgba(70,210,255,0.42)" : "rgba(232,92,82,0.42)");
    const cr = cityControlRadius();
    for (let dy = -cr; dy <= cr; dy++) {
      for (let dx = -cr; dx <= cr; dx++) {
        const x = c.x + dx, y = c.y + dy;
        if (!inBounds(x, y)) continue;
        if (controlOwner(x, y) !== c.owner) continue;
        ctx.fillStyle = isOceanAt(x, y) ? oceanCol : landCol;
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
  }

  for (const b of game.buildings) {
    if (b.type !== "fortress") continue;
    if (fogOn && b.owner !== fogWho && !(fogVisArr && fogVisArr[fogI(b.x, b.y)])) continue;
    const landCol = airView
      ? (b.owner === "player" ? "rgba(58,140,220,0.08)" : "rgba(210,70,64,0.08)")
      : (b.owner === "player" ? "rgba(58,140,220,0.18)" : "rgba(210,70,64,0.18)");
    const oceanCol = airView
      ? (b.owner === "player" ? "rgba(80,190,255,0.16)" : "rgba(224,86,78,0.16)")
      : (b.owner === "player" ? "rgba(70,210,255,0.32)" : "rgba(232,92,82,0.32)");
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = b.x + dx, y = b.y + dy;
        if (!inBounds(x, y)) continue;
        ctx.fillStyle = isOceanAt(x, y) ? oceanCol : landCol;
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
  }

  if (z > 0.5) {
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        if (fogOn && fogSeenArr && !fogSeenArr[fogI(x, y)]) continue;
        const ter = terrainAt(x, y);
        if (ter === TERRAIN.PLAIN) continue;
        const n = (x * 19 + y * 13) % 5;
        const px = x * CELL, py = y * CELL;
        if (ter === TERRAIN.FOREST) {
          ctx.fillStyle = airView ? "rgba(40, 90, 70, 0.4)" : "rgba(16, 48, 18, 0.62)";
          ctx.beginPath();
          ctx.arc(px + 12 + (n % 3), py + 16, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px + 26, py + 14, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px + 20, py + 26, 5.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (ter === TERRAIN.HILL) {
          ctx.fillStyle = airView ? "rgba(160, 170, 150, 0.28)" : "rgba(90, 80, 58, 0.62)";
          ctx.beginPath();
          ctx.moveTo(px + 6, py + 30);
          ctx.lineTo(px + 20, py + 8);
          ctx.lineTo(px + 34, py + 30);
          ctx.closePath();
          ctx.fill();
        } else if (ter === TERRAIN.PEAK) {
          ctx.fillStyle = airView ? "rgba(180, 185, 190, 0.4)" : "rgba(70, 72, 78, 0.85)";
          ctx.beginPath();
          ctx.moveTo(px + 4, py + 32);
          ctx.lineTo(px + 20, py + 4);
          ctx.lineTo(px + 36, py + 32);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = airView ? "rgba(230, 235, 240, 0.55)" : "rgba(230, 232, 236, 0.85)";
          ctx.beginPath();
          ctx.moveTo(px + 16, py + 12);
          ctx.lineTo(px + 20, py + 4);
          ctx.lineTo(px + 24, py + 12);
          ctx.closePath();
          ctx.fill();
        } else if (ter === TERRAIN.ROAD) {
          ctx.fillStyle = airView ? "rgba(200, 180, 90, 0.25)" : "rgba(212, 180, 106, 0.55)";
          ctx.fillRect(px + 4, py + 16, CELL - 8, 8);
          ctx.fillRect(px + 16, py + 4, 8, CELL - 8);
        } else if (ter === TERRAIN.TUNNEL) {
          ctx.fillStyle = airView ? "rgba(20, 20, 24, 0.55)" : "rgba(12, 12, 16, 0.7)";
          ctx.beginPath();
          ctx.arc(px + CELL / 2, py + CELL / 2 + 4, 10, Math.PI, 0);
          ctx.fill();
          ctx.fillStyle = airView ? "rgba(180, 185, 190, 0.3)" : "rgba(90, 90, 96, 0.5)";
          ctx.fillRect(px + 8, py + 22, CELL - 16, 8);
        } else if (ter === TERRAIN.OCEAN) {
          ctx.strokeStyle = airView ? "rgba(140, 200, 230, 0.28)" : "rgba(170, 220, 245, 0.42)";
          ctx.lineWidth = 1.4 / z;
          ctx.beginPath();
          ctx.moveTo(px + 4, py + 13 + (n % 3));
          ctx.quadraticCurveTo(px + 14, py + 8, px + 22, py + 14);
          ctx.quadraticCurveTo(px + 30, py + 19, px + 36, py + 13);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(px + 5, py + 26);
          ctx.quadraticCurveTo(px + 14, py + 22, px + 24, py + 27);
          ctx.quadraticCurveTo(px + 31, py + 31, px + 36, py + 25);
          ctx.stroke();
        }
      }
    }
  }

  if (fogOn && fogVisArr && fogSeenArr) {
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = fogI(x, y);
        if (!fogSeenArr[i]) {
          ctx.fillStyle = airView ? "#070a10" : "#070807";
          ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        } else if (!fogVisArr[i]) {
          ctx.fillStyle = "rgba(0,0,0,0.45)";
          ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }
    }
  }

  if (game.tunnelPick && game.selected && game.selected.type === "engineer") {
    ctx.fillStyle = "rgba(243, 226, 161, 0.28)";
    ctx.strokeStyle = "#f3e2a1";
    ctx.lineWidth = 2 / z;
    for (const p of nearbyPeaks(game.selected)) {
      ctx.fillRect(p.x * CELL, p.y * CELL, CELL, CELL);
      ctx.strokeRect(p.x * CELL + 2, p.y * CELL + 2, CELL - 4, CELL - 4);
    }
  }

  if (airView) {
    ctx.fillStyle = localOwner() === "player" ? "rgba(70, 150, 220, 0.05)" : "rgba(224, 86, 78, 0.05)";
    const r = AIR_MAX_DIST;
    const homes = ownerAirports(localOwner()).concat(ownerCarriers(localOwner()));
    for (const b of homes) {
      const sx = Math.max(0, b.x - r);
      const sy = Math.max(0, b.y - r);
      const ex = Math.min(game.w - 1, b.x + r);
      const ey = Math.min(game.h - 1, b.y + r);
      ctx.fillRect(sx * CELL, sy * CELL, (ex - sx + 1) * CELL, (ey - sy + 1) * CELL);
    }
  }

  if (z > 0.55) {
    ctx.strokeStyle = "rgba(0,0,0,0.28)";
    ctx.lineWidth = 1 / z;
    ctx.beginPath();
    for (let x = x0; x <= x1; x++) {
      ctx.moveTo(x * CELL, y0 * CELL);
      ctx.lineTo(x * CELL, y1 * CELL);
    }
    for (let y = y0; y <= y1; y++) {
      ctx.moveTo(x0 * CELL, y * CELL);
      ctx.lineTo(x1 * CELL, y * CELL);
    }
    ctx.stroke();
  }

  if (game.cheatPlace && hover && inBounds(hover.x, hover.y)) {
    ctx.fillStyle = "rgba(212, 180, 106, 0.35)";
    ctx.strokeStyle = "rgba(212, 180, 106, 0.95)";
    ctx.lineWidth = 2 / z;
    ctx.fillRect(hover.x * CELL, hover.y * CELL, CELL, CELL);
    ctx.strokeRect(hover.x * CELL + 1, hover.y * CELL + 1, CELL - 2, CELL - 2);
  }

  if (game.pendingBuy && canLocalAct()) {
    const me = localOwner();
    ctx.fillStyle = me === "player" ? "rgba(80,180,255,0.18)" : "rgba(224,86,78,0.18)";
    let spots = [];
    if (isBuildingType(game.pendingBuy)) spots = buildTiles(me);
    else if (isAirType(game.pendingBuy)) spots = airDeployTiles(me, game.pendingBuy);
    else spots = deployTiles(me, game.pendingBuy);
    for (const t of spots) ctx.fillRect(t.x * CELL, t.y * CELL, CELL, CELL);
  }

  const sel = game.selected;
  if (sel && isMine(sel.owner) && !sel.justDeployed && canLocalAct()) {
    if (canUnitMove(sel) && airView === isAir(sel)) {
      const { tiles } = moveRange(sel);
      ctx.fillStyle = "rgba(90,170,255,0.22)";
      for (const t of tiles) ctx.fillRect(t.x * CELL, t.y * CELL, CELL, CELL);
      ctx.strokeStyle = "rgba(255,90,80,0.9)";
      ctx.lineWidth = 2 / z;
      if (!airView) {
        for (const t of meleeTargets(sel)) {
          ctx.strokeRect(t.x * CELL + 3, t.y * CELL + 3, CELL - 6, CELL - 6);
        }
      }
    }
    if (settings.atkPreview && game.ranged && canUnitAttack(sel)) {
      const atkMode = canShootAir(sel) && game.airAtk ? "air" : "ground";
      const r = attackRangeOf(sel, atkMode);
      for (let y = Math.max(0, sel.y - r); y <= Math.min(game.h - 1, sel.y + r); y++) {
        for (let x = Math.max(0, sel.x - r); x <= Math.min(game.w - 1, sel.x + r); x++) {
          if (cheb(sel.x, sel.y, x, y) > r || (x === sel.x && y === sel.y)) continue;
          const blocked = shotBlocked(sel, atkMode, x, y);
          ctx.fillStyle = blocked
            ? "rgba(40,40,40,0.16)"
            : (atkMode === "air" ? "rgba(90,200,255,0.14)" : "rgba(255,170,60,0.12)");
          ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }
      if (usesGroundSplash(sel, atkMode) && hover && inBounds(hover.x, hover.y)
        && cheb(sel.x, sel.y, hover.x, hover.y) <= r && !(hover.x === sel.x && hover.y === sel.y)
        && !shotBlocked(sel, atkMode, hover.x, hover.y)) {
        const radius = UNITS[sel.type].splashRadius != null ? UNITS[sel.type].splashRadius : 1;
        for (const cell of splashCells(hover.x, hover.y, radius)) {
          ctx.fillStyle = cell.center ? "rgba(255,90,60,0.40)" : "rgba(255,90,60,0.18)";
          ctx.fillRect(cell.x * CELL, cell.y * CELL, CELL, CELL);
        }
      }
    }
  }

  if (game.tutorial && game.tutTiles && game.tutTiles.length) {
    const pulse = 0.22 + 0.12 * Math.sin(performance.now() / 220);
    ctx.fillStyle = `rgba(243, 226, 161, ${pulse})`;
    ctx.strokeStyle = "#f3e2a1";
    ctx.lineWidth = 2.4 / z;
    for (const t of game.tutTiles) {
      ctx.fillRect(t.x * CELL, t.y * CELL, CELL, CELL);
      ctx.strokeRect(t.x * CELL + 2, t.y * CELL + 2, CELL - 4, CELL - 4);
    }
  }

  if (hover && inBounds(hover.x, hover.y)) {
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2 / z;
    ctx.strokeRect(hover.x * CELL + 1, hover.y * CELL + 1, CELL - 2, CELL - 2);
  }

  ctx.save();
  if (airView) ctx.globalAlpha = 0.38;
  for (const c of game.cities) {
    const mode = fogStructureMode(fogWho, c);
    if (mode === "hide") continue;
    const ghost = mode === "ghost";
    ctx.save();
    if (ghost) ctx.globalAlpha *= 0.4;
    const px = c.x * CELL, py = c.y * CELL;
    ctx.fillStyle = ghost ? "#2a2c28" : (c.owner === "player" ? "#1d4f7c" : "#7a2622");
    ctx.fillRect(px + 6, py + 8, CELL - 12, CELL - 14);
    ctx.strokeStyle = ghost ? "#4a4c46" : (isCityTruce(c) ? "#d4b46a" : c.owner === "player" ? "#7ec8ff" : "#ff8b84");
    ctx.lineWidth = (isCityTruce(c) && !ghost ? 2.6 : 2) / z;
    ctx.strokeRect(px + 6, py + 8, CELL - 12, CELL - 14);
    ctx.fillStyle = ghost ? "#5a5c56" : (c.owner === "player" ? "#4aa3e8" : "#e0564e");
    ctx.fillRect(px + 10, py + 6, 4, 12);
    ctx.fillRect(px + 14, py + 6, 10, 7);
    if (!ghost) {
      const ratio = c.hp / c.maxHp;
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(px + 6, py + CELL - 7, CELL - 12, 4);
      ctx.fillStyle = ratio > 0.4 ? "#7dcf6b" : "#e07060";
      ctx.fillRect(px + 6, py + CELL - 7, (CELL - 12) * ratio, 4);
      if (z > 0.55 && !airView) {
        ctx.fillStyle = "#f3e2a1";
        ctx.font = `${Math.max(10, 11 / z)}px Segoe UI, Microsoft YaHei`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(`${hpText(c.hp)}/${c.maxHp}`, px + CELL / 2, py + 8);
      }
    }
    ctx.restore();
  }
  ctx.restore();

  for (const b of game.buildings) {
    const mode = fogStructureMode(fogWho, b);
    if (mode === "hide") continue;
    const ghost = mode === "ghost";
    ctx.save();
    if (ghost) ctx.globalAlpha *= 0.4;
    const px = b.x * CELL, py = b.y * CELL;
    const fort = isFortress(b);
    if (airView) {
      ctx.fillStyle = b.owner === "player" ? "rgba(90,180,255,0.16)" : "rgba(224,86,78,0.14)";
      ctx.fillRect(px, py, CELL, CELL);
    }
    ctx.fillStyle = fort
      ? (b.owner === "player" ? "#2a3420" : "#3a2820")
      : (b.owner === "player" ? "#2a3a48" : "#4a3030");
    ctx.fillRect(px + 4, py + 10, CELL - 8, CELL - 16);
    ctx.strokeStyle = airView
      ? (b.owner === "player" ? "#c8ecff" : "#ffc4bc")
      : fort
        ? (b.owner === "player" ? "#c8d48a" : "#e8b090")
        : (b.owner === "player" ? "#8ec4e8" : "#e8a090");
    ctx.lineWidth = (airView ? 2.4 : 1.8) / z;
    ctx.strokeRect(px + 4, py + 10, CELL - 8, CELL - 16);
    if (fort) {
      ctx.fillStyle = b.owner === "player" ? "#6a7a40" : "#8a5a40";
      ctx.fillRect(px + 8, py + 14, CELL - 16, 6);
      ctx.fillRect(px + 10, py + 8, 4, 8);
      ctx.fillRect(px + CELL - 14, py + 8, 4, 8);
    } else {
      ctx.fillStyle = "#cfc8a8";
      ctx.fillRect(px + 8, py + 18, CELL - 16, 4);
      ctx.fillStyle = b.owner === "player" ? "#5aaef0" : "#ef6a62";
      ctx.fillRect(px + 7, py + 8, CELL - 14, 4);
    }
    if (!ghost) {
      const occ = fort ? groundOccupancy(b.x, b.y) : airportOccupancy(b);
      const cap = (BUILDINGS[b.type] && BUILDINGS[b.type].capacity) || (fort ? 2 : AIRPORT_CAP);
      const ratio = b.hp / b.maxHp;
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(px + 6, py + CELL - 7, CELL - 12, 4);
      ctx.fillStyle = ratio > 0.4 ? "#7dcf6b" : "#e07060";
      ctx.fillRect(px + 6, py + CELL - 7, (CELL - 12) * ratio, 4);
      if (z > 0.55) {
        ctx.fillStyle = airView ? "#e8f4ff" : (fort ? "#e8f0c8" : "#d4e8f8");
        ctx.font = `${Math.max(9, 10 / z)}px Segoe UI, Microsoft YaHei`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(`${fort ? "要塞" : "机场"} ${occ}/${cap}`, px + CELL / 2, py + 9);
      }
    }
    ctx.restore();
  }

  function paintUnit(u, flying) {
    let ux = u.x, uy = u.y;
    if (anim && anim.unit.id === u.id) {
      const a = anim.path[anim.i];
      const b = anim.path[Math.min(anim.i + 1, anim.path.length - 1)];
      ux = a.x + (b.x - a.x) * anim.t;
      uy = a.y + (b.y - a.y) * anim.t;
    }
    const stack = flying ? airUnitsAt(u.x, u.y) : isNavy(u) ? navyUnitsAt(u.x, u.y) : groundUnitsAt(u.x, u.y);
    const idx = Math.max(0, stack.findIndex((n) => n.id === u.id));
    const spread = stack.length > 1 ? 5 : 0;
    const ox = spread ? ((idx % 2) * 2 - (stack.length > 1 ? 1 : 0)) * 4 : 0;
    const oy = spread ? (idx < 2 ? -4 : 3) : (flying ? -5 : 0);
    const cx = ux * CELL + CELL / 2 + ox;
    const cy = uy * CELL + CELL / 2 + oy;
    const color = u.owner === "player" ? "#5aaef0" : "#ef6a62";
    ctx.beginPath();
    ctx.arc(cx, cy, CELL * (flying ? 0.30 : 0.36), 0, Math.PI * 2);
    ctx.fillStyle = flying
      ? (u.parked
        ? (u.owner === "player" ? "rgba(22,50,76,0.42)" : "rgba(74,28,26,0.42)")
        : (u.owner === "player" ? "rgba(22,50,76,0.72)" : "rgba(74,28,26,0.72)"))
      : (u.owner === "player" ? "#16324c" : "#4a1c1a");
    ctx.fill();
    ctx.lineWidth = (sel && sel.id === u.id ? 3 : 1.5) / z;
    ctx.strokeStyle = sel && sel.id === u.id ? "#fff" : (flying ? "#cfe8ff" : color);
    ctx.stroke();
    if (flying && u.parked) {
      ctx.fillStyle = u.owner === "player" ? "rgba(90,180,255,0.22)" : "rgba(224,86,78,0.22)";
      ctx.fillRect(cx - 11, cy + 6, 22, 5);
      if (z > 0.55) {
        ctx.fillStyle = "#d4e8f8";
        ctx.font = `${Math.max(8, 9 / z)}px Segoe UI, Microsoft YaHei`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("停", cx, cy + 10);
      }
    }
    if (!flying && isNavy(u) && u.type === "transport" && z > 0.55) {
      const n = transportCargo(u).length;
      if (n) {
        ctx.fillStyle = "#9ad0ff";
        ctx.font = `${Math.max(8, 9 / z)}px Segoe UI, Microsoft YaHei`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("载" + n, cx, cy + 10);
      }
    }
    if (!flying && isEscorted(u) && z > 0.55) {
      ctx.fillStyle = "#f3e2a1";
      ctx.font = `${Math.max(8, 9 / z)}px Segoe UI, Microsoft YaHei`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("护", cx, cy + 10);
    }
    drawUnitIcon(ctx, u.type, color, cx, cy, CELL * (flying ? (u.parked ? 0.5 : 0.62) : 0.7));
    if (u.defending) {
      ctx.strokeStyle = "#cfe8ff";
      ctx.lineWidth = 1.4 / z;
      ctx.beginPath();
      ctx.arc(cx, cy, CELL * 0.42, 0, Math.PI * 2);
      ctx.stroke();
    }
    const ratio = Math.max(0, u.hp / UNITS[u.type].hp);
    ctx.fillStyle = "#111";
    ctx.fillRect(cx - 12, cy + CELL * (flying ? 0.28 : 0.34), 24, 3);
    ctx.fillStyle = ratio > 0.4 ? "#7dcf6b" : "#e07060";
    ctx.fillRect(cx - 12, cy + CELL * (flying ? 0.28 : 0.34), 24 * ratio, 3);
  }
  ctx.save();
  ctx.globalAlpha = airView ? 0.22 : 1;
  for (const u of game.units) {
    if (!isAir(u) && !isAboard(u) && !(sel && sel.id === u.id) && fogCanSeeEnemy(fogWho, u)) paintUnit(u, false);
  }
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = airView ? 1 : 0.2;
  for (const u of game.units) {
    if (isAir(u) && !(sel && sel.id === u.id) && fogCanSeeEnemy(fogWho, u)) paintUnit(u, true);
  }
  ctx.restore();
  if (sel && fogCanSeeEnemy(fogWho, sel)) {
    ctx.save();
    ctx.globalAlpha = 1;
    paintUnit(sel, isAir(sel));
    ctx.restore();
  }

  if (settings.atkPreview && sel && isMine(sel.owner) && !sel.justDeployed && canLocalAct()) {
    let previewLabels = [];
    if (game.ranged && canUnitAttack(sel) && hover) {
      const atkMode = canShootAir(sel) && game.airAtk ? "air" : "ground";
      previewLabels = collectAttackPreview(sel, hover, atkMode);
    } else if (!game.ranged && !isAir(sel) && canUnitMove(sel) && canUnitAttack(sel) && hover && !airView) {
      const meleeHit = meleeTargets(sel).some((s) => s.x === hover.x && s.y === hover.y);
      if (meleeHit) previewLabels = previewDamageInfo(sel, hover.x, hover.y, "ground", 1, true);
    }
    if (previewLabels.length) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `bold ${Math.max(11, 13 / z)}px Segoe UI, Microsoft YaHei`;
      ctx.lineWidth = Math.max(2.4, 3.2 / z);
      ctx.strokeStyle = "rgba(0,0,0,0.72)";
      for (const p of previewLabels) {
        const px = p.x * CELL + CELL / 2;
        const py = p.y * CELL + CELL / 2 - 6;
        ctx.strokeText(p.text, px, py);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, px, py);
      }
      ctx.restore();
    }
  }

  const now = performance.now();
  fx = fx.filter((f) => now - f.born < 800);
  for (const f of fx) {
    const t = (now - f.born) / 800;
    ctx.globalAlpha = 1 - t;
    ctx.fillStyle = f.color;
    ctx.font = `${Math.max(11, 13 / z)}px Segoe UI, Microsoft YaHei`;
    ctx.textAlign = "center";
    ctx.fillText(f.text, f.x * CELL + CELL / 2, f.y * CELL + CELL / 2 - t * 18);
    ctx.globalAlpha = 1;
  }

  ctx.restore();

  if (game.inspectedCity) positionCityCard(game.inspectedCity);
  if (game.inspectedBuilding) positionCityCard(game.inspectedBuilding);

  const mm = minimapRect();
  ctx.fillStyle = "rgba(8,10,8,0.82)";
  ctx.fillRect(mm.x - 4, mm.y - 4, mm.w + 8, mm.h + 8);
  ctx.strokeStyle = "#8a7340";
  ctx.strokeRect(mm.x - 4, mm.y - 4, mm.w + 8, mm.h + 8);
  ctx.fillStyle = airView ? "#1a2834" : "#2a3826";
  ctx.fillRect(mm.x, mm.y, mm.w, mm.h);
  if (game.terrain) {
    for (let y = 0; y < game.h; y++) {
      for (let x = 0; x < game.w; x++) {
        const i = x + y * game.w;
        if (fogOn && fogSeenArr && !fogSeenArr[i]) {
          ctx.fillStyle = "#070807";
          ctx.fillRect(mm.x + x * mm.scale, mm.y + y * mm.scale, Math.max(1, mm.scale), Math.max(1, mm.scale));
          continue;
        }
        const ter = game.terrain[i];
        if (!ter) {
          if (fogOn && fogVisArr && !fogVisArr[i]) {
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(mm.x + x * mm.scale, mm.y + y * mm.scale, Math.max(1, mm.scale), Math.max(1, mm.scale));
          }
          continue;
        }
        ctx.fillStyle = ter === TERRAIN.OCEAN
          ? (airView ? "#1a4a68" : "#2a7aa8")
          : ter === TERRAIN.FOREST
            ? (airView ? "#1a3030" : "#1c361c")
            : ter === TERRAIN.PEAK
              ? (airView ? "#8a8e94" : "#c4c2c8")
              : ter === TERRAIN.ROAD
                ? (airView ? "#6a6040" : "#b8a45a")
                : ter === TERRAIN.TUNNEL
                  ? (airView ? "#2a2c30" : "#1a1c20")
                  : (airView ? "#3a3830" : "#4a4434");
        ctx.fillRect(mm.x + x * mm.scale, mm.y + y * mm.scale, Math.max(1, mm.scale), Math.max(1, mm.scale));
        if (fogOn && fogVisArr && !fogVisArr[i]) {
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(mm.x + x * mm.scale, mm.y + y * mm.scale, Math.max(1, mm.scale), Math.max(1, mm.scale));
        }
      }
    }
  }
  for (const c of game.cities) {
    const mode = fogStructureMode(fogWho, c);
    if (mode === "hide") continue;
    ctx.globalAlpha = (airView ? 0.4 : 1) * (mode === "ghost" ? 0.4 : 1);
    ctx.fillStyle = c.owner === "player" ? "#4aa3e8" : "#e0564e";
    ctx.fillRect(mm.x + c.x * mm.scale - 1.5, mm.y + c.y * mm.scale - 1.5, 3, 3);
  }
  ctx.globalAlpha = 1;
  for (const b of game.buildings) {
    const mode = fogStructureMode(fogWho, b);
    if (mode === "hide") continue;
    ctx.globalAlpha = mode === "ghost" ? 0.4 : 1;
    ctx.fillStyle = b.owner === "player" ? "#a8d4f0" : "#f0b8b0";
    ctx.fillRect(mm.x + b.x * mm.scale - 1, mm.y + b.y * mm.scale - 1, 3, 3);
  }
  ctx.globalAlpha = 1;
  for (const u of game.units) {
    if (!fogCanSeeEnemy(fogWho, u)) continue;
    const flying = isAir(u);
    if (airView !== flying) ctx.globalAlpha = 0.28;
    else ctx.globalAlpha = 1;
    ctx.fillStyle = flying
      ? (u.owner === "player" ? "#e8f4ff" : "#ffd0cc")
      : (u.owner === "player" ? "#9fd0ff" : "#ff9a94");
    ctx.fillRect(mm.x + u.x * mm.scale, mm.y + u.y * mm.scale, flying ? 2.5 : 2, flying ? 2.5 : 2);
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  const vx = (-cam.x / cam.zoom) / CELL;
  const vy = (-cam.y / cam.zoom) / CELL;
  const vw = w / cam.zoom / CELL;
  const vh = h / cam.zoom / CELL;
  ctx.strokeRect(mm.x + vx * mm.scale, mm.y + vy * mm.scale, vw * mm.scale, vh * mm.scale);
}

function tick(ts) {
  if (!loopOn) return;
  const dt = Math.min(40, ts - lastTs || 16);
  lastTs = ts;
  if (game && !game.over) {
    let pan = 0;
    const spd = 420 / (cam.zoom || 1) * (dt / 1000);
    if (keys.KeyA || keys.ArrowLeft) { cam.x += spd * cam.zoom; pan = 1; }
    if (keys.KeyD || keys.ArrowRight) { cam.x -= spd * cam.zoom; pan = 1; }
    if (keys.KeyW || keys.ArrowUp) { cam.y += spd * cam.zoom; pan = 1; }
    if (keys.KeyS || keys.ArrowDown) { cam.y -= spd * cam.zoom; pan = 1; }
  }
  if (anim) {
    anim.t += dt / 140;
    if (anim.t >= 1) {
      anim.t = 0;
      anim.i += 1;
      if (anim.i >= anim.path.length - 1) {
        const r = anim.resolve;
        anim = null;
        if (r) r();
      }
    }
  }
  draw();
  requestAnimationFrame(tick);
}

function startLoop() {
  if (loopOn) return;
  loopOn = true;
  requestAnimationFrame(tick);
}

function hoverTip() {
  const el = $("hover-tip");
  if (!game || !hover) {
    el.classList.add("hidden");
    return;
  }
  const fogWhoH = fogActive() ? fogViewer() : null;
  if (fogWhoH && !fogSeenAt(fogWhoH, hover.x, hover.y)) {
    el.innerHTML = `${isAirLayer() ? "空域" : "地面"} ${displayCoord(hover.x, hover.y)}<br/>未探明`;
    el.classList.remove("hidden");
    return;
  }
  if (fogWhoH && !fogVisible(fogWhoH, hover.x, hover.y)) {
    el.innerHTML = `${isAirLayer() ? "空域" : "地面"} ${displayCoord(hover.x, hover.y)}<br/>${TERRAIN_TIPS[terrainAt(hover.x, hover.y)] || "平地"}`;
    el.classList.remove("hidden");
    return;
  }
  const { unit, city, building, airUnits } = getTile(hover.x, hover.y);
  const ctrl = controlOwner(hover.x, hover.y);
  const airView = isAirLayer();
  const bits = [`${airView ? "空域" : "地面"} ${displayCoord(hover.x, hover.y)}`];
  bits.push(TERRAIN_TIPS[terrainAt(hover.x, hover.y)] || "平地");
  if (ctrl) bits.push(ctrl === "player" ? "蓝方控制区" : "红方控制区");
  if (city && !airView) {
    const bitsCity = [`城市 ${hpText(city.hp)}/${city.maxHp} · ${ownerName(city.owner)}`];
    if (isCityTruce(city)) bitsCity.push("修战");
    if (city.incomeBonus) bitsCity.push(`收益 ${cityIncomeOf(city)}`);
    bits.push(bitsCity.join(" · "));
  }
  if (building) {
    const bd = BUILDINGS[building.type] || BUILDINGS.airport;
    if (isFortress(building)) {
      bits.push(`${bd.name} ${hpText(building.hp)}/${building.maxHp} · ${ownerName(building.owner)} · 驻守 ${groundOccupancy(building.x, building.y)}/${bd.capacity || 2}`);
    } else {
      bits.push(`${bd.name} ${hpText(building.hp)}/${building.maxHp} · ${ownerName(building.owner)} · 停场 ${airportOccupancy(building)}/${bd.capacity || AIRPORT_CAP}`);
    }
  }
  if (airView) {
    if (airUnits && airUnits.length) {
      bits.push(airUnits.map((u) => `${UNITS[u.type].name} ${hpText(u.hp)}/${UNITS[u.type].hp}${u.parked ? " · 停场" : ""}`).join(" / "));
    } else {
      bits.push("空域空闲");
    }
    if (unit) bits.push(`地面：${UNITS[unit.type].name}`);
  } else {
    const gnd = groundUnitsAt(hover.x, hover.y);
    if (gnd.length) {
      bits.push(gnd.map((u) => `${UNITS[u.type].name} ${hpText(u.hp)}/${UNITS[u.type].hp}${u.defending ? " · 防守" : ""}${isEscorted(u) || u.escorting ? " · 护卫" : ""}`).join(" / "));
    }
    const ships = navyUnitsAt(hover.x, hover.y);
    if (ships.length) {
      bits.push(ships.map((u) => `${UNITS[u.type].name} ${hpText(u.hp)}/${UNITS[u.type].hp}`).join(" / "));
    }
    if (airUnits && airUnits.length) bits.push(`空域 ${airUnits.length} 架`);
  }
  el.innerHTML = bits.join("<br/>");
  el.classList.remove("hidden");
}

function pointerOnMinimap(e) {
  const p = clientToCanvas(e.clientX, e.clientY);
  const mm = minimapRect();
  return {
    hit: p.x >= mm.x && p.y >= mm.y && p.x <= mm.x + mm.w && p.y <= mm.y + mm.h,
    sx: p.x,
    sy: p.y,
    cssW: p.cssW,
    cssH: p.cssH,
    mm,
    rect: p.rect,
  };
}

function onPointerDown(e) {
  if (!game || game.over) return;
  if (game.editor && e.button === 0 && typeof editorOnPointerDown === "function") {
    if (editorOnPointerDown(e)) return;
  }
  if (e.button === 1) {
    const p = clientToCanvas(e.clientX, e.clientY);
    drag = { x: p.x, y: p.y, cx: cam.x, cy: cam.y };
    e.preventDefault();
    return;
  }
  const mmHit = pointerOnMinimap(e);
  if (e.button === 0 && mmHit.hit) {
    const tx = (mmHit.sx - mmHit.mm.x) / mmHit.mm.scale;
    const ty = (mmHit.sy - mmHit.mm.y) / mmHit.mm.scale;
    cam.x = mmHit.cssW / 2 - tx * CELL * cam.zoom;
    cam.y = mmHit.cssH / 2 - ty * CELL * cam.zoom;
    skipClick = true;
  }
}

async function onClick(e) {
  if (skipClick) {
    skipClick = false;
    return;
  }
  if (game && game.editor) {
    if (typeof editorOnClick === "function") editorOnClick(e);
    return;
  }
  if (!game || game.over || game.busy) return;
  if (e.button !== 0) return;
  if (pointerOnMinimap(e).hit) return;
  if (game.devTest && game.cheatPlace) {
    const pt = screenToTile(e.clientX, e.clientY);
    if (pt) cheatPlaceAt(pt.x, pt.y);
    return;
  }
  if (!canLocalAct()) return;
  const t = screenToTile(e.clientX, e.clientY);
  if (!t) {
    game.selected = null;
    game.ranged = false;
    game.tunnelPick = false;
    renderInspect();
    return;
  }
  hideCityCard();
  if (game.tunnelPick && game.selected && game.selected.type === "engineer") {
    const err = tryDigTunnel(game.selected, t.x, t.y);
    if (err) toast(err);
    return;
  }
  if (game.ranged && game.selected) {
    if (tutBlocked("ranged")) return tutBlockToast();
    game.busy = true;
    await doRanged(game.selected, t.x, t.y);
    game.busy = false;
    updatePills();
    renderInspect();
    return;
  }
  const tile = getTile(t.x, t.y);
  const airView = isAirLayer();
  if (!airView && game.selected && isMine(game.selected.owner) && !isAir(game.selected) && canUnitMove(game.selected) && canUnitAttack(game.selected)) {
    const meleeHit = meleeTargets(game.selected).some((s) => s.x === t.x && s.y === t.y);
    const foe = foeOwner();
    const enemyHere = (tile.unit && tile.unit.owner === foe)
      || (tile.navy && tile.navy.owner === foe)
      || (tile.city && tile.city.owner === foe)
      || (tile.building && tile.building.owner === foe);
    if (meleeHit && enemyHere) {
      if (tutBlocked("melee")) return tutBlockToast();
      game.busy = true;
      await doMelee(game.selected, t.x, t.y);
      game.busy = false;
      updatePills();
      renderInspect();
      return;
    }
  }
  if (game.selected && isMine(game.selected.owner) && canUnitMove(game.selected)
    && airView === isAir(game.selected)) {
    const { tiles } = moveRange(game.selected);
    if (tiles.some((s) => s.x === t.x && s.y === t.y)) {
      if (tutBlocked("move")) return tutBlockToast();
      game.busy = true;
      await doMove(game.selected, t.x, t.y);
      game.busy = false;
      updatePills();
      renderInspect();
      return;
    }
  }
  const stack = fogVisibleStack(airView ? airUnitsAt(t.x, t.y) : groundUnitsAt(t.x, t.y).concat(navyUnitsAt(t.x, t.y)));
  if (stack.length) {
    if (tutBlocked("select")) return tutBlockToast();
    let next = stack[0];
    if (game.selected) {
      const i = stack.findIndex((u) => u.id === game.selected.id);
      if (i >= 0) next = stack[(i + 1) % stack.length];
      else {
        const mine = stack.filter((u) => isMine(u.owner));
        next = mine[0] || stack[0];
      }
    } else {
      const mine = stack.filter((u) => isMine(u.owner));
      next = mine[0] || stack[0];
    }
    game.selected = next;
    game.pendingBuy = null;
    game.ranged = false;
    game.airAtk = false;
    game.tunnelPick = false;
    setMapLayer(isAir(next) ? "air" : "ground");
    renderShop();
    renderInspect();
    tutEmit("select", { unit: next });
    return;
  }
  game.selected = null;
  game.ranged = false;
  game.airAtk = false;
  renderInspect();
}

async function onContext(e) {
  e.preventDefault();
  if (!game || game.over) return;
  if (game.editor) {
    if (typeof editorOnContext === "function") editorOnContext(e);
    return;
  }
  if (pointerOnMinimap(e).hit) return;
  const t = screenToTile(e.clientX, e.clientY);
  if (!t) return;
  if (game.pendingBuy && canLocalAct()) {
    if (tutBlocked("deploy")) return tutBlockToast();
    const err = tryBuy(localOwner(), game.pendingBuy, t.x, t.y);
    if (err) toast(err);
    return;
  }
  const tile = getTile(t.x, t.y);
  const airView = isAirLayer();
  const fogWhoC = fogActive() ? fogViewer() : null;
  if (tile.building && (airView || !tile.city)) {
    if (!fogWhoC || fogStructureMode(fogWhoC, tile.building) === "full") {
      if (isFortress(tile.building)) showFortressInfo(tile.building);
      else showAirportInfo(tile.building);
      return;
    }
  }
  if (tile.city && !airView) {
    if (!fogWhoC || fogStructureMode(fogWhoC, tile.city) === "full") {
      showCityInfo(tile.city);
      return;
    }
  }
  if (game.busy || !canLocalAct()) {
    const rawU = airView ? (airUnitsAt(t.x, t.y)[0] || null) : tile.unit;
    const u = rawU && fogCanSeeEnemy(fogWhoC, rawU) ? rawU : null;
    if (u) {
      game.selected = u;
      game.ranged = false;
      game.airAtk = false;
      setMapLayer(isAir(u) ? "air" : "ground");
      renderInspect();
    }
    return;
  }
  if (!airView && game.selected && isMine(game.selected.owner) && !isAir(game.selected)) {
    const foe = foeOwner();
    const enemyUnit = (tile.unit && tile.unit.owner === foe) || (tile.navy && tile.navy.owner === foe);
    if (enemyUnit && fogCanSeeEnemy(fogWhoC, tile.unit || tile.navy)) {
      if (tutBlocked("melee")) return tutBlockToast();
      game.busy = true;
      await doMelee(game.selected, t.x, t.y);
      game.busy = false;
      updatePills();
      renderInspect();
      return;
    }
  }
  const rawInspect = airView ? (airUnitsAt(t.x, t.y)[0] || null) : tile.unit;
  const u = rawInspect && fogCanSeeEnemy(fogWhoC, rawInspect) ? rawInspect : null;
  if (u) {
    hideCityCard();
    game.selected = u;
    game.ranged = false;
    game.airAtk = false;
    setMapLayer(isAir(u) ? "air" : "ground");
    renderInspect();
  } else if (tile.city && (!fogWhoC || fogStructureMode(fogWhoC, tile.city) === "full")) {
    showCityInfo(tile.city);
  }
}

function onMove(e) {
  if (drag) {
    const p = clientToCanvas(e.clientX, e.clientY);
    cam.x = drag.cx + (p.x - drag.x);
    cam.y = drag.cy + (p.y - drag.y);
    return;
  }
  if (game && game.editor && typeof editorOnMove === "function") editorOnMove(e);
  if (!game) return;
  hover = screenToTile(e.clientX, e.clientY);
  hoverTip();
}

function onWheel(e) {
  if (!game) return;
  e.preventDefault();
  const p = clientToCanvas(e.clientX, e.clientY);
  const sx = p.x;
  const sy = p.y;
  const old = cam.zoom;
  cam.zoom = clamp(cam.zoom * (e.deltaY < 0 ? 1.12 : 0.9), 0.16, 2.4);
  const wx = (sx - cam.x) / old;
  const wy = (sy - cam.y) / old;
  cam.x = sx - wx * cam.zoom;
  cam.y = sy - wy * cam.zoom;
}

function bindTouchCanvas(canvas) {
  if (!canvas || canvas.dataset.touchBound) return;
  canvas.dataset.touchBound = "1";
  let tap = null;
  let longTimer = 0;
  let pinching = false;
  let lastPinch = 0;
  const fire = (fn, clientX, clientY, button) => {
    fn({
      clientX,
      clientY,
      button: button || 0,
      preventDefault() {},
      target: canvas,
    });
  };
  canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length >= 2) {
      pinching = true;
      if (longTimer) {
        clearTimeout(longTimer);
        longTimer = 0;
      }
      const a = e.touches[0], b = e.touches[1];
      lastPinch = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      tap = null;
      drag = null;
      e.preventDefault();
      return;
    }
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    tap = { x: t.clientX, y: t.clientY, moved: false, long: false };
    const p = clientToCanvas(t.clientX, t.clientY);
    drag = { x: p.x, y: p.y, cx: cam.x, cy: cam.y };
    longTimer = setTimeout(() => {
      longTimer = 0;
      if (!tap || tap.moved) return;
      tap.long = true;
      drag = null;
      fire(onContext, tap.x, tap.y, 2);
    }, 480);
  }, { passive: false });
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (pinching && e.touches.length >= 2 && game) {
      const a = e.touches[0], b = e.touches[1];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (lastPinch > 1) {
        const cx = (a.clientX + b.clientX) / 2;
        const cy = (a.clientY + b.clientY) / 2;
        const p = clientToCanvas(cx, cy);
        const old = cam.zoom;
        cam.zoom = clamp(cam.zoom * (dist / lastPinch), 0.16, 2.4);
        cam.x = p.x - ((p.x - cam.x) / old) * cam.zoom;
        cam.y = p.y - ((p.y - cam.y) / old) * cam.zoom;
      }
      lastPinch = dist;
      return;
    }
    if (!tap || e.touches.length !== 1) return;
    const t = e.touches[0];
    if (Math.hypot(t.clientX - tap.x, t.clientY - tap.y) > 14) {
      tap.moved = true;
      if (longTimer) {
        clearTimeout(longTimer);
        longTimer = 0;
      }
    }
    if (tap.moved && drag) {
      const p = clientToCanvas(t.clientX, t.clientY);
      cam.x = drag.cx + (p.x - drag.x);
      cam.y = drag.cy + (p.y - drag.y);
    }
  }, { passive: false });
  canvas.addEventListener("touchend", (e) => {
    if (e.touches.length === 0) pinching = false;
    if (longTimer) {
      clearTimeout(longTimer);
      longTimer = 0;
    }
    if (tap && !tap.moved && !tap.long && e.changedTouches[0]) {
      const t = e.changedTouches[0];
      if (game && game.pendingBuy) fire(onContext, t.clientX, t.clientY, 2);
      else fire(onClick, t.clientX, t.clientY, 0);
    }
    tap = null;
    drag = null;
    skipClick = true;
    setTimeout(() => { skipClick = false; }, 400);
    e.preventDefault();
  }, { passive: false });
}

function fillHelpUnits() {
  const box = $("help-units");
  if (!box) return;
  box.innerHTML = SHOP_SECTIONS.map((sec) => {
    const items = sec.ids.map((id) => {
      const u = shopDef(id);
      if (isBuildingType(id)) {
        return `<div><b>${u.name}</b>　${u.cost} 元<br/>生命 ${u.hp}　建筑　停场 ${u.capacity}<br/>${u.blurb}</div>`;
      }
      const rangeTxt = u.rangeAir != null
        ? `对地 ${u.range} / 对空 ${u.rangeAir}`
        : (u.range ? "射程 " + u.range : "近战");
      const moveTxt = u.immobile || u.move <= 0 ? "无法移动" : "移动 " + u.move;
      return `<div><b>${u.name}</b>　${u.cost} 元<br/>生命 ${u.hp}　${moveTxt}　${rangeTxt}　攻击 ${u.attacks} 次<br/>${u.blurb}</div>`;
    }).join("");
    return `<div class="help-sec">${sec.title}</div>${items}`;
  }).join("");
}

function cloneVehicleTurn(src) {
  const out = { player: Object.create(null), ai: Object.create(null) };
  for (const owner of ["player", "ai"]) {
    const o = src && src[owner];
    if (!o) continue;
    for (const k of Object.keys(o)) out[owner][k] = o[k];
  }
  return out;
}

function formatSaveTime(ts) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  const p = (n) => (n < 10 ? "0" : "") + n;
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function canSaveGame() {
  if (!game || game.tutorial || game.editor || game.over || game.busy) return false;
  if (game.mode === "online") return true;
  if (game.mode === "hotseat") return game.phase === "player" || game.phase === "ai";
  return actingOwner() === localOwner();
}

function serializeGame() {
  return {
    v: 2,
    savedAt: Date.now(),
    nextId,
    game: {
      sizeKey: game.sizeKey,
      mapName: game.mapName || null,
      w: game.w,
      h: game.h,
      cities: game.cities,
      terrain: Array.from(game.terrain),
      units: game.units,
      buildings: game.buildings,
      money: game.money,
      vehicleTurn: {
        player: Object.assign({}, game.vehicleTurn.player),
        ai: Object.assign({}, game.vehicleTurn.ai),
      },
      soldierBought: game.soldierBought,
      aiDiff: normalizeAiDiff(game.aiDiff),
      aiStyle: game.aiStyle,
      aiMood: game.aiMood,
      aiCounterUntil: game.aiCounterUntil,
      lostCities: game.lostCities,
      cityLossComp: game.cityLossComp,
      playerPulse: game.playerPulse,
      turn: game.turn,
      startTurn: game.startTurn != null ? game.startTurn : 0,
      endTurn: game.endTurn != null ? game.endTurn : DEFAULT_TURN_END,
      phase: game.phase === "ai" ? "ai" : (game.phase === "end" ? "end" : "player"),
      over: game.over || null,
      mode: game.mode || "vsai",
      layer: game.layer === "air" ? "air" : "ground",
      cityControlExtra: game.cityControlExtra || 0,
      withOcean: !!game.withOcean,
      fog: !!game.fog,
      fogSeen: serializeFogSeen(),
      hold: !!game.hold,
      holdScore: {
        player: (game.holdScore && game.holdScore.player) || 0,
        ai: (game.holdScore && game.holdScore.ai) || 0,
      },
      holdTarget: game.holdTarget != null ? game.holdTarget : holdTargetFor(game),
      devTest: !!game.devTest,
      devFogReveal: !!game.devFogReveal,
      localSide: game.localSide === "ai" ? "ai" : "player",
      campaign: game.campaign ? {
        missionId: game.campaign.missionId,
        role: game.campaign.role === "defend" ? "defend" : "attack",
        attacker: game.campaign.attacker === "ai" ? "ai" : "player",
        defender: game.campaign.defender === "ai" ? "ai" : "player",
        captureNeed: (game.campaign.defHome || []).length || game.campaign.captureNeed || 0,
        defHome: (game.campaign.defHome || []).map((c) => ({ x: c.x | 0, y: c.y | 0 })),
        atkHome: (game.campaign.atkHome || []).map((c) => ({ x: c.x | 0, y: c.y | 0 })),
      } : null,
      series: cloneSeries(game.series),
      stats: ensureStats() || makeBattleStats(),
      reportEvents: (game.reportEvents || []).slice(-48),
      logLines: (game.logLines || []).slice(-80),
    },
  };
}

function readSave() {
  try {
    let raw = localStorage.getItem(SAVE_KEY);
    if (!raw) raw = localStorage.getItem("planeWar_v07_save");
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.game || data.game.w == null || data.game.h == null) return null;
    if (!data.game.cities || data.game.terrain == null) return null;
    return data;
  } catch (err) {
    return null;
  }
}

function saveSummary(data) {
  if (!data || !data.game) return "";
  const g = data.game;
  const spec = mapInfo(g.sizeKey);
  const mapName = g.mapName || (spec ? spec.label : "地图");
  const turn = g.turn == null ? 0 : g.turn;
  const ocean = g.withOcean ? "有海洋" : "无海洋";
  const modeName = g.mode === "hotseat" ? "热座" : g.mode === "online" ? "联机" : (g.localSide === "ai" ? "人机·红" : "人机");
  const when = data.savedAt ? formatSaveTime(data.savedAt) : "";
  return `第 ${turn} 回合 · ${modeName} · ${mapName} · ${ocean}${when ? " · " + when : ""}`;
}

function saveIsHostable(data) {
  if (!data || !data.game) return false;
  if (data.game.over) return false;
  if (data.game.tutorial) return false;
  if (data.game.w == null || data.game.h == null) return false;
  if (!data.game.cities || data.game.terrain == null) return false;
  return true;
}

function refreshSaveUi() {
  const data = readSave();
  const hostable = saveIsHostable(data);
  const btn = $("btn-load");
  const meta = $("save-meta");
  if (btn) btn.disabled = !data;
  if (meta) meta.textContent = data ? saveSummary(data) : "还没有存档";
  const hostSave = $("btn-host-save");
  const onlineMeta = $("online-save-meta");
  if (hostSave) hostSave.disabled = !hostable;
  if (onlineMeta) {
    if (!data) onlineMeta.textContent = "还没有存档";
    else if (data.game && data.game.over) onlineMeta.textContent = "该存档已经结束";
    else onlineMeta.textContent = saveSummary(data);
  }
}

function writeSave(opts) {
  opts = opts || {};
  const autoOk = !!(opts.auto && game && !game.tutorial && !game.over && game.mode !== "online");
  if (!autoOk && !canSaveGame()) {
    if (opts.auto) return false;
    if (game && game.tutorial) toast("教程中无法存档");
    else if (game && game.busy) toast("请等行动结束后再存档");
    else if (game && game.over) toast("战役已结束");
    else toast("现在不能存档");
    return false;
  }
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializeGame()));
    toast(opts.auto ? `已自动存档（第 ${game.turn} 回合）` : (game.mode === "online" ? "已存到本机，之后可用存档开房间" : "已存档"));
    log(opts.auto ? `自动保存（每 ${settings.autoSaveTurns} 回合）。` : (game.mode === "online" ? "联机进度已保存到本机。" : "进度已保存。"), "sys");
    refreshSaveUi();
    return true;
  } catch (err) {
    toast("存档失败（存储空间不足或浏览器限制）");
    return false;
  }
}

function saveGame() {
  writeSave();
}

function maybeAutoSave() {
  if (!game || game.tutorial || game.over || game.mode === "online") return;
  const n = clampAutoSaveTurns(settings.autoSaveTurns);
  if (game.turn < n || game.turn % n !== 0) return;
  writeSave({ auto: true });
}

function restoreLog(lines) {
  const box = $("log");
  if (!box) return;
  box.innerHTML = "";
  if (!lines) return;
  for (const line of lines) {
    const el = document.createElement("div");
    if (line && line.c) el.className = line.c;
    el.textContent = (line && line.t) || "";
    box.appendChild(el);
  }
  box.scrollTop = box.scrollHeight;
}

function applySave(data, opts) {
  opts = opts || {};
  const g = data.game;
  const w = g.w;
  const h = g.h;
  const terrain = new Uint8Array(w * h);
  const src = g.terrain;
  if (Array.isArray(src)) {
    for (let i = 0; i < terrain.length && i < src.length; i++) terrain[i] = src[i] & 255;
  } else if (src && typeof src === "object") {
    for (let i = 0; i < terrain.length; i++) {
      if (src[i] != null) terrain[i] = src[i] & 255;
    }
  }
  let maxId = 0;
  const units = (g.units || []).map((u) => {
    if (u.id > maxId) maxId = u.id;
    return Object.assign({}, u);
  });
  const buildings = (g.buildings || []).map((b) => {
    if (b.id > maxId) maxId = b.id;
    return Object.assign({}, b);
  });
  nextId = Math.max(data.nextId || 1, maxId + 1);
  const prevSel = opts.keepCam && game && game.selected ? game.selected.id : null;
  const prevLayer = opts.keepCam && game ? game.layer : null;
  const mode = opts.mode || g.mode || "vsai";
  const savedSide = g.localSide === "ai" ? "ai" : "player";
  const localSide = opts.localSide || (mode === "online" ? (game && game.localSide) : savedSide) || "player";
  let phase = g.phase === "ai" ? "ai" : (g.phase === "end" ? "end" : "player");
  if (mode === "vsai") {
    if (g.localSide === "ai" || g.localSide === "player") {
      phase = g.phase === "ai" ? "ai" : (g.phase === "end" ? "end" : "player");
    } else {
      phase = "player";
    }
  }
  if (opts.keepPhase && g.phase) phase = g.phase === "ai" ? "ai" : (g.phase === "end" ? "end" : "player");
  if (mode === "online" || mode === "hotseat") {
    phase = g.phase === "ai" ? "ai" : (g.phase === "end" ? "end" : "player");
  }
  game = {
    sizeKey: g.sizeKey || "normal",
    mapName: g.mapName || null,
    w,
    h,
    cities: (g.cities || []).map((c) => makeCity(c.x, c.y, c.owner, c)),
    terrain,
    units,
    buildings,
    money: { player: (g.money && g.money.player) || 0, ai: (g.money && g.money.ai) || 0 },
    vehicleTurn: cloneVehicleTurn(g.vehicleTurn),
    soldierBought: {
      player: (g.soldierBought && g.soldierBought.player) || 0,
      ai: (g.soldierBought && g.soldierBought.ai) || 0,
    },
    aiDiff: normalizeAiDiff(g.aiDiff),
    aiStyle: g.aiStyle || "balanced",
    aiMood: g.aiMood || 0,
    aiCounterUntil: g.aiCounterUntil != null ? g.aiCounterUntil : -1,
    lostCities: {
      player: (g.lostCities && g.lostCities.player) || [],
      ai: (g.lostCities && g.lostCities.ai) || [],
    },
    cityLossComp: {
      player: (g.cityLossComp && g.cityLossComp.player) || CITY_LOSS_COMP_BASE,
      ai: (g.cityLossComp && g.cityLossComp.ai) || CITY_LOSS_COMP_BASE,
    },
    playerPulse: g.playerPulse || { atk: 0, cityHit: 0, capture: 0, buyOff: 0, buyDef: 0 },
    turn: g.turn || 0,
    startTurn: g.startTurn != null ? clampTurnStart(g.startTurn) : 0,
    endTurn: clampTurnEnd(g.endTurn, g.startTurn != null ? clampTurnStart(g.startTurn) : 0),
    phase,
    selected: null,
    pendingBuy: null,
    cheatPlace: null,
    ranged: false,
    airAtk: false,
    tunnelPick: false,
    layer: (opts.keepCam && prevLayer) ? prevLayer : (g.layer === "air" ? "air" : "ground"),
    busy: false,
    over: null,
    hoverPath: [],
    cityControlExtra: g.cityControlExtra || 0,
    withOcean: !!g.withOcean,
    fog: !!g.fog,
    fogSeen: restoreFogSeen(g, w, h),
    fogVis: { player: null, ai: null },
    hold: !!g.hold,
    holdScore: {
      player: (g.holdScore && g.holdScore.player) || 0,
      ai: (g.holdScore && g.holdScore.ai) || 0,
    },
    holdTarget: g.holdTarget != null ? g.holdTarget : holdTargetFor({ cities: g.cities }),
    devTest: !!g.devTest,
    devFogReveal: !!g.devFogReveal,
    mode,
    localSide: (mode === "online" || mode === "vsai") ? (localSide === "ai" ? "ai" : "player") : "player",
    campaign: g.campaign && g.campaign.missionId ? {
      missionId: g.campaign.missionId,
      role: g.campaign.role === "defend" ? "defend" : "attack",
      attacker: g.campaign.attacker === "ai" ? "ai" : "player",
      defender: g.campaign.defender === "ai" ? "ai" : "player",
      captureNeed: (g.campaign.defHome || []).length || g.campaign.captureNeed || 0,
      defHome: (g.campaign.defHome || []).map((c) => ({ x: c.x | 0, y: c.y | 0 })),
      atkHome: (g.campaign.atkHome || []).map((c) => ({ x: c.x | 0, y: c.y | 0 })),
    } : null,
    series: cloneSeries(g.series),
    logLines: (g.logLines || []).slice(),
    stats: g.stats && g.stats.player && g.stats.ai
      ? { player: Object.assign(emptyOwnerStats(), g.stats.player), ai: Object.assign(emptyOwnerStats(), g.stats.ai) }
      : makeBattleStats(),
    reportEvents: Array.isArray(g.reportEvents) ? g.reportEvents.slice() : [],
  };
  if (prevSel) game.selected = game.units.find((u) => u.id === prevSel) || null;
  fx = [];
  anim = null;
  hover = null;
  restoreLog(game.logLines);
  hideCityCard();
  if (!g.over && $("modal-end")) $("modal-end").classList.add("hidden");
  if (!opts.silent) log("读取存档。", "sys");
  renderShop();
  renderInspect();
  updatePills();
  updateLayerSwitch();
  syncOnlineUi();
  syncCheatUi();
  if (!opts.keepCam) fitCam();
  if (g.over) {
    if (g.over === "draw") endGame("draw", "平局。", !!opts.fromNet);
    else {
      const blueWin = g.over === "blue" || g.over === "victory";
      endGame(blueWin ? "blue" : "red", blueWin ? "蓝方获胜。" : "红方获胜。", !!opts.fromNet);
    }
  }
}

function showMenuHome() {
  if ($("menu-home")) $("menu-home").classList.remove("hidden");
  if ($("menu-new")) $("menu-new").classList.add("hidden");
  refreshSaveUi();
}

function showMenuNew() {
  if ($("menu-home")) $("menu-home").classList.add("hidden");
  if ($("menu-new")) $("menu-new").classList.remove("hidden");
  if (typeof refreshCustomPicks === "function") refreshCustomPicks();
  syncMapChoiceUi();
}

function showMenu() {
  if (!$("menu")) {
    location.href = "index.html";
    return;
  }
  netLeave();
  $("game-screen").classList.add("hidden");
  $("menu").classList.remove("hidden");
  $("modal-end").classList.add("hidden");
  if ($("modal-handover")) $("modal-handover").classList.add("hidden");
  if ($("modal-net")) $("modal-net").classList.add("hidden");
  if ($("btn-next-mission")) $("btn-next-mission").classList.add("hidden");
  if ($("btn-again")) {
    $("btn-again").classList.add("primary");
    $("btn-again").classList.remove("ghost");
  }
  game = null;
  document.body.dataset.side = "player";
  delete document.body.dataset.editor;
  updateLayerSwitch();
  syncCheatUi();
  showMenuHome();
  if (typeof refreshCustomPicks === "function") refreshCustomPicks();
}

function idleActionUnits() {
  if (!game) return [];
  return game.units.filter((u) => {
    if (!isMine(u.owner) || u.hp <= 0) return false;
    if (isEscorted(u) || isAboard(u)) return false;
    if (u.justDeployed) return false;
    return canUnitMove(u) || canUnitAttack(u);
  });
}

function focusTile(x, y) {
  const wrap = $("stage-wrap");
  if (!wrap) return;
  cam.x = wrap.clientWidth / 2 - (x + 0.5) * CELL * cam.zoom;
  cam.y = wrap.clientHeight / 2 - (y + 0.5) * CELL * cam.zoom;
}

function focusOwnerCities(owner) {
  if (!game) return;
  const cities = game.cities.filter((c) => c.owner === owner);
  if (!cities.length) {
    fitCam();
    return;
  }
  const x = cities.reduce((s, c) => s + c.x, 0) / cities.length;
  const y = cities.reduce((s, c) => s + c.y, 0) / cities.length;
  focusTile(x, y);
}

function showHandover(nextOwner) {
  return new Promise((resolve) => {
    const modal = $("modal-handover");
    if (!modal) {
      resolve();
      return;
    }
    const blue = nextOwner === "player";
    $("handover-title").textContent = blue ? "请蓝方接手" : "请红方接手";
    $("handover-desc").textContent = blue
      ? "红方已结束回合。请把座位交给蓝方玩家，确认对方已离开视线后再开始。"
      : "蓝方已结束回合。请把座位交给红方玩家，确认对方已离开视线后再开始。";
    $("btn-handover").textContent = blue ? "蓝方开始行动" : "红方开始行动";
    const done = () => {
      modal.classList.add("hidden");
      $("btn-handover").onclick = null;
      resolve();
    };
    $("btn-handover").onclick = done;
    modal.classList.remove("hidden");
  });
}

function selectedSide() {
  if (menuMode !== "vsai") return "player";
  const btn = document.querySelector("#side-picks .mode-pick.selected");
  return btn && btn.dataset.side === "ai" ? "ai" : "player";
}

function selectedDifficulty() {
  const btn = document.querySelector("#diff-picks .mode-pick.selected");
  return normalizeAiDiff(btn && btn.dataset.diff);
}

function syncMenuMode() {
  const online = menuMode === "online";
  const camp = menuMode === "campaign";
  if ($("menu-offline-actions")) $("menu-offline-actions").classList.toggle("hidden", online);
  if ($("menu-online")) $("menu-online").classList.toggle("hidden", !online);
  if ($("side-picks-wrap")) $("side-picks-wrap").classList.toggle("hidden", menuMode !== "vsai");
  if ($("diff-picks-wrap")) $("diff-picks-wrap").classList.toggle("hidden", !(menuMode === "vsai" || menuMode === "campaign"));
  if ($("skirmish-maps")) $("skirmish-maps").classList.toggle("hidden", camp || online);
  if ($("campaign-setup")) $("campaign-setup").classList.toggle("hidden", !camp);
  if ($("turn-range-wrap")) $("turn-range-wrap").classList.toggle("hidden", camp || online);
  const oceanRow = $("opt-ocean") && $("opt-ocean").closest ? $("opt-ocean").closest(".menu-check") : null;
  if (oceanRow) oceanRow.classList.toggle("hidden", camp);
  const holdRow = $("opt-hold") && $("opt-hold").closest ? $("opt-hold").closest(".menu-check") : null;
  if (holdRow) holdRow.classList.toggle("hidden", camp || (online && selectedOnlineCampaign()));
  if ($("btn-start")) $("btn-start").textContent = camp ? "开始关卡" : "开始战役";
  if (camp) renderCampaignPicks();
  else if (!online) syncMapChoiceUi();
  if (online) refreshSaveUi();
}

function notifyStateChanged() {
  if (game && game.mode === "online" && game.localSide === actingOwner() && !game.over) {
    netPushSoon();
  }
}

function netDefaultBase() {
  if (location.protocol === "http:" || location.protocol === "https:") {
    return location.origin;
  }
  return `http://127.0.0.1:${NET_PORT}`;
}

function netNormalizeBase(raw) {
  let s = (raw || "").trim();
  if (!s) return netDefaultBase();
  if (!/^https?:\/\//i.test(s)) s = "http://" + s;
  s = s.replace(/\/+$/, "");
  if (!/:\d+$/.test(s.replace(/^https?:\/\//, "").split("/")[0])) {
    s = s + ":" + NET_PORT;
  }
  return s;
}

async function netRequest(path, body) {
  const url = (net.base || netDefaultBase()) + path;
  const opts = body == null
    ? { method: "GET" }
    : {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok || (data && data.ok === false)) {
    throw new Error((data && data.error) || ("请求失败 " + res.status));
  }
  return data;
}

function netStopPoll() {
  if (net.timer) {
    clearInterval(net.timer);
    net.timer = 0;
  }
}

function netLeave() {
  netStopPoll();
  net.base = "";
  net.room = "";
  net.seq = 0;
  net.miss = 0;
  net.status = "";
  net.lastPush = 0;
  net.chat = [];
  net.chatSeen = 0;
  renderChat();
  syncOnlineUi();
}

function syncOnlineUi() {
  const on = !!(game && game.mode === "online" && !game.editor && !game.tutorial);
  if (on) document.body.dataset.online = "1";
  else delete document.body.dataset.online;
  const bar = $("log-bar");
  if (!on && bar) bar.classList.remove("chat-open");
  const tabLog = $("tab-log");
  const tabChat = $("tab-chat");
  if (tabLog) tabLog.classList.toggle("active", !bar || !bar.classList.contains("chat-open"));
  if (tabChat) tabChat.classList.toggle("active", !!(bar && bar.classList.contains("chat-open")));
}

function sanitizeChatText(s) {
  let t = String(s || "").replace(/[\u0000-\u001f]/g, " ").trim();
  if (t.length > 120) t = t.slice(0, 120);
  return t;
}

function renderChat() {
  const box = $("chat-log");
  if (!box) return;
  const stick = box.scrollHeight - box.scrollTop <= box.clientHeight + 28;
  box.innerHTML = "";
  for (const m of net.chat) {
    const line = document.createElement("div");
    line.className = m.side === "player" ? "me" : "foe";
    const who = document.createElement("b");
    who.textContent = m.side === "player" ? "蓝方" : "红方";
    line.appendChild(who);
    line.appendChild(document.createTextNode(" " + (m.text || "")));
    box.appendChild(line);
  }
  if (stick || !net.chat.length) box.scrollTop = box.scrollHeight;
  const tab = $("tab-chat");
  if (tab) {
    const unread = net.chat.length > net.chatSeen;
    const bar = $("log-bar");
    const open = bar && bar.classList.contains("chat-open");
    let dot = tab.querySelector(".chat-dot");
    if (unread && !open) {
      if (!dot) {
        dot = document.createElement("span");
        dot.className = "chat-dot";
        tab.appendChild(dot);
      }
    } else if (dot) {
      dot.remove();
    }
  }
}

function applyNetChat(list) {
  if (!Array.isArray(list)) return;
  net.chat = list.slice(-80);
  renderChat();
}

function setChatOpen(open) {
  const bar = $("log-bar");
  if (!bar) return;
  bar.classList.toggle("chat-open", !!open);
  if (open) net.chatSeen = net.chat.length;
  const tabLog = $("tab-log");
  const tabChat = $("tab-chat");
  if (tabLog) tabLog.classList.toggle("active", !open);
  if (tabChat) tabChat.classList.toggle("active", !!open);
  renderChat();
  if (open && $("chat-input")) $("chat-input").focus();
}

async function sendChat(e) {
  if (e) e.preventDefault();
  if (!game || game.mode !== "online" || !net.room) return;
  const input = $("chat-input");
  const text = sanitizeChatText(input && input.value);
  if (!text) return;
  if (input) input.value = "";
  try {
    const data = await netRequest("/api/chat", {
      code: net.room,
      side: game.localSide === "ai" ? "ai" : "player",
      text,
    });
    if (data && data.chat) {
      applyNetChat(data.chat);
      net.chatSeen = net.chat.length;
      renderChat();
    }
  } catch (err) {
    toast(err.message || "发送失败");
  }
}

function netStartPoll() {
  netStopPoll();
  net.timer = setInterval(() => { netPoll(); }, 450);
  netPoll();
}

let netPushTimer = 0;
function netPushSoon() {
  clearTimeout(netPushTimer);
  netPushTimer = setTimeout(() => { netPush(); }, 120);
}

async function netPush(force) {
  if (!game || game.mode !== "online" || !net.room) return;
  const now = Date.now();
  if (!force && now - net.lastPush < 80) return;
  net.lastPush = now;
  try {
    const snap = serializeGame();
    const data = await netRequest("/api/room/" + encodeURIComponent(net.room), {
      side: game.localSide,
      state: snap,
    });
    if (data && data.seq != null) net.seq = data.seq;
  } catch (err) {
    if (force) toast(err.message || "同步失败");
  }
}

function applyNetState(data) {
  if (!data || !data.game) return;
  const side = game ? game.localSide : "player";
  const incoming = data.game;
  const mapChanged = !!(game && incoming && (incoming.w !== game.w || incoming.h !== game.h || incoming.sizeKey !== game.sizeKey));
  const seriesChanged = !!(incoming && incoming.series && (!game || !game.series || incoming.series.gameIndex !== game.series.gameIndex));
  const revived = !!(game && game.over && !incoming.over);
  applySave(data, { keepCam: !(mapChanged || seriesChanged || revived), silent: true, mode: "online", localSide: side, fromNet: true });
  if (mapChanged || seriesChanged || revived) {
    if ($("modal-end")) $("modal-end").classList.add("hidden");
    requestAnimationFrame(() => { if (game) fitCam(); });
  }
}

async function netPoll() {
  if (!net.room) return;
  try {
    const data = await netRequest("/api/room/" + encodeURIComponent(net.room) + "?side=" + (game && game.localSide ? game.localSide : "player"));
    net.miss = 0;
    if (data.chat) applyNetChat(data.chat);
    if (net.status === "wait") {
      if (data.guest) {
        hideNetWait();
        net.status = "play";
        toast("对手已加入，战役开始");
        log("红方已加入房间。", "sys");
        updatePills();
      }
      return;
    }
    if (data.state && data.seq > net.seq) {
      const acting = game && game.localSide === actingOwner() && !game.over;
      net.seq = data.seq;
      if (!acting) applyNetState(data.state);
    }
    if (data.status === "gone") {
      toast("房间已关闭");
      netLeave();
    }
  } catch (err) {
    net.miss += 1;
    if (net.miss === 8) toast("联机连接不稳定，正在重试…");
  }
}

function hideNetWait() {
  if ($("modal-net")) $("modal-net").classList.add("hidden");
}

function showNetWait(code, ips) {
  const modal = $("modal-net");
  if (!modal) return;
  $("net-title").textContent = "等待对手加入";
  const ipText = (ips && ips.length) ? ips.join(" 或 ") : "本机 IP";
  $("net-desc").textContent = "把下面的房间号和主机地址发给对方。对方打开本游戏后选择联机对战，填入地址与房间号即可加入。若无法加入，请在防火墙中允许 Python。";
  $("net-code-show").textContent = `${code}  ·  ${ipText}:${NET_PORT}`;
  modal.dataset.copy = `房间号 ${code}\n地址 ${ipText}\n端口 ${NET_PORT}`;
  modal.classList.remove("hidden");
}

async function probeNet(base) {
  net.base = netNormalizeBase(base);
  try {
    return await netRequest("/api/info");
  } catch (err) {
    return null;
  }
}

async function hostOnline(opts) {
  opts = opts || {};
  const fromSave = !!opts.fromSave;
  let save = null;
  if (fromSave) {
    save = readSave();
    if (!saveIsHostable(save)) {
      toast(save && save.game && save.game.over ? "该存档已经结束" : "没有可用存档");
      refreshSaveUi();
      return;
    }
  }
  const info = await probeNet($("opt-net-host") && $("opt-net-host").value);
  if (!info) {
    toast("未找到房间服务器。请先运行「联机对战.bat」");
    if ($("online-hint")) $("online-hint").textContent = "联机需要先运行「联机对战.bat」。创建房间的电脑运行该脚本后，本页会自动连上。";
    return;
  }
  if ($("opt-net-host") && !$("opt-net-host").value) $("opt-net-host").value = info.ips && info.ips[0] ? info.ips[0] : "";
  const choice = save ? null : selectedMapChoice();
  if (!save && choice && choice.customMap) {
    const err = typeof validateCustomMap === "function" ? validateCustomMap(choice.customMap) : null;
    if (err) {
      toast(err);
      return;
    }
  }
  const size = save ? (save.game.sizeKey || "normal") : choice.sizeKey;
  const ocean = save ? !!save.game.withOcean : choice.ocean;
  const turns = save ? null : selectedTurnRange();
  let created;
  try {
    created = await netRequest("/api/host", { sizeKey: size, ocean });
  } catch (err) {
    toast(err.message || "创建房间失败");
    return;
  }
  net.room = created.code;
  net.seq = 0;
  net.status = "wait";
  enterGameScreen();
  if (save) {
    applySave(save, { mode: "online", localSide: "player", silent: true });
    log(`联机房间 ${created.code}。已载入本地存档，你是蓝方，等待红方加入。`, "sys");
  } else if (selectedOnlineCampaign()) {
    const series = pickOnlineCampaignSeries(selectedFog());
    startOnlineCampaignGame(series, 0, { push: false });
    log(`联机房间 ${created.code}。你是蓝方，等待红方加入。`, "sys");
  } else {
    newGame(size, {
      ocean,
      fog: selectedFog(),
      hold: selectedHold(),
      mode: "online",
      localSide: "player",
      startTurn: turns && turns.start,
      endTurn: turns && turns.end,
      startTurnFilled: !!(turns && turns.startFilled),
      customMap: (choice && choice.customMap) || null,
    });
    log(`联机房间 ${created.code}。你是蓝方，等待红方加入。`, "sys");
  }
  startLoop();
  await netPush(true);
  showNetWait(created.code, info.ips || created.ips);
  netStartPoll();
  updatePills();
  requestAnimationFrame(() => {
    resizeCanvas();
    if (!game) return;
    if (save) focusOwnerCities("player");
    else fitCam();
  });
}

async function joinOnline() {
  const code = (($("opt-net-code") && $("opt-net-code").value) || "").trim().toUpperCase();
  if (!code) {
    toast("请填写房间号");
    return;
  }
  const info = await probeNet($("opt-net-host") && $("opt-net-host").value);
  if (!info) {
    toast("无法连接主机。请填写对方的局域网 IP，并确认对方已运行「联机对战.bat」");
    return;
  }
  let joined;
  try {
    joined = await netRequest("/api/join", { code });
  } catch (err) {
    toast(err.message || "加入失败");
    return;
  }
  net.room = joined.code || code;
  net.seq = 0;
  net.status = "play";
  enterGameScreen();
  startLoop();
  toast("已加入，正在同步战场…");
  for (let i = 0; i < 25; i++) {
    try {
      const data = await netRequest("/api/room/" + encodeURIComponent(net.room) + "?side=ai");
      if (data.state && data.state.game) {
        applySave(data.state, { silent: true, mode: "online", localSide: "ai", fromNet: true, keepCam: false });
        net.seq = data.seq || 1;
        if (data.chat) applyNetChat(data.chat);
        log(`已加入房间 ${net.room}。你是红方。`, "sys");
        focusOwnerCities("ai");
        netStartPoll();
        updatePills();
        return;
      }
    } catch (err) { /* retry */ }
    await sleep(300);
  }
  toast("等待主机同步超时");
  netLeave();
  showMenu();
}

function copyNetInfo() {
  const modal = $("modal-net");
  const text = (modal && modal.dataset.copy) || "";
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => toast("已复制连接信息"), () => toast(text));
  } else {
    toast(text);
  }
}

function cancelNetRoom() {
  hideNetWait();
  showMenu();
}

function jumpNextIdle() {
  if (!game || game.over || game.busy || !canLocalAct()) return;
  const list = idleActionUnits();
  if (!list.length) {
    toast(game.turn === 0 ? "准备阶段单位还不能行动" : "没有未行动的单位");
    return;
  }
  list.sort((a, b) => a.y - b.y || a.x - b.x || a.id - b.id);
  let idx = 0;
  if (game.selected) {
    const cur = list.findIndex((u) => u.id === game.selected.id);
    idx = cur < 0 ? 0 : (cur + 1) % list.length;
  }
  const u = list[idx];
  game.selected = u;
  game.pendingBuy = null;
  game.ranged = false;
  game.airAtk = false;
  game.tunnelPick = false;
  setMapLayer(isAir(u) ? "air" : "ground");
  focusTile(u.x, u.y);
  hideCityCard();
  renderInspect();
  renderShop();
  toast(`${UNITS[u.type].name}（${idx + 1}/${list.length} 未行动）`);
}

function openSettings() {
  syncSettingsForm();
  if ($("modal-settings")) $("modal-settings").classList.remove("hidden");
}

function closeSettings() {
  readSettingsForm();
  if ($("modal-settings")) $("modal-settings").classList.add("hidden");
}

function enterGameScreen() {
  $("menu").classList.add("hidden");
  $("game-screen").classList.remove("hidden");
  $("modal-end").classList.add("hidden");
  resizeCanvas();
  requestAnimationFrame(() => resizeCanvas());
  refreshBgm();
}

function selectedMapSize() {
  const choice = selectedMapChoice();
  return choice.sizeKey;
}

function selectedMapChoice() {
  const customBtn = document.querySelector("#custom-picks .map-pick.selected");
  if (customBtn && customBtn.dataset.mapId && typeof getCustomMap === "function") {
    const bp = getCustomMap(customBtn.dataset.mapId);
    if (bp) {
      return {
        sizeKey: "custom",
        ocean: terrainHasOcean(bp.terrain),
        scenario: false,
        customMap: bp,
      };
    }
  }
  const scenBtn = document.querySelector("#scenario-picks .map-pick.selected");
  if (scenBtn && scenBtn.dataset.scenario && SCENARIO_MAPS[scenBtn.dataset.scenario]) {
    const scen = SCENARIO_MAPS[scenBtn.dataset.scenario];
    return { sizeKey: scen.id, ocean: !!scen.ocean, scenario: true, customMap: null };
  }
  const selected = document.querySelector("#map-picks .map-pick.selected");
  return { sizeKey: selected ? selected.dataset.size : "normal", ocean: selectedOcean(), scenario: false, customMap: null };
}

function syncMapChoiceUi() {
  const customBtn = document.querySelector("#custom-picks .map-pick.selected");
  const scenBtn = document.querySelector("#scenario-picks .map-pick.selected");
  const ocean = $("opt-ocean");
  const row = ocean && ocean.closest ? ocean.closest(".menu-check") : null;
  if (customBtn && customBtn.dataset.mapId && typeof getCustomMap === "function") {
    const bp = getCustomMap(customBtn.dataset.mapId);
    if (ocean) {
      ocean.checked = !!(bp && terrainHasOcean(bp.terrain));
      ocean.disabled = true;
    }
    if (row) row.classList.add("locked");
    return;
  }
  if (scenBtn) {
    const scen = SCENARIO_MAPS[scenBtn.dataset.scenario];
    if (ocean) {
      ocean.checked = !!(scen && scen.ocean);
      ocean.disabled = true;
    }
    if (row) row.classList.add("locked");
  } else {
    if (ocean) ocean.disabled = false;
    if (row) row.classList.remove("locked");
  }
}

function selectedOcean() {
  return !!( $("opt-ocean") && $("opt-ocean").checked );
}

function selectedFog() {
  return !!( $("opt-fog") && $("opt-fog").checked );
}

function selectedHold() {
  return !!( $("opt-hold") && $("opt-hold").checked );
}

function selectedDevTest() {
  return !!( $("opt-dev-test") && $("opt-dev-test").checked );
}

function clampTurnStart(n) {
  if (n == null || n === "") return DEFAULT_TURN_START;
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return DEFAULT_TURN_START;
  return Math.max(0, Math.min(5000, v));
}

function clampTurnEnd(n, start) {
  const s = start == null ? DEFAULT_TURN_START : start;
  if (n == null || n === "") return Math.max(DEFAULT_TURN_END, s);
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return Math.max(DEFAULT_TURN_END, s);
  return Math.max(s, Math.min(9999, v));
}

function selectedTurnRange() {
  const startEl = $("opt-turn-start");
  const endEl = $("opt-turn-end");
  const startRaw = startEl ? String(startEl.value).trim() : "";
  const endRaw = endEl ? String(endEl.value).trim() : "";
  const startFilled = startRaw !== "";
  const start = clampTurnStart(startFilled ? startRaw : null);
  const end = clampTurnEnd(endRaw === "" ? null : endRaw, start);
  return { start, end, startFilled };
}
function startFromMenu() {
  if (menuMode === "campaign") {
    const role = selectedCampaignRole();
    const mission = selectedCampaignMission();
    if (!mission) {
      toast("请选择关卡");
      return;
    }
    startCampaignMission(mission, role, selectedFog(), selectedDevTest());
    return;
  }
  const choice = selectedMapChoice();
  if (choice.customMap) {
    const err = typeof validateCustomMap === "function" ? validateCustomMap(choice.customMap) : null;
    if (err) {
      toast(err);
      return;
    }
  }
  const turns = selectedTurnRange();
  const side = selectedSide();
  enterGameScreen();
  newGame(choice.sizeKey, {
    ocean: choice.ocean,
    fog: selectedFog(),
    hold: selectedHold(),
    devTest: selectedDevTest(),
    mode: menuMode === "hotseat" ? "hotseat" : "vsai",
    localSide: menuMode === "vsai" ? side : "player",
    aiDiff: menuMode === "vsai" ? selectedDifficulty() : "easy",
    startTurn: turns.start,
    endTurn: turns.end,
    startTurnFilled: turns.startFilled,
    customMap: choice.customMap || null,
  });
  if (menuMode === "hotseat") log("热座对战：蓝方先手，回合结束后交给红方。", "sys");
  startLoop();
  requestAnimationFrame(() => {
    resizeCanvas();
    if (game) fitCam();
  });
  kickoffCpuIfNeeded();
}

function loadSaveFromMenu() {
  const data = readSave();
  if (!data) {
    toast("没有存档");
    refreshSaveUi();
    return;
  }
  if (data.game && data.game.over) {
    toast("该存档已经结束");
    return;
  }
  enterGameScreen();
  const savedMode = data.game.mode;
  const mode = savedMode === "hotseat" ? "hotseat" : "vsai";
  applySave(data, { mode });
  if (savedMode === "online") {
    log("该存档来自联机对战，已改为人机继续。若要联机，请返回菜单用存档创建房间。", "sys");
  }
  startLoop();
  requestAnimationFrame(() => {
    resizeCanvas();
    if (game) fitCam();
  });
  kickoffCpuIfNeeded();
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    r = Math.min(Number(r) || 0, w / 2, h / 2);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}


function cheatSpawnTypeOptions() {
  const sel = $("cheat-spawn-type");
  if (!sel || sel.dataset.filled === "1") return;
  const frag = document.createDocumentFragment();
  const preferred = ["line", "elite", "ifv", "light", "heavy", "spg", "mortar", "aa", "atk", "fighter", "engineer", "transport", "destroyer"];
  const ids = preferred.filter((id) => UNITS[id]).concat(Object.keys(UNITS).filter((id) => preferred.indexOf(id) < 0));
  for (const id of ids) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = UNITS[id].name || id;
    frag.appendChild(opt);
  }
  sel.innerHTML = "";
  sel.appendChild(frag);
  sel.dataset.filled = "1";
}

function syncCheatUi() {
  const on = !!(game && game.devTest && !game.editor && !game.tutorial);
  const btn = $("btn-cheat");
  const floatBtn = $("btn-cheat-float");
  const panel = $("cheat-panel");
  if (btn) btn.classList.toggle("hidden", !on);
  if (floatBtn) floatBtn.classList.toggle("hidden", !on);
  if (!on && panel) {
    panel.classList.add("hidden");
    panel.setAttribute("aria-hidden", "true");
  }
  if (!on && game) game.cheatPlace = null;
  if (on) cheatSpawnTypeOptions();
  cheatSyncPlaceBtn();
}

function toggleCheatPanel(force) {
  const panel = $("cheat-panel");
  if (!panel || !game || !game.devTest) return;
  const open = force == null ? panel.classList.contains("hidden") : !!force;
  panel.classList.toggle("hidden", !open);
  panel.setAttribute("aria-hidden", open ? "false" : "true");
  if (open) cheatSpawnTypeOptions();
}

function cheatTargetTile() {
  if (!game) return null;
  if (hover && inBounds(hover.x, hover.y)) return { x: hover.x, y: hover.y };
  if (game.selected && inBounds(game.selected.x, game.selected.y)) return { x: game.selected.x, y: game.selected.y };
  return null;
}

function cheatRefresh() {
  if (!game) return;
  refreshFogMaps();
  renderShop();
  renderInspect();
  updatePills();
}

function cheatAddMoney(who, amount) {
  if (!game || game.over) return;
  if (who === "both") {
    game.money.player = (game.money.player || 0) + amount;
    game.money.ai = (game.money.ai || 0) + amount;
  } else {
    const key = who === "foe" ? (localOwner() === "player" ? "ai" : "player") : localOwner();
    game.money[key] = (game.money[key] || 0) + amount;
  }
  toast(`金钱 +${amount}`);
  log(`作弊：金钱 +${amount}（${who === "both" ? "双方" : who === "foe" ? "敌方" : "己方"}）。`, "sys");
  cheatRefresh();
}

function cheatFogReveal(on) {
  if (!game) return;
  if (!game.fog) {
    toast(on ? "本局未开启迷雾" : "本局未开启迷雾");
    return;
  }
  game.devFogReveal = !!on;
  if (on) {
    ensureFogSeen();
    const n = game.w * game.h;
    const who = localOwner();
    const seen = game.fogSeen && game.fogSeen[who];
    if (seen) for (let i = 0; i < n; i++) seen[i] = 1;
    toast("已开启全图视野");
    log("作弊：全图视野（临时关闭迷雾）。", "sys");
  } else {
    toast("已恢复迷雾");
    log("作弊：恢复战争迷雾。", "sys");
  }
  cheatRefresh();
}

function cheatHealSelected() {
  const u = game && game.selected;
  if (!u) { toast("请先选中单位"); return; }
  const def = UNITS[u.type];
  if (!def) return;
  u.hp = def.hp;
  toast(`${def.name} 已满血`);
  log(`作弊：${def.name} 满血。`, "sys");
  cheatRefresh();
}

function cheatReadySelected() {
  const u = game && game.selected;
  if (!u) { toast("请先选中单位"); return; }
  u.moved = false;
  u.acted = false;
  u.justDeployed = false;
  u.defending = false;
  refreshAttacks(u);
  toast(`${UNITS[u.type].name} 已恢复行动`);
  log(`作弊：${UNITS[u.type].name} 恢复行动。`, "sys");
  cheatRefresh();
}

function cheatDeleteSelected() {
  const u = game && game.selected;
  if (!u) { toast("请先选中单位"); return; }
  const name = UNITS[u.type] ? UNITS[u.type].name : u.type;
  // clear escort/aboard links lightly
  if (u.escorting != null) {
    const other = game.units.find((x) => x.id === u.escorting);
    if (other) other.escortedBy = null;
  }
  if (u.escortedBy != null) {
    const other = game.units.find((x) => x.id === u.escortedBy);
    if (other) other.escorting = null;
  }
  if (u.aboard != null) {
    /* leave carrier cargo as-is; unit removed */
  }
  game.units = game.units.filter((x) => x.id !== u.id);
  game.selected = null;
  toast(`已删除 ${name}`);
  log(`作弊：删除单位 ${name}。`, "sys");
  cheatRefresh();
}

function cheatResolveOwner() {
  const ownerEl = $("cheat-spawn-owner");
  const v = ownerEl ? ownerEl.value : "player";
  if (v === "foe") return localOwner() === "player" ? "ai" : "player";
  return localOwner();
}

function cheatSyncPlaceBtn() {
  const btn = $("btn-cheat-place");
  if (!btn) return;
  const on = !!(game && game.cheatPlace);
  btn.textContent = on ? "取消放置" : "开始放置";
  btn.classList.toggle("active", on);
  if ($("board") && game) {
    $("board").style.cursor = game.pendingBuy || game.cheatPlace || game.ranged || game.tunnelPick ? "crosshair" : "default";
  }
}

function cheatCancelPlace() {
  if (!game) return;
  game.cheatPlace = null;
  cheatSyncPlaceBtn();
  toast("已取消放置");
}

function cheatArmPlace() {
  if (!game || game.over) return;
  if (game.cheatPlace) {
    cheatCancelPlace();
    return;
  }
  const typeEl = $("cheat-spawn-type");
  const typeId = typeEl ? typeEl.value : "line";
  if (!UNITS[typeId]) { toast("未知兵种"); return; }
  game.pendingBuy = null;
  game.ranged = false;
  game.tunnelPick = false;
  game.cheatPlace = { typeId, owner: cheatResolveOwner() };
  if (isAirType(typeId)) setMapLayer("air");
  else setMapLayer("ground");
  cheatSyncPlaceBtn();
  toggleCheatPanel(false);
  toast(`放置模式：点地图生成「${UNITS[typeId].name}」（可连续点，Esc 取消）`);
  log(`作弊：进入放置模式 ${UNITS[typeId].name}。`, "sys");
}

function cheatPlaceAt(x, y) {
  if (!game || !game.cheatPlace || game.over) return;
  if (!inBounds(x, y)) return;
  const typeEl = $("cheat-spawn-type");
  const typeId = (typeEl && typeEl.value) || game.cheatPlace.typeId;
  if (!UNITS[typeId]) { toast("未知兵种"); return; }
  const owner = cheatResolveOwner();
  game.cheatPlace = { typeId, owner };
  const air = isAirType(typeId);
  if (air) {
    const existing = airUnitsAt(x, y).filter((u) => u.owner === owner);
    for (const u of existing) game.units = game.units.filter((z) => z.id !== u.id);
  } else {
    const tile = getTile(x, y);
    const ground = tile && (tile.unit || tile.navy);
    if (ground && ground.owner === owner && !isAir(ground)) {
      game.units = game.units.filter((z) => z.id !== ground.id);
    }
  }
  const u = makeUnit(typeId, owner, x, y, { moved: false, acted: false, justDeployed: false });
  game.units.push(u);
  game.selected = u;
  spawnFx(x, y, UNITS[typeId].name, owner === "player" ? "#7ec8ff" : "#ff8b84");
  toast(`已放置 ${UNITS[typeId].name} @ (${x},${y})`);
  log(`作弊：在 (${x},${y}) 生成 ${UNITS[typeId].name}（${owner === "player" ? "蓝" : "红"}）。`, "sys");
  cheatRefresh();
  cheatSyncPlaceBtn();
}

function cheatSpawnUnit() {
  cheatArmPlace();
}

async function cheatSkipRound() {
  if (!game || game.over || game.busy || game.editor) return;
  if (game.mode === "online") { toast("联机中请用结束己方回合"); return; }
  // End local side turn; for vsai this runs AI then returns to next blue/red turn.
  await endPlayerTurn();
}

function cheatForceEnd(win) {
  if (!game || game.over) return;
  const me = localOwner();
  if (win) {
    endGame(me === "player" ? "blue" : "red", "作弊：立即胜利。");
  } else {
    endGame(me === "player" ? "red" : "blue", "作弊：立即失败。");
  }
}

async function runCheatAction(id) {
  if (!game || !game.devTest || game.editor || game.tutorial) return;
  switch (id) {
    case "money-me-1k": return cheatAddMoney("me", 1000);
    case "money-me-5k": return cheatAddMoney("me", 5000);
    case "money-both-1k": return cheatAddMoney("both", 1000);
    case "money-foe-1k": return cheatAddMoney("foe", 1000);
    case "end-turn": return endPlayerTurn();
    case "skip-round": return cheatSkipRound();
    case "fog-reveal": return cheatFogReveal(true);
    case "fog-restore": return cheatFogReveal(false);
    case "unit-heal": return cheatHealSelected();
    case "unit-ready": return cheatReadySelected();
    case "unit-delete": return cheatDeleteSelected();
    case "spawn-place": return cheatArmPlace();
    case "spawn": return cheatArmPlace();
    case "win": return cheatForceEnd(true);
    case "lose": return cheatForceEnd(false);
    default: return;
  }
}

function bind() {
  document.querySelectorAll("#map-picks .map-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#map-picks .map-pick").forEach((b) => b.classList.remove("selected"));
      document.querySelectorAll("#scenario-picks .map-pick").forEach((b) => b.classList.remove("selected"));
      document.querySelectorAll("#custom-picks .map-pick").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      syncMapChoiceUi();
    });
  });
  document.querySelectorAll("#scenario-picks .map-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#map-picks .map-pick").forEach((b) => b.classList.remove("selected"));
      document.querySelectorAll("#scenario-picks .map-pick").forEach((b) => b.classList.remove("selected"));
      document.querySelectorAll("#custom-picks .map-pick").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      syncMapChoiceUi();
    });
  });
  document.querySelectorAll("#mode-picks .mode-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#mode-picks .mode-pick").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      menuMode = btn.dataset.mode || "vsai";
      syncMenuMode();
    });
  });
  document.querySelectorAll("#side-picks .mode-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#side-picks .mode-pick").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
  document.querySelectorAll("#diff-picks .mode-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#diff-picks .mode-pick").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
  document.querySelectorAll("#campaign-role-picks .mode-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#campaign-role-picks .mode-pick").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      renderCampaignPicks();
    });
  });
  if ($("btn-next-mission")) $("btn-next-mission").addEventListener("click", startNextCampaignMission);
  if ($("btn-start")) $("btn-start").addEventListener("click", startFromMenu);
  if ($("btn-new-game")) $("btn-new-game").addEventListener("click", () => { showMenuNew(); syncMenuMode(); if (typeof refreshCustomPicks === "function") refreshCustomPicks(); });
  if ($("btn-map-editor") && typeof openMapEditor === "function") {
    $("btn-map-editor").addEventListener("click", () => openMapEditor());
  }
  if ($("btn-back-menu")) $("btn-back-menu").addEventListener("click", showMenuHome);
  if ($("btn-back-menu-online")) $("btn-back-menu-online").addEventListener("click", showMenuHome);
  if ($("opt-online-campaign")) $("opt-online-campaign").addEventListener("change", syncMenuMode);
  if ($("btn-host")) $("btn-host").addEventListener("click", () => { hostOnline(); });
  if ($("btn-host-save")) $("btn-host-save").addEventListener("click", () => { hostOnline({ fromSave: true }); });
  if ($("btn-join")) $("btn-join").addEventListener("click", () => { joinOnline(); });
  if ($("opt-net-code")) {
    $("opt-net-code").addEventListener("input", () => {
      const el = $("opt-net-code");
      const s = el.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (el.value !== s) el.value = s;
    });
  }
  if ($("btn-net-copy")) $("btn-net-copy").addEventListener("click", copyNetInfo);
  if ($("btn-net-cancel")) $("btn-net-cancel").addEventListener("click", cancelNetRoom);
  if ($("btn-load")) $("btn-load").addEventListener("click", loadSaveFromMenu);
  if ($("btn-save")) $("btn-save").addEventListener("click", saveGame);
  if ($("btn-tutorial")) {
    $("btn-tutorial").addEventListener("click", () => { location.href = "新手教程.html"; });
  }
  refreshSaveUi();
  syncMapChoiceUi();
  if ($("btn-settings")) $("btn-settings").addEventListener("click", openSettings);
  if ($("btn-settings-close")) $("btn-settings-close").addEventListener("click", closeSettings);
  if ($("opt-atk-preview")) $("opt-atk-preview").addEventListener("change", readSettingsForm);
  if ($("opt-comp-hud")) $("opt-comp-hud").addEventListener("change", readSettingsForm);
  if ($("opt-music")) $("opt-music").addEventListener("change", readSettingsForm);
  const bgmGestureUnlock = () => { if (musicEnabled() && game && !game.over) refreshBgm(); };
  ["pointerdown", "keydown", "touchstart"].forEach((ev) => {
    window.addEventListener(ev, bgmGestureUnlock, { once: true, passive: true });
  });
  if ($("opt-autosave")) {
    $("opt-autosave").addEventListener("change", readSettingsForm);
    $("opt-autosave").addEventListener("blur", readSettingsForm);
  }
  if ($("modal-settings")) {
    $("modal-settings").addEventListener("click", (e) => {
      if (e.target === $("modal-settings")) closeSettings();
    });
  }
  syncSettingsForm();
  if ($("pill-comp") && !settings.compHud) $("pill-comp").classList.add("hidden");
  $("btn-end").addEventListener("click", () => endPlayerTurn());
  $("btn-end-float").addEventListener("click", () => endPlayerTurn());
  if ($("btn-cheat")) $("btn-cheat").addEventListener("click", () => toggleCheatPanel());
  if ($("btn-cheat-float")) $("btn-cheat-float").addEventListener("click", () => toggleCheatPanel());
  if ($("btn-cheat-close")) $("btn-cheat-close").addEventListener("click", () => toggleCheatPanel(false));
  document.querySelectorAll(".cheat-act").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-cheat");
      if (id) runCheatAction(id);
    });
  });
  if ($("btn-next-idle")) $("btn-next-idle").addEventListener("click", jumpNextIdle);
  if ($("btn-next-idle-float")) $("btn-next-idle-float").addEventListener("click", jumpNextIdle);
  $("btn-cancel").addEventListener("click", () => {
    if (!game) return;
    game.selected = null;
    cancelMode();
    hideCityCard();
    renderInspect();
  });
  if ($("btn-layer-ground")) {
    $("btn-layer-ground").addEventListener("click", () => setMapLayer("ground", { notify: true, fromUser: true }));
  }
  if ($("btn-layer-air")) {
    $("btn-layer-air").addEventListener("click", () => setMapLayer("air", { notify: true, fromUser: true }));
  }
  $("btn-help").addEventListener("click", () => $("modal-help").classList.remove("hidden"));
  $("btn-help-close").addEventListener("click", () => $("modal-help").classList.add("hidden"));
  $("btn-again").addEventListener("click", showMenu);
  $("btn-ranged").addEventListener("click", () => {
    if (!game || !game.selected || game.selected.owner !== localOwner()) return;
    if (!UNITS[game.selected.type].range) return;
    if (tutBlocked("ranged")) {
      tutBlockToast();
      return;
    }
    if (isParked(game.selected)) {
      toast("停场空军需要先起飞才能攻击");
      return;
    }
    if (!canUnitAttack(game.selected)) {
      toast("该单位本回合无法远程攻击");
      return;
    }
    const airCapable = canShootAir(game.selected);
    if (airCapable) {
      if (game.ranged && !game.airAtk) {
        game.ranged = false;
        game.airAtk = false;
      } else {
        game.ranged = true;
        game.airAtk = false;
        setMapLayer("ground");
      }
    } else {
      game.ranged = !game.ranged;
      game.airAtk = false;
      if (game.ranged) setMapLayer("ground");
    }
    game.pendingBuy = null;
    renderInspect();
    renderShop();
    updatePills();
  });
  if ($("btn-air-atk")) {
    $("btn-air-atk").addEventListener("click", () => {
      if (!game || !game.selected || game.selected.owner !== localOwner()) return;
      if (!canShootAir(game.selected)) return;
      if (tutBlocked("ranged")) {
        tutBlockToast();
        return;
      }
      if (isParked(game.selected)) {
        toast("停场空军需要先起飞才能攻击");
        return;
      }
      if (!canUnitAttack(game.selected)) {
        toast("该单位本回合无法远程攻击");
        return;
      }
      if (game.ranged && game.airAtk) {
        game.ranged = false;
        game.airAtk = false;
      } else {
        game.ranged = true;
        game.airAtk = true;
        setMapLayer("air");
      }
      game.pendingBuy = null;
      renderInspect();
      renderShop();
      updatePills();
    });
  }
  if ($("btn-land")) {
    $("btn-land").addEventListener("click", () => {
      if (!game || !game.selected || game.selected.owner !== localOwner()) return;
      if (!isAir(game.selected)) return;
      if (tutBlocked("land")) {
        tutBlockToast();
        return;
      }
      if (!canLocalAct()) return;
      doLand(game.selected);
    });
  }
  if ($("btn-takeoff")) {
    $("btn-takeoff").addEventListener("click", () => {
      if (!game || !game.selected || game.selected.owner !== localOwner()) return;
      if (!isAir(game.selected)) return;
      if (tutBlocked("takeoff")) {
        tutBlockToast();
        return;
      }
      if (!canLocalAct()) return;
      doTakeOff(game.selected);
    });
  }
  if ($("btn-escort")) {
    $("btn-escort").addEventListener("click", () => {
      if (!game || !game.selected || game.selected.owner !== localOwner()) return;
      if (!canLocalAct()) return;
      const u = game.selected;
      let err;
      if (isMilitaryGround(u)) err = formEscort(u, adjacentCivilian(u));
      else err = formEscort(adjacentMilitary(u), u);
      if (err) toast(err);
    });
  }
  if ($("btn-unescort")) {
    $("btn-unescort").addEventListener("click", () => {
      if (!game || !game.selected || game.selected.owner !== localOwner()) return;
      if (!canLocalAct()) return;
      const err = dismissEscort(game.selected);
      if (err) toast(err);
    });
  }
  if ($("btn-road")) {
    $("btn-road").addEventListener("click", () => {
      if (!game || !game.selected || game.selected.owner !== localOwner()) return;
      if (!canLocalAct()) return;
      const err = tryPaveRoad(game.selected);
      if (err) toast(err);
    });
  }
  if ($("btn-fort")) {
    $("btn-fort").addEventListener("click", () => {
      if (!game || !game.selected || game.selected.owner !== localOwner()) return;
      if (!canLocalAct()) return;
      const err = tryBuildFortressHere(game.selected);
      if (err) toast(err);
    });
  }
  if ($("btn-tunnel")) {
    $("btn-tunnel").addEventListener("click", () => {
      if (!game || !game.selected || game.selected.owner !== localOwner()) return;
      if (!canLocalAct()) return;
      if (game.selected.type !== "engineer") return;
      const peaks = nearbyPeaks(game.selected);
      if (!peaks.length) return toast("相邻没有山峰");
      if (peaks.length === 1) {
        const err = tryDigTunnel(game.selected, peaks[0].x, peaks[0].y);
        if (err) toast(err);
        return;
      }
      game.tunnelPick = !game.tunnelPick;
      game.ranged = false;
      game.pendingBuy = null;
      toast(game.tunnelPick ? "左键点击相邻山峰以开隧道" : "已取消");
      renderInspect();
    });
  }
  if ($("btn-board")) {
    $("btn-board").addEventListener("click", () => {
      if (!game || !game.selected || game.selected.owner !== localOwner()) return;
      if (!canLocalAct()) return;
      const ship = game.selected.type === "transport" ? game.selected : adjacentTransport(game.selected);
      const unit = game.selected.type === "transport" ? null : game.selected;
      if (!ship || !unit) return toast("请选中要上船的地面单位");
      const err = boardTransport(ship, unit);
      if (err) toast(err);
    });
  }
  if ($("btn-unload")) {
    $("btn-unload").addEventListener("click", () => {
      if (!game || !game.selected || game.selected.owner !== localOwner()) return;
      if (!canLocalAct()) return;
      const err = unloadTransport(game.selected);
      if (err) toast(err);
    });
  }
  const canvas = $("board");
  canvas.addEventListener("mousedown", onPointerDown);
  canvas.addEventListener("click", onClick);
  canvas.addEventListener("contextmenu", onContext);
  bindTouchCanvas(canvas);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", () => {
    drag = null;
    if (typeof editorOnPointerUp === "function") editorOnPointerUp();
  });
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("auxclick", (e) => { if (e.button === 1) e.preventDefault(); });
  window.addEventListener("keydown", (e) => {
    const typing = e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT");
    if (typing) return;
    keys[e.code] = true;
    if (e.code === "Tab" && game && !$("game-screen").classList.contains("hidden")) {
      e.preventDefault();
      toggleMapLayer();
      return;
    }
    if (e.code === "KeyN" && game && !game.editor && !$("game-screen").classList.contains("hidden")) {
      const helpOpen = $("modal-help") && !$("modal-help").classList.contains("hidden");
      const setOpen = $("modal-settings") && !$("modal-settings").classList.contains("hidden");
      if (!helpOpen && !setOpen) {
        e.preventDefault();
        jumpNextIdle();
        return;
      }
    }
    if (e.code === "Escape") {
      $("modal-help").classList.add("hidden");
      if ($("modal-settings") && !$("modal-settings").classList.contains("hidden")) {
        closeSettings();
        return;
      }
      if (game) {
        if (game.cheatPlace) {
          cheatCancelPlace();
          return;
        }
        game.selected = null;
        cancelMode();
        hideCityCard();
        renderInspect();
      }
    }
  });
  window.addEventListener("keyup", (e) => { keys[e.code] = false; });
  // Avoid fitCam on incidental visualViewport/tap resizes (mobile QQ),
  // which used to yank zoom back to "fit whole map" on every tap.
  let lastBoardLayout = { w: 0, h: 0 };
  function onWindowResize() {
    applyUiScale();
    const screen = $("game-screen");
    if (screen && !screen.classList.contains("hidden")) {
      const wrap = (typeof canvas !== "undefined" && canvas && canvas.parentElement) || null;
      const w = wrap ? wrap.clientWidth : window.innerWidth;
      const h = wrap ? wrap.clientHeight : window.innerHeight;
      resizeCanvas();
      lastBoardLayout = { w, h };
    }
  }
  window.addEventListener("resize", onWindowResize);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", onWindowResize);
  if ($("tab-log")) $("tab-log").addEventListener("click", () => setChatOpen(false));
  if ($("tab-chat")) $("tab-chat").addEventListener("click", () => setChatOpen(true));
  if ($("chat-form")) $("chat-form").addEventListener("submit", sendChat);
  fillHelpUnits();
  syncMenuMode();
  if (typeof editorBind === "function") editorBind();
  if (typeof refreshCustomPicks === "function") refreshCustomPicks();
  if (location.protocol === "http:" || location.protocol === "https:") {
    probeNet(location.origin).then((info) => {
      if (!info) return;
      if ($("opt-net-host") && !$("opt-net-host").value) {
        $("opt-net-host").value = (info.ips && info.ips[0]) || "";
      }
      if ($("online-hint")) {
        $("online-hint").textContent = "房间服务器已连接。创建房间的一方为蓝方；把房间号和主机 IP 发给对方即可。";
      }
    });
  }
}

bind();
