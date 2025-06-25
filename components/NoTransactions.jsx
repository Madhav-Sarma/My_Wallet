import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

const NoTransactions = ({ onAddTransaction }) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      backgroundColor: COLORS.background,
    }}
  >
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <Ionicons
        name="wallet-outline"
        size={48}
        color={COLORS.textLight}
        style={{ marginBottom: 12 }}
      />
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: COLORS.text,
          marginBottom: 8,
        }}
      >
        No Transactions Yet
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: COLORS.textLight,
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        Start tracking your finances by adding your first transaction.
      </Text>
      <TouchableOpacity
        onPress={onAddTransaction}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: COLORS.primary,
          borderRadius: 16,
          paddingVertical: 10,
          paddingHorizontal: 20,
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
          size={18}
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
          Add Transaction
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default NoTransactions;
