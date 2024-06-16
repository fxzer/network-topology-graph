<script setup lang='ts'>
import { Graph } from '@antv/g6'
import { onBeforeUnmount, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import TopoLegend from './components/TopoLegend.vue'
import TopoDialog from './components/TopoDialog.vue'
import topo from '@/mock/topology'
import { fitViewHandler, getCirclePoint } from '@/utils/handles'
import { commonRegister, viewRegister } from '@/elements'

const { width, height } = useWindowSize()
// 初始化变量
const isEmpty = ref(false)
const centerNode = ref(null)
const topoVisible = ref(false)

const graph = ref(null)
const vpeNodes = ref([])
const hubNodes = reactive([])
const hubCombos = reactive([])
const extCombos = reactive([])
const comboEdges = reactive([])
const extEdges = reactive([])

//
async function requestTopoData() {
  const { vpes = [], hubNetworks = [], externalNetworks = [] } = topo
  if (!vpes.length && !hubNetworks.length) {
    isEmpty.value = true
  }
  dealData(vpes, hubNetworks, externalNetworks)
}

function dealData(vpes = [], hubNetworks = [], externalNetworks = []) {
  vpes = vpes.filter(item => item.vpeType !== 'RR')
  // VPE节点
  vpeNodes.value = vpes.map(({ uuid, name, linkCount }) => ({
    id: uuid,
    label: `${name}\n(${linkCount})`,
    comboId: 'vpe',
    sysType: 'vpe',
    size: [60, 32],
    type: 'vpe-rect-animate',
    style: {
      fill: '#fff',
      lineWidth: 1,
      stoke: '#8FE9FF',
      radius: 5,
      cursor: 'pointer',
    },
    labelCfg: {
      style: {
        fontSize: 10,
        fill: '#697B8C',
        stroke: '#fff',
        cursor: 'pointer',
      },
      position: 'center',
    },
  }))

  const validHubNets = hubNetworks.filter(
    hubNetwork => hubNetwork?.hubs?.length,
  )
  // 处理网络拓扑自适应尺寸
  // const networkCount = validHubNets.length + (vpes.length ? 1 : 0)

  // const { r, viewPadding } = fitViewHandler(networkCount)
  // if (graph.value && graph.value.cfg) {
  //   graph.value.cfg.fitViewPadding = viewPadding
  // }
  // 处理HUB网络内部的节点布局
  const netList = validHubNets.concat(externalNetworks)
  // const layoutPips = graph.value.get("layout").pipes;
  const halfWidth = Math.round(width.value / 2)
  const halfHeight = Math.round(height.value / 2)
  const netCoors = getCirclePoint(
    {
      x: halfWidth,
      y: halfHeight,
    },
    50,
    netList,
    'hubnet',
  )

  const customPipes = netList.map((network) => {
    // 是否连接VPE网络
    const { uuid, name, connectVpe, hubs = [], peerAsNo } = network
    const { x, y } = netCoors[uuid]
    // 1.处理HUB Combos
    if (typeof connectVpe === 'undefined') {
      // 外部网络
      extCombos.push({
        id: uuid,
        label: `${name}\n\n(AS号: ${peerAsNo})`,
        padding: 10,
        x,
        y,
        type: 'cloudComboExt',
        style: {
          fill: '#fcf0da',
        },
        labelCfg: {
          style: {
            y: 0,
            fontSize: 12,
            fill: '#697B8C',
            stroke: '#fff',
          },
          position: 'bottom',
        },
      })
      extEdges.push({
        id: `vpe${uuid}`,
        source: 'vpe',
        target: uuid,
        type: 'animate-line',
        style: {
          stroke: '#ccc',
          lineWidth: 1,
        },
      })
    }
    else {
      hubCombos.push({
        id: uuid,
        label: name,
        padding: 10,
        // fixSize,
        x,
        y,
        type: 'cloudCombo',
        // type: "cloudSvgCombo",
        style: {
          fill: '#eee',
        },
        labelCfg: {
          style: {
            y: 0,
            fontSize: 12,
            fill: '#697B8C',
            stroke: '#fff',
          },
          position: 'bottom',
        },
      })
    }

    // 2.处理HUB网络与VPE网络的连接
    if (connectVpe) {
      comboEdges.push({
        id: `vpe${uuid}`,
        source: 'vpe',
        target: uuid,
        type: 'animate-line',
        style: {
          stroke: '#ccc',
          lineWidth: 1,
        },
      })
    }
    // 3.处理HUB网络中的HUB节点
    hubs.forEach((hub) => {
      hubNodes.push({
        id: hub.uuid,
        label: `${hub.name}\n (${hub.linkCount})` + `\n`,
        comboId: uuid,
        sysType: 'hub',
        size: 40,
        type: 'iconfontHub',
        text: '\uEA3A',
        style: {
          fill: '#C396ED',
          lineWidth: 1,
          stroke: '#fff',
          cursor: 'pointer',
        },
        labelCfg: {
          style: {
            y: 15,
            fontSize: 10,
            lineHeight: 12,
            fill: '#1d1d1d',
            stroke: '#fff',
            cursor: 'pointer',
          },
          position: 'center',
        },
      })
    })
    // 4.返回HUB网络内部hub布局
    return {
      type: 'circular',
      center: [x, y],
      radius: 80,
      nodesFilter: node => node.comboId === uuid,
    }
  })
  // const newPipes = layoutPips.concat(customPipes);
  // graph.value.updateLayout({ pipes: newPipes })
  drawChart()
  // graph.value.fitCenter();不生效
}
function initChart() {
  const halfWidth = width.value / 2
  const halfHeight = height.value / 2
  if (!graph.value) {
    commonRegister()
    viewRegister()
    // const toolbar = new ToolBar({
    //   position: { x: 10, y: 10 },
    //   getContent: () => {
    //     const outDiv = document.createElement('div');
    //     let style = 'cursor: pointer;vertical-align: middle;line-height:24px;font-size:18px;'
    //     outDiv.innerHTML = `<ul>
    //               <li code='zoomOut' style="${style}" class="iconfont icon-fangda" title="放大"></li>
    //               <li code='zoomIn'  style="${style}" class="iconfont icon-suoxiao" title="缩小"></li>
    //               <li code='autoZoom' style="${style}" class="iconfont icon-fitscreen24" title="居中"></li>
    //             </ul>`
    //     return outDiv
    //   },
    //   handleClick: (code) => {
    //     if (code === 'zoomOut') {
    //       toolbar.zoomOut()
    //     } else if (code === 'zoomIn') {
    //       toolbar.zoomIn()
    //     } else if (code === 'autoZoom') {
    //       toolbar.autoZoom()
    //     }
    //   }
    // });
    graph.value = new Graph({
      container: 'topoChart',
      width: width.value,
      height: height.value,
      fitView: true,
      fitViewPadding: 100,
      groupByTypes: false,
      linkCenter: false,
      // layout: {
      //   pipes: [
      //     {
      //       // 该子图所使用的布局类型
      //       type: "circular",
      //       center: [halfWidth, halfHeight],
      //       radius: 80,
      //       nodesFilter: (node) => node.sysType === "vpe",
      //     },
      //   ],
      // },
      // 交互行为相关配置
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-combo'],
      },
      // plugins: [toolbar],
      defaultNode: {
        type: 'bubble',
        labelCfg: {
          position: 'center',
          style: {
            fill: 'white',
            stroke: '#fff',
          },
        },
      },
      defaultEdge: {
        color: '#888',
        type: 'animate-line',
      },
      defaultCombo: {
        padding: 1,
        style: {
          cursor: 'all-scroll',
        },
        labelCfg: {
          style: {
            opacity: 0,
            fill: '#303133',
            fontSize: 12,
            stroke: '#fff',
          },
        },
      },
    })
    // node点击事件监听
    graph.value.on('node:click', (e) => {
      const item = e.item
      const model = item.getModel()
      centerNode.value = JSON.parse(JSON.stringify(model))
      topoVisible.value = true
    })
  }
}

function drawChart() {
  const hasVpeNodes = vpeNodes.value.length !== 0
  const vpeCombo = {
    id: 'vpe',
    // label: "VPE组网",
    padding: 1,
    type: 'cloudCombo',
    x: width.value / 2,
    y: height.value / 2,
    style: {
      fill: '#C3E7FE',
    },
  }
  const combos = [...hubCombos, ...extCombos]
  const edges = [...comboEdges, ...extEdges]
  if (hasVpeNodes) {
    combos.push(vpeCombo)
  }
  graph.value.render()
  // graph.value.draw({
  //   nodes: [...vpeNodes.value, ...hubNodes],
  //   edges,
  //   combos,
  // });
}
function rePaint() {
  if (graph.value) {
    const autoPaint = graph.value.get('autoPaint')
    graph.value.paint()
    graph.value.setAutoPaint(autoPaint)
  }
}
onMounted(() => {
  const topoChart = document.getElementById('topoChart')
  width.value = topoChart.scrollWidth
  height.value = topoChart.scrollHeight
  initChart()
  requestTopoData()
  window.addEventListener('resize', rePaint)
})
onBeforeUnmount(() => {
  if (graph.value) {
    graph.value.clear()
    window.removeEventListener('resize', rePaint)
    // graph.value.destroy()
  }
})
</script>

<template>
  <div id="topoChart" :class="isEmpty ? 'is-empty' : ''" />
  <TopoDialog v-model="topoVisible" :center-node="centerNode" />
  <TopoLegend />
  <a href="../../../native-model-src/index.html" class="native-link">原生JS模型版</a>
</template>

<style scoped lang='scss'>
#topoChart {
  height: 100vh;
  width: 100%;
  background-color: fff;
  overflow: hidden;
  position: relative;
}

#topoChart.is-empty::before {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: '暂无数据';
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color: #999;
  font-weight: 500;
  opacity: .6;
}
.native-link{
  position: absolute;
  bottom: 10px;
  left:10px;
  background-color: #fff;
}
</style>
