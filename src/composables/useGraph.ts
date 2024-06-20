// import type { Fullscreen } from '@antv/g6'
import { Graph } from '@antv/g6'

export function useGraph(data) {
  let graph = null
  const graphEl = ref(null)
  const { width, height } = useElementSize(graphEl)
  const { enter, exit } = useFullscreen(graphEl)
  const scope = effectScope()

  function render() {
    graph = new Graph({
      container: graphEl.value,
      width: width.value,
      height: height.value,
      data,
      autoFit: 'view',
      layout: {
        type: 'force-atlas2',
        preventOverlap: true,
        kr: 20,
        center: [250, 250],
      },
      combo: {
        type: 'rect',
        style: {
          size: 400,
        },
      },
      behaviors: ['zoom-canvas', 'drag-canvas'],
      autoResize: true,
      zoomRange: [0.1, 5],
      plugins: [
        {
          type: 'toolbar',
          key: 'toolbar',
          position: 'top-left',
          onClick: async (item) => {
            const zoom = graph.getZoom()
            if (item === 'zoom-in') {
              graph.zoomTo(zoom + 0.2)
            }
            if (item === 'zoom-out') {
              graph.zoomTo(zoom - 0.2)
            }
            if (item === 'auto-fit') {
              graph.fitView()
            }
            if (item === 'request-fullscreen') {
              enter()
            }
            if (item === 'exit-fullscreen') {
              exit()
            }
            if (item === 'export') {
              const a = document.createElement('a')
              a.href = await graph.toDataURL()
              a.download = 'graph.png'
              a.click()
            }
          },
          getItems: () => {
            return [
              { id: 'zoom-in', value: 'zoom-in' },
              { id: 'zoom-out', value: 'zoom-out' },
              { id: 'auto-fit', value: 'auto-fit' },
              { id: 'export', value: 'export' },
              { id: 'exit-fullscreen', value: 'exit-fullscreen' },
              { id: 'request-fullscreen', value: 'request-fullscreen' },
            ]
          },
        },
      ],

    })

    graph.render()
  }
  function resize() {
    graph.resize()
  }

  scope.run(() => {
    watch([width, height], () => {
      if (graphEl.value) {
        graph ? resize() : render()
      }
    })
  })
  onScopeDispose(() => {
    if (graph && !graph.destroyed) {
      graph.destroy()
      scope.stop()
    }
  })

  return {
    graph,
    graphEl,
  }
}
