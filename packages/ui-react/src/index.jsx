import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import './palette.deep-sea.css'
// import './palette.terminal.css'
import './theme.dark.css'
import './index.module.css'
import { App } from './modules/App/components'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
