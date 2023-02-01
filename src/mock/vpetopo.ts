import { MockMethod } from "vite-plugin-mock";
import cpes from "./cpes";
export default [
  {
    url: "/getVpeTopo",
    method: "get",
    response: ({query}) => {
      let vpeUuid = query.uuid
      let cpeList = cpes.filter(cpe => cpe.vpeUuid == vpeUuid)
      return {
        "topo": {
          "cpes": cpeList
        },
        "success": true
      }
    }
  }] as MockMethod[]