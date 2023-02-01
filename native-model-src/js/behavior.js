import Graph from './index.js'
const { graph, height, width,nodes,edges,nodeMap,gColors,edgesMap,showNodes,showEdges } = Graph
let curShowNodes = [];
let curShowEdges = [];
let curShowNodesMap = new Map();
let highlighting = false;
let currentFocus;
function refreshDragedNodePosition(e) {
  const model = e.item.get('model');
  model.fx = e.x;
  model.fy = e.y;
}
graph.on('node:dragstart', (e) => {
  graph.layout();
  refreshDragedNodePosition(e);
});
graph.on('node:drag', (e) => {
  refreshDragedNodePosition(e);
});
graph.on('node:dragend', (e) => {
  e.item.get('model').fx = null;
  e.item.get('model').fy = null;
});
graph.on('node:mouseenter', (e) => {

  const item = e.item;
  const model = item.getModel();
  const model1 = item.getEdges();

  if (model.level === 0) {
    return;
  }
  highlighting = true;
  graph.setAutoPaint(false);
  const nodeItems = graph.getNodes();
  const edgeItems = graph.getEdges();
  nodeItems.forEach((node) => {
    graph.setItemState(node, 'dark', true);
    node.getModel().light = false;
  });
  graph.setItemState(item, 'dark', false);
  model.light = true;
  const tags = model.tags;
  const findTagsMap = new Map();
  let mid = 0;

  let fTag = '';
  // 如果模型是不是叶子节点，求其叶节点
  if (!model.isLeaf && model.level !== 0) {
    fTag = model.tag;
    nodeItems.forEach((item) => {
      const itemModel = item.getModel();
      if (!itemModel.isLeaf) return;
      const modelTags = itemModel.tags;
      modelTags.forEach((mt) => {
        const mts = mt.split('-');
        if (mts[1] === fTag) {
          graph.setItemState(item, 'dark', false);
          itemModel.light = true;
        }
      });
    });
  }

  // 找到标签
  tags.forEach((t) => {
    const ts = t.split('-');
    findTagsMap.set(ts[0], mid);
    mid++;
    if (ts[1]) {
      findTagsMap.set(ts[1], mid);
      mid++;
    }
  });
  // 找出具有 tag === tags[?]的节点
  nodeItems.forEach((item) => {
    const node = item.getModel();
    if (findTagsMap.get(node.tag) !== undefined) {
      graph.setItemState(item, 'dark', false);
      node.light = true;
    }
  });
  edgeItems.forEach((item) => {
    const source = item.getSource().getModel();
    const target = item.getTarget().getModel();
    if (source.light && target.light) {
      graph.setItemState(item, 'dark', false);
    } else {
      graph.setItemState(item, 'dark', true);
    }
  });
  graph.paint();
  graph.setAutoPaint(true);
});

graph.on('node:mouseleave', () => {
  if (highlighting) {
    const nodeItems = graph.getNodes();
    const edgeItems = graph.getEdges();
    highlighting = false;
    nodeItems.forEach((item) => {
      graph.setItemState(item, 'dark', false);
    });
    edgeItems.forEach((item) => {
      graph.setItemState(item, 'dark', false);
    });
  }
});
// 点击根节点，展开子节点
graph.on('node:click', (e) => {

  curShowNodes = [];
  curShowEdges = [];
  const item = e.item;
  //点击的节点实例
  const model = item.getModel();
  //节点展开逻辑
  // 如果单击一个根，隐藏不相关的项，并显示相关的项
  if (model.level === 0) {
    const layoutController = graph.get('layoutController');
    const forceLayout = layoutController.layoutMethods[0];
    forceLayout.forceSimulation.stop();
    //点击的根节点居中归位
    model.x = width / 2;
    model.y = height / 2;
    // 生动地隐藏将要消失的节点和边
    if (curShowEdges.length) {
      curShowEdges.forEach((csedge) => {
        const item = graph.findById(csedge.id);
        //应用隐藏动画
        item && graph.setItemState(item, 'disappearing', true);
      });
    }
    curShowNodes.forEach((csnode) => {
      const item = graph.findById(csnode.id);
      item && graph.setItemState(item, 'disappearing', true);
    });
    graph.positionsAnimate();

    // 重置当前展示节点和边
    curShowNodes = [];
    curShowEdges = [];

    // 单击同一节点即当前的焦点节点，隐藏小节点，将布局参数更改为根视图

    if (currentFocus && currentFocus.id === model.id) {
      currentFocus = undefined;
      layoutController.layoutCfg.nodeStrength = 200;
      layoutController.layoutCfg.collideStrength = 0.8;
      layoutController.layoutCfg.alphaDecay = 0.01;
    } else {
      // 单击其他焦点节点，隐藏当前小节点，显示相关节点
      currentFocus = model;
      // 在原始项目消失后更改数据
      const layoutController = graph.get('layoutController');

      //节点作用力，正数代表节点之间的引力作用，负数代表节点之间的斥力作用
      layoutController.layoutCfg.nodeStrength = () => {
        return -100;
      };
      layoutController.layoutCfg.collideStrength = 0.2;//防止重叠力度
      layoutController.layoutCfg.linkDistance = (d) => { //边长度
        if (d.source.level !== 0) return 160;
        const length = 250;
        return length;
      };
      layoutController.layoutCfg.edgeStrength = () => {//边的作用力
        return 2;
      };

      const tag = model.tag;


      const findTags = [];
      curShowNodesMap = new Map();
      // 找到被点击节点的后代节点
      // let childNodes = [] 
      let childNodes = nodes.filter(node => node.level === model.level + 1)
      childNodes.forEach((node, index) => {
        if (!node.tags) return;
        const tags = node.tags;
        const tlength = tags.length;
        let isChild = false;
        const parents = [];
        //把子节点分组按标签分组
        for (let i = 0; i < tlength; i++) {
          const ts = tags[i].split('-');
          if (ts[0] === tag) {
            isChild = true;
          }
          parents.push(nodeMap.get(ts[0]));
        }
        if (isChild) {
          const randomAngle = Math.random() * 2 * Math.PI;
          node.x = model.x + (Math.cos(randomAngle) * model.size) / 2 + 10;
          node.y = model.y + (Math.sin(randomAngle) * model.size) / 2 + 10;
          const dist = (model.x - node.x) * (model.x - node.x) + (model.y - node.y) * (model.y - node.y);

          if (!node.style) node.style = {};
          node.style.lineWidth = 0;
          node.style.opacity = 1;
          node.style.cursor = 'pointer'
          if (node.isLeaf) {
            node.type = 'animate-circle';
            let color = 'l(0)';
            const parentsNum = parents.length;
            parents.forEach((parent, i) => {
              const parentColor = parent.color.split(' ')[1].substr(2);
              color += ` ${i / (parentsNum - 1)}:${parentColor}`;
            });
            if (parentsNum === 1) {
              color = model.color.split(' ')[1].substr(2);
            }
            node.color = color;
            node.style.fill = color;
            //节点边框线宽
            node.style.lineWidth = 1;
            node.size = 60;
            // CPE节点的label配置
            node.labelCfg = {
              style: {
                fontSize: 10,
                lineHeight: 10,
                fill: '#697B8C',
                cursor: 'pointer'
              },
              position: 'center',
            };
          } else if (node.level !== 0) {
            //VPE节点配置
            // node.type = 'iconfont';
            // node.type = 'rect';
            node.attrs = {
              radius: 6,
            },
              node.size = 100;
            if (!node.style) node.style = {};
            node.color = gColors[index % gColors.length];
            node.style.fill = gColors[index % gColors.length];
            node.labelCfg = {
              style: {
                fill: '#fff',
                fontSize: 14,
                cursor: 'pointer'
              },
              position: 'center',
            };
          }
          curShowNodes.push(node);
          curShowNodesMap.set(node.id, node);

          // 将模型与存在于边中的节点之间的边连接添加到边中
          const edgeId = `${model.id}-${node.id}`;
          const edge = edgesMap.get(edgeId);
          if (edge) {
            edge.color = model.color;
            curShowEdges.push(edge);
          }
          tags.forEach((t) => {
            const ts = t.split('-');
            if (ts[0] !== tag) {
              findTags.push(ts[0]);
            }
            if (ts[1]) {
              findTags.push(ts[1]);
            }
          });
        }
      });

      // 当前节点锚点的祖先节点
      nodes.forEach((node) => {
        const findTagsLength = findTags.length;
        for (let i = 0; i < findTagsLength; i++) {
          if (node.tag === findTags[i] && curShowNodesMap.get(node.id) === undefined) {
            curShowNodes.push(node);
            curShowNodesMap.set(node.id, node);
            return;
          }
        }
      });

      // 找到当前边的目标和源节点
      curShowNodes.forEach((nu, i) => {
        const lu = nu.level;
        curShowNodes.forEach((nv, j) => {
          if (j <= i) return;
          const lv = nv.level;
          let edgeId;
          if (lu < lv) {
            edgeId = `${nu.id}-${nv.id}`;
          } else {
            edgeId = `${nv.id}-${nu.id}`;
          }
          let color = model.color;
          if (nu.isLeaf) {
            if (nv.level === 0 && nv.tag !== model.tag) color = '#DFE5EB';
            else if (!nv.isLeaf && nv.tags[0] !== model.tag) {
              color = '#DFE5EB';
            }
          } else if (nv.isLeaf) {
            if (nu.level === 0 && nu.tag !== model.tag) color = '#DFE5EB';
            else if (!nu.isLeaf && nu.tags[0] !== model.tag) {
              color = '#DFE5EB';
            }
          }
          const edge = edgesMap.get(edgeId);
          if (edge) {
            edge.color = color;
            curShowEdges.push(edge);
          }
        });
      });
    }
    setTimeout(() => {
      graph.changeData({
        nodes: showNodes.concat(curShowNodes),
        edges: showEdges.concat(curShowEdges),
      });
      const nodeItems = graph.getNodes();
      const edgeItems = graph.getEdges();
      edgeItems.forEach((item) => {
        graph.clearItemStates(item);
      });
      nodeItems.forEach((item) => {
        graph.clearItemStates(item);
        graph.setItemState(item, 'appearing', true);
      });
    }, 100);
  } else if (model.level === 1) {
    //筛选点击当前VPE的子节点
    let rootAndVpeNodes = nodes.filter(node => node.level < 2)

    let loadNodes = rootAndVpeNodes;
    let loadEdges = edges.filter(edge => edge.source === 'root')
    //点击同一节点时
    if (currentFocus && currentFocus.id === model.id) {
      currentFocus = undefined;
    } else {
      const layoutController = graph.get('layoutController');
      const forceLayout = layoutController.layoutMethods[0];
      layoutController.layoutCfg.nodeStrength = () => {
        return -1000;
      };
      layoutController.layoutCfg.collideStrength = 1;//防止重叠力度
      let curChildNodes = nodes.filter(node => {
        let isChild = false;
        if (node?.tags?.length >= 1) {
          isChild = node.tags.some(tag => tag.split('-')[1] === model.tag)
        }
        return node.level === 2 && isChild
      })
      //配置CPE节点的颜色
      curChildNodes.forEach(node => {
        if (!node.style) node.style = {};
        node.color = model.color;
        node.style.fill = '#fff';
        node.type = 'animate-circle';
        //节点边框线宽
        node.style.lineWidth = 1;
        node.size = 60;
        // CPE节点的label配置
        node.labelCfg = {
          style: {
            fontSize: 10,
            lineHeight: 10,
            fill: '#697B8C',
            cursor: 'pointer'
          },
          position: 'center',
        };

      })
      //筛选点击当前VPE的子节点的边
      let curChildEdges = edges.filter(edge => {
        return model.id === edge.source || edge.source === 'root'
      })
      //配置边的颜色
      curChildEdges.forEach(edge => {
        edge.color = model.color;
      })
      // 单击其他焦点节点，隐藏当前小节点，显示相关节点
      currentFocus = model;
      loadNodes = rootAndVpeNodes.concat(curChildNodes)
      loadEdges = loadEdges.concat(curChildEdges)
    }

    setTimeout(() => {
      graph.changeData({
        nodes: loadNodes,
        edges: loadEdges,
      });
      const nodeItems = graph.getNodes();
      const edgeItems = graph.getEdges();
      edgeItems.forEach((item) => {
        graph.clearItemStates(item);
      });
      nodeItems.forEach((item) => {
        graph.clearItemStates(item);
        graph.setItemState(item, 'appearing', true);
      });
    }, 400);
  }
  //=========================================================

});
graph.on('canvas:click', () => {
  currentFocus = undefined;

  const forceLayout = graph.get('layoutController').layoutMethods[0];
  forceLayout.forceSimulation.stop();
  const nodeItems = graph.getNodes();
  const edgeItems = graph.getEdges();
  if (highlighting) {
    highlighting = false;
    nodeItems.forEach((item) => {
      graph.setItemState(item, 'dark', false);
    });
    edgeItems.forEach((item) => {
      graph.setItemState(item, 'dark', false);
    });
  } else {
    nodeItems.forEach((item) => {
      const model = item.getModel();
      graph.setItemState(item, 'disappearing', true);
    });
    edgeItems.forEach((item) => {
      graph.setItemState(item, 'disappearing', true);
    });
    curShowNodes = [];
    curShowEdges = [];

    let loadNodes = nodes.filter(node => node.level === 1);
    let loadEdges = edges.filter(edge => edge.source === 'root')
    loadNodes.forEach(node => {
      node.labelCfg = {
        style: {
          fill: '#fff',
          fontSize: 14,
        },
        position: 'center',
      };
      node.size = 100;
    })
    loadEdges.forEach((edge) => {
      edge.style = {
        lineWidth: 0.8,
        opacity: 1,
        strokeOpacity: 1,
      };
      //边的文字样式
      edge.labelCfg = {
        style: {
          fill: '#666',
          fontSize: 10,
          stroke: '#fff',
        }
      }
    })
    setTimeout(() => {
      const layoutController = graph.get('layoutController');
      layoutController.layoutCfg.nodeStrength = -100;
      layoutController.layoutCfg.collideStrength = 0.8;
      layoutController.layoutCfg.alphaDecay = 0.01;

      layoutController.layoutCfg.linkDistance = (d) => { //边长度
        if (d.source.level !== 0) return 160;
        const length = 250;
        return length;
      };
      layoutController.layoutCfg.edgeStrength = () => {//边的作用力
        return 2;
      };
      graph.changeData({
        nodes: showNodes.concat(loadNodes),
        edges: showEdges.concat(loadEdges),
      });
    }, 100);
  }
});