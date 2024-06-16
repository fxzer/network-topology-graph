export default {
  afterDraw(cfg, group) {
    const { width, height, stroke, radius } = this.getShapeStyle(cfg)
    const x = -width / 2
    const y = -height / 2
    const back1 = group.addShape('rect', {
      zIndex: -3,
      attrs: {
        x,
        y,
        width,
        height,
        fill: stroke,
        opacity: 0.6,
        radius,
      },
      name: 'rback1-shape',
    })
    const back2 = group.addShape('rect', {
      zIndex: -2,
      attrs: {
        x,
        y,
        width,
        height,
        fill: stroke,
        opacity: 0.6,
        radius,
      },
      name: 'rback2-shape',
    })
    const back3 = group.addShape('circle', {
      zIndex: -1,
      attrs: {
        x,
        y,
        width,
        height,
        fill: stroke,
        opacity: 0.6,
        radius,
      },
      name: 'rback3-shape',
    })
    group.sort() // Sort according to the zIndex
    back1.animate(
      {
        width: width + 10,
        height: height + 10,
        opacity: 0.1,
        x: x - 5,
        y: y - 5,
      },
      {
        duration: 3000,
        easing: 'easeCubic',
        delay: -300,
        repeat: true, // repeat
      },
    ) // no delay
    back2.animate(
      {
        width: width + 10,
        height: height + 10,
        opacity: 0.1,
        x: x - 5,
        y: y - 5,
      },
      {
        duration: 3000,
        easing: 'easeCubic',
        delay: 1000,
        repeat: true, // repeat
      },
    ) // 1s delay
    back3.animate(
      {
        width: width + 10,
        height: height + 10,
        opacity: 0.1,
        x: x - 5,
        y: y - 5,
      },
      {
        duration: 3000,
        easing: 'easeCubic',
        delay: 2000,
        repeat: true, // repeat
      },
    ) // 3s delay
  },
}
