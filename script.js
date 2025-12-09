/*
    UU Design - Audio/Visual System Background
    Concept: Audio (Waves) carrying raw data (File Extensions).
*/

const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// === Configuration ===
const moveSpeed = 0.5;
const extensions = [
    '.WAV', '.MP3', '.AI', '.PSD', '.AE', 
    '.SVG', '.PNG', '.JPG', '.PDF', '.MP4', '.MOV',
    '.HTML', '.CSS', '.JS'
];

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
}
window.addEventListener('resize', resize);
resize();

// === Text Particle Class ===
class TextParticle {
    constructor() {
        this.reset();
        this.x = Math.random() * width; 
    }

    reset() {
        this.x = -50; 
        this.text = extensions[Math.floor(Math.random() * extensions.length)];
        this.waveIndex = Math.floor(Math.random() * waves.length);
        this.offsetY = (Math.random() - 0.5) * 40; 
        this.speed = moveSpeed + (Math.random() * 0.2);
        this.opacity = 0.1 + (Math.random() * 0.3); 
    }

    update() {
        this.x += this.speed;
        if (this.x > width + 50) this.reset();
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
for (let i = 0; i < 20; i++) {
    particles.push(new TextParticle());
}

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
// BLUEPRINT MODAL LOGIC (New Addition)
// ==========================================
const modal = document.getElementById('blueprint-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.getElementById('modal-close');
const triggers = document.querySelectorAll('.zoomable');

// Open Modal
triggers.forEach(img => {
    img.addEventListener('click', () => {
        modalImg.src = img.src;
        // Apply rotation class to flip it vertical
        modalImg.classList.add('rotate-vertical');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });
});

// Close Modal Function
const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    modalImg.src = ''; // Clear source
};

// Close Triggers
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', closeModal); // Close on background click
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});