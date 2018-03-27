import React from 'react'
import { Form, Row, Col, Button } from 'antd'

import style from './style.scss'

export default function (
	{
		formOpts = {},
		rowProps  = { gutter: 24 },
		// [[{ colProps, itemProps, isOperate, label, id, options, input }]], getFieldDecorator(id, options)
		fieldDecorator = [],
		isInitSearch = true,
		validateFields = (err, { values }) => err || console.log('Received values of form: ', values),
		isOperateShow = true,
		operateRender = ( { onSearch, onReset }) => (
			<React.Fragment>
				<Button type="primary" onClick={onSearch}>查询</Button>
				<Button style={{ marginLeft: 8 }} onClick={onReset}>
					重置
				</Button>
			</React.Fragment>
		)
	} = {}
) {
	class AdvancedSearchForm extends React.Component {
		state = {
		}
		componentDidMount() {
			isInitSearch && this.onSearch('initSearch')
		}
		onSearch = (event) => {
			if (event && typeof event.preventDefault === 'function') {
				event.preventDefault()
			}
			this.props.form.validateFields((err, values) => validateFields(err, { values, event }))
		}
		onReset = () => {
			this.props.form.resetFields();
		}
		getFields(decorator) {
			const { getFieldDecorator } = this.props.form
			return decorator.map((
				{
					colProps = { span: 6 },
					itemProps = {
						labelCol: { span: 6 },
						wrapperCol: { span: 18 }
					},
					isOperate = false,
					label, id, options, input
				}, i) => (
				<Col {...colProps} key={i.toString()}>
					{
						isOperate ? <div style={{ padding: '10px 0', textAlign: 'right' }}>{this.getOperate()}</div> : (
							<Form.Item {...itemProps} label={label}>
								{getFieldDecorator(id, options)(input)}
							</Form.Item>
						)
					}
				</Col>
			))
		}
		getOperate() {
			return operateRender({ onSearch: this.onSearch,onReset:this.onReset })
		}
		render() {
			const fields = (Array.isArray(fieldDecorator[0]) ? fieldDecorator : [fieldDecorator])
			const foot = isOperateShow ? (
				<Row>
					<Col span={24} style={{ textAlign: 'right' }}>
						{this.getOperate()}
					</Col>
				</Row>
			) : null
			return (
				<Form
					className={style.form}
					onSubmit={this.onSearch}
				>
					{
						fields.map((decorator, i) => (
						<Row {...rowProps} key={i.toString()}>{this.getFields(decorator)}</Row>
						))
					}
					{foot}
				</Form>
			);
		}
	}

	return Form.create(formOpts)(AdvancedSearchForm)
}
