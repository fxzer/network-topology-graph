// 处理每个根节点的大小
export function mapNodeSize(nodes, propertyName, visualRange) {
  let minp = 9999999999
  let maxp = -9999999999
  nodes.forEach((node) => {
    // node.childrenNum
    minp = node[propertyName] < minp ? node[propertyName] : minp
    maxp = node[propertyName] > maxp ? node[propertyName] : maxp
  })
  // 实际范围
  const rangepLength = maxp - minp
  // 给定范围
  const rangevLength = visualRange[1] - visualRange[0]

  nodes.forEach((node) => {
    node.size = ((node[propertyName] - minp) / rangepLength) * rangevLength + visualRange[0]
  })
}
// 在CPE节点上添加VPE节点连接情况
export function dealCpeNodes(cpes, links) {
  return cpes.map((cpe) => {
    links.forEach((link) => {
      if (cpe.uuid === link.cpeUuid) {
        if (cpe.tags) {
          cpe.tags.push(`root-${link.vpeUuid}`)
        }
        else {
          cpe.tags = [`root-${link.vpeUuid}`]
        }
      }
    })
    const cpeNode = {
      id: cpe.uuid,
      name: cpe.name,
      description: cpe.siteName,
      level: 2,
      isLeaf: true,
      type: 'iconfont',
      text: '\uE7D9',
      tags: Array.from(new Set(cpe.tags)),
      labelCfg: {
        style: {
          fill: '#595959',
          fontSize: 10,
        },
        offset: 30,
      },
    }
    return cpeNode
  })
}

// 两个对象数组按id对应合并
export function dealChildrenNum(vpeNodes, numMap) {
  vpeNodes.forEach((vpeNode) => {
    Object.keys(numMap).forEach((vpeUuid) => {
      if (vpeNode.id === vpeUuid && numMap[vpeUuid]) {
        vpeNode.childrenNum = numMap[vpeUuid].size
      }
    })

    if (!vpeNode.childrenNum) {
      vpeNode.childrenNum = 0
    }
  })
  return vpeNodes
}
