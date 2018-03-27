import React from 'react'
import { Input, Select, Form, Button, TreeSelect, message } from 'antd'
import { isArray } from 'lodash'

const FormItem = Form.Item
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode
const TextArea = Input.TextArea
const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 7 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 10 }
	}
}

class CreateModifyDistributionForm extends React.Component {
	state = {
		formInitData: {},
		pageState: 1, // 1创建 2复制 3编辑
		principalData: [],
		deptTreeData: [],
		btnLoading: false
	}

	componentWillMount() {
		const { state } = this.props.location
		this.setState({ pageState: state.pageState })
		if (state.pageState !== 1) {
			this._getFormInitData()
		}
		this._loadDepartTree()
		this._loadPrincipalData()
	}

	_getFormInitData = () => { // 加载表单初始数据
		const agentProgramId = this.props.match.params.id || this.props.location.state.id
		request.send(HTTP_CMD.DISTRIBUTION_SYS_DETAIL, { agentProgramId }).then((res) => {
			this.setState({
				formInitData: res.data
			})
		})
	}

	_loadDepartTree = () => { // 加载部门下拉列表数据
		request.send(HTTP_CMD.DEPT_LIST_ALL_ORG).then((res) => {
			this.setState({
				deptTreeData: helper.generateJsonTree(res.data)
			})
		})
	}

	_loadPrincipalData = () => { // 加载业务负责人数据
		request.send(HTTP_CMD.SELECT_PRINCIPAL)
			.then((res) => {
				this.setState({ principalData: res.data })
			})
	}

	handleFilterExistent = (rule, value, callback) => {
		debug.log(this.state.formInitData.agentProgramName)
		debug.log(value)
		if (this.state.formInitData.agentProgramName === value) {
			callback()
			return
		}
		request.send(HTTP_CMD.DISTRIBUTION_SYS_NAME_EXIST, { agentProgramName: value })
			.then((res) => {
				if (res.data === 2) {
					callback('该名称已经存在')
					return
				}
				callback()
			})
	}

	handleSubmit = (e) => {
		e.preventDefault()
		const form = this.props.form
		form.validateFields((err, values) => {
			const reqData = {
				...values,
				agentProgramId: this.props.match.params.id || '',
				positionIdList: isArray(form.getFieldValue('positionIdList')) ? form.getFieldValue('positionIdList') : [form.getFieldValue('positionIdList')]
			}
			const reqUrl = this.state.pageState === 3 ? HTTP_CMD.DISTRIBUTION_SYS_MODIFY : HTTP_CMD.DISTRIBUTION_SYS_CREATE

			if (!err) {
				this.setState({ btnLoading: true })
				request.send(reqUrl, reqData).then(() => {
					this.setState({ btnLoading: false })
					message.success(`${this.state.pageState === 3 ? '编辑成功！' : '创建成功！'}`)
					this.props.history.goBack()
				}).catch((res) => {
					debug.log(res)
					this.setState({ btnLoading: false })
					message.error(`${res.code}:${res.msg}`)
				})
			}
		})
	}

	renderPrinciple = () => {
		const { principalData } = this.state
		return (
			<Select
				showSearch
				optionFilterProp='children'
				placeholder='请选择业务负责人'
			>
				{
					principalData.length > 0 ?
						principalData.map(
							item => <Option value={`${item.positionId}`}>{`${item.employeeName}-${item.positionName}`}</Option>
						) :
						null
				}
			</Select>
		)
	}

	renderOrg = () => {
		debug.log(this.state.deptTreeData)
		const renderTreeNodes = data => data.map((item) => {
			if (item.children) {
				return (
					<TreeNode title={item.deptName} value={item.deptId} key={item.deptId}>
						{renderTreeNodes(item.children)}
					</TreeNode>
				)
			}
			return <TreeNode title={item.deptName} value={item.deptId} key={item.deptId} />
		})
		return (
			<TreeSelect
				dropdownMatchSelectWidth
				multiple
				showSearch
				placeholder='请选择组织'
				treeNodeFilterProp='title'
			>
				{
					this.state.deptTreeData.length > 0 ?
						renderTreeNodes(this.state.deptTreeData) :
						null
				}
			</TreeSelect>
		)
	}

	renderTreeNodes = data => data.map((item) => {
		if (item.children) {
			return (
				<TreeNode title={item.deptName} value={`${item.deptId}`} key={item.deptId}>
					{this.renderTreeNodes(item.children)}
				</TreeNode>
			)
		}
		return <TreeNode title={item.deptName} value={`${item.deptId}`} key={item.deptId} />
	})

	render() {
		const { getFieldDecorator } = this.props.form
		const { formInitData, pageState } = this.state
		return (
			<Form onSubmit={this.handleSubmit}>
				<FormItem
					{...formItemLayout}
					label='体系名称'
					colon={false}
				>
					{getFieldDecorator('agentProgramName', {
						validateFirst: true,
						validateTrigger: 'onBlur',
						initialValue: pageState === 1 ? '' : formInitData.agentProgramName,
						rules: [
							{ required: true, message: '请输入体系名称' },
							{ validator: this.handleFilterExistent }
						]
					})(
						<Input placeholder='请输入体系名称' />
					)}
				</FormItem>
				<FormItem
					{...formItemLayout}
					label='业务负责人'
					colon={false}
				>
					{getFieldDecorator('positionIdList', {
						initialValue: pageState === 1 ? [] : (formInitData.boPositionDtoList || []).map(item => `${item.positionId}`),
						validateTrigger: 'onBlur',
						rules: [
							{ required: true, message: '请选择业务负责人' }
						]
					})(this.renderPrinciple())}
				</FormItem>
				<FormItem
					{...formItemLayout}
					label='适用组织'
					colon={false}
				>
					{getFieldDecorator('orgIdList', {
						initialValue: pageState === 1 ? [] : (formInitData.boOrgDtoList || []).map(item => `${item.deptId}`),
						validateTrigger: 'onChange',
						rules: [{ required: true, message: '必选' }]
					})(
						<TreeSelect
							dropdownMatchSelectWidth
							multiple
							showSearch
							allowClear
							placeholder='请选择组织'
							treeNodeFilterProp='title'
						>
							{this.renderTreeNodes(this.state.deptTreeData)}
						</TreeSelect>
					)}
				</FormItem>
				<FormItem
					{...formItemLayout}
					label='体系描述'
					colon={false}
				>
					{getFieldDecorator('agentProgramDesc', {
						initialValue: pageState === 1 ? '' : formInitData.agentProgramDesc,
						validateTrigger: 'onBlur',
						rules: [{ max: 200, message: '最多200字符' }]
					})(
						<TextArea placeholder='请输入描述' autosize={{ minRows: 3, maxRows: 10 }} />
					)}
				</FormItem>
				<FormItem wrapperCol={{ span: 6, offset: 7 }} >
					<Button type='primary' loading={this.state.btnLoading} htmlType='submit'>
						保存
					</Button>
				</FormItem>
			</Form>
		)
	}
}
const CreateModifyDistribution = Form.create()(CreateModifyDistributionForm)
export default CreateModifyDistribution

