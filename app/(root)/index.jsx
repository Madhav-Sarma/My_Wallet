import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-expo';
import { Link, useRouter  } from 'expo-router';
import { FlatList, Alert, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useTransactions } from '../../hooks/useTransactions';
import { useEffect, useState } from 'react';
import LoadingPage from '../../components/LoadingPage';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/home.styles';
import { COLORS } from '../../constants/colors';
import { Header } from '../../components/Header';
import NoTransactions from '../../components/NoTransactions';

// ✅ Reusable formatter
const formatAmount = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const BalanceCard = ({ report }) => (
  <View style={styles.balanceCard}>
    <Text style={styles.balanceTitle}>Total Balance</Text>
    <Text style={styles.balanceAmount}>{formatAmount(report.balance)}</Text>

    <View style={styles.balanceRow}>
      {/* Left Column */}
      <View style={styles.balanceColumn}>
        <View style={styles.statBox}>
          <Text style={styles.balanceStatLabel}>Income</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
            {formatAmount(report.income)}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.balanceStatLabel}>Lending</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.text }]}>
            {formatAmount(report.lending)}
          </Text>
        </View>
      </View>

      {/* Right Column */}
      <View style={styles.balanceColumn}>
        <View style={styles.statBox}>
          <Text style={styles.balanceStatLabel}>Expense</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
            {formatAmount(report.expense)}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.balanceStatLabel}>Borrowing</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.text }]}>
            {formatAmount(report.borrowing)}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const TransactionItem = ({ transaction, onDelete }) => {
  const {
    transaction_title,
    transaction_category,
    transaction_amount,
    created_at,
    transaction_type
  } = transaction;

  const isIncome = transaction_type === 'Income';
  const amountColor = isIncome ? COLORS.income : COLORS.expense;

  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionContent}>
        <View style={styles.categoryIconContainer}>
          <Ionicons
            name={isIncome ? 'arrow-down-circle' : 'arrow-up-circle'}
            size={20}
            color={amountColor}
          />
        </View>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{transaction_title}</Text>
          <Text style={styles.transactionCategory}>{transaction_category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[styles.transactionAmount, { color: amountColor }]}>
            {formatAmount(transaction_amount)}
          </Text>
          <Text style={styles.transactionDate}>{formattedDate}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(transaction.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={18} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );
};

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const {
    transactions,
    report,
    loading,
    error,
    loadData,
    deleteTransaction,
  } = useTransactions(user?.id);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) loadData();
  }, [loadData, user?.id]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };
  const router = useRouter();
  const handleAddTransaction = () => router.push('/createTransaction');

  const handleDeleteTransaction = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(id);
            } catch (err) {
              console.error(err);
            }
          },
        },
      ]
    );
  };

  const handleReload = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Show full page loader only on initial loading (not during pull refresh)
  if (loading && !refreshing) return <LoadingPage />;

  const sortedTransactions =
  [...(transactions || [])]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .reverse();


  return (
    <View style={styles.container}>
      <SignedIn>
        <FlatList
          data={sortedTransactions}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleReload} />
          }
          renderItem={({ item }) => (
            <TransactionItem transaction={item} onDelete={handleDeleteTransaction} />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          ListEmptyComponent={
            <NoTransactions onAddTransaction={handleAddTransaction} />
          }
          ListHeaderComponent={
            <>
              <Header user={user} onSignOut={handleSignOut} />
              <BalanceCard report={report || {}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 8,
                }}
              >
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <TouchableOpacity onPress={handleReload}>
                  <Ionicons name="refresh" size={22} color={COLORS.text} />
                </TouchableOpacity>
              </View>
              {error && (
                <Text style={[styles.emptyStateText, { color: COLORS.expense }]}>
                  Error: {error}
                </Text>
              )}
            </>
          }
        />
      </SignedIn>

      <SignedOut>
        <View style={styles.loadingContainer}>
          <Text style={[styles.headerTitle, { textAlign: 'center', marginBottom: 24 }]}>
            Welcome Back
          </Text>
          <Link href="/(auth)/signIn" asChild>
            <TouchableOpacity style={styles.authButton}>
              <Text style={styles.authButtonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(auth)/signUp" asChild>
            <TouchableOpacity style={styles.authOutlineButton}>
              <Text style={styles.authOutlineText}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SignedOut>
    </View>
  );
}
