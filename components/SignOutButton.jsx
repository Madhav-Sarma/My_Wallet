import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'

export const SignOutButton = () => {
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 18,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
      activeOpacity={0.85}
    >
      <Ionicons
        name="log-out-outline"
        size={20}
        color={COLORS.expense}
        style={{ marginRight: 8 }}
      />
      <Text style={{ color: COLORS.expense, fontWeight: 'bold', fontSize: 16 }}>
        Sign out
      </Text>
    </TouchableOpacity>
  )
}
