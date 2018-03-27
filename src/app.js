/*
 * APP Entry
 */

import 'css/app.scss'

import '@/normalize'
import '@/global'

import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducers from 'states'

import { AppContainer } from 'react-hot-loader'

import Index from 'containers/index'

/**
 * Create store configure
 */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // Chrome extension
const store = createStore(
	reducers, composeEnhancers(
		applyMiddleware(thunk)
	)
)

/**
 * Root component render
 */
const rootElement = document.getElementById('root')
const render = (Component) => {
	ReactDOM.render(
		<Provider store={store}>
			<AppContainer>
				<Component />
			</AppContainer>
		</Provider>,
		rootElement
	)
}
render(Index)

if (process.env.NODE_ENV === 'development') {
	// React HMR
	if (module.hot) {
		module.hot.accept('containers/index', () => {
			render(Index)
		})
	}
}
