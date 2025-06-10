import { View, Text } from 'react-native'
import { useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import {Stack} from 'expo-router/stack'

const Layout = () => {
    const {isSignedIn,isLoaded} = useUser();
    if (!isLoaded) return null;
    if (!isSignedIn) return <Redirect href={'/signIn'} />

    return <Stack screenOptions={{headerShown: false}}/>
}
export default Layout;