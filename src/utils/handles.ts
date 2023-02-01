//处理网络拓扑自适应尺寸
export const fitViewHandler = (networkCount) => {
  let countToR = {
    1: 600,
    2: 500,
    3: 500,
    4: 360,
  };
  let countToPadding = {
    1: 300,
    2: 250,
    3: 50,
    4: 0,
  };
  let r = countToR[networkCount] ? countToR[networkCount] : 360;
  let viewPadding = countToPadding[networkCount] ? countToPadding[networkCount] : 0;
  return {
    r,
    viewPadding,
  };
}
//处理圆心坐标
export const getCirclePoint = ({ x = 0, y = 0 }, r, list,type='site') =>  {
  let angle = (2 * Math.PI) / list.length;
  let pointsObj = {};
  list?.forEach((item, index) => {
    let pdeg = parseFloat((angle * index).toFixed(2))
    let px = parseFloat((x + r * Math.cos(pdeg)).toFixed(2));
    let py = parseFloat((y + r * Math.sin(pdeg)).toFixed(2));
    //并行时增加横向间距
    if(type == 'hubnet'){
      if (py === y) {
        px =  px > x ?  px + 100 :  px - 100
      }
      pointsObj[item.uuid] = { x: px, y: py };
    }else  if(type == 'site'){
      pointsObj[item.siteUuid] = { x: px, y: py, deg: pdeg };
    }
  });
  return pointsObj;
} 

//收集站点数据
export const getSiteList = (cpeList) => {
  let siteList = [];
  cpeList.forEach((cpe) => {
    let isNotExist = !siteList.find((site) => site.siteUuid === cpe.siteUuid);
    if (isNotExist) {
      siteList.push({
        siteUuid: cpe.siteUuid,
        siteName: cpe.siteName,
      });
    }
  });
  return siteList;
}

//获取二级CPE节点坐标
export const getLevel2Point = ({ x = 0, y = 0, deg = 0 }, r, siteList) => {
  //从给的角度开始对称往两边画
  let angle
  if (siteList.length === 1) {
    angle = 0
  }
  let pointsObj = {};
  if (siteList.length % 2 === 0) {
    //偶数
    angle = parseFloat(( Math.PI / siteList.length).toFixed(2));
    let halfAngle = parseFloat((angle / 2).toFixed(2));
    siteList?.forEach((site, index) => {
      let isEven = index % 2 === 0;
      let offsetNum = Math.floor((index / 2))
      let pdeg = isEven ? deg + halfAngle + angle * offsetNum : deg - halfAngle - angle * offsetNum;
      let px = x + r * Math.cos(pdeg);
      let py = y + r * Math.sin(pdeg);
      pointsObj[site.siteUuid] = { x: px, y: py, deg: pdeg, siteName: site.siteName };
    })
  } else {  //奇数个
    angle = parseFloat((Math.PI / siteList.length - 1).toFixed(2));
    siteList?.forEach((site, index) => {
      let isEven = index % 2 === 0;
      let offsetNum = Math.ceil(index / 2);
      let pdeg = isEven ? deg + angle * offsetNum : deg - angle * offsetNum;
      let px = x + r * Math.cos(pdeg);
      let py = y + r * Math.sin(pdeg);
      pointsObj[site.siteUuid] = { x: px, y: py, deg: pdeg };

    });
  }
  return pointsObj;
}

//对不同CPE角色处理的坐标
export const cpeCoordsHandler = (siteCoors, siteUuid, cpePriority, isExistSlave = false, height) => {
  let x = 0, y = 0;
  let { x: cx, y: cy, deg } = siteCoors[siteUuid]
  let cpePriorityMap = {
    High: -24,
    Low: 24,
    Single: 0
  }
  //存在备CPE则错开位置
  cpePriority = isExistSlave ? cpePriority : 'Single'
  if (cy === height / 2) {
    //在同一水平线上
    x = Math.round(cx);
    y = cy + cpePriorityMap[cpePriority];
  } else {
    x = cx + cpePriorityMap[cpePriority];
    y = Math.round(cy);
  }
  return { x, y, deg };
}
//去重
export const uniqueFunc = (arr, id) => {
  const map = new Map();
  return arr.filter((item) => !map.has(item[id]) && map.set(item[id], 1)) || [];
}

