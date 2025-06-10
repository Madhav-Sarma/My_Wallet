// NoTransactions.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { styles } from '@/assets/styles/home.styles';

const NoTransactions = ({ onAddTransaction }) => (
  <View style={styles.emptyState}>
    <Ionicons name="wallet-outline" size={48} color={COLORS.lightText} />
    <Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
    <Text style={styles.emptyStateText}>
      Start tracking your finances by adding your first transaction.
    </Text>
    <TouchableOpacity onPress={onAddTransaction} style={styles.emptyStateButton}>
      <Ionicons name="add" size={16} color={COLORS.white} />
      <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
    </TouchableOpacity>
  </View>
);

export default NoTransactions;
