// ABOUTME: Adds roll-up animation functionality to parchment scrolls
// ABOUTME: Click the bottom frame to roll up, click rolled scroll to unroll

(function() {
    'use strict';

    // Disable roll-up functionality on mobile/touch devices
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isMobile || isTouch) return;

    const scrolls = document.querySelectorAll('.note-scroll');

    if (scrolls.length === 0) return;

    // Get storage key for current page
    const pageKey = 'scroll_states_' + window.location.pathname;

    // Load saved states for this page (sessionStorage clears on hard reload)
    function loadStates() {
        try {
            return JSON.parse(sessionStorage.getItem(pageKey)) || {};
        } catch (e) {
            return {};
        }
    }

    // Save states for this page
    function saveStates(states) {
        sessionStorage.setItem(pageKey, JSON.stringify(states));
    }

    const savedStates = loadStates();

    scrolls.forEach((scroll, index) => {
        // Set z-index so later notes stack on top (prevents click zone conflicts)
        scroll.style.zIndex = 10 + index;

        // Create clickable zone (covers bottom when open, entire scroll when closed)
        const clickZone = document.createElement('div');
        clickZone.className = 'scroll-bottom-clickable';
        clickZone.setAttribute('aria-label', 'Click to roll up scroll');
        clickZone.setAttribute('role', 'button');
        clickZone.setAttribute('tabindex', '0');
        scroll.appendChild(clickZone);

        const content = scroll.querySelector('.note-content');
        const meta = scroll.querySelector('.note-meta');

        // Restore saved state
        if (savedStates[index] === true) {
            scroll.classList.add('rolled-up');
            clickZone.setAttribute('aria-label', 'Click to unroll scroll');
        }

        // Toggle roll state
        const toggleRoll = () => {
            const isRolledUp = scroll.classList.contains('rolled-up');

            if (isRolledUp) {
                // Unroll - remove rolled-up class first, then clear inline styles
                scroll.classList.remove('rolled-up');

                // Clear any inline styles that might interfere
                if (content) {
                    content.style.maxHeight = '';
                    content.style.padding = '';
                    content.style.margin = '';
                    content.style.opacity = '';
                }
                if (meta) {
                    meta.style.maxHeight = '';
                    meta.style.padding = '';
                    meta.style.margin = '';
                    meta.style.opacity = '';
                }
                scroll.style.height = '';
                scroll.style.marginTop = '';

                clickZone.setAttribute('aria-label', 'Click to roll up scroll');

                // Save unrolled state
                const states = loadStates();
                delete states[index];
                saveStates(states);
            } else {
                // Roll up - set current height explicitly first for smooth animation
                if (content) {
                    // Force a reflow to ensure the height is set before we animate
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.offsetHeight; // Trigger reflow
                }
                if (meta) {
                    meta.style.maxHeight = meta.scrollHeight + 'px';
                    meta.offsetHeight; // Trigger reflow
                }

                // Now add rolled-up class which will animate to 0
                scroll.classList.add('rolled-up');
                clickZone.setAttribute('aria-label', 'Click to unroll scroll');

                // Save rolled-up state
                const states = loadStates();
                states[index] = true;
                saveStates(states);

                // Trigger achievement on first roll
                if (window.achievementHooks?.onScrollRolled) {
                    window.achievementHooks.onScrollRolled();
                }
            }
        };

        clickZone.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleRoll();
        });

        // Keyboard support
        clickZone.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleRoll();
            }
        });
    });
})();
