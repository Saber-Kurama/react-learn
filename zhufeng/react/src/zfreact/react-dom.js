import { REACT_TEXT } from "./constants";

function render(vnode, container) {
  // 1. 虚拟dom 转换成 真实 dom
  const dom = createDOM(vnode, container);
  // 2. dom 添加到 容器中
  container.appendChild(dom);
}
export function mount(vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

function createDOM(vnode, container) {
  console.log("vnode", vnode);
  const { type, props } = vnode;
  let dom;
  if (type === REACT_TEXT) {
    dom = document.createTextNode(props.content);
  } else {
    // 原生组件
    dom = document.createElement(type);
  }
  if (props) {
    // 使用虚拟DOM的属性更新刚创建出来的真实DOM的属性
    updateProps(dom, {}, props);
    //如果只有一个儿子，并且这个儿子是一个文本
    if (typeof props.children === "object" && props.children.type) {
      //把儿子变成真实DOM插到自己身上
      console.log("文本");
      mount(props.children, dom);
      //如果儿子是一个数的话，说明儿子不止一个
    } else if (Array.isArray(props.children)) {
      console.log("文本1");
      // reconcileChildren(props.children,dom);
    }
  }
  vnode.dom = dom;
  return dom;
}
/**
 *
 * @param {*} dom
 * @param {*} oldProps
 * @param {*} newProps
 */
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") continue; // 不在这里处理
    if (key === "style") {
      // ? 只是修改新的值吗？
      let styleObj = newProps.style;
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
      // 添加事件 这个只是一个简单的判断
    } else {
      // 其他的属性
      dom[key] = newProps[key];
    }
  }
}
export default {
  render,
};
