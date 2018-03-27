import React, { Component } from 'react'
import { Input, Button, Table } from 'antd'

const Search = Input.Search

class RebateStatement extends Component {
	state = {
		current: 1,
		total: 0,
		dataSource: [],
		selectedRowKeys: [],
		loading: false
	}

	handleSelectionChange = (selectedRowKeys) => {
		this.setState({
			selectedRowKeys
		})
	}

	render() {
		const columns = [
			{
				title: '结算编号',
				dataIndex: 'rebateNo'
			},
			{
				title: '结算对象',
				dataIndex: 'rebatePerson'
			},
			{
				title: '结算账号',
				dataIndex: 'rebateAccount'
			},
			{
				title: '结算金额',
				dataIndex: 'rebateAmount'
			},
			{
				title: '结算时间',
				dataIndex: 'rebateTime'
			},
			{
				title: '结算方式',
				dataIndex: 'rebateType'
			},
			{
				title: '结算人',
				dataIndex: 'rebatePerson'
			},
			{
				title: '操作',
				dataIndex: 'rebateId',
				render: () => (
					<span>
						<Button>查看</Button>
					</span>
				)
			}
		]

		const {
			current,
			total,
			dataSource,
			selectedRowKeys,
			loading
		} = this.state

		const pagination = {
			current,
			total,
			onChange: (page) => {
				this.setState({
					current: page
				})
			}
		}

		const rowSelection = {
			selectedRowKeys,
			onChange: this.handleSelectionChange
		}

		const searchProps = {
			style: { width: 250 }
		}

		const tableProps = {
			columns,
			loading,
			dataSource,
			pagination,
			rowSelection,
			rowKey: 'rebateId',
			bordered: true
		}

		return (
			<div>
				<div className='g__block_flex_space-between'>
					<Search {...searchProps} />
					<div>
						<Button key='export' style={{ marginRight: 10 }} disabled={selectedRowKeys.length < 1}>导出</Button>
						<Button key='send' disabled={selectedRowKeys.length < 1}>发送</Button>
					</div>
				</div>
				<div style={{ marginTop: 20 }}>
					<Table {...tableProps} />
				</div>
			</div>
		)
	}
}

export default RebateStatement
