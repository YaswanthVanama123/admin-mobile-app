import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Table, TableFormData } from '../../types';

interface TableFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: TableFormData) => Promise<void>;
  table?: Table | null;
}

export const TableForm: React.FC<TableFormProps> = ({
  visible,
  onClose,
  onSubmit,
  table,
}) => {
  const [formData, setFormData] = useState<TableFormData>({
    tableNumber: '',
    capacity: 2,
    location: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TableFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      if (table) {
        setFormData({
          tableNumber: table.tableNumber,
          capacity: table.capacity,
          location: table.location || '',
          isActive: table.isActive,
        });
      } else {
        setFormData({
          tableNumber: '',
          capacity: 2,
          location: '',
          isActive: true,
        });
      }
      setErrors({});
    }
  }, [table, visible]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TableFormData, string>> = {};

    if (!formData.tableNumber.trim()) {
      newErrors.tableNumber = 'Table number is required';
    } else if (formData.tableNumber.trim().length > 20) {
      newErrors.tableNumber = 'Table number must not exceed 20 characters';
    }

    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    } else if (formData.capacity > 20) {
      newErrors.capacity = 'Capacity must not exceed 20';
    }

    if (formData.location && formData.location.length > 100) {
      newErrors.location = 'Location must not exceed 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {table ? 'Edit Table' : 'Add New Table'}
            </Text>
            <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Table Number <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.tableNumber && styles.inputError]}
                value={formData.tableNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, tableNumber: text })
                }
                placeholder="e.g., 1, A1, VIP-1"
                editable={!isSubmitting}
              />
              {errors.tableNumber && (
                <Text style={styles.errorText}>{errors.tableNumber}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Capacity <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.pickerContainer, errors.capacity && styles.inputError]}>
                <Picker
                  selectedValue={formData.capacity}
                  onValueChange={(value) =>
                    setFormData({ ...formData, capacity: value })
                  }
                  enabled={!isSubmitting}
                  style={styles.picker}
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <Picker.Item
                      key={num}
                      label={`${num} ${num === 1 ? 'person' : 'people'}`}
                      value={num}
                    />
                  ))}
                </Picker>
              </View>
              {errors.capacity && (
                <Text style={styles.errorText}>{errors.capacity}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location (Optional)</Text>
              <TextInput
                style={[styles.input, errors.location && styles.inputError]}
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                placeholder="e.g., Main Hall, Patio, Window Side"
                editable={!isSubmitting}
              />
              {errors.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.isActive ? 'active' : 'inactive'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, isActive: value === 'active' })
                  }
                  enabled={!isSubmitting}
                  style={styles.picker}
                >
                  <Picker.Item label="Active" value="active" />
                  <Picker.Item label="Inactive" value="inactive" />
                </Picker>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {table ? 'Update Table' : 'Create Table'}
                </Text>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
