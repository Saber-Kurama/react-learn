import {wrapToVdom} from './utils';
/**
 * @param {*} type 元素的类型
 * @param {*} config 配置对象
 * @param {*} children  儿子或儿子们
 */
function createElement(type,config,children){
    let ref;
    let key;
    if(config){
        delete config.__source;
        delete config.__self;
        ref = config.ref;
        delete config.ref;
        key = config.key;
        delete config.key;
    }
   let props = {...config};
   if(arguments.length>3){
       props.children=Array.prototype.slice.call(arguments,2).map(wrapToVdom);
   }else{
        props.children=wrapToVdom(children);
   }
   return {
       type,
       ref,
       key,
       props
   }
}
const React = {
  createElement,
}
export default React;