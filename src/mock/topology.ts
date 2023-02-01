import { MockMethod } from "vite-plugin-mock";
export default [
  {
    url: "/getTopoData",
    method: "get",
    response: () => {
      return {
        "topo": {
          "vpes": [
            {
              "uuid": "bf2ce45d73f54f7390517d5fb794a001",
              "name": "VPE1(北京)",
              "linkCount": 0
            },
            {
              "uuid": "d07742af3d7e42fcb8afc96720b8231b",
              "name": "VPE2(上海)",
              "linkCount": 2
            },
            {
              "uuid": "e6ccf850da8b4740a2e04588ade03c08",
              "name": "VPE3(武汉)",
              "linkCount": 4
            },
            {
              "uuid": "1fb8b24e4d3d4cfebf5feb345bf3aaf0",
              "name": "VPE4(深圳)",
              "linkCount": 6
            },
            {
              "uuid": "d07742af3d7e42fcb8afc96720b8238b",
              "name": "VPE5(香港)",
              "linkCount": 12
            },
            {
              "uuid": "d07742af3d7e42fcb8afc96720b8236b",
              "name": "VPE6(苏州)",
              "linkCount": 3
            }   
           
          ],

            //Hub网络
          "hubNetworks": [
            {
              "uuid": "6f3ac044b6cb4750b62a4ef0d1d5213b",
              "name": "HUB网络一",
              "connectVpe": true,
              "hubs": [
                {
                  "uuid": "1f0d2a3d1a324e148ab41648c59a611a",
                  "name": "CPE-2",
                  "RR": true,
                  "linkCount": 0
                }
              ],
              "hubLinks": []
            },
            {
              "uuid": "6f3ac044b6cb4750b62a4ef0d1d5214b",
              "name": "HUB网络二",
              "connectVpe": true,
              "hubs": [
                {
                  "uuid": "1f0d2a3d1a324e148ab41648c59a622a",
                  "name": "CPE-2",
                  "RR": true,
                  "linkCount": 0
                }
              ],
              "hubLinks": []
            },
            {
              "uuid": "6f3ac044b6cb4750b62a4ef0d1d5215b",
              "name": "HUB网络三",
              "connectVpe": true,
              "hubs": [
                {
                  "uuid": "1f0d2a3d1a324e148ab41648c59a333a",
                  "name": "CPE-2",
                  "RR": true,
                  "linkCount": 0
                }
              ],
              "hubLinks": []
            },
            {
              "uuid": "6f3ac044b6cb4750b62a4ef0d1d5216b",
              "name": "HUB网络三",
              "connectVpe": true,
              "hubs": [
                {
                  "uuid": "1f0d2a3d1a324e148ab41648c59a444a",
                  "name": "CPE-2",
                  "RR": true,
                  "linkCount": 0
                }
              ],
              "hubLinks": []
            },
            {
              "uuid": "6f3ac044b6cb4750b62a4ef0d1d5217b",
              "name": "HUB网络三",
              "connectVpe": true,
              "hubs": [
                {
                  "uuid": "1f0d2a3d1a324e148ab41648c59a555a",
                  "name": "CPE-2",
                  "RR": true,
                  "linkCount": 0
                }
              ],
              "hubLinks": []
            }
          ],
          "externalNetworks": []
        },
        success: true
      }
    }
  },
] as MockMethod[];
