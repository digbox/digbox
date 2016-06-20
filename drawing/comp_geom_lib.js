/*  ------------------------------------------------------  *
 * A library or visualizing Computational Geometry tools    *
 * including an environment and primitives built with p5.js *
 *  ------------------------------------------------------- *
 * utility functions *
 *  ---------------  */
function squaredDistance(x1, y1, x2, y2) { // component-wise squared distance
    return squaredNorm(x1-x2, y1-y2);
}

function squaredNorm(x, y) { // squared 2-norm of a point
    return x*x + y*y;
}

function ccw(a, b, c) { // counter-clockwise test on vertices
    var o = ((a.y-c.y) * (b.x-c.x) - (a.x-c.x) * (b.y-c.y) >= 0);
    return o;
}
/*  -------------------  *
 * end utility functions *
 *  ----------- */

/*  ------------- *
 * HalfEdge class *
 *  ------------- */
function CG_HalfEdge(vv) {
    this.start = demo.stop;
    // this.start = 0;
    this.stop = Infinity;
    this.prev = null;
    this.next = null;
    this.twin = null;
    this.face = null;
    this.v = vv;
    this.e;
    demo.activeHalfEdge = this;
}

CG_HalfEdge.prototype.draw = function() {
    noFill();
    strokeWeight(2);
    stroke(100,100,200);
    var u = this.twin.v;
    var x1 = this.v.x;
    var x2 = u.x;
    var y1 = this.v.y;
    var y2 = u.y;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var d = sqrt(dx * dx + dy * dy);
    var offset = 4;
    var t = 0.98;
    line(x1 + offset*(dx+dy)/d, y1 + offset*(dy-dx)/d, x1 + offset*dy/d + t*dx, y1 + t*dy - offset*dx/d);
    this.getFace().draw();
};

CG_HalfEdge.prototype.connectTo = function(h) {
    this.next = h;
    h.prev = this;
};

CG_HalfEdge.prototype.detach = function() {
    if (this.v.isLeaf()) {
      this.v.h = null;
    }
    else {
      this.prev.connectTo(this.twin.next);
      this.v.h = this.twin.next;
    }
    if (this.twin.v.isLeaf()) {
      this.twin.v.h = null;
    }
    else {
      this.twin.prev.connectTo(this.next);
      this.twin.v.h = this.next;
    }
};

CG_HalfEdge.prototype.orient = function(q) {
    if (this.next != null) {
        // ANIMATION
        var animation = new CG_Animation(this);
        var o = animation.ccw(this.v, this.next.v, q);
        return o;
        // END ANIMATION
        // return ccw(this.v, this.next.v, q);
    } else return null;
};

CG_HalfEdge.prototype.getCycle = function() {
    var C = new CG_Polygon();
    C.newEdge(this.v, this.next.v)
    s = this.next;
    if (s != null) {
        while (s.v != this.v) {
            C.newEdge(s.v, s.next.v)
            if (s.next == null) {
                return null;
            }
            s = s.next;
        }
        return C;
    } return null;
};

CG_HalfEdge.prototype.vertices = function() {
    var c = this.next;
    var list = [this.v];
    while(c.v != this.v) {
        list.push(c.v);
        c = c.next;
    }
    return list;
};


CG_HalfEdge.prototype.walkFace = function() {
    var c = this.next;
    var list = [this];
    while(c.v != this.v) {
        list.push(c);
        c = c.next;
    }
    return list;
};

CG_HalfEdge.prototype.getFace = function() {
    var cycle = this.getCycle();
    if (cycle == null) {
        return null;
    }
    this.face = new CG_Face(cycle);
    return this.face;
};


// CG_HalfEdge.prototype.inFace = function(v) {
//     var c = this.next;
//     var prev = this.orient(v);
//     var cur = c.orient(v);
//     while ((prev == cur) && (c.v != this.v)) {
//         c = c.next;
//         prev = cur;
//         cur = c.orient(v);
//     }
//     return cur;
// };

CG_HalfEdge.prototype.visible = function(v) {
    if (ccw(this.prev.v, this.v, v) == this.orient(v)) {
        return true;
    }
    return false;
};
/*  ----------  *
 * end HalfEdge *
 *  -------------------  *
 * DynamicPointSet class *
 *  -------------------  */
function CG_DynamicPointSet(){
    this.start = 0;
    this.stop = Infinity;
    this.VertexList = [];
    this.xOffset = 0;
    this.yOffset = 0;
    this.draggingVertex = false; // dragging vertex?
    this.activeVertex = null; // currently active Vertex
    this.updateFunction = null;
}

CG_DynamicPointSet.prototype.draw = function() {
    for(var i = 0; i < this.VertexList.length; i++) {
        this.VertexList[i].draw();
    }
};

CG_DynamicPointSet.prototype.newPoint = function(xx, yy) {
    var currentVertex = new CG_Vertex(xx, yy);
    this.VertexList.push(currentVertex);

    if (this.updateFunction != null) {
        this.updateFunction(currentVertex);
    } else {
        console.log("no update function");
    }

    return currentVertex;
};

CG_DynamicPointSet.prototype.whichVertex = function(w, z) {
    if(this.VertexList.length < 1) { return null; }
    var nearest = null;
    var d_min = 50;
    var d;
    for(var i = 0; i < this.VertexList.length; i++) {
        d = squaredDistance(this.VertexList[i].x, this.VertexList[i].y, w,z);
        if(d < d_min) {
            d_min = d;
            nearest = this.VertexList[i];
        }
    }
    return nearest;
};

CG_DynamicPointSet.prototype.mousePressed = function() {
    // if (this.stop <= frameCount) {
    //     demo.stop = frameCount;
    // }
    var vertex = this.whichVertex(mouseX,mouseY);
    if (vertex == null) {
        this.newPoint(mouseX,mouseY);
    }
};

CG_DynamicPointSet.prototype.mouseDragged = function() {
    if(this.draggingVertex) {
        this.activeVertex.x = mouseX + this.xOffset;
        this.activeVertex.y = mouseY + this.yOffset;
    }
};

CG_DynamicPointSet.prototype.mouseReleased = function() {
    if(this.draggingVertex) {//redundant?
        this.draggingVertex = false;
    }
};
/*  -----------------  *
 * end DynamicPointSet *
 *  -----------------  */

/*  -----------  *
 * Polygon class *
 *  -----------  */
function CG_Polygon(vertices, color) {
    this.start = 0;
    this.stop = Infinity;
    this.color = color;
    this.EdgeList = [];
    this.edges = [];
    this.orient = null;
    if (vertices == null) {
        this.VertexList = [];
    } else {
        this.VertexList = vertices;
        this.buildHull();
    }
}

CG_Polygon.prototype.draw = function() {

    for (var i = 0; i < this.EdgeList.length; i++) {
        var start = this.EdgeList[i].start + demo.animation;
        var stop = this.EdgeList[i].stop + demo.animation;
        if ((start < frameCount) && (frameCount < stop)) {
            this.EdgeList[i].draw();
        }
    }
    // ANIMATION
    if (!demo.animate) {
        for (var i = 0; i < this.EdgeList.length; i++) {
            this.EdgeList[i].draw();
        }
    } else {
        for (var i = 0; i < this.EdgeList.length; i++) {
            var start = this.EdgeList[i].start + demo.animation;
            var stop = this.EdgeList[i].stop + demo.animation;
            if ((start < frameCount) && (frameCount < stop)) {
                this.EdgeList[i].draw();
            }
        }
        for (var i = 0; i < this.edges.length; i++) {
            var start = this.edges[i].start + demo.animation;
            var stop = this.edges[i].stop + demo.animation;
            if ((start < frameCount) && (frameCount < stop)) {
                this.edges[i].draw();
            }
        }
    }
    // END ANIMATION
};

CG_Polygon.prototype.ccw = function(i, j, w) {
    // ANIMATION
    var animation = new CG_Animation(this);
    var o = animation.ccw(this.v(i), this.v(j), w);
    return o;
    // END ANIMATION
    // return ccw(this.v(i), this.v(j), w);
};

CG_Polygon.prototype.newVertex = function(q, i) {
    var edges = [];
    if (i == null) {
        i = this.VertexList.length;
        this.VertexList.push(q);
    } else {
        this.VertexList.splice(i, 0, q);
    }
    var edge = this.getEdge(this.v(i-1), this.v(i+1));
    if (edge != null) {
        if (edge.s == this.v(i-1)) {
            var e = new CG_Edge(edge.s, edge.t);
            e.start = edge.start;
            e.stop = demo.stop;
            this.edges.push(e);
            edge.start = demo.stop;
            edge.t = q;
            edges.push(edge);
            edges.push(this.newEdge(q, this.v(i+1)));
        }
    } else {
        edges.push(this.newEdge(this.v(i-1), q));
        edges.push(this.newEdge(q, this.v(i+1)));
    }
    if (this.VertexList.length == 3) {
        this.orient = ccw(this.VertexList[0], this.VertexList[1], q);
        console.log(this.orient);
        for (var j = 0; j < this.VertexList.length; j++ ) {
            edges.push(this.newEdge(this.v(j), this.v(j+1)));
        }
    }
    return edges;
};

CG_Polygon.prototype.v = function(i) {
    while (i < 0) {
        i = this.VertexList.length + i
    }
    return this.VertexList[i % this.VertexList.length];
};

CG_Polygon.prototype.contains = function(v) {
    for(var i = 0; i < this.VertexList.length; i++) {
        if (this.VertexList[i] == v) {
            return true;
        }
    }
    return false;
};

CG_Polygon.prototype.newEdge = function(s, t, i) {
    var edge = this.getEdge(s,t);
    if (edge != null) {
        return edge;
    }
    if (!this.contains(s)) {
        this.newVertex(s);
    }
    if (!this.contains(t)) {
        this.newVertex(t);
    }
    if (i == null) {
        edge = new CG_Edge(s,t);
        this.EdgeList.push(edge);
    } else {
        edge = new CG_Edge(s,t);
        this.EdgeList.splice(i, 0, edge);
    }
    edge.color = this.color;
    this.edges.push(edge);
    return edge;
};

CG_Polygon.prototype.getEdge = function(s, t) {
    for (var i = 0; i < this.EdgeList.length; i++) {
        if ((this.EdgeList[i].contains(s)) && (this.EdgeList[i].contains(t))) {
            return this.EdgeList[i];
        }
    }
    return null;
};

CG_Polygon.prototype.e = function(i) {
    while (i < 0) {
        i = this.EdgeList.length + i;
    }
    return this.EdgeList[i % this.EdgeList.length];
};

CG_Polygon.prototype.replace = function(q, left, right) {
    // var ret = this.replaceVertices(q, left, right);
    var replacedVertices = this.replaceVertices(q, left, right);
    // var newEdges = ret[1];
    var r = 0;
    for (var i = 0; i < replacedVertices.length; i++) {
        for (var j = 0; j < this.EdgeList.length; j++) {
            if (this.e(j-r).contains(replacedVertices[i])) {
                this.e(j-r).stop = demo.stop;
                // replacedEdges.push(this.e(j-r));
                this.EdgeList.splice(j-r,1);
                r = r + 1;
            }
        }
    }
    return replacedVertices;
};

CG_Polygon.prototype.replaceVertices = function(q, left, right) {
    var k = (left <= right) ? (right - left - 1) : (this.VertexList.length - (left - right) - 1 );
    var i = left + 1;
    var l = i + k;
    var r = l % this.VertexList.length;
    var d = this.VertexList.length-i;
    var edges = [];

    var replaced = [];
    for (var j = i; j < l; j++) {
        replaced.push(this.v(j));
    }
    // ANIMATION
    var animate = [new CG_Vertex(this.v(left).x, this.v(left).y, 'red', 10)];
    // END ANIMATION
    if ( l > this.VertexList.length) {
        // ANIMATION
        for (var j = i-1; j < this.VertexList.length-1; j++) {
            animate.push(new CG_Edge(this.v(j), this.v(j+1), 'red'));
        }
        animate.push(new CG_Edge(this.v(this.VertexList.length-1), this.v(0), 'red'));
        for (var j = 0; j < r; j++) {
            animate.push(new CG_Edge(this.v(j), this.v(j+1), 'red'));
        }
        animate.push(new CG_Vertex(this.v(right).x, this.v(right).y, 'red', 10));
        // END ANIMATION
        this.VertexList.splice(i, k - d);
        this.VertexList.splice(0, r);
        edges.concat(this.newVertex(q, 0));
    } else {
        // ANIMATION
        for (var j = i-1; j < l; j++) {
            animate.push(new CG_Edge(this.v(j), this.v(j+1), 'red'));
        }
        animate.push(new CG_Vertex(this.v(right).x, this.v(right).y, 'red', 10));
        // END ANIMATION
        this.VertexList.splice(i, k);
        edges.concat(this.newVertex(q, i));
    }
    // ANIMATION
    demo.Animations(animate);
    // END ANIMATION
    return replaced;
};
/*  ---------  *
 * Polygon end *
 *  --------  *
 * PSLG class *
 *  --------  */
function CG_PSLG(edges) {
    this.start = 0;
    this.stop = Infinity;
    this.edges = [];
    this.faces = [];
    this.color = null;
    if (edges != null) {
        for (var i = 0; i < edges.length; i++) {
            this.addEdge(edges[i]);
        }
    }
    this.orient;
}

CG_PSLG.prototype.draw = function() {
    if (!demo.animate) {
        for(var i = 0; i < this.edges.length; i++) {
            this.edges[i].draw();
        }
    } else {
        for(var i = 0; i < this.edges.length; i++) {
            var start = this.edges[i].start + demo.animation;
            var stop = this.edges[i].stop + demo.animation;
            if ((start < frameCount) && (frameCount < stop)) {
                this.edges[i].draw();
            }
        }
    }
};

CG_PSLG.prototype.init = function() {
    var u = demo.P.newPoint(-demo.width, -demo.height);
    var v = demo.P.newPoint(demo.width/2, 2*demo.height);
    var w = demo.P.newPoint(2*demo.width,demo.height/5);
    this.orient = ccw(u,v,w);
    this.newEdge(u,v);
    this.newEdge(v,w);
    this.newEdge(w,u);
    return u;
};

CG_PSLG.prototype.getEdge = function(s, t) {
    for (var i = 0; i < this.edges.length; i++) {
        if ((this.edges[i].contains(s)) && (this.edges[i].contains(t))) {
            return this.edges[i];
        }
    }
    return null;
};

CG_PSLG.prototype.newEdge = function(u, v) {
    if (u == v) {
        return null;
    }
    var edge = this.getEdge(u,v);
    if (edge != null) {
        return edge;
    }
    // todo: check if edge already exists.
    var e = new CG_Edge(u, v);
    e.color = this.color;
    this.edges.push(e);
    u.attach(v);
    // this.addFace(u.h.getFace());
    demo.activeHalfEdge = v.h.prev.twin;
    return e;
};

CG_PSLG.prototype.addEdge = function(edge) {
    var exists = this.getEdge(edge.s, edge.t);
    if (exists != null) {
        return exists;
    }
    this.edges.push(edge);
    edge.s.attach(edge.t);
    demo.activeHalfEdge = v.h.prev.twin;
    return edge;
};

CG_PSLG.prototype.inFace = function(h, v) {
    var c = h.next;
    var start = demo.stop;
    var prev = ccw(h.v, h.next.v, v);
    if (prev == this.orient) {
        var cur = c.orient(v);
        while (c != h) {
            if (cur == this.orient) {
                prev = cur;
                c = c.next;
                cur = c.orient(v);
            } else break;
        }
    }
    demo.animations.push(new CG_Animation(c.getFace(), start, demo.stop-start));
    return c;
};

CG_PSLG.prototype.addPolygon = function(H) {
    var edges = H.EdgeList;
    for (var i = 0; i < edges.length; i++) {
        this.newEdge(edges[i].s, edges[i].t);
    }
};

CG_PSLG.prototype.edgesToVertex = function(list, q) {
    for (var i = 0; i < list.length; i++) {
        this.newEdge(list[i], q);
    }
};

CG_PSLG.prototype.addFace = function(f) {
    this.faces.push(f);
    return f;
};

CG_PSLG.prototype.delaunay = function(f, P) {
    // check if any vertices in P are a distance less than the circumradius of f to the circumcenter of f
    //
};
/*  ------- *
 * PSLG end *
 *  ------- */
