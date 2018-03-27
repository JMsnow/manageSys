import React from 'react'
import { Upload, Icon, Modal } from 'antd'
import { uniqueId } from 'lodash'
import style from './style.scss'

function transformValue(list) {
	return (list || []).map(v => Object.assign({
		uid: uniqueId('init_'),
		status: 'done'
	}, v))
}
export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: '',
			/* {
			 uid: -1,
			 name: 'xxx.png',
			 status: 'done',
			 url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
			 } */
			fileList: transformValue(this.props.value)
		}
	}
	componentWillReceiveProps(nextProps) {
		// Should be a controlled component.
		if ('value' in nextProps) {
			const value = nextProps.value
			this.setState({ fileList: transformValue(value) })
		}
	}
	onCancel = () => this.setState({ previewVisible: false })
	onPreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true
		})
	}
	onChange = ({ fileList }) => {
		fileList = fileList.map((file) => {
			if (file.response) {
				// Component will show file.url as link
				file.url = file.response.data
			}
			return file
		})
		this.setState({ fileList })
		this.triggerChange([...fileList])
	}
	triggerChange = (changedValue) => {
		// Should provide an event to pass value to Form.
		const onChange = this.props.onChange
		if (onChange) {
			onChange(changedValue)
		}
	}
	onBeforeUpload = (file) => {
		const isImage = file.type.indexOf('image') > -1

		if (!isImage) {
			message.error('请选择图片')
			return false
		}
	}
	customRequest = async ({ action, file, onSuccess, onError }) => {
		try {
			const res = await request.upload(action, file)
			message.success('图片上传成功')
			onSuccess(res)
		} catch (err) {
			debug.error('图片上传失败')
			onError(err)
		}
	}
	render() {
		const { onlyDisplay, limitCount = Infinity, action, customRequest = this.customRequest, ...uploadProps } = this.props
		const { previewVisible, previewImage, fileList } = this.state
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">Upload</div>
			</div>
		)
		return (
			<div className={`${style.upload} clearfix ${onlyDisplay ? style.only_display : ''}`}>
				<Upload
					{...uploadProps}
					action={ action }
					customRequest={customRequest}
					beforeUpload={this.onBeforeUpload}
					listType="picture-card"
					fileList={fileList}
					onPreview={this.onPreview}
					onChange={this.onChange}
				>
					{ (onlyDisplay || fileList.length >= limitCount) ? null : uploadButton}
				</Upload>
				<Modal visible={previewVisible} footer={null} onCancel={this.onCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		);
	}
}
