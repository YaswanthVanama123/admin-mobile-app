import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Table } from '../../types';

interface TableCardProps {
  table: Table;
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
  onViewQR: (table: Table) => void;
  onToggleStatus: (table: Table) => void;
}

export const TableCard: React.FC<TableCardProps> = ({
  table,
  onEdit,
  onDelete,
  onViewQR,
  onToggleStatus,
}) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Table',
      `Are you sure you want to delete Table ${table.tableNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(table),
        },
      ]
    );
  };

  const handleToggleStatus = () => {
    Alert.alert(
      'Change Table Status',
      `Mark Table ${table.tableNumber} as ${table.isOccupied ? 'available' : 'occupied'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => onToggleStatus(table),
        },
      ]
    );
  };

  const getStatusColor = () => {
    if (!table.isActive) return '#9CA3AF';
    return table.isOccupied ? '#EF4444' : '#10B981';
  };

  const getStatusText = () => {
    if (!table.isActive) return 'Inactive';
    return table.isOccupied ? 'Occupied' : 'Available';
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.tableNumber}>Table {table.tableNumber}</Text>
            {table.location && (
              <Text style={styles.location}>{table.location}</Text>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <View style={[styles.statusDot, { backgroundColor: '#fff' }]} />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="seat" size={18} color="#6B7280" />
          <Text style={styles.infoText}>
            Capacity: {table.capacity} {table.capacity === 1 ? 'person' : 'people'}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => onEdit(table)}
          >
            <Icon name="pencil" size={18} color="#3B82F6" />
            <Text style={styles.primaryButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => onViewQR(table)}
          >
            <Icon name="qrcode" size={18} color="#8B5CF6" />
            <Text style={styles.secondaryButtonText}>QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleToggleStatus}
          >
            <Icon
              name={table.isOccupied ? 'check-circle' : 'close-circle'}
              size={18}
              color="#10B981"
            />
            <Text style={styles.secondaryButtonText}>
              {table.isOccupied ? 'Free' : 'Occupy'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDelete}
          >
            <Icon name="delete" size={18} color="#EF4444" />
            <Text style={styles.dangerButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  tableNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  location: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  primaryButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  secondaryButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
});
