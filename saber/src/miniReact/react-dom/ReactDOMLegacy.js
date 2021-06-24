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

export function render(element, container, callback) {
  return legacyRenderSubtreeIntoContainer(
    null,
    element,
    container,
    false,
    callback
  );
}
