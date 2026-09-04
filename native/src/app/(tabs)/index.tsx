import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>
                This is the home page screen
            </Text>
        </SafeAreaView >
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
