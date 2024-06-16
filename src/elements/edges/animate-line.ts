export default {
  drawShape(cfg, group) {
    const self = this
    let shapeStyle = self.getShapeStyle(cfg)
    shapeStyle = Object.assign(shapeStyle, {
      opacity: 0,
      strokeOpacity: 0,
    })
    const keyShape = group.addShape('path', {
      attrs: shapeStyle,
      name: 'path-shape',
    })
    return keyShape
  },
  afterDraw(cfg, group) {
    const shape = group.get('children')[0]
    // 线条动画
    shape.animate(
      (ratio) => {
        const opacity = ratio * cfg.style.opacity
        const strokeOpacity = ratio * cfg.style.strokeOpacity
        return {
          opacity: ratio || opacity,
          strokeOpacity: ratio || strokeOpacity,
        }
      },
      {
        duration: 300,
      },
    )
    // 箭头动画
    const startPoint = shape.getPoint(0)
    const circle = group.addShape('circle', {
      attrs: {
        x: startPoint.x,
        y: startPoint.y,
        fill: '#1890ff',
        r: 2,
      },
      name: 'circle-shape',
    })
    circle.animate(
      (ratio) => {
        const tmpPoint = shape.getPoint(ratio)
        return {
          x: tmpPoint.x,
          y: tmpPoint.y,
        }
      },
      {
        repeat: true,
        duration: 3000,
      },
    )
  },
  setState(name, value, item) {
    const shape = item.get('keyShape')
    if (name === 'disappearing' && value) {
      shape.animate(
        (ratio) => {
          return {
            opacity: 1 - ratio,
            strokeOpacity: 1 - ratio,
          }
        },
        {
          duration: 200,
        },
      )
    }
    else if (name === 'dark') {
      if (value)
        shape.attr('opacity', 0.2)
      else shape.attr('opacity', 1)
    }
  },
}
