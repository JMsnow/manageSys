import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Layout } from 'antd'
import TopHeader from 'components/top-header'
import LeftMenu from 'components/left-menu'
import BreadCrumb from 'components/breadcrumb'
import Iframe from 'components/iframe'

import Dashboard from 'containers/dashboard'
import UserManage from 'containers/user-manage'
import PositionManage from 'containers/position-manage'
import RoleManage from 'containers/role-manage'
import FeatureManage from 'containers/feature-manage'
import DepartmentManage from 'containers/department-manage'
import StaffManage from 'containers/staff-manage'
import ClientManage from 'containers/client-manage'
import AgentManage from 'containers/agent-manage'
import RebateManage from 'containers/rebate-manage'
import ProductManage from 'containers/product-manage'
import DistributionSysManage from 'containers/distribution-system-manage'
import OrderManage from 'containers/order-manage-new'
import RulesManage from 'containers/rules-manage'
import RabteProcessManage from 'containers/rebate-process-manage'
import LogoImage from '@/assets/images/logo.svg'

import style from './style.scss'

const { Header, Sider, Content } = Layout

class PrimaryLayout extends React.Component {
	state = {
		collapsed: false
	}
	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		})
	}
	render() {
		const { match } = this.props
		const menuItems = helper.getMenuData()

		debug.log('match: ', match)
		return (
			<Layout className={style.layout}>
				<Sider
					trigger={null}
					collapsible
					collapsed={this.state.collapsed}
					style={{ height: 'calc(100vh)', overflowY: 'auto' }}
				>
					<div className='logo'>{this.state.collapsed ? '尚' : <img src={LogoImage} alt='' />}</div>
					<LeftMenu {...this.props} menuItems={menuItems} />
				</Sider>
				<Layout className='childrenLayout'>
					<Header style={{ padding: 0 }}>
						<TopHeader onClick={this.toggle} collapsed={this.state.collapsed} {...this.props} />
					</Header>
					<div className='breadcrumb'>
						<BreadCrumb {...this.props} />
					</div>
					<div style={{ height: '1px', background: '#e8e8e8' }} />
					<Content className='route-content'>
						<Switch>
							<Route path={`${match.path}/dashboard`} component={Dashboard} />
							<Route path={`${match.path}/user-manage`} component={UserManage} />
							<Route path={`${match.path}/position-manage`} component={PositionManage} />
							<Route path={`${match.path}/role-manage`} component={RoleManage} />
							<Route path={`${match.path}/feature-manage`} component={FeatureManage} />
							<Route path={`${match.path}/department-manage`} component={DepartmentManage} />
							<Route path={`${match.path}/staff-manage`} component={StaffManage} />
							<Route path={`${match.path}/client-manage`} component={ClientManage} />
							<Route path={`${match.path}/agent-manage`} component={AgentManage} />
							<Route path={`${match.path}/rebate-manage`} component={RebateManage} />
							<Route path={`${match.path}/product-manage`} component={ProductManage} />
							<Route path={`${match.path}/distribution-system-manage`} component={DistributionSysManage} />
							<Route path={`${match.path}/order-manage`} component={OrderManage} />
							<Route path={`${match.path}/rules-manage`} component={RulesManage} />
							<Route path={`${match.path}/rebate-process-manage`} component={RabteProcessManage} />
							<Route path={`${match.path}/outer`} render={props => <Iframe {...props} />} />
							<Redirect to={`${match.path}/dashboard`} />
						</Switch>
					</Content>
				</Layout>
			</Layout>
		)
	}
}

export default PrimaryLayout
