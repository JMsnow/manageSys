import React from 'react'
import { Select, Spin } from 'antd'

/*
* remoteOpts: { getData, isSearch, loadingContent }
* */
export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			list: []
		}
	}
	componentWillMount() {
		this.init()
	}
	queryData = async (text) => {
		const {
			remoteOpts: {
				getData = () => []
					= {}
			}
		} = this.props
		try {
			this.setState({ loading: true })
			const list = await getData(text)
			list && this.setState({ list })
		} finally {
			this.setState({ loading: false })
		}
	}
	init = async () => {
		await this.queryData()
	}
	render() {
		const { list } = this.state
		const {
			remoteOpts: {
				isSearch,
				loadingContent = <Spin size='small' />
			} = {},
			...selectProps
		} = this.props
		if (this.state.loading) {
			selectProps.notFoundContent = loadingContent
		}
		if (isSearch) {
			selectProps.showSearch = true
			selectProps.onSearch = utils.debounce(this.queryData, 400)
		}
		return (
			<Select
				{ ...selectProps}
			>
				{ list.map(({ value, text}, i) => <Select.Option key={i.toString()} value={value}>{text}</Select.Option>)}
			</Select>
		)
	}
}
