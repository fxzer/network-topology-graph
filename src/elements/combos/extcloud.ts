export default {
  drawShape: function drawShape(cfg, group) {
    const str
        = 'M 448 102.875 c 0 -82.09 -56.678 -150.9 -132.996 -169.48 C 311.762 -195.305 206.546 -298.667 77.142 -298.667 c -75.792 0 -143.266 35.494 -186.854 90.732 c -24.442 -31.598 -62.69 -51.96 -105.708 -51.96 c -73.81 0 -133.642 59.874 -133.642 133.722 c 0 6.436 0.48 12.76 1.364 18.954 c -11.222 -2.024 -22.766 -3.138 -34.57 -3.138 C -489.266 -110.359 -576 -23.5707 -576 83.4853 C -576 190.547 -489.266 277.333 -382.27 277.333 l 656.262 0 l 0 -0.012 C 370.13 277.137 448 199.109 448 102.875 Z'
    const pathArr = str.split(' ')
    const opath = []
    pathArr.forEach((item) => {
      if (/[a-z]/i.test(item)) {
        opath.push([item])
      }
      else {
        opath[opath.length - 1].push(Number.parseFloat(item))
      }
    })

    opath.forEach((item) => {
      item.forEach((p, i) => {
        if (i > 0) {
          item[i] = item[i] / 5
        }
      })
    })
    const keyShape = group.addShape('path', {
      attrs: {
        ...cfg.style,
        width: cfg.style.width,
        height: cfg.style.height,
        path: opath,
      },
      id: cfg.id,
      name: 'cloud',
    })
    group.addShape('text', {
      attrs: {
        x: 0,
        y: 30,
        textAlign: 'center',
        text: cfg.label,
        fill: '#303133',
        fontSize: 18,
      },
      name: 'hubCombo-label',
    })
    return keyShape
  },
}
