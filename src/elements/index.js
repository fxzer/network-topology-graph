import { ExtensionCategory, register } from '@antv/g6'
import animateLine from '@/elements/edges/animate-line'
import iconfontHub from '@/elements/nodes/hub'
import vpe from '@/elements/nodes/vpe'
import cpe from '@/elements/nodes/cpe'
import cloud from '@/elements/combos/cloud'
import extcloud from '@/elements/combos/extcloud'

// 共同节点注册
export function commonRegister() {
  // 注册实线动画
  // register(ExtensionCategory.EDGE, 'animate-line', animateLine, 'line')
  // 注册HUB节点
  register(ExtensionCategory.NODE, 'iconfontHub', iconfontHub)
  // VPE节点
  register(ExtensionCategory.NODE, 'vpe-rect-animate', vpe, 'rect')
}
// 弹窗特有节点注册
export function dialogRegister() {
  // 注册CPE节点
  // register(ExtensionCategory.NODE, 'iconfontCpe', cpe)
}

// 网络拓扑总览特有节点注册
export function viewRegister() {
  // 注册VPE combos
  // register(ExtensionCategory.COMBO, 'cloudCombo', cloud, 'single-combo')
  // register(ExtensionCategory.COMBO, 'cloudComboExt', extcloud, 'single-combo')
}

// // 节点文本溢出省略
// export function fittingString(str, maxWidth, fontSize) {
//   const ellipsis = '...'
//   // const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0]
//   // let currentWidth = 0
//   // let res = str
//   // const pattern = new RegExp("[\u4E00-\u9FA5]+")
//   // str.split("").forEach((letter, i) => {
//   // 	if (currentWidth > maxWidth - ellipsisLength) return
//   // 	if (pattern.test(letter)) {
//   // 		currentWidth += fontSize
//   // 	} else {
//   // 		currentWidth += G6.Util.getLetterWidth(letter, fontSize)
//   // 	}
//   // 	if (currentWidth > maxWidth - ellipsisLength) {
//   // 		res = `${str.substr(0, i)}${ellipsis}`
//   // 	}
//   // })
//   return res
// }
