import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Image, Keyboard, Alert } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { styles } from '../../assets/styles/auth.styles.js'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [keyboardVisible, setKeyboardVisible] = React.useState(false)
  const [error, setError] = React.useState('')
  const [verificationError, setVerificationError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

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

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
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

    if (!password.trim()) {
      setError('Please enter a password')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress, // Try this first, if it fails we'll know to use 'email'
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
      setError('')
    } catch (err) {
      console.error('Signup error:', JSON.stringify(err, null, 2))
      
      // Handle specific Clerk errors
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0]
        
        switch (firstError.code) {
          case 'form_param_unknown':
            // This is the error you're getting - try with 'email' instead
            try {
              await signUp.create({
                email: emailAddress, // Try with 'email' instead of 'emailAddress'
                password,
              })
              await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
              setPendingVerification(true)
              setError('')
            } catch (retryErr) {
              console.error('Retry error:', JSON.stringify(retryErr, null, 2))
              setError('Failed to create account. Please try again.')
            }
            break
          case 'form_param_format_invalid':
            setError('Please enter a valid email address')
            break
          case 'form_password_pwned':
            setError('This password has been found in a data breach. Please choose a different password.')
            break
          case 'form_password_too_common':
            setError('This password is too common. Please choose a stronger password.')
            break
          case 'form_identifier_exists':
            setError('An account with this email already exists')
            break
          default:
            setError(firstError.longMessage || firstError.message || 'An error occurred during sign up')
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    // Clear previous errors
    setVerificationError('')
    setIsLoading(true)

    if (!code.trim()) {
      setVerificationError('Please enter the verification code')
      setIsLoading(false)
      return
    }

    if (code.length !== 6) {
      setVerificationError('Please enter the complete 6-digit code')
      setIsLoading(false)
      return
    }

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error('Verification incomplete:', JSON.stringify(signUpAttempt, null, 2))
        setVerificationError('Verification incomplete. Please try again.')
      }
    } catch (err) {
      console.error('Verification error:', JSON.stringify(err, null, 2))
      
      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0]
        
        switch (firstError.code) {
          case 'form_code_incorrect':
            setVerificationError('The verification code is incorrect. Please try again.')
            break
          case 'verification_expired':
            setVerificationError('The verification code has expired. Please request a new one.')
            break
          default:
            setVerificationError(firstError.longMessage || firstError.message || 'Verification failed')
        }
      } else {
        setVerificationError('An unexpected error occurred during verification')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resending verification code
  const onResendPress = async () => {
    if (!isLoaded || !signUp) return

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      Alert.alert('Code Sent', 'A new verification code has been sent to your email')
      setVerificationError('')
    } catch (err) {
      console.error('Resend error:', JSON.stringify(err, null, 2))
      setVerificationError('Failed to resend code. Please try again.')
    }
  }

  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.verificationContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, width: '100%' }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <Text style={styles.verificationTitle}>Check Your Email</Text>
            <Text style={[styles.footerText, { textAlign: 'center', marginBottom: 30 }]}>
              We've sent a verification code to {emailAddress}
            </Text>

            {verificationError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{verificationError}</Text>
              </View>
            ) : null}

            <TextInput
              style={[
                styles.verificationInput,
                verificationError ? styles.errorInput : null
              ]}
              value={code}
              placeholder="Enter 6-digit code"
              onChangeText={(code) => {
                setCode(code)
                if (verificationError) {
                  setVerificationError('')
                }
              }}
              keyboardType="number-pad"
              maxLength={6}
              editable={!isLoading}
            />

            <TouchableOpacity 
              style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]} 
              onPress={onVerifyPress}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Didn't receive the code?
              </Text>
              <TouchableOpacity onPress={onResendPress} disabled={isLoading}>
                <Text style={[styles.linkText, { opacity: isLoading ? 0.5 : 1 }]}>
                  Resend
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
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
              Create Account
            </Text>
            <Text style={[styles.footerText, { 
              fontSize: 16,
              textAlign: 'center',
              opacity: 0.7,
              paddingHorizontal: 20,
            }]}>
              Join us today and start your journey
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
                error && error.toLowerCase().includes('email') ? styles.errorInput : null
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
            />

            <TextInput
              style={[
                styles.input,
                error && error.toLowerCase().includes('password') ? styles.errorInput : null
              ]}
              value={password}
              placeholder="Create a strong password"
              secureTextEntry={true}
              onChangeText={(password) => {
                setPassword(password)
                if (error) {
                  setError('')
                }
              }}
              autoComplete="password-new"
              editable={!isLoading}
            />

            <TouchableOpacity 
              style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]} 
              onPress={onSignUpPress}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Already have an account?
              </Text>
              <TouchableOpacity 
                onPress={() => router.push('/signIn')}
                disabled={isLoading}
              >
                <Text style={[styles.linkText, { opacity: isLoading ? 0.5 : 1 }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}