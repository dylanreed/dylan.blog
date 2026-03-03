// ABOUTME: JavaScript for Pixel Pusher 3000 launch website
// ABOUTME: Handles 3D sprite carousel rotation and sprite loading

const SPRITES = [
  'anchor-pirate.png',
  'arcade-cabinet.png',
  'astronaut.png',
  'balloon.png',
  'baseball.png',
  'beans-many.png',
  'bee.png',
  'bicycle.png',
  'bigfoot.png',
  'birthday-cake.png',
  'boombox.png',
  'bus.png',
  'butterfly.png',
  'campfire.png',
  'candy.png',
  'cannon.png',
  'capybara.png',
  'car.png',
  'cassette-tape.png',
  'castle.png',
  'cat.png',
  'cheese-wheel.png',
  'chicken.png',
  'christmas-tree.png',
  'cloud.png',
  'computer.png',
  'cookie.png',
  'cool-s.png',
  'cow.png',
  'cowboy-hat.png',
  'crab.png',
  'crown.png',
  'cupcake.png',
  'dog.png',
  'donut.png',
  'dragon.png',
  'elephant.png',
  'eyepatch.png',
  'floppy-disk.png',
  'football.png',
  'forest.png',
  'ghost.png',
  'guitar.png',
  'hammer.png',
  'headphones.png',
  'hook.png',
  'ice-cream-sundae.png',
  'ladybug.png',
  'lawn-flamingo.png',
  'lightning-bolt.png',
  'lion.png',
  'loch-ness-monster.png',
  'lollipop.png',
  'moon.png',
  'mothman.png',
  'motorcycle.png',
  'mountain.png',
  'octopus.png',
  'owl.png',
  'pacman-ghost.png',
  'parrot-pirate.png',
  'party-hat.png',
  'pie-slice.png',
  'pig.png',
  'pirate-hat.png',
  'pirate-ship.png',
  'pumpkin.png',
  'rabbit.png',
  'rocket-space.png',
  'roomba.png',
  'rubber-duck-sunglasses.png',
  'rubiks-cube.png',
  'rv.png',
  'santa-hat.png',
  'saturn.png',
  'scooter.png',
  'screaming-possum.png',
  'shark.png',
  'single-sock.png',
  'skull-crossbones.png',
  'soda.png',
  'spider.png',
  'star-nature.png',
  'sun-nature.png',
  'sunflower.png',
  't-pose.png',
  'tent.png',
  'this-is-fine-dog.png',
  'traffic-cone.png',
  'treasure-chest.png',
  'treasure-map.png',
  'tree.png',
  'truck.png',
  'ufo-space.png',
  'unicorn.png',
  'vinyl-record.png',
  'wacky-waving-tube-man.png',
  'windows-error.png',
  'wizard-hat.png',
  'wrench.png'
];

// Shuffle array for variety
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Sprite data for animation
let spriteData = [];
let rotation = 0;
let isPaused = false;
let lastTime = 0;

// Size ratios: back sprites are smaller, front sprites are larger
const MIN_SCALE = 0.5;  // Back sprites (z = -radius)
const MAX_SCALE = 1.5;  // Front sprites (z = +radius)

// Create the 3D carousel
function initCarousel() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  // Pick 50 random sprites for the carousel
  const selectedSprites = shuffle(SPRITES).slice(0, 50);
  const numSprites = selectedSprites.length;
  const radius = 400; // Distance from center - orbiting around logo

  // Create Y offset slots to ensure vertical separation
  // Divide into rows and assign sprites to prevent overlap
  const numRows = 6;
  const rowHeight = 120; // Vertical spacing between rows
  const yStart = -300; // Start position (above center)

  // Distribute sprites across rows - each row gets ~5 sprites
  const spritesPerRow = Math.ceil(numSprites / numRows);

  selectedSprites.forEach((sprite, index) => {
    const img = document.createElement('img');
    img.src = `assets/clipart/${sprite}`;
    img.alt = sprite.replace('.png', '').replace(/-/g, ' ');
    img.className = 'sprite';

    // Calculate row and position within row
    const row = Math.floor(index / spritesPerRow);
    const posInRow = index % spritesPerRow;

    // Angle: offset each row so sprites don't line up vertically
    const rowAngleOffset = (row / numRows) * Math.PI * 0.5; // Stagger rows
    const angle = (posInRow / spritesPerRow) * Math.PI * 2 + rowAngleOffset;

    // Y offset based on row with small random variation
    const yOffset = yStart + (row * rowHeight) + (Math.random() - 0.5) * 40;

    // Speed variation: 10% slow, 10% fast, 80% normal
    const speedRoll = Math.random();
    let speed;
    if (speedRoll < 0.1) {
      speed = 0.5 + Math.random() * 0.25; // 0.5 - 0.75x (slow)
    } else if (speedRoll < 0.2) {
      speed = 1.25 + Math.random() * 0.25; // 1.25 - 1.5x (fast)
    } else {
      speed = 1.0; // Normal speed
    }

    // Vertical bob parameters
    const bobPhase = Math.random() * Math.PI * 2; // Random starting phase
    const bobSpeed = 0.3 + Math.random() * 0.2; // 0.3 - 0.5 (varied bob speeds)
    const bobAmount = 15 + Math.random() * 15; // 15 - 30px amplitude

    spriteData.push({
      element: img,
      baseAngle: angle,
      yOffset: yOffset,
      radius: radius,
      speed: speed,
      bobPhase: bobPhase,
      bobSpeed: bobSpeed,
      bobAmount: bobAmount
    });

    carousel.appendChild(img);
  });

  // Start animation loop
  requestAnimationFrame(animate);
}

// Animation loop - sprites always face forward (time-based for smooth movement)
function animate(currentTime) {
  // Calculate delta time in seconds
  if (!lastTime) lastTime = currentTime;
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (!isPaused) {
    rotation += 0.12 * deltaTime; // Rotation speed (radians per second)
  }

  // Track total time for vertical bobbing
  const totalTime = currentTime / 1000;

  spriteData.forEach(sprite => {
    const currentAngle = sprite.baseAngle + (rotation * sprite.speed);
    const x = Math.sin(currentAngle) * sprite.radius;
    const z = Math.cos(currentAngle) * sprite.radius;

    // Vertical bobbing
    const bob = Math.sin(totalTime * sprite.bobSpeed + sprite.bobPhase) * sprite.bobAmount;
    const y = sprite.yOffset + bob;

    // Scale based on z position (depth)
    // z ranges from -radius to +radius
    // Map to MIN_SCALE to MAX_SCALE
    const normalizedZ = (z + sprite.radius) / (sprite.radius * 2); // 0 to 1
    const scale = MIN_SCALE + normalizedZ * (MAX_SCALE - MIN_SCALE);

    // Opacity based on depth - back sprites are more faded
    const opacity = 0.4 + normalizedZ * 0.6; // 0.4 to 1.0

    // Z-index based on depth
    const zIndex = Math.floor(normalizedZ * 100);

    sprite.element.style.transform = `
      translateX(${x}px)
      translateY(${y}px)
      translateZ(${z}px)
      scale(${scale})
    `;
    sprite.element.style.opacity = opacity;
    sprite.element.style.zIndex = zIndex;
  });

  requestAnimationFrame(animate);
}

// Pause rotation on hover
function setupHoverPause() {
  const carousel = document.getElementById('carousel');
  if (!carousel) return;

  carousel.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  carousel.addEventListener('mouseleave', () => {
    isPaused = false;
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  setupHoverPause();
});
