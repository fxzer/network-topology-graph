export default {
    draw(cfg, group) {
      const { style, labelCfg: labelStyle } = cfg
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
        name: 'cpe-shape',
      })
      // 添加label
      group.addShape('text', {
        attrs: {
          x: 0,
          y: 10,
          textAlign: 'center',
          text: cfg.label,
          ...labelStyle.style,
        },
        name: 'cpe-label',
      })

      return keyShape
    },
    afterDraw(cfg, group) {
      const shape = group.get('children')[0]
      shape.animate(
        (ratio) => {
          let text = '\uE604'
          if (ratio > 0.6) {
            text = '\uE604'
          }
          else if (ratio > 0.3) {
            text = '\uE606'
          }
          else {
            text = '\uE605'
          }
          return {
            text,
          }
        },
        {
          repeat: true,
          duration: 1500,
          delay: 3000,
          // easing: 'easeCubic',
        },
      )
    },
  }
