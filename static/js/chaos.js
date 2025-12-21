// ABOUTME: Chaos Goblin Mode - JavaScript for maximum pixel art insanity
// ABOUTME: Floating sprites, particles, mouse trails, Konami code, screen shake

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════

    const CONFIG = {
        particles: {
            count: 30,
            spawnInterval: 500
        },
        sparkles: {
            enabled: true,
            spawnRate: 50, // ms between sparkles when moving
            lifetime: 800
        },
        floatingSprites: {
            enabled: true,
            count: 3,
            // Mix of images and emoji fallbacks
            sprites: [
                { type: 'image', src: '/sprites/floating/dragon.gif', size: 80 },
                { type: 'image', src: '/sprites/floating/orb.png', size: 48 },
                { type: 'image', src: '/sprites/floating/orb2.png', size: 48 },
                { type: 'image', src: '/sprites/floating/potion.png', size: 48 },
                { type: 'image', src: '/sprites/floating/scroll.png', size: 48 },
                { type: 'image', src: '/sprites/floating/crystal.png', size: 56 },
                { type: 'image', src: '/sprites/floating/rune.png', size: 48 },
                { type: 'image', src: '/sprites/floating/book.png', size: 48 },
                { type: 'image', src: '/sprites/floating/lamp.png', size: 48 },
                { type: 'image', src: '/sprites/floating/lantern.png', size: 48 },
                { type: 'image', src: '/sprites/floating/key.png', size: 48 },
                { type: 'image', src: '/sprites/floating/star.png', size: 32 },
                { type: 'image', src: '/sprites/floating/shootingstar.png', size: 32 },
                { type: 'image', src: '/sprites/floating/ufo.png', size: 48 },
                { type: 'emoji', content: '🧙', size: 48 },
                { type: 'emoji', content: '🦇', size: 40 },
                { type: 'emoji', content: '🦋', size: 36 },
                { type: 'emoji', content: '👻', size: 44 }
            ]
        },
        runes: {
            enabled: true,
            count: 8,
            symbols: ['᛭', '᛫', '⚝', '✧', '⬡', '◇', '△', '☆', '⚶', '✦', '᚛', '᚜']
        },
        screenShake: {
            enabled: true,
            intensity: 5
        },
        crt: {
            enabled: true
        }
    };

    // State
    let chaosMode = false;
    let rainbowMode = false;
    let vaporwaveMode = false;
    let lastSparkleTime = 0;

    // ═══════════════════════════════════════════════════════════════
    // CRT OVERLAY
    // ═══════════════════════════════════════════════════════════════

    function createCRTOverlay() {
        if (!CONFIG.crt.enabled) return;

        const overlay = document.createElement('div');
        overlay.className = 'crt-overlay';
        overlay.id = 'crt-overlay';
        document.body.appendChild(overlay);
    }

    // ═══════════════════════════════════════════════════════════════
    // FLOATING SPRITES
    // ═══════════════════════════════════════════════════════════════

    function spawnFloatingSprite() {
        if (!CONFIG.floatingSprites.enabled || !chaosMode) return;

        const spriteConfig = CONFIG.floatingSprites.sprites[
            Math.floor(Math.random() * CONFIG.floatingSprites.sprites.length)
        ];

        const sprite = document.createElement('div');
        sprite.className = 'floating-sprite';

        // Handle both image and emoji sprites with robust type checking
        if (spriteConfig && spriteConfig.type === 'image' && spriteConfig.src) {
            const img = document.createElement('img');
            img.src = spriteConfig.src;
            img.style.width = (spriteConfig.size || 48) + 'px';
            img.style.height = 'auto';
            img.style.imageRendering = 'pixelated';
            img.onerror = () => {
                // Fallback if image fails to load
                sprite.textContent = '✨';
                sprite.style.fontSize = '48px';
            };
            sprite.appendChild(img);
        } else if (spriteConfig && spriteConfig.content) {
            sprite.textContent = spriteConfig.content;
            sprite.style.fontSize = (spriteConfig.size || 48) + 'px';
        } else {
            // Ultimate fallback
            sprite.textContent = '✨';
            sprite.style.fontSize = '48px';
        }

        // Random starting position and direction
        const direction = Math.random();
        if (direction < 0.33) {
            // Float from right to left
            sprite.style.top = (Math.random() * 60 + 10) + 'vh';
            sprite.style.right = '-100px';
            sprite.classList.add('sprite-float-left');
        } else if (direction < 0.66) {
            // Float from left to right
            sprite.style.top = (Math.random() * 60 + 10) + 'vh';
            sprite.style.left = '-100px';
            sprite.classList.add('sprite-float-right');
        } else {
            // Float diagonally
            sprite.style.bottom = '-100px';
            sprite.style.left = (Math.random() * 30) + 'vw';
            sprite.classList.add('sprite-float-diagonal');
        }

        document.body.appendChild(sprite);

        // Remove after animation completes
        setTimeout(() => sprite.remove(), 35000);
    }

    function startFloatingSprites() {
        // Spawn initial sprites
        for (let i = 0; i < CONFIG.floatingSprites.count; i++) {
            setTimeout(() => spawnFloatingSprite(), i * 5000);
        }

        // Continue spawning
        setInterval(spawnFloatingSprite, 15000);
    }

    // ═══════════════════════════════════════════════════════════════
    // PARTICLE SYSTEM
    // ═══════════════════════════════════════════════════════════════

    function createParticle() {
        if (!chaosMode) return;

        const particle = document.createElement('div');
        particle.className = 'particle';

        const isNight = document.body.classList.contains('night');
        particle.classList.add(isNight ? 'particle-firefly' : 'particle-dust');

        // Random position
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';

        // Random animation duration
        const duration = 10 + Math.random() * 15;
        particle.style.animationDuration = duration + 's';

        // Random delay
        particle.style.animationDelay = Math.random() * 5 + 's';

        document.body.appendChild(particle);

        // Remove after animation
        setTimeout(() => particle.remove(), (duration + 5) * 1000);
    }

    function startParticles() {
        // Create initial particles
        for (let i = 0; i < CONFIG.particles.count; i++) {
            setTimeout(() => createParticle(), i * 200);
        }

        // Continue spawning
        setInterval(createParticle, CONFIG.particles.spawnInterval);
    }

    // ═══════════════════════════════════════════════════════════════
    // FLOATING RUNES
    // ═══════════════════════════════════════════════════════════════

    function createFloatingRune() {
        if (!chaosMode) return;

        const rune = document.createElement('div');
        rune.className = 'floating-rune';
        rune.textContent = CONFIG.runes.symbols[
            Math.floor(Math.random() * CONFIG.runes.symbols.length)
        ];

        // Random position
        rune.style.left = Math.random() * 100 + 'vw';
        rune.style.fontSize = (18 + Math.random() * 18) + 'px';

        // Random animation duration
        const duration = 15 + Math.random() * 20;
        rune.style.animationDuration = duration + 's, 3s';
        rune.style.animationDelay = Math.random() * 10 + 's';

        document.body.appendChild(rune);

        setTimeout(() => rune.remove(), (duration + 10) * 1000);
    }

    function startFloatingRunes() {
        for (let i = 0; i < CONFIG.runes.count; i++) {
            setTimeout(() => createFloatingRune(), i * 2000);
        }
        setInterval(createFloatingRune, 8000);
    }

    // ═══════════════════════════════════════════════════════════════
    // MOUSE SPARKLE TRAIL
    // ═══════════════════════════════════════════════════════════════

    function createSparkle(x, y) {
        if (!CONFIG.sparkles.enabled || !chaosMode) return;

        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        // Alternate between star and pixel sparkles
        sparkle.classList.add(Math.random() > 0.5 ? 'sparkle-star' : 'sparkle-pixel');

        // Add some randomness to position
        sparkle.style.left = (x + (Math.random() - 0.5) * 20) + 'px';
        sparkle.style.top = (y + (Math.random() - 0.5) * 20) + 'px';

        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), CONFIG.sparkles.lifetime);
    }

    function handleMouseMove(e) {
        const now = Date.now();
        if (now - lastSparkleTime > CONFIG.sparkles.spawnRate) {
            createSparkle(e.clientX, e.clientY);
            lastSparkleTime = now;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CLICK EFFECTS
    // ═══════════════════════════════════════════════════════════════

    function createClickRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        document.body.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    function triggerScreenShake() {
        if (!CONFIG.screenShake.enabled || !chaosMode) return;

        document.body.classList.add('screen-shake');
        setTimeout(() => document.body.classList.remove('screen-shake'), 400);
    }

    function handleClick(e) {
        if (!chaosMode) return;

        createClickRipple(e.clientX, e.clientY);

        // Small chance of screen shake on click
        if (Math.random() < 0.1) {
            triggerScreenShake();
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // KONAMI CODE
    // ═══════════════════════════════════════════════════════════════

    const KONAMI_CODE = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiIndex = 0;

    function handleKonamiKey(e) {
        const key = e.key;

        if (key === KONAMI_CODE[konamiIndex]) {
            konamiIndex++;

            if (konamiIndex === KONAMI_CODE.length) {
                activateKonamiReward();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    }

    function activateKonamiReward() {
        // Flash the screen
        document.body.classList.add('konami-unlocked');
        setTimeout(() => document.body.classList.remove('konami-unlocked'), 500);

        // Show secret message
        const text = document.createElement('div');
        text.className = 'konami-text';
        text.textContent = '🎮 CHAOS MAXIMIZED 🎮';
        document.body.appendChild(text);
        setTimeout(() => text.remove(), 2000);

        // Toggle vaporwave mode
        vaporwaveMode = !vaporwaveMode;
        document.body.classList.toggle('vaporwave-mode', vaporwaveMode);

        // Shake the screen
        triggerScreenShake();

        // Spawn a bunch of sprites at once
        for (let i = 0; i < 10; i++) {
            setTimeout(() => spawnFloatingSprite(), i * 200);
        }

        // Create explosion of particles
        for (let i = 0; i < 50; i++) {
            setTimeout(() => createParticle(), i * 50);
        }

        // Achievement hook
        if (window.achievementHooks?.onKonamiCode) {
            window.achievementHooks.onKonamiCode();
        }

        console.log('🎮 KONAMI CODE ACTIVATED! Vaporwave mode:', vaporwaveMode);
    }

    // ═══════════════════════════════════════════════════════════════
    // CHAOS TOGGLE (now controlled via Sierra Panel)
    // ═══════════════════════════════════════════════════════════════

    // The toggle button is now in the Sierra panel (baseof.html)
    // These functions are called via window.chaos.enable/disable

    // ═══════════════════════════════════════════════════════════════
    // VORTEX BACKGROUND
    // ═══════════════════════════════════════════════════════════════

    function createVortexBackground() {
        const vortex = document.createElement('div');
        vortex.className = 'vortex-bg';
        vortex.id = 'vortex-bg';
        document.body.appendChild(vortex);
    }

    // ═══════════════════════════════════════════════════════════════
    // WEATHER EFFECTS
    // ═══════════════════════════════════════════════════════════════

    let weatherInterval = null;

    function createRainDrop() {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = (0.3 + Math.random() * 0.3) + 's';
        document.body.appendChild(drop);
        setTimeout(() => drop.remove(), 1000);
    }

    function createSnowFlake() {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.style.left = Math.random() * 100 + 'vw';
        flake.style.animationDuration = (4 + Math.random() * 4) + 's';
        flake.style.width = (4 + Math.random() * 4) + 'px';
        flake.style.height = flake.style.width;
        document.body.appendChild(flake);
        setTimeout(() => flake.remove(), 10000);
    }

    function startRain() {
        if (weatherInterval) clearInterval(weatherInterval);
        weatherInterval = setInterval(createRainDrop, 30);
        // Achievement hook
        if (window.achievementHooks?.onWeather) {
            window.achievementHooks.onWeather();
        }
    }

    function startSnow() {
        if (weatherInterval) clearInterval(weatherInterval);
        weatherInterval = setInterval(createSnowFlake, 200);
        // Achievement hook
        if (window.achievementHooks?.onWeather) {
            window.achievementHooks.onWeather();
        }
    }

    function stopWeather() {
        if (weatherInterval) {
            clearInterval(weatherInterval);
            weatherInterval = null;
        }
    }

    // Expose weather functions globally for console fun
    window.chaosWeather = {
        rain: startRain,
        snow: startSnow,
        stop: stopWeather
    };

    // ═══════════════════════════════════════════════════════════════
    // SECRET COMMANDS (Console fun)
    // ═══════════════════════════════════════════════════════════════

    window.chaos = {
        enable: () => {
            chaosMode = true;
            document.body.classList.add('chaos-mode');
            startParticles();
            startFloatingSprites();
            startFloatingRunes();
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('click', handleClick);
            console.log('🌀 CHAOS ENABLED');
        },
        disable: () => {
            chaosMode = false;
            document.body.classList.remove('chaos-mode');
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('click', handleClick);
            console.log('Chaos disabled');
        },
        rainbow: () => {
            rainbowMode = !rainbowMode;
            document.body.classList.toggle('rainbow-mode', rainbowMode);
            console.log('🌈 Rainbow mode:', rainbowMode);
        },
        vaporwave: () => {
            vaporwaveMode = !vaporwaveMode;
            document.body.classList.toggle('vaporwave-mode', vaporwaveMode);
            console.log('📼 Vaporwave mode:', vaporwaveMode);
        },
        shake: triggerScreenShake,
        weather: window.chaosWeather,
        summon: (emoji = '🧙', count = 5) => {
            for (let i = 0; i < count; i++) {
                const sprite = document.createElement('div');
                sprite.className = 'floating-sprite sprite-float-left';
                sprite.textContent = emoji;
                sprite.style.fontSize = '48px';
                sprite.style.top = (10 + Math.random() * 60) + 'vh';
                sprite.style.right = '-60px';
                document.body.appendChild(sprite);
                setTimeout(() => sprite.remove(), 35000);
            }
            // Achievement hook
            if (window.achievementHooks?.onSummon) {
                window.achievementHooks.onSummon();
            }
            console.log(`Summoned ${count} ${emoji}!`);
        },
        help: () => {
            // Achievement hook
            if (window.achievementHooks?.onConsoleHelp) {
                window.achievementHooks.onConsoleHelp();
            }
            console.log(`
🌀 CHAOS GOBLIN CONSOLE COMMANDS 🌀
====================================
chaos.enable()      - Enable chaos mode
chaos.disable()     - Disable chaos mode
chaos.rainbow()     - Toggle rainbow mode
chaos.vaporwave()   - Toggle vaporwave mode
chaos.shake()       - Shake the screen
chaos.weather.rain() - Start rain
chaos.weather.snow() - Start snow
chaos.weather.stop() - Stop weather
chaos.summon('🐉', 10) - Summon 10 dragons

KONAMI CODE: ↑↑↓↓←→←→BA
            `);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        console.log('🌀 Chaos Goblin Mode loaded! Type chaos.help() for commands');

        // Create permanent elements
        createCRTOverlay();
        createVortexBackground();

        // Setup event listeners
        document.addEventListener('keydown', handleKonamiKey);

        // Easter egg hint in console
        console.log('💡 Hint: Try the Konami Code... ↑↑↓↓←→←→BA');
        console.log('📍 Hover at the top of the screen to reveal the control panel!');
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
