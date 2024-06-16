export default {
  draw(cfg, group) {
    const { style, labelCfg: labelStyle, size } = cfg
    group.addShape('circle', {
      attrs: {
        x: 0,
        y: size / 2,
        r: size,
      },
      name: 'hub-bg-shape',
    })
    // 添加图标
    const keyShape = group.addShape('text', {
      attrs: {
        x: 0,
        y: size / 2,
        fontFamily: 'iconfont',
        textAlign: 'center',
        text: cfg.text,
        fontSize: Math.round(size),
        ...style,
      },
      name: 'hub-shape',
    })
    // 添加label
    group.addShape('text', {
      attrs: {
        x: 0,
        y: Math.round(size / 4),
        textAlign: 'center',
        textBaseline: 'middle',
        text: cfg.label,
        ...labelStyle.style,
      },
      name: 'hub-label',
    })
    return keyShape
  },
}
