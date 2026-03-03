// ABOUTME: Snaps note scroll content height to full tile multiples
// ABOUTME: Prevents partial tile display in tiling scroll backgrounds

(function() {
    // Original tile dimensions
    const TILE_WIDTH = 1331;
    const TILE_HEIGHT = 289;

    function snapScrollHeights() {
        const scrollContents = document.querySelectorAll('.note-scroll .note-content');

        scrollContents.forEach(content => {
            // Get the rendered width to calculate scaled tile height
            const renderedWidth = content.offsetWidth;
            const scaledTileHeight = TILE_HEIGHT * (renderedWidth / TILE_WIDTH);

            // Reset to measure natural height
            content.style.minHeight = 'auto';
            content.style.backgroundPositionY = '0px';
            const naturalHeight = content.scrollHeight;

            // Round up to nearest full tile
            const fullTiles = Math.ceil(naturalHeight / scaledTileHeight);
            const snappedHeight = fullTiles * scaledTileHeight;

            // Set height to show full tiles
            content.style.minHeight = snappedHeight + 'px';
        });
    }

    // Run on load and resize
    document.addEventListener('DOMContentLoaded', snapScrollHeights);
    window.addEventListener('resize', snapScrollHeights);
})();
