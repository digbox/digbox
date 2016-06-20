  // dynamically computes the convex hull of a point set.
demo.P = demo.DynamicPointSet();
var G = demo.PSLG();
var H = demo.Polygon();

demo.P.updateFunction = function(q) {
    if (H.VertexList.length < 2) {
      H.newVertex(q);
    }
    var left = -1, right = -1;
    var prev = H.ccw(-1, 0, q), current;
    for (var i = 0; i < H.VertexList.length; i++) {
      current = H.ccw(i, i+1, q);
      if (!prev && current) { right = i; }
      if (prev && !current) { left = i; }
      prev = current;
    }
    if (left != -1 && right != -1) {
      G.edgesToVertex(H.replace(q, left, right),q);
      G.addPolygon(H);
  }
};
