let nextUnitOfWork; // 下一个工作单元
let wipRoot = null; //work in progress root: fiber
/**
  定义个fiber 的结构
  Fiber {
    tag: WorkTag // // 标记不同组件类型
    key: null | string, // 唯一标识
    elementType: any, // ReactElement.type，也就是我们调用createElement的第一个参数
    type: any, // 函数 类 和 原生
    stateNode: any, // 跟当前Fiber相关本地状态（比如浏览器环境就是DOM节点）
    
   // 连接关系
   return: Fiber | null,  // 父
   child: Fiber | null, // 第一个孩子
   sibling: Fiber | null, // 兄弟
   index: number,

   //
   // Input is the data coming into process this fiber. Arguments. Props.
   // fiber 的数据 参数 props
   // 新的变动带来的新的props
    pendingProps: any, // This type will be more specific once we overload the tag.
    // 上一次渲染完成之后的props
    memoizedProps: any, // The props used to create the output.

    // A queue of state updates and callbacks.
    // 该Fiber对应的组件产生的Update会存放在这个队列里面
    updateQueue: mixed,

    // The state used to create the output
    // 上一次渲染的时候的state
    memoizedState: any,
    // Dependencies (contexts, events) for this fiber, if it has any
    // 依赖项 上下文 事件
    dependencies: Dependencies | null

    // 用来描述当前Fiber和他子树的`Bitfield`
  // 共存的模式表示这个子树是否默认是异步渲染的
  // Fiber被创建的时候他会继承父Fiber
  // 其他的标识也可以在创建的时候被设置
  // 但是在创建之后不应该再被修改，特别是他的子Fiber创建之前
  mode: TypeOfMode,

   // Effect
  flags: Flags,  // 更新 添加等等
  subtreeFlags: Flags, // 更新 添加等等
  // 删除
  deletions: Array<Fiber> | null,

  // Singly linked list fast path to the next fiber with side-effects.
  // 单链表快速路径到具有副作用的下一个fiber
  nextEffect: Fiber | null,

  // The first and last fiber with side-effect within this subtree. This allows
  // us to reuse a slice of the linked list when we reuse the work done within
  // this fiber.
  //此子树中具有副作用的第一个和最后一个这个fiber。这允许
  //当我们重用链表中完成的工作时，我们重用链表的一部分
  //这个fiber。
  firstEffect: Fiber | null,
  lastEffect: Fiber | null,

  // 泳道 代替了之前的 expirationTime
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 在Fiber树更新的过程中，每个Fiber都会有一个跟其对应的Fiber
  // 我们称他为`current <==> workInProgress`
  // 在渲染完成之后他们会交换位置
  this.alternate = null;

  // 开启 enableProfilerTimer 后的一些属性
// Time spent rendering this Fiber and its descendants for the current update.
  // This tells us how well the tree makes use of sCU for memoization.
  // It is reset to 0 each time we render and only updated when we don't bailout.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualDuration?: number,

  // If the Fiber is currently active in the "render" phase,
  // This marks the time at which the work began.
  // This field is only set when the enableProfilerTimer flag is enabled.
  actualStartTime?: number,

  // Duration of the most recent render time for this Fiber.
  // This value is not updated when we bailout for memoization purposes.
  // This field is only set when the enableProfilerTimer flag is enabled.
  selfBaseDuration?: number,

  // Sum of base times for all descendants of this Fiber.
  // This value bubbles up during the "complete" phase.
  // This field is only set when the enableProfilerTimer flag is enabled.
  treeBaseDuration?: number,

  // Conceptual aliases
  // workInProgress : Fiber ->  alternate The alternate used for reuse happens
  // to be the same as work in progress.
  // __DEV__ only

  _debugSource?: Source | null,
  _debugOwner?: Fiber | null,
  _debugIsCurrentlyTiming?: boolean,
  _debugNeedsRemount?: boolean,

  // Used to verify that the order of hooks does not change between renders.
  _debugHookTypes?: Array<HookType> | null,
  }
 */

function render(vnode, container) {
  console.log("vnode", vnode);
  // const node = createNode(vnode);
  // // node更新到container中
  // container.appendChild(node);
  wipRoot = {
    type: "div",
    props: { children: { ...vnode } },
    stateNode: container,
  };
  console.log("wipRoot", wipRoot);
  nextUnitOfWork = wipRoot;
}
const symbolFor = Symbol.for;
const REACT_FRAGMENT_TYPE = symbolFor("react.fragment");

function isNumberOrString(str) {
  return typeof str === "number" || typeof str === "string";
}
function createNode(workInprogress) {
  const { type, props } = workInprogress;
  console.log("type", type);
  console.log("vnode", workInprogress);
  let node = document.createElement(type);
  updateNode(node, props);
  return node;

  // if (typeof type === "string") {
  //   // 原生节点
  //   node = updataeHostElement(vnode);
  // } else if (isStringOrNumber(vnode)) {
  //   // 节点是字符串或者数字的
  //   node = updateTextComponent(vnode);
  // } else if (typeof type === "function") {
  //   // 再判断是函数组件还是类组件
  //   node = type.prototype.isReactComponent
  //     ? updateClassComponent(vnode)
  //     : updateFunctionComponent(vnode);
  // } else if (type === REACT_FRAGMENT_TYPE) {
  //   node = updateFragmentComponent(vnode);
  // }
  // return node;
}

// 更新节点的属性
function updateNode(node, nextVal) {
  // style的 没有单独处理
  Object.keys(nextVal)
    // .filter((k) => k !== "children") // 过滤掉孩子节点
    .forEach((k) => {
      // node[k] = nextVal[k];
      if (k === "children") {
        if (isNumberOrString(nextVal[k])) {
          node.textContent = nextVal[k];
        }
      } else {
        node[k] = nextVal[k];
      }
    });
}

// 原生节点
function updateHostComponent(workInprogress) {
  console.log('updateHostComponent', workInprogress)
  if (!workInprogress.stateNode) {
    // 生成 dom 的节点
    workInprogress.stateNode = createNode(workInprogress);
  }
  reconcileChildren(workInprogress, workInprogress.props.children);
}

// 文本节点
function updateTextComponent(vnode) {
  const node = document.createTextNode(vnode + "");
  return node;
}

// fragment
function updateFragmentComponent(vnode) {
  const { type, props } = vnode;
  const node = document.createDocumentFragment();
  reconcileChildren(node, props.children);
  return node;
}

// 函数组件
function updateFunctionComponent(vnode) {
  const { type, props } = vnode;
  const child = type(props); // 执行函数 返回vnode
  // vnode->node
  const node = createNode(child);
  return node;
}

// 类组件
function updateClassComponent(vnode) {
  const { type, props } = vnode;
  const instance = new type(props); // new 出类的实例
  const child = instance.render(); // 执行类实例的render方法

  // vnode->node
  const node = createNode(child);
  return node;
}

// 递归调用 fiber 的 链表数据结构
function reconcileChildren(workInProgress, children) {
  // 这个是为了方便遍历
  const newChildren = Array.isArray(children) ? children : [children];
  let prevNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    // 创建 fiber 结构
    let newFiber = {
      // tag:
      key: child.key,
      type: child.type,
      stateNode: null,
      return: workInProgress,
      child: null,
      sibling: null,
      // pendingProps
      // 先暂时都是 props
      props: child.props,
    };
    if (i === 0) {
      workInProgress.child = newFiber;
    } else {
      prevNewFiber.sibling = newFiber;
    }
    prevNewFiber = newFiber;
  }
}

const performUnitOfWork = (workInProgress) => {
  // 1. 执行当前的 工作单元
  const { type } = workInProgress;
  console.log('performUnitOfWork', type)
  if (typeof type === "string") {
    // 原生组件
    updateHostComponent(workInProgress);
  }
  console.log("workInProgress======", workInProgress );
  // 2. 返回下一个工作单元
  // 举例 王朝故事
  if (workInProgress.child) {
    console.log('???>>>')
    return workInProgress.child;
  }
  let nextFiber = workInProgress;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
  return nextFiber; //这里返回一个 null
};
// 提交
function commitRoot() {
  commitWorker(wipRoot.child);
  wipRoot = null;
}
function commitWorker(workInProgress) {
  if (!workInProgress) {
    return;
  }
  // 问题是怎么查找父节点
  let parentNodeFiber = workInProgress.return;
  // 为什么循环
  while (!parentNodeFiber.stateNode) {
    parentNodeFiber = parentNodeFiber.return;
  }
  let parentNode = parentNodeFiber.stateNode;
  // 做的事情是 将dom 挂载到父节点中
  if (workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode);
  }
  commitWorker(workInProgress.child)
  commitWorker(workInProgress.sibling)
}

const workLopp = (IdleDaadline) => {
  console.log("workLopp----");
  // timeRemaining
  while (nextUnitOfWork && IdleDaadline.timeRemaining() > 1) {
    // 执行下一个工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  console.log('wipRoot', wipRoot)
  // commit
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
};

// 每次更新的话也调用这个？--->
// 渲染的初次执行 挂载的时候
window.requestIdleCallback(workLopp);

export default {
  render,
};
