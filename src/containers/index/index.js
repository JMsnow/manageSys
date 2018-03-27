import React from 'react'
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

import UnauthorizedLayout from 'components/unauthorizedLayout' // 不需要授权页面入口
import PrimaryLayout from 'components/PrimaryLayout' // 需要授权页面入口

const AuthorizedRoute = (props) => {
	const { component: Component, ...rest } = props
	return (
		<Route
			{...rest}
			render={
				prop => (
					helper.hasAuthenticated() ?
						<Component {...prop} /> :
						<Redirect to='/auth/login' />
				)
			}
		/>
	)
}

class Index extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route path='/auth' component={UnauthorizedLayout} />
					<AuthorizedRoute path='/app' component={PrimaryLayout} />
					<Redirect to='/app' />
				</Switch>
			</Router>
		)
	}
}

const WrapIndex = () => <LocaleProvider locale={zhCN}><Index /></LocaleProvider>
export default WrapIndex
