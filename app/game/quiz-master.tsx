import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuizMasterScreen() {
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);

  return (
    <View style={styles.container}>
      {!isHost ? (
        <View style={styles.joinContainer}>
          <Text style={styles.title}>Join a Quiz Room</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Room Code"
            value={roomCode}
            onChangeText={setRoomCode}
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Join Room</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={() => setIsHost(true)}
          >
            <Text style={styles.buttonText}>Create New Room</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.hostContainer}>
          <Text style={styles.title}>Room Code: ABC123</Text>
          <Text style={styles.subtitle}>Waiting for players...</Text>
          
          <View style={styles.playersList}>
            <View style={styles.playerItem}>
              <Ionicons name="person-circle" size={24} color="#1B1464" />
              <Text style={styles.playerName}>Player 1 (Host)</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  joinContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  hostContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B1464',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1B1464',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#0652DD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playersList: {
    marginBottom: 30,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  playerName: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});