import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useTransactions } from '../../hooks/useTransactions';
import { styles } from '../../assets/styles/create.styles';
import { COLORS } from '../../constants/colors';

const TRANSACTION_TYPES = ['Income', 'Expense', 'Lend', 'Borrow'];

const CATEGORY_OPTIONS = {
  Income: ['Salary', 'Bonus', 'Interest', 'Other'],
  Expense: ['Food', 'Sport', 'Travelling', 'Petrol', 'Movies', 'Other'],
  Lend: ['Friend', 'Family', 'Loan', 'Other'],
  Borrow: ['Bank', 'Friend', 'Emergency', 'Other'],
};

const CreateTransaction = () => {
  const router = useRouter();
  const { user } = useUser();
  const { loadData } = useTransactions(user?.id);

  const [type, setType] = useState('Income');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');

  const handleSave = async () => {
    if (!amount || !category || !title) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    const payload = {
      transaction_title: title,
      transaction_amount: parseFloat(amount),
      transaction_category: category,
      transaction_type: type,
      user_id: user?.id,
    };

    try {
      const response = await fetch('https://my-wallet-6c4m.onrender.com/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save transaction');

      await loadData();
      router.back();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
    <Ionicons name="arrow-back" size={24} color={styles.headerTitle.color} />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>New Transaction</Text>

  <TouchableOpacity onPress={handleSave} style={styles.iconButton}>
    <Ionicons name="checkmark" size={24} color={styles.headerTitle.color} />
  </TouchableOpacity>
</View>


      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Type Selector */}
        <View style={styles.typeSelector}>
          {TRANSACTION_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeButton, type === t && styles.typeButtonActive]}
              onPress={() => {
                setType(t);
                setCategory('');
              }}
            >
              <Text style={[styles.typeButtonText, type === t && styles.typeButtonTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Buttons */}
        <Text style={styles.sectionTitle}>Select Category</Text>
<View style={styles.categoryGrid}>
  {CATEGORY_OPTIONS[type].map((cat) => (
    <TouchableOpacity
      key={cat}
      style={[
        styles.categoryButton,
        category === cat && styles.categoryButtonActive,
      ]}
      onPress={() => setCategory(cat)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          category === cat && styles.categoryButtonTextActive,
        ]}
      >
        {cat}
      </Text>
    </TouchableOpacity>
  ))}
</View>


        {/* Amount Input */}
        <Text style={styles.sectionTitle}>Enter Amount</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.amountInput}
            keyboardType="numeric"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            placeholderTextColor="#999"
          />
        </View>

        {/* Title Input */}
        <Text style={styles.sectionTitle}>Transaction Title</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="text-outline" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g., Grocery Shopping"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateTransaction;
