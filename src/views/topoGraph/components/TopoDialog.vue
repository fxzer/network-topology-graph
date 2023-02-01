<template>
  <Teleport to="body">
    <div class="dialog" v-if="visible">
      <div id="graphWrap"></div>
      <TopoLegend :legendType="centerNode && centerNode.sysType" />
      <p class="title" v-if="props.centerNode">{{ props.centerNode.label }}</p>
      <p v-if="isVpe" class="vpe-info">注: 点击HUB可查看HUB下连接的CPE</p>
      <button class="close-btn" @click="close">关闭</button>
    </div>
  </Teleport>

</template>

<script lang="ts" setup>
import G6 from "@antv/g6";
import TopoLegend from './TopoLegend.vue'
import { commonRegister, dialogRegister, fittingString } from "@/utils/registerElements";
import { getVpeTopoData, getHubTopoData } from "@/api/topology";
import { getLevel2Point, getCirclePoint, cpeCoordsHandler, getSiteList, uniqueFunc } from '@/utils/handles'


const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  isHubNet: {
    type: Boolean,
    default: false,
  },
  centerNode: {
    type: Object,
  },
})
const emits = defineEmits<{
  (event: 'update:visible', visible: Boolean): void
}>()

// 变量声明
const wrapSize = reactive({
  width: 0,
  height: 0,
})
const nodeLevel = ref(0)
const loading = ref(false)
let graph = null
const cpeRoleMap = {
  Master: "主",
  Slave: "备",
  Single: "单机",
}

const graphEle = reactive({
  cpeNodes: [],
  siteCombos: [],
  level1Edges: [],
})
//上一次点击的HUB节点
let preCenterNode = null
//上一次点击的HUB节点下的CPE
let preCpeList = []

const close = () => {
  emits('update:visible', false)
}
//查询节点下连接的CPE
const queryCpeData = async (uuid, sysType) => {
  let result;
  if (sysType === "vpe") {
    result = await getVpeTopoData(uuid);
  } else {
    result = await getHubTopoData(uuid);
  }
  return result.success ? result.topo.cpes : [];
}
const initData = async () => {
  let { id, sysType } = props.centerNode
  let cpeList = await queryCpeData(id, sysType);
  let { cpeNodes, siteCombos, cpeEdges } = dealElement(cpeList, props.centerNode);
  graphEle.cpeNodes = cpeNodes;
  graphEle.siteCombos = siteCombos;
  graphEle.level1Edges = cpeEdges;
}
watch(() => props.visible, async (val) => {
  if (val) {
    loading.value = true;
    nextTick(async () => {
      initChart();
      await initData();
      drawChart();
      loading.value = false;
    });
  } else {
    graph?.off('node:click', collapseChilds);
    graph = null
  }
})

//处理CPE节点和边
const cpeNodeEdgeHandler = (cpeList, siteList, centerNode) => {
  let cpeEdges = []
  let siteCoors = {}
  //处理CPE与所处站点位置关系
  if (siteList.length) {
    let appendLen = 0;
    let limit = 8
    if (siteList.length > limit) {
      appendLen = 10 * (siteList.length - limit);
    }
    let r = 240 + appendLen
    if (nodeLevel.value) {//二级节点坐标
      siteCoors = getLevel2Point(centerNode, r, siteList);
    } else {
      siteCoors = getCirclePoint(centerNode, 220, siteList);
    }
  }
  let cpeNodes = cpeList.map((cpe) => {
    let isMaster = cpe.linkRole === "Master";
    let isVpnLink = cpe.linkType === "Vpn";
    let isNomal = cpe.linkStatus === "Normal";
    //链路处理
    cpeEdges.push({
      source: centerNode.id,
      target: cpe.uuid,
      label: isMaster ? "主" : "备",
      type: "animate-line",
      style: {
        stroke: isNomal ? "#72E672" : "#F45B5B",
        lineDash: isVpnLink ? [5, 5] : null,
      },
      labelCfg: {
        style: {
          fill: isNomal ? "#72E672" : "#F45B5B",
          stroke: "#fff",
        },
      },
    });
    let cpePriority = cpe.cpePriority;
    let cpeRole = cpe.cpeRole;
    //是否存在备CPE
    let isExistSlave = cpeList.filter(({ siteUuid }) => cpe.siteUuid === siteUuid).length > 1;
    //当点击的CPE所处站点和上一级HUB所处站点相同时，CPE节点画在HUB节点的左侧
    let cpexy = {}
    if (nodeLevel.value) {
      let sameSite = cpeNodes.value.find(({ comboId }) => cpe.siteUuid === comboId);
      if (sameSite && Math.abs(sameSite?.y - centerNode.y) <= 30) {
        cpexy = { x: sameSite.x, y: sameSite.y - 40 }
      } else if (sameSite) {
        cpexy = { x: sameSite.x + 46, y: sameSite.y }
      } else {
        cpexy = cpeCoordsHandler(siteCoors, cpe.siteUuid, cpePriority, isExistSlave, wrapSize.height);
      }
    } else {
      cpexy = cpeCoordsHandler(siteCoors, cpe.siteUuid, cpePriority, isExistSlave, wrapSize.height);
    }
    //CPE节点处理
    let cpeLabel = cpe.name + `(${cpeRoleMap[cpeRole]})`
    return {
      id: cpe.uuid,
      label: fittingString(cpeLabel, 50, 10),
      fullLabel: cpeLabel,
      size: 40,
      ...cpexy,
      comboId: cpe.siteUuid,
      type: cpe.hub ? "iconfontHub" : "iconfontCpe",
      sysType: cpe.hub ? "hub" : "cpe",
      text: cpe.hub ? "\uea3a" : "\ue604",
      style: {
        fill: cpe.hub ? "#C396ED" : "#82C0F9",//#9795FF
        stoke: "#fff",
        cursor: centerNode.sysType && cpe.hub ? "pointer" : "default",
      },
      labelCfg: {
        style: {
          fontSize: 10,
          fill: "#6f6d6d",
          // stroke: "#fff",
        },
        position: "center",
      },
    };
  });
  return { cpeNodes, cpeEdges };
}
//提示框插件
const tooltip = () => {
  return new G6.Tooltip({
    offsetX: 10,
    offsetY: 10,
    // 允许出现 tooltip 的 item 类型
    itemTypes: ['node', 'edge'],
    // 自定义 tooltip 内容
    getContent: (e) => {
      const item = e.item;
      const model = item.getModel();
      const { label, fullLabel } = model;
      let labelStr = fullLabel || label;
      const outDiv = document.createElement('div');
      outDiv.style.width = 'fit-content';
      outDiv.innerHTML = `
          <ul >
            <li>${labelStr}</li>
          </ul>`;
      return outDiv;
    },
  });
}
const initChart = () => {
  //获取容器宽高
  let dialog = document.querySelector('.dialog')
  let height = wrapSize.height = dialog.clientHeight - 40
  let width = wrapSize.width = dialog.clientWidth

  props.centerNode.x = width / 2;
  props.centerNode.y = height / 2;

  if (props.centerNode.sysType === "vpe") {
    props.centerNode.size = [80, 36];
  }
  if (!graph) {
    //注册图元素
    commonRegister()
    dialogRegister()
    graph = new G6.Graph({
      container: "graphWrap",
      width,
      height,
      fitView: false,
      linkCenter: true,
      //交互行为相关配置
      modes: {
        default: ["drag-canvas", "zoom-canvas", "drag-combo"],
      },
      defaultNode: {
        type: "bubble",
        labelCfg: {
          position: "center",
          style: {
            stroke: "#fff",
          },
        },
      },
      defaultEdge: {
        color: "#888",
        type: "animate-line",
      },
      defaultCombo: {
        type: "rect",
        style: {
          lineWidth: 1,
          lineDash: [4, 4],
          cursor: "all-scroll",
        },
        labelCfg: {
          refY: -14,
          position: "top",
        },
      },
      plugins: [tooltip()],
    });
    graph.on('node:click', collapseChilds)
  }
}

//处理渲染的元素
const dealElement = (cpeList, centerNode) => {
  let siteList = getSiteList(cpeList);
  let cpeElements = cpeNodeEdgeHandler(cpeList, siteList, centerNode);
  //站点COMBO处理
  let siteCombos = siteList.map((site) => {
    return {
      id: site.siteUuid,
      label: site.siteName,
      padding: 6,
      type: "rect",
      size: [80, 30],
      labelCfg: {
        style: {
          stroke: "#fff",
          fill: "#1d1d1f"
        },
      }
    }
  });
  return { siteCombos, ...cpeElements };
}

//渲染
const drawChart = (cpeNodes = [], cpeEdges = [], siteCombos = []) => {
  graph.clear()
  let nodes = uniqueFunc([props.centerNode, ...cpeNodes, ...graphEle.cpeNodes], 'id');
  let combos = uniqueFunc([...siteCombos, ...graphEle.siteCombos], 'id');
  let edges = [...graphEle.level1Edges, ...cpeEdges]
  graph.read({
    nodes,
    edges,
    combos,
  });
}
//展开
const collapseChilds = async (e) => {
  e.bubbles = false //禁止冒泡
  e.defaultPrevented = true
  e.propagationStopped = true
  const item = e.item;
  const model = item.getModel();
  //点击同一个不做处理
  if (preCenterNode && preCenterNode.id === model.id) return;
  //监听VPE子图下HUB点击事件
  if (isVpe) {
    if (model.sysType === 'hub') {
      let cpeListUnderHub = await queryCpeData(model.id, 'hub');
      //点击节点带有动画移动到画布中心
      nodeLevel.value = 1
      let { siteCombos, cpeNodes, cpeEdges } = dealElement(cpeListUnderHub, model);
      //保留上一次点击的HUB节点下的CPE节点
      if (preCpeList.length) {
        let { siteCombos: preSiteCombos, cpeNodes: preCpeNodes, cpeEdges: preCpeEdges } = dealElement(preCpeList, preCenterNode);
        siteCombos = preSiteCombos.concat(siteCombos);
        cpeNodes = preCpeNodes.concat(cpeNodes);
        cpeEdges = preCpeEdges.concat(cpeEdges);
      }
      graph.fitView(10)
      drawChart(cpeNodes, cpeEdges, siteCombos);
      //保留上一次点击的HUB节点和 CPE数据
      preCenterNode = model;
      preCpeList = cpeListUnderHub
    } else if (model.sysType === 'vpe') {
      //点击节点带有动画移动到画布中心
      graph.focusItem(item, true, {
        easing: 'easeCubic',
        duration: 500,
      });
    }
  }
}

const isVpe = computed(() => props.centerNode?.sysType === 'vpe')

</script>

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