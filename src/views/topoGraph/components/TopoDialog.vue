<script lang="ts" setup>
import { Graph } from '@antv/g6'
import TopoLegend from './TopoLegend.vue'
import { commonRegister, dialogRegister } from '@/elements'
import cpes from '@/mock/cpes'
import { cpeCoordsHandler, getCirclePoint, getLevel2Point, getSiteList, uniqueFunc } from '@/utils/handles'

const visible = defineModel<boolean>()
const props = defineProps({
  isHubNet: {
    type: Boolean,
    default: false,
  },
  centerNode: {
    type: Object,
  },
})

// 变量声明
const wrapSize = reactive({
  width: 0,
  height: 0,
})
const nodeLevel = ref(0)
const loading = ref(false)
let graph = null
const cpeRoleMap = {
  Master: '主',
  Slave: '备',
  Single: '单机',
}

const graphEle = reactive({
  cpeNodes: [],
  siteCombos: [],
  level1Edges: [],
})
// 上一次点击的HUB节点
let preCenterNode = null
// 上一次点击的HUB节点下的CPE
let preCpeList = []

// 查询节点下连接的CPE
async function queryCpeData(uuid, sysType) {
  let result
  if (sysType === 'vpe') {
    result = cpes.filter(cpe => cpe.vpeUuid === uuid)
  }
  else {
    result = cpes.filter(cpe => cpe.hubUuid === uuid)
  }
  return result.success ? result.topo.cpes : []
}
async function initData() {
  const { id, sysType } = props.centerNode
  console.log('[ sysType ]-78', sysType)
  const { cpeNodes, siteCombos, cpeEdges } = dealElement(cpes, props.centerNode)
  graphEle.cpeNodes = cpeNodes
  graphEle.siteCombos = siteCombos
  graphEle.level1Edges = cpeEdges
}
watch(visible, async (val) => {
  if (val) {
    loading.value = true
    nextTick(async () => {
      initChart()
      await initData()
      drawChart()
      loading.value = false
    })
  }
  else {
    graph?.off('node:click', collapseChilds)
    graph = null
  }
})

// 处理CPE节点和边
function cpeNodeEdgeHandler(cpeList, siteList, centerNode) {
  const cpeEdges = []
  let siteCoors = {}
  // 处理CPE与所处站点位置关系
  if (siteList.length) {
    let appendLen = 0
    const limit = 8
    if (siteList.length > limit) {
      appendLen = 10 * (siteList.length - limit)
    }
    const r = 240 + appendLen
    if (nodeLevel.value) { // 二级节点坐标
      siteCoors = getLevel2Point(centerNode, r, siteList)
    }
    else {
      siteCoors = getCirclePoint(centerNode, 220, siteList)
    }
  }
  const cpeNodes = cpeList.map((cpe) => {
    const isMaster = cpe.linkRole === 'Master'
    const isVpnLink = cpe.linkType === 'Vpn'
    const isNomal = cpe.linkStatus === 'Normal'
    // 链路处理
    cpeEdges.push({
      source: centerNode.id,
      target: cpe.uuid,
      label: isMaster ? '主' : '备',
      type: 'animate-line',
      style: {
        stroke: isNomal ? '#72E672' : '#F45B5B',
        lineDash: isVpnLink ? [5, 5] : null,
      },
      labelCfg: {
        style: {
          fill: isNomal ? '#72E672' : '#F45B5B',
          stroke: '#fff',
        },
      },
    })
    const cpePriority = cpe.cpePriority
    const cpeRole = cpe.cpeRole
    // 是否存在备CPE
    const isExistSlave = cpeList.filter(({ siteUuid }) => cpe.siteUuid === siteUuid).length > 1
    // 当点击的CPE所处站点和上一级HUB所处站点相同时，CPE节点画在HUB节点的左侧
    let cpexy = {}
    if (nodeLevel.value) {
      const sameSite = graphEle.cpeNodes.find(({ comboId }) => cpe.siteUuid === comboId)
      if (sameSite && Math.abs(sameSite?.y - centerNode.y) <= 30) {
        cpexy = { x: sameSite.x, y: sameSite.y - 40 }
      }
      else if (sameSite) {
        cpexy = { x: sameSite.x + 46, y: sameSite.y }
      }
      else {
        cpexy = cpeCoordsHandler(siteCoors, cpe.siteUuid, cpePriority, isExistSlave, wrapSize.height)
      }
    }
    else {
      cpexy = cpeCoordsHandler(siteCoors, cpe.siteUuid, cpePriority, isExistSlave, wrapSize.height)
    }
    // CPE节点处理
    const cpeLabel = `${cpe.name}(${cpeRoleMap[cpeRole]})`
    return {
      id: cpe.uuid,
      // label: fittingString(cpeLabel, 50, 10),
      label: cpeLabel,
      fullLabel: cpeLabel,
      size: 40,
      ...cpexy,
      comboId: cpe.siteUuid,
      type: cpe.hub ? 'iconfontHub' : 'iconfontCpe',
      sysType: cpe.hub ? 'hub' : 'cpe',
      text: cpe.hub ? '\uEA3A' : '\uE604',
      style: {
        fill: cpe.hub ? '#C396ED' : '#82C0F9', // #9795FF
        stoke: '#fff',
        cursor: centerNode.sysType && cpe.hub ? 'pointer' : 'default',
      },
      labelCfg: {
        style: {
          fontSize: 10,
          fill: '#6f6d6d',
          // stroke: "#fff",
        },
        position: 'center',
      },
    }
  })
  return { cpeNodes, cpeEdges }
}
// 提示框插件
function tooltip() {
  return new G6.Tooltip({
    offsetX: 10,
    offsetY: 10,
    // 允许出现 tooltip 的 item 类型
    itemTypes: ['node', 'edge'],
    // 自定义 tooltip 内容
    getContent: (e) => {
      const item = e.item
      const model = item.getModel()
      const { label, fullLabel } = model
      const labelStr = fullLabel || label
      const outDiv = document.createElement('div')
      outDiv.style.width = 'fit-content'
      outDiv.innerHTML = `
          <ul >
            <li>${labelStr}</li>
          </ul>`
      return outDiv
    },
  })
}
function initChart() {
  // 获取容器宽高
  const dialog = document.querySelector('.dialog')
  const height = wrapSize.height = dialog.clientHeight - 40
  const width = wrapSize.width = dialog.clientWidth

  props.centerNode.x = width / 2
  props.centerNode.y = height / 2

  if (props.centerNode.sysType === 'vpe') {
    props.centerNode.size = [80, 36]
  }
  if (!graph) {
    // 注册图元素
    commonRegister()
    dialogRegister()
    graph = new Graph({
      container: 'graphWrap',
      width,
      height,
      fitView: false,
      linkCenter: true,
      // 交互行为相关配置
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-combo'],
      },
      defaultNode: {
        type: 'bubble',
        labelCfg: {
          position: 'center',
          style: {
            stroke: '#fff',
          },
        },
      },
      defaultEdge: {
        color: '#888',
        type: 'animate-line',
      },
      defaultCombo: {
        type: 'rect',
        style: {
          lineWidth: 1,
          lineDash: [4, 4],
          cursor: 'all-scroll',
        },
        labelCfg: {
          refY: -14,
          position: 'top',
        },
      },
      plugins: [tooltip()],
    })
    graph.on('node:click', collapseChilds)
  }
}

// 处理渲染的元素
function dealElement(cpeList, centerNode) {
  const siteList = getSiteList(cpeList)
  const cpeElements = cpeNodeEdgeHandler(cpeList, siteList, centerNode)
  // 站点COMBO处理
  const siteCombos = siteList.map((site) => {
    return {
      id: site.siteUuid,
      label: site.siteName,
      padding: 6,
      type: 'rect',
      size: [80, 30],
      labelCfg: {
        style: {
          stroke: '#fff',
          fill: '#1d1d1f',
        },
      },
    }
  })
  return { siteCombos, ...cpeElements }
}

// 渲染
function drawChart(cpeNodes = [], cpeEdges = [], siteCombos = []) {
  graph.clear()
  const nodes = uniqueFunc([props.centerNode, ...cpeNodes, ...graphEle.cpeNodes], 'id')
  const combos = uniqueFunc([...siteCombos, ...graphEle.siteCombos], 'id')
  const edges = [...graphEle.level1Edges, ...cpeEdges]
  graph.read({
    nodes,
    edges,
    combos,
  })
}
// 展开
async function collapseChilds(e) {
  e.bubbles = false // 禁止冒泡
  e.defaultPrevented = true
  e.propagationStopped = true
  const item = e.item
  const model = item.getModel()
  // 点击同一个不做处理
  if (preCenterNode && preCenterNode.id === model.id)
    return
  // 监听VPE子图下HUB点击事件
  if (isVpe.value) {
    if (model.sysType === 'hub') {
      const cpeListUnderHub = await queryCpeData(model.id, 'hub')
      // 点击节点带有动画移动到画布中心
      nodeLevel.value = 1
      let { siteCombos, cpeNodes, cpeEdges } = dealElement(cpeListUnderHub, model)
      // 保留上一次点击的HUB节点下的CPE节点
      if (preCpeList.length) {
        const { siteCombos: preSiteCombos, cpeNodes: preCpeNodes, cpeEdges: preCpeEdges } = dealElement(preCpeList, preCenterNode)
        siteCombos = preSiteCombos.concat(siteCombos)
        cpeNodes = preCpeNodes.concat(cpeNodes)
        cpeEdges = preCpeEdges.concat(cpeEdges)
      }
      graph.fitView(10)
      drawChart(cpeNodes, cpeEdges, siteCombos)
      // 保留上一次点击的HUB节点和 CPE数据
      preCenterNode = model
      preCpeList = cpeListUnderHub
    }
    else if (model.sysType === 'vpe') {
      // 点击节点带有动画移动到画布中心
      graph.focusItem(item, true, {
        easing: 'easeCubic',
        duration: 500,
      })
    }
  }
}

const isVpe = computed(() => props.centerNode?.sysType === 'vpe')
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog">
      <div id="graphWrap" />
      <TopoLegend :legend-type="centerNode && centerNode.sysType" />
      <p v-if="props.centerNode" class="title">
        {{ props.centerNode.label }}
      </p>
      <p v-if="isVpe" class="vpe-info">
        注: 点击HUB可查看HUB下连接的CPE
      </p>
      <button class="close-btn" @click="visible=false">
        关闭
      </button>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.dialog {
  width: 980px;
  height: 740px;
  box-shadow: 0 0 5px #ccc;
  border-radius: 4px;
  z-index: 9;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  .close-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    outline: none;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 2px 6px;
    color: #666;
    cursor: pointer;
    transition: all .2s ease-in-out;

    &:hover {
      color: #F94A48;
      border-color: #F94A48;
    }
  }

  .title {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #fff;
    padding: 4px 8px;
    font-size: 14px;
    color: #666;
    font-weight: 600;
  }

  .vpe-info {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background-color: #f5f5f5;
    color: #B7B7B7;
    border-radius: 3px;
    padding: 3px 6px;
    font-size: 12px;

  }
}
</style>
