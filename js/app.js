import { EXERCISES, WARMUP, LEVELS, PROGRAMS, SKILLS, BACK_TRACKS, RED_FLAGS, BACK_TIPS } from './data.js';

// ── Хранилище ──

const KEY = 'calisthenics.v1';

const defaultState = () => ({
  profile: { name: '', level: 'intermediate', days: 3, sound: true, backCues: true, onboarded: false },
  activeProgram: null,
  progress: {},   // programId -> индекс следующей тренировки
  targets: {},    // `${programId}:${workoutId}:${blockIdx}` -> адаптивная цель
  history: [],
  skills: {},     // skillId -> индекс последней выполненной ступени
  back: { track: null, answers: null, redFlags: false, cleared: false, pain: [] }
});

function merge(base, saved) {
  return { ...base, ...saved, profile: { ...base.profile, ...saved.profile }, back: { ...base.back, ...saved.back } };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return merge(defaultState(), JSON.parse(raw));
  } catch { /* приватный режим или битые данные */ }
  return defaultState();
}

let state = load();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch { toast('Не удалось сохранить данные на устройстве'); }
}

// ── Утилиты ──

const $ = (sel, root = document) => root.querySelector(sel);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => { const x = new Date(d); return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`; };
const clock = s => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${pad(s % 60)}`; };
const DAY_MS = 86400000;

function weekStart(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

const ex = id => EXERCISES[id] || { name: id, type: 'reps', cues: [] };
const unit = (id, v) => ex(id).type === 'time' ? `${v} с` : `${v}`;
const sideNote = id => ex(id).side ? ' на сторону' : '';
const blockValue = b => b.reps ?? b.time;
const program = id => PROGRAMS.find(p => p.id === id);
const allBackRoutines = () => Object.entries(BACK_TRACKS).flatMap(([track, t]) => t.routines.map(r => ({ ...r, track })));
const backRoutine = id => allBackRoutines().find(r => r.id === id);
const showBackCues = () => state.profile.backCues && !!state.back.track;

function getTarget(programId, workoutId, bi, block) {
  return state.targets[`${programId}:${workoutId}:${bi}`] ?? blockValue(block);
}

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('show'), 2600);
}

let audio;
function beep(freq = 880, dur = 0.12) {
  if (!state.profile.sound) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = freq;
    o.connect(g); g.connect(audio.destination);
    g.gain.setValueAtTime(0.25, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur);
    o.start(); o.stop(audio.currentTime + dur);
  } catch { /* звук недоступен */ }
}
const buzz = pattern => { try { navigator.vibrate?.(pattern); } catch { /* нет вибро */ } };

let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen');
    else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* не поддерживается */ }
}

// ── Статистика ──

const programSessions = () => state.history.filter(h => h.kind === 'program');

function weekCount(ws) {
  const t = ws.getTime();
  return programSessions().filter(h => weekStart(h.date).getTime() === t).length;
}

function weekStreak() {
  const goal = state.profile.days;
  const ws = weekStart(new Date());
  let streak = weekCount(ws) >= goal ? 1 : 0;
  for (let w = new Date(ws.getTime() - 7 * DAY_MS); weekCount(w) >= goal; w = new Date(w.getTime() - 7 * DAY_MS)) streak++;
  return streak;
}

function doneToday(routineId) {
  const today = dayKey();
  return state.history.some(h => h.routineId === routineId && dayKey(h.date) === today);
}

function routineCountThisWeek(routineId) {
  const t = weekStart(new Date()).getTime();
  return state.history.filter(h => h.routineId === routineId && weekStart(h.date).getTime() === t).length;
}

function suggestedBackRoutine() {
  const track = BACK_TRACKS[state.back.track];
  if (!track) return null;
  const [daily, strength] = track.routines;
  if (!doneToday(daily.id)) return daily;
  if (!doneToday(strength.id) && routineCountThisWeek(strength.id) < 3) return strength;
  return null;
}

// Можно ли перейти со щадящего трека на «Осанку»: 2 недели почти без боли и 6+ занятий.
function readyForPosture() {
  if (state.back.track !== 'gentle' || state.back.redFlags) return false;
  const since = Date.now() - 14 * DAY_MS;
  const recent = state.back.pain.filter(p => new Date(p.date).getTime() >= since);
  return recent.length >= 6 && recent.every(p => Math.max(p.before ?? 0, p.after ?? 0) <= 1);
}

// ── Графики ──

function lineChart(vals, { color = 'var(--accent)', min, max, labels = [] } = {}) {
  if (vals.length < 2) return '<p class="muted small">Для графика нужно хотя бы 2 записи.</p>';
  const W = 320, H = 140, P = 22;
  const lo = min ?? Math.min(...vals), hi = max ?? Math.max(...vals), span = hi - lo || 1;
  const x = i => P + i * (W - 2 * P) / (vals.length - 1);
  const y = v => H - P - (v - lo) / span * (H - 2 * P);
  const pts = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="График">
    <line x1="${P}" y1="${H - P}" x2="${W - P}" y2="${H - P}" class="grid"/>
    <line x1="${P}" y1="${P}" x2="${W - P}" y2="${P}" class="grid"/>
    <text x="2" y="${P + 4}" class="axis">${hi}</text><text x="2" y="${H - P + 4}" class="axis">${lo}</text>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${vals.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3.5" fill="${color}"/>`).join('')}
    ${labels.length ? `<text x="${P}" y="${H - 4}" class="axis">${esc(labels[0])}</text><text x="${W - P}" y="${H - 4}" class="axis" text-anchor="end">${esc(labels[labels.length - 1])}</text>` : ''}
  </svg>`;
}

function barChart(vals, labels, goal) {
  const W = 320, H = 130, P = 20, bw = (W - 2 * P) / vals.length;
  const hi = Math.max(goal, ...vals, 1);
  const y = v => H - P - v / hi * (H - 2 * P);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Тренировки по неделям">
    <line x1="${P}" y1="${y(goal)}" x2="${W - P}" y2="${y(goal)}" class="goal"/>
    ${vals.map((v, i) => `<rect x="${(P + i * bw + bw * 0.2).toFixed(1)}" y="${y(v).toFixed(1)}" width="${(bw * 0.6).toFixed(1)}" height="${(H - P - y(v)).toFixed(1)}" rx="3" fill="${v >= goal ? 'var(--accent)' : 'var(--surface-3)'}"/>
      <text x="${(P + i * bw + bw / 2).toFixed(1)}" y="${H - 5}" class="axis" text-anchor="middle">${esc(labels[i])}</text>`).join('')}
  </svg>`;
}

// ── Экраны ──

function header(title, back) {
  return `<header class="top">${back ? `<a class="icon-btn" href="${back}" aria-label="Назад">‹</a>` : ''}<h1>${esc(title)}</h1>
    ${back ? '' : '<a class="icon-btn" href="#/settings" aria-label="Настройки">⚙</a>'}</header>`;
}

function exLine(id, value, sets) {
  return `<li><button class="link" data-action="info" data-ex="${id}">${esc(ex(id).name)}</button>
    <span class="muted">${sets} × ${unit(id, value)}${sideNote(id)}</span></li>`;
}

function viewToday() {
  const name = state.profile.name;
  const now = new Date();
  const ws = weekStart(now);
  const week = weekCount(ws);
  const p = program(state.activeProgram);
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const dots = dayNames.map((d, i) => {
    const key = dayKey(new Date(ws.getTime() + i * DAY_MS));
    const did = state.history.filter(h => dayKey(h.date) === key);
    const cls = [did.some(h => h.kind === 'program') && 'train', did.some(h => h.kind === 'back') && 'back', key === dayKey() && 'today'].filter(Boolean).join(' ');
    return `<div class="dot ${cls}"><i></i><span>${d}</span></div>`;
  }).join('');

  let next = '';
  if (p) {
    const idx = (state.progress[p.id] ?? 0) % p.workouts.length;
    const w = p.workouts[idx];
    next = `<section class="card hero" style="--c:${p.color}">
      <div class="eyebrow">${esc(p.title)} · тренировка ${idx + 1} из ${p.workouts.length}</div>
      <h2>${esc(w.title)}</h2>
      <ul class="ex-list">${w.blocks.map((b, bi) => exLine(b.ex, getTarget(p.id, w.id, bi, b), b.sets)).join('')}</ul>
      <button class="btn primary" data-action="start-program" data-p="${p.id}" data-w="${w.id}">Начать тренировку</button>
    </section>`;
  } else {
    next = `<section class="card"><h2>Выбери программу</h2><p class="muted">Активной программы пока нет.</p>
      <a class="btn primary" href="#/programs">К программам</a></section>`;
  }

  let back = '';
  if (state.back.track) {
    const r = suggestedBackRoutine();
    const t = BACK_TRACKS[state.back.track];
    back = `<section class="card back-card" style="--c:${t.color}">
      <div class="eyebrow">Спина · трек «${esc(t.title)}»</div>
      ${r ? `<h3>${esc(r.title)}</h3><p class="muted">${r.minutes} мин · ${esc(r.freq)}</p>
        <button class="btn" data-action="start-back" data-r="${r.id}">Начать</button>`
        : '<h3>На сегодня со спиной всё ✓</h3><p class="muted">Отличная работа. Можно сделать лёгкую растяжку сгибателей бедра вечером.</p>'}
    </section>`;
  } else {
    back = `<section class="card back-card" style="--c:var(--warn)"><div class="eyebrow">Спина</div>
      <h3>Программа при гиперлордозе</h3><p class="muted">Пройди короткую анкету, чтобы подобрать трек.</p>
      <a class="btn" href="#/back">Пройти анкету</a></section>`;
  }

  const tip = BACK_TIPS[Math.floor(Date.now() / DAY_MS) % BACK_TIPS.length];
  const resume = session ? `<a class="card resume" href="#/workout">▶ Продолжить тренировку: ${esc(session.title)}</a>` : '';

  return `${header(name ? `Привет, ${name}` : 'Сегодня')}
    ${resume}
    <section class="card week">
      <div class="row"><div><div class="big">${week}<span class="muted">/${state.profile.days}</span></div><div class="muted small">тренировок на этой неделе</div></div>
      <div class="right"><div class="big">${weekStreak()}</div><div class="muted small">недель подряд</div></div></div>
      <div class="dots">${dots}</div>
    </section>
    ${next}${back}
    <section class="card tip"><div class="eyebrow">Совет</div><h3>${esc(tip.title)}</h3><p>${esc(tip.text)}</p></section>`;
}

let programFilter = 'all';

function viewPrograms() {
  const chips = [['all', 'Все'], ...Object.entries(LEVELS), ['back', 'Для спины']].map(([k, v]) =>
    `<button class="chip ${programFilter === k ? 'on' : ''}" data-action="filter" data-f="${k}">${v}</button>`).join('');
  const list = PROGRAMS.filter(p => programFilter === 'all' || p.level === programFilter || (programFilter === 'back' && p.back));
  return `${header('Программы')}<div class="chips">${chips}</div>
    ${list.map(p => `<a class="card program" href="#/program/${p.id}" style="--c:${p.color}">
      <div class="row"><h3>${esc(p.title)}</h3>${state.activeProgram === p.id ? '<span class="badge">Активна</span>' : ''}</div>
      <p class="muted">${esc(p.subtitle)}</p>
      <div class="meta"><span>${LEVELS[p.level]}</span><span>${p.days}×/нед</span><span>${p.weeks} нед</span>${p.back ? '<span class="tag-back">спина</span>' : ''}</div>
    </a>`).join('')}`;
}

function viewProgram(id) {
  const p = program(id);
  if (!p) return viewPrograms();
  const active = state.activeProgram === p.id;
  return `${header(p.title, '#/programs')}
    <section class="card hero" style="--c:${p.color}">
      <p>${esc(p.subtitle)}</p>
      <div class="meta"><span>${LEVELS[p.level]}</span><span>${p.days} тренировки в неделю</span><span>${p.weeks} недель</span></div>
      <p class="muted small">Цели растут сами: если выполнил все подходы — в следующий раз +1 повтор (или +5 секунд).</p>
      ${active ? '<button class="btn" disabled>Активная программа</button>'
        : `<button class="btn primary" data-action="activate" data-p="${p.id}">Сделать активной</button>`}
    </section>
    ${p.workouts.map(w => `<section class="card">
      <div class="row"><h3>${esc(w.title)}</h3><button class="btn small" data-action="start-program" data-p="${p.id}" data-w="${w.id}">Начать</button></div>
      ${w.warmup === false ? '' : '<p class="muted small">+ разминка 3 минуты</p>'}
      <ul class="ex-list">${w.blocks.map((b, bi) => exLine(b.ex, getTarget(p.id, w.id, bi, b), b.sets)).join('')}</ul>
    </section>`).join('')}`;
}

function viewSkills() {
  return `${header('Навыки')}
    <p class="muted pad">Лестницы прогрессий: выполнил норматив — отмечай ступень и переходи к следующей.</p>
    <div class="grid">${SKILLS.map(s => {
      const done = (state.skills[s.id] ?? -1) + 1;
      const next = s.steps[done];
      return `<a class="card skill" href="#/skill/${s.id}">
        <div class="skill-icon">${s.icon}</div><h3>${esc(s.title)}</h3>
        <div class="bar"><i style="width:${Math.round(done / s.steps.length * 100)}%"></i></div>
        <p class="muted small">${next ? `Дальше: ${esc(ex(next.ex).name)}` : 'Освоено! 🏆'}</p>
      </a>`;
    }).join('')}</div>`;
}

function viewSkill(id) {
  const s = SKILLS.find(x => x.id === id);
  if (!s) return viewSkills();
  const doneIdx = state.skills[s.id] ?? -1;
  return `${header(s.title, '#/skills')}
    <ol class="ladder">${s.steps.map((st, i) => {
      const cls = i <= doneIdx ? 'done' : i === doneIdx + 1 ? 'current' : '';
      return `<li class="${cls}">
        <button class="check" data-action="skill-step" data-s="${s.id}" data-i="${i}" aria-label="Отметить ступень">${i <= doneIdx ? '✓' : i + 1}</button>
        <div><button class="link" data-action="info" data-ex="${st.ex}">${esc(ex(st.ex).name)}</button>
        <div class="muted small">Норматив: ${esc(st.goal)}</div></div>
      </li>`;
    }).join('')}</ol>`;
}

function viewBack() {
  const b = state.back;
  if (!b.track) return backQuestionnaire();
  if (b.redFlags && !b.cleared) {
    return `${header('Спина')}
      <section class="card danger"><h2>Сначала — к врачу</h2>
        <p>Ты отметил симптомы, которые требуют очной консультации невролога или ортопеда до начала любых упражнений для спины.</p>
        <ul>${(b.answers?.flags || []).map(f => `<li>${esc(f)}</li>`).join('')}</ul>
        <button class="btn" data-action="back-cleared">Врач разрешил — продолжить</button>
        <button class="btn ghost" data-action="back-reset">Пройти анкету заново</button>
      </section>`;
  }
  const t = BACK_TRACKS[b.track];
  const pain = b.pain.slice(-20);
  const painVals = pain.map(p => p.after ?? p.before ?? 0);
  return `${header('Спина')}
    <section class="card hero" style="--c:${t.color}">
      <div class="eyebrow">Твой трек</div><h2>${esc(t.title)}</h2><p class="muted">${esc(t.subtitle)}</p>
      <p>${esc(t.about)}</p>
      ${readyForPosture() ? `<div class="note ok">Последние 2 недели почти без боли. Можно перейти на трек «Осанка» (лучше — после согласования с врачом).
        <button class="btn small" data-action="set-track" data-t="posture">Перейти</button></div>` : ''}
    </section>
    ${t.routines.map(r => `<section class="card">
      <div class="row"><div><h3>${esc(r.title)} ${doneToday(r.id) ? '<span class="badge">сегодня ✓</span>' : ''}</h3>
        <p class="muted small">${r.minutes} мин · ${esc(r.freq)}</p></div>
        <button class="btn small" data-action="start-back" data-r="${r.id}">Начать</button></div>
      <ul class="ex-list">${r.blocks.map(bl => exLine(bl.ex, blockValue(bl), bl.sets)).join('')}</ul>
    </section>`).join('')}
    <section class="card"><h3>Уровень боли</h3>
      <p class="muted small">Оценка после каждого занятия, 0 — нет боли, 10 — максимальная.</p>
      ${lineChart(painVals, { color: t.color, min: 0, max: 10 })}
    </section>
    <section class="card"><h3>Полезно знать</h3>
      ${BACK_TIPS.map(tip => `<details><summary>${esc(tip.title)}</summary><p>${esc(tip.text)}</p></details>`).join('')}
    </section>
    <section class="card"><h3>Когда срочно к врачу</h3><ul>${RED_FLAGS.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      <div class="row wrap">
        ${b.track === 'posture' ? '<button class="btn ghost small" data-action="set-track" data-t="gentle">Перейти на щадящий трек</button>' : ''}
        <button class="btn ghost small" data-action="back-reset">Пройти анкету заново</button>
      </div>
    </section>
    <p class="disclaimer">Приложение не заменяет консультацию врача. Если упражнение вызывает боль — остановись.</p>`;
}

function backQuestionnaire() {
  return `${header('Спина')}
    <section class="card"><h2>Анкета</h2>
      <p class="muted">Три вопроса, чтобы подобрать безопасный трек при гиперлордозе.</p>
      <form id="back-form">
        <fieldset><legend>1. Болит ли поясница?</legend>
          <label class="opt"><input type="radio" name="pain" value="none" checked> Нет</label>
          <label class="opt"><input type="radio" name="pain" value="sometimes"> Иногда, после нагрузки или долгого сидения</label>
          <label class="opt"><input type="radio" name="pain" value="often"> Часто или постоянно</label>
        </fieldset>
        <fieldset><legend>2. Есть ли диагноз по позвоночнику?</legend>
          <p class="muted small">Грыжа, протрузия, спондилолистез, сколиоз и т.п.</p>
          <label class="opt"><input type="radio" name="dx" value="no" checked> Нет</label>
          <label class="opt"><input type="radio" name="dx" value="yes"> Да</label>
        </fieldset>
        <fieldset><legend>3. Есть ли что-то из этого?</legend>
          ${RED_FLAGS.map(f => `<label class="opt"><input type="checkbox" name="flag" value="${esc(f)}"> ${esc(f)}</label>`).join('')}
        </fieldset>
        <button type="button" class="btn primary" data-action="back-submit">Подобрать трек</button>
      </form>
    </section>
    <p class="disclaimer">Приложение не заменяет консультацию врача.</p>`;
}

let progressEx = null;

function viewProgress() {
  const sessions = programSessions();
  const totalMin = Math.round(state.history.reduce((s, h) => s + (h.duration || 0), 0) / 60);
  const ws = weekStart(new Date());
  const weeks = Array.from({ length: 8 }, (_, i) => new Date(ws.getTime() - (7 - i) * 7 * DAY_MS));
  const weekVals = weeks.map(weekCount);
  const weekLabels = weeks.map(w => `${w.getDate()}.${pad(w.getMonth() + 1)}`);

  // Лучший подход по каждому упражнению в каждой тренировке
  const series = {};
  sessions.slice().reverse().forEach(h => {
    const best = {};
    h.sets.filter(s => !s.warmup && !s.skipped && s.value > 0).forEach(s => { best[s.ex] = Math.max(best[s.ex] ?? 0, s.value); });
    Object.entries(best).forEach(([id, v]) => (series[id] ||= []).push({ v, d: new Date(h.date) }));
  });
  const exIds = Object.keys(series);
  if (!exIds.includes(progressEx)) progressEx = exIds[0] ?? null;
  const ser = progressEx ? series[progressEx] : [];
  const records = exIds.map(id => ({ id, v: Math.max(...series[id].map(s => s.v)) }));

  return `${header('Прогресс')}
    <section class="stats">
      <div class="stat"><b>${sessions.length}</b><span>тренировок</span></div>
      <div class="stat"><b>${totalMin}</b><span>минут</span></div>
      <div class="stat"><b>${weekStreak()}</b><span>недель подряд</span></div>
    </section>
    <section class="card"><h3>Тренировки по неделям</h3><p class="muted small">Линия — цель: ${state.profile.days} в неделю</p>
      ${barChart(weekVals, weekLabels, state.profile.days)}</section>
    <section class="card"><h3>Упражнение</h3>
      ${exIds.length ? `<select data-change="progress-ex">${exIds.map(id => `<option value="${id}" ${id === progressEx ? 'selected' : ''}>${esc(ex(id).name)}</option>`).join('')}</select>
        ${lineChart(ser.map(s => s.v), { labels: ser.map(s => `${s.d.getDate()}.${pad(s.d.getMonth() + 1)}`) })}`
        : '<p class="muted">Заверши первую тренировку, и здесь появится график.</p>'}
    </section>
    ${records.length ? `<section class="card"><h3>Рекорды</h3><ul class="ex-list">${records.map(r =>
      `<li><span>${esc(ex(r.id).name)}</span><b>${unit(r.id, r.v)}</b></li>`).join('')}</ul></section>` : ''}
    <section class="card"><h3>История</h3>
      ${state.history.length ? `<ul class="history">${state.history.slice(0, 30).map(h => {
        const d = new Date(h.date);
        return `<li><div><b>${esc(h.title)}</b><div class="muted small">${d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} · ${Math.round((h.duration || 0) / 60)} мин${h.rpe ? ` · RPE ${h.rpe}` : ''}</div></div>
          <button class="icon-btn small" data-action="del-history" data-id="${h.id}" aria-label="Удалить">🗑</button></li>`;
      }).join('')}</ul>` : '<p class="muted">Пока пусто.</p>'}
    </section>`;
}

function viewSettings() {
  const pr = state.profile;
  return `${header('Настройки', '#/today')}
    <section class="card form">
      <label>Имя<input type="text" data-change="profile" name="name" value="${esc(pr.name)}" maxlength="30"></label>
      <label>Уровень<select data-change="profile" name="level">${Object.entries(LEVELS).map(([k, v]) => `<option value="${k}" ${pr.level === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label>Цель: тренировок в неделю<select data-change="profile" name="days">${[2, 3, 4, 5, 6].map(n => `<option ${pr.days === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <label class="switch"><input type="checkbox" data-change="profile" name="sound" ${pr.sound ? 'checked' : ''}> Звуковые сигналы таймера</label>
      <label class="switch"><input type="checkbox" data-change="profile" name="backCues" ${pr.backCues ? 'checked' : ''}> Подсказки для спины в упражнениях</label>
    </section>
    <section class="card"><h3>Данные</h3>
      <p class="muted small">Все данные хранятся только на этом устройстве. Делай резервную копию перед сменой телефона или очисткой браузера.</p>
      <div class="row wrap">
        <button class="btn small" data-action="export">Скачать копию</button>
        <label class="btn small">Загрузить копию<input type="file" accept="application/json" data-change="import" hidden></label>
        <button class="btn small danger-btn" data-action="reset">Удалить всё</button>
      </div>
    </section>
    <p class="disclaimer">Калистеника · личное приложение. Не заменяет консультацию врача.</p>`;
}

function viewOnboarding() {
  return `<section class="onboarding">
    <div class="logo">💪</div><h1>Калистеника</h1>
    <p class="muted">Программы с собственным весом, лестницы навыков и отдельный блок для спины при гиперлордозе.</p>
    <form id="onb" class="card form">
      <label>Как тебя зовут?<input type="text" name="name" maxlength="30" placeholder="Имя"></label>
      <fieldset><legend>Твой уровень</legend>
        <label class="opt"><input type="radio" name="level" value="beginner"> <b>Новичок</b> — подтягиваюсь 0–5 раз</label>
        <label class="opt"><input type="radio" name="level" value="intermediate" checked> <b>Средний</b> — 6–12 подтягиваний, брусья</label>
        <label class="opt"><input type="radio" name="level" value="advanced"> <b>Продвинутый</b> — выход силой, стойка</label>
      </fieldset>
      <label>Сколько тренировок в неделю?<select name="days">${[2, 3, 4, 5].map(n => `<option ${n === 3 ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <button type="button" class="btn primary" data-action="onboard">Поехали</button>
    </form>
  </section>`;
}

// ── Плеер тренировки ──

let session = null;
let ticker = null;
const RING = 2 * Math.PI * 90;

function buildSteps(blocks, warmup, targetFor) {
  const steps = [];
  if (warmup) WARMUP.forEach(b => steps.push({ ex: b.ex, set: 1, sets: 1, target: blockValue(b), rest: 0, warmup: true }));
  blocks.forEach((b, bi) => {
    const target = targetFor(bi, b);
    for (let s = 1; s <= b.sets; s++) steps.push({ ex: b.ex, set: s, sets: b.sets, target, rest: b.rest, block: bi });
  });
  return steps;
}

function startSession(s) {
  if (session && !confirm('Есть незавершённая тренировка. Начать новую?')) return;
  beep(0, 0.01); // разблокируем звук по жесту пользователя
  session = { ...s, i: 0, results: [], started: Date.now(), timer: null, rpe: null };
  session.phase = s.needPain ? 'pre' : 'work';
  session.value = session.steps[0].target;
  keepAwake(true);
  location.hash = '#/workout';
  render();
}

const actionsPlayer = {
  'start-program'({ p, w }) {
    const pr = program(p), wo = pr.workouts.find(x => x.id === w);
    startSession({
      kind: 'program', programId: p, workoutId: w, title: `${pr.title}: ${wo.title}`, color: pr.color,
      needPain: !!pr.back && !!state.back.track,
      steps: buildSteps(wo.blocks, wo.warmup !== false, (bi, b) => getTarget(p, w, bi, b))
    });
  },
  'start-back'({ r }) {
    const rt = backRoutine(r);
    startSession({
      kind: 'back', routineId: r, title: rt.title, color: BACK_TRACKS[rt.track].color, needPain: true,
      steps: buildSteps(rt.blocks, false, (bi, b) => blockValue(b))
    });
  },
  'pain-start'() {
    const v = +$('#pain').value;
    if (v >= 6 && !confirm('Боль 6 из 10 и выше. Сегодня лучше отдохнуть и обратиться к врачу, если боль не проходит. Всё равно начать?')) return;
    session.painBefore = v;
    session.phase = 'work';
    render();
  },
  adj({ d }) {
    session.value = Math.max(0, session.value + +d);
    $('#val').textContent = session.value;
  },
  'set-done'() { record(session.value); },
  skip() { record(0, true); },
  'timer-start'() {
    const now = Date.now();
    session.timer = { prepEnd: now + 3000, end: now + 3000 + session.steps[session.i].target * 1000, lastBeep: null };
    startTicker();
    render();
  },
  'timer-stop'() {
    const t = session.timer;
    const now = Date.now();
    const elapsed = now < t.prepEnd ? 0 : Math.round((now - t.prepEnd) / 1000);
    session.timer = null;
    record(elapsed);
  },
  'rest-add'() { session.restEnd += 15000; },
  'rest-skip'() { advance(); },
  quit() {
    if (session.phase === 'post') return;
    if (!confirm('Закончить тренировку сейчас? Выполненные подходы можно будет сохранить.')) return;
    session.timer = null;
    session.phase = 'post';
    stopTicker();
    render();
  },
  rpe({ v }) {
    session.rpe = +v;
    document.querySelectorAll('.rpe .chip').forEach(c => c.classList.toggle('on', c.dataset.v === v));
  },
  'finish-save'() { finishSession(true); },
  'finish-discard'() {
    if (confirm('Выйти без сохранения?')) finishSession(false);
  }
};

function record(value, skipped = false) {
  const st = session.steps[session.i];
  session.results[session.i] = { ex: st.ex, value, target: st.target, block: st.block, warmup: !!st.warmup, skipped };
  buzz(60);
  if (session.i >= session.steps.length - 1) {
    session.phase = 'post';
    stopTicker();
    beep(1046, 0.4);
  } else if (st.rest > 0) {
    session.phase = 'rest';
    session.restEnd = Date.now() + st.rest * 1000;
    session.lastBeep = null;
    startTicker();
  } else {
    advance();
    return;
  }
  render();
}

function advance() {
  session.i++;
  session.phase = 'work';
  session.timer = null;
  session.value = session.steps[session.i].target;
  stopTicker();
  render();
}

function startTicker() {
  stopTicker();
  ticker = setInterval(tick, 200);
  tick();
}

function stopTicker() {
  clearInterval(ticker);
  ticker = null;
}

function countdownBeep(holder, remainSec) {
  const s = Math.ceil(remainSec);
  if (s <= 3 && s >= 1 && holder.lastBeep !== s) { holder.lastBeep = s; beep(660, 0.1); }
}

function setRing(frac, label) {
  const ring = $('#ring'), cl = $('#clock');
  if (ring) ring.style.strokeDashoffset = (RING * (1 - Math.min(1, Math.max(0, frac)))).toFixed(1);
  if (cl) cl.textContent = label;
}

function tick() {
  if (!session) return stopTicker();
  const now = Date.now();
  if (session.phase === 'rest') {
    const remain = (session.restEnd - now) / 1000;
    const total = session.steps[session.i].rest;
    countdownBeep(session, remain);
    setRing(remain / total, clock(remain));
    if (remain <= 0) { beep(988, 0.35); buzz([200, 100, 200]); advance(); }
  } else if (session.phase === 'work' && session.timer) {
    const t = session.timer;
    const st = session.steps[session.i];
    if (now < t.prepEnd) {
      const r = (t.prepEnd - now) / 1000;
      countdownBeep(t, r);
      setRing(1, `${Math.ceil(r)}`);
      const lbl = $('#timer-label'); if (lbl) lbl.textContent = 'Приготовься';
    } else {
      if (t.lastBeep !== 'go') { t.lastBeep = 'go'; beep(988, 0.2); }
      const lbl = $('#timer-label'); if (lbl) lbl.textContent = 'Держи!';
      const remain = (t.end - now) / 1000;
      if (remain <= 3) countdownBeep(t, remain);
      setRing(remain / st.target, clock(remain));
      if (remain <= 0) { session.timer = null; beep(1046, 0.35); buzz([200, 100, 200]); record(st.target); }
    }
  }
}

function ringSvg(color, label, sub) {
  return `<div class="ring-wrap"><svg viewBox="0 0 200 200" class="ring">
      <circle cx="100" cy="100" r="90" class="ring-bg"/>
      <circle id="ring" cx="100" cy="100" r="90" stroke="${color}" style="stroke-dasharray:${RING.toFixed(1)};stroke-dashoffset:0" class="ring-fg"/>
    </svg><div class="ring-text"><div id="clock" class="big-num">${label}</div><div id="timer-label" class="muted small">${sub}</div></div></div>`;
}

function cuesHtml(id) {
  const e = ex(id);
  return `<ul class="cues">${e.cues.slice(0, 3).map(c => `<li>${esc(c)}</li>`).join('')}</ul>
    ${showBackCues() && e.back ? `<div class="note back-note"><b>Спина:</b> ${esc(e.back)}</div>` : ''}`;
}

function viewWorkout() {
  const s = session;
  const total = s.steps.length;
  const pct = Math.round(s.results.filter(Boolean).length / total * 100);
  const head = `<div class="player-head"><button class="icon-btn" data-action="quit" aria-label="Закончить">✕</button>
      <div class="player-title">${esc(s.title)}</div><span class="muted small">${Math.min(s.i + 1, total)}/${total}</span></div>
    <div class="bar"><i style="width:${pct}%;background:${s.color}"></i></div>`;

  if (s.phase === 'pre') {
    return `${head}<section class="player">
      <h2>Как спина перед занятием?</h2>
      ${painSlider(0)}
      <button class="btn primary" data-action="pain-start">Начать</button>
      <p class="disclaimer">Если во время упражнения появляется боль — пропусти его. Лёгкое ощущение растяжения — это нормально.</p>
    </section>`;
  }

  if (s.phase === 'rest') {
    const nx = s.steps[s.i + 1];
    return `${head}<section class="player">
      <div class="phase-label">Отдых</div>
      ${ringSvg(s.color, clock((s.restEnd - Date.now()) / 1000), '')}
      <div class="row center"><button class="btn small" data-action="rest-add">+15 с</button><button class="btn small primary" data-action="rest-skip">Пропустить</button></div>
      ${nx ? `<div class="card next"><div class="eyebrow">Дальше · ${nx.warmup ? 'разминка' : `подход ${nx.set} из ${nx.sets}`}</div>
        <button class="link" data-action="info" data-ex="${nx.ex}">${esc(ex(nx.ex).name)}</button>
        <div class="muted">${unit(nx.ex, nx.target)}${sideNote(nx.ex)}</div></div>` : ''}
    </section>`;
  }

  if (s.phase === 'post') return viewPost();

  const st = s.steps[s.i];
  const e = ex(st.ex);
  const label = st.warmup ? 'Разминка' : `Подход ${st.set} из ${st.sets}`;
  let body;
  if (e.type === 'time') {
    body = s.timer
      ? `${ringSvg(s.color, '3', 'Приготовься')}<button class="btn primary" data-action="timer-stop">Стоп</button>`
      : `${ringSvg(s.color, clock(st.target), `цель${sideNote(st.ex)}`)}
        <button class="btn primary" data-action="timer-start">Старт</button>
        <button class="btn ghost" data-action="skip">Пропустить</button>`;
  } else {
    body = `<div class="stepper"><button class="round" data-action="adj" data-d="-1" aria-label="Меньше">−</button>
        <div><div id="val" class="big-num">${s.value}</div><div class="muted small">цель ${st.target}${sideNote(st.ex)}</div></div>
        <button class="round" data-action="adj" data-d="1" aria-label="Больше">+</button></div>
      <button class="btn primary" data-action="set-done">Готово</button>
      <button class="btn ghost" data-action="skip">Пропустить</button>`;
  }
  return `${head}<section class="player">
    <div class="phase-label" style="color:${s.color}">${label}</div>
    <button class="ex-title" data-action="info" data-ex="${st.ex}">${esc(e.name)} <span class="muted">ⓘ</span></button>
    <div class="muted small">${esc(e.muscles || '')}</div>
    ${body}
    ${cuesHtml(st.ex)}
  </section>`;
}

function painSlider(v) {
  return `<div class="pain"><input id="pain" type="range" min="0" max="10" value="${v}" data-input="pain">
    <div class="pain-scale"><span>0 нет боли</span><b id="pain-v">${v}</b><span>10 сильная</span></div>
    <p id="pain-warn" class="note warn" ${v < 6 ? 'hidden' : ''}>Боль 6+ — лучше остановиться и обратиться к врачу.</p></div>`;
}

function viewPost() {
  const s = session;
  const done = s.results.filter(r => r && !r.skipped && !r.warmup);
  const reps = done.filter(r => ex(r.ex).type === 'reps').reduce((a, r) => a + r.value, 0);
  const min = Math.round((Date.now() - s.started) / 60000);
  return `<div class="player-head"><span></span><div class="player-title">${esc(s.title)}</div><span></span></div>
    <section class="player">
      <div class="logo">🎉</div><h2>Тренировка завершена</h2>
      <section class="stats">
        <div class="stat"><b>${min}</b><span>минут</span></div>
        <div class="stat"><b>${done.length}</b><span>подходов</span></div>
        <div class="stat"><b>${reps}</b><span>повторений</span></div>
      </section>
      <h3>Насколько было тяжело?</h3>
      <div class="chips rpe">${[...Array(10)].map((_, i) => `<button class="chip ${s.rpe === i + 1 ? 'on' : ''}" data-action="rpe" data-v="${i + 1}">${i + 1}</button>`).join('')}</div>
      <p class="muted small">1 — очень легко, 10 — до отказа</p>
      ${s.needPain ? `<h3>Как спина после занятия?</h3>${painSlider(s.painBefore ?? 0)}` : ''}
      <button class="btn primary" data-action="finish-save">Сохранить</button>
      <button class="btn ghost" data-action="finish-discard">Выйти без сохранения</button>
    </section>`;
}

function finishSession(store) {
  const s = session;
  stopTicker();
  keepAwake(false);
  if (store) {
    const sets = s.results.filter(Boolean);
    const entry = {
      id: Date.now().toString(36), date: new Date().toISOString(), kind: s.kind, title: s.title,
      programId: s.programId, workoutId: s.workoutId, routineId: s.routineId,
      duration: Math.round((Date.now() - s.started) / 1000), rpe: s.rpe, sets
    };
    const msgs = ['Тренировка сохранена'];
    if (s.needPain) {
      const after = +($('#pain')?.value ?? 0);
      entry.painBefore = s.painBefore; entry.painAfter = after;
      state.back.pain.push({ date: entry.date, before: s.painBefore, after });
      if (after - (s.painBefore ?? 0) >= 2) msgs.push('Боль усилилась — в следующий раз уменьши нагрузку. Если не проходит — к врачу');
    }
    if (s.kind === 'program') {
      const pr = program(s.programId);
      const wIdx = pr.workouts.findIndex(w => w.id === s.workoutId);
      state.progress[pr.id] = (wIdx + 1) % pr.workouts.length;
      if (!state.activeProgram) state.activeProgram = pr.id;
      // Адаптивная прогрессия: все подходы блока выполнены — цель растёт
      const byBlock = {};
      sets.filter(r => !r.warmup).forEach(r => (byBlock[r.block] ||= []).push(r));
      const wo = pr.workouts[wIdx];
      let raised = 0;
      Object.entries(byBlock).forEach(([bi, rs]) => {
        const block = wo.blocks[bi];
        if (rs.length === block.sets && rs.every(r => !r.skipped && r.value >= r.target)) {
          state.targets[`${pr.id}:${wo.id}:${bi}`] = rs[0].target + (ex(block.ex).type === 'time' ? 5 : 1);
          raised++;
        }
      });
      if (raised) msgs.push(`Цели повышены в ${raised} упр.`);
    }
    state.history.unshift(entry);
    save();
    toast(msgs.join('. '));
  }
  session = null;
  location.hash = store ? '#/progress' : '#/today';
}

// ── Действия ──

const actions = {
  ...actionsPlayer,
  info({ ex: id }) {
    const e = ex(id);
    const dlg = $('#modal');
    $('#modal-body').innerHTML = `<div class="eyebrow">${esc(e.group || '')}</div><h2>${esc(e.name)}</h2>
      <p class="muted">${esc(e.muscles || '')}${e.side ? ' · на каждую сторону' : ''}</p>
      <h3>Техника</h3><ul class="cues">${e.cues.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
      ${e.back ? `<div class="note back-note"><b>При гиперлордозе:</b> ${esc(e.back)}</div>` : ''}
      <a class="btn small" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.name + ' техника')}">Найти видео на YouTube</a>`;
    dlg.showModal();
  },
  'close-modal'() { $('#modal').close(); },
  filter({ f }) { programFilter = f; render(); },
  activate({ p }) {
    state.activeProgram = p;
    save();
    toast(`Программа «${program(p).title}» активна`);
    render();
  },
  'skill-step'({ s, i }) {
    const idx = +i, cur = state.skills[s] ?? -1;
    state.skills[s] = idx <= cur ? idx - 1 : idx;
    save();
    if (idx > cur) { buzz(80); toast('Ступень освоена 💪'); }
    render();
  },
  'back-submit'() {
    const f = $('#back-form');
    const pain = f.pain.value, dx = f.dx.value;
    const flags = [...f.querySelectorAll('input[name=flag]:checked')].map(x => x.value);
    state.back = { ...state.back, track: pain !== 'none' || dx === 'yes' ? 'gentle' : 'posture', answers: { pain, dx, flags }, redFlags: flags.length > 0, cleared: false };
    save();
    toast(`Подобран трек «${BACK_TRACKS[state.back.track].title}»`);
    render();
  },
  'back-cleared'() { state.back.cleared = true; save(); render(); },
  'back-reset'() { state.back = { ...state.back, track: null, answers: null, redFlags: false, cleared: false }; save(); render(); },
  'set-track'({ t }) {
    state.back.track = t;
    save();
    toast(`Трек «${BACK_TRACKS[t].title}»`);
    render();
  },
  'del-history'({ id }) {
    if (!confirm('Удалить запись из истории?')) return;
    state.history = state.history.filter(h => h.id !== id);
    save();
    render();
  },
  onboard() {
    const f = $('#onb');
    const level = f.level.value;
    state.profile = { ...state.profile, name: f.querySelector('[name=name]').value.trim(), level, days: +f.days.value, onboarded: true };
    state.activeProgram = { beginner: 'start', intermediate: 'base', advanced: 'advanced' }[level];
    save();
    location.hash = '#/today';
  },
  export() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `calisthenics-backup-${dayKey()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  reset() {
    if (!confirm('Удалить все тренировки, прогресс и настройки? Это нельзя отменить.')) return;
    if (!confirm('Точно удалить? Сначала можно скачать резервную копию.')) return;
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    state = defaultState();
    session = null;
    location.hash = '#/onboarding';
  }
};

const changeHandlers = {
  'progress-ex'(el) { progressEx = el.value; render(); },
  profile(el) {
    const v = el.type === 'checkbox' ? el.checked : el.name === 'days' ? +el.value : el.value;
    state.profile[el.name] = el.name === 'name' ? v.trim() : v;
    save();
  },
  import(el) {
    const file = el.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data.profile || !Array.isArray(data.history)) throw new Error('format');
        if (!confirm(`Загрузить копию (${data.history.length} тренировок)? Текущие данные будут заменены.`)) return;
        state = merge(defaultState(), data);
        save();
        toast('Копия загружена');
        render();
      } catch { toast('Это не файл резервной копии'); }
    };
    reader.readAsText(file);
  }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const fn = actions[el.dataset.action];
  if (fn) { e.preventDefault(); fn(el.dataset, el); }
});

document.addEventListener('change', e => {
  const el = e.target.closest('[data-change]');
  if (el) changeHandlers[el.dataset.change]?.(el);
});

document.addEventListener('input', e => {
  if (e.target.dataset.input === 'pain') {
    const v = +e.target.value;
    $('#pain-v').textContent = v;
    $('#pain-warn').hidden = v < 6;
  }
});

$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') e.target.close(); });

// ── Роутер ──

const routes = {
  today: viewToday, programs: viewPrograms, program: viewProgram, skills: viewSkills, skill: viewSkill,
  back: viewBack, progress: viewProgress, settings: viewSettings, onboarding: viewOnboarding, workout: viewWorkout
};

let lastRoute = '';

function render() {
  const [name = 'today', ...args] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!state.profile.onboarded && name !== 'onboarding') { location.hash = '#/onboarding'; return; }
  if (name === 'workout' && !session) { location.hash = '#/today'; return; }
  const view = routes[name] || viewToday;
  $('#app').innerHTML = view(...args);
  $('#nav').hidden = name === 'workout' || name === 'onboarding';
  document.body.classList.toggle('in-player', name === 'workout');
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.route === name ||
    (name === 'program' && a.dataset.route === 'programs') || (name === 'skill' && a.dataset.route === 'skills')));
  const route = location.hash;
  if (route !== lastRoute) { window.scrollTo(0, 0); lastRoute = route; }
  if (name === 'workout' && (session.phase === 'rest' || session.timer)) startTicker();
}

window.addEventListener('hashchange', render);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && session) { keepAwake(true); if (ticker) tick(); }
});

render();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => { /* офлайн-режим недоступен */ });
}
