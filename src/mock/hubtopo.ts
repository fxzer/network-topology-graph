import { MockMethod } from "vite-plugin-mock";
export default [
{
  url: "/getHubTopo",
  method: "get",
  response: ({query}) => {
    console.log('[ query ]-7', query)
    return {
      "topo": {
        "cpes": [
          {
            "uuid": "a5777c38580a42e0a367815bd1c2c31f",
            "esn": "0cd7d4940000",
            "name": "CPE-4",
            "siteUuid": "7472d9ad68744d02a8d02374f8dcadc7",
            "siteName": "串接站点-2",
            "cpePriority": "High",
            "cpeRole": "Single",
            "linkRole": "Master",
            "linkType": "Vpn",
            "hub": false,
            "linkStatus": "Abnormal"
          },
          {
            "uuid": "ed569e6458674aebbb5ba98acaa8da16",
            "esn": "0cade3550000",
            "name": "VCPE",
            "siteUuid": "f8bb9526806b49419fbb1fd2f639c12c",
            "siteName": "VCPE-3",
            "cpePriority": "High",
            "cpeRole": "Single",
            "linkRole": "Master",
            "linkType": "Vpn",
            "hub": false,
            "linkStatus": "Abnormal"
          },
          {
            "uuid": "f53b1c4faffd4606954a7db9cea2a2e9",
            "esn": "0c3859100000",
            "name": "CPE-3",
            "siteUuid": "7432286bb14a4a8cbc8ddc096590e44a",
            "siteName": "HA站点-5",
            "cpePriority": "Low",
            "cpeRole": "Single",
            "linkRole": "Slave",
            "linkType": "Vpn",
            "hub": false,
            "linkStatus": "Abnormal"
          }
        ]
      },
      "success": true
    }
  }
}]