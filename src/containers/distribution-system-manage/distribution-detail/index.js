import React from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Table } from 'antd'
import AuthBtn from 'components/auth-button'
import style from './style.scss'

const DetailItem = props => (
	<Col span={8}>
		<div className='detailItem'>
			<span>{props.label}：</span>
			<span>{props.children}</span>
		</div>
	</Col>
)

class DistributionDetail extends React.Component {
	state = {
		tableLoading: false,
		distributionDetail: {},
		distributorsData: []
	}

	componentWillMount() {
		this._getDistributionDetail()
	}

	_getDistributionDetail = () => {
		const agentProgramId = this.props.match.params.id
		request.send(HTTP_CMD.DISTRIBUTION_SYS_DETAIL, { agentProgramId }).then((res) => {
			this.setState({
				distributionDetail: res.data
			})
		})
	}

	render() {
		const columns = [
			{
				title: '分销商名称',
				dataIndex: 'agentProgramName'
			},
			{
				title: '分销商编号',
				dataIndex: 'deptName'
			},
			{
				title: '证件号码',
				dataIndex: 'createDt'
			},
			{
				title: '分销级别',
				dataIndex: 'creator'
			},
			{
				title: '加入时间',
				dataIndex: 'agentProgramId'
			},
			{
				title: '当前状态',
				dataIndex: 'agentProgramId'
			}
		]
		const { distributionDetail } = this.state
		return (
			<div className={style.detail}>
				<div className='detailTitle'>
					<span>分销体系详情</span>
					<span>
						<Link to={{
							pathname: '/app/distribution-system-manage/distribution-create',
							state: { pageState: 2, id: this.props.match.params.id }
						}}
						>
							<AuthBtn type='primary' style={{ marginRight: 10 }}>复制</AuthBtn>
						</Link>
						<Link to={{
							pathname: `/app/distribution-system-manage/distribution-modify/${this.props.match.params.id}`,
							state: { pageState: 3 }
						}}
						>
							<AuthBtn type='primary' actionId={ACTIONIDS_CMD.AGENT_SYS_MODIFY}>编辑</AuthBtn>
						</Link>
					</span>
				</div>
				<Row style={{ lineHeight: 2.5 }}>
					<DetailItem label='体系名称'>{distributionDetail.agentProgramName}</DetailItem>
					<DetailItem label='体系描述'>{distributionDetail.agentProgramDesc}</DetailItem>
					<DetailItem label='更新日期'>{distributionDetail.updateDt}</DetailItem>
					<DetailItem label='更新者'>{distributionDetail.updater}</DetailItem>
					<DetailItem label='业务负责人'>
						{
							distributionDetail.employeeDtoList ?
								distributionDetail.employeeDtoList.map(
									(item, index, arr) => (
										<span>
											{`${item.employeeName}-${item.positionName}`}
											{arr.length === index + 1 ? null : '、'}
										</span>
									)
								)
								: null
						}
					</DetailItem>
					<DetailItem label='所属组织'>
						{
							distributionDetail.boOrgDtoList ?
								distributionDetail.boOrgDtoList.map(
									(item, index, arr) => (<span>
										{item.deptName}{arr.length === index + 1 ? null : '、'}
									</span>)
								)
								: null
						}
					</DetailItem>
				</Row>
				<div className='divider' />
				<div className='distributorTitle'>{distributionDetail.agentProgramName}的分销商</div>
				<Table
					scroll={{ y: 500 }}
					rowKey='agentProgramId'
					loading={this.state.tableLoading}
					columns={columns}
					dataSource={this.state.distributorsData}
				/>
			</div>
		)
	}
}

export default DistributionDetail
