
// 下一个要执行的任务
let nextUnitOfWork = null; // fiber

function render(vnode, container) {
  console.log("vnode", vnode); //sy-log
  // vnode - > node
  // const node = createNode(vnode);
  // // // node更新到container中
  // container.appendChild(node);
}
function isNumberOrString(str) {
  return typeof str === "number" || typeof str === "string";
}

function updateNode(node, nextVal) {
  const keys = Object.keys(nextVal).filter((key) => key !== "children");
  keys.forEach((key) => {
    node[key] = nextVal[key];
  });
}

function createNode(vnode) {
  let node;
  const { type } = vnode;

  if (typeof type === "string") {
    // 原生节点
    node = updateHostComponent(vnode);
  } else if (isNumberOrString(vnode)) {
    node = updateTextComponent(vnode);
  } else if (typeof type === 'function') {
    node = type.prototype.isReactComponent ? updateClassComponent(vnode) : updateFunctionComponent(vnode)
  }else if(typeof type === 'symbol'){
    if(Symbol.keyFor(type) === 'react.fragment'){
      node = updateFragmentComponent(vnode)
    }
  }
  return node;
}

function reconcileChildren(parentNode, children) {
  const newChildren = Array.isArray(children) ? children : [children];
  for (let i = 0; i < newChildren.length; i++) {
    render(newChildren[i], parentNode);
  }
}

function updateHostComponent(vnode) {
  const { type } = vnode;
  const node = document.createElement(type);
  updateNode(node, vnode.props);
  reconcileChildren(node, vnode?.props?.children || []);
  return node;
}

function updateTextComponent(vnode) {
  const node = document.createTextNode(`${vnode}`);
  return node;
}

function updateFunctionComponent(vnode) {
  const {type, props} = vnode;
  return createNode(type(props))
}
function updateClassComponent(vnode) {
  const {type, props} = vnode;
  return createNode(new type(props).render());
}
function updateFragmentComponent(vnode) {
  const node = document.createDocumentFragment();
  const childrens = vnode.props?.children || []
  reconcileChildren(node, childrens)
  return node
}

function performUnitOfWork(workInProgress) {
  // todo 执行当前任务
  
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

// 回调函数
function workLoop(IdleDeadline) {
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    //执行任务链
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // commit
  // if (!nextUnitOfWork && wipRoot) {
  //   commitRoot();
  // }
}
// var handle = 
window.requestIdleCallback(workLoop)

export default {
  render,
};
