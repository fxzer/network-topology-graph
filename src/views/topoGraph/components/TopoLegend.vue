<script lang="ts" setup>
const props = defineProps({
  legendType: {
    type: String,
    default: 'network',
  },
})
const networkLegend = reactive([
  {
    name: 'vpeNet',
    iconfont: 'icon-cloud',
    color: '#93C0FE',
    label: 'VPE网络',
  },
  {
    name: 'extNet',
    iconfont: 'icon-cloud',
    color: '#FFE4BA',
    label: '外部网络',
  },
  {
    name: 'hubNet',
    iconfont: 'icon-cloud',
    color: '#ccc',
    label: 'HUB网络',
  },
  {
    name: 'vpe',
    iconfont: 'vpe-legend-icon',
    color: '#C396ED',
    label: 'VPE',
  },
  {
    name: 'hub',
    iconfont: 'icon-routers',
    color: '#C396ED',
    label: 'HUB',
  },

])
const vpeLegend = reactive([
  {
    name: 'vpe',
    iconfont: 'vpe-legend-icon',
    color: '#C396ED',
    label: 'VPE',
  },
  {
    name: 'site',
    iconfont: 'icon-custom-site',
    color: '#E0E0E0',
    label: '站点',
  },
  {
    name: 'hub',
    iconfont: 'icon-routers',
    color: '#C396ED',
    label: 'HUB',
  },
  {
    name: 'cpe',
    iconfont: 'icon-router22',
    color: '#82C0F9',
    label: 'CPE',
  },
  {
    name: 'nomal',
    iconfont: 'link-nomal',
    color: '#72E672',
    label: '正常',
  },
  {
    name: 'abnomal',
    iconfont: 'link-abnomal',
    color: '#F45B5B',
    label: '异常',
  },
  {
    name: 'vpn',
    iconfont: 'vpn-link',
    color: '#454545',
    label: '公网链路',
  },
  {
    name: 'mstp',
    iconfont: 'mstp-link',
    color: '#454545',
    label: '专线链路',
  },
])
const hubNetLegend = reactive([
  {
    name: 'hub',
    iconfont: 'icon-routers',
    color: '#C396ED',
    label: 'HUB',
  },
  {
    name: 'nomal',
    iconfont: 'link-nomal',
    color: '#72E672',
    label: '正常',
  },
  {
    name: 'abnomal',
    iconfont: 'link-abnomal',
    color: '#F45B5B',
    label: '异常',
  },
  {
    name: 'vpn',
    iconfont: 'vpn-link',
    color: '#454545',
    label: '公网链路',
  },
  {
    name: 'mstp',
    iconfont: 'mstp-link',
    color: '#454545',
    label: '专线链路',
  },
])
const legendData = computed(() => {
  if (props.legendType === 'network') {
    return networkLegend
  }
  else if (props.legendType === 'vpe') {
    return vpeLegend
  }
  else if (props.legendType === 'hubnet') {
    return hubNetLegend
  }
  else {
    return vpeLegend.slice(1)
  }
})
</script>

<template>
  <div class="topo-legend-wrap">
    <div class="topo-list">
      <div v-for="item in legendData" :key="item.name" class="topo-item">
        <span
          class="topo-item-icon iconfont"
          :class="item.iconfont" :style="{ color: item.color }"
        />
        <span class="topo-item-name">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.topo-legend-wrap {
  position: absolute;
  top: 8px;
  right: 8px;
  line-height: 1.5;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0px 0px 5px #ddd;
  background-color: #fff;
  display: flex;
  align-items: center;
  transition: all .3s ease-in-out;

  .left-icon {
    height: 100%;
    margin-right: 5px;
    padding: 10px 0;
    border-radius: 3px;
    background-color: #f5f5f5;
  }

  .topo-item {
    display: flex;
    align-items: center;

    .icon-cloud,
    .icon-router22 {
      font-size: 18px;
    }

    .topo-item-name {
      margin-left: 10px;
      white-space: nowrap;
      font-size: 12px;

    }

    .vpe-legend-icon {
      display: inline-block;
      width: 18px;
      height: 12px;
      border: 1px solid #5f95ff;
      border-radius: 2px;
      position: relative;
      background: #fff;
    }

    .icon-routers {
      margin-left: 2px;
    }

    .vpe-legend-icon::after,
    .vpe-legend-icon::before {
      content: "";
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      position: absolute;
      border-radius: 2px;
      background-color: #5f95ff;
    }

    .vpe-legend-icon::after {
      animation: radar-animation 2s ease-out infinite;
    }

    .vpe-legend-icon::before {
      animation: radar-animation 2s ease-out 1s infinite;
    }

    .link-nomal {
      display: block;
      height: 2px;
      width: 18px;
      background-color: #72E672;
    }

    .link-abnomal {
      display: block;
      height: 2px;
      width: 18px;
      background-color: #F45B5B;
    }

    .icon-custom-site {
      display: inline-block;
      width: 18px;
      height: 12px;
      border: 1px dashed rgb(192, 190, 190);
      background: #f5f5f5;
    }

    //背景色黑白相间
    .vpn-link {
      display: inline-block;
      width: 18px;
      height: 0px;
      border-bottom: 2px dashed #454545;
    }

    //背景色黑白相间
    .mstp-link {
      display: inline-block;
      width: 18px;
      height: 0px;
      border-bottom: 2px solid #454545;
    }
  }
}

@keyframes radar-animation {

  //雷达图动画
  0% {
    transform: scale(1);
    opacity: 0.6;
  }

  100% {
    transform: scale(1.5);
    opacity: 0.1;
  }
}
</style>
