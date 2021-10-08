## React Fiber核心数据结构

### 参考

[React Fiber核心数据结构](https://github.com/hushicai/hushicai.github.io/issues/40)

[图解React源码 - React 应用的3种启动方式](https://juejin.cn/post/6992771308157141022)

[React源码解析（二）：React中的数据结构](http://www.lisireason.xyz/view/40)

[六个问题助你理解 React Fiber](https://juejin.cn/post/6984949525928476703)


 this.tag = tag;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.current = null;
  this.pingCache = null;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.callbackNode = null;
  this.callbackPriority = NoLanePriority;
  this.eventTimes = createLaneMap(NoLanes);
  this.expirationTimes = createLaneMap(NoTimestamp);
  this.pendingLanes = NoLanes;
  this.suspendedLanes = NoLanes;
  this.pingedLanes = NoLanes;
  this.expiredLanes = NoLanes;
  this.mutableReadLanes = NoLanes;
  this.finishedLanes = NoLanes;
  this.entangledLanes = NoLanes;
  this.entanglements = createLaneMap(NoLanes);

#####

  FiberRootNode (fiberRoot)

  createHostRootFiber

  createFiber(FiberNode) (hostRootFiber)

  tag = 3

  initializeUpdateQueue()

  queue = {} //对象

  unbatchedUpdates