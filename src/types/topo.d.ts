 interface TopoData{
  vpes?:Array,
  hubNetworks?:Array,
  externalNetworks?:Array,
}
interface TopoResult{
  success:boolean,
  topo:TopoData
}
interface TopoCpeData{
  cpes?:Array,
}
interface TopoResultCpe{
  success:boolean,
  topo:TopoCpeData
}