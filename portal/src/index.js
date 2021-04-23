import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import './index.css';
import App from './App';
import Etiqueta from './Etiqueta';
import Cargamasiva from './Cargamasiva';
import Consultamasiva from './Consultamasiva';
import Impresionmasiva from './Impresionmasiva';
import Huella from './Huella';
import Anden from './Anden';
import Manual from './Manual';
import Rutaoptima from './Rutaoptima';
import { BrowserRouter, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

render((
  <BrowserRouter>
      <Manual/>
  </BrowserRouter>
),document.getElementById('root'));

serviceWorker.unregister();
