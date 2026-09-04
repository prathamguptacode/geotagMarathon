import { ReactNode } from 'react'
import { Pressable } from 'react-native'

type ButtonProps = {
    onPress?: () => void,
    children?: ReactNode
}

const Button = ({ children, onPress }: ButtonProps) => {
    return (
        <Pressable onPress={onPress} >
            {children}
        </Pressable>
    )
}

export default Button
