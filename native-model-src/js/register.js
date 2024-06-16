// 注册节点

G6.registerNode(
  'bubble',
  {
    drawShape(cfg, group) {
      const self = this
      const r = cfg.size / 2
      // a circle by path
      const path = [
        ['M', -r, 0],
        ['C', -r, r / 2, -r / 2, r, 0, r],
        ['C', r / 2, r, r, r / 2, r, 0],
        ['C', r, -r / 2, r / 2, -r, 0, -r],
        ['C', -r / 2, -r, -r, -r / 2, -r, 0],
        ['Z'],
      ]
      const keyShape = group.addShape('path', {
        attrs: {
          x: 0,
          y: 0,
          path,
          fill: cfg.color || 'steelblue',
        },
        name: 'path-shape',
      })

      const mask = group.addShape('path', {
        attrs: {
          x: 0,
          y: 0,
          path,
          opacity: 0.25,
          fill: cfg.color || 'steelblue',
          shadowColor: cfg.color.split(' ')[2].substr(2),
          shadowBlur: 40,
          shadowOffsetX: 0,
          shadowOffsetY: 30,
        },
        name: 'mask-shape',
      })

      const spNum = 10 // split points number
      const directions = []
      const rs = []
      self.changeDirections(spNum, directions)
      for (let i = 0; i < spNum; i++) {
        const rr = r + directions[i] * ((Math.random() * r) / 1000) // +-r/6, the sign according to the directions
        if (rs[i] < 0.97 * r)
          rs[i] = 0.97 * r
        else if (rs[i] > 1.03 * r)
          rs[i] = 1.03 * r
        rs.push(rr)
      }
      keyShape.animate(
        () => {
          const path = self.getBubblePath(r, spNum, directions, rs)
          return { path }
        },
        {
          repeat: true,
          duration: 1000,
        },
      )

      const directions2 = []
      const rs2 = []
      self.changeDirections(spNum, directions2)
      for (let i = 0; i < spNum; i++) {
        const rr = r + directions2[i] * ((Math.random() * r) / 1000) // +-r/6, the sign according to the directions
        if (rs2[i] < 0.97 * r)
          rs2[i] = 0.97 * r
        else if (rs2[i] > 1.03 * r)
          rs2[i] = 1.03 * r
        rs2.push(rr)
      }
      mask.animate(
        () => {
          const path = self.getBubblePath(r, spNum, directions2, rs2)
          return { path }
        },
        {
          repeat: true,
          duration: 10000,
        },
      )
      return keyShape
    },
    changeDirections(num, directions) {
      for (let i = 0; i < num; i++) {
        if (!directions[i]) {
          const rand = Math.random()
          const dire = rand > 0.5 ? 1 : -1
          directions.push(dire)
        }
        else {
          directions[i] = -1 * directions[i]
        }
      }
      return directions
    },
    getBubblePath(r, spNum, directions, rs) {
      const path = []
      const cpNum = spNum * 2 // control points number
      const unitAngle = (Math.PI * 2) / spNum // base angle for split points
      let angleSum = 0
      const sps = []
      const cps = []
      for (let i = 0; i < spNum; i++) {
        const speed = 0.001 * Math.random()
        rs[i] = rs[i] + directions[i] * speed * r // +-r/6, the sign according to the directions
        if (rs[i] < 0.97 * r) {
          rs[i] = 0.97 * r
          directions[i] = -1 * directions[i]
        }
        else if (rs[i] > 1.03 * r) {
          rs[i] = 1.03 * r
          directions[i] = -1 * directions[i]
        }
        const spX = rs[i] * Math.cos(angleSum)
        const spY = rs[i] * Math.sin(angleSum)
        sps.push({ x: spX, y: spY })
        for (let j = 0; j < 2; j++) {
          const cpAngleRand = unitAngle / 3
          const cpR = rs[i] / Math.cos(cpAngleRand)
          const sign = j === 0 ? -1 : 1
          const x = cpR * Math.cos(angleSum + sign * cpAngleRand)
          const y = cpR * Math.sin(angleSum + sign * cpAngleRand)
          cps.push({ x, y })
        }
        angleSum += unitAngle
      }
      path.push(['M', sps[0].x, sps[0].y])
      for (let i = 1; i < spNum; i++) {
        path.push([
          'C',
          cps[2 * i - 1].x,
          cps[2 * i - 1].y,
          cps[2 * i].x,
          cps[2 * i].y,
          sps[i].x,
          sps[i].y,
        ])
      }
      path.push(['C', cps[cpNum - 1].x, cps[cpNum - 1].y, cps[0].x, cps[0].y, sps[0].x, sps[0].y])
      path.push(['Z'])
      return path
    },
    setState(name, value, item) {
      const shape = item.get('keyShape')
      if (name === 'dark') {
        if (value) {
          if (shape.attr('fill') !== '#fff') {
            shape.oriFill = shape.attr('fill')
            const uColor = unlightColorMap.get(shape.attr('fill'))
            shape.attr('fill', uColor)
          }
          else {
            shape.attr('opacity', 0.2)
          }
        }
        else {
          if (shape.attr('fill') !== '#fff') {
            shape.attr('fill', shape.oriFill || shape.attr('fill'))
          }
          else {
            shape.attr('opacity', 1)
          }
        }
      }
    },
  },
  'single-node',
)
G6.registerNode(
  'animate-circle',
  {
    setState(name, value, item) {
      const shape = item.get('keyShape')
      const label = shape.get('parent').get('children')[1]
      // 节点消失动画
      if (name === 'disappearing' && value) {
        // 节点消失动画
        shape.animate(
          (ratio) => {
            return {
              opacity: 1 - ratio,
              r: shape.attr('r') * (1 - ratio),
            }
          },
          {
            duration: 400,
          },
        )
        // label消失动画
        label.animate(
          (ratio) => {
            return {
              opacity: 1 - ratio,
            }
          },
          {
            duration: 300,
          },
        )
        // 节点出现动画
      }
      else if (name === 'appearing' && value) {
        const r = item.getModel().size / 2
        shape.animate(
          (ratio) => {
            return {
              opacity: ratio,
              r: r * ratio,
              fill: shape.attr('fill'),
            }
          },
          {
            duration: 300,
          },
        )
        label.animate(
          {
            onFrame(ratio) {
              return {
                opacity: ratio,
              }
            },
          },
          {
            duration: 300,
          },
        )
      }
      else if (name === 'dark') {
        if (value) {
          if (shape.attr('fill') !== '#fff') {
            shape.oriFill = shape.attr('fill')
            const uColor = unlightColorMap.get(shape.attr('fill'))
            shape.attr('fill', uColor)
          }
          else {
            shape.attr('opacity', 0.2)
            label.attr('fill', '#A3B1BF')
          }
        }
        else {
          if (shape.attr('fill') !== '#fff') {
            shape.attr('fill', shape.oriFill || shape.attr('fill'))
          }
          else {
            shape.attr('opacity', 1)
            label.attr('fill', '#697B8C')
          }
        }
      }
    },
  },
  'circle',
)
// 使用阿里图标
G6.registerNode('iconfont', {
  draw(cfg, group) {
    const { backgroundConfig: backgroundStyle, style, labelCfg: labelStyle } = cfg

    // 无背景样式则默认圆形
    const labelY = Math.round(cfg.size)
    if (backgroundStyle) {
      group.addShape('circle', {
        attrs: {
          x: 0,
          y: 0,
          r: cfg.size,
          ...backgroundStyle,
        },
        name: 'circle-shape',
      })
    }
    // 添加图标
    const keyShape = group.addShape('text', {
      attrs: {
        x: 0,
        y: 0,
        fontFamily: 'iconfont',
        textAlign: 'center',
        textBaseline: 'middle',
        text: cfg.text,
        fontSize: cfg.size,
        ...style,
      },
      name: 'text-shape1',
    })
    // 添加label
    group.addShape('text', {
      attrs: {
        x: 0,
        y: Math.round(labelY / 5),
        textAlign: 'center',
        text: cfg.label,
        ...labelStyle.style,
      },
      name: 'text-shape1',
    })

    return keyShape
  },
})
G6.registerEdge(
  'animate-line',
  {
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
          // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
          // get the position on the edge according to the ratio
          const tmpPoint = shape.getPoint(ratio)
          // returns the modified configurations here, x and y here
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          }
        },
        {
          repeat: true, // Whether executes the animation repeatly
          duration: 3000, // the duration for executing once
        },
      )
      // jies
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
  },
  'line',
)
