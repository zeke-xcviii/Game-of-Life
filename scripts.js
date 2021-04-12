const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const size = 20;
var height = canvas.height;
var width = canvas.width;
var cell = [];
var isPressed = true;
console.log(height + " " + width);
function drawWorld() {
    
    for(let cols = 0; cols < width; cols++) {
        ctx.beginPath();
        ctx.moveTo(cols * size, 0);
        ctx.lineTo(cols * size, height);
        ctx.stroke();
    }
    
   for(let rows = 0; rows < height; rows++) {
        ctx.beginPath();
        ctx.moveTo(0, rows * size);
        ctx.lineTo(width, rows * size);
        ctx.stroke();
    }
}

function populateWorld() {
    
    cell = new Array(Math.floor(width / size)).fill()
    .map(() => new Array(Math.floor(height / size)).fill()
    .map(() => 0/*() => Math.floor(Math.random() * 2)*/));
    console.log(cell);
}

function drawCell() {
    
    for(let cols = 0; cols < width / size; cols++) {
        for(let rows = 0; rows < height / size; rows++) {
            if(cell[cols][rows] == 1) {
                ctx.beginPath();
                ctx.rect(cols * size, rows * size, size, size);
                ctx.fillStyle = 'red';
                ctx.fill();
                ctx.stroke();
            } /* else if (cell[cols][rows] == 0 && isPressed) {
                ctx.clearRect(cols * size, rows * size, size, size);
                isPressed = false;
                ctx.clearRect(0,0,width,height);
                drawWorld();
            } */
        } 
    }
}

function getMousePosition(canvas, event) { 

    let rect = canvas.getBoundingClientRect(); 
    let x = event.pageX - rect.left - scrollX; 
    let y = event.pageY - rect.top - scrollY;
    
    x /= rect.width;
    y /= rect.height;
    
    x *= canvas.width;
    y *= canvas.height;
    
    console.log(x);
    let cls = Math.floor(Math.floor(x/2) / Math.floor(size/2));
    let rws = Math.floor(Math.floor(y/2) / Math.floor(size/2));
    console.log("Coordinate x: " + x,  
                "Coordinate y: " + y);
    
    cell[cls][rws] = 1;
    
    drawCell();
}

canvas.addEventListener("mousedown", (e) => { 
    getMousePosition(canvas, e); 
},false); 

var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

window.addEventListener(orientationEvent, () => {
},false);
drawWorld();
populateWorld();
console.log(width);
