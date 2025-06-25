import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { useTransactions } from '../../hooks/useTransactions'
import { COLORS } from '../../constants/colors'

const TRANSACTION_TYPES = [
  { label: 'Income', icon: 'trending-up-outline', color: COLORS.income },
  { label: 'Expense', icon: 'trending-down-outline', color: COLORS.expense },
  { label: 'Lend', icon: 'arrow-up-circle-outline', color: COLORS.lending },
  { label: 'Borrow', icon: 'arrow-down-circle-outline', color: COLORS.borrowing },
]

const CATEGORY_OPTIONS = {
  Income: ['Salary', 'Bonus', 'Interest', 'Other'],
  Expense: ['Food', 'Sport', 'Travelling', 'Petrol', 'Movies', 'Other'],
  Lend: ['Friend', 'Family', 'Loan', 'Other'],
  Borrow: ['Bank', 'Friend', 'Emergency', 'Other'],
}

const CreateTransaction = () => {
  const router = useRouter()
  const { user } = useUser()
  const { loadData } = useTransactions(user?.id)

  const [type, setType] = useState('Income')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [relatedUser, setRelatedUser] = useState('')

  const handleSave = async () => {
    if (!amount || !category || !title || ((type === 'Lend' || type === 'Borrow') && !relatedUser)) {
      Alert.alert('Missing fields', 'Please fill in all fields.')
      return
    }

    const payload = {
      transaction_title: title,
      transaction_amount: parseFloat(amount),
      transaction_category: category,
      transaction_type: type,
      user_id: user?.id,
      related_user: (type === 'Lend' || type === 'Borrow') ? relatedUser : null,
    }

    try {
      const response = await fetch('https://my-wallet-6c4m.onrender.com/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save transaction')

      await loadData()
      router.back()
    } catch (err) {
      Alert.alert('Error', err.message)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 180 }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 10,
            paddingHorizontal: 20,
            paddingBottom: 16,
            backgroundColor: COLORS.card,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
            shadowColor: COLORS.shadow,
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 2,
          }}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
              <Ionicons name="arrow-back" size={28} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.text }}>New Transaction</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              {TRANSACTION_TYPES.slice(0, 2).map((t) => (
                <TouchableOpacity
                  key={t.label}
                  style={{
                    flex: 1,
                    marginHorizontal: 4,
                    backgroundColor: type === t.label ? t.color : COLORS.card,
                    borderRadius: 16,
                    paddingVertical: 14,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    shadowColor: COLORS.shadow,
                    shadowOpacity: type === t.label ? 0.1 : 0,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: type === t.label ? 2 : 0,
                    borderWidth: type === t.label ? 0 : 1,
                    borderColor: COLORS.border,
                  }}
                  onPress={() => {
                    setType(t.label)
                    setCategory('')
                    setRelatedUser('')
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons name={t.icon} size={22} color={type === t.label ? COLORS.white : t.color} style={{ marginRight: 8 }} />
                  <Text style={{ color: type === t.label ? COLORS.white : COLORS.text, fontWeight: 'bold', fontSize: 16 }}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              {TRANSACTION_TYPES.slice(2).map((t) => (
                <TouchableOpacity
                  key={t.label}
                  style={{
                    flex: 1,
                    marginHorizontal: 4,
                    backgroundColor: type === t.label ? t.color : COLORS.card,
                    borderRadius: 16,
                    paddingVertical: 14,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    shadowColor: COLORS.shadow,
                    shadowOpacity: type === t.label ? 0.1 : 0,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: type === t.label ? 2 : 0,
                    borderWidth: type === t.label ? 0 : 1,
                    borderColor: COLORS.border,
                  }}
                  onPress={() => {
                    setType(t.label)
                    setCategory('')
                    setRelatedUser('')
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons name={t.icon} size={22} color={type === t.label ? COLORS.white : t.color} style={{ marginRight: 8 }} />
                  <Text style={{ color: type === t.label ? COLORS.white : COLORS.text, fontWeight: 'bold', fontSize: 16 }}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: COLORS.text }}>Select Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
              {CATEGORY_OPTIONS[type].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={{
                    backgroundColor: category === cat ? COLORS.primary : COLORS.card,
                    borderRadius: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    margin: 4,
                    borderWidth: 1,
                    borderColor: category === cat ? COLORS.primary : COLORS.border,
                    shadowColor: COLORS.shadow,
                    shadowOpacity: category === cat ? 0.08 : 0,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: category === cat ? 1 : 0,
                  }}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.85}
                >
                  <Text style={{
                    color: category === cat ? COLORS.white : COLORS.text,
                    fontWeight: '600',
                    fontSize: 15,
                  }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: COLORS.text }}>Enter Amount</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.card,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginRight: 8 }}>₹</Text>
              <TextInput
                style={{ flex: 1, fontSize: 20, fontWeight: '600', color: COLORS.text }}
                keyboardType="numeric"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                placeholderTextColor={COLORS.textLight}
              />
            </View>

            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: COLORS.text }}>Transaction Title</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.card,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}>
              <Ionicons name="text-outline" size={20} color={COLORS.textLight} style={{ marginRight: 8 }} />
              <TextInput
                style={{ flex: 1, fontSize: 16, color: COLORS.text }}
                placeholder="e.g., Grocery Shopping"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={COLORS.textLight}
              />
            </View>

            {(type === 'Lend' || type === 'Borrow') && (
              <>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: COLORS.text }}>
                  {type === 'Lend' ? 'To whom did you lend?' : 'From whom did you borrow?'}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.card,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  marginBottom: 24,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}>
                  <Ionicons name="person-outline" size={20} color={COLORS.textLight} style={{ marginRight: 8 }} />
                  <TextInput
                    style={{ flex: 1, fontSize: 16, color: COLORS.text }}
                    placeholder={type === 'Lend' ? 'e.g., Sai' : 'e.g., Bank'}
                    value={relatedUser}
                    onChangeText={setRelatedUser}
                    placeholderTextColor={COLORS.textLight}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>

        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        }}>
          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 14,
              borderRadius: 16,
              alignItems: 'center',
              shadowColor: COLORS.shadow,
              shadowOpacity: 0.15,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              elevation: 2,
            }}
            activeOpacity={0.9}
          >
            <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 17 }}>
              Create Transaction
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default CreateTransaction
