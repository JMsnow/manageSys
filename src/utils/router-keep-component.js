import React from 'react'
import { Route } from 'react-router-dom'


/*
 * example:
 *
 * const WrapComponent = keepComponent(config)
 *
 * export default function() {
 *    return (
 *      <Switch>
 *         <Route path={`${match.path}/a`} component={WrapComponent} />
 *      </Switch>
 *    )
 * }
 *
 * */

/**
 * 缓存父级路由组件
 * @param config
 * componentA,componentB
 * 在componentWillReceiveProps函数里执行刷新操作
   componentWillReceiveProps(nextProps) {
		if(nextProps.match.isExact) {
			// 刷新操作
		}
	}
 *
 const config = {
	component: componentA,
	children: [
		{
			path: 'b',
			component: componentB,
			children: [
				{
					path: 'd',
					component: componentD
				}
			]
		},
		{
			path: 'c',
			component: componentC
		}
	]
}
 */
export default function keepComponent(config) {
	const { component, children } = config
	const isChildren = children && children.length
	if (isChildren) {
		const C = component
		return function (props) {
			const match = props.match
			let wrapDiv = {}
			if (!match.isExact) {
				wrapDiv.style = {
					display: 'none'
				}
			}
			return (
				<React.Fragment>
					<div {...wrapDiv}><C {...props}/></div>
					{
						children.map((v, i)=> (
							<Route strict path={`${match.path}/${v.path}`} component={keepComponent(v)} key={i.toString()} />
						))
					}
				</React.Fragment>
			)
		}
	}
	return component
}
