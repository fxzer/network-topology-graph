export default {
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
            "uuid": "a5777c38580a42e0a367815bd1c2c111",
            "name": "HUB-CPE-11",
            "linkCount": 3
          },
          {
            "uuid": "f53b1c4faffd4606954a7db9cea2a2e9",
            "name": "CPE-3",
            "linkCount": 0
          },
          {
            "uuid": "f53b1c4faffd4606954a7db9cea41222",
            "name": "HUB-CPE-2",
            "linkCount": 0
          }
        ],
        "hubLinks": []
      },
      {
        "uuid": "6f3ac044b6cb4750b62a4ef0d1d52111",
        "name": "HUB网络二",
        "connectVpe": true,
        "hubs": [
          {
            "uuid": "f53b1c4faffd4606954a7db9cea41555",
            "name": "HUB-H",
            "linkCount": 0
          },
          {
            "uuid": "f13b1c4faffd4606954a7db9cea41555",
            "name": "HUB-A",
            "linkCount": 0
          },
          {
            "uuid": "f23b1c4faffd4606954a7db9cea41555",
            "name": "HUB-B",
            "linkCount": 0
          },
          {
            "uuid": "f33b1c4faffd4606954a7db9cea41555",
            "name": "HUB-C",
            "linkCount": 0
          },
          {
            "uuid": "f73b1c4faffd4606954a7db9cea41555",
            "name": "HUB-D",
            "linkCount": 0
          },
        ],
        "hubLinks": []
      },
      {
        "uuid": "913ac044b6cb4750b62a4ef0d1d52111",
        "name": "HUB网络三",
        "connectVpe": true,
        "hubs": [
          {
            "uuid": "f53b194faffd4606954a7db9cea41555",
            "name": "HUB-H",
            "linkCount": 0
          },
          {
            "uuid": "f13b1c9faffd4606954a7db9cea41555",
            "name": "HUB-A",
            "linkCount": 0
          },
          {
            "uuid": "f23b1c4faffd4606954a7db9cea41955",
            "name": "HUB-B",
            "linkCount": 0
          },
          {
            "uuid": "f33b1c49affd4606954a7db9cea41555",
            "name": "HUB-C",
            "linkCount": 0
          },
          {
            "uuid": "f73b1c4f9ffd4606954a7db9cea41555",
            "name": "HUB-D",
            "linkCount": 0
          },
          {
            "uuid": "f73b1c419ffd4606954a7db9cea41555",
            "name": "HUB-G",
            "linkCount": 0
          },
          {
            "uuid": "f73b1c4f1ffd4606954a7db9cea41555",
            "name": "HUB-Y",
            "linkCount": 0
          },
        ],
        "hubLinks": []
      },
    ],
    "externalNetworks": []
}
