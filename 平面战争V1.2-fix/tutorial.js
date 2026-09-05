"use strict";

const TUT_DEPLOY = [
  { x: 2, y: 5 },
  { x: 3, y: 5 },
  { x: 3, y: 4 },
  { x: 3, y: 6 },
];
const TUT_MOVE = { x: 5, y: 5 };
const TUT_CITY_FRONT = { x: 9, y: 5 };
const TUT_MORTAR_AIM = { x: 11, y: 3 };
const TUT_AIRPORT = { x: 1, y: 5 };
const TUT_AIR_MOVE = { x: 5, y: 2 };
const TUT_AIR_GROUND = { x: 8, y: 2 };
const TUT_AIR_FOE = { x: 7, y: 4 };
const TUT_AA = { x: 4, y: 5 };
const TUT_AA_FOE = { x: 8, y: 5 };
const TUT_HOME = { x: 2, y: 5 };

let tutIndex = 0;
let tutReady = false;

function tutSetCard(step) {
  const n = TUT_STEPS.length;
  $("tut-progress").textContent = `教学 ${tutIndex + 1} / ${n}`;
  $("tut-title").textContent = step.title;
  $("tut-body").textContent = step.body;
  const task = $("tut-task");
  if (step.task) {
    task.textContent = "当前任务：" + step.task;
    task.classList.remove("hidden");
  } else {
    task.textContent = "";
    task.classList.add("hidden");
  }
  const next = $("tut-next");
  const skipStep = $("tut-skip-step");
  if (step.done) {
    next.textContent = "开始战役";
    next.classList.remove("hidden");
    if (skipStep) skipStep.classList.add("hidden");
  } else if (step.wait) {
    next.classList.add("hidden");
    if (skipStep) skipStep.classList.remove("hidden");
  } else {
    next.textContent = "下一步";
    next.classList.remove("hidden");
    if (skipStep) skipStep.classList.remove("hidden");
  }
}

function tutApply(step) {
  game.tutAllow = Object.assign({ inspect: true }, step.allow || {});
  game.tutTiles = step.tiles ? step.tiles.map((t) => ({ x: t.x, y: t.y })) : [];
  game.tutLockTiles = !!step.lockTiles;
  game.tutShop = step.shop || null;
  game.tutHint = step.task || "请按教学提示操作";
  game.tutPulseRanged = !!step.pulseRanged;
  game.tutPulseAir = !!step.pulseAir;
  game.tutPulseLayer = step.pulseLayer || null;
  game.tutPulseUpgrade = step.pulseUpgrade || null;
  game.pendingBuy = null;
  game.ranged = false;
  game.airAtk = false;
  hideCityCard();
  if (step.layer) setMapLayer(step.layer);
  if (step.enter) step.enter();
  renderShop();
  renderInspect();
  updatePills();
  updateLayerSwitch();
  tutSetCard(step);
}

function tutGoto(i) {
  tutIndex = clamp(i, 0, TUT_STEPS.length - 1);
  tutApply(TUT_STEPS[tutIndex]);
}

function tutNext() {
  if (tutIndex >= TUT_STEPS.length - 1) {
    location.href = "index.html";
    return;
  }
  tutGoto(tutIndex + 1);
}

function tutRefundAttack(unit) {
  if (!unit || !game.units.includes(unit)) return;
  const def = UNITS[unit.type];
  unit.attacksLeft = def.attacks;
  unit.lastAttackTurn = null;
  unit.acted = false;
  unit.defending = false;
}

function tutOnEvent(evt, data) {
  if (!tutReady || !game || !game.tutorial) return;
  const step = TUT_STEPS[tutIndex];
  if (!step || !step.wait) return;
  if (step.wait.evt !== evt) return;
  if (step.wait.test && !step.wait.test(data)) {
    if (evt === "ranged" && data.unit && game.units.includes(data.unit)) {
      const u = data.unit;
      if (u.type === "mortar") {
        tutRefundAttack(u);
        game.ranged = true;
        game.airAtk = false;
        renderInspect();
        toast("请瞄准闪光格子，轰击那一团敌军");
      } else if (isAir(u) || u.type === "aa" || u.type === "spaa") {
        tutRefundAttack(u);
        game.ranged = true;
        game.airAtk = !!step.pulseAir;
        if (step.pulseAir) setMapLayer("air");
        else setMapLayer("ground");
        renderInspect();
        toast("请按教学选择攻击方式，再点闪光目标");
      }
    }
    return;
  }
  setTimeout(() => {
    if (!game || !game.tutorial) return;
    if (TUT_STEPS[tutIndex] !== step) return;
    tutNext();
  }, 280);
}

function tutPlayerUnit() {
  return game.units.find((u) => u.owner === "player" && u.type === "line")
    || game.units.find((u) => u.owner === "player" && !isAir(u))
    || null;
}

function tutPlayerAir() {
  return game.units.find((u) => u.owner === "player" && isAir(u)) || null;
}

function tutPlace(type, owner, x, y, extra) {
  let spot = { x, y };
  if (getTile(x, y).unit && !isAirType(type)) {
    let found = null;
    for (let r = 1; r <= 5 && !found; r++) {
      for (let dy = -r; dy <= r && !found; dy++) {
        for (let dx = -r; dx <= r && !found; dx++) {
          const nx = x + dx, ny = y + dy;
          if (!inBounds(nx, ny) || getTile(nx, ny).unit) continue;
          const c = game.cities.find((n) => n.x === nx && n.y === ny);
          if (c && c.owner !== owner) continue;
          found = { x: nx, y: ny };
        }
      }
    }
    if (found) spot = found;
  }
  const unit = makeUnit(type, owner, spot.x, spot.y, extra);
  game.units.push(unit);
  return unit;
}

function tutGive(n) {
  game.money.player = Math.max(game.money.player, n);
}

const TUT_STEPS = [
  {
    title: "欢迎入伍",
    body: "你指挥蓝方，红方由电脑控制。占领对方全部城市即获胜；自己的城市全部失守则战败。教学中红方不会还手，先熟悉地面，再学空域。",
    allow: { inspect: true },
    tiles: [{ x: 2, y: 5 }],
    layer: "ground",
  },
  {
    title: "城市与控制区",
    body: "每座城市占 1 格，周围 8 格（含斜角）是控制区。蓝色是你的，红色是敌人。城市 10 点生命，己方回合开始回复 2 点。滚轮缩放，拖动或 WASD 平移地图。",
    allow: { inspect: true },
    tiles: [{ x: 2, y: 5 }],
    layer: "ground",
  },
  {
    title: "地形",
    body: "格子有平地、森林、丘陵和山峰。步兵进林不减速，车辆进林或上坡更慢。林中步兵、丘陵上的单位受地面伤害 −1，与防守不叠加。坦克和步战车在森林里输出 −1。直射会被中间的森林、丘陵或山峰挡住；攻城炮和迫击炮可越过林丘，但山峰挡住曲射。地面单位无法进入山峰，也不能把可移动单位部署上去，防空炮可以。丘陵或山峰上直射射程 +1。城市格永远是平地。战役开局若勾选生成海洋，还会出现海格：地面不能走，海军只能在海洋或沿海城市行动。把鼠标悬停到格子上可看地形。",
    allow: { inspect: true },
    tiles: [{ x: 8, y: 8 }, { x: 12, y: 1 }, { x: 16, y: 8 }],
    layer: "ground",
  },
  {
    title: "查看城市",
    body: "右键城市可以查看生命、驻守和升级效果。先看自己的蓝城。",
    task: "右键点击闪光的蓝色城市",
    allow: { inspect: true },
    tiles: [{ x: 2, y: 5 }],
    layer: "ground",
    wait: { evt: "inspectCity", test: (d) => d.city && d.city.owner === "player" },
  },
  {
    title: "购买士兵",
    body: "开局各方 1000 元。填线兵只要 150 元，属于士兵，此时可以随便买。先在右侧征召栏点选它。",
    task: "在征召栏点击「填线兵」",
    allow: { shop: true, inspect: true },
    shop: "line",
    layer: "ground",
    wait: { evt: "shop", test: (d) => d.id === "line" },
  },
  {
    title: "部署部队",
    body: "选中兵种后，在己方城市或控制区空格右键即可部署。新部署的单位当回合不能行动。",
    task: "在闪光格子上右键部署填线兵",
    allow: { shop: true, deploy: true, inspect: true },
    shop: "line",
    tiles: TUT_DEPLOY,
    lockTiles: true,
    layer: "ground",
    enter() {
      game.pendingBuy = "line";
    },
    wait: { evt: "buy", test: (d) => d.typeId === "line" },
  },
  {
    title: "结束准备回合",
    body: "第 0 回合是准备阶段，只能买兵部署。点「结束回合」进入第 1 回合。教学中红方不会行动。",
    task: "点击「结束回合」",
    allow: { endTurn: true, inspect: true },
    layer: "ground",
    wait: { evt: "endTurn" },
  },
  {
    title: "选中单位",
    body: "从第 1 回合起，单位可以行动。左键点自己的填线兵，选中后会显示可到达格子。",
    task: "左键选中你的填线兵",
    allow: { select: true, inspect: true },
    layer: "ground",
    wait: { evt: "select", test: (d) => d.unit && d.unit.owner === "player" && !isAir(d.unit) },
  },
  {
    title: "移动",
    body: "选中后，左键点蓝色可到达格子即可移动。填线兵每回合最多走 3 格（上下左右，不能斜走）。本回合移动后就不能再近战突击。",
    task: "把填线兵移动到闪光格子",
    allow: { select: true, move: true, inspect: true },
    tiles: [TUT_MOVE],
    lockTiles: true,
    layer: "ground",
    wait: { evt: "move", test: (d) => d.x === TUT_MOVE.x && d.y === TUT_MOVE.y && !isAir(d.unit) },
  },
  {
    title: "近战突击",
    body: "近战可以边移动边打：选中后左键敌方单位/城市，或右键敌方单位。我在前方放了一个只剩 1 点生命的红方填线兵。",
    task: "选中填线兵，突击消灭闪光处的敌军",
    allow: { select: true, melee: true, inspect: true },
    layer: "ground",
    enter() {
      tutQuietTurn();
      const u = tutPlayerUnit();
      const x = u ? u.x + 2 : 7;
      const y = u ? u.y : 5;
      const foe = tutPlace("line", "ai", x, y, { hp: 1 });
      game.tutTiles = [{ x: foe.x, y: foe.y }];
      if (u) game.selected = u;
    },
    wait: { evt: "melee" },
  },
  {
    title: "占领城市",
    body: "近战把敌城生命打到 0，突击单位进入该格，城市易主，生命变为 1。前面那座红城现在只剩 1 点生命。若本回合已经行动，先结束回合再突击。",
    task: "结束回合（如已行动），再突击闪光的红城并占领",
    allow: { select: true, move: true, melee: true, endTurn: true, inspect: true },
    tiles: [TUT_CITY_FRONT],
    layer: "ground",
    enter() {
      const c = game.cities.find((n) => n.x === TUT_CITY_FRONT.x && n.y === TUT_CITY_FRONT.y);
      if (c) {
        c.owner = "ai";
        c.hp = 1;
      }
      const occ = getTile(TUT_CITY_FRONT.x, TUT_CITY_FRONT.y).unit;
      if (occ && occ.owner === "ai") game.units = game.units.filter((u) => u.id !== occ.id);
    },
    wait: { evt: "capture" },
  },
  {
    title: "金钱与补偿",
    body: "从第 1 回合起，每座城市每回合提供 100 元。每失去一座城市，原主人立刻获得补偿：首次 1750 元，之后每再丢一座 +500 元；攻占一座城市后，自己的失城补偿重置为 1750 元。刚才红方丢城，已经拿到补偿。",
    allow: { inspect: true, select: true },
    layer: "ground",
  },
  {
    title: "防守与驻守",
    body: "地面单位 1 回合没有任何行动即进入防守：每回合回复 1 点生命，受到近战伤害 −1；一旦行动就解除。被攻击不算行动。有单位站在城市格上时，打这座城或这个单位的伤害由城与单位平分；打单位溢出的伤害转给城市。空军不能进入防守。",
    allow: { inspect: true, select: true },
    layer: "ground",
  },
  {
    title: "交战反伤",
    body: "近战或远程打敌方地面单位时，比较双方对该目标的近战伤害。若对方近战更高，攻击者承受双方伤害差的一半。只打空城、城中无驻守时不触发。空军攻击一般不受反伤，但打防空炮或自行防空炮会承受其对空伤害的一半。",
    allow: { inspect: true, select: true },
    layer: "ground",
  },
  {
    title: "迫击炮",
    body: "迫击炮远程伤害 4、射程 6。点「远程攻击」后再点一个格子，对该格造成全额伤害 4、周围一圈溅射 3，会误伤友军。2 回合内只能攻击 1 次，且同一回合不能既移动又攻击。步战车和坦克也能远程：射程 2，伤害与近战相同，移动后仍可开火。",
    task: "选中迫击炮，点「远程攻击」，再点闪光格子开炮",
    allow: { select: true, ranged: true, inspect: true },
    pulseRanged: true,
    tiles: [TUT_MORTAR_AIM],
    layer: "ground",
    enter() {
      tutQuietTurn();
      const m = tutPlace("mortar", "player", 6, 2, { justDeployed: false, attacksLeft: 1, lastAttackTurn: null });
      tutPlace("line", "ai", 10, 3, { hp: 3 });
      tutPlace("line", "ai", 11, 3, { hp: 3 });
      tutPlace("line", "ai", 10, 4, { hp: 3 });
      game.selected = m;
      game.tutTiles = [TUT_MORTAR_AIM];
    },
    wait: { evt: "ranged", test: (d) => d.splash && d.hits > 0 },
  },
  {
    title: "购买限制",
    body: "第 10 回合起，每回合士兵总共最多买 6 个。非士兵（含机场、海军）每种各自每 2 回合只能买 1 次，冷却不共享——同一回合可以买坦克和火炮，但不能连续买两辆同型坦克。",
    allow: { inspect: true, select: true },
    layer: "ground",
  },
  {
    title: "地面与空域",
    body: "左上角可切换「地面 / 空域」，快捷键 Tab。地面层操作地面单位、城市与近战；空域层操作空军与机场。空域中地面单位会变淡，便于看飞机。",
    task: "点击左上角「空域」按钮（或按 Tab）",
    allow: { inspect: true, layer: true },
    pulseLayer: "air",
    layer: "ground",
    wait: { evt: "layer", test: (d) => d.layer === "air" },
  },
  {
    title: "建造机场",
    body: "机场 300 元，只能建在控制区空格，一格一座，生命 8，每座最多停 4 架友军空军。空军必须从机场起飞。飞到机场格可降落停场，停场每回合回复 2 点生命且不会被打到。建好后可右键查看停场。",
    task: "在征召栏点击「机场」，再在闪光格子右键建造",
    allow: { shop: true, deploy: true, inspect: true, layer: true },
    shop: "airport",
    tiles: [TUT_AIRPORT],
    lockTiles: true,
    layer: "ground",
    enter() {
      tutGive(1200);
      game.pendingBuy = "airport";
    },
    wait: { evt: "buy", test: (d) => d.typeId === "airport" },
  },
  {
    title: "部署空军",
    body: "攻击机 650 元，对地伤害 4、对空伤害 3、射程 4。空军只能在己方机场右击部署，攻击机和战斗机也可停在航空母舰上。无法近战、无法进入防守。新部署当回合同样不能行动。",
    task: "点选「攻击机」，再在闪光的机场上右键部署",
    allow: { shop: true, deploy: true, inspect: true, layer: true, select: true },
    shop: "atk",
    tiles: [TUT_AIRPORT],
    lockTiles: true,
    layer: "air",
    enter() {
      tutGive(800);
      game.pendingBuy = "atk";
      const ap = ownerAirports("player")[0];
      if (ap) game.tutTiles = [{ x: ap.x, y: ap.y }];
    },
    wait: { evt: "buy", test: (d) => d.typeId === "atk" },
  },
  {
    title: "起飞准备",
    body: "飞机已经部署在机场。结束回合后，新部署的空军才能移动和攻击。之后飞回机场可以点「降落」停场回血。教学中红方仍不会行动。",
    task: "点击「结束回合」",
    allow: { endTurn: true, inspect: true, layer: true },
    layer: "air",
    wait: { evt: "endTurn" },
  },
  {
    title: "空中机动",
    body: "空军按直线飞（含斜角），攻击机每回合最多飞 6 格。不能远离最近友军机场或航母超过 20 格。空军须先移动后攻击：选中后左键蓝色格子飞过去，打完本回合就不能再飞走。若看不到飞机，先点左上角「空域」。",
    task: "选中攻击机，飞到闪光格子",
    allow: { select: true, move: true, inspect: true, layer: true },
    tiles: [TUT_AIR_MOVE],
    lockTiles: true,
    layer: "air",
    enter() {
      const plane = tutPlayerAir();
      if (plane) {
        game.selected = plane;
        setMapLayer("air");
      }
    },
    wait: { evt: "move", test: (d) => isAir(d.unit) && d.x === TUT_AIR_MOVE.x && d.y === TUT_AIR_MOVE.y },
  },
  {
    title: "攻击地面",
    body: "空军不能近战，且必须先移动后攻击。已经飞到位后，点「攻击地面」（会切到地面层），再点地面目标。攻击机会对地造成 4 点伤害，射程 4。可误伤友军。除防空炮和自行防空炮外，地面单位无法还手；攻击这两种防空单位会受到其对空伤害的一半。",
    task: "点「攻击地面」，再点闪光处的敌军",
    allow: { select: true, ranged: true, inspect: true, layer: true },
    pulseRanged: true,
    tiles: [TUT_AIR_GROUND],
    lockTiles: true,
    layer: "air",
    enter() {
      const plane = tutPlayerAir();
      if (plane) {
        plane.x = TUT_AIR_MOVE.x;
        plane.y = TUT_AIR_MOVE.y;
        game.selected = plane;
      }
      const foe = tutPlace("line", "ai", TUT_AIR_GROUND.x, TUT_AIR_GROUND.y, { hp: 3 });
      game.tutTiles = [{ x: foe.x, y: foe.y }];
      setMapLayer("air");
    },
    wait: {
      evt: "ranged",
      test: (d) => d.mode === "ground" && isAir(d.unit) && (game.tutTiles || []).some((t) => t.x === d.x && t.y === d.y),
    },
  },
  {
    title: "攻击空军",
    body: "对空要另点「攻击空军」（会切到空域），再点空域里的飞机。战斗机伤害 2、射程 3、每回合可打两次；轰炸机对地有大范围轰炸。除防空炮和自行防空炮外，地面单位打不到空军。",
    task: "点「攻击空军」，再点闪光处的敌机",
    allow: { select: true, ranged: true, inspect: true, layer: true },
    pulseAir: true,
    tiles: [TUT_AIR_FOE],
    lockTiles: true,
    layer: "air",
    enter() {
      tutQuietTurn();
      const plane = tutPlayerAir();
      if (plane) {
        plane.x = TUT_AIR_MOVE.x;
        plane.y = TUT_AIR_MOVE.y;
        game.selected = plane;
      }
      const foe = tutPlace("fighter", "ai", TUT_AIR_FOE.x, TUT_AIR_FOE.y, { hp: 3, justDeployed: false });
      game.tutTiles = [{ x: foe.x, y: foe.y }];
      setMapLayer("air");
    },
    wait: {
      evt: "ranged",
      test: (d) => d.mode === "air" && isAir(d.unit) && (game.tutTiles || []).some((t) => t.x === d.x && t.y === d.y),
    },
  },
  {
    title: "机场半径",
    body: "空军不能远离最近友军机场或航母超过 20 格，超出即坠毁。飞回友军机场或航母格可点「降落」进入机库：停场每回合 +2 生命，停场中无法被攻击；点「起飞」或直接飞走即可升空。机场或航母被摧毁时，停场飞机会被消灭，其余飞机若失去补给也会坠毁。本教学图较小，半径会盖住整张图；大战场上飞太远会直接掉下来。",
    allow: { inspect: true, select: true, layer: true },
    layer: "air",
  },
  {
    title: "防空炮",
    body: "防空炮 550 元，生命 5，无法移动。对空伤害 4、对地伤害 2、射程 6。受到空军打击时伤害减半。空军来打防空炮或自行防空炮时，也会承受其对空伤害的一半。自行防空炮 600 元，生命 4，移动 3，对空 3.5、对地 2、射程 4，能跟着部队走，受到攻击机和战斗机伤害减半。地面上只有这两种能打飞机。选中防空炮，点「攻击空军」（会切到空域），再点敌机。",
    task: "选中防空炮，点「攻击空军」，再点闪光处的敌机",
    allow: { select: true, ranged: true, inspect: true, layer: true },
    pulseAir: true,
    tiles: [TUT_AA_FOE],
    lockTiles: true,
    layer: "ground",
    enter() {
      tutQuietTurn();
      const gun = tutPlace("aa", "player", TUT_AA.x, TUT_AA.y, { justDeployed: false, attacksLeft: 1, lastAttackTurn: null });
      const foe = tutPlace("fighter", "ai", TUT_AA_FOE.x, TUT_AA_FOE.y, { hp: 3, justDeployed: false });
      game.selected = gun;
      game.tutTiles = [{ x: foe.x, y: foe.y }];
      setMapLayer("ground");
    },
    wait: {
      evt: "ranged",
      test: (d) => d.mode === "air" && d.unit && d.unit.type === "aa" && (game.tutTiles || []).some((t) => t.x === d.x && t.y === d.y),
    },
  },
  {
    title: "修战与升级",
    body: "第 10 回合起，一座城市连续 3 回合未被攻击即进入修战。修战中可升级：经济（200 元起，每升一次价格 +100，该城每回合收益 +100）或工事（600 元，生命上限 +5 并回复 5）。每座城市每 5 回合只能升级 1 次，被占领后效果仍保留。",
    task: "右键闪光的蓝城，再点「经济」或「工事」升级",
    allow: { inspect: true, upgrade: true, select: true, layer: true },
    tiles: [TUT_HOME],
    pulseUpgrade: true,
    layer: "ground",
    enter() {
      game.turn = Math.max(game.turn, 10);
      game.phase = "player";
      game.busy = false;
      tutGive(800);
      const c = game.cities.find((n) => n.x === TUT_HOME.x && n.y === TUT_HOME.y);
      if (c) {
        c.owner = "player";
        c.lastHitTurn = -99;
        if (!c.lastUpgradeTurn) c.lastUpgradeTurn = { player: -99, ai: -99 };
        c.lastUpgradeTurn.player = -99;
      }
      setMapLayer("ground");
    },
    wait: { evt: "upgrade" },
  },
  {
    title: "海军",
    body: "战役开始前若勾选「生成海洋」，征召栏会出现海军。舰船只能在海洋或沿海城市部署和移动，不能上陆地，受空军伤害 −1。运输船可载 6 名士兵或军事工程师，另可载 2 辆坦克/步战车/自行火炮或 1 支护卫队，相邻时点「上船」。岸防炮是地面单位，只能部署在挨着海的格子，每回合最多移动 1 格，专门打船。驱逐舰对地远程是 3×3；巡洋舰打陆地只有 1 点伤害；战列舰不能打陆地；航空母舰相当于移动机场，攻击机和战斗机可降落。",
    allow: { inspect: true, select: true, layer: true },
    layer: "ground",
  },
  {
    title: "教程完成",
    body: "你已经学会部署、移动、近战攻城、远程炮击、地形、切换空域、建造机场、空军打击、防空炮对空、海军，以及修战升级。自行防空炮能跟着部队打飞机。返回菜单后选择地图，可勾选生成海洋后开始战役。红方会还手，并按你的打法在猛攻、均衡、稳守之间切换；有海时也会买舰。注意误伤、机场半径、城市驻守，以及森林丘陵山峰对射击的遮挡。",
    done: true,
    allow: { inspect: true, select: true, layer: true },
    layer: "ground",
  },
];

function startTutorial() {
  const screen = $("game-screen");
  if (screen) screen.classList.remove("hidden");
  resizeCanvas();
  newTutorialGame();
  game.tutHook = tutOnEvent;
  startLoop();
  tutReady = true;
  tutGoto(0);
  requestAnimationFrame(() => {
    resizeCanvas();
    if (game) fitCam();
  });
}

function bindTutorialUi() {
  const next = $("tut-next");
  const skip = $("tut-skip");
  if (next) {
    next.addEventListener("click", () => {
      if (!game || !game.tutorial) return;
      tutNext();
    });
  }
  if (skip) {
    skip.addEventListener("click", () => {
      location.href = "index.html";
    });
  }
  const skipStep = $("tut-skip-step");
  if (skipStep) {
    skipStep.addEventListener("click", () => {
      if (!game || !game.tutorial) return;
      tutNext();
    });
  }
}

if (document.body && document.body.dataset.mode === "tutorial") {
  bindTutorialUi();
  startTutorial();
}
