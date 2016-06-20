
/*
 *  CG_Environment Class
 */
function CG_Environment(w, h) {
    this.width = w;
    this.height = h;
    this.things = [];
    this.animate = true;
    this.things.push([]);
    // each time the picture changes add it to the filtration
    this.filtration = [ this.things ];
    this.animations = [];
    this.paused = false;
    this.d = 15;
    this.buffer = 0;
    this.stop = 0;
    this.animation = 0;
    this.P;
    this.activeHalfEdge = null;
}

CG_Environment.prototype.pause = function() {
    noLoop();
    this.paused = true;
};

CG_Environment.prototype.play = function() {
    loop();
    this.animation = 0;
    this.paused = false;
};

CG_Environment.prototype.rewind = function() {
    // this.pause();
    // if (frameCount > this.stop + this.animation) {
    //     this.animation = frameCount - this.stop - 5;
    // }
    if (this.animation + this.d < this.stop) {
        this.pause();
        this.animation = this.animation + this.d;
    } else {
        this.animation = this.stop;
    }
    redraw();
};

CG_Environment.prototype.fforward = function() {
    // if (this.animation+this.stop > frameCount) {
    //     this.animation = this.animation - this.d;
    // }
    if (this.animation - this.d > 0) {
        this.animation = this.animation - this.d;
    } else {
        this.play();
    }
    redraw();

};

CG_Environment.prototype.keyPressed = function() {
    if (keyCode == 81) { this.pause(); }
    else if (keyCode == 87) { this.play(); }
    else if (keyCode == 65) { this.rewind(); }
    else if (keyCode == 83) { this.fforward(); }
    else { this.play(); }
    if (this.stop <= frameCount) {
        if(keyCode == 80) { this.activeHalfEdge = this.activeHalfEdge.prev; }
        if(keyCode == 78) { this.activeHalfEdge = this.activeHalfEdge.next; }
        if(keyCode == 84) { this.activeHalfEdge = this.activeHalfEdge.twin; }
    }
};

// CG_Environment.Object functions add START/STOP properties
CG_Environment.prototype.Vertex = function(x,y) {
    var v = new CG_Vertex(x,y);
    // v.start = 0;
    this.things[0].push(v);
    return v;
};

CG_Environment.prototype.DynamicPointSet = function() {
    var P = new CG_DynamicPointSet();
    this.things[0].push(P);
    return P;
};

CG_Environment.prototype.Edge = function(u,v) {
    if (this.things.length < 2) {
        this.things.push([]);
    }
    var e = new CG_Edge(u,v);
    // e.start = 0;
    this.things[1].push(e);
    return e;
};

CG_Environment.prototype.Polygon = function() {
    if (this.things.length < 2) {
        this.things.push([]);
    }
    var H = new CG_Polygon();
    // H.start = 0;
    this.things[1].push(H);
    return H;
};

CG_Environment.prototype.PSLG = function() {
    if (this.things.length < 2) {
        this.things.push([]);
    }
    var G = new CG_PSLG();
    // G.start = 0;
    this.things[1].push(G);
    return G;
};

CG_Environment.prototype.Face = function(C) {
    if (this.things.length < 2) {
        this.things.push([]);
    }
    if (this.things.length < 3) {
        this.things.push([]);
    }
    var f = new CG_Face(C);
    // f.start = 0;
    this.things[2].push(f);
    return f;
}

CG_Environment.prototype.initWalk = function(G) {
    var u = this.P.newPoint(-this.width, -this.height);
    var v = this.P.newPoint(this.width/2, 2*this.height);
    var w = this.P.newPoint(2*this.width,this.height/5);
    G.orient = ccw(u,v,w);
    G.newEdge(u,v);
    G.newEdge(v,w);
    G.newEdge(w,u);
    return u;
};

CG_Environment.prototype.draw = function() {
    // this.stop = frameCount;
    for (var i = 0; i < this.things.length; i++) {
        for (var j = 0; j < this.things[i].length; j++) {
            this.drawThing(this.things[this.things.length-i-1][j]);
        }
    }
    // ANIMATION
    if (this.animate) {
        for (var i = 0; i < this.animations.length; i++) {
            // need to clear animations when a new point is added
            this.drawThing(this.animations[i]);
        }
    }
    // END ANIMATION
    if (this.activeHalfEdge != null) {
        this.drawThing(this.activeHalfEdge);
    }
    if (this.stop + this.d < frameCount) {
        this.stop = frameCount;
        this.pause();
    }
};

CG_Environment.prototype.drawThing = function(thing){
    if (thing != null) {
        if (this.animate) {
            var start = thing.start + this.animation;
            var stop = thing.stop + this.animation;
            if ((start < frameCount) && (frameCount < stop)) {
                thing.draw();
            }
        } else {
            thing.draw();
        }
    }
};

// ANIMATION
CG_Environment.prototype.Animations = function(objs) {
    if (this.stop < frameCount) {
        this.stop = frameCount;
    }
    for (var i = 0; i < objs.length; i++){
        this.animations.push(new CG_Animation(objs[i], this.stop, this.d));
    }
    this.stop = this.stop + this.d;
    return this.stop;
}
// END ANIMATION

// ANIMATION
function CG_Animation(obj, t, d) {
    this.object = obj;
    this.start = t;
    this.stop = t + d;
    this.drawn = true;
}

CG_Animation.prototype.draw = function() {
    this.object.draw();
};

CG_Animation.prototype.ccw = function(a, b, c) {
    var o = ccw(a, b, c);
    var color;
    if (o) { color = 'green' }
    else { color = 'red'; }
    var v1 = new CG_Vertex(a.x, a.y, color, 10);
    var e11 = new CG_Edge(a, b, color);
    var e12 = new CG_Edge(b, c, color);
    var e13 = new CG_Edge(c, a, color);
    demo.Animations([e11, e12, e13, v1]);
    return o;
};

/*
 *  Stuff that's actually running!
 */
var demo = new CG_Environment(400,400);

function setup() {
    createCanvas(demo.width, demo.height);
}

function draw() {
    background(255);
    demo.draw();
}

function keyPressed() {
    // console.log('hello');
    // if (keyCode == 81) { demo.pause(); }
    // if (keyCode == 87) { demo.play(); }
    // if (keyCode == 65) { demo.rewind(); }
    // if (keyCode == 83) { demo.fforward(); }
    demo.keyPressed();
}

function mousePressed() {
    demo.play();
    if (demo.P != null) {
        // if (demo.stop + demo.d <= frameCount) {
        //     demo.stop = frameCount;
        // // if (demo.paused) {
        //     // demo.play();
        // }
        demo.P.mousePressed();
    }
}
function mouseDragged() { if((demo.P != null) && (!demo.paused)) demo.P.mouseDragged(); }
function mouseReleased() { if((demo.P != null) && (!demo.paused)) demo.P.mouseReleased(); }
