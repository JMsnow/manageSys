import React from 'react'
import { Input, Select, Icon, InputNumber, message } from 'antd'
import { isArray, isString } from 'lodash'

const Option = Select.Option

const WrapInput = (props) => {
	const { fieldValue, dataSource = [], onChange } = props
	const inputRange = ['1', '3', '4']

	if (inputRange.indexOf(fieldValue) > -1) {
		return (
			<InputNumber placeholder='请输入' style={{ width: 200 }} onChange={onChange} />
		)
	}
	if (fieldValue === '12') {
		return (
			<Select
				mode='multiple'
				style={{ width: 200 }}
				placeholder='请选择组织'
				onChange={onChange}
			>
				{
					dataSource.map(item => <Option key={`${item.deptId}-${item.deptName}`}>{item.deptName}</Option>)
				}
			</Select>
		)
	}
	if (fieldValue === '10' || fieldValue === '11') {
		return (
			<Select
				style={{ width: 200 }}
				placeholder='请选择'
				onChange={onChange}
			>
				{
					dataSource.map(item => <Option key={`${item.columnValue}-${item.valueDesc}`}>{item.valueDesc}</Option>)
				}
			</Select>
		)
	}

	return <Input style={{ width: 200 }} placeholder='无比较值' disabled />
}

class Selects extends React.Component {
	state = {
		condObject: [], // 实体(业务对象)
		condObjectAttr: [], // 字段
		condOperator: [], // 条件操作符
		dataSource: [], // 比较值数据
		selectedObj: [],
		selectedField: [],
		selecteOperator: [],
		compareValue: null
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
	}

	handleChangeObj = (i) => {
		const val = i.split('-')[0]

		this.setState({
			selectedObj: i,
			selectedField: [],
			selecteOperator: [],
			compareValue: null
		})
		request.send(HTTP_CMD.DICT_LIST, { dependColumn: 'cond_object', dependValue: val })
			.then((res) => {
				this.setState({ condObjectAttr: res.data })
			})
	}

	handleChangeField = (i) => {
		const val = i.split('-')[0]

		this.setState({
			selectedField: i,
			selecteOperator: []
		})
		if (val === '12') {
			request.send(HTTP_CMD.RULES_ORG, { agentProgramId: this.props.agentProgramId })
				.then((res) => {
					this.setState({ dataSource: res.data })
				})
		}
		if (val === '11') {
			helper.queryAllFields('agent_tier').then(data => this.setState({ dataSource: data }))
		}
		if (val === '10') {
			helper.queryAllFields('agent_category').then(data => this.setState({ dataSource: data }))
		}
	}

	handleChangeOperator = (i) => {
		this.setState({ selecteOperator: i })
	}

	handleChangeCompareVal = (i) => {
		this.setState({ compareValue: i })
	}

	handleSave = () => {
		const { selectedObj, selectedField, selecteOperator, compareValue } = this.state
		const compare = {}
		if (isArray(selectedObj) || isArray(selectedField) || isArray(selecteOperator) || !compareValue) {
			message.info('请填写完整')
			return
		}
		if (isArray(compareValue)) {
			compare.val = compareValue.map(item => item.split('-')[0]).join(',')
			compare.desc = compareValue.map(item => item.split('-')[1]).join(',')
		} else {
			compare.val = compareValue.indexOf ? compareValue.split('-')[0] : compareValue
			compare.desc = compareValue.indexOf ? compareValue.split('-')[1] : compareValue
		}
		const obj = {
			name: { val: selectedObj.split('-')[0], desc: selectedObj.split('-')[1] },
			field: { val: selectedField.split('-')[0], desc: selectedField.split('-')[1] },
			calculate: { val: selecteOperator.split('-')[0], desc: selecteOperator.split('-')[1] },
			compare: { val: compare.val, desc: compare.desc }
		}
		this.props.onSave(obj)
		this.setState({
			selectedObj: [],
			selectedField: [],
			selecteOperator: []
		})
	}

	render() {
		const {
			condObject,
			condObjectAttr,
			condOperator,
			dataSource,
			selectedObj,
			selectedField,
			selecteOperator
		} = this.state
		return (
			<div>
				<Select
					style={{ width: 150, marginRight: 10 }}
					placeholder='请选择实体'
					value={selectedObj}
					onChange={this.handleChangeObj}
				>
					{
						condObject.map(item => <Option value={`${item.columnValue}-${item.valueDesc}`}>{item.valueDesc}</Option>)
					}
				</Select>
				<Select
					style={{ width: 150, marginRight: 10 }}
					placeholder='请选择字段'
					value={selectedField}
					onChange={this.handleChangeField}
				>
					{
						condObjectAttr.map(item => <Option value={`${item.columnValue}-${item.valueDesc}`}>{item.valueDesc}</Option>)
					}
				</Select>
				<Select
					style={{ width: 150, marginRight: 10 }}
					placeholder='请选择操作符'
					value={selecteOperator}
					onChange={this.handleChangeOperator}
				>
					{
						condOperator.map(item => (
							<Option
								disabled={
									isString(selectedField) &&
									(
										(selectedField.split('-')[0] === '12' && item.columnValue !== 5) ||
										(selectedField.split('-')[0] !== '12' && item.columnValue === 5)
									)
								}
								key={`${item.columnValue}-${item.valueDesc}`}
							>
								{item.valueDesc}
							</Option>
						))
					}
				</Select>
				<WrapInput
					fieldValue={isString(selectedField) ? selectedField.split('-')[0] : -1}
					dataSource={dataSource}
					onChange={this.handleChangeCompareVal}
				/>
				<a onClick={this.handleSave} style={{ marginLeft: 10, fontSize: 18 }}><Icon type='plus-circle' /></a>
			</div>
		)
	}
}

export default Selects
