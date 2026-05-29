import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '../hooks/useFocusEffect';
import api from '../services/api';
import { styles } from '../styles/styles';

interface LogEntry {
  id: number;
  event: string;
  uid?: string;
  device_id?: number;
  user_id?: number;
  created_at: string;
}

export default function LogsScreen() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 50;

  const loadLogs = useCallback(async (reset = false) => {
    const currentOffset = reset ? 0 : offset;
    setLoading(true);

    const response = await api.getLogs(limit, currentOffset);

    if (response.error) {
      Alert.alert('Erro', response.error);
      setLoading(false);
      return;
    }

    const rawData = response.data;
    if (rawData) {
      if (reset) {
        setLogs(rawData);
      } else {
        setLogs((prev) => [...prev, ...rawData]);
      }
      setHasMore(rawData.length === limit);
      setOffset(currentOffset + limit);
    }

    setLoading(false);
  }, [offset]);

  useFocusEffect(() => {
    setOffset(0);
    setHasMore(true);
    loadLogs(true);
  });

  function formatEvent(event: string, uid?: string): string {
    const eventMap: Record<string, string> = {
      TAG_LIDA: `Tag lida${uid ? `: ${uid}` : ''}`,
      ACESSO_PERMITIDO: `Acesso permitido${uid ? `: ${uid}` : ''}`,
      ACESSO_NEGADO: `Acesso negado${uid ? `: ${uid}` : ''}`,
      PORTAO_ABERTO: 'Portão aberto',
      PORTAO_FECHADO: 'Portão fechado',
    };
    return eventMap[event] || event;
  }

  function formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString();
    } catch {
      return dateStr;
    }
  }

  function renderLog({ item }: { item: LogEntry }) {
    return (
      <View style={styles.logItem}>
        <Text style={styles.logText}>
          {formatDate(item.created_at)} - {formatEvent(item.event, item.uid)}
        </Text>
        <Text style={styles.logSubtext}>
          Dispositivo: {item.device_id || '-'} | Usuário: {item.user_id || '-'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logs de Acesso</Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderLog}
        ListEmptyComponent={
          loading ? null : (
            <Text style={styles.emptyText}>Nenhum log encontrado</Text>
          )
        }
        onEndReached={() => {
          if (hasMore && !loading) loadLogs();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ margin: 20 }} color="#2196F3" /> : null
        }
      />
    </View>
  );
}
