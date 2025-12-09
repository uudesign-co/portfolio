/*
    UU Design - Audio/Visual System Background
    Concept: Audio (Waves) carrying raw data (File Extensions).
*/

const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// === Configuration ===
const moveSpeed = 0.4; // Slightly slower for better readability
const extensions = [
    '.WAV', '.MP3', '.AI', '.PSD', '.AE', 
    '.SVG', '.PNG', '.JPG', '.PDF', '.MP4', '.MOV',
    '.HTML', '.CSS', '.JS'
];

// Determine particle count based on screen width to avoid crowding
const getParticleCount = () => {
    return window.innerWidth < 768 ? 6 : 12;
};

// Wave Config (The "Audio" Signal)
const waves = [
    { y: 0.5, amplitude: 50, length: 0.005, speed: 0.02, offset: 0 },
    { y: 0.5, amplitude: 30, length: 0.01, speed: 0.015, offset: 2 },
    { y: 0.5, amplitude: 70, length: 0.003, speed: 0.01, offset: 4 }
];

// === Resize Handling ===
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles(); // Re-distribute on resize
}
window.addEventListener('resize', resize);


// === Text Particle Class (DISTRIBUTED SYSTEM) ===
class TextParticle {
    constructor(index, totalParticles) {
        this.index = index;
        // Evenly space them out across the screen width
        this.x = (width / totalParticles) * index;
        
        // Assign a UNIQUE extension based on index (No duplicates on screen)
        this.text = extensions[index % extensions.length];
        
        this.resetParams();
    }

    resetParams() {
        // Randomize wave layer and vertical offset
        this.waveIndex = Math.floor(Math.random() * waves.length);
        this.offsetY = (Math.random() - 0.5) * 50; 
        
        // Low speed variance to keep them from bunching up too quickly
        this.speed = moveSpeed + (Math.random() * 0.1);
        this.opacity = 0.2 + (Math.random() * 0.3); 
    }

    update() {
        this.x += this.speed;

        // If it goes off screen right, wrap around to the left
        if (this.x > width + 50) {
            this.x = -50;
            // We do NOT change the text here, ensuring uniqueness remains
            this.resetParams();
        }
    }

    draw(isDark, time) {
        const w = waves[this.waveIndex];
        const waveY = (height * w.y) + Math.sin(this.x * w.length + time * w.speed + w.offset) * w.amplitude;
        const y = waveY + this.offsetY;

        ctx.font = '12px "Space Mono", monospace';
        ctx.fillStyle = isDark 
            ? `rgba(255, 255, 255, ${this.opacity})` 
            : `rgba(30, 30, 30, ${this.opacity})`;
        ctx.fillText(this.text, this.x, y);
    }
}

// === Initialize Particles ===
function initParticles() {
    particles = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
        particles.push(new TextParticle(i, count));
    }
}

// Initial setup
resize(); 

// === Draw Wave Function ===
function drawWaves(isDark, time) {
    const waveColor = isDark ? 'rgba(0, 174, 239, 0.3)' : 'rgba(0, 174, 239, 0.2)'; 
    
    waves.forEach(wave => {
        ctx.beginPath();
        ctx.strokeStyle = waveColor;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < width; x++) {
            const y = (height * wave.y) + Math.sin(x * wave.length + time * wave.speed + wave.offset) * wave.amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    });
}

// === Animation Loop ===
let time = 0;
function animate() {
    ctx.clearRect(0, 0, width, height);
    
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    time++;

    drawWaves(isDark, time);

    particles.forEach(p => {
        p.update();
        p.draw(isDark, time);
    });

    requestAnimationFrame(animate);
}

animate();

// ==========================================
// BLUEPRINT MODAL LOGIC 
// ==========================================
const modal = document.getElementById('blueprint-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.getElementById('modal-close');
const triggers = document.querySelectorAll('.zoomable');

if (triggers.length > 0) {
    triggers.forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            modalImg.classList.add('rotate-vertical');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });
    });

    const closeModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modalImg.src = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// ==========================================
// MOBILE MENU LOGIC
// ==========================================
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconMenu = document.getElementById('icon-menu');
const iconClose = document.getElementById('icon-close');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        const isClosed = mobileMenu.classList.contains('hidden');
        
        if (isClosed) {
            // OPEN
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            
            // Small delay to allow display:flex to apply
            setTimeout(() => {
                mobileMenu.classList.remove('opacity-0');
                mobileMenu.classList.add('opacity-100');
            }, 10);
            
            // Swap Icons
            iconMenu.classList.add('hidden');
            iconClose.classList.remove('hidden');
            
            // Lock Scroll
            document.body.style.overflow = 'hidden';
            
        } else {
            // CLOSE
            mobileMenu.classList.remove('opacity-100');
            mobileMenu.classList.add('opacity-0');
            
            // Wait for transition
            setTimeout(() => {
                mobileMenu.classList.remove('flex');
                mobileMenu.classList.add('hidden');
            }, 300);
            
            // Swap Icons
            iconMenu.classList.remove('hidden');
            iconClose.classList.add('hidden');
            
            // Unlock Scroll
            document.body.style.overflow = '';
        }
    });

    // Close on Link Click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('opacity-100');
            mobileMenu.classList.add('opacity-0');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                mobileMenu.classList.remove('flex');
                mobileMenu.classList.add('hidden');
            }, 300);
            
            iconMenu.classList.remove('hidden');
            iconClose.classList.add('hidden');
        });
    });
}