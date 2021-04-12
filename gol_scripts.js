
let animation = function() {
    'use strict';
    var a = this;
    
    a.init = function() {
        a.run = false;
        a.frameCount = 0;
        a.fpsInterval;
        a.startTime;
        a.now;
        a.then;
        a.elapsed;
    }
    
    a.startAnimating = function(fps) {
        a.fpsInterval = 1000 / fps;
        a.then = window.performance.now();
        a.startTime = a.then;
        a.animate();
    }
    
    a.animate = function() {
        if(a.run) {
        
        a.now = window.performance.now();
        a.elapsed = a.now - a.then;
        if (a.elapsed > a.fpsInterval) {
            a.then = a.now - (a.elapsed % a.fpsInterval);
            document.getElementById('res').innerHTML = ++a.frameCount;
            game_of_life.simulate();
        }
            requestAnimationFrame(a.animate);
        } else {
            a.frameCount = 0;
            cancelAnimationFrame(a.animate);
        }
        
    }
    
    a.init();
}

var anime = new animation();

let GOL = function() {
    
    'use strict';
    var t = this;
    var m = Math;
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    
    t.init = function() {
        t.run = false;
        t.size = 20;
        t.height = canvas.height;
        t.width = canvas.width;
        t.cols = m.floor(t.width / t.size);
        t.rows = m.floor(t.height / t.size);
        t.neighbors = [
            [-1,-1], //Top-left
            [0,-1],  //Top
            [1,-1],  //Top-right
            [-1,0],  //Left
            [1,0],   //Right
            [-1,1],  //Bottom-left
            [0,1],   //Bottom
            [1,1]    //Bottom-right
        ];
        t.generations;
        t.drawWorld();
        t.fillWorld(t.cols,t.rows);
        t.aliveCell();
    }
    
    t.fillWorld = function(cols,rows) {
        t.generations = new Array(cols).fill()
        .map(() => new Array(rows).fill()
        .map(() => 0));
    }
    
    t.drawWorld = function() {
        context.beginPath();
        for(let x = 0; x < t.cols; x++) {
            context.moveTo(x*t.size, 0);
            context.lineTo(x*t.size, t.height);
        }
        
        for(let y = 0; y < t.rows; y++) {
            context.moveTo(0, y*t.size);
            context.lineTo(t.width, y*t.size);
        }
        context.strokeStyle = '#F6F6F6';
        context.stroke();
    }
    
    t.aliveCell = function() {
        context.beginPath();
        for(let i = 0; i < t.cols; i++) {
            for(let j = 0; j < t.rows; j++) {
                if(t.generations[i][j] == 1) {
                    context.rect(i*t.size, j*t.size, t.size, t.size);
                    context.fillStyle = '#0E0E0E'
                    context.fill();
                }
            }
        }
    }
    
    t.simulate = function() {
        /*let txtarea = document.getElementById('txtt');
        t.generations.forEach(([a,b,c,d,e,f,g,h,i,j,
                                a1,b1,c1,d1,e1,f1,g1,h1,i1,j1,
                                a2,b2,c2,d2,e2,f2,g2,h2,i2,j2,
                                a3,b3,c3,d3,e3,f3,g3,h3,i3,j3]) => {
            txtarea.value += "[" + a + ", " + b + ", " + c + ", " + d + ", " + e + ", " + f + ", " + g + ", " + h + ", " + i + ", " + j
                     + ", " + a1 + ", " + b1 + ", " + c1 + ", " + d1 + ", " + e1 + ", " + f1 + ", " + g1 + ", " + h1 + ", " + i1 + ", " + j1 
                     + ", " + a2 + ", " + b2 + ", " + c2 + ", " + d2 + ", " + e2 + ", " + f2 + ", " + g2 + ", " + h2 + ", " + i2 + ", " + j2 
                     + ", " + a3 + ", " + b3 + ", " + c3 + ", " + d3 + ", " + e3 + ", " + f3 + ", " + g3 + ", " + h3 + ", " + i3 + ", " + j3 + "],\n"; });
        */
        if(t.run){
            let nextGen = t.generations.map((arr) => [...arr]);
            for(let i = 0; i < t.cols; i++) {
                for(let j = 0; j < t.rows; j++) {
                    let sum = 0;
                    t.neighbors.forEach(([x,y]) => {
                        let inx = i + x;
                        let iny = j + y;
                        if(inx >= 0 && iny >= 0 && inx < t.cols && iny < t.rows) {
                            sum += t.generations[inx][iny];
                        }
                    });
                    if(t.generations[i][j] === 1 && (sum < 2 || sum > 3)) {
                        nextGen[i][j] = 0;
                    } else if(t.generations[i][j] === 0 && sum === 3) {
                        nextGen[i][j] = 1
                    }
                }
            }
            t.generations = nextGen;
            t.clearWorld();
            t.aliveCell();
            //t.drawWorld();
          }
    }
    
    t.clearWorld = function() {
        context.clearRect(0,0,t.width,t.height);
    }
    
    t.getMousePosition = function(e) {
        let bounds = canvas.getBoundingClientRect();
        let x = e.pageX - bounds.left - scrollX;
        let y = e.pageY - bounds.top - scrollY;
        
        x /= bounds.width;
        y /= bounds.height;
        
        x *= t.width;
        y *= t.height;
        
        let inx = m.floor(m.floor(x/2) / m.floor(t.size/2));
        let iny = m.floor(m.floor(y/2) / m.floor(t.size/2));
        
        t.generations[inx][iny] = t.generations[inx][iny] ? 0 : 1;
        t.clearWorld();
        t.aliveCell();
        t.drawWorld();
    }
    
    canvas.addEventListener("mousedown", (e) => {
        t.getMousePosition(e);
    });
    
    let btn = document.getElementById('btn');
    
    btn.onclick = () => {
        
        if(!t.run) {
            btn.innerHTML = "Stop";
            t.run = true;
            anime.run = true;
            anime.startAnimating(5);
        } else {
            btn.innerHTML = "Start";
            t.run = false;
            anime.run = false;
            t.drawWorld();
        }
    }
    
    let e = document.getElementById('pattern');
    
    e.onchange = () => {
        let selected = e.selectedIndex;
        switch(selected) {
            case 1:
                t.fillWorld(t.cols, t.rows);
                break;
            case 2:
                t.generations = GLIDER;
                break;
            case 3:
                t.generations = LWS;
                break;
            case 4:
                t.generations = PUFFER;
                break;
            case 5:
                t.generations = GLIDERGUN;
                break;
            case 6:
                t.generations = CENTINAL;
                break;
            
        }
        e.selectedIndex = 0;
        t.clearWorld();
        t.aliveCell();
        t.drawWorld();
    }
    
    t.init();
}

let game_of_life = new GOL();