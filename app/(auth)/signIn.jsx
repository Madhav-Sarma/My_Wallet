import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Image, Keyboard, Alert } from 'react-native'
import React from 'react'
import { styles } from '../../assets/styles/auth.styles.js'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [keyboardVisible, setKeyboardVisible] = React.useState(false)
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true)
    })
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
    })

    return () => {
      keyboardDidHideListener?.remove()
      keyboardDidShowListener?.remove()
    }
  }, [])

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Clear previous errors
    setError('')
    setIsLoading(true)

    // Basic validation
    if (!emailAddress.trim()) {
      setError('Please enter your email address')
      setIsLoading(false)
      return
    }

    if (!isValidEmail(emailAddress.trim())) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    if (!password.trim()) {
      setError('Please enter your password')
      setIsLoading(false)
      return
    }

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim().toLowerCase(),
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error('Sign in incomplete:', JSON.stringify(signInAttempt, null, 2))
        
        // Handle different statuses
        switch (signInAttempt.status) {
          case 'needs_verification':
            setError('Please verify your account before signing in')
            break
          case 'needs_factor_one':
            setError('Additional verification required')
            break
          case 'needs_factor_two':
            setError('Two-factor authentication required')
            break
          default:
            setError('Sign in incomplete. Please try again.')
        }
      }
    } catch (err) {
      console.error('Sign in error:', JSON.stringify(err, null, 2))
      
      // Handle specific Clerk errors
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0]
        
        switch (firstError.code) {
          case 'form_identifier_not_found':
            setError('No account found with this email address')
            break
          case 'form_password_incorrect':
            setError('Incorrect password. Please try again.')
            break
          case 'form_identifier_exists':
            setError('Account exists but may need verification')
            break
          case 'session_exists':
            setError('You are already signed in')
            router.replace('/')
            break
          case 'too_many_requests':
            setError('Too many attempts. Please wait a moment and try again.')
            break
          case 'form_param_format_invalid':
            if (firstError.meta?.paramName === 'identifier') {
              setError('Please enter a valid email address')
            } else {
              setError('Invalid input format')
            }
            break
          default:
            setError(firstError.longMessage || firstError.message || 'Sign in failed. Please try again.')
        }
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle forgot password
  const onForgotPasswordPress = async () => {
    if (!emailAddress.trim()) {
      Alert.alert(
        'Email Required', 
        'Please enter your email address first, then tap "Forgot Password?"',
        [{ text: 'OK' }]
      )
      return
    }

    if (!isValidEmail(emailAddress.trim())) {
      Alert.alert(
        'Invalid Email', 
        'Please enter a valid email address first',
        [{ text: 'OK' }]
      )
      return
    }

    try {
      await signIn.create({
        identifier: emailAddress.trim().toLowerCase(),
      })
      
      await signIn.prepareEmailAddressVerification({
        strategy: 'reset_password_email_code'
      })
      
      Alert.alert(
        'Reset Email Sent', 
        'Check your email for password reset instructions',
        [{ text: 'OK' }]
      )
    } catch (err) {
      console.error('Forgot password error:', JSON.stringify(err, null, 2))
      
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0]
        if (firstError.code === 'form_identifier_not_found') {
          Alert.alert(
            'Email Not Found', 
            'No account found with this email address',
            [{ text: 'OK' }]
          )
        } else {
          Alert.alert(
            'Error', 
            'Unable to send reset email. Please try again.',
            [{ text: 'OK' }]
          )
        }
      } else {
        Alert.alert(
          'Error', 
          'Unable to send reset email. Please try again.',
          [{ text: 'OK' }]
        )
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1,
            justifyContent: keyboardVisible ? 'center' : 'flex-start'
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Section */}
          <View style={{ 
            alignItems: 'center', 
            marginBottom: keyboardVisible ? 20 : 30, 
            marginTop: keyboardVisible ? 20 : 40,
            flex: keyboardVisible ? 0 : 0
          }}>
            {/* Image - Hide when keyboard is visible */}
            {!keyboardVisible && (
              <Image
                source={require('../../assets/images/revenue-i1.png')}
                style={styles.illustration}
              />
            )}
            <Text style={[styles.title, { 
              marginTop: keyboardVisible ? 0 : 20, 
              marginBottom: 10 
            }]}>
              Welcome Back
            </Text>
            <Text style={[styles.footerText, { 
              fontSize: 16,
              textAlign: 'center',
              opacity: 0.7,
              paddingHorizontal: 20,
            }]}>
              Sign in to continue your journey
            </Text>
          </View>

          {/* Form Section */}
          <View style={{ 
            paddingHorizontal: 20, 
            flex: 1,
            justifyContent: keyboardVisible ? 'flex-start' : 'flex-start'
          }}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TextInput
              style={[
                styles.input,
                error && (error.toLowerCase().includes('email') || error.toLowerCase().includes('identifier')) 
                  ? styles.errorInput : null
              ]}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email"
              onChangeText={(email) => {
                setEmailAddress(email)
                if (error) {
                  setError('')
                }
              }}
              keyboardType="email-address"
              autoComplete="email"
              editable={!isLoading}
              autoCorrect={false}
              spellCheck={false}
            />

            <View style={{ position: 'relative' }}>
              <TextInput
                style={[
                  styles.input,
                  error && error.toLowerCase().includes('password') 
                    ? styles.errorInput : null
                ]}
                value={password}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                onChangeText={(pwd) => {
                  setPassword(pwd)
                  if (error) {
                    setError('')
                  }
                }}
                autoComplete="password"
                editable={!isLoading}
                autoCorrect={false}
                spellCheck={false}
              />
              
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 15,
                  top: 15,
                  padding: 5,
                }}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Text style={[styles.linkText, { fontSize: 14, opacity: isLoading ? 0.5 : 1 }]}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={{ alignSelf: 'flex-end', marginBottom: 20 }}
              onPress={onForgotPasswordPress}
              disabled={isLoading}
            >
              <Text style={[styles.linkText, { opacity: isLoading ? 0.5 : 1 }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]} 
              onPress={onSignInPress}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Don't have an account?
              </Text>
              <TouchableOpacity 
                onPress={() => router.push('/signUp')}
                disabled={isLoading}
              >
                <Text style={[styles.linkText, { opacity: isLoading ? 0.5 : 1 }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}