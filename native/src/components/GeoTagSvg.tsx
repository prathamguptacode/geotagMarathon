import Svg, { Rect, Text } from 'react-native-svg'
import * as Location from 'expo-location'

type GeoTagSvgProps = {
    address: Location.LocationGeocodedAddress | undefined,
    location: Location.LocationObject | undefined
}
const GeoTagSvg = ({ address, location }: GeoTagSvgProps) => {
    return (
        <Svg width="100%" height="350" viewBox="0 0  350">
            <Rect x="0" y="0" width="" height="350" rx="16" ry="16" fill="rgba(0,0,0,0.72)" />

            <Text fontFamily='Arial, sans-serif' fill='white' fontSize={50} fontWeight={400} x="40" y="70"> {`${address?.city}, ${address?.country}`}</Text>
            <Text x="40" y="125" fontFamily='Arial, sans-serif' fill='white' fontSize={50} fontWeight={400}>{address?.country}</Text>
            <Text x="40" y="185" fontFamily='Arial, sans-serif' fill='#eeeeee' fontSize={30}>{address?.formattedAddress}</Text>
            <Text x="40" y="275" fontFamily='Arial, sans-serif' fill='#eeeeee' fontSize={28}>{`Latitude: ${location?.coords.latitude} Longitude: ${location?.coords.longitude}`}</Text>
            <Text x="40" y="315" fontFamily='Arial, sans-serif' fill='#eeeeee' fontSize={28}>{new Date(location?.timestamp ?? 0).toLocaleString('en-gb', { dateStyle: 'full' })}</Text>
        </Svg>
    )
}

export default GeoTagSvg
