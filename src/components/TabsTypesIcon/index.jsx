import React from 'react';

export default function TabsTypesIcon(props) {
  let iconText = null;
  switch (props.type) {
    case 'css':
      iconText = 'iconcss';
      break;
    case 'javascript':
      iconText = 'iconjava-script';
      break;
    case 'react':
      iconText = 'iconreact';
      break;
    case 'vue':
      iconText = 'iconvuejs-line';
      break;
    case 'git':
      iconText = 'icongit';
      break;
    case 'java':
      iconText = 'iconjava';
      break;
    case 'node':
      iconText = 'iconnode';
      break;
    default:
      iconText = 'iconhtml';
      break;
  }
  return <i className={`xwb xwb-icon ${iconText}`}></i>;
}
