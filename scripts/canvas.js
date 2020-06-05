(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();

// Terrain stuff.
var background = document.getElementById("bgCanvas"),
    lightMode = document.getElementById("light-mode").innerText.split(" "),
    nightMode = document.getElementById("night-mode").innerText.split(" "),
    bgCtx = background.getContext("2d"),
    width = window.innerWidth,
    height = document.body.offsetHeight;

// DEFAULT MODE
var colorMode = nightMode;

(height < 400) ? height = 400 : height;

background.width = width;
background.height = height;

function modeSwitch() {
    if(colorMode == lightMode)
        colorMode = nightMode;
    else
        colorMode = lightMode;
    
    updateTerrain()
}

function Terrain(options) {
    options = options || {};
    this.terrain = document.createElement("canvas");
    this.terCtx = this.terrain.getContext("2d");
    this.scrollDelay = options.scrollDelay || 90;
    this.lastScroll = new Date().getTime();

    this.terrain.width = width;
    this.terrain.height = height;
    this.fillStyle = options.fillStyle || colorMode[3];
    this.mHeight = options.mHeight || height;

    // generate
    this.points = [];

    var displacement = options.displacement || 140,
        power = Math.pow(2, Math.ceil(Math.log(width) / (Math.log(2))));

    // set the start height and end height for the terrain
    this.points[0] = this.mHeight;//(this.mHeight - (Math.random() * this.mHeight / 2)) - displacement;
    this.points[power] = this.points[0];

    // create the rest of the points
    for (var i = 1; i < power; i *= 2) {
        for (var j = (power / i) / 2; j < power; j += power / i) {
            this.points[j] = ((this.points[j - (power / i) / 2] + this.points[j + (power / i) / 2]) / 2) + Math.floor(Math.random() * -displacement + displacement);
        }
        displacement *= 0.6;
    }

    document.body.appendChild(this.terrain);
}

Terrain.prototype.update = function () {
    // draw the terrain
    this.terCtx.clearRect(0, 0, width, height);
    this.terCtx.fillStyle = this.fillStyle;
    
    if (new Date().getTime() > this.lastScroll + this.scrollDelay) {
        this.lastScroll = new Date().getTime();
        this.points.push(this.points.shift());
    }

    this.terCtx.beginPath();
    for (var i = 0; i <= width; i++) {
        if (i === 0) {
            this.terCtx.moveTo(0, this.points[0]);
        } else if (this.points[i] !== undefined) {
            this.terCtx.lineTo(i, this.points[i]);
        }
    }

    this.terCtx.lineTo(width, this.terrain.height);
    this.terCtx.lineTo(0, this.terrain.height);
    this.terCtx.lineTo(0, this.points[0]);
    this.terCtx.fill();
}


// Second canvas used for the stars
bgCtx.fillRect(0, 0, width, height);

// stars
function Star(options) {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = options.x;
    this.y = options.y;
}

Star.prototype.reset = function () {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = width;
    this.y = Math.random() * height;
}

Star.prototype.update = function () {
    this.x -= this.speed;
    if (this.x < 0) {
        this.reset();
    } else {
        bgCtx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function ShootingStar() {
    this.reset();
}

ShootingStar.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = 0;
    this.len = (Math.random() * 80) + 10;
    this.speed = (Math.random() * 10) + 6;
    this.size = (Math.random() * 1) + 0.1;
    // this is used so the shooting stars arent constant
    this.waitTime = new Date().getTime() + (Math.random() * 3000) + 500;
    this.active = false;
}

ShootingStar.prototype.update = function () {
    if (this.active) {
        this.x -= this.speed;
        this.y += this.speed;
        if (this.x < 0 || this.y >= height) {
            this.reset();
        } else {
            bgCtx.lineWidth = this.size;
            bgCtx.beginPath();
            bgCtx.moveTo(this.x, this.y);
            bgCtx.lineTo(this.x + this.len, this.y - this.len);
            bgCtx.stroke();
        }
    } else {
        if (this.waitTime < new Date().getTime()) {
            this.active = true;
        }
    }
}

let entities = [];

function environment(){
    // init the stars
    for (var i = 0; i < height; i++) {
        entities.push(new Star({
            x: Math.random() * width,
            y: Math.random() * height
        }));
    }

    // Add 2 shooting stars that just cycle.
    entities.push(new ShootingStar());
    entities.push(new ShootingStar());
    entities.push(new Terrain({mHeight : (height/2)-120}));
    entities.push(new Terrain({displacement : 120, scrollDelay : 50, fillStyle : colorMode[2], mHeight : (height/2)-60}));
    entities.push(new Terrain({displacement : 100, scrollDelay : 20, fillStyle : colorMode[1], mHeight : height/2}));
}

environment();

function updateTerrain(){
    entities[entities.length-1].fillStyle = colorMode[1]
    entities[entities.length-2].fillStyle = colorMode[2]
    entities[entities.length-3].fillStyle = colorMode[3]
}

// ICON CHANGING
var night = true;
moonPath = "M9 15.033C9 23.3172 15 30.033 15 30.033C6.71573 30.033 0 23.3172 0 15.033C0 6.74869 6.71573 0.032959 15 0.032959C15 0.032959 9 6.74869 9 15.033Z";
sunPath = "M30 15.033C30 23.3172 23.2843 30.033 15 30.033C6.71573 30.033 0 23.3172 0 15.033C0 6.74869 6.71573 0.032959 15 0.032959C23.2843 0.032959 30 6.74869 30 15.033Z";

$('.mode-switch').click(
    function(){
        const timeline = anime.timeline({
            duration: 750,
            easing: "easeOutExpo"
        });
        
        // IF IT'S NIGHT TIME => CHANGE TO DAY TIME
        if (night){
            anime({
                targets: 'body',
                backgroundColor: '#008000'
            })
            timeline
            // CHANGE BUTTON COLOR
            .add({
                targets: '.mode-switch',
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }, '-= 500')
            // CHANGE ICON
            .add({
                targets: '.sun-moon',
                d: [{value: moonPath}]
            }, '-= 250')
            // ROTATE ICON
            .add({
                targets: '.mode',
                rotate: 360,
            }, '-= 350');

            night = false
        }
        // IF IT'S DAY TIME => CHANGE TO NIGHT TIME
        else{
            anime({
                targets: 'body',
                backgroundColor: '#0a0a05',
            })
            timeline
            // CHANGE BUTTON COLOR
            .add({
                targets: '.mode-switch',
                backgroundColor: 'rgba(255, 255, 255, 0.5)'
            }, '-= 500')
            // CHANGE ICON
            .add({
                targets: '.sun-moon',
                d: [{value: sunPath}]
            }, '-= 250')
            // ROTATE ICON
            .add({
                targets: '.mode',
                rotate: 0
            }, '-= 350');
            
            night = true
        }    
    }
)

//animate background
function animate() {
    bgCtx.fillStyle = colorMode[0];
    bgCtx.fillRect(0, 0, width, height);
    bgCtx.fillStyle = colorMode[4];
    bgCtx.strokeStyle = colorMode[4];

    var entLen = entities.length;
    var cnt = 0
    while (entLen--) {
        entities[entLen].update();
    }
    requestAnimationFrame(animate);
}
animate();



