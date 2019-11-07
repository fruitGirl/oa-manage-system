import React from 'react';
import ReactDOM from 'react-dom';
import BasicLayout from 'layouts/BasicLayout';
const { LocaleProvider, zh_CN } = window.antd;
const mountNode = document.getElementById('root');

ReactDOM.render(
  <LocaleProvider locale={zh_CN}>
    <BasicLayout />
  </LocaleProvider>,
  mountNode
);
