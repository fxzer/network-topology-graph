import { MockMethod } from "vite-plugin-mock";
import hubCpes from "./cpes";
export default [
  {
    url: "/getHubTopo",
    method: "get",
    response: ({ query }) => {
      let cpes = hubCpes.filter(cpe =>  cpe.hubUuid == query.uuid)
      return {
        "topo": {
          "cpes": cpes
        },
        "success": true
      }
    }
  }] as MockMethod[]