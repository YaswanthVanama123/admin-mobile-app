import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTables } from '../hooks/useTables';
import { TableCard, TableForm, QRCodeModal } from '../components/tables';
import { Table, TableFormData } from '../types';

export const TablesScreen: React.FC = () => {
  const {
    tables,
    loading,
    refreshing,
    fetchTables,
    createTable,
    updateTable,
    deleteTable,
    updateTableStatus,
  } = useTables();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrTable, setQrTable] = useState<Table | null>(null);

  const handleAddTable = () => {
    setSelectedTable(null);
    setIsFormVisible(true);
  };

  const handleEditTable = (table: Table) => {
    setSelectedTable(table);
    setIsFormVisible(true);
  };

  const handleDeleteTable = async (table: Table) => {
    try {
      await deleteTable(table._id);
      Alert.alert('Success', 'Table deleted successfully');
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleViewQR = (table: Table) => {
    setQrTable(table);
    setQrModalVisible(true);
  };

  const handleToggleStatus = async (table: Table) => {
    try {
      await updateTableStatus(table._id, !table.isOccupied);
      Alert.alert(
        'Success',
        `Table ${table.tableNumber} marked as ${table.isOccupied ? 'available' : 'occupied'}`
      );
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleFormSubmit = async (data: TableFormData) => {
    try {
      if (selectedTable) {
        await updateTable(selectedTable._id, data);
        Alert.alert('Success', 'Table updated successfully');
      } else {
        await createTable(data);
        Alert.alert('Success', 'Table created successfully');
      }
      setIsFormVisible(false);
      setSelectedTable(null);
    } catch (error) {
      // Error is already handled in the hook
      throw error;
    }
  };

  const renderTableCard = ({ item }: { item: Table }) => (
    <TableCard
      table={item}
      onEdit={handleEditTable}
      onDelete={handleDeleteTable}
      onViewQR={handleViewQR}
      onToggleStatus={handleToggleStatus}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="table-furniture" size={64} color="#D1D5DB" />
      <Text style={styles.emptyStateTitle}>No Tables Found</Text>
      <Text style={styles.emptyStateText}>
        Create your first table to get started
      </Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddTable}>
        <Icon name="plus" size={20} color="#fff" />
        <Text style={styles.emptyStateButtonText}>Add Table</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tables</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading tables...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tables</Text>
          <Text style={styles.subtitle}>Manage your restaurant tables</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTable}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tables}
        renderItem={renderTableCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[
          styles.listContent,
          tables.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchTables(true)}
            colors={['#3B82F6']}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <TableForm
        visible={isFormVisible}
        onClose={() => {
          setIsFormVisible(false);
          setSelectedTable(null);
        }}
        onSubmit={handleFormSubmit}
        table={selectedTable}
      />

      <QRCodeModal
        visible={qrModalVisible}
        onClose={() => {
          setQrModalVisible(false);
          setQrTable(null);
        }}
        table={qrTable}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  listContent: {
    padding: 16,
  },
  listContentEmpty: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
