
function render(vnode, container) {
  console.log('vnode', vnode)
  const node = createNode(vnode)
  // node更新到container中
  container.appendChild(node)
}
const symbolFor = Symbol.for;
const REACT_FRAGMENT_TYPE = symbolFor('react.fragment');

function isStringOrNumber(sth) {
  return typeof sth === "string" || typeof sth === "number";
}
function createNode(vnode) {
  let node;
  const {type} = vnode
  console.log('type', type)
  console.log('vnode', vnode) 
  if(typeof type === 'string'){
    // 原生节点
    node = updataeHostElement(vnode)
  }else if(isStringOrNumber(vnode)) {
    // 节点是字符串或者数字的 
    node = updateTextComponent(vnode);
  }else if(typeof type === "function"){
    // 再判断是函数组件还是类组件
    node = type.prototype.isReactComponent
      ? updateClassComponent(vnode)
      : updateFunctionComponent(vnode)
  }else if(type === REACT_FRAGMENT_TYPE){
    node = updateFragmentComponent(vnode); 
  }
  return node
}

// 更新节点的属性
function updateNode(node, nextVal) {
  // style的 没有单独处理
  Object.keys(nextVal)
    .filter((k) => k !== "children") // 过滤掉孩子节点
    .forEach((k) => {
      node[k] = nextVal[k];
    });
}

// 原生节点
function updataeHostElement(vnode) {
  const {type, props} = vnode
  const node = document.createElement(type);
  updateNode(node, props)
  reconcileChildren(node, props.children)
  return node
}

// 文本节点
function updateTextComponent(vnode) {
  const node = document.createTextNode(vnode + "");
  return node;
}

// fragment
function updateFragmentComponent(vnode) {
  const {type, props} = vnode
  const node = document.createDocumentFragment()
  reconcileChildren(node, props.children)
  return node
}

// 函数组件
function updateFunctionComponent(vnode) {
  const {type, props} = vnode;
  const child = type(props); // 执行函数 返回vnode
  // vnode->node
  const node = createNode(child);
  return node;
}

// 类组件
function updateClassComponent(vnode) {
  const {type, props} = vnode;
  const instance = new type(props); // new 出类的实例
  const child = instance.render(); // 执行类实例的render方法

  // vnode->node
  const node = createNode(child);
  return node;
}

// 递归调用
function reconcileChildren(parentNode, children){
  // 这个是为了方便遍历
  const newChildren = Array.isArray(children) ? children : [children];
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    // 遍历vnode
    // vnode->node, parentNode.appendChild(node)
    render(child, parentNode);
  }
}

export default {
  render
}