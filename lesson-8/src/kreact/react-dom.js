// 下一个要执行的任务
let nextUnitOfWork = null; // fiber
let wipRoot = null; //work in progress root: fiber

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

function updateNode(node, nextVal) {
  const keys = Object.keys(nextVal);
  // .filter((key) => key !== "children");
  keys.forEach((key) => {
    if (key === "children") {
      if (isNumberOrString(nextVal[key])) {
        node.textContent = nextVal[key];
      }
    } else {
      node[key] = nextVal[key];
    }
  });
}

function createNode(workInProgress) {
  const { type, props } = workInProgress;
  let node = document.createElement(type);
  updateNode(node, props)
  return node;
}

function reconcileChildren(workInProgress, children) {
  if (isStringOrNumber(children)) {
    return;
  }
  const newChildren = Array.isArray(children) ? children : [children];
  let previousNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    let newFiber = {
      key: child.key, // 属性的标记节点
      type: child.type,
      props: { ...child.props }, //属性
      stateNode: null,
      child: null,
      sibling: null,
      return: workInProgress,
    };
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
  const {type, props} = workInProgress;
  const child = type(props);
  reconcileChildren(workInProgress, child) 
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

function performUnitOfWork(workInProgress) {
  // todo 执行当前任务
  const { type } = workInProgress;
  if (typeof type === "string") {
    // 更新原生节点
    updateHostComponent(workInProgress);
  } else if(typeof type === "function"){
    updateFunctionComponent(workInProgress)
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

// 提交
function commitRoot() {
  commitWorker(wipRoot.child);
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
  if (workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode);
  }

  commitWorker(workInProgress.child);
  commitWorker(workInProgress.sibling);
}

// 回调函数
function workLoop(IdleDeadline) {
  // debugger;
  console.log("workLoop---");
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    //执行任务链
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  console.log('wipRoot', wipRoot)
  // commit
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}
// var handle =
window.requestIdleCallback(workLoop);

export default {
  render,
};
