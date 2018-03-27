import React, { Component } from 'react'
import { Card, Row, Col, message, Table } from 'antd'
import moment from 'moment'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入树状图
import 'echarts/lib/chart/tree'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import { AgentHOC } from 'components/connect'
import AuthButton from 'components/auth-button'

import styles from './index.scss'

class ViewAgent extends Component {
	state = {
		agent: {},
		pageSize: 10,
		dataSource: [],
		total: 0,
		current: 1,
		loading: false,
		deptTreeData: [],
		selectedPrincipal: []
	}

	componentWillMount() {
		this._loadAgent()
		this._loadDepartTree()
		this._loadPrincipalData()
		this._loadAgentRebateList()
	}

	componentDidMount() {
		this.chart = echarts.init(this.chartBox)
	}

	getAgentStatus = (status) => {
		if (isNaN(status)) return ''

		const { agentStatus: { agentStatuses } } = this.props
		const item = agentStatuses.find(_ => _.columnValue === status)

		return item ? item.valueDesc : status
	}

	getAgentAsscBank = (bank) => {
		if (isNaN(status)) return ''

		const { bank: { banks } } = this.props
		const item = banks.find(_ => _.columnValue === +bank)

		return item ? item.valueDesc : bank
	}

	handleModifyAgent = () => {
		const {
			history,
			match: {
				params: { agentId }
			}
		} = this.props

		history.push(`/app/agent-manage/edit-agent/${agentId}`)
	}

	handleFreezeAgent = () => {
		helper.confirm('确定要将此代理人拉黑吗？').then(() => {
			const { agentId } = this.props.match.params
			request.send(HTTP_CMD.AGENT_FREEZE, {
				agentId,
				status: 4
			}).then(() => {
				message.success('代理人拉黑成功')
				const { history } = this.props
				history.push('/app/agent-manage/audited')
			}).catch(() => {
				message.error('代理人拉黑失败')
			})
		})
	}

	handleUnfreezeAgent = () => {
		helper.confirm('确定要将此代理人移出黑名单吗？').then(() => {
			const { agentId } = this.props.match.params

			request.send(HTTP_CMD.AGENT_UNFREEZE, {
				agentId,
				status: 0
			}).then(() => {
				message.success('代理人从黑名单中移除成功')
				const { history } = this.props
				history.push('/app/agent-manage/audited')
			})
		})
	}

	handlePageChange = (page) => {
		this.setState({
			current: page
		}, () => {
			this._loadAgentRebateList()
		})
	}

	drawAgentAncestoryChart = () => {
		const {
			agent: {
				parent,
				...other
			}
		} = this.state

		let data = {}

		if (parent) {
			data = {
				...parent,
				children: [other]
			}
		} else {
			data = other
		}

		this.chart.setOption({
			tooltip: {
				trigger: 'item',
				triggerOn: 'mousemove'
			},
			series: [
				{
					type: 'tree',
					data: [data],
					top: '1%',
					left: '7%',
					bottom: '1%',
					right: '10%',
					symbolSize: 12,
					initialTreeDepth: 3,
					lineStyle: {
						normal: {
							curveness: 0.8
						}
					},
					label: {
						normal: {
							position: 'top',
							verticalAlign: 'middle',
							align: 'center',
							fontSize: 12,
							distance: 8,
							formatter: params => params.data.contactName
						}
					},
					leaves: {
						label: {
							normal: {
								position: 'right',
								verticalAlign: 'middle',
								align: 'left',
								distance: 3
							}
						}
					},
					tooltip: {
						formatter: (params) => {
							const {
								data: {
									contactName,
									agentId,
									mobile
								}
							} = params
							return `
								<div>
									<p class='agent-item'>代理人名称：${contactName}</p>
									<p class='agent-item'>代理人ID: ${agentId}</p>
									<p class='agent-item'>手机号：${mobile}</p>
								</div>
							`
						}
					},
					expandAndCollapse: false,
					animationDuration: 550,
					animationDurationUpdate: 750
				}
			]
		})
	}

	_loadAgent() {
		const { agentId } = this.props.match.params
		request.send(HTTP_CMD.AGENT_DETAIL, { agentId }).then((res) => {
			this.setState({ agent: res.data }, () => {
				this.drawAgentAncestoryChart()
			})
		})
	}

	_loadDepartTree = () => { // 获取部门下拉列表数据
		request.send(HTTP_CMD.DEPT_LIST_ALL_ORG).then((res) => {
			this.setState({
				deptTreeData: utils.flattenDeep(res.data)
			})
		})
	}

	_loadPrincipalData = () => { // 获取负责人下拉列表数据
		request.send(HTTP_CMD.SELECT_PRINCIPAL, { keywords: '' }).then((res) => {
			this.setState({ selectedPrincipal: res.data })
		})
	}

	_loadAgentRebateList() {
		const { agentId } = this.props.match.params
		const { pageSize, current } = this.state

		this.setState({ loading: true })
		request.send(HTTP_CMD.AGENT_REBATE_LIST, {
			current,
			size: pageSize,
			condition: {
				agentId
			}
		}).then((res) => {
			const { total, records } = res.data
			this.setState({
				total,
				dataSource: records,
				loading: false
			})
		}).catch(() => {
			this.setState({
				dataSource: [],
				loading: false
			})
		})
	}

	render() {
		const {
			agent,
			selectedPrincipal,
			deptTreeData,
			pageSize,
			current,
			dataSource,
			loading,
			total
		} = this.state

		const {
			agentStatus
		} = agent
		const button = agentStatus !== 4 ? (<AuthButton type='primary' actionId={ACTIONIDS_CMD.AGENT_FREEZE} onClick={() => this.handleFreezeAgent()}>加入黑名单</AuthButton>) :
			(<AuthButton type='primary' actionId={ACTIONIDS_CMD.AGENT_UNFREEZE} onClick={() => this.handleUnfreezeAgent()}>从黑名单中移除</AuthButton>)

		const buttons = (
			<div>
				<AuthButton type='dashed' icon='edit' actionId={ACTIONIDS_CMD.AGENT_MODIFY} onClick={() => this.handleModifyAgent()} style={{ marginRight: 10 }}>编辑</AuthButton>
				{button}
			</div>
		)

		const detailCardProps = {
			title: '代理人详情',
			extra: buttons,
			key: 'detail'
		}

		let {
			positionIdSet,
			deptIdSet
		} = agent

		positionIdSet = positionIdSet || []
		deptIdSet = deptIdSet || []

		const deptNames = []

		deptIdSet.forEach((deptId) => {
			const dept = deptTreeData.find(_ => _.deptId === deptId)

			if (dept) deptNames.push(<p>{dept.deptName}</p>)
		})

		const principals = []

		positionIdSet.forEach((positionId) => {
			const position = selectedPrincipal.find(_ => _.positionId === positionId)

			if (position) principals.push(<p>{`${position.employeeName}-${position.positionName}`}</p>)
		})

		const pagination = {
			pageSize,
			current,
			total,
			onChange: this.handlePageChange
		}

		const columns = [
			{
				title: '订单编号',
				dataIndex: 'orderItemId'
			},
			{
				title: '产品',
				dataIndex: 'productName'
			},
			{
				title: '成交价格',
				dataIndex: 'itemPrice'
			},
			{
				title: '返佣时间',
				dataIndex: 'realAcctDt',
				render: date => (
					date ? moment(date).format('YYYY-MM-DD') : ''
				)
			},
			{
				title: '预处理时间',
				dataIndex: 'planAcctDt',
				render: date => (
					date ? moment(date).format('YYYY-MM-DD') : ''
				)
			},
			{
				title: '返佣金额',
				dataIndex: 'commAmt'
			}
		]

		const tableProps = {
			columns,
			pagination,
			loading,
			dataSource,
			bordered: true,
			rowKey: 'transactionId'
		}

		return (
			<div className={styles['agent-detail']}>
				<Card {...detailCardProps}>
					<Row gutter={24}>
						<Col span={12}>
							<p>代理人编号: {agent.agentCode}</p>
						</Col>
						<Col span={12}>
							<p>手机号码: {agent.mobile}</p>
						</Col>
						<Col span={12}>
							<p>代理人名称: {agent.contactName}</p>
						</Col>
						<Col span={12}>
							<p>微信号: {agent.wechatCode}</p>
						</Col>
						<Col span={12}>
							<p>QQ号: {agent.qqCode}</p>
						</Col>
						<Col span={12}>
							<p>状态: {this.getAgentStatus(agent.agentStatus)}</p>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<div style={{ float: 'left', width: 50 }}>
								<p>负责人: </p>
							</div>
							<div style={{ marginLeft: 50 }}>{principals}</div>
						</Col>
						<Col span={12}>
							<div style={{ float: 'left', width: 65 }}>
								<p>所属团队: </p>
							</div>
							<div style={{ marginLeft: 65 }}>{deptNames}</div>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={12}>
							<p>推荐人: {agent.parent ? agent.parent.contactName : ''}</p>
						</Col>
						<Col span={12}>
							<p>创建日期: {agent.createDt ? moment(agent.createDt).format('YYYY-MM-DD HH:mm:ss') : ''}</p>
						</Col>
						<Col span={12}>
							<p>创建者: {agent.creator}</p>
						</Col>
						<Col span={12}>
							<p>更新日期: {agent.updateDt ? moment(agent.updateDt).format('YYYY-MM-DD HH:mm:ss') : '' }</p>
						</Col>
						<Col span={12}>
							<p>更新者: {agent.updater}</p>
						</Col>
						<Col span={12}>
							<p>备注: {agent.agentDesc}</p>
						</Col>
						<Col span={12}>
							<p>关联用户: </p>
						</Col>
						<Col span={12}>
							<p>微信钱包: </p>
						</Col>
						<Col span={12}>
							<p>开户银行: {this.getAgentAsscBank(agent.asscBank)}</p>
						</Col>
						<Col span={12}>
							<p>银行卡号: {agent.asscBankAcct}</p>
						</Col>
						<Col span={12}>
							<p>总返佣额: </p>
						</Col>
						<Col span={12}>
							<p>账户余额: {agent.currentAmt}</p>
						</Col>
						<Col span={12}>
							<p>在途返佣: {agent.transitAmt}</p>
						</Col>
					</Row>
				</Card>
				<Card title={`${agent.contactName || ''}的团队`} style={{ marginTop: 20 }}>
					<div style={{ height: 1000 }} ref={(node) => { this.chartBox = node }} />
				</Card>
				<Card title={`${agent.contactName || ''}的返佣记录`} style={{ marginTop: 20 }}>
					<Table {...tableProps} />
				</Card>
			</div>
		)
	}
}

export default AgentHOC(ViewAgent)
