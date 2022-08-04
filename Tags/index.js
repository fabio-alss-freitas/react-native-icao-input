import React, { useState, useImperativeHandle, useEffect } from "react"
import PropTypes from "prop-types"
import { View } from "react-native"

import Tag from "./Tag"
import Input from "./Input"
import styles from "./styles"

const Tags = React.forwardRef((props, ref) => {
	useImperativeHandle(
		ref,
		() => ({
			clear: () => clearTags(),
		}),
		[ref]
	)

	const {
		containerStyle,
		style,
		readonly,
		maxNumberOfTags,
		tagContainerStyle,
		tagTextStyle,
		deleteTagOnPress,
		onTagPress = () => {},
		renderTag,
		initialTags = [],
		initialText,
		onChangeTags = () => {},
	} = props
	const [tags, setTags] = useState(initialTags)
	const [text, setText] = useState(initialText)

	useEffect(() => {
		onChangeTags(tags || [])
	}, [tags])

	const showLastTag = () => {
		const aux = [...tags]
		setTags(aux?.slice(0, -1) || [])
		setText(aux?.slice(-1)[0]?.slice(0, -1) || "")
	}

	const addTag = (text) => {
		setTags((prev) => [...prev, text.trim()])
		setText("")
	}

	const clearTags = () => {
		setTags([])
		setText("")
	}

	const onChangeText = (text) => {
		if (text.length === 0) {
			showLastTag()
		} else if (text.length == 4 && !(tags.indexOf(text.slice(0, -1).trim()) > -1)) {
			addTag(text.replace(/[^a-zA-Z0-9]/g, ""))
		} else {
			setText(text.replace(/[^a-zA-Z0-9]/g, ""))
		}
	}

	const onKeyPress = ({ nativeEvent }) => {
		if (nativeEvent.key === "Backspace" && text?.length === 0) {
			showLastTag()
		}
	}

	return (
		<View style={[styles.container, containerStyle, style]}>
			{tags.map((tag, index) => {
				const tagProps = {
					tag,
					index,
					deleteTagOnPress,
					onPress: (event) => {
						event?.persist()
						if (deleteTagOnPress && !readonly) {
							setTags((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
							onTagPress(index, tag, event, true)
						} else {
							onTagPress(index, tag, event, false)
						}
					},
					tagContainerStyle,
					tagTextStyle,
				}

				return renderTag(tagProps)
			})}

			{!readonly && maxNumberOfTags > tags.length && (
				<Input value={text} onChangeText={onChangeText} onKeyPress={onKeyPress} {...props} />
			)}
		</View>
	)
})

Tags.defaultProps = {
	initialTags: [],
	initialText: " ",
	createTagOnString: [",", " "],
	createTagOnReturn: false,
	readonly: false,
	deleteTagOnPress: true,
	maxNumberOfTags: Number.POSITIVE_INFINITY,
	renderTag: ({ tag, index, ...rest }) => <Tag key={`${tag}-${index}`} label={tag} {...rest} />,
}

Tags.propTypes = {
	initialText: PropTypes.string,
	initialTags: PropTypes.arrayOf(PropTypes.string),
	createTagOnString: PropTypes.array,
	createTagOnReturn: PropTypes.bool,
	onChangeTags: PropTypes.func,
	readonly: PropTypes.bool,
	maxNumberOfTags: PropTypes.number,
	deleteTagOnPress: PropTypes.bool,
	renderTag: PropTypes.func,
	/* style props */
	containerStyle: PropTypes.any,
	style: PropTypes.any,
	inputContainerStyle: PropTypes.any,
	inputStyle: PropTypes.any,
	tagContainerStyle: PropTypes.any,
	tagTextStyle: PropTypes.any,
	textInputProps: PropTypes.object,
}

export { Tags }
export default Tags
