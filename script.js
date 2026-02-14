// ═══════════════════════════════════════════
// НАСТРОЙКИ — меняй тексты, GIF и параметры здесь
// ═══════════════════════════════════════════

// Стадии GIF-персонажа (от счастливого до рыдающего)
const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 — обычный, счастливый
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 — удивлённый
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 — умоляющий
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 — грустный
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 — ещё грустнее
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 — разбит
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 — очень разбит
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif", // 7 — в слезах
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 8 — рыдает
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 9 — полностью разбит
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif"        // 10 — финальный
]

// Тексты кнопки «Нет» — по нарастающей эмоциональности
const noMessages = [
    "Нет",
    "Ты точно уверена? 🤔",
    "Катюш, ну пожааалуйста... 🥺",
    "Если скажешь нет — я расплачусь...",
    "Мне правда будет грустно... 😢",
    "Пожалуйста??? 💔",
    "Не делай так со мной...",
    "У тебя нет сердца! 💀",
    "Я не переживу это...",
    "Последний шанс! 😭",
    "Всё равно не поймаешь меня 😜"
]

// Tease-сообщения при преждевременном клике «Да»
const yesTeasePokes = [
    "Сначала нажми «Нет»... тебе же интересно 😏",
    "Давай, нажми «Нет»... хотя бы разочек 👀",
    "Ты точно ничего не хочешь пропустить 😈",
    "Нажми «Нет», рискнёшь? 😏",
    "Кать, ну будь смелее 😜",
    "Один разочек, я не обижусь... наверное 🤭",
    "Тебе правда не любопытно? Серьёзно? 🧐"
]

// Emoji для всплывающих реакций при кликах «Нет»
const reactionEmojis = ["😢", "💔", "🥺", "😭", "💀", "🫠", "😿"]

// ═══════════════════════════════════════════
// СОСТОЯНИЕ
// ═══════════════════════════════════════════

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true
let noButtonGone = false

// ═══════════════════════════════════════════
// DOM-ЭЛЕМЕНТЫ
// ═══════════════════════════════════════════

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')
const gifContainer = document.getElementById('gif-container')
const buttonsWrap = document.getElementById('buttons-wrap')

// ═══════════════════════════════════════════
// МУЗЫКА — автоплей с обходом политики браузера
// ═══════════════════════════════════════════

music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Запасной вариант: включаем при первом взаимодействии
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

// ═══════════════════════════════════════════
// ОБРАБОТКА КЛИКА «ДА»
// ═══════════════════════════════════════════

function handleYesClick() {
    if (!runawayEnabled && !noButtonGone) {
        // Дразним — предлагаем сначала нажать «Нет»
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

// ═══════════════════════════════════════════
// TOAST-ПОДСКАЗКА
// ═══════════════════════════════════════════

function showTeaseMessage(msg) {
    const toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

// ═══════════════════════════════════════════
// ОБРАБОТКА КЛИКА «НЕТ»
// ═══════════════════════════════════════════

function handleNoClick() {
    if (noButtonGone) return
    noClickCount++

    // 1. Меняем текст кнопки «Нет»
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // 2. Увеличиваем кнопку «Да»
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.3}px`
    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, 120)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // 3. Уменьшаем кнопку «Нет» (со 2-го клика)
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // 4. Меняем GIF по стадиям
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // 5. Вибрация кнопки «Нет» (усиливается)
    applyShake()

    // 6. Всплывающие emoji-реакции (с 3-го клика)
    if (noClickCount >= 3) {
        spawnFloatingEmoji()
    }

    // 7. Стек-layout для кнопок если «Да» стала огромной (с 4-го клика)
    if (noClickCount >= 4) {
        buttonsWrap.classList.add('stacked')
    }

    // 8. Побег кнопки «Нет» (с 5-го клика)
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }

    // 9. Фаза исчезновения (10+ кликов): кнопка «Нет» пропадает
    if (noClickCount >= 10) {
        triggerFinalPhase()
    }
}

// ═══════════════════════════════════════════
// СМЕНА GIF С ПЛАВНЫМ ПЕРЕХОДОМ
// ═══════════════════════════════════════════

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

// ═══════════════════════════════════════════
// ДРОЖАНИЕ КНОПКИ «НЕТ»
// ═══════════════════════════════════════════

function applyShake() {
    // Убираем предыдущий класс
    noBtn.classList.remove('shake-1', 'shake-2', 'shake-3')

    // Выбираем интенсивность
    let shakeClass = 'shake-1'
    if (noClickCount >= 6) shakeClass = 'shake-3'
    else if (noClickCount >= 3) shakeClass = 'shake-2'

    // Перезапуск анимации
    void noBtn.offsetWidth
    noBtn.classList.add(shakeClass)
}

// ═══════════════════════════════════════════
// ВСПЛЫВАЮЩИЕ EMOJI-РЕАКЦИИ
// ═══════════════════════════════════════════

function spawnFloatingEmoji() {
    const count = Math.min(noClickCount - 2, 5) // от 1 до 5 штук
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const emoji = document.createElement('span')
            emoji.className = 'float-emoji'
            emoji.textContent = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)]

            // Позиция — вокруг GIF-контейнера
            const rect = gifContainer.getBoundingClientRect()
            emoji.style.left = `${rect.left + Math.random() * rect.width}px`
            emoji.style.top = `${rect.top + rect.height * 0.3}px`
            emoji.style.position = 'fixed'

            document.body.appendChild(emoji)

            // Убираем через 1.5 сек (после окончания анимации)
            setTimeout(() => emoji.remove(), 1500)
        }, i * 150)
    }
}

// ═══════════════════════════════════════════
// ПОБЕГ КНОПКИ «НЕТ»
// ═══════════════════════════════════════════

function enableRunaway() {
    noBtn.classList.add('jiggle')
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    // Оставляем след 💨
    spawnTrail()

    // Считаем безопасную зону (iPhone safe areas)
    const margin = 20
    const safeTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0
    const safeBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0
    const safeLeft = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-left)')) || 0
    const safeRight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-right)')) || 0

    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin - safeRight
    const maxY = window.innerHeight - btnH - margin - safeBottom
    const minX = margin + safeLeft
    const minY = margin + safeTop

    const randomX = Math.random() * (maxX - minX) + minX
    const randomY = Math.random() * (maxY - minY) + minY

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}

// ═══════════════════════════════════════════
// СЛЕД 💨 ПРИ ПОБЕГЕ
// ═══════════════════════════════════════════

function spawnTrail() {
    const poof = document.createElement('span')
    poof.className = 'trail-poof'
    poof.textContent = '💨'

    // Ставим на текущую позицию кнопки «Нет»
    const rect = noBtn.getBoundingClientRect()
    poof.style.left = `${rect.left + rect.width / 2 - 10}px`
    poof.style.top = `${rect.top + rect.height / 2 - 10}px`

    document.body.appendChild(poof)
    setTimeout(() => poof.remove(), 500)
}

// ═══════════════════════════════════════════
// ФИНАЛЬНАЯ ФАЗА — КНОПКА «НЕТ» ИСЧЕЗАЕТ
// ═══════════════════════════════════════════

function triggerFinalPhase() {
    noButtonGone = true

    // Плавно скрываем кнопку «Нет»
    noBtn.style.opacity = '0'
    noBtn.style.pointerEvents = 'none'
    setTimeout(() => {
        noBtn.style.display = 'none'
    }, 500)

    // Кнопка «Да» пульсирует
    yesBtn.classList.add('pulse')

    // Toast-сообщение
    showTeaseMessage('Видишь? Другого варианта нет 😏❤️')
}
