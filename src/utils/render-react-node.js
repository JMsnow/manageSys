import ReactDOM from 'react-dom'

export default async function renderReactNode({ getContainer, getContent }) {
	const div = document.createElement('div')
	if (getContainer) {
		const root = getContainer()
		root.appendChild(div)
	} else {
		document.body.appendChild(div)
	}
	let called = false
	function destroy() {
		if (called) {
			return
		}
		called = true

		// console.log('unmountComponentAtNode', div)

		ReactDOM.unmountComponentAtNode(div)
		div.parentNode.removeChild(div)
	}

	const content = await getContent({ destroy })

	ReactDOM.render(content, div)

	return {
		destroy
	}
}
