import { createStore, compose } from 'redux'

import { rootReducer } from './reducers'

export const store = createStore(
  rootReducer,
  compose(typeof window === 'object' &&
    typeof window.devToolsExtension !== 'undefined' ?
    window.devToolsExtension() :
    f => f
  ),
)
