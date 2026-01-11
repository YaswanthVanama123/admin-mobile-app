import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { tablesApi } from '../api/tables.api';
import { Table, TableFormData } from '../types';

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTables = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await tablesApi.getAll();
      setTables(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch tables';
      setError(errorMessage);
      console.error('Error fetching tables:', err);

      if (!isRefreshing) {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const createTable = async (data: TableFormData): Promise<Table> => {
    try {
      const newTable = await tablesApi.create(data);
      setTables((prev) => [...prev, newTable]);
      return newTable;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create table';
      Alert.alert('Error', errorMessage);
      throw err;
    }
  };

  const updateTable = async (id: string, data: Partial<TableFormData>): Promise<Table> => {
    try {
      const updatedTable = await tablesApi.update(id, data);
      setTables((prev) =>
        prev.map((table) => (table._id === id ? updatedTable : table))
      );
      return updatedTable;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update table';
      Alert.alert('Error', errorMessage);
      throw err;
    }
  };

  const deleteTable = async (id: string): Promise<void> => {
    try {
      await tablesApi.delete(id);
      setTables((prev) => prev.filter((table) => table._id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete table';
      Alert.alert('Error', errorMessage);
      throw err;
    }
  };

  const updateTableStatus = async (id: string, isOccupied: boolean): Promise<void> => {
    try {
      const updatedTable = await tablesApi.updateStatus(id, isOccupied);
      setTables((prev) =>
        prev.map((table) => (table._id === id ? updatedTable : table))
      );
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update table status';
      Alert.alert('Error', errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return {
    tables,
    loading,
    error,
    refreshing,
    fetchTables,
    createTable,
    updateTable,
    deleteTable,
    updateTableStatus,
  };
};
