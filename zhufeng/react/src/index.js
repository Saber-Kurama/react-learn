import React from "./zfreact/react";
// import ReactDOM from "react-dom";
import "./index.css";
// import App from './App';
// import reportWebVitals from './reportWebVitals';
import ReactDOM from "./zfreact/react-dom";
// import Component from './kreact/Component';
// 基本的原生组件
const jsx = (
  <div className="border" style={{color: "blue"}}>saber</div>
)

ReactDOM.render(jsx, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();