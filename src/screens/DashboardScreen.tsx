import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import ws from '@/services/websocket';
import { useAuth } from '@/contexts/AuthContext';
import { useStyles } from '@/styles/styles';

interface LogEntry {
  id: string;
  message: string;
  time: string;
}

export default function DashboardScreen() {
  const styles = useStyles();
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const unsubTag = ws.on('TAG_LIDA', (data: any) => {
      addLog(`Tag lida: ${data.uid}`);
    });

    const unsubPermitido = ws.on('ACESSO_PERMITIDO', (data: any) => {
      addLog(`Acesso permitido${data.uid ? ` - ${data.uid}` : ''}`);
    });

    const unsubNegado = ws.on('ACESSO_NEGADO', (data: any) => {
      addLog(`Acesso negado${data.uid ? ` - ${data.uid}` : ''}`);
    });

    const unsubAberto = ws.on('PORTAO_ABERTO', () => {
      addLog('Portão aberto');
    });

    const unsubFechado = ws.on('PORTAO_FECHADO', () => {
      addLog('Portão fechado');
    });

    const unsubConectado = ws.on('USUARIO_CONECTADO', () => {
      setConnected(true);
      addLog('Conectado ao sistema');
    });

    return () => {
      unsubTag();
      unsubPermitido();
      unsubNegado();
      unsubAberto();
      unsubFechado();
      unsubConectado();
    };
  }, []);

  function addLog(message: string): void {
    setLogs((prev) => [
      { id: Date.now().toString(), message, time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  }

  function handleOpenGate(): void {
    ws.openGate();
    addLog('Solicitando abertura remota...');
  }

  function handleLockGate(): void {
    ws.lockGate();
    addLog('Solicitando fechamento remoto...');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Controle de Acesso</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {user && (
        <Text style={styles.userInfo}>Bem-vindo, {user.nome}</Text>
      )}

      <Text style={[styles.statusText, connected ? styles.statusConnected : styles.statusDisconnected]}>
        {connected ? 'Conectado' : 'Desconectado'}
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleOpenGate} style={styles.button}>
          <Text style={styles.buttonText}>ABRIR PORTÃO</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLockGate} style={[styles.button, styles.buttonSecondary]}>
          <Text style={styles.buttonText}>FECHAR PORTÃO</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.logsTitle}>Últimos Eventos</Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text style={styles.logText}>{item.time} - {item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}
