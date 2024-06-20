<script setup lang='ts'>
import TopoLegend from './components/TopoLegend.vue'
import TopoDialog from './components/TopoDialog.vue'
import topo from '@/mock/topology'
import data from '@/mock/data'
import { commonRegister } from '@/elements'

const { width, height } = useWindowSize()
const centerNode = ref(null)
const topoVisible = ref(false)

commonRegister()
// viewRegister()
const datav = handleData()
const { graphEl } = useGraph(datav)
function handleData() {
  const { vpes = [], hubNetworks = [], externalNetworks = [] } = topo
  // VPE节点
  const vpeNodes = vpes.map(({ uuid, name, linkCount }) => ({
    id: uuid,

    comboId: 'vpe',
    sysType: 'vpe',
    size: [60, 32],
    style: {
      radius: 4, // 👈🏻 Set the radius.
      size: 40,
      iconWidth: 20,
      iconHeight: 20,
      fill: '#fff',
      lineWidth: 1,
      stoke: '#8FE9FF',
      cursor: 'pointer',
      labelText: `${name}\n(${linkCount})`,
      labelFill: '#697B8C',
      labelStroke: '#fff',
      labelFontSize: 10,
      labelPosition: 'center',
      labelCursor: 'pointer',
    },
  }))
  const vpeCombo = {
    id: 'vpe',
    style: {
      fill: '#f00',
      labelText: 'VPE组网',
    },
  }
  const validHubNets = hubNetworks.filter(
    hubNetwork => hubNetwork?.hubs?.length,
  )
  const extCombos = []
  const extEdges = []
  const hubCombos = []
  const comboEdges = []
  const hubNodes = []
  //   // 处理HUB网络内部的节点布局
  const netList = validHubNets.concat(externalNetworks)
  netList.forEach((network: any) => {
    //     // 是否连接VPE网络
    const { uuid, name, connectVpe, hubs = [], peerAsNo } = network

    // 3.处理HUB网络中的HUB节点
    hubs.forEach((hub) => {
      hubNodes.push({
        id: hub.uuid,
        comboId: uuid,
        sysType: 'hub',
        style: {
          size: 40,
          fill: '#C396ED',
          text: '\uEA3A',
          lineWidth: 1,
          stroke: '#fff',
          cursor: 'pointer',
          labelText: `${hub.name}\n (${hub.linkCount})` + `\n`,
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
    // 1.处理HUB Combos
    if (typeof connectVpe === 'undefined') {
      // 外部网络
      extCombos.push({
        id: uuid,
        label: `${name}\n\n(AS号: ${peerAsNo})`,
        padding: 10,
        x: width.value / 2,
        y: height.value / 2,
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
        x: width.value / 2,
        y: height.value / 2,
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
        // type: 'animate-line',
        style: {
          stroke: '#ccc',
          lineWidth: 1,
        },
      })
    }
  })
  return {
    nodes: [...vpeNodes, ...hubNodes],
    edges: [...comboEdges],
    combos: [vpeCombo, ...hubCombos, ...extCombos],
  }
}
</script>

<template>
  <div ref="graphEl" class="wh-screen" />
  <TopoDialog v-model="topoVisible" :center-node="centerNode" />
  <TopoLegend />
  <!-- <a href="../../../native-model-src/index.html" class="native-link">原生JS模型版</a> -->
</template>
