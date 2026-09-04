import { Image, Modal, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { CameraCapturedPicture, CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

const camera = () => {
    const [camPerm, requestCamPerm] = useCameraPermissions()

    useEffect(() => {
        requestCamPerm()
    }, [])


    const cameraRef = useRef<CameraView>(null)
    const [facing, setFacing] = useState<CameraType>('back')
    const [picture, setPicture] = useState<CameraCapturedPicture>()


    const handleCapturePicture = async () => {
        const camera = cameraRef.current
        if (!camera) return


        try {
            const picture = await camera.takePictureAsync()
            setPicture(picture)
        } catch (error) {
            console.error(error)
        }

    }

    const handleCameraFlip = () => {
        setFacing(prev => prev == 'back' ? 'front' : 'back')
    }

    if (!camPerm?.granted) return

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <CameraView animateShutter={false} facing={facing} ref={cameraRef} style={styles.cameraContainer}>
                <View style={[styles.buttons, styles.topButtons]}>
                    <CloseButton onPress={router.back} />
                </View>
                <View style={[styles.buttons, styles.bottomButtons]}>
                    <View style={styles.bottomButtonWrapper}>
                        <ToolButton style={{ marginRight: 'auto' }}>
                            <MaterialIcons name="insert-photo" size={28} color="white" />
                        </ToolButton>
                    </View>
                    <View style={styles.bottomButtonWrapper}>
                        <ToolButton style={styles.captureButton} onPress={handleCapturePicture} />
                    </View>
                    <View style={styles.bottomButtonWrapper}>
                        <Pressable style={styles.reverseButton} onPress={handleCameraFlip}>
                            <MaterialIcons name="flip-camera-android" size={28} color="white" />
                        </Pressable>
                    </View>
                </View>
            </CameraView>
            <PicturePreview picture={picture} setPicture={setPicture} />
        </SafeAreaView>
    )
}

export default camera

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topButtons: {
        justifyContent: 'space-between',
        padding: 16,
    },
    bottomButtons: {
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
    },
    picturePreview: {
        backgroundColor: 'black'
    },
    previewOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBlock: 8,
        paddingInline: 16,
        gap: 32
    },
    previewOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderRadius: 12,
        paddingBlock: 12,
        paddingInline: 16,
        backgroundColor: 'red'
    },
    previewText: {
        fontSize: 16,
        fontWeight: 500
    },
    previewImageWrapper: {
        flex: 1,
        position: 'relative'
    },
    geoTagOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0BA3FF'
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

type CloseButtonProps = {
    onPress?: () => void
}

const CloseButton = ({ onPress }: CloseButtonProps) => {
    return (
        <ToolButton onPress={onPress}>
            <AntDesign name="close" size={16} color="white" />
        </ToolButton>
    )
}

type PicturePreviewProps = {
    picture: CameraCapturedPicture | undefined,
    setPicture: Dispatch<SetStateAction<CameraCapturedPicture | undefined>>,
}

const PicturePreview = ({ picture, setPicture }: PicturePreviewProps) => {
    const handleClose = () => {
        //if(isNotUploadingImage) // only if not uploading image, proceed

        setPicture(undefined) //reset pictureUri
    }

    const handleSave = async () => {
        if (!picture) return
        const formData = new FormData()
        const response = await fetch(picture.uri)
        const file = await response.blob()

        formData.append('file', file)
        

    }


    return (
        <Modal style={styles.picturePreview} onRequestClose={handleClose} visible={!!picture}>
            <View style={styles.previewOptions}>
                <CloseButton onPress={handleClose} />
            </View>
            <View style={styles.previewImageWrapper}>
                <Image source={{ uri: picture?.uri }} style={{ width: '100%', height: 0, flex: 1 }} />
                {/* <View style={styles.geoTagOverlay}>
                    <Text style={{ color: 'red' }}> THIS IS GREAT SHIT IF THIS IS POSSIBLE</Text>
                    <MaterialIcons name="location-pin" size={24} color="white" />
                </View> */}
            </View>
            <View style={styles.previewOptions}>
                <Pressable onPress={handleClose} style={[styles.previewOption, { backgroundColor: 'white' }]}>
                    <MaterialIcons name="camera" size={24} color="black" />
                    <Text style={styles.previewText}>
                        Take Another
                    </Text>
                </Pressable>


                <Pressable onPress={handleSave} style={[styles.previewOption, { backgroundColor: '#0BA3FF' }]}>
                    <MaterialIcons name="save" size={24} color="white" />
                    <Text style={[styles.previewText, { color: 'white' }]}>
                        Save Now
                    </Text>
                </Pressable>

            </View>
        </Modal >
    )
}

