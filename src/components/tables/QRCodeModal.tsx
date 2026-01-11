import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Table } from '../../types';

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  table: Table | null;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  visible,
  onClose,
  table,
}) => {
  if (!table) return null;

  // Generate QR code data with table information
  const qrData = JSON.stringify({
    tableId: table._id,
    tableNumber: table.tableNumber,
    restaurantId: table.restaurantId,
    type: 'table',
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Table ${table.tableNumber} - Scan this QR code to order\nTable ID: ${table._id}`,
        title: `Table ${table.tableNumber} QR Code`,
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Table QR Code</Text>
              <Text style={styles.tableNumber}>Table {table.tableNumber}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrCodeWrapper}>
              <QRCode
                value={qrData}
                size={250}
                backgroundColor="white"
                color="black"
              />
            </View>
            <Text style={styles.instruction}>
              Scan this code to view menu and place orders
            </Text>
            {table.location && (
              <View style={styles.infoRow}>
                <Icon name="map-marker" size={16} color="#6B7280" />
                <Text style={styles.infoText}>{table.location}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Icon name="seat" size={16} color="#6B7280" />
              <Text style={styles.infoText}>
                Capacity: {table.capacity} {table.capacity === 1 ? 'person' : 'people'}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.shareButton]}
              onPress={handleShare}
            >
              <Icon name="share-variant" size={20} color="#fff" />
              <Text style={styles.buttonText}>Share QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  tableNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  qrContainer: {
    padding: 30,
    alignItems: 'center',
  },
  qrCodeWrapper: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instruction: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  actions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  shareButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
