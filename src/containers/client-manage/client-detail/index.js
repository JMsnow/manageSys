import React, { Component } from 'react'
import { Row, Col } from 'antd'
import AuthBtn from 'components/auth-button'

const DetailItem = props => (
	<Col span={8}>
		<span>{props.label}：</span>
		<span style={{ color: 'rgba(0,0,0,0.5)' }}>{props.children}</span>
	</Col>
)

class ClientDetail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			clientDetailData: {},
			clientRecord: this.props.location.state.record, // 列表页传来的当前客户数据
			principalData: [] // 负责人数据
		}
	}

	componentWillMount() {
		debug.log(this.props.location.state.record)
		const { clientRecord } = this.state
		request.send(HTTP_CMD.CLIENT_DETAIL,
			{ customerId: clientRecord.customerId, customerType: clientRecord.customerType }
		)
			.then((res) => {
				this.setState({ clientDetailData: res.data })
			})
		this._loadPrincipalData()
	}

	_loadPrincipalData = () => { // 获取负责人下拉列表数据
		request.send(HTTP_CMD.SELECT_PRINCIPAL, { keywords: '' }).then((res) => {
			this.setState({ principalData: res.data })
		})
	}

	handleModify = () => {
		const { clientRecord } = this.state
		this.props.history.push(
			`/app/client-manage/client-modify/${clientRecord.customerId}`,
			{ record: clientRecord }
		)
	}

	renderPrincipal = () => {
		const { clientDetailData, principalData } = this.state
		const positionIds = clientDetailData.boPositionDtoList.map(item => item.positionId)
		const renderData = []
		principalData.forEach((item) => {
			if (positionIds.indexOf(item.positionId) > -1) {
				const p = <span>{`${item.employeeName}-${item.positionName}`}、</span>
				renderData.push(p)
			}
		})
		return renderData
	}

	render() {
		const { clientDetailData } = this.state
		return (
			<div>
				<div className='g__block_flex_space-between'>
					<span style={{ fontSize: 16, color: '#000' }}>客户详情</span>
					<AuthBtn
						type='primary'
						onClick={this.handleModify}
						actionId={ACTIONIDS_CMD.CLIENT_MODIFY}
					>
						编辑客户
					</AuthBtn>
				</div>
				<Row style={{ lineHeight: 2.5, marginTop: 10 }}>
					<DetailItem label='客户类型'>{CONFIG.accountTypes[clientDetailData.customerType]}</DetailItem>
					<DetailItem label='客户名称'>{clientDetailData.customerName}</DetailItem>
					<DetailItem label='识别码类型'>{CONFIG.accountTypes[clientDetailData.idType]}</DetailItem>
					<DetailItem label='识别码编号'>{clientDetailData.idCode}</DetailItem>
					<DetailItem label='电话号码'>{clientDetailData.mobile}</DetailItem>
					<DetailItem label='邮箱'>{clientDetailData.email}</DetailItem>
					<DetailItem label='客户状态'>{clientDetailData.isActive ? '有效' : '无效'}</DetailItem>
					<DetailItem label='创建日期'>{clientDetailData.createDt}</DetailItem>
					<DetailItem label='创建者'>{clientDetailData.creatorId}</DetailItem>
					<DetailItem label='更新日期'>{clientDetailData.updateDt}</DetailItem>
					<DetailItem label='更新者'>{clientDetailData.updaterId}</DetailItem>
				</Row>
				<Row style={{ marginTop: 10 }}>
					<DetailItem label='所属个人'>
						{
							clientDetailData.boPersonDtoList ?
								clientDetailData.boPersonDtoList.map(item => <span>{item.contactName}、</span>)
								: null
						}
					</DetailItem>
					<DetailItem label='业务负责人'>
						{
							clientDetailData.boPositionDtoList ?
								this.renderPrincipal()
								: null
						}
					</DetailItem>
					<DetailItem label='所属组织'>
						{
							clientDetailData.boOrgDtoList ?
								clientDetailData.boOrgDtoList.map(item => <span>{item.deptName}、</span>)
								: null
						}
					</DetailItem>
				</Row>
			</div>
		)
	}
}

export default ClientDetail
