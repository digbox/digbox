// this algorithm dynamically computes the convex hull of a point set.
demo.animate = true;
demo.P = demo.DynamicPointSet();
var H = demo.Polygon();
var G = demo.PSLG();

// dynamically compute the convex hull of the point set
demo.P.updateFunction = function(q) {
  if (H.VertexList.length < 2) {
    H.newVertex(q);
    H.buildHull();
    return;
  }
  var left = -1, right = -1;
  var prev = H.orient(-1, 0, q), current;
  for (var i = 0; i < H.VertexList.length; i++) {
    current = H.orient(i, i+1, q);
    if (!prev && current) { right = i; }
    if (prev && !current) { left = i; }
    prev = current;
  }
  // if q is outside the hull remove vertices and insert q
  if (left != -1 && right != -1) {
    var replaced = H.replace(q, left, right);
  }
  // var edges = H.buildHull();
  // var G = demo.PSLG(edges);
};
