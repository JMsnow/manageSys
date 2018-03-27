import React from 'react'
import { Tag } from 'antd'
import style from './style.scss'

const CheckableTag = Tag.CheckableTag

const TagsWrap = props => (
	<div className='item'>
		<strong>{props.data.title}：</strong>
		<span>
			{
				props.data.tags.map(
					item => (<CheckableTag
						key={item.key}
						checked={props.selectedTags.indexOf(item.key) > -1}
						onChange={checked => props.handleChange(item, checked)}
					>
						{item.desc}
					</CheckableTag>)
				)
			}
		</span>
	</div>
)

class TagSelect extends React.Component {
	handleChange = (item, checked) => {
		const { onChange } = this.props
		const nextSelectedTags = checked ? [item.key] : []
		onChange(nextSelectedTags)
	}
	render() {
		const { dataSource, selectedTags } = this.props
		return (
			<div className={style.wrap}>
				{
					dataSource.map(
						item => (
							<TagsWrap
								data={item}
								selectedTags={selectedTags}
								handleChange={this.handleChange}
							/>
						)
					)
				}
			</div>
		)
	}
}

export default TagSelect
