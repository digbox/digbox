/*  ----------  *
 * Vertex class *
 *  ----------- */
function CG_Vertex(u, v, color, size){
   this.start = demo.stop;
   // this.start = 0;
   this.stop = Infinity;
   this.x = u;
   this.y = v;
   this.next = null;
   this.prev = null;
   this.h = null;
   if (color != null) {
       this.color = color;
   } else { this.color = 0; }
   if (size != null) {
       this.size = size;
   } else { this.size = 4; }
   // this.attach(this);
}

CG_Vertex.prototype.draw = function() {
   fill(this.color);
   noStroke();
   ellipse(this.x,this.y,this.size,this.size);
};

CG_Vertex.prototype.handle = function(u) {
   if (this.isIsolated() || this.isLeaf()) { return this.h; }
   var h1 = this.h;
   var h2 = this.h.prev.twin;
   while (!this.ordered(h1.twin.v,u,h2.twin.v)) {
       h1 = h2;
       h2 = h1.prev.twin;
   };
   return h1;
};

CG_Vertex.prototype.isIsolated = function() {
   return (this.h == null);
};

CG_Vertex.prototype.isLeaf = function() {
   return (!this.isIsolated()) && (this.h.twin == this.h.prev);
};

CG_Vertex.prototype.ordered = function(a, b, c) {
   var I   = ccw(a,b, this);
   var II  = ccw(b,c, this);
   var III = ccw(c,a, this);
   return ((I && (II || III)) || (II && III)); // at least two must be true
};

CG_Vertex.prototype.attach = function(v) {
   var h1 = new CG_HalfEdge(this);
   var h2 = new CG_HalfEdge(v);
   h1.twin = h2;
   h2.twin = h1;
   if (this.h == null) {
       h2.connectTo(h1);
       this.h = h1;
   }
   if (v.h == null) {
       h1.connectTo(h2);
       v.h = h2;
   }
   var sh = this.handle(v);
   var th = v.handle(this);
   sh.prev.connectTo(h1);
   th.prev.connectTo(h2);
   h2.connectTo(sh);
   h1.connectTo(th);
   // h1.getFace();
   // h2.getFace();
};

CG_Vertex.prototype.reconnect = function() {
   var nbrs = [];
   while(!this.isIsolated()) {
     nbrs.push(this.h.twin.v);
     this.h.detach();
   }
   for (var i = 0; i < nbrs.length; i++) { this.attach(v, nbrs[i]); }
};

/*  --------  *
* end Vertex *
*  --------  *
* Edge class *
*  --------  */
function CG_Edge(ss, tt, color) {
   this.start = demo.stop;
   // this.start = 0;
   this.stop = Infinity;
   this.s = ss;
   this.t = tt;
   this.color = color;
}

CG_Edge.prototype.draw = function() {
   noFill();
   strokeWeight(2);
   if ( this.color != null) {
       stroke(this.color);
   } else {
       stroke(256,150,150);
   }
   line(this.s.x, this.s.y, this.t.x, this.t.y);
};

CG_Edge.prototype.lineside = function(q) {
    return ccw(this.u, this.v, q);
};

CG_Edge.prototype.contains = function(q) {
    if ((this.s == q) || (this.t == q)) {
        return true;
    } else {
        return false;
    }
};

// CG_Edge.prototype.attach = function() {
//    var h1 = new CG_HalfEdge(this.s);
//    var h2 = new CG_HalfEdge(this.t);
//    h1.e = this;
//    h2.e = this;
//    h1.twin = h2;
//    h2.twin = h1;
//    if (this.s.h == null) {
//        h2.connectTo(h1);
//        this.s.h = h1;
//    }
//    if (this.t.h == null) {
//        h1.connectTo(h2);
//        this.t.h = h2;
//    }
//    var sh = this.s.handle(this.t);
//    var th = this.t.handle(this.s);
//    sh.prev.connectTo(h1);
//    th.prev.connectTo(h2);
//    h2.connectTo(sh);
//    h1.connectTo(th);
// };
/*  ------- *
 * end Edge *
 *  --------- *
 * Face class *
 *  --------  */
function CG_Face(C) {
    this.start = demo.stop;
    // this.start = 0;
    this.stop = Infinity;
    this.color = 'gray';
    this.B = C;
    this.V = C.VertexList;
    // this.orient = C.orient(0,1,this.V[2]);
}

CG_Face.prototype.draw = function() {
    noStroke();
    fill(100, 204, 255, 80);
    beginShape();
    for (var i = 0; i < this.V.length; i++) {
        vertex(this.V[i].x, this.V[i].y);
    }
    endShape(CLOSE);
    tint(255,255);
};

CG_Face.prototype.inFace = function(q) {

};

CG_Face.prototype.circumcenter = function() {

};

CG_Face.prototype.circumradius = function() {

};

// CG_Face.prototype.fetchVertices()
/*  ------  *
 * end Face *
 * -------  */
