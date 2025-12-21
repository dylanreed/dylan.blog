// ABOUTME: Achievement system for the chaos goblin blog
// ABOUTME: Tracks user interactions and rewards exploration with pixel art badges

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // ACHIEVEMENT DEFINITIONS
    // ═══════════════════════════════════════════════════════════════

    const ACHIEVEMENTS = {
        // === DISCOVERY ===
        first_visit: {
            id: 'first_visit',
            name: 'Welcome, Traveler',
            description: 'Visit the blog for the first time',
            icon: '🏠',
            category: 'discovery',
            secret: false,
            points: 10
        },
        night_owl: {
            id: 'night_owl',
            name: 'Night Owl',
            description: 'Switch to night mode',
            icon: '🦉',
            category: 'discovery',
            secret: false,
            points: 10
        },
        early_bird: {
            id: 'early_bird',
            name: 'Early Bird',
            description: 'Switch back to day mode',
            icon: '🐦',
            category: 'discovery',
            secret: false,
            points: 10
        },
        chaos_curious: {
            id: 'chaos_curious',
            name: 'Chaos Curious',
            description: 'Activate chaos mode for the first time',
            icon: '🌀',
            category: 'discovery',
            secret: false,
            points: 25
        },

        // === EXPLORATION ===
        bookworm: {
            id: 'bookworm',
            name: 'Bookworm',
            description: 'Read 5 different posts',
            icon: '📚',
            category: 'exploration',
            secret: false,
            points: 25,
            requirement: 5
        },
        scholar: {
            id: 'scholar',
            name: 'Scholar',
            description: 'Read 15 different posts',
            icon: '🎓',
            category: 'exploration',
            secret: false,
            points: 50,
            requirement: 15
        },
        archivist: {
            id: 'archivist',
            name: 'Archivist',
            description: 'Visit the archive page',
            icon: '📜',
            category: 'exploration',
            secret: false,
            points: 15
        },
        photographer: {
            id: 'photographer',
            name: 'Photographer',
            description: 'Visit the photos page',
            icon: '📸',
            category: 'exploration',
            secret: false,
            points: 15
        },
        curious_cat: {
            id: 'curious_cat',
            name: 'Curious Cat',
            description: 'Visit the about page',
            icon: '🐱',
            category: 'exploration',
            secret: false,
            points: 15
        },
        category_hopper: {
            id: 'category_hopper',
            name: 'Category Hopper',
            description: 'Visit 3 different category pages',
            icon: '🏷️',
            category: 'exploration',
            secret: false,
            points: 30,
            requirement: 3
        },
        deep_diver: {
            id: 'deep_diver',
            name: 'Deep Diver',
            description: 'Scroll to the bottom of a long page',
            icon: '🤿',
            category: 'exploration',
            secret: false,
            points: 15
        },

        // === INTERACTION ===
        clicker: {
            id: 'clicker',
            name: 'Clicker',
            description: 'Click 50 times',
            icon: '👆',
            category: 'interaction',
            secret: false,
            points: 15,
            requirement: 50
        },
        click_master: {
            id: 'click_master',
            name: 'Click Master',
            description: 'Click 500 times',
            icon: '🖱️',
            category: 'interaction',
            secret: false,
            points: 50,
            requirement: 500
        },
        marathon_reader: {
            id: 'marathon_reader',
            name: 'Marathon Reader',
            description: 'Stay on the site for 5 minutes',
            icon: '⏱️',
            category: 'interaction',
            secret: false,
            points: 30,
            requirement: 300 // seconds
        },
        dedicated_fan: {
            id: 'dedicated_fan',
            name: 'Dedicated Fan',
            description: 'Stay on the site for 15 minutes',
            icon: '💜',
            category: 'interaction',
            secret: false,
            points: 75,
            requirement: 900
        },

        // === CHAOS ===
        rainbow_warrior: {
            id: 'rainbow_warrior',
            name: 'Rainbow Warrior',
            description: 'Activate rainbow mode',
            icon: '🌈',
            category: 'chaos',
            secret: false,
            points: 30
        },
        konami_master: {
            id: 'konami_master',
            name: 'Konami Master',
            description: 'Enter the legendary code',
            icon: '🎮',
            category: 'chaos',
            secret: true,
            points: 100
        },
        vaporwave_aesthetic: {
            id: 'vaporwave_aesthetic',
            name: 'A E S T H E T I C',
            description: 'Experience vaporwave mode',
            icon: '📼',
            category: 'chaos',
            secret: true,
            points: 50
        },
        weather_wizard: {
            id: 'weather_wizard',
            name: 'Weather Wizard',
            description: 'Make it rain or snow',
            icon: '🌧️',
            category: 'chaos',
            secret: true,
            points: 40
        },
        summoner: {
            id: 'summoner',
            name: 'Summoner',
            description: 'Summon creatures via the console',
            icon: '🧙',
            category: 'chaos',
            secret: true,
            points: 50
        },
        particle_lord: {
            id: 'particle_lord',
            name: 'Particle Lord',
            description: 'Have 100 particles on screen at once',
            icon: '✨',
            category: 'chaos',
            secret: true,
            points: 40
        },

        // === SECRET ===
        midnight_visitor: {
            id: 'midnight_visitor',
            name: 'Midnight Visitor',
            description: 'Visit the blog between midnight and 1am',
            icon: '🌙',
            category: 'secret',
            secret: true,
            points: 75
        },
        triple_threat: {
            id: 'triple_threat',
            name: 'Triple Threat',
            description: 'Triple-click something',
            icon: '3️⃣',
            category: 'secret',
            secret: true,
            points: 25
        },
        completionist: {
            id: 'completionist',
            name: 'Completionist',
            description: 'Unlock all other achievements',
            icon: '👑',
            category: 'secret',
            secret: true,
            points: 500
        },
        console_cowboy: {
            id: 'console_cowboy',
            name: 'Console Cowboy',
            description: 'Use the chaos.help() command',
            icon: '🤠',
            category: 'secret',
            secret: true,
            points: 30
        },
        speed_reader: {
            id: 'speed_reader',
            name: 'Speed Reader',
            description: 'Visit 5 pages in under 30 seconds',
            icon: '⚡',
            category: 'secret',
            secret: true,
            points: 40
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    const STORAGE_KEY = 'dylan_blog_achievements';
    const STATS_KEY = 'dylan_blog_stats';

    let state = {
        unlocked: {},
        stats: {
            clicks: 0,
            postsRead: [],
            categoriesVisited: [],
            pagesVisited: [],
            pageVisitTimes: [],
            sessionStart: Date.now(),
            totalTimeSpent: 0
        }
    };

    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                state.unlocked = JSON.parse(saved);
            }

            const stats = localStorage.getItem(STATS_KEY);
            if (stats) {
                const parsed = JSON.parse(stats);
                state.stats = { ...state.stats, ...parsed };
            }

            state.stats.sessionStart = Date.now();
        } catch (e) {
            console.error('Failed to load achievements:', e);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.unlocked));
            localStorage.setItem(STATS_KEY, JSON.stringify(state.stats));
        } catch (e) {
            console.error('Failed to save achievements:', e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // ACHIEVEMENT UNLOCKING
    // ═══════════════════════════════════════════════════════════════

    function unlock(achievementId) {
        if (state.unlocked[achievementId]) return false;

        const achievement = ACHIEVEMENTS[achievementId];
        if (!achievement) return false;

        state.unlocked[achievementId] = {
            unlockedAt: Date.now()
        };

        saveState();
        showToast(achievement);
        updatePanel();

        // Check for completionist
        checkCompletionist();

        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
        return true;
    }

    function isUnlocked(achievementId) {
        return !!state.unlocked[achievementId];
    }

    function checkCompletionist() {
        const totalAchievements = Object.keys(ACHIEVEMENTS).length;
        const unlockedCount = Object.keys(state.unlocked).length;

        // -1 because completionist itself doesn't count
        if (unlockedCount >= totalAchievements - 1 && !isUnlocked('completionist')) {
            unlock('completionist');
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // TOAST NOTIFICATIONS
    // ═══════════════════════════════════════════════════════════════

    function showToast(achievement) {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <div class="achievement-toast-icon">${achievement.icon}</div>
            <div class="achievement-toast-content">
                <div class="achievement-toast-title">🏆 Achievement Unlocked!</div>
                <div class="achievement-toast-name">${achievement.name}</div>
                <div class="achievement-toast-desc">${achievement.description}</div>
                <div class="achievement-toast-points">+${achievement.points} pts</div>
            </div>
        `;

        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('achievement-toast-show');
        });

        // Remove after animation
        setTimeout(() => {
            toast.classList.remove('achievement-toast-show');
            toast.classList.add('achievement-toast-hide');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    // ═══════════════════════════════════════════════════════════════
    // ACHIEVEMENT PANEL
    // ═══════════════════════════════════════════════════════════════

    let panelOpen = false;

    function createPanel() {
        const panel = document.createElement('div');
        panel.className = 'achievement-panel';
        panel.id = 'achievement-panel';

        updatePanelContent(panel);

        document.body.appendChild(panel);

        // Create toggle button
        const toggle = document.createElement('button');
        toggle.className = 'achievement-toggle';
        toggle.id = 'achievement-toggle';
        toggle.innerHTML = '🏆';
        toggle.title = 'View Achievements';
        toggle.addEventListener('click', togglePanel);
        document.body.appendChild(toggle);
    }

    function updatePanelContent(panel) {
        if (!panel) panel = document.getElementById('achievement-panel');
        if (!panel) return;

        const categories = ['discovery', 'exploration', 'interaction', 'chaos', 'secret'];
        const unlockedCount = Object.keys(state.unlocked).length;
        const totalCount = Object.keys(ACHIEVEMENTS).length;
        const totalPoints = Object.keys(state.unlocked).reduce((sum, id) => {
            return sum + (ACHIEVEMENTS[id]?.points || 0);
        }, 0);

        let html = `
            <div class="achievement-panel-header">
                <h2>🏆 Achievements</h2>
                <div class="achievement-panel-stats">
                    <span>${unlockedCount}/${totalCount} Unlocked</span>
                    <span>${totalPoints} Points</span>
                </div>
                <button class="achievement-panel-close" onclick="window.achievementPanel.close()">✕</button>
            </div>
            <div class="achievement-panel-content">
        `;

        for (const category of categories) {
            const categoryAchievements = Object.values(ACHIEVEMENTS).filter(a => a.category === category);
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

            html += `<div class="achievement-category">
                <h3>${categoryName}</h3>
                <div class="achievement-grid">`;

            for (const achievement of categoryAchievements) {
                const unlocked = isUnlocked(achievement.id);
                const showDetails = unlocked || !achievement.secret;

                html += `
                    <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
                        <div class="achievement-icon">${showDetails ? achievement.icon : '❓'}</div>
                        <div class="achievement-info">
                            <div class="achievement-name">${showDetails ? achievement.name : '???'}</div>
                            <div class="achievement-desc">${showDetails ? achievement.description : 'Secret achievement'}</div>
                        </div>
                        <div class="achievement-points">${achievement.points} pts</div>
                    </div>
                `;
            }

            html += `</div></div>`;
        }

        html += `</div>`;
        panel.innerHTML = html;
    }

    function updatePanel() {
        updatePanelContent();
        updateToggleBadge();
    }

    function updateToggleBadge() {
        const toggle = document.getElementById('achievement-toggle');
        if (!toggle) return;

        const unlockedCount = Object.keys(state.unlocked).length;
        const totalCount = Object.keys(ACHIEVEMENTS).length;

        // Show count badge
        let badge = toggle.querySelector('.achievement-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'achievement-badge';
            toggle.appendChild(badge);
        }
        badge.textContent = unlockedCount;
    }

    function togglePanel() {
        panelOpen = !panelOpen;
        const panel = document.getElementById('achievement-panel');
        if (panel) {
            panel.classList.toggle('open', panelOpen);
        }
    }

    // Expose panel controls
    window.achievementPanel = {
        open: () => {
            panelOpen = true;
            document.getElementById('achievement-panel')?.classList.add('open');
        },
        close: () => {
            panelOpen = false;
            document.getElementById('achievement-panel')?.classList.remove('open');
        },
        toggle: togglePanel
    };

    // ═══════════════════════════════════════════════════════════════
    // TRACKING & TRIGGERS
    // ═══════════════════════════════════════════════════════════════

    function trackPageVisit() {
        const path = window.location.pathname;
        const now = Date.now();

        // Track for speed reader
        state.stats.pageVisitTimes.push(now);
        state.stats.pageVisitTimes = state.stats.pageVisitTimes.filter(t => now - t < 30000);

        if (state.stats.pageVisitTimes.length >= 5 && !isUnlocked('speed_reader')) {
            unlock('speed_reader');
        }

        // Track posts read
        if (path.match(/^\/\d{4}\/\d{2}\/\d{2}\//)) {
            if (!state.stats.postsRead.includes(path)) {
                state.stats.postsRead.push(path);
                saveState();

                if (state.stats.postsRead.length >= 5) unlock('bookworm');
                if (state.stats.postsRead.length >= 15) unlock('scholar');
            }
        }

        // Track category pages
        if (path.startsWith('/categories/')) {
            const category = path.split('/')[2];
            if (category && !state.stats.categoriesVisited.includes(category)) {
                state.stats.categoriesVisited.push(category);
                saveState();

                if (state.stats.categoriesVisited.length >= 3) unlock('category_hopper');
            }
        }

        // Specific page achievements
        if (path.includes('archive')) unlock('archivist');
        if (path.includes('photo')) unlock('photographer');
        if (path.includes('about')) unlock('curious_cat');
    }

    function trackClicks() {
        document.addEventListener('click', () => {
            state.stats.clicks++;
            saveState();

            if (state.stats.clicks >= 50) unlock('clicker');
            if (state.stats.clicks >= 500) unlock('click_master');
        });

        // Triple click detection
        let clickCount = 0;
        let clickTimer = null;

        document.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);

            if (clickCount >= 3) {
                unlock('triple_threat');
                clickCount = 0;
            }

            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);
        });
    }

    function trackTime() {
        setInterval(() => {
            const elapsed = Math.floor((Date.now() - state.stats.sessionStart) / 1000);

            if (elapsed >= 300) unlock('marathon_reader');
            if (elapsed >= 900) unlock('dedicated_fan');
        }, 10000);
    }

    function trackScroll() {
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (scrollPercent > 0.95) {
                unlock('deep_diver');
            }
        });
    }

    function trackMidnight() {
        const hour = new Date().getHours();
        if (hour === 0) {
            unlock('midnight_visitor');
        }
    }

    function trackThemeChanges() {
        // Watch for night class changes
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'class') {
                    const isNight = document.body.classList.contains('night');
                    if (isNight) {
                        unlock('night_owl');
                    } else if (isUnlocked('night_owl')) {
                        unlock('early_bird');
                    }
                }
            }
        });

        observer.observe(document.body, { attributes: true });
    }

    function trackChaosMode() {
        // Watch for chaos-mode class
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'class') {
                    if (document.body.classList.contains('chaos-mode')) {
                        unlock('chaos_curious');
                    }
                    if (document.body.classList.contains('rainbow-mode')) {
                        unlock('rainbow_warrior');
                    }
                    if (document.body.classList.contains('vaporwave-mode')) {
                        unlock('vaporwave_aesthetic');
                    }
                }
            }
        });

        observer.observe(document.body, { attributes: true });
    }

    // ═══════════════════════════════════════════════════════════════
    // CHAOS.JS INTEGRATION HOOKS
    // ═══════════════════════════════════════════════════════════════

    // These get called from chaos.js
    window.achievementHooks = {
        onKonamiCode: () => unlock('konami_master'),
        onWeather: () => unlock('weather_wizard'),
        onSummon: () => unlock('summoner'),
        onConsoleHelp: () => unlock('console_cowboy'),
        onParticleCount: (count) => {
            if (count >= 100) unlock('particle_lord');
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════

    window.achievements = {
        unlock,
        isUnlocked,
        getAll: () => ACHIEVEMENTS,
        getUnlocked: () => state.unlocked,
        getStats: () => state.stats,
        getPoints: () => Object.keys(state.unlocked).reduce((sum, id) => {
            return sum + (ACHIEVEMENTS[id]?.points || 0);
        }, 0),
        reset: () => {
            if (confirm('Reset all achievements? This cannot be undone!')) {
                state.unlocked = {};
                state.stats = {
                    clicks: 0,
                    postsRead: [],
                    categoriesVisited: [],
                    pagesVisited: [],
                    pageVisitTimes: [],
                    sessionStart: Date.now(),
                    totalTimeSpent: 0
                };
                saveState();
                updatePanel();
                console.log('Achievements reset!');
            }
        },
        help: () => {
            console.log(`
🏆 ACHIEVEMENT COMMANDS 🏆
==========================
achievements.getAll()      - See all achievements
achievements.getUnlocked() - See unlocked achievements
achievements.getPoints()   - Get total points
achievements.getStats()    - See tracking stats
achievements.reset()       - Reset all progress

Total achievements: ${Object.keys(ACHIEVEMENTS).length}
Your unlocked: ${Object.keys(state.unlocked).length}
Your points: ${window.achievements.getPoints()}
            `);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    function init() {
        console.log('🏆 Achievement system loaded! Type achievements.help() for commands');

        loadState();
        createPanel();
        updateToggleBadge();

        // First visit achievement
        if (!isUnlocked('first_visit')) {
            setTimeout(() => unlock('first_visit'), 1500);
        }

        // Start tracking
        trackPageVisit();
        trackClicks();
        trackTime();
        trackScroll();
        trackMidnight();
        trackThemeChanges();
        trackChaosMode();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
