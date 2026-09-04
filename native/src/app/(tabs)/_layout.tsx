import { Tabs } from "expo-router"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';

const TabLayout = () => {
    return (
        <Tabs backBehavior="order" screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Entypo size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    title: 'Camera',
                    tabBarIcon: ({ color }) => <MaterialIcons size={28} name="camera" color={color} />,
                }}
            />
        </Tabs>
    )
}

export default TabLayout