import { Alert, Image, Modal, Pressable, Share, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { CameraCapturedPicture, CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import axios from 'axios'
import * as Location from 'expo-location';

const camera = () => {
    const [camPerm, requestCameraPermission] = useCameraPermissions()
    const [capturing, setCapturing] = useState(false)
    const [location, setLocation] = useState<Location.LocationObject>()

    const requestLocationPermission = async () => {
        await Location.requestForegroundPermissionsAsync()
    }

    const getCurrentLocation = async () => {
        const location = await Location.getCurrentPositionAsync()
        setLocation(location)
        return location
    }

    useEffect(() => {
        requestCameraPermission()
        requestLocationPermission()
    }, [])





    const cameraRef = useRef<CameraView>(null)
    const [facing, setFacing] = useState<CameraType>('back')
    const [picture, setPicture] = useState<CameraCapturedPicture>()


    const handleCapturePicture = async () => {
        const camera = cameraRef.current
        if (!camera || capturing) return

        setCapturing(true)

        try {
            const picturePromise = camera.takePictureAsync()
            const locationPromise = getCurrentLocation()
            const [picture, location] = await Promise.all([
                picturePromise,
                locationPromise
            ])
            setPicture(picture)
            console.log(location)
        } catch (error) {
            console.error(error)
        } finally {
            setCapturing(false)
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
            <PicturePreview location={location} picture={picture} setPicture={setPicture} />
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
        padding: 16,

        flexDirection: 'row'
    },
    geoTagContent: {
        flex: 1,
        backgroundColor: 'hsla(0 0% 0% / 1)',
        borderRadius: 20,
        paddingBlock: 16,
        paddingInline: 24
    },
    headingAddress: {
        fontSize: 24,
        fontWeight: 600
    },
    geoTagText: {
        fontWeight: 500,
        fontSize: 16,
        color: 'white'
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
    location: Location.LocationObject | undefined
}

const PicturePreview = ({ picture, setPicture, location }: PicturePreviewProps) => {
    const [isFetching, setisFetching] = useState(false)
    const [address, setAddress] = useState<Location.LocationGeocodedAddress>()

    const handleClose = () => {
        if (!isFetching) setPicture(undefined)
    }

    const handleSave = async () => {
        if (!picture) return

        const formData = new FormData()
        const file = {
            name: 'something',
            uri: picture.uri,
            type: `image/${picture.format.slice(1)}`
        } as unknown as File
        formData.append('img', file)

        setisFetching(true)
        try {
            const response = await axios.post('http://10.81.96.142:8080/', formData, {
                headers: {
                    latitude: 18,
                    longitude: 23
                }
            })

            console.info("RESPONSE:", response.data)

        } catch (error) {
            console.error("AXIOS ERROR:", error)
        } finally {
            setisFetching(false)
        }
    }

    const handleShare = async () => {
        try {
            const url = 'https://youtu.be/VdvMZzSWEX0?si=nq9ID3-gNxIKvlWa'
            await Share.share({ message: url })
        } catch (error) {
            console.error("Sharing error:", error)
        }
    }

    const getReverseGeocode = async () => {
        if (!location) return
        const reverseGeoCode = await Location.reverseGeocodeAsync(location.coords)
        console.log(reverseGeoCode)
        const formattedAddress = reverseGeoCode[0].formattedAddress ?? ''
        setAddress({ ...reverseGeoCode[0], formattedAddress: formattedAddress.split(`${reverseGeoCode[0].name}, `)[1] })
        return reverseGeoCode
    }

    useEffect(() => {
        if (!picture) return setAddress(undefined)
        getReverseGeocode()
    }, [picture])

    const temp = 'https://wallpapercave.com/wp/wp5017784.jpg'
    return (
        <Modal style={styles.picturePreview} onRequestClose={handleClose} visible={!!picture}>
            <View style={styles.previewOptions}>
                <CloseButton onPress={handleClose} />
            </View>
            <View style={styles.previewImageWrapper}>
                <Image source={{ uri: picture?.uri }} style={{ width: '100%', height: 0, flex: 1 }} />
                <View style={styles.geoTagOverlay}>
                    <View style={styles.geoTagContent}>
                        <Text style={[styles.headingAddress, styles.geoTagText]}>
                            {`${address?.city}, ${address?.country}`}
                        </Text>
                        <Text style={styles.geoTagText} >
                            {address?.formattedAddress}
                        </Text>
                        <Text style={styles.geoTagText}>
                            {`Latitude: ${location?.coords.latitude} Longitude: ${location?.coords.longitude}`}
                        </Text>
                        <Text style={styles.geoTagText}>{new Date(location?.timestamp ?? 0).toLocaleString('en-gb', { dateStyle: 'full' })}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.previewOptions}>
                <Pressable onPress={handleShare} style={[styles.previewOption, { backgroundColor: 'white' }]}>
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