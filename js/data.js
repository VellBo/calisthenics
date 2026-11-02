// Справочник упражнений, программ, лестниц навыков и программы для спины.
// type: 'reps' — повторения, 'time' — секунды. side: true — «на каждую сторону».
// back: подсказка при гиперлордозе (показывается, если включён трек для спины).

export const EXERCISES = {
  // ── Разминка ──
  jumping_jacks: { name: 'Прыжки «звёздочка»', type: 'time', group: 'Разминка', muscles: 'Всё тело, пульс',
    cues: ['Мягко приземляйся на носки', 'Дыши ровно'] },
  arm_circles: { name: 'Круги руками', type: 'time', group: 'Разминка', muscles: 'Плечи',
    cues: ['10 вперёд, 10 назад', 'Постепенно увеличивай амплитуду'] },
  wrist_warmup: { name: 'Разминка запястий', type: 'time', group: 'Разминка', muscles: 'Запястья, предплечья',
    cues: ['Стоя на четвереньках, перекатывайся вперёд-назад', 'Поверни ладони пальцами к коленям и мягко потяни'] },
  scap_pushup: { name: 'Лопаточные отжимания', type: 'reps', group: 'Разминка', muscles: 'Передняя зубчатая, лопатки',
    cues: ['Руки прямые, двигаются только лопатки', 'Сведи — разведи лопатки'],
    back: 'Держи таз подкрученным, поясница не проваливается.' },

  // ── Тяга ──
  dead_hang: { name: 'Вис на турнике', type: 'time', group: 'Тяга', muscles: 'Хват, плечи, широчайшие',
    cues: ['Хват чуть шире плеч', 'Плечи слегка опущены, не «висни на связках»'],
    back: 'Ноги чуть впереди, рёбра опущены, ягодицы напряжены — без прогиба в пояснице.' },
  scap_pull: { name: 'Лопаточные подтягивания', type: 'reps', group: 'Тяга', muscles: 'Нижняя трапеция, широчайшие',
    cues: ['Руки прямые', 'Опусти лопатки вниз и подними корпус на 3–5 см', 'Пауза 1 секунда вверху'],
    back: 'Положение «лодочки»: таз подкручен, ноги вместе.' },
  aus_row: { name: 'Австралийские подтягивания', type: 'reps', group: 'Тяга', muscles: 'Спина, бицепс',
    cues: ['Тело прямое как доска', 'Тяни грудь к перекладине', 'Чем ниже перекладина — тем тяжелее'],
    back: 'Сожми ягодицы и пресс — таз не провисает и не задирается.' },
  neg_pullup: { name: 'Негативные подтягивания', type: 'reps', group: 'Тяга', muscles: 'Спина, бицепс',
    cues: ['Запрыгни в верхнюю точку', 'Опускайся 4–5 секунд', 'Полностью выпрямляй руки внизу'],
    back: 'Ноги чуть впереди корпуса, не прогибайся в пояснице.' },
  pullup: { name: 'Подтягивания', type: 'reps', group: 'Тяга', muscles: 'Широчайшие, бицепс, предплечья',
    cues: ['Начни с лопаток', 'Подбородок выше перекладины', 'Без рывков и раскачки'],
    back: 'Держи «полый» корпус (hollow): рёбра вниз, ноги чуть вперёд.' },
  chinup: { name: 'Подтягивания обратным хватом', type: 'reps', group: 'Тяга', muscles: 'Бицепс, широчайшие',
    cues: ['Хват на ширине плеч ладонями к себе', 'Локти вниз и к рёбрам'],
    back: 'Ноги вместе и чуть впереди.' },
  explosive_pullup: { name: 'Взрывные подтягивания', type: 'reps', group: 'Тяга', muscles: 'Широчайшие, мощность',
    cues: ['Тяни максимально быстро', 'Цель — перекладина на уровне груди или ниже', 'Контролируй спуск'],
    back: 'Не «отбрасывай» ноги назад для импульса — это прогиб в пояснице.' },
  archer_pullup: { name: 'Подтягивания лучника', type: 'reps', side: true, group: 'Тяга', muscles: 'Широчайшие, бицепс',
    cues: ['Широкий хват', 'Тянись к одной руке, вторая выпрямляется', 'Чередуй стороны'] },
  l_pullup: { name: 'Подтягивания с уголком', type: 'reps', group: 'Тяга', muscles: 'Спина, пресс',
    cues: ['Ноги прямые параллельно полу', 'Если тяжело — согни колени'] },
  tuck_fl: { name: 'Фронт-левер в группировке', type: 'time', group: 'Тяга', muscles: 'Широчайшие, пресс',
    cues: ['Колени к груди', 'Руки прямые, давят перекладину вниз', 'Спина параллельна полу'] },
  adv_tuck_fl: { name: 'Продвинутая группировка (фронт)', type: 'time', group: 'Тяга', muscles: 'Широчайшие, пресс',
    cues: ['Спина ровная, не круглая', 'Колени отведены от груди, бёдра под 90°'] },
  muscle_up_neg: { name: 'Негативный выход силой', type: 'reps', group: 'Тяга', muscles: 'Спина, грудь, трицепс',
    cues: ['Из упора над перекладиной медленно опускайся', 'Самое важное — пройти переход контролируемо'] },
  muscle_up: { name: 'Выход силой', type: 'reps', group: 'Тяга', muscles: 'Всё верхнее тело',
    cues: ['Тяга к поясу, а не к подбородку', 'Перекладина «уходит» к бёдрам', 'Быстро переводи локти вверх'],
    back: 'Избегай «кипа»-прогиба: импульс от пресса и ягодиц, а не от поясницы.' },

  // ── Жим ──
  incline_pushup: { name: 'Отжимания от опоры', type: 'reps', group: 'Жим', muscles: 'Грудь, трицепс',
    cues: ['Руки на скамье или стуле', 'Тело — прямая линия', 'Чем ниже опора — тем тяжелее'],
    back: 'Ягодицы сжаты, таз подкручен.' },
  pushup: { name: 'Отжимания', type: 'reps', group: 'Жим', muscles: 'Грудь, трицепс, передние дельты',
    cues: ['Локти под 45° к корпусу', 'Грудь касается пола или почти', 'Полностью выпрямляй руки'],
    back: 'Сожми ягодицы, рёбра вниз — бёдра не проваливаются.' },
  diamond_pushup: { name: 'Отжимания алмазом', type: 'reps', group: 'Жим', muscles: 'Трицепс, грудь',
    cues: ['Ладони вместе, пальцы образуют ромб', 'Локти назад вдоль корпуса'],
    back: 'Держи таз подкрученным.' },
  decline_pushup: { name: 'Отжимания с ногами на опоре', type: 'reps', group: 'Жим', muscles: 'Верх груди, плечи',
    cues: ['Ноги на скамье', 'Не опускай голову, смотри чуть вперёд'],
    back: 'Ноги на опоре усиливают прогиб — сильнее сжимай пресс и ягодицы.' },
  archer_pushup: { name: 'Отжимания лучника', type: 'reps', side: true, group: 'Жим', muscles: 'Грудь, трицепс',
    cues: ['Широкая постановка', 'Опускайся к одной руке, вторая прямая'] },
  pseudo_planche_pushup: { name: 'Псевдопланш-отжимания', type: 'reps', group: 'Жим', muscles: 'Плечи, грудь, кор',
    cues: ['Ладони у пояса, пальцы в стороны или назад', 'Плечи впереди кистей'],
    back: 'Положение hollow: спина слегка круглая, таз подкручен.' },
  pike_pushup: { name: 'Отжимания пайк', type: 'reps', group: 'Жим', muscles: 'Плечи, трицепс',
    cues: ['Таз высоко, тело буквой Λ', 'Голова опускается перед кистями'] },
  elevated_pike_pushup: { name: 'Пайк с ногами на опоре', type: 'reps', group: 'Жим', muscles: 'Плечи, трицепс',
    cues: ['Ноги на скамье', 'Корпус почти вертикален', 'Голова — к точке перед кистями'] },
  wall_hs_hold: { name: 'Стойка у стены (грудью к стене)', type: 'time', group: 'Жим', muscles: 'Плечи, кор',
    cues: ['Заходи ногами по стене', 'Руки прямые, плечи к ушам', 'Носки касаются стены'],
    back: 'Именно грудью к стене — так проще держать ровную линию. Рёбра вниз, ягодицы сжаты.' },
  wall_hspu: { name: 'Отжимания в стойке у стены', type: 'reps', group: 'Жим', muscles: 'Плечи, трицепс',
    cues: ['Начни с частичной амплитуды', 'Голова — перед кистями (треугольник)'],
    back: 'Не прогибайся «бананом» — держи ягодицы и пресс.' },
  hs_free: { name: 'Свободная стойка на руках', type: 'time', group: 'Жим', muscles: 'Плечи, баланс',
    cues: ['Баланс пальцами', 'Тренируй выход из стойки колесом заранее'],
    back: 'Цель — прямая линия без прогиба.' },
  bench_dips: { name: 'Обратные отжимания от скамьи', type: 'reps', group: 'Жим', muscles: 'Трицепс',
    cues: ['Таз близко к скамье', 'Локти назад, не в стороны', 'Не опускайся ниже 90° в локтях'] },
  dips: { name: 'Отжимания на брусьях', type: 'reps', group: 'Жим', muscles: 'Грудь, трицепс',
    cues: ['Опускайся до 90° в локтях', 'Плечи не поднимай к ушам'],
    back: 'Ноги чуть вперёд, без прогиба.' },
  straight_bar_dips: { name: 'Отжимания на перекладине', type: 'reps', group: 'Жим', muscles: 'Трицепс, грудь',
    cues: ['Перекладина у пояса', 'Корпус наклонён вперёд', 'Ключевое упражнение для выхода силой'] },

  // ── Ноги ──
  squat: { name: 'Приседания', type: 'reps', group: 'Ноги', muscles: 'Квадрицепс, ягодицы',
    cues: ['Стопы на ширине плеч', 'Колени по направлению носков', 'Спина нейтральна'],
    back: 'Не выпячивай таз назад в верхней точке — заканчивай сжатием ягодиц.' },
  jump_squat: { name: 'Выпрыгивания из приседа', type: 'reps', group: 'Ноги', muscles: 'Ноги, мощность',
    cues: ['Мягкое приземление', 'Сразу в следующий присед'] },
  reverse_lunge: { name: 'Выпады назад', type: 'reps', side: true, group: 'Ноги', muscles: 'Ягодицы, квадрицепс',
    cues: ['Шаг назад, колено почти касается пола', 'Корпус вертикален'],
    back: 'Подкрути таз на задней ноге — заодно растягиваются сгибатели бедра.' },
  split_squat: { name: 'Болгарские выпады', type: 'reps', side: true, group: 'Ноги', muscles: 'Ягодицы, квадрицепс',
    cues: ['Задняя нога на скамье', 'Опускайся вертикально вниз'],
    back: 'Сожми ягодицу задней ноги и держи рёбра опущенными.' },
  pistol_box: { name: 'Пистолет на возвышение', type: 'reps', side: true, group: 'Ноги', muscles: 'Квадрицепс, ягодицы, баланс',
    cues: ['Садись на скамью на одной ноге', 'Вставай без толчка второй ногой'] },
  pistol: { name: 'Пистолет', type: 'reps', side: true, group: 'Ноги', muscles: 'Квадрицепс, ягодицы, баланс',
    cues: ['Руки вперёд для баланса', 'Пятка на полу', 'Можно держаться за опору на первых порах'] },
  calf_raise: { name: 'Подъёмы на носки', type: 'reps', group: 'Ноги', muscles: 'Икры',
    cues: ['На ступеньке с полной амплитудой', 'Пауза вверху'] },
  glute_bridge: { name: 'Ягодичный мостик', type: 'reps', group: 'Ноги', muscles: 'Ягодицы, задняя поверхность',
    cues: ['Сначала подкрути таз, потом поднимай', 'Толкай пятками', 'Пауза 2 секунды вверху'],
    back: 'Поднимайся до прямой линии колени–таз–плечи, не выше. Работают ягодицы, а не поясница.' },
  single_leg_bridge: { name: 'Мостик на одной ноге', type: 'reps', side: true, group: 'Ноги', muscles: 'Ягодицы',
    cues: ['Таз не перекашивается', 'Пауза вверху'],
    back: 'Без прогиба в верхней точке.' },

  // ── Кор ──
  plank: { name: 'Планка', type: 'time', group: 'Кор', muscles: 'Пресс, кор',
    cues: ['Локти под плечами', 'Тело прямое'],
    back: 'Подкрути таз и сожми ягодицы — поясница не проваливается.' },
  rkc_plank: { name: 'Планка RKC (силовая)', type: 'time', group: 'Кор', muscles: 'Пресс, ягодицы',
    cues: ['Тяни локти к носкам, не сдвигая их', 'Максимально сожми ягодицы и бёдра', 'Короткие подходы, 10–20 секунд'],
    back: 'Одно из лучших упражнений при гиперлордозе: учит держать задний наклон таза под нагрузкой.' },
  side_plank: { name: 'Боковая планка', type: 'time', side: true, group: 'Кор', muscles: 'Косые, ягодичная средняя',
    cues: ['Локоть под плечом', 'Таз не проваливается'],
    back: 'Таз чуть подкручен вперёд, не отклоняй его назад.' },
  hollow_hold: { name: 'Удержание «лодочки» (hollow)', type: 'time', group: 'Кор', muscles: 'Пресс',
    cues: ['Поясница прижата к полу', 'Руки за головой, ноги прямые', 'Если поясница отрывается — согни колени'],
    back: 'Ключевое упражнение: вся калистеника строится на этом положении.' },
  hollow_rock: { name: 'Перекаты в «лодочке»', type: 'reps', group: 'Кор', muscles: 'Пресс',
    cues: ['Сохраняй форму лодочки', 'Перекатывайся как одно целое'] },
  dead_bug: { name: 'Мёртвый жук', type: 'reps', side: true, group: 'Кор', muscles: 'Глубокие мышцы пресса',
    cues: ['Лёжа на спине, руки и колени вверх', 'Опускай противоположные руку и ногу', 'Поясница всё время прижата к полу'],
    back: 'Двигайся медленно, выдох при опускании.' },
  bird_dog: { name: 'Птица-собака', type: 'reps', side: true, group: 'Кор', muscles: 'Разгибатели, ягодицы, кор',
    cues: ['На четвереньках вытяни противоположные руку и ногу', 'Пауза 2–3 секунды'],
    back: 'Не поднимай ногу выше уровня таза — иначе прогиб в пояснице.' },
  reverse_crunch: { name: 'Обратные скручивания', type: 'reps', group: 'Кор', muscles: 'Нижняя часть пресса',
    cues: ['Подкручивай таз, отрывая его от пола', 'Медленно опускай'],
    back: 'Хорошо тренирует задний наклон таза.' },
  hanging_knee_raise: { name: 'Подъём коленей в висе', type: 'reps', group: 'Кор', muscles: 'Пресс, сгибатели бедра',
    cues: ['Подкручивай таз в конце движения', 'Без раскачки'] },
  hanging_leg_raise: { name: 'Подъём ног в висе', type: 'reps', group: 'Кор', muscles: 'Пресс',
    cues: ['Ноги прямые до параллели или выше', 'Медленный спуск'] },
  toes_to_bar: { name: 'Носки к перекладине', type: 'reps', group: 'Кор', muscles: 'Пресс, широчайшие',
    cues: ['Дави перекладину вниз прямыми руками', 'Носки касаются перекладины'] },
  l_sit_tuck: { name: 'Уголок в группировке', type: 'time', group: 'Кор', muscles: 'Пресс, трицепс',
    cues: ['Упор на брусьях или полу', 'Колени к груди', 'Плечи опущены'] },
  l_sit: { name: 'Уголок', type: 'time', group: 'Кор', muscles: 'Пресс, сгибатели бедра',
    cues: ['Ноги прямые, параллельно полу', 'Тяни носки'] },

  // ── Мобильность и спина ──
  cat_cow: { name: 'Кошка-корова', type: 'reps', group: 'Мобильность', muscles: 'Позвоночник',
    cues: ['На четвереньках', 'Выдох — округли спину, вдох — мягко прогнись', 'Медленно, без боли'],
    back: 'Акцент на фазу «кошки» (округление). Прогиб — мягкий и без усилия.' },
  childs_pose: { name: 'Поза ребёнка', type: 'time', group: 'Мобильность', muscles: 'Поясница, широчайшие',
    cues: ['Таз на пятки, руки вперёд', 'Глубоко дыши в поясницу'] },
  hip_flexor_stretch: { name: 'Растяжка сгибателей бедра на колене', type: 'time', side: true, group: 'Мобильность', muscles: 'Подвздошно-поясничная, прямая бедра',
    cues: ['Встань в выпад на колено', 'Сначала подкрути таз и сожми ягодицу', 'Потом чуть подайся вперёд'],
    back: 'Без подкрутки таза растяжка уходит в поясницу. Главное — задний наклон таза.' },
  couch_stretch: { name: 'Растяжка «у дивана»', type: 'time', side: true, group: 'Мобильность', muscles: 'Прямая мышца бедра',
    cues: ['Колено у стены или дивана, голень вверх по стене', 'Корпус постепенно вертикально', 'Ягодица сжата'],
    back: 'Продвинутая версия растяжки сгибателей. Если тянет поясницу — вернись к варианту на колене.' },
  lat_stretch: { name: 'Растяжка широчайших у опоры', type: 'time', group: 'Мобильность', muscles: 'Широчайшие',
    cues: ['Локти на скамье, таз к пяткам', 'Опусти грудь вниз', 'Держи живот подтянутым'],
    back: 'Зажатые широчайшие тянут таз вперёд и усиливают прогиб — особенно у тех, кто много подтягивается.' },
  knee_to_chest: { name: 'Колени к груди лёжа', type: 'time', group: 'Мобильность', muscles: 'Поясница',
    cues: ['Обхвати колени', 'Мягко подтяни к груди', 'Расслабь поясницу'] },
  ppt_supine: { name: 'Подкрутка таза лёжа', type: 'reps', group: 'Спина', muscles: 'Глубокий пресс, ягодицы',
    cues: ['Лёжа на спине, колени согнуты', 'На выдохе прижми поясницу к полу', 'Пауза 3–5 секунд'],
    back: 'Базовый навык: учишься чувствовать задний наклон таза.' },
  ppt_wall: { name: 'Подкрутка таза у стены', type: 'reps', group: 'Спина', muscles: 'Глубокий пресс, ягодицы',
    cues: ['Стоя спиной к стене, пятки в 10–15 см', 'Прижми поясницу к стене', 'Пауза 5 секунд'],
    back: 'Перенос навыка в вертикальное положение.' },
  breathing_9090: { name: 'Дыхание 90/90 (ноги на стене)', type: 'time', group: 'Спина', muscles: 'Диафрагма, глубокий пресс',
    cues: ['Лёжа, стопы на стене, колени и бёдра под 90°', 'Слегка надави пятками на стену', 'Вдох носом — длинный выдох ртом, рёбра опускаются'],
    back: 'Снижает тонус поясничных разгибателей и «закрывает» рёбра.' },
  wall_slide: { name: 'Скольжение руками по стене', type: 'reps', group: 'Спина', muscles: 'Лопатки, плечи',
    cues: ['Спиной к стене, поясница прижата', 'Скользи руками вверх, не отрывая их', 'Не прогибайся'],
    back: 'Тренирует подъём рук без прогиба — пригодится для стойки и подтягиваний.' },
  quad_stretch_side: { name: 'Растяжка бедра лёжа на боку', type: 'time', side: true, group: 'Мобильность', muscles: 'Квадрицепс',
    cues: ['Лёжа на боку, возьми стопу рукой', 'Подкрути таз, колено отведи назад'] }
};

// Общая разминка, добавляется в начало силовых тренировок.
export const WARMUP = [
  { ex: 'jumping_jacks', sets: 1, time: 45, rest: 0 },
  { ex: 'arm_circles', sets: 1, time: 30, rest: 0 },
  { ex: 'wrist_warmup', sets: 1, time: 30, rest: 0 },
  { ex: 'cat_cow', sets: 1, reps: 8, rest: 0 },
  { ex: 'scap_pushup', sets: 1, reps: 10, rest: 0 }
];

export const LEVELS = { beginner: 'Новичок', intermediate: 'Средний', advanced: 'Продвинутый' };

// Программы тренировок. Тренировки внутри идут по кругу.
export const PROGRAMS = [
  {
    id: 'start', title: 'Старт', level: 'beginner', days: 3, weeks: 6, color: '#3ddc97',
    subtitle: 'Фундамент: первые подтягивания и честные отжимания',
    workouts: [
      { id: 'a', title: 'Всё тело A', blocks: [
        { ex: 'aus_row', sets: 3, reps: 8, rest: 90 },
        { ex: 'incline_pushup', sets: 3, reps: 10, rest: 90 },
        { ex: 'squat', sets: 3, reps: 15, rest: 60 },
        { ex: 'dead_hang', sets: 3, time: 20, rest: 60 },
        { ex: 'hollow_hold', sets: 3, time: 15, rest: 45 }
      ]},
      { id: 'b', title: 'Всё тело B', blocks: [
        { ex: 'neg_pullup', sets: 3, reps: 3, rest: 120 },
        { ex: 'pushup', sets: 3, reps: 6, rest: 90 },
        { ex: 'reverse_lunge', sets: 3, reps: 8, rest: 60 },
        { ex: 'scap_pull', sets: 3, reps: 8, rest: 60 },
        { ex: 'dead_bug', sets: 3, reps: 6, rest: 45 }
      ]}
    ]
  },
  {
    id: 'base', title: 'Основа силы', level: 'intermediate', days: 4, weeks: 8, color: '#4da3ff',
    subtitle: 'Сплит тяга/жим + ноги. Подтягивания до 15, брусья до 20',
    workouts: [
      { id: 'pull', title: 'Тяга + пресс', blocks: [
        { ex: 'pullup', sets: 4, reps: 8, rest: 120 },
        { ex: 'chinup', sets: 3, reps: 8, rest: 90 },
        { ex: 'aus_row', sets: 3, reps: 12, rest: 60 },
        { ex: 'hanging_knee_raise', sets: 3, reps: 12, rest: 60 },
        { ex: 'hollow_hold', sets: 3, time: 30, rest: 45 }
      ]},
      { id: 'push', title: 'Жим + ноги', blocks: [
        { ex: 'dips', sets: 4, reps: 10, rest: 120 },
        { ex: 'pike_pushup', sets: 3, reps: 8, rest: 90 },
        { ex: 'diamond_pushup', sets: 3, reps: 10, rest: 60 },
        { ex: 'split_squat', sets: 3, reps: 10, rest: 60 },
        { ex: 'single_leg_bridge', sets: 3, reps: 10, rest: 45 }
      ]},
      { id: 'pull2', title: 'Тяга (объём) + кор', blocks: [
        { ex: 'pullup', sets: 5, reps: 6, rest: 90 },
        { ex: 'explosive_pullup', sets: 3, reps: 4, rest: 120 },
        { ex: 'scap_pull', sets: 3, reps: 10, rest: 60 },
        { ex: 'rkc_plank', sets: 3, time: 15, rest: 45 },
        { ex: 'side_plank', sets: 2, time: 30, rest: 30 }
      ]},
      { id: 'push2', title: 'Жим (объём) + ноги', blocks: [
        { ex: 'pushup', sets: 4, reps: 15, rest: 90 },
        { ex: 'dips', sets: 3, reps: 8, rest: 90 },
        { ex: 'decline_pushup', sets: 3, reps: 10, rest: 60 },
        { ex: 'pistol_box', sets: 3, reps: 6, rest: 60 },
        { ex: 'calf_raise', sets: 3, reps: 15, rest: 45 }
      ]}
    ]
  },
  {
    id: 'muscleup', title: 'Путь к выходу силой', level: 'intermediate', days: 3, weeks: 6, color: '#ff9f43',
    subtitle: 'Взрывная тяга, переход и брусья на перекладине',
    workouts: [
      { id: 'power', title: 'Взрыв', blocks: [
        { ex: 'explosive_pullup', sets: 5, reps: 3, rest: 150 },
        { ex: 'straight_bar_dips', sets: 4, reps: 6, rest: 120 },
        { ex: 'pullup', sets: 3, reps: 8, rest: 90 },
        { ex: 'hollow_rock', sets: 3, reps: 15, rest: 45 }
      ]},
      { id: 'transition', title: 'Переход', blocks: [
        { ex: 'muscle_up_neg', sets: 4, reps: 3, rest: 150 },
        { ex: 'dips', sets: 4, reps: 10, rest: 90 },
        { ex: 'chinup', sets: 3, reps: 8, rest: 90 },
        { ex: 'toes_to_bar', sets: 3, reps: 6, rest: 60 }
      ]},
      { id: 'volume', title: 'Объём', blocks: [
        { ex: 'pullup', sets: 5, reps: 6, rest: 90 },
        { ex: 'straight_bar_dips', sets: 3, reps: 10, rest: 90 },
        { ex: 'aus_row', sets: 3, reps: 15, rest: 60 },
        { ex: 'rkc_plank', sets: 3, time: 15, rest: 45 }
      ]}
    ]
  },
  {
    id: 'handstand', title: 'Стойка и плечи', level: 'intermediate', days: 3, weeks: 6, color: '#c084fc',
    subtitle: 'Стойка у стены, отжимания в стойке, ровная линия без прогиба',
    workouts: [
      { id: 'hs1', title: 'Стойка + жим', blocks: [
        { ex: 'wall_slide', sets: 2, reps: 10, rest: 30 },
        { ex: 'wall_hs_hold', sets: 4, time: 30, rest: 90 },
        { ex: 'elevated_pike_pushup', sets: 4, reps: 8, rest: 120 },
        { ex: 'pseudo_planche_pushup', sets: 3, reps: 8, rest: 90 },
        { ex: 'hollow_hold', sets: 3, time: 30, rest: 45 }
      ]},
      { id: 'hs2', title: 'Стойка + тяга', blocks: [
        { ex: 'wall_hs_hold', sets: 5, time: 25, rest: 90 },
        { ex: 'pullup', sets: 4, reps: 8, rest: 90 },
        { ex: 'wall_hspu', sets: 3, reps: 3, rest: 120 },
        { ex: 'l_sit_tuck', sets: 3, time: 15, rest: 60 }
      ]},
      { id: 'hs3', title: 'Баланс + ноги', blocks: [
        { ex: 'hs_free', sets: 6, time: 10, rest: 60 },
        { ex: 'pike_pushup', sets: 3, reps: 12, rest: 90 },
        { ex: 'pistol_box', sets: 3, reps: 6, rest: 60 },
        { ex: 'rkc_plank', sets: 3, time: 15, rest: 45 }
      ]}
    ]
  },
  {
    id: 'advanced', title: 'Статика и сила', level: 'advanced', days: 4, weeks: 8, color: '#ff5d73',
    subtitle: 'Фронт-левер, лучник, пистолет, выход силой',
    workouts: [
      { id: 'adv_pull', title: 'Тяга + фронт', blocks: [
        { ex: 'tuck_fl', sets: 5, time: 10, rest: 120 },
        { ex: 'archer_pullup', sets: 4, reps: 4, rest: 120 },
        { ex: 'muscle_up', sets: 4, reps: 3, rest: 150 },
        { ex: 'toes_to_bar', sets: 3, reps: 10, rest: 60 }
      ]},
      { id: 'adv_push', title: 'Жим + стойка', blocks: [
        { ex: 'wall_hspu', sets: 4, reps: 5, rest: 120 },
        { ex: 'straight_bar_dips', sets: 4, reps: 10, rest: 90 },
        { ex: 'archer_pushup', sets: 3, reps: 6, rest: 90 },
        { ex: 'l_sit', sets: 4, time: 15, rest: 60 }
      ]},
      { id: 'adv_legs', title: 'Ноги + кор', blocks: [
        { ex: 'pistol', sets: 4, reps: 5, rest: 90 },
        { ex: 'split_squat', sets: 3, reps: 12, rest: 60 },
        { ex: 'jump_squat', sets: 3, reps: 10, rest: 60 },
        { ex: 'hanging_leg_raise', sets: 3, reps: 10, rest: 60 },
        { ex: 'rkc_plank', sets: 3, time: 20, rest: 45 }
      ]},
      { id: 'adv_static', title: 'Статика + объём', blocks: [
        { ex: 'adv_tuck_fl', sets: 5, time: 8, rest: 120 },
        { ex: 'hs_free', sets: 6, time: 15, rest: 60 },
        { ex: 'l_pullup', sets: 3, reps: 6, rest: 90 },
        { ex: 'pseudo_planche_pushup', sets: 3, reps: 10, rest: 90 }
      ]}
    ]
  },
  {
    id: 'core_back', title: 'Кор без прогиба', level: 'beginner', days: 3, weeks: 4, color: '#2dd4bf', back: true,
    subtitle: 'Пресс и ягодицы, совместимые с гиперлордозом. 15 минут',
    workouts: [
      { id: 'core1', title: 'Кор A', warmup: false, blocks: [
        { ex: 'ppt_supine', sets: 2, reps: 10, rest: 30 },
        { ex: 'dead_bug', sets: 3, reps: 8, rest: 45 },
        { ex: 'glute_bridge', sets: 3, reps: 12, rest: 45 },
        { ex: 'rkc_plank', sets: 3, time: 15, rest: 45 },
        { ex: 'hip_flexor_stretch', sets: 2, time: 40, rest: 15 }
      ]},
      { id: 'core2', title: 'Кор B', warmup: false, blocks: [
        { ex: 'reverse_crunch', sets: 3, reps: 10, rest: 45 },
        { ex: 'bird_dog', sets: 3, reps: 8, rest: 45 },
        { ex: 'side_plank', sets: 3, time: 25, rest: 30 },
        { ex: 'hollow_hold', sets: 3, time: 20, rest: 45 },
        { ex: 'lat_stretch', sets: 2, time: 40, rest: 15 }
      ]}
    ]
  }
];

// Лестницы навыков. Каждая ступень — норматив, после которого переходишь дальше.
export const SKILLS = [
  { id: 'pullups', title: 'Подтягивания', icon: '⬆️', steps: [
    { ex: 'dead_hang', goal: '30 секунд' },
    { ex: 'scap_pull', goal: '3 × 10' },
    { ex: 'aus_row', goal: '3 × 12' },
    { ex: 'neg_pullup', goal: '3 × 5 по 5 секунд' },
    { ex: 'pullup', goal: '3 × 5' },
    { ex: 'pullup', goal: '3 × 10' },
    { ex: 'archer_pullup', goal: '3 × 5 на сторону' }
  ]},
  { id: 'muscleup', title: 'Выход силой', icon: '🚀', steps: [
    { ex: 'pullup', goal: '3 × 10' },
    { ex: 'explosive_pullup', goal: '3 × 5 до груди' },
    { ex: 'straight_bar_dips', goal: '3 × 8' },
    { ex: 'muscle_up_neg', goal: '3 × 3' },
    { ex: 'muscle_up', goal: '1 чистый' },
    { ex: 'muscle_up', goal: '3 × 3' }
  ]},
  { id: 'pushups', title: 'Отжимания', icon: '💪', steps: [
    { ex: 'incline_pushup', goal: '3 × 12' },
    { ex: 'pushup', goal: '3 × 10' },
    { ex: 'pushup', goal: '3 × 20' },
    { ex: 'diamond_pushup', goal: '3 × 12' },
    { ex: 'archer_pushup', goal: '3 × 6 на сторону' },
    { ex: 'pseudo_planche_pushup', goal: '3 × 8' }
  ]},
  { id: 'dips', title: 'Брусья', icon: '🔻', steps: [
    { ex: 'bench_dips', goal: '3 × 12' },
    { ex: 'dips', goal: '3 × 5' },
    { ex: 'dips', goal: '3 × 12' },
    { ex: 'straight_bar_dips', goal: '3 × 8' }
  ]},
  { id: 'handstand', title: 'Стойка на руках', icon: '🤸', steps: [
    { ex: 'pike_pushup', goal: '3 × 10' },
    { ex: 'elevated_pike_pushup', goal: '3 × 8' },
    { ex: 'wall_hs_hold', goal: '30 секунд' },
    { ex: 'wall_hs_hold', goal: '60 секунд' },
    { ex: 'wall_hspu', goal: '3 × 3' },
    { ex: 'hs_free', goal: '10 секунд' }
  ]},
  { id: 'lsit', title: 'Уголок', icon: '📐', steps: [
    { ex: 'hollow_hold', goal: '30 секунд' },
    { ex: 'l_sit_tuck', goal: '20 секунд' },
    { ex: 'l_sit', goal: '10 секунд' },
    { ex: 'l_sit', goal: '30 секунд' }
  ]},
  { id: 'frontlever', title: 'Фронт-левер', icon: '➖', steps: [
    { ex: 'hollow_hold', goal: '45 секунд' },
    { ex: 'pullup', goal: '3 × 10' },
    { ex: 'tuck_fl', goal: '15 секунд' },
    { ex: 'adv_tuck_fl', goal: '10 секунд' }
  ]},
  { id: 'pistol', title: 'Пистолет', icon: '🦵', steps: [
    { ex: 'split_squat', goal: '3 × 10 на ногу' },
    { ex: 'pistol_box', goal: '3 × 6 на ногу' },
    { ex: 'pistol', goal: '3 × 3 на ногу' },
    { ex: 'pistol', goal: '3 × 8 на ногу' }
  ]},
  { id: 'legraise', title: 'Подъём ног в висе', icon: '🦿', steps: [
    { ex: 'hanging_knee_raise', goal: '3 × 12' },
    { ex: 'hanging_leg_raise', goal: '3 × 8' },
    { ex: 'toes_to_bar', goal: '3 × 8' }
  ]}
];

// ── Спина: гиперлордоз ──

export const BACK_TRACKS = {
  posture: {
    title: 'Осанка',
    subtitle: 'Профилактика и коррекция без боли',
    color: '#3ddc97',
    about: 'Для тех, у кого поясница не болит, но таз «уходит» вперёд и есть заметный прогиб. ' +
      'Растягиваем сгибатели бедра и широчайшие, укрепляем ягодицы и глубокий пресс, учимся держать таз нейтрально в упражнениях.',
    routines: [
      { id: 'posture_daily', title: 'Ежедневная мобильность', minutes: 10, freq: 'каждый день', blocks: [
        { ex: 'breathing_9090', sets: 1, time: 60, rest: 0 },
        { ex: 'cat_cow', sets: 1, reps: 10, rest: 10 },
        { ex: 'hip_flexor_stretch', sets: 2, time: 45, rest: 10 },
        { ex: 'couch_stretch', sets: 1, time: 45, rest: 10 },
        { ex: 'lat_stretch', sets: 2, time: 40, rest: 10 },
        { ex: 'childs_pose', sets: 1, time: 45, rest: 0 }
      ]},
      { id: 'posture_strength', title: 'Сила: ягодицы и пресс', minutes: 20, freq: '3 раза в неделю', blocks: [
        { ex: 'ppt_wall', sets: 2, reps: 8, rest: 30 },
        { ex: 'dead_bug', sets: 3, reps: 10, rest: 45 },
        { ex: 'glute_bridge', sets: 3, reps: 15, rest: 45 },
        { ex: 'single_leg_bridge', sets: 2, reps: 10, rest: 45 },
        { ex: 'rkc_plank', sets: 3, time: 20, rest: 45 },
        { ex: 'reverse_crunch', sets: 3, reps: 12, rest: 45 },
        { ex: 'side_plank', sets: 2, time: 30, rest: 30 },
        { ex: 'hip_flexor_stretch', sets: 2, time: 45, rest: 10 }
      ]}
    ]
  },
  gentle: {
    title: 'Щадящий',
    subtitle: 'При боли в пояснице или диагнозе',
    color: '#ffb547',
    about: 'Мягкая программа для тех, у кого есть боль или диагноз. Упражнения выполняются в положении лёжа и на четвереньках, ' +
      'без осевой нагрузки и резких движений. Боль во время упражнения — сигнал остановиться. ' +
      'Обязательно согласуй программу с врачом или инструктором ЛФК.',
    routines: [
      { id: 'gentle_daily', title: 'Мягкая разгрузка', minutes: 10, freq: 'каждый день', blocks: [
        { ex: 'breathing_9090', sets: 2, time: 60, rest: 15 },
        { ex: 'knee_to_chest', sets: 2, time: 30, rest: 10 },
        { ex: 'ppt_supine', sets: 2, reps: 8, rest: 20 },
        { ex: 'cat_cow', sets: 1, reps: 8, rest: 10 },
        { ex: 'childs_pose', sets: 1, time: 45, rest: 0 }
      ]},
      { id: 'gentle_strength', title: 'Мягкое укрепление', minutes: 15, freq: '3 раза в неделю', blocks: [
        { ex: 'ppt_supine', sets: 2, reps: 10, rest: 30 },
        { ex: 'dead_bug', sets: 2, reps: 6, rest: 45 },
        { ex: 'glute_bridge', sets: 2, reps: 10, rest: 45 },
        { ex: 'bird_dog', sets: 2, reps: 6, rest: 45 },
        { ex: 'hip_flexor_stretch', sets: 2, time: 30, rest: 15 },
        { ex: 'quad_stretch_side', sets: 1, time: 30, rest: 0 }
      ]}
    ]
  }
};

export const RED_FLAGS = [
  'Онемение, покалывание или слабость в ногах',
  'Нарушение мочеиспускания или дефекации',
  'Сильная ночная боль, которая не проходит в покое',
  'Боль появилась после травмы или падения',
  'Температура, необъяснимая потеря веса'
];

export const BACK_TIPS = [
  { title: 'Что такое гиперлордоз', text: 'Избыточный прогиб в поясничном отделе. Чаще всего связан с передним наклоном таза: ' +
    'укороченные сгибатели бедра и разгибатели спины тянут таз вперёд, а слабые ягодицы и пресс не уравновешивают их.' },
  { title: 'Тест у стены', text: 'Встань спиной к стене: пятки, ягодицы и лопатки касаются её. Если между поясницей и стеной ' +
    'свободно проходит ладонь — это норма. Если проходит кулак — прогиб, скорее всего, увеличен. Тест ориентировочный, диагноз ставит только врач.' },
  { title: 'Тест Томаса', text: 'Сядь на край стола, ляг на спину и прижми одно колено к груди. Если бедро второй ноги ' +
    'поднимается над столом — сгибатели бедра укорочены. Проверь обе стороны.' },
  { title: 'Hollow во всём', text: 'В висе, подтягиваниях, отжиманиях и стойке держи положение «лодочки»: рёбра вниз, ' +
    'таз подкручен, ягодицы сжаты. Это главная привычка, которая переносится из упражнений в жизнь.' },
  { title: 'Осторожно с «бананом»', text: 'Стойка на руках с прогибом, раскачка в выходе силой и отжимания с провисшим тазом ' +
    'нагружают поясницу. Лучше меньше повторов, но с ровной линией.' },
  { title: 'Широчайшие и лордоз', text: 'Много подтягиваний без растяжки широчайших может усиливать прогиб. После тяговых тренировок ' +
    'добавляй растяжку широчайших и сгибателей бедра.' },
  { title: 'Сидячая работа', text: 'Каждые 45–60 минут вставай и делай 30 секунд растяжки сгибателей бедра. Это даёт больше, чем одна длинная растяжка вечером.' }
];
