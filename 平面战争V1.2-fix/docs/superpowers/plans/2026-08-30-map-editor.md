# 地图编辑器实现计划

规格：`docs/superpowers/specs/2026-08-30-map-editor-design.md`  
本目录无 git，按任务顺序在原文件夹改。

## 任务 1 — 菜单与编辑器壳

**文件：** `index.html`, `style.css`, `game.js`

- 主菜单 `#menu-home` 在「新游戏」下加按钮 `#btn-map-editor`，文案「地图编辑器」。
- `#game-screen` 增加：
  - `#editor-bar`（默认 `.hidden`）：地图名输入、尺寸/载入下拉、保存、另存、返回。
  - `#editor-side` 替换或覆盖 `#side` 内容的方式：给 `#side` 加 `#editor-panel`（默认 hidden），内含阵营、地形、城市、单位、机场、要塞、笔刷大小、开局金钱。
- `body[data-editor="1"]` 时隐藏 `.top-actions`、`#log-bar` 对战按钮、`#btn-end-float`、`#btn-next-idle-float`、`#layer-switch` 可保留（编辑只在地面层，切空域可看空军，可选：编辑器锁定地面层）。
- 新游戏 `#menu-new` 固定地图下方加 `#custom-picks`（`.map-picks`），空时显示「还没有自定义地图」。
- CSS：编辑器顶栏、笔刷按钮选中态，沿用现有 `.ghost` / `.map-pick.selected` / `--gold`。

完成标准：打开主页能看到新按钮和空的自定义列表；尚未能进入编辑。

## 任务 2 — 存储与载入源

**文件：** `editor.js`（新建）, `index.html`（末尾加 `<script src="editor.js"></script>`，教程 html 不加）, `game.js`

- 常量 `MAPS_KEY = "planeWar_v08_maps"`，最多 20 条。
- `loadMapList` / `saveMapList`：JSON 损坏则 `[]`。
- `makeBlankMap(sizeKey)`、`blueprintFromScenario(id)`、`blueprintFromRandom(sizeKey, ocean)`、`blueprintFromGame()`。
- `enterEditor(blueprint)`：设 `game.editor = true`，用蓝图填 `game.w/h/terrain/cities/units/buildings/money/withOcean`，`units/buildings` 可空，`startLoop` + `fitCam` + `enterGameScreen` 变体（不要 `newGame` 的开局日志/收入）。
- 载入前若 `editorDirty` 则 `confirm`。
- 保存覆盖当前 `id`；另存新 `id`；满 20 张另存失败 toast。
- 刷新 `#custom-picks`。

完成标准：能进编辑器看到空白/固定/随机图，保存后菜单列表出现名称。

## 任务 3 — 笔刷与输入分流

**文件：** `editor.js`, `game.js`, `style.css`

- 笔刷状态：`owner`, `kind`（terrain/city/unit/airport/fortress/erase）, `terrainId`, `unitType`, `brushSize` 1|3。
- 左键：地形 stamp；城市；`makeUnit`/`buildings` 按规格校验。
- 右键：地形→平地；否则删城/单位/建筑。
- 地形导致非法占用则移除占用者。
- `game.js` 棋盘 `click`/`contextmenu`：若 `game.editor` 则 `editorHandlePointer` 并 return。
- 结束回合、N 键跳转、征召、AI `kickoffCpuIfNeeded` 在 editor 下 no-op。
- 金钱输入 0–99999，改值标脏。

完成标准：能刷地形、摆双方城和兵、要塞容量 2、非法放置 toast。

## 任务 4 — 开打

**文件：** `editor.js`, `game.js`

- `validateCustomMap(bp)` 返回错误字符串或 `null`。
- `newGame(sizeKey, opts)`：`opts.customMap` 时用蓝图；`sizeKey = "custom"`；`mapInfo`/`saveSummary` 用地图名；金钱钳制；单位 `justDeployed: false`；有单位或建筑且起始回合未填 → `startTurn = 1`。
- `selectedMapChoice` 支持自定义选中项（与固定图互斥）。
- `startFromMenu` / `hostOnline` 传入 `customMap`。
- 返回菜单清 `game.editor`、去掉 `data-editor`。

完成标准：规格「测试」1–6、8–10；联机 7 用现有 `netPush` 自然带上。

## 顺序

1 → 2 → 3 → 4，不可并行（都改同一套 `game-screen`）。
