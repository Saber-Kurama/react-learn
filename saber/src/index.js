// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import ReactDOM from './kreact/react-dom';
// import Component from './kreact/Component';
import ReactDOM from './miniReact/react-dom/ReactDom'

// function Saber() {
//   return (
//     <div>
//       saber
//     </div>
//   )
// }
// function FragmentComponent() {
//   return (
//     <>
//     <div>
//       saber1231
//     </div>
//     <div>
//       saber12312
//     </div>
//     </>
//   )
// }
// class TodoApp extends Component {
//   render() {
//     return (
//       <div >
//         TodoApp{this.props.name}
//       </div>
//     )
//   }
// }
const jsx = (
  <div className="border">
    <h1>阅读源码</h1>
    <a href="https://www.kaikeba.com/">kkb</a>
    {/* <Saber />
    <TodoApp name="类组件"/>
    <FragmentComponent /> */}
    {/* <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" />
    <FragmentComponent /> */}
  </div>
);

ReactDOM.render(
  jsx,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
