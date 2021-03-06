// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
import ReactDOM from './kreact/08/react-dom';
import Component from './kreact/08/Component';
// import ReactDOM from './miniReact/react-dom/ReactDom'


function FunctionComponent(props) {
  return (
    <div className="border">
      <p>{props.name}</p>
    </div>
  );
}
class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <p>{this.props.name}</p>
      </div>
    );
  }
}
function FragmentComponent() {
  return (
    <>
    <div>
      saber1231
    </div>
    <div>
      saber12312
    </div>
    </>
  )
}

const jsx = (
  <div className="border">
    <h1>阅读源码</h1>
    <a href="https://www.kaikeba.com/">kkb</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="类组件" />
    <FragmentComponent />
    <ClassComponent name="类组件" /> 
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
