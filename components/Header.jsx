import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export const Header = ({ user, onSignOut }) => {
  const router = useRouter();

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        backgroundColor: COLORS.background,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Logo and Welcome */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              marginRight: 12,
              backgroundColor: COLORS.card,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
            resizeMode="contain"
          />
          <View>
            <Text
              style={{
                color: COLORS.textLight,
                fontSize: 15,
                fontWeight: '500',
              }}
            >
              Welcome back,
            </Text>
            <Text
              style={{
                color: COLORS.text,
                fontSize: 20,
                fontWeight: 'bold',
                letterSpacing: 0.2,
              }}
            >
              {user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]}
            </Text>
          </View>
        </View>

        {/* Right: Add and Logout */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/createTransaction')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.primary,
              borderRadius: 16,
              paddingVertical: 8,
              paddingHorizontal: 16,
              marginRight: 10,
              shadowColor: COLORS.shadow,
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            activeOpacity={0.85}
          >
            <Ionicons
              name="add"
              size={20}
              color={COLORS.white}
              style={{ marginRight: 6 }}
            />
            <Text
              style={{
                color: COLORS.white,
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              Add
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSignOut}
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 16,
              padding: 8,
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
            <Ionicons name="log-out-outline" size={20} color={COLORS.expense} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

