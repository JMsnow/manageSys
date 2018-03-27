import React, { Component } from 'react'
import { Upload, Icon, message } from 'antd'
import styles from './index.scss'

class FileUpload extends Component {
	state = {
		imageUrl: null
	}

	componentWillReceiveProps(nextProps) {
		if ('value' in nextProps) {
			const value = nextProps.value
			this.setState({ imageUrl: value })
		}
	}

	handleBeforeUpload = (file) => {
		const isImage = file.type.indexOf('image') > -1

		if (!isImage) {
			message.error('请选择图片')
			return false
		}

		request.upload(HTTP_CMD.PRODUCT_UPLOAD, file).then((res) => {
			message.success('图片上传成功')

			const imageUrl = res.data

			this.setState({
				imageUrl
			})

			const { onChange } = this.props

			if (typeof onChange === 'function') {
				onChange(imageUrl)
			}
		}).catch(() => {
			debug.error('图片上传失败')
		})

		return false
	}

	render() {
		const { imageUrl } = this.state
		const uploadProps = {
			showUploadList: false,
			beforeUpload: this.handleBeforeUpload,
			className: styles['poster-uploader']
		}

		return (
			<Upload {...uploadProps}>
				{imageUrl ? <img src={imageUrl} className='poster' alt='产品主图' /> : <Icon type='plus' className='poster-uploader-trigger' />}
			</Upload>
		)
	}
}

export default FileUpload
