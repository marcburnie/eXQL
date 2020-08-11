import React from 'react';
import { render } from 'react-dom';
import App from './App';
console.log("Rendering")
render(
  <App />,
  document.getElementById('root'),
);
console.log("Rendered")