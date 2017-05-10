sigma.classes.graph.addMethod('neighbors', function(nodeId) {
  var k,
  neighbors = {},
  index = this.allNeighborsIndex[nodeId] || {};

  for (k in index)
    neighbors[k] = this.nodesIndex[k];

  return neighbors;
});

sigma.classes.graph.addMethod('hideNames', function() {
  var nodes = this.nodes().forEach(function(n){
    if(n.type == 'names') {
      n.hidden = true;
    };
  });
});

var s = new sigma({
  renderers: [
    {
      container: document.getElementById('container'),
      type: 'canvas'
    }
  ]});

sigma.parsers.json(
  'data/data.json',
  s,
  function () {
    s.graph.nodes().forEach(function(node, i, a){
        node.x = Math.cos(Math.PI * 2 * i / a.length);
        node.y = Math.sin(Math.PI * 2 * i / a.length);
        node.originalColor = node.color;
    });

    s.graph.edges().forEach(function(edge) {
      edge.originalColor = edge.color;
    });

    s.graph.hideNames();

    s.refresh();

    s.startForceAtlas2();
    setTimeout(function () {
      console.log('stopping')
      s.stopForceAtlas2()
      }, 10000)

    s.settings({
        edgeColor: 'default',
        defaultEdgeArrow: 'source',
        enableEdgeHovering: true,
        edgeHoverSizeRatio: 5
    });

  }
);

s.bind('clickNode', function(e) {
  s.graph.hideNames();

  var nodeId = e.data.node.id;
  var toKeep = s.graph.neighbors(nodeId);

  toKeep[nodeId] = e.data.node;

  s.graph.nodes().forEach(function(n) {
    if (toKeep[n.id]){
      n.hidden = false;
    }
  });

  s.refresh();
});
