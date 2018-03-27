import React from 'react'
import { Modal, Table, Select, Icon, Form, Divider, InputNumber, Spin } from 'antd'

const Option = Select.Option
const FormItem = Form.Item

const Title = props => (
	<div style={props.style} className='helper__color_green'>
		<Icon type={props.iconType} style={{ paddingRight: 6 }} />
		<span>{props.children}</span>
	</div>
)

const ResultItem = props => (
	<span style={{ paddingLeft: 20 }}>
		<span>{props.label}：</span>
		<span style={{ color: 'rgba(0,0,0,0.5)' }}>{props.children}</span>
	</span>
)

const WrapInput = (props) => {
	const { record, onChange, value, inputType } = props
	const max = inputType === 'num' ? 1e20 : 1
	const step = inputType === 'num' ? 1 : 0.1

	if (record.editable) {
		return (
			<InputNumber
				step={step}
				min={0}
				max={max}
				placeholder={props.placeholder}
				style={{ width: 100 }}
				value={value || 0}
				onChange={val => onChange(val)}
			/>
		)
	}
	return <span>{value}</span>
}

class RuleTest extends React.Component {
	state = {
		orgs: [],
		agentLevel: [],
		agentType: [],
		testResult: [],
		deptTreeData: [],
		selectedProductList: [],
		isTesting: false
	}

	componentWillMount() {
		helper.queryAllFields('agent_tier').then(data => this.setState({ agentLevel: data }))
		helper.queryAllFields('agent_category').then(data => this.setState({ agentType: data }))
	}

	componentWillReceiveProps() {
		const productId = this.props.rulesDetail.productId
		const agentProgramId = this.props.rulesDetail.agentProgramId

		if (agentProgramId) {
			request.send(HTTP_CMD.RULES_ORG, { agentProgramId }).then((res) => {
				this.setState({
					orgs: res.data
				})
			})
		}
		if (productId && this.state.selectedProductList.length === 0) {
			request.send(HTTP_CMD.PRODUCT_BY_ID, { productIdList: [productId] }).then((res) => {
				this.setState({
					selectedProductList: res.data.map(item => ({ ...item, editable: true }))
				})
			})
		}
	}

	_getRebate = (level) => {
		const testResult = this.state.testResult

		if (testResult.length) {
			return `${testResult.find(item => item.commAgent === level).commAmt}元`
		}
		return (<span className='helper__color_red'><Icon type='frown-o' /></span>)
	}

	handleInputChange = (value, record, column) => {
		const newData = this.state.selectedProductList
		const curItem = newData.find(item => item.productId === record.productId)

		if (column === 'num') {
			curItem.num = value
			curItem.sum = utils.mul(+record.productPrice || 0, +value || 0)
			curItem.actualSum = utils.mul(+curItem.sum, +record.discount || 0)
		}
		if (column === 'discount') {
			curItem.discount = value
			curItem.actualSum = utils.mul(+record.sum || 0, +value || 0)
		}
		this.setState({ selectedProductList: newData })
	}

	handleTest = () => { // 开始试算
		const { validateFields } = this.props.form
		const orderItem = this.state.selectedProductList[0]

		validateFields((err, values) => {
			if (!err) {
				const reqData = {
					commRuleId: this.props.rulesDetail.commRuleId,
					order: {
						orderAmt: orderItem.actualSum,
						deptId: values.org,
						agent: {
							agentTier: values.agentLevel,
							agentCategory: values.agentType
						},
						orderItems: [{
							productId: orderItem.productId,
							itemPrice: orderItem.productPrice,
							itemQuatity: orderItem.num,
							itemAmt: orderItem.sum,
							itemSales: orderItem.discount,
							itemRealAmt: orderItem.actualSum
						}]
					}
				}
				this.setState({ isTesting: true })
				request.send(HTTP_CMD.RULES_TEST, reqData).then((res) => {
					this.setState({ testResult: res.data })
					this.setState({ isTesting: false })
				})
			}
		})
		// this.props.onCancel()
	}

	render() {
		const { visible, onCancel } = this.props
		const { agentLevel, agentType, selectedProductList, orgs } = this.state
		const { getFieldDecorator } = this.props.form
		const columns = [
			{
				title: '产品名称',
				dataIndex: 'productName'
			},
			{
				title: '单价',
				dataIndex: 'productPrice'
			},
			{
				title: '数量',
				dataIndex: 'num',
				render: (val, record) => (
					<WrapInput
						placeholder='请输入数量'
						inputType='num'
						record={record}
						value={record.num}
						onChange={value => this.handleInputChange(value, record, 'num')}
					/>
				)
			},
			{
				title: '应付金额',
				dataIndex: 'sum',
				render: val => <span>{val || 0}</span>
			},
			{
				title: '折扣',
				dataIndex: 'discount',
				render: (val, record) => (
					<WrapInput
						placeholder='请输入折扣'
						inputType='discount'
						record={record}
						value={record.discount}
						onChange={value => this.handleInputChange(value, record, 'discount')}
					/>
				)
			},
			{
				title: '实付金额',
				dataIndex: 'actualSum',
				render: val => <span>{val || 0}</span>
			}
		]

		return (
			<Modal
				title='创建测试订单'
				closable={false}
				okText='试算'
				width='820'
				bodyStyle={{ height: '500px' }}
				visible={visible}
				onCancel={onCancel}
				onOk={this.handleTest}
			>
				<Title iconType='credit-card' style={{ marginBottom: 10 }}>订单头</Title>
				<Form layout='inline'>
					<FormItem
						label='所属组织'
					>
						{
							getFieldDecorator('org', {
								rules: [{ required: true, message: '必选' }]
							})(
								<Select placeholder='请选择组织' style={{ width: 150 }}>
									{orgs.map(item => <Option value={item.deptId}>{item.deptName}</Option>)}
								</Select>
							)
						}
					</FormItem>
					<FormItem
						label='代理人级别'
					>
						{
							getFieldDecorator('agentLevel', {
								rules: [{ required: true, message: '必选' }]
							})(
								<Select placeholder='请选择级别' style={{ width: 150 }}>
									{agentLevel.map(item => <Option value={item.columnValue}>{item.valueDesc}</Option>)}
								</Select>
							)
						}
					</FormItem>
					<FormItem
						label='代理人类别'
					>
						{
							getFieldDecorator('agentType', {
								rules: [{ required: true, message: '必选' }]
							})(
								<Select placeholder='请选择类别' style={{ width: 150 }}>
									{agentType.map(item => <Option value={item.columnValue}>{item.valueDesc}</Option>)}
								</Select>
							)
						}
					</FormItem>
				</Form>
				<Divider style={{ margin: '40px 0 40px 0' }} dashed />
				<div className='g__block_flex_space-between'>
					<Title iconType='calendar'>订单行</Title>
				</div>
				<Table
					rowKey='productId'
					columns={columns}
					dataSource={selectedProductList}
					style={{ marginTop: 10 }}
					pagination={false}
				/>
				<div style={{ marginTop: 30 }}>
					<Title iconType='pay-circle-o' style={{ marginBottom: 10 }}>试算结果</Title>
					<Spin spinning={this.state.isTesting}>
						<ResultItem label='直销返佣'>{this._getRebate(0)}</ResultItem>
						<ResultItem label='一级返佣'>{this._getRebate(1)}</ResultItem>
						<ResultItem label='二级返佣'>{this._getRebate(2)}</ResultItem>
					</Spin>
				</div>
			</Modal>
		)
	}
}

const WrapRuleTest = Form.create()(RuleTest)
export default WrapRuleTest
