import React from 'react'
import { Row, Col, Table, Modal, Button, Input } from 'antd'
import AuthBtn from 'components/auth-button'
import RuleItemDetail from 'containers/rules-manage/rule-item-detail'
import RuleTest from 'containers/rules-manage/rule-test'
import style from './style.scss'

const { TextArea } = Input
const DetailItem = props => (
	<Col span={8}>
		<div className='detailItem'>
			<span>{props.label}：</span>
			<span>{props.children}</span>
		</div>
	</Col>
)


class Audit extends React.Component {
	state = {
		msg: ''
	}
	render() {
		const { onAudit, onCancel } = this.props
		return (
			<Modal
				onCancel={onCancel}
				title='审核'
				visible
				footer={null}
			>
				<TextArea
					placeholder='请输入意见'
					style={{ border: 'none' }}
					autosize={{ minRows: 6, maxRows: 60 }}
					onChange={e => this.setState({ msg: e.target.value })}
					value={this.state.msg}
				/>
				<div style={{ paddingTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
					<Button type='primary' style={{ marginRight: 10 }} onClick={() => onAudit(this.state.msg, 0)}>通过</Button>
					<Button type='primary' onClick={() => onAudit(this.state.msg, 4)}>驳回</Button>
				</div>
			</Modal>
		)
	}
}

class RulesDetail extends React.Component {
	state = {
		tableLoading: false,
		commRuleStatus: [],
		commModel: [],
		rulesDetail: {},
		tableData: [],
		isShowModal: false,
		isShowRuleItemDetail: false,
		isShowRuleTest: false,
		ruleItemDetail: null,
		msg: ''
	}

	componentWillMount() {
		this._getRulesDetail()
		helper.queryAllFields('comm_rule_status').then((data) => { // 规则状态
			this.setState({
				commRuleStatus: data
			})
		})
		helper.queryAllFields('comm_model').then((data) => { // 分佣模式
			this.setState({
				commModel: data
			})
		})
	}

	getRowClassName(record) {
		const ruleItemId = +(utils.getParameterByName('ruleItemId') || '')
		return record.commRuleItemId === ruleItemId ? 'highlight' : ''
	}

	_getRulesDetail = () => {
		const ruleId = this.props.match.params.id
		request.send(HTTP_CMD.RULES_DETAIL, { commRuleId: ruleId }).then((res) => {
			this.setState({
				rulesDetail: res.data,
				tableData: res.data.commisionRuleItemDtoList
			})
		})
	}

	handleViewRuleItemDetail = (record) => {
		this.setState({
			isShowRuleItemDetail: true,
			ruleItemDetail: record
		})
	}

	handleAudit = (msg, tag) => { // 审核
		request.send(HTTP_CMD.RULES_AUDIT, { commRuleIdList: [this.props.match.params.id], auditingOpinion: msg, commRuleStatus: tag })
			.then(() => {
				this.setState({ isShowModal: false })
				this._getRulesDetail()
			})
	}

	handleRuleTest = () => {
		this.setState({ isShowRuleTest: true })
	}

	renderCommSum = (value, record) => {
		if (record.commModel === 1) {
			return <span>{value}%</span>
		}
		if (record.commModel === 0) {
			return <span>{value}元</span>
		}
		return null
	}

	render() {
		const columns = [
			{
				title: '细则编号',
				dataIndex: 'commRuleItemCode',
				width: '14.2%'
			},
			{
				title: '描述',
				dataIndex: 'commRuleItemDesc',
				width: '14.2%'
			},
			{
				title: '返佣模式',
				dataIndex: 'commModel',
				width: '14.2%',
				render: (commModel) => {
					const status = this.state.commModel.filter(item => item.columnValue === commModel)[0]
					return <span>{status ? status.valueDesc : null}</span>
				}
			},
			{
				title: '一级返佣',
				dataIndex: 'commQuantityLevelFirst',
				width: '14.2%',
				render: this.renderCommSum
			},
			{
				title: '二级返佣',
				dataIndex: 'commQuantityLevelSecond',
				width: '14.2%',
				render: this.renderCommSum
			},
			{
				title: '三级返佣',
				dataIndex: 'commQuantityLevelThird',
				width: '14.2%',
				render: this.renderCommSum
			},
			{
				title: '操作',
				dataIndex: 'operator',
				width: '14.2%',
				render: (text, record) => <Button onClick={() => this.handleViewRuleItemDetail(record)}>查看</Button>
			}
		]
		const { rulesDetail, commRuleStatus, isShowModal, isShowRuleItemDetail, ruleItemDetail, isShowRuleTest, msg } = this.state
		const status = commRuleStatus.filter(item => item.columnValue === rulesDetail.commRuleStatus)[0]
		return (
			<div className={style.detail}>
				<div className='detailTitle'>
					<span>规则详情</span>
					<div>
						{
							rulesDetail.commRuleStatus === 2 ?
								(
									<AuthBtn
										actionId={ACTIONIDS_CMD.RULE_AUDIT}
										type='primary'
										style={{ marginRight: 10 }}
										onClick={() => this.setState({ isShowModal: true })}
									>
										审核
									</AuthBtn>
								) : null
						}
						<Button onClick={this.handleRuleTest} type='primary'>试算</Button>
					</div>
				</div>
				<Row style={{ lineHeight: 2.5 }}>
					<DetailItem label='规则编号'>{rulesDetail.commRuleCode}</DetailItem>
					<DetailItem label='规则名称'>{rulesDetail.commRuleName}</DetailItem>
					<DetailItem label='适用体系'>{rulesDetail.agentProgramName}</DetailItem>
					<DetailItem label='规则描述'>{rulesDetail.commRuleDesc}</DetailItem>
					<DetailItem label='产品'>{rulesDetail.productName}</DetailItem>
					<DetailItem label='到账时延'>{rulesDetail.payDelay}天</DetailItem>
					<DetailItem label='状态'>{status ? status.valueDesc : null}</DetailItem>
					<DetailItem label='生效日期'>{rulesDetail.startDt}</DetailItem>
					<DetailItem label='失效日期'>{rulesDetail.endDt}</DetailItem>
					<DetailItem label='更新日期'>{rulesDetail.updateDt}</DetailItem>
					<DetailItem label='更新者'>{rulesDetail.updaterId}</DetailItem>
				</Row>
				<div className='divider' />
				<div className='distributorTitle'>规则细则</div>
				<Table
					scroll={{ y: 500 }}
					rowKey='commRuleItemId'
					loading={this.state.tableLoading}
					columns={columns}
					dataSource={this.state.tableData}
					pagination={false}
					rowClassName={this.getRowClassName}
				/>
				<RuleTest
					rulesDetail={rulesDetail}
					visible={isShowRuleTest}
					onCancel={() => this.setState({ isShowRuleTest: false })}
				/>
				{
					isShowModal ?
						<Audit
							msg={msg}
							ruleId={this.props.match.params.id}
							onCancel={() => this.setState({ isShowModal: false })}
							onAudit={this.handleAudit}
						/>
						: null
				}
				{
					isShowRuleItemDetail ?
						<RuleItemDetail
							agentProgramId={rulesDetail.agentProgramId}
							ruleItemDetail={ruleItemDetail}
							onClose={() => this.setState({ isShowRuleItemDetail: false })}
						/>
						: null
				}
			</div>
		)
	}
}

export default RulesDetail
