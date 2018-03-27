import React, { Component } from 'react'
import { Row, Col, Input, Select, Switch, Form, Button, TreeSelect, message } from 'antd'
import GoBack from 'components/go-back'

const { Option, OptGroup } = Select
const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode
const formItemLayout = {
	labelCol: {
		span: 6
	},
	wrapperCol: {
		span: 12
	}
}
class CreatePositionForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			fpositionList: [],
			btnLoading: false,
			formData: {},
			isTreeLoading: false,
			deptTreeData: [],
			positionTypes: [],
			positionLevels: [],
			selectablePositionLevels: [],
			authTypes: [],
			isCreate: !this.props.match.params.positionId, // 是否是创建页面
			hasSetPositionId: false
		}
	}
	componentWillMount() {
		this._loadPositionLevels()
		this._loadPositionList()
		this._loadDepartTree()
		this._loadPositionTypes()
		this._loadAuthTypes()
	}
	onSelectDepart = (value, label, extra) => {
		debug.log(value, label, extra)
	}
	_loadDepartTree = () => {
		request.send(HTTP_CMD.DEPT_LIST_ALL).then((res) => {
			this.setState({
				deptTreeData: helper.generateJsonTree(res.data),
				isTreeLoading: false
			})

			debug.log('deptTreeData: ', helper.generateJsonTree(res.data))
		}).catch(() => {
			this.setState({ isTreeLoading: false })
		})
	}
	_loadPositionList() {
		request.send(HTTP_CMD.POSITION_TREE).then((res) => {
			debug.log(res)
			this.setState({ fpositionList: res.data })
		})
	}
	_loadPositionTypes() {
		helper.queryAllFields('position_type').then((datas) => {
			this.setState({
				positionTypes: datas
			})
		})
	}
	_loadAuthTypes() {
		helper.queryAllFields('auth_type').then((datas) => {
			this.setState({
				authTypes: datas
			})
		})
	}
	_loadPositionLevels() {
		helper.queryAllFields('position_level').then((datas) => {
			this.setState({
				positionLevels: datas,
				selectablePositionLevels: datas
			}, () => {
				this._getPositionData(this.props.match.params.positionId)
			})
		})
	}
	save = tag => (e) => {
		e.preventDefault()
		const form = this.props.form
		form.validateFields((err, values) => {
			const {
				isActive,
				// isManager,
				...other
			} = values

			const reqData = {
				...other,
				isActive: isActive ? 1 : 0,
				// isManager: isManager ? 2 : 1,
				positionId: this.props.match.params.positionId || ''
			}

			if (!err) {
				this.setState({ btnLoading: true })
				request.send(this.state.isCreate ? HTTP_CMD.POSITION_CREATE : HTTP_CMD.POSITION_MODIFY, reqData).then((res) => {
					this.setState({ btnLoading: false })
					message.success(`${this.state.isCreate ? '创建职位成功！' : '编辑职位成功！'}`)
					if (tag === 1) {
						this.props.history.replace('/app/position-manage')
					} else {
						this.props.history.replace(`/app/position-manage/position-detail/${res.data}`)
					}
				}).catch(() => {
					this.setState({ btnLoading: false })
				})
			}
		})
	}
	_getPositionData = (positionId) => {
		if (this.state.isCreate) return
		request.send(HTTP_CMD.POSITION_DETAIL, { positionId }).then((res) => {
			const position = res.data
			const { positionType, fPositionId } = position
			const selectablePositionLevels = this.state.positionLevels.filter((level) => {
				if (positionType === CONFIG.POSITION_TYPE_IS_NOT_SALESMAN) return CONFIG.OTHER_POSITION_LEVEL.indexOf(+level.columnValue) > -1

				return CONFIG.OTHER_POSITION_LEVEL.indexOf(+level.columnValue) === -1
			})

			this.setState({
				formData: position,
				selectablePositionLevels,
				hasSetPositionId: !!fPositionId
			})
		})
	}
	handlePositionTypeChange = (val) => {
		const selectablePositionLevels = this.state.positionLevels.filter((level) => {
			if (val === CONFIG.POSITION_TYPE_IS_NOT_SALESMAN) return CONFIG.OTHER_POSITION_LEVEL.indexOf(+level.columnValue) > -1

			return CONFIG.OTHER_POSITION_LEVEL.indexOf(+level.columnValue) === -1
		})

		this.setState({
			selectablePositionLevels
		})

		this.props.form.setFieldsValue({
			positionLevel: null
		})
	}
	renderTreeNodes = data => data.map((item) => {
		if (item.children) {
			return (
				<TreeNode title={item.deptName} value={String(item.deptId)} key={item.deptId}>
					{this.renderTreeNodes(item.children)}
				</TreeNode>
			)
		}
		return <TreeNode title={item.deptName} value={String(item.deptId)} key={item.deptId} />
	})
	render() {
		const { getFieldDecorator } = this.props.form
		const {
			formData,
			isCreate,
			positionTypes,
			selectablePositionLevels,
			authTypes,
			hasSetPositionId
		} = this.state
		return (
			<React.Fragment>
				<div style={{ marginBottom: 20 }}>
					<GoBack {...this.props} />
				</div>
				<Form style={{ maxWidth: '100%', margin: '10px auto' }} onSubmit={this.handleSubmit}>
					<Row type='flex' justify='center'>
						<Col span={20}>
							<FormItem
								{...formItemLayout}
								label='职位名称'
								colon={false}
							>
								{getFieldDecorator('positionName', {
									validateTrigger: 'onBlur',
									initialValue: isCreate ? '' : formData.positionName,
									rules: [
										{ required: true, message: '请输入职位名称' },
										{ pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,20}$/, message: '中英文数字下划线(20字符以内)' }
									]
								})(
									<Input placeholder='输入职位名称' />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='所属部门'
								colon={false}
							>
								{getFieldDecorator('deptId', {
									validateTrigger: 'onChange',
									rules: [{ required: true, message: '请选择部门' }],
									initialValue: isCreate ? '' : String(formData.deptId || '')
								})(
									<TreeSelect
										dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
										showSearch
										allowClear
										placeholder='请选择所属部门'
										treeNodeFilterProp='title'
									>
										{this.renderTreeNodes(this.state.deptTreeData)}
									</TreeSelect>
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='职位类别'
								colon={false}
							>
								{getFieldDecorator('positionType', {
									initialValue: isCreate ? null : formData.positionType,
									validateTrigger: 'onChange',
									rules: [
										{ required: true, message: '请选择岗位类别' }
									]
								})(
									<Select onChange={this.handlePositionTypeChange}>
										{positionTypes.map(type => <Option value={type.columnValue} key={type.columnValue}>{type.valueDesc}</Option>)}
									</Select>
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='职级'
								colon={false}
							>
								{getFieldDecorator('positionLevel', {
									initialValue: isCreate ? null : formData.positionLevel,
									validateTrigger: 'onChange',
									rules: [
										{ required: true, message: '请选择职级' }
									]
								})(
									<Select>
										{selectablePositionLevels.map(level => <Option value={level.columnValue} key={level.columnValue}>{level.valueDesc}</Option>)}
									</Select>
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='职位编码'
								colon={false}
							>
								{getFieldDecorator('positionCode', {
									validateTrigger: 'onBlur',
									rules: [
										{ required: true, message: '请输入职位编码' },
										{ pattern: /^[a-zA-Z0-9_]{1,10}$/, message: '英文数字下划线(20字符以内)' }
									],
									initialValue: isCreate ? '' : formData.positionCode
								})(
									<Input placeholder='请输入职位编码' />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='职位描述'
								colon={false}
							>
								{getFieldDecorator('positionDesc', {
									validateTrigger: 'onBlur',
									initialValue: isCreate ? '' : formData.positionDesc,
									rules: [
										{ max: 200, message: '最多200字符' }
									]
								})(
									<Input.TextArea placeholder='请输入职位描述' autosize={{ minRows: 3 }} />
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='上级职位'
								colon={false}
							>
								{getFieldDecorator('fPositionId', {
									initialValue: isCreate ? '' : formData.fPositionId
									// validateTrigger: 'onBlur',
									// rules: [
									// 	{ required: !isCreate && hasSetPositionId, message: '请选择上级职位' }
									// ]
								})(
									<Select
										showSearch
										allowClear
										optionFilterProp='children'
										placeholder='请选择职位'
									>
										{
											Object.keys(this.state.fpositionList).map(item =>
												(<OptGroup label={item} key={item}>
													{(this.state.fpositionList[item] || []).map(items => <Option value={items.positionId} key={item.positionId}>{items.positionName}</Option>)}
												</OptGroup>))
										}
									</Select>
								)}
							</FormItem>
							<FormItem
								{...formItemLayout}
								label='数据权限'
								colon={false}
							>
								{getFieldDecorator('authType', {
									validateTrigger: 'onBlur',
									initialValue: isCreate ? '' : formData.authType,
									rules: [
										{ required: true, message: '请选择数据权限' }
									]
								})(
									<Select>
										{authTypes.map(type => <Option value={type.columnValue} key={type.columnValue}>{type.valueDesc}</Option>)}
									</Select>
								)}
							</FormItem>
							{/* <FormItem
								{...formItemLayout}
								label='是否经理'
								colon={false}
							>
								{getFieldDecorator('isManager', {
									valuePropName: 'checked',
									initialValue: isCreate ? false : formData.isManager === 2
								})(
									<Switch />
								)}
							</FormItem> */}
							<FormItem
								{...formItemLayout}
								label='是否启用'
								colon={false}
							>
								{getFieldDecorator('isActive', {
									valuePropName: 'checked',
									initialValue: isCreate ? true : formData.isActive === 1
								})(
									<Switch />
								)}
							</FormItem>
						</Col>
					</Row>
					<Row type='flex' justify='center' style={{ marginTop: 40 }}>
						<Col>
							<Button
								style={{ marginRight: 20 }}
								type='primary'
								loading={this.state.btnLoading}
								onClick={this.save(1)}
							>
								保存
							</Button>
							<Button
								type='primary'
								loading={this.state.btnLoading}
								onClick={this.save(2)}
							>
								保存并配置
							</Button>
						</Col>
					</Row>
				</Form>
			</React.Fragment>
		)
	}
}
const CreatePosition = Form.create()(CreatePositionForm)
export default CreatePosition
