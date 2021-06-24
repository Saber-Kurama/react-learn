import { Placement, Update } from "./const";

// 下一个要执行的任务
let nextUnitOfWork = null; // fiber
let wipRoot = null; //work in progress root: fiber
let currentRoot = null;
let wipFiber = null;

/*
fiber 节点的数据结构 
fiberProps {
  child: ; // 第一个子节点
  sibling: ; // 下一个兄弟节点
  return: ; // 父节点
  stateNode: ; // 在原生标签里，指的就是dom节点
  alternate: ; // 上一个老的fiber节点
}
*/

function isStringOrNumber(sth) {
  return typeof sth === "string" || typeof sth === "number";
}

function render(vnode, container) {
  console.log("vnode", vnode); //sy-log
  // vnode - > node
  // const node = createNode(vnode);
  // // // node更新到container中
  // container.appendChild(node);
  wipRoot = {
    type: "div",
    props: { children: { ...vnode } },
    stateNode: container,
  };
  nextUnitOfWork = wipRoot;
}
function isNumberOrString(str) {
  return typeof str === "number" || typeof str === "string";
}

// function updateNode(node, nextVal) {
//   const keys = Object.keys(nextVal);
//   // .filter((key) => key !== "children");
//   keys.forEach((key) => {
//     if (key === "children") {
//       if (isNumberOrString(nextVal[key])) {
//         node.textContent = nextVal[key];
//       }
//     } else if (key.slice(0, 2) === "on") {
//       // 事件
//       const eventName = key.slice(2).toLowerCase();
//       node.addEventListener(eventName, nextVal[key]);
//     } else {
//       node[key] = nextVal[key];
//     }
//   });
// }

function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal)
    // .filter(k => k !== "children")
    .forEach((k) => {
      if (k === "children") {
        // 有可能是文本
        if (isNumberOrString(prevVal[k])) {
          node.textContent = "";
        }
      } else if (k.slice(0, 2) === "on") {
        const eventName = k.slice(2).toLocaleLowerCase();
        node.removeEventListener(eventName, prevVal[k]);
      } else {
        if (!(k in nextVal)) {
          node[k] = "";
        }
      }
    });

  Object.keys(nextVal)
    // .filter(k => k !== "children")
    .forEach((k) => {
      if (k === "children") {
        // 有可能是文本
        if (isNumberOrString(nextVal[k])) {
          node.textContent = nextVal[k] + "";
        }
      } else if (k.slice(0, 2) === "on") {
        const eventName = k.slice(2).toLocaleLowerCase();
        node.addEventListener(eventName, nextVal[k]);
      } else {
        node[k] = nextVal[k];
      }
    });
}

function createNode(workInProgress) {
  const { type, props } = workInProgress;
  let node = document.createElement(type);
  updateNode(node, {},  props);
  return node;
}

function reconcileChildren(workInProgress, children) {
  if (isStringOrNumber(children)) {
    return;
  }
  const newChildren = Array.isArray(children) ? children : [children];
  let previousNewFiber = null;
  let oldFiber = workInProgress.alternate && workInProgress.alternate.child;
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    let same =
      child &&
      oldFiber &&
      child.type === oldFiber.type &&
      child.key === oldFiber.key;
    let newFiber;
    if (same) {
      // 复用
      newFiber = {
        key: child.key, // 属性的标记节点
        type: child.type,
        props: { ...child.props }, //属性
        stateNode: oldFiber.stateNode,
        child: null,
        sibling: null,
        return: workInProgress,
        alternate: oldFiber, //
        flag: Update,
      };
    }
    if (!same && child) {
      // 新增
      newFiber = {
        key: child.key, // 属性的标记节点
        type: child.type,
        props: { ...child.props }, //属性
        stateNode: null,
        child: null,
        sibling: null,
        return: workInProgress,
        flag: Placement,
      };
    }

    if (!same && !child) {
      // 删除
    }

    // 链表 继续
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (i === 0) {
      workInProgress.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
    // render(newChildren[i], parentNode);
  }
}

function updateHostComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    // dom节点
    workInProgress.stateNode = createNode(workInProgress);
  }
  reconcileChildren(workInProgress, workInProgress.props.children);
  // return node;
}

// function updateTextComponent(vnode) {
//   const node = document.createTextNode(`${vnode}`);
//   return node;
// }

function updateFunctionComponent(workInProgress) {
  wipFiber = workInProgress;
  wipFiber.hooks = [];
  wipFiber.hookIndex = 0;
  const { type, props } = workInProgress;
  const child = type(props);
  reconcileChildren(workInProgress, child);
}
// function updateClassComponent(vnode) {
//   const {type, props} = vnode;
//   return createNode(new type(props).render());
// }
// function updateFragmentComponent(vnode) {
//   const node = document.createDocumentFragment();
//   const childrens = vnode.props?.children || []
//   reconcileChildren(node, childrens)
//   return node
// }

// 执行工作担心
function performUnitOfWork(workInProgress) {
  // todo 执行当前任务
  const { type } = workInProgress;
  // 原生节点
  if (typeof type === "string") {
    // 更新原生节点
    updateHostComponent(workInProgress);
  } else if (typeof type === "function") {
    // 函数组件
    updateFunctionComponent(workInProgress);
  }
  // 返回 下一个任务
  if (workInProgress.child) {
    return workInProgress.child;
  }

  let nextFiber = workInProgress;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

// 提交 添加到 dom上
function commitRoot() {
  console.log("wipRoot.child", wipRoot.child);
  commitWorker(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWorker(workInProgress) {
  if (!workInProgress) {
    return;
  }

  // 怎么寻找父节点
  let parentNodeFiber = workInProgress.return; // fiber
  while (!parentNodeFiber.stateNode) {
    parentNodeFiber = parentNodeFiber.return;
  }
  let parentNode = parentNodeFiber.stateNode;
  // if (workInProgress.stateNode) {
  //   console.log('??????', workInProgress.stateNode)
  //   parentNode.appendChild(workInProgress.stateNode);
  // }

  // 插入
  if (workInProgress.flag & Placement && workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode);
  } else if (workInProgress.flag & Update && workInProgress.stateNode) {
    // 更新属性
    updateNode(
      workInProgress.stateNode,
      workInProgress.alternate.props,
      workInProgress.props
    );
  }

  commitWorker(workInProgress.child);
  commitWorker(workInProgress.sibling);
}

// 回调函数
function workLoop(IdleDeadline) {
  // debugger;
  // console.log("workLoop---");
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    //执行任务链
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  // console.log('wipRoot', wipRoot)
  // commit
  if (!nextUnitOfWork && wipRoot) {
    console.log("???");
    commitRoot();
  }
  window.requestIdleCallback(workLoop);
}
// var handle =
window.requestIdleCallback(workLoop);

export function useState(init) {
  // 区分初次渲染还是 更新
  const oldHook =
    wipFiber.alternate && wipFiber.alternate.hooks[wipFiber.hookIndex];
  if (oldHook) {
  }
  const hook = oldHook
    ? {
        state: oldHook.state,
        queue: oldHook.queue,
      }
    : {
        state: init,
        queue: [],
      };

  const setState = (action) => {
    hook.queue.push(action);
    // 假的
    wipRoot = {
      type: currentRoot.type,
      stateNode: currentRoot.stateNode,
      props: currentRoot.props,
      // child: currentRoot.child,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
  };

  // 实现批量更新

  hook.queue.forEach((action) => {
    hook.state = action;
  });
  wipFiber.hooks.push(hook);
  wipFiber.hookIndex++;
  return [hook.state, setState];
}

export default {
  render,
};
