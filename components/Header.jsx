import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../assets/styles/home.styles';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export const Header = ({ user, onSignOut }) => {
  const router = useRouter(); // ✅ define router here

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.usernameText}>
              {user?.firstName || user?.emailAddresses[0].emailAddress.split('@')[0]}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => router.push('/createTransaction')}
            style={styles.addButton}
          >
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSignOut} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
