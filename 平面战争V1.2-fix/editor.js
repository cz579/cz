"use strict";

const MAPS_KEY = "planeWar_v08_maps";
const MAPS_MAX = 20;

const ed = {
  owner: "player",
  kind: "terrain",
  terrainId: 0,
  unitType: null,
  brushSize: 1,
  drag: false,
  lastPaint: "",
  dirty: false,
};

function loadMapList() {
  try {
    const raw = localStorage.getItem(MAPS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    return [];
  }
}

function saveMapList(list) {
  try {
    localStorage.setItem(MAPS_KEY, JSON.stringify(list));
    return true;
  } catch (err) {
    toast("保存失败（存储空间不足或浏览器限制）");
    return false;
  }
}

function getCustomMap(id) {
  if (!id) return null;
  return loadMapList().find((m) => m && m.id === id) || null;
}

function newMapId() {
  return "c_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

function defaultMapName() {
  const n = loadMapList().length + 1;
  return "自定义地图 " + n;
}

function blueprintHasOcean(bp) {
  return !!(bp && terrainHasOcean(bp.terrain));
}

function validateCustomMap(bp) {
  if (!bp || bp.w == null || bp.h == null || !bp.terrain) return "地图数据不完整";
  const w = bp.w | 0;
  const h = bp.h | 0;
  if (w < 8 || h < 8) return "地图过小";
  if (bp.terrain.length !== w * h) return "地形尺寸不匹配";
  const at = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return TERRAIN.PLAIN;
    return bp.terrain[x + y * w] || 0;
  };
  const cities = bp.cities || [];
  let blue = 0;
  let red = 0;
  const cityKey = new Set();
  for (const c of cities) {
    if (!c) return "城市数据无效";
    const x = c.x | 0, y = c.y | 0;
    if (x < 0 || y < 0 || x >= w || y >= h) return "城市超出地图";
    const k = x + "," + y;
    if (cityKey.has(k)) return "同一格不能有两座城市";
    cityKey.add(k);
    if (at(x, y) !== TERRAIN.PLAIN) return "城市格必须是平地";
    if (c.owner === "player") blue += 1;
    else if (c.owner === "ai") red += 1;
  }
  if (!blue) return "蓝方至少需要 1 座城市";
  if (!red) return "红方至少需要 1 座城市";

  const bKey = new Set();
  for (const b of bp.buildings || []) {
    if (!b || (b.type !== "airport" && b.type !== "fortress")) return "存在无效建筑";
    const x = b.x | 0, y = b.y | 0;
    if (x < 0 || y < 0 || x >= w || y >= h) return "建筑超出地图";
    const k = x + "," + y;
    if (bKey.has(k)) return "同一格只能有一座建筑";
    bKey.add(k);
    if (cityKey.has(k)) return "建筑不能放在城市格";
    const t = at(x, y);
    if (b.type === "airport" && t !== TERRAIN.PLAIN) return "机场只能建在平地";
    if (b.type === "fortress" && (t === TERRAIN.PEAK || t === TERRAIN.OCEAN)) return "要塞不能建在山峰或海洋";
  }

  function cityTouchesOceanBp(x, y) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h && at(nx, ny) === TERRAIN.OCEAN) return true;
      }
    }
    return false;
  }
  function navyStand(x, y) {
    return at(x, y) === TERRAIN.OCEAN || (cityKey.has(x + "," + y) && cityTouchesOceanBp(x, y));
  }
  function fortAt(x, y) {
    return (bp.buildings || []).some((b) => b.type === "fortress" && (b.x | 0) === x && (b.y | 0) === y);
  }
  function hangarCap(x, y, owner, typeId) {
    const b = (bp.buildings || []).find((bb) => (bb.x | 0) === x && (bb.y | 0) === y && bb.type === "airport" && bb.owner === owner);
    if (b) return (BUILDINGS.airport && BUILDINGS.airport.capacity) || 4;
    if (typeId === "atk" || typeId === "fighter") {
      const ship = (bp.units || []).find((u) => (u.x | 0) === x && (u.y | 0) === y && u.type === "carrier" && u.owner === owner);
      if (ship) return (UNITS.carrier && UNITS.carrier.capacity) || 4;
    }
    return 0;
  }
  function nearestHangarDist(owner, x, y) {
    let best = Infinity;
    for (const b of bp.buildings || []) {
      if (b.type !== "airport" || b.owner !== owner) continue;
      const d = Math.max(Math.abs((b.x | 0) - x), Math.abs((b.y | 0) - y));
      if (d < best) best = d;
    }
    for (const u of bp.units || []) {
      if (u.type !== "carrier" || u.owner !== owner) continue;
      const d = Math.max(Math.abs((u.x | 0) - x), Math.abs((u.y | 0) - y));
      if (d < best) best = d;
    }
    return best;
  }

  const gcount = Object.create(null);
  const ncount = Object.create(null);
  const hangar = Object.create(null);
  for (const u of bp.units || []) {
    if (!u || !UNITS[u.type]) return "存在未知单位";
    const x = u.x | 0, y = u.y | 0;
    if (x < 0 || y < 0 || x >= w || y >= h) return "单位超出地图";
    const def = UNITS[u.type];
    const k = x + "," + y;
    if (def.navy) {
      if (!navyStand(x, y)) return "海军必须在海洋或沿海城市";
      ncount[k] = (ncount[k] || 0) + 1;
      if (ncount[k] > 1) return "同一格只能有一艘舰船";
    } else if (def.air) {
      const hc = hangarCap(x, y, u.owner, u.type);
      if (hc > 0) {
        const hk = u.owner + ":" + k;
        hangar[hk] = (hangar[hk] || 0) + 1;
        if (hangar[hk] > hc) return "机库停场已满";
      } else if (nearestHangarDist(u.owner, x, y) > AIR_MAX_DIST) {
        return "飞行中的空军不能远离己方机场或航母超过 20 格";
      }
    } else {
      const t = at(x, y);
      if (t === TERRAIN.OCEAN || t === TERRAIN.PEAK) return "地面单位不能放在海洋或山峰";
      if (u.type === "coast") {
        let shore = t === TERRAIN.OCEAN;
        if (!shore) {
          for (let dy = -1; dy <= 1 && !shore; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx, ny = y + dy;
              if (nx >= 0 && ny >= 0 && nx < w && ny < h && at(nx, ny) === TERRAIN.OCEAN) { shore = true; break; }
            }
          }
        }
        if (!shore) return "岸防炮必须放在挨着海洋的陆地";
      }
      gcount[k] = (gcount[k] || 0) + 1;
      if (gcount[k] > (fortAt(x, y) ? 2 : 1)) return "该格地面单位超过容量";
    }
  }
  return null;
}

function blueprintFromGame() {
  if (!game) return null;
  return {
    v: 1,
    id: game.mapId || null,
    name: (($("editor-name") && $("editor-name").value.trim()) || game.mapName || "未命名").slice(0, 24),
    updatedAt: Date.now(),
    sizeKey: game.sizeKey || "normal",
    w: game.w,
    h: game.h,
    money: {
      player: clampMapMoney($("editor-money-player") && $("editor-money-player").value),
      ai: clampMapMoney($("editor-money-ai") && $("editor-money-ai").value),
    },
    terrain: Array.from(game.terrain),
    cities: (game.cities || []).map((c) => ({ x: c.x, y: c.y, owner: c.owner })),
    units: (game.units || []).map((u) => ({
      type: u.type,
      owner: u.owner,
      x: u.x,
      y: u.y,
      parked: !!u.parked,
    })),
    buildings: (game.buildings || []).map((b) => ({
      type: b.type,
      owner: b.owner,
      x: b.x,
      y: b.y,
    })),
  };
}

function makeBlankBlueprint(sizeKey) {
  const spec = MAPS[sizeKey] || MAPS.normal;
  return {
    v: 1,
    id: null,
    name: defaultMapName(),
    updatedAt: Date.now(),
    sizeKey: MAPS[sizeKey] ? sizeKey : "normal",
    w: spec.w,
    h: spec.h,
    money: { player: 1000, ai: 1000 },
    terrain: new Array(spec.w * spec.h).fill(TERRAIN.PLAIN),
    cities: [],
    units: [],
    buildings: [],
  };
}

function blueprintFromScenario(id) {
  const scen = SCENARIO_MAPS[id];
  if (!scen) return makeBlankBlueprint("normal");
  const terrain = buildScenarioTerrain(scen);
  const cities = loadScenarioCities(scen);
  return {
    v: 1,
    id: null,
    name: scen.label || id,
    updatedAt: Date.now(),
    sizeKey: scen.id,
    w: scen.w,
    h: scen.h,
    money: { player: 1000, ai: 1000 },
    terrain: Array.from(terrain),
    cities: cities.map((c) => ({ x: c.x, y: c.y, owner: c.owner })),
    units: [],
    buildings: [],
  };
}

function blueprintFromRandom(sizeKey, ocean) {
  const spec = MAPS[sizeKey] || MAPS.normal;
  const cities = placeCities(spec.w, spec.h, spec.cities, !!ocean);
  const terrain = generateTerrain(spec.w, spec.h, cities, !!ocean);
  return {
    v: 1,
    id: null,
    name: (spec.label || "随机") + (ocean ? " · 海洋" : ""),
    updatedAt: Date.now(),
    sizeKey,
    w: spec.w,
    h: spec.h,
    money: { player: 1000, ai: 1000 },
    terrain: Array.from(terrain),
    cities: cities.map((c) => ({ x: c.x, y: c.y, owner: c.owner })),
    units: [],
    buildings: [],
  };
}

function editorMarkDirty() {
  ed.dirty = true;
}

function editorConfirmIfDirty() {
  if (!ed.dirty) return true;
  return window.confirm("有未保存的修改，确定放弃？");
}

function editorSyncFormFromGame() {
  if (!game) return;
  if ($("editor-name")) $("editor-name").value = game.mapName || "";
  if ($("editor-money-player")) $("editor-money-player").value = String(game.money.player);
  if ($("editor-money-ai")) $("editor-money-ai").value = String(game.money.ai);
}

function editorApplyBlueprint(bp) {
  nextId = 1;
  const w = bp.w | 0;
  const h = bp.h | 0;
  game = {
    editor: true,
    mapId: bp.id || null,
    mapName: bp.name || "未命名",
    sizeKey: bp.sizeKey || "normal",
    w,
    h,
    cities: (bp.cities || []).map((c) => makeCity(c.x | 0, c.y | 0, c.owner === "ai" ? "ai" : "player")),
    terrain: copyTerrainBytes(bp.terrain, w, h),
    units: [],
    buildings: [],
    money: {
      player: clampMapMoney(bp.money && bp.money.player),
      ai: clampMapMoney(bp.money && bp.money.ai),
    },
    vehicleTurn: { player: Object.create(null), ai: Object.create(null) },
    soldierBought: { player: 0, ai: 0 },
    aiStyle: "balanced",
    aiMood: 0,
    aiCounterUntil: -1,
    lostCities: { player: [], ai: [] },
    cityLossComp: { player: CITY_LOSS_COMP_BASE, ai: CITY_LOSS_COMP_BASE },
    playerPulse: { atk: 0, cityHit: 0, capture: 0, buyOff: 0, buyDef: 0 },
    turn: 0,
    startTurn: 0,
    endTurn: DEFAULT_TURN_END,
    phase: "player",
    selected: null,
    pendingBuy: null,
    ranged: false,
    airAtk: false,
    tunnelPick: false,
    layer: "ground",
    busy: false,
    over: null,
    hoverPath: [],
    cityControlExtra: 0,
    withOcean: false,
    stats: makeBattleStats(),
    reportEvents: [],
    mode: "vsai",
    localSide: "player",
    logLines: [],
  };
  spawnCustomMapPieces(bp);
  game.withOcean = terrainHasOcean(game.terrain);
  game.cityControlExtra = 0;
  fx = [];
  anim = null;
  hover = null;
  ed.dirty = false;
  ed.drag = false;
  ed.lastPaint = "";
  document.body.dataset.editor = "1";
  document.body.dataset.side = "player";
  if (typeof syncOnlineUi === "function") syncOnlineUi();
  editorSyncFormFromGame();
  fillEditorLoadSelect();
  hideCityCard();
  if ($("log")) $("log").innerHTML = "";
  renderShop();
  renderInspect();
  updatePills();
  updateLayerSwitch();
  fitCam();
}

function enterEditor(bp) {
  editorApplyBlueprint(bp || makeBlankBlueprint("normal"));
  enterGameScreen();
  startLoop();
  requestAnimationFrame(() => {
    resizeCanvas();
    if (game) fitCam();
  });
}

function openMapEditor() {
  enterEditor(makeBlankBlueprint("normal"));
}

function refreshCustomPicks() {
  const box = $("custom-picks");
  const empty = $("custom-picks-empty");
  if (!box) return;
  const list = loadMapList();
  const prev = box.querySelector(".map-pick.selected");
  const prevId = prev && prev.dataset.mapId;
  box.innerHTML = "";
  if (!list.length) {
    if (empty) empty.classList.remove("hidden");
    return;
  }
  if (empty) empty.classList.add("hidden");
  for (const m of list) {
    if (!m || !m.id) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "map-pick";
    btn.dataset.mapId = m.id;
    const ocean = blueprintHasOcean(m) ? "有海洋" : "无海洋";
    const nCity = (m.cities || []).length;
    btn.innerHTML = `<span class="map-name">${m.name || "未命名"}</span><span class="map-size">${m.w} × ${m.h}</span><span class="map-meta">城市 ${nCity} · ${ocean}</span>`;
    if (m.id === prevId) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      document.querySelectorAll("#map-picks .map-pick").forEach((b) => b.classList.remove("selected"));
      document.querySelectorAll("#scenario-picks .map-pick").forEach((b) => b.classList.remove("selected"));
      document.querySelectorAll("#custom-picks .map-pick").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      syncMapChoiceUi();
    });
    box.appendChild(btn);
  }
}

function fillEditorLoadSelect() {
  const sel = $("editor-load");
  if (!sel) return;
  const cur = "";
  sel.innerHTML = "";
  const add = (parent, value, label) => {
    const o = document.createElement("option");
    o.value = value;
    o.textContent = label;
    parent.appendChild(o);
  };
  add(sel, "", "载入地图…");
  const blank = document.createElement("optgroup");
  blank.label = "空白";
  for (const key of Object.keys(MAPS)) add(blank, "blank:" + key, MAPS[key].label + " " + MAPS[key].w + "×" + MAPS[key].h);
  sel.appendChild(blank);
  const scenG = document.createElement("optgroup");
  scenG.label = "固定地图";
  for (const key of Object.keys(SCENARIO_MAPS)) add(scenG, "scen:" + key, SCENARIO_MAPS[key].label);
  sel.appendChild(scenG);
  const randG = document.createElement("optgroup");
  randG.label = "随机生成";
  for (const key of Object.keys(MAPS)) add(randG, "rand:" + key, MAPS[key].label);
  sel.appendChild(randG);
  const saved = loadMapList();
  if (saved.length) {
    const g = document.createElement("optgroup");
    g.label = "已保存";
    for (const m of saved) add(g, "map:" + m.id, m.name || "未命名");
    sel.appendChild(g);
  }
  sel.value = cur;
}

function editorLoadFromSelect() {
  const sel = $("editor-load");
  if (!sel || !sel.value) return;
  if (!editorConfirmIfDirty()) {
    sel.value = "";
    return;
  }
  const v = sel.value;
  sel.value = "";
  let bp = null;
  if (v.startsWith("blank:")) bp = makeBlankBlueprint(v.slice(6));
  else if (v.startsWith("scen:")) bp = blueprintFromScenario(v.slice(5));
  else if (v.startsWith("rand:")) bp = blueprintFromRandom(v.slice(5), !!($("editor-ocean") && $("editor-ocean").checked));
  else if (v.startsWith("map:")) bp = getCustomMap(v.slice(4));
  if (!bp) {
    toast("无法载入该地图");
    return;
  }
  editorApplyBlueprint(bp);
  resizeCanvas();
  fitCam();
}

function editorSave(asNew) {
  if (!game || !game.editor) return;
  const bp = blueprintFromGame();
  const list = loadMapList();
  if (asNew || !bp.id) {
    if (list.length >= MAPS_MAX) {
      toast("最多保存 " + MAPS_MAX + " 张，请先删除或覆盖保存");
      return;
    }
    bp.id = newMapId();
  }
  const idx = list.findIndex((m) => m.id === bp.id);
  if (idx >= 0) list[idx] = bp;
  else {
    if (list.length >= MAPS_MAX) {
      toast("最多保存 " + MAPS_MAX + " 张，请先删除或覆盖保存");
      return;
    }
    list.push(bp);
  }
  if (!saveMapList(list)) return;
  game.mapId = bp.id;
  game.mapName = bp.name;
  ed.dirty = false;
  fillEditorLoadSelect();
  refreshCustomPicks();
  toast("已保存「" + bp.name + "」");
}

function editorDelete() {
  if (!game || !game.editor || !game.mapId) {
    toast("当前图还未保存");
    return;
  }
  if (!window.confirm("删除本机保存的「" + (game.mapName || "该地图") + "」？")) return;
  const list = loadMapList().filter((m) => m.id !== game.mapId);
  if (!saveMapList(list)) return;
  game.mapId = null;
  ed.dirty = true;
  fillEditorLoadSelect();
  refreshCustomPicks();
  toast("已删除保存的地图，编辑内容仍在");
}

function editorBack() {
  if (!editorConfirmIfDirty()) return;
  ed.dirty = false;
  showMenu();
}

function editorSetKind(kind, extra) {
  ed.kind = kind;
  if (kind === "terrain") ed.terrainId = extra != null ? extra : ed.terrainId;
  if (kind === "unit") ed.unitType = extra;
  document.querySelectorAll("#editor-terrain .editor-pick").forEach((b) => {
    b.classList.toggle("selected", kind === "terrain" && Number(b.dataset.terrain) === ed.terrainId);
  });
  document.querySelectorAll("#editor-place .editor-pick").forEach((b) => {
    b.classList.toggle("selected", b.dataset.kind === kind);
  });
  document.querySelectorAll("#editor-units .shop-item").forEach((b) => {
    b.classList.toggle("active", kind === "unit" && b.dataset.unit === ed.unitType);
  });
}

function editorRemoveAt(x, y, opts) {
  opts = opts || {};
  const dropCity = !!opts.city;
  const dropBld = opts.building !== false;
  const dropUnits = opts.units !== false;
  if (dropCity) game.cities = game.cities.filter((c) => !(c.x === x && c.y === y));
  if (dropBld) game.buildings = game.buildings.filter((b) => !(b.x === x && b.y === y));
  if (dropUnits) game.units = game.units.filter((u) => !(u.x === x && u.y === y));
}

function editorNormalizeTile(x, y) {
  if (!inBounds(x, y)) return;
  const city = cityAt(x, y);
  if (city) game.terrain[x + y * game.w] = TERRAIN.PLAIN;
  const t = terrainAt(x, y);
  const b = buildingAt(x, y);
  if (b) {
    const badAir = b.type === "airport" && (city || t !== TERRAIN.PLAIN);
    const badFort = b.type === "fortress" && (city || t === TERRAIN.PEAK || t === TERRAIN.OCEAN);
    if (badAir || badFort) {
      game.buildings = game.buildings.filter((bb) => bb !== b);
    }
  }
  game.units = game.units.filter((u) => {
    if (u.x !== x || u.y !== y) return true;
    if (isNavy(u) && !navyCanStand(x, y)) return false;
    if (!isAir(u) && !isNavy(u) && (isOceanAt(x, y) || isPeakAt(x, y))) return false;
    return true;
  });
  for (const u of game.units) {
    if (u.x === x && u.y === y && isAir(u)) u.parked = !!homeAirportAt(u);
  }
  while (groundOccupancy(x, y) > groundCapacity(x, y)) {
    const gnd = groundUnitsAt(x, y);
    const last = gnd[gnd.length - 1];
    if (!last) break;
    game.units = game.units.filter((u) => u.id !== last.id);
  }
  const ships = navyUnitsAt(x, y);
  if (ships.length > 1) {
    const keep = ships[0].id;
    game.units = game.units.filter((u) => u.x !== x || u.y !== y || !isNavy(u) || u.id === keep);
  }
}

function editorPaintTerrainCell(x, y, kind) {
  if (!inBounds(x, y)) return;
  if (cityAt(x, y)) {
    game.terrain[x + y * game.w] = TERRAIN.PLAIN;
  } else {
    game.terrain[x + y * game.w] = kind;
  }
  editorNormalizeTile(x, y);
}

function editorStampTerrain(cx, cy, kind) {
  const r = ed.brushSize === 3 ? 1 : 0;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) editorPaintTerrainCell(cx + dx, cy + dy, kind);
  }
  game.withOcean = terrainHasOcean(game.terrain);
}

function editorPlaceCity(x, y) {
  if (!inBounds(x, y)) return "超出地图";
  editorRemoveAt(x, y, { city: true, building: true, units: false });
  game.terrain[x + y * game.w] = TERRAIN.PLAIN;
  const exist = cityAt(x, y);
  if (exist) exist.owner = ed.owner;
  else game.cities.push(makeCity(x, y, ed.owner));
  editorNormalizeTile(x, y);
  return null;
}

function editorPlaceBuilding(type, x, y) {
  if (!inBounds(x, y)) return "超出地图";
  if (cityAt(x, y)) return "不能建在城市格";
  if (buildingAt(x, y)) return "该格已有建筑";
  const t = terrainAt(x, y);
  if (type === "airport") {
    if (t !== TERRAIN.PLAIN) return "机场只能建在平地";
  } else if (type === "fortress") {
    if (t === TERRAIN.PEAK || t === TERRAIN.OCEAN) return "要塞不能建在山峰或海洋";
  } else return "未知建筑";
  const def = BUILDINGS[type];
  game.buildings.push({
    id: nextId++,
    type,
    owner: ed.owner,
    x, y,
    hp: def.hp,
    maxHp: def.hp,
  });
  editorNormalizeTile(x, y);
  return null;
}

function editorPlaceUnit(typeId, x, y) {
  if (!inBounds(x, y)) return "超出地图";
  const def = UNITS[typeId];
  if (!def) return "未知单位";
  const owner = ed.owner;
  if (def.navy) {
    if (!navyCanStand(x, y)) return "海军只能放在海洋或沿海城市";
    if (navyUnitAt(x, y)) return "该格已有舰船";
  } else if (def.air) {
    const hangar = homeAirportAt({ type: typeId, owner }, x, y);
    if (hangar) {
      const cap = hangarCapacityAt(x, y, owner, { type: typeId });
      if (hangarOccupancy(x, y, owner) >= cap) return "该机库已停满";
    }
  } else {
    if (isOceanAt(x, y) || isPeakAt(x, y)) return isOceanAt(x, y) ? "不能把地面单位放在海洋" : "不能把地面单位放在山峰";
    if (typeId === "coast" && !tileTouchesOcean(x, y)) return "岸防炮只能放在挨着海洋的陆地";
    if (groundOccupancy(x, y) >= groundCapacity(x, y)) return "该格地面已满";
    if (groundClassConflict(typeId, x, y)) return "士兵与非士兵不能放在同一格";
  }
  const u = makeUnit(typeId, owner, x, y, { justDeployed: false, moved: false, acted: false });
  u.attacksLeft = def.attacks;
  if (def.air) u.parked = !!homeAirportAt(u);
  game.units.push(u);
  return null;
}

function editorErase(x, y) {
  if (!inBounds(x, y)) return;
  if (ed.kind === "terrain") {
    editorStampTerrain(x, y, TERRAIN.PLAIN);
    return;
  }
  const airHere = airUnitsAt(x, y);
  const gnd = groundUnitsAt(x, y);
  const ships = navyUnitsAt(x, y);
  if (airHere.length) {
    const id = airHere[airHere.length - 1].id;
    game.units = game.units.filter((u) => u.id !== id);
  } else if (gnd.length || ships.length) {
    const u = gnd[gnd.length - 1] || ships[ships.length - 1];
    game.units = game.units.filter((uu) => uu.id !== u.id);
  } else if (buildingAt(x, y)) {
    game.buildings = game.buildings.filter((b) => !(b.x === x && b.y === y));
    editorNormalizeTile(x, y);
  } else if (cityAt(x, y)) {
    game.cities = game.cities.filter((c) => !(c.x === x && c.y === y));
  } else {
    game.terrain[x + y * game.w] = TERRAIN.PLAIN;
  }
}

function editorApplyAt(x, y) {
  if (!game || !game.editor || !inBounds(x, y)) return;
  const key = x + "," + y + ":" + ed.kind + ":" + ed.terrainId + ":" + ed.unitType;
  if (ed.drag && ed.lastPaint === key) return;
  ed.lastPaint = key;
  let err = null;
  if (ed.kind === "terrain") editorStampTerrain(x, y, ed.terrainId);
  else if (ed.kind === "city") err = editorPlaceCity(x, y);
  else if (ed.kind === "airport") err = editorPlaceBuilding("airport", x, y);
  else if (ed.kind === "fortress") err = editorPlaceBuilding("fortress", x, y);
  else if (ed.kind === "unit") err = editorPlaceUnit(ed.unitType, x, y);
  if (err) toast(err);
  else editorMarkDirty();
}

function editorOnPointerDown(e) {
  if (!game || !game.editor || e.button !== 0) return false;
  if (pointerOnMinimap(e).hit) return false;
  const t = screenToTile(e.clientX, e.clientY);
  if (!t) return false;
  editorApplyAt(t.x, t.y);
  skipClick = true;
  if (ed.kind === "terrain") ed.drag = true;
  return true;
}

function editorOnMove(e) {
  if (!ed.drag || !game || !game.editor) return;
  if (!(e.buttons & 1)) {
    ed.drag = false;
    return;
  }
  const t = screenToTile(e.clientX, e.clientY);
  if (t) editorApplyAt(t.x, t.y);
}

function editorOnPointerUp() {
  ed.drag = false;
  ed.lastPaint = "";
}

function editorOnClick(e) {
  if (!game || !game.editor) return;
  if (pointerOnMinimap(e).hit) return;
  const t = screenToTile(e.clientX, e.clientY);
  if (!t) return;
  if (ed.kind !== "terrain") editorApplyAt(t.x, t.y);
}

function editorOnContext(e) {
  if (!game || !game.editor) return;
  if (pointerOnMinimap(e).hit) return;
  const t = screenToTile(e.clientX, e.clientY);
  if (!t) return;
  editorErase(t.x, t.y);
  editorMarkDirty();
}

function fillEditorTerrain() {
  const box = $("editor-terrain");
  if (!box) return;
  box.innerHTML = "";
  TERRAIN_NAMES.forEach((name, id) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "editor-pick" + (id === 0 ? " selected" : "");
    btn.dataset.terrain = String(id);
    btn.textContent = name;
    btn.addEventListener("click", () => editorSetKind("terrain", id));
    box.appendChild(btn);
  });
}

function fillEditorUnits() {
  const box = $("editor-units");
  if (!box) return;
  box.innerHTML = SHOP_SECTIONS.filter((sec) => !sec.ids.every(isBuildingType)).map((sec) => {
    const items = sec.ids.filter((id) => UNITS[id]).map((id) => {
      const u = UNITS[id];
      const cls = ["shop-item"];
      if (u.air) cls.push("air");
      if (u.navy) cls.push("navy");
      if (u.civ || id === "engineer") cls.push("civ");
      return `<button type="button" class="${cls.join(" ")}" data-unit="${id}"><b>${u.name}</b></button>`;
    }).join("");
    return `<div class="shop-sec">${sec.title}</div>${items}`;
  }).join("");
  box.querySelectorAll(".shop-item").forEach((btn) => {
    btn.addEventListener("click", () => editorSetKind("unit", btn.dataset.unit));
  });
}

function editorBind() {
  if (!$("editor-bar")) return;
  if ($("btn-map-editor")) $("btn-map-editor").addEventListener("click", () => openMapEditor());
  fillEditorTerrain();
  fillEditorUnits();
  fillEditorLoadSelect();
  document.querySelectorAll("#editor-owner .editor-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      ed.owner = btn.dataset.owner === "ai" ? "ai" : "player";
      document.querySelectorAll("#editor-owner .editor-pick").forEach((b) => b.classList.toggle("selected", b === btn));
    });
  });
  document.querySelectorAll("#editor-brush-size .editor-pick").forEach((btn) => {
    btn.addEventListener("click", () => {
      ed.brushSize = Number(btn.dataset.size) === 3 ? 3 : 1;
      document.querySelectorAll("#editor-brush-size .editor-pick").forEach((b) => b.classList.toggle("selected", b === btn));
    });
  });
  document.querySelectorAll("#editor-place .editor-pick").forEach((btn) => {
    btn.addEventListener("click", () => editorSetKind(btn.dataset.kind));
  });
  if ($("editor-load")) $("editor-load").addEventListener("change", editorLoadFromSelect);
  if ($("btn-editor-save")) $("btn-editor-save").addEventListener("click", () => editorSave(false));
  if ($("btn-editor-saveas")) $("btn-editor-saveas").addEventListener("click", () => editorSave(true));
  if ($("btn-editor-delete")) $("btn-editor-delete").addEventListener("click", editorDelete);
  if ($("btn-editor-back")) $("btn-editor-back").addEventListener("click", editorBack);
  if ($("editor-name")) {
    $("editor-name").addEventListener("input", () => {
      if (game && game.editor) game.mapName = $("editor-name").value.trim().slice(0, 24);
      editorMarkDirty();
    });
  }
  const moneySync = (el, owner) => {
    if (!el) return;
    const apply = () => {
      if (!game || !game.editor) return;
      game.money[owner] = clampMapMoney(el.value);
      el.value = String(game.money[owner]);
      editorMarkDirty();
    };
    el.addEventListener("change", apply);
    el.addEventListener("blur", apply);
  };
  moneySync($("editor-money-player"), "player");
  moneySync($("editor-money-ai"), "ai");
}

if ($("editor-bar")) {
  editorBind();
  refreshCustomPicks();
}
