import React, { Component } from 'react'
import { Modal, Table, Row, Col } from 'antd'

const DetailItem = props => (
	<Col span={8}>
		<div className='detailItem'>
			<span>{props.label}：</span>
			<span>{props.children}</span>
		</div>
	</Col>
)

class RuleItemDetail extends Component {
	state = {
		condObject: null,
		condObjectAttr: null,
		condOperator: null,
		orgs: [],
		count: 0
	}

	componentWillMount() {
		helper.queryAllFields('cond_object').then((data) => {
			this.setState({ condObject: data })
		})
		helper.queryAllFields('cond_object_attr').then((data) => {
			this.setState({ condObjectAttr: data })
		})
		helper.queryAllFields('cond_operator').then((data) => {
			this.setState({ condOperator: data })
		})
		request.send(HTTP_CMD.RULES_ORG, { agentProgramId: this.props.agentProgramId })
			.then((res) => {
				this.setState({ orgs: res.data })
			})
	}

	columns = [
		{
			title: '实体名',
			dataIndex: 'condObject',
			width: '20%',
			render: val => (
				<span>
					{
						this.state.condObject ?
							this.state.condObject.find(item => item.columnValue === val).valueDesc
							: null
					}
				</span>
			)
		},
		{
			title: '字段名',
			dataIndex: 'condObjectAttr',
			width: '20%',
			render: val => (
				<span>
					{
						this.state.condObjectAttr ?
							this.state.condObjectAttr.find(item => item.columnValue === val).valueDesc
							: null
					}
				</span>
			)
		},
		{
			title: '运算符',
			dataIndex: 'condOperator',
			width: '20%',
			render: val => (
				<span>
					{
						this.state.condOperator ?
							this.state.condOperator.find(item => item.columnValue === val).valueDesc
							: null
					}
				</span>
			)
		},
		{
			title: '比较值',
			dataIndex: 'condNumberValue',
			width: '20%',
			render: (val, record) => {
				if (val) {
					return (
						<span>{val}</span>
					)
				}
				if (record.condObjectAttr === 12) {
					return (
						<span>
							{
								this.state.orgs.filter(item => record.condCharValue.split(',').indexOf(`${item.deptId}`) > -1)
									.map(i => i.deptName)
									.join(',')
							}
						</span>
					)
				}
				if (record.condObjectAttr === 10 || record.condObjectAttr === 11) {
					return (
						<span>
							{
								this.state.orgs.filter(item => record.condCharValue.split(',').indexOf(`${item.deptId}`) > -1)
									.map(i => i.deptName)
									.join(',')
							}
						</span>
					)
				}
				return <span>无</span>
			}
		}
	]

	render() {
		const { ruleItemDetail, onClose } = this.props

		return (
			<Modal
				width='800'
				bodyStyle={{ height: '600px', overflowY: 'auto' }}
				closable
				title='规则细则详情'
				footer={null}
				visible
				onCancel={() => onClose()}
			>
				<Row style={{ lineHeight: 2.5, marginBottom: 20 }}>
					<DetailItem label='细则描述'>{ruleItemDetail.commRuleItemDesc}</DetailItem>
					<DetailItem label='细则编号'>{ruleItemDetail.commRuleItemCode}</DetailItem>
					<DetailItem label='细则备注'>{ruleItemDetail.commRuleItemRemark}</DetailItem>
					<DetailItem label='返佣模式'>{ruleItemDetail.commModel === 1 ? '百分比' : '金额'}</DetailItem>
					<DetailItem label='直销返佣'>
						{ruleItemDetail.commisionRuleItemActionsDtoList.find(item => item.commAgent === 0).commQuantity}
						{`${ruleItemDetail.commModel === 1 ? '%' : '元'}`}
					</DetailItem>
					<DetailItem label='二级返佣'>
						{ruleItemDetail.commisionRuleItemActionsDtoList.find(item => item.commAgent === 1).commQuantity}
						{`${ruleItemDetail.commModel === 1 ? '%' : '元'}`}
					</DetailItem>
					<DetailItem label='三级返佣'>
						{ruleItemDetail.commisionRuleItemActionsDtoList.find(item => item.commAgent === 2).commQuantity}
						{`${ruleItemDetail.commModel === 1 ? '%' : '元'}`}
					</DetailItem>
				</Row>
				<Table
					rowKey='commRuleCondId'
					title={() => <span>匹配条件</span>}
					scroll={{ y: 400 }}
					dataSource={ruleItemDetail.commisionRuleItemConditionsDtoList}
					columns={this.columns}
					pagination={false}
				/>
			</Modal>
		)
	}
}

export default RuleItemDetail
