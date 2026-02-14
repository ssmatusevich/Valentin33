// ═══════════════════════════════════════════
// СТРАНИЦА «ДА» — конфетти, музыка, письмо
// ═══════════════════════════════════════════

let musicPlaying = false

window.addEventListener('load', () => {
    // Запускаем усиленные конфетти
    launchConfetti()

    // Автовоспроизведение музыки (работает — пользователь уже кликнул «Да»)
    const music = document.getElementById('bg-music')
    music.volume = 0.3
    music.play().catch(() => {})
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊'

    // Плавное появление блока-письма через 3 секунды
    setTimeout(() => {
        const letter = document.getElementById('love-letter')
        if (letter) {
            letter.classList.add('visible')
        }
    }, 3000)
})

// ═══════════════════════════════════════════
// УСИЛЕННЫЕ КОНФЕТТИ — 3 потока + дождь сердец
// ═══════════════════════════════════════════

function launchConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00', '#e91e63', '#f8bbd0']
    const duration = 8000
    const end = Date.now() + duration

    // 1. Начальный мощный взрыв из центра (200+ частиц)
    confetti({
        particleCount: 200,
        spread: 120,
        origin: { x: 0.5, y: 0.3 },
        colors,
        startVelocity: 45
    })

    // 2. Второй взрыв сверху с задержкой
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 160,
            origin: { x: 0.5, y: 0 },
            colors,
            startVelocity: 30,
            gravity: 0.8
        })
    }, 400)

    // 3. Непрерывные боковые «пушки» (8 секунд)
    const sideInterval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(sideInterval)
            return
        }

        // Левая пушка
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors
        })

        // Правая пушка
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors
        })
    }, 300)

    // 4. Дождь из сердец сверху (каждые 500мс в течение 8 сек)
    const heartInterval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(heartInterval)
            return
        }

        confetti({
            particleCount: 15,
            spread: 180,
            origin: { x: Math.random(), y: -0.1 },
            colors: ['#ff69b4', '#ff1493', '#e91e63', '#f44336'],
            shapes: ['circle'],
            gravity: 0.6,
            scalar: 1.2,
            drift: (Math.random() - 0.5) * 0.5,
            startVelocity: 10
        })
    }, 500)
}

// ═══════════════════════════════════════════
// УПРАВЛЕНИЕ МУЗЫКОЙ
// ═══════════════════════════════════════════

function toggleMusic() {
    const music = document.getElementById('bg-music')
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}
