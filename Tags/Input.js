import React from "react"
import { View, TextInput } from "react-native"

import styles from "./styles"

const Input = (props) => {
	const {
		value,
		onChangeText,
		onSubmitEditing,
		onKeyPress,
		inputStyle,
		inputContainerStyle,
		textInputProps,
	} = props

	return (
		<View style={[styles.textInputContainer, inputContainerStyle]}>
			<TextInput
				{...textInputProps}
				style={[styles.textInput, inputStyle]}
				value={value}
				onChangeText={onChangeText}
				onSubmitEditing={onSubmitEditing}
				onKeyPress={onKeyPress}
				underlineColorAndroid="transparent"
			/>
		</View>
	)
}

export { Input }
export default Input
