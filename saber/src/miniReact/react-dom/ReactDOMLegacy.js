import {
  createContainer,
} from '../react-reconciler/src/ReactFiberReconciler';
// 创建 渲染子树到容器
function legacyRenderSubtreeIntoContainer(
  parentComponent,
  children,
  container,
  forceHydrate,
  callback
) {
  // 第一次 的时候 没有
  let root = container._reactRootContainer;
  // 根节点 root
  let fiberRoot;
  if(!root){
     // Initial mount
     root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root;
  }
  console.log('root', root)
}
// 创建根的节点从DOM容器
function legacyCreateRootFromDOMContainer(){
  const root = createContainer()
}
export function render(element, container, callback) {
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback
  );
}
