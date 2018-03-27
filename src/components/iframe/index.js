import React, { Component } from 'react'

class Iframe extends Component {
	render() {
		let url = utils.extractParameterByName('url')
		const userid = utils.getLocalData('userid')
		url = url.replace('#', '%23')

		if (url.indexOf('?') > -1) {
			url = `${url}&userId=${userid}`
		} else {
			url = `${url}?userId=${userid}`
		}

		return (
			<iframe
				title='distribution'
				src={url}
				{...this.props}
				frameBorder='0'
				height='99%'
				width='100%'
				style={{ background: '#fff' }}
			/>
		)
	}
}

export default Iframe
