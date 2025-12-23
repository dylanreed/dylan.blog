// ABOUTME: Adds roll-up animation functionality to parchment scrolls
// ABOUTME: Click the bottom frame to roll up, click rolled scroll to unroll

(function() {
    'use strict';

    const scrolls = document.querySelectorAll('.note-scroll');

    if (scrolls.length === 0) return;

    scrolls.forEach(scroll => {
        // Create clickable zone (covers bottom when open, entire scroll when closed)
        const clickZone = document.createElement('div');
        clickZone.className = 'scroll-bottom-clickable';
        clickZone.setAttribute('aria-label', 'Click to roll up scroll');
        clickZone.setAttribute('role', 'button');
        clickZone.setAttribute('tabindex', '0');
        scroll.appendChild(clickZone);

        const content = scroll.querySelector('.note-content');
        const meta = scroll.querySelector('.note-meta');

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
