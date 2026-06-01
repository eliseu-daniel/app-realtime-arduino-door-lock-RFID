/*
  HC-06 Bluetooth Receiver - Controle de Acesso
  =============================================
  Recebe comandos do app Android via Bluetooth
  e controla o portão (relé/servo).

  Conexões HC-06:
    VCC  -> 5V  (ou 3.3V)
    GND  -> GND
    TX   -> RX pino 10 (via divisor de tensão 5V->3.3V se necessário)
    RX   -> TX pino 11 (via divisor de tensão 5V->3.3V se necessário)

  Comandos:
    OPEN   -> Abre o portão
    CLOSE  -> Fecha o portão
    STATUS -> Retorna o estado atual
*/

#include <SoftwareSerial.h>

// Pinos do HC-06
#define BT_TX 11
#define BT_RX 10

// Pino do relé/servo que controla o portão
#define GATE_PIN 9

// Pino do LED indicador de status
#define LED_PIN 13

// Estados do portão
#define GATE_OPEN   1
#define GATE_CLOSED 0

SoftwareSerial bluetooth(BT_TX, BT_RX);

int gateState = GATE_CLOSED;
unsigned long lastCommandTime = 0;
unsigned long gateChangeTime = 0;
bool gateTransitioning = false;

void setup() {
  pinMode(GATE_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  digitalWrite(GATE_PIN, LOW);
  digitalWrite(LED_PIN, LOW);

  Serial.begin(9600);
  bluetooth.begin(9600);

  Serial.println(F("Sistema de controle de acesso iniciado"));
  Serial.println(F("Aguardando comandos via Bluetooth HC-06..."));

  bluetooth.println(F("HC-06 PRONTO"));
}

void loop() {
  // Verifica se chegou comando do Bluetooth
  if (bluetooth.available()) {
    String command = bluetooth.readStringUntil('\n');
    command.trim();
    processCommand(command);
  }

  // Também aceita comandos via Serial monitor (para debug)
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    processCommand(command);
  }

  // Simula temporização de abertura/fechamento (3 segundos)
  if (gateTransitioning && millis() - gateChangeTime >= 3000) {
    gateTransitioning = false;
    if (gateState == GATE_OPEN) {
      bluetooth.println(F("PORTAO_ABERTO"));
      Serial.println(F("Portao ABERTO"));
      digitalWrite(LED_PIN, HIGH);
    } else {
      bluetooth.println(F("PORTAO_FECHADO"));
      Serial.println(F("Portao FECHADO"));
      digitalWrite(LED_PIN, LOW);
    }
  }
}

void processCommand(String cmd) {
  lastCommandTime = millis();
  cmd.toUpperCase();

  Serial.print(F("Comando recebido: "));
  Serial.println(cmd);

  digitalWrite(LED_PIN, HIGH);
  delay(100);
  digitalWrite(LED_PIN, LOW);

  if (cmd == "OPEN") {
    if (gateState == GATE_CLOSED && !gateTransitioning) {
      gateState = GATE_OPEN;
      digitalWrite(GATE_PIN, HIGH);
      gateTransitioning = true;
      gateChangeTime = millis();
      bluetooth.println(F("OK_ABRINDO"));
      Serial.println(F("Abrindo portao..."));
    } else if (gateTransitioning) {
      bluetooth.println(F("ERRO_AGUARDE"));
      Serial.println(F("Erro: portao em transicao"));
    } else {
      bluetooth.println(F("ERRO_JA_ABERTO"));
      Serial.println(F("Erro: portao ja esta aberto"));
    }
  } else if (cmd == "CLOSE") {
    if (gateState == GATE_OPEN && !gateTransitioning) {
      gateState = GATE_CLOSED;
      digitalWrite(GATE_PIN, LOW);
      gateTransitioning = true;
      gateChangeTime = millis();
      bluetooth.println(F("OK_FECHANDO"));
      Serial.println(F("Fechando portao..."));
    } else if (gateTransitioning) {
      bluetooth.println(F("ERRO_AGUARDE"));
      Serial.println(F("Erro: portao em transicao"));
    } else {
      bluetooth.println(F("ERRO_JA_FECHADO"));
      Serial.println(F("Erro: portao ja esta fechado"));
    }
  } else if (cmd == "STATUS") {
    if (gateTransitioning) {
      bluetooth.println(F("STATUS_TRANSICAO"));
      Serial.println(F("Status: portao em transicao"));
    } else if (gateState == GATE_OPEN) {
      bluetooth.println(F("STATUS_ABERTO"));
      Serial.println(F("Status: portao ABERTO"));
    } else {
      bluetooth.println(F("STATUS_FECHADO"));
      Serial.println(F("Status: portao FECHADO"));
    }
  } else if (cmd == "PING") {
    bluetooth.println(F("PONG"));
    Serial.println(F("PONG"));
  } else {
    bluetooth.println(F("ERRO_COMANDO_DESCONHECIDO"));
    Serial.print(F("Erro: comando desconhecido - "));
    Serial.println(cmd);
  }
}
