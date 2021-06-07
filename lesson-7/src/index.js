// import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

const jsx = (
  <div className="border">
    <h1>全栈123</h1>
    <a href="https://www.kaikeba.com/">kkb</a>
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
