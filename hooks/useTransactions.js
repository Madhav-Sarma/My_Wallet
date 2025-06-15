import { useState, useEffect, useCallback } from "react";
import { Alert } from 'react-native';

const API_URL = process.env.EXPO_PRIVATE_API_URL;

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    lending: 0,
    borrowing: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    }
  }, [userId]);

  const fetchReport = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/report/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err.message);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchReport()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchTransactions, fetchReport]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }
      await loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { transactions, report, loading, error, loadData, deleteTransaction };
};
