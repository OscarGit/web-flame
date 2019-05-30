let container;
let canvas;
let gc;

let mouseX = 0;
let mouseY = 0;
let prevX = 0;
let prevY = 0;
let spawnAccu = 0;
let onCanvas = false;

let SPAWN_RATE = 150;
let MAX_SPEED = 12;
let MAX_WIDTH = 1;
let FPS = 60;
let START_RADIUS = 10;
let GROW_RADIUS = 60;
let LIFE_LENGTH = 1;
let GRAVITY = 700;
let MAX_START_VEL = 150;

let system;
let loopTimer;
let lastUpdate;

window.onload = function() {
    container = document.getElementById('container');
    canvas = document.getElementById('canvas');
    gc = canvas.getContext('2d');

    system = new ParticleSystem();

    window.addEventListener('resize', windowResize);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseenter', enter);
    canvas.addEventListener('mouseleave', leave);
    windowResize();

    loopTimer = setInterval(draw, 1000 / FPS);
    lastUpdate = Date.now();
};

function windowResize() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
}
function move(e) {
    onCanvas = true;
    mouseX = e.x;
    mouseY = e.y;
}
function enter(e) {
    onCanvas = true;
}
function leave(e) {
    onCanvas = false;
}

function rgb(r, g, b) {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

let draw = function() {
    var now = Date.now();
    var dt = (now - lastUpdate) * 0.001;
    lastUpdate = now;

    if (!onCanvas) {
        mouseX = canvas.width * 0.5;
        mouseY = canvas.height * 0.8;
    }
    let dX = mouseX - prevX;
    let dY = mouseY - prevY;
    let len = Math.sqrt(dX * dX + dY * dY);
    let lenInv = 0;
    if (len > 0) lenInv = 1 / len;
    dX *= lenInv;
    dY *= lenInv;
    spawnAccu += SPAWN_RATE * dt;
    while (spawnAccu >= 1) {
        system.addParticle(prevX, prevY);
        spawnAccu -= 1;
    }
    prevX += dX * MAX_SPEED * dt * len;
    prevY += dY * MAX_SPEED * dt * len;
    gc.fillStyle = rgb(48, 48, 48);
    gc.fillRect(0, 0, canvas.width, canvas.height);
    system.draw(dt);
};

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    hasParticles() {
        return this.particles.length !== 0;
    }

    addParticle(x, y) {
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() * 2 - 1) * MAX_START_VEL,
            vy: (Math.random() * 2 - 1) * MAX_START_VEL,
            r: START_RADIUS,
            t: LIFE_LENGTH
        });
    }

    draw(dt) {
        for (let i = 0; i < this.particles.length; i++) {
            if (!this.updateParticle(this.particles[i], dt)) {
                this.particles.splice(i--, 1);
            }
        }
    }

    updateParticle(p, dt) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy -= GRAVITY * FPS * dt * dt;
        p.r += GROW_RADIUS * dt;
        p.t -= dt;

        gc.fillStyle = rgb(48 + p.t * 207, 48 + p.t * p.t * 152, 48);
        gc.beginPath();
        gc.ellipse(p.x, p.y, p.r, p.r, 0, 0, Math.PI * 2);
        gc.fill();

        return p.t > 0;
    }
}
