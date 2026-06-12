import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Alert,
  TextInput, ActivityIndicator, Modal,
} from 'react-native';
import { useFocusEffect } from '@/hooks/useFocusEffect';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useStyles } from '@/styles/styles';

interface Device {
  id: number;
  nome: string;
  serial_number: string;
  created_at?: string;
}

export default function DevicesScreen() {
  const styles = useStyles();
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === 'admin';

  const loadDevices = useCallback(async () => {
    setLoading(true);
    const response = await api.getDevices();
    setLoading(false);

    if (response.error) {
      Alert.alert('Erro', response.error);
      return;
    }

    const data = response.data;
    if (data) {
      setDevices(data);
    }
  }, []);

  useFocusEffect(loadDevices);

  async function handleCreate() {
    if (!nome.trim() || !serialNumber.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setSaving(true);
    const response = await api.createDevice(nome.trim(), serialNumber.trim());
    setSaving(false);

    if (response.error) {
      Alert.alert('Erro', response.error);
      return;
    }

    setNome('');
    setSerialNumber('');
    setModalVisible(false);
    loadDevices();
  }

  async function handleDelete(id: number) {
    Alert.alert('Confirmar', 'Excluir este dispositivo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const response = await api.deleteDevice(id);
          if (response.error) {
            Alert.alert('Erro', response.error);
            return;
          }
          loadDevices();
        },
      },
    ]);
  }

  function renderDevice({ item }: { item: Device }) {
    return (
      <View style={styles.listItem}>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>{item.nome}</Text>
          <Text style={styles.listItemSubtitle}>Serial: {item.serial_number}</Text>
        </View>
        {isAdmin && (
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.title}>Dispositivos</Text>
        {isAdmin && (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Novo</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={devices}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderDevice}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum dispositivo cadastrado</Text>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Dispositivo</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do dispositivo"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />

            <TextInput
              style={styles.input}
              placeholder="Número serial"
              placeholderTextColor="#999"
              value={serialNumber}
              onChangeText={setSerialNumber}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.button, styles.buttonCancel]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreate}
                style={[styles.button, saving && styles.buttonDisabled]}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
