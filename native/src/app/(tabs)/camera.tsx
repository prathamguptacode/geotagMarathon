import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { ReactNode, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const camera = () => {
    const [camPerm, requestCamPerm] = useCameraPermissions()

    console.log(camPerm)
    useEffect(() => {
        requestCamPerm()
    }, [])


    const cameraRef = useRef<CameraView>(null)


    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <CameraView ref={cameraRef} style={styles.cameraContainer}>
                <View style={[styles.buttons, styles.topButtons]}>
                    <ToolButton>
                        <AntDesign name="close" size={16} color="white" />
                    </ToolButton>
                </View>
                <View style={[styles.buttons, styles.bottomButtons]}>
                    <View style={styles.bottomButtonWrapper}>
                        <ToolButton style={{ marginRight: 'auto' }}>
                            <MaterialIcons name="insert-photo" size={28} color="white" />
                        </ToolButton>
                    </View>
                    <View style={styles.bottomButtonWrapper}>
                        <ToolButton style={styles.captureButton} />
                    </View>
                    <View style={styles.bottomButtonWrapper}>
                        <Pressable style={styles.reverseButton}>
                            <MaterialIcons name="flip-camera-android" size={28} color="white" />
                        </Pressable>
                    </View>
                </View>
            </CameraView>
        </SafeAreaView>
    )
}

export default camera

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topButtons: {
        justifyContent: 'space-between',
        padding: 16,
    },
    bottomButtons: {
        justifyContent: 'space-between',
        padding: 16,
        paddingBlockEnd: 32
    },
    bottomButtonWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        borderRadius: '50%',
        padding: 10
    },
    captureButton: {
        width: 56,
        aspectRatio: 1,
        outlineColor: 'white',
        outlineOffset: 2,
        outlineWidth: 4,
        backgroundColor: 'white',
    },
    reverseButton: {
        transform: [{ rotate: '45deg' }],
        marginLeft: 'auto'
    }
});

type ToolButtonProps = {
    onPress?: () => void,
    style?: StyleProp<ViewStyle>,
    children?: ReactNode
}

const ToolButton = ({ onPress, style, children }: ToolButtonProps) => {
    return (
        <Pressable style={[styles.button, style]} onPress={onPress} >
            {children}
        </Pressable>
    )
}