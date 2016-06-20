  // dynamically triangulates a point set within a triangular boundary
// use the keys n, p, and t to traverse the triangulation by half edge
demo.P = demo.DynamicPointSet();
var G = demo.PSLG();
G.init();

demo.P.updateFunction = function(q) {
  var s = demo.activeHalfEdge;
  var c = G.inFace(s, q), t;
  // ifFace returns input half-edge iff q is in the face defined by h
  while (c.v != s.v) {
    t = c.twin;
    c = G.inFace(t, q);
    s = t;
  }
  G.edgesToVertex(c.vertices(), q);
};
