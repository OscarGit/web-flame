let container;
let canvas;
let gc;

let mouseX = 0;
let mouseY = 0;
let prevX = 0;
let prevY = 0;
let onCanvas = false;

let SPAWN_RATE = 2;
let MAX_WIDTH = 1;
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

    loopTimer = setInterval(draw, 0);
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
    prevX = mouseX = e.x;
    prevY = mouseY = e.y;
}
function leave(e) {
    onCanvas = false;
}

function rgb(r, g, b) {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

let draw = function() {
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;

    if (onCanvas) {
        let dX = mouseX - prevX;
        let dY = mouseY - prevY;
        dX /= SPAWN_RATE;
        dY /= SPAWN_RATE;
        for (let i = 0; i < SPAWN_RATE; ++i) {
            system.addParticle(prevX + dX * i, prevY + dY * i);
        }

        prevX = mouseX;
        prevY = mouseY;
    }
    gc.fillStyle = rgb(48, 48, 48);
    gc.fillRect(0, 0, canvas.width, canvas.height);
    system.draw(dt);
};

class ParticleSystem {
    constructor() {
        this.START_RADIUS = 10;
        this.GROW_RADIUS = 0.3;
        this.LIFE_LENGTH = 1;
        this.DT = 0.016;
        this.GRAVITY = 0.05;

        this.particles = [];
    }

    hasParticles() {
        return this.particles.length !== 0;
    }

    addParticle(x, y) {
        this.particles.push({
            x: x,
            y: y,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            r: this.START_RADIUS,
            t: this.LIFE_LENGTH
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
        p.vy -= this.GRAVITY;
        p.r += this.GROW_RADIUS * dt;
        p.t -= this.dt;

        gc.fillStyle = rgb(48 + p.t * 207, 48 + p.t * p.t * 152, 48);
        gc.beginPath();
        gc.ellipse(p.x, p.y, p.r, p.r, 0, 0, Math.PI * 2);
        gc.fill();

        return p.t > 0;
    }
}
