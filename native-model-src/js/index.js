import dataObj from './data.js'
import { darkColors, lightColors, uDarkColors, uLightColors } from './colors.js'
import { dealChildrenNum, dealCpeNodes, mapNodeSize } from './utils.js'

const testData = {
  nodes: [],
  edges: [],
}
const rootNode = {
  id: 'root',
  name: 'VPE组网',
  level: 0,
  tag: 'root',
  isLeaf: false,
  childrenNum: dataObj.vpes.length,
}
// VPE根节点
const vpeNodes = dataObj.vpes.map(({ vpeUuid, vpeName }) => (
  {
    id: vpeUuid,
    name: vpeName,
    level: 1,
    tag: vpeUuid,
    type: 'iconfont',
    isLeaf: false,
    tags: ['root'],
    text: '\uE7D9',
  }
))
// 把CPE按照同一个VPE分组
const vpeToCpeNumMap = dataObj.links.reduce((acc, cur) => {
  const seet = new Set()
  acc[cur.vpeUuid] = acc[cur.vpeUuid] ? acc[cur.vpeUuid].add(cur.cpeUuid) : seet.add(cur.cpeUuid)
  return acc
}, {})

const cpeNodes = dealCpeNodes(dataObj.cpes, dataObj.links)
const otherNodes = dealChildrenNum(vpeNodes, vpeToCpeNumMap).concat(cpeNodes)
testData.nodes = [rootNode, ...otherNodes]

// 处理边
const rootEdges = dataObj.vpes.map((vpe) => {
  return {
    source: 'root',
    target: vpe.vpeUuid,
  }
})
const otherEdges = dataObj.links.map((link) => {
  return {
    source: link.vpeUuid,
    target: link.cpeUuid,
    label: link.priority === 'High' ? '主' : '备',
  }
})
testData.edges = [...rootEdges, ...otherEdges]
/* ============================================================ */
let showNodes = []
let showEdges = []

let nodes = []
let edges = []
let nodeMap = new Map()
let edgesMap = new Map()

const width = document.getElementById('topoGrapth').scrollWidth
const height = document.getElementById('topoGrapth').scrollHeight || 500

// 主题颜色处理
const gColors = []
const unlightColorMap = new Map()
lightColors.forEach((lcolor, i) => {
  gColors.push(`l(0) 0:${lcolor} 1:${darkColors[i]}`)
  unlightColorMap.set(gColors[i], `l(0) 0:${uLightColors[i]} 1:${uDarkColors[i]}`)
})

const layoutCfg = {
  type: 'force',
  nodeSize: (d) => {
    return d.size / 2 + 5
  },
  nodeStrength: 200,
  collideStrength: 0.8,
  alphaDecay: 0.01,
  preventOverlap: true,
}
// 图实例
const graph = new Graph({
  container: 'topoGrapth',
  width,
  height,
  linkCenter: true,
  layout: layoutCfg,
  // 交互行为相关配置
  modes: {
    default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
  },
  // level 0 图形的默认形状
  defaultNode: {
    type: 'bubble',
    size: 200, // 默认节点尺寸(改变根节点)
    labelCfg: {
      position: 'center',
      style: {
        fill: 'white',
        fontStyle: 'bold',
      },
    },
  },
  defaultEdge: {
    color: '#888',
    // label: 'line',
    type: 'animate-line', // 'animate-line'
  },
})
graph.get('canvas').set('localRefresh', true)

function loadData(data) {
  const layoutController = graph.get('layoutController')
  // 引力斥力大小
  layoutController.layoutCfg.nodeStrength = 500
  // 防止重叠的力强度
  layoutController.layoutCfg.collideStrength = 1
  // 迭代阈值的衰减率
  layoutController.layoutCfg.alphaDecay = 0.01

  nodes = data.nodes
  edges = data.edges

  showNodes = []
  showEdges = []
  nodeMap = new Map()
  edgesMap = new Map()
  nodes.forEach((node) => {
    // 找出根节点
    if (node.level === 0) {
      // 根节点填充色
      node.color = gColors[showNodes.length % gColors.length]
      node.type = 'iconfont'

      node.text = '\uE7D9'
      node.style = {
        fill: gColors[showNodes.length % gColors.length],
        lineWidth: 0,
        cursor: 'pointer',
      }
      // 根节点配置label
      node.size = 200
      node.labelCfg = {
        style: {
          fontSize: 30,
          fill: '#fff',
        },
      }
      node.x = Math.round(Math.random() * 800)
      node.y = Math.round(Math.random() * 800)
      showNodes.push(node)
    }
    // 如果不是叶子节点(没有后代),配置节点label
    if (!node.isLeaf) {
      const num = node.childrenNum ? `\n(${node.childrenNum})` : ''
      node.label = `${node.name}${num}`
    }
    else {
      node.label = `${node.name}\n(${node.description})`
    }
    nodeMap.set(node.id, node)
  })

  mapNodeSize(showNodes, 'childrenNum', [200, 260])

  // 处理子节点的颜色
  nodes.forEach((node, index) => {
    if (node.level !== 0 && !node.isLeaf) {
      const parent = nodeMap.get(node.tags[0])
      node.color = gColors[index % gColors.length]
      node.style = {
        fill: gColors[index % gColors.length],
        cursor: 'pointer',
      }
    }
  })
  // 处理边
  edges.forEach((edge) => {
    edge.id = `${edge.source}-${edge.target}`
    edge.style = {
      lineWidth: 0.8,
      opacity: 1,
      strokeOpacity: 1,
    }
    // 边的文字样式
    edge.labelCfg = {
      style: {
        fill: '#666',
        fontSize: 10,
      },
    }
    edgesMap.set(edge.id, edge)
  })
  graph.data({
    nodes: showNodes,
    edges: showEdges,
  })
  graph.render()
}

loadData(testData)
export default { graph, width, height, nodes, edges, nodeMap, edgesMap, gColors, showNodes, showEdges }
