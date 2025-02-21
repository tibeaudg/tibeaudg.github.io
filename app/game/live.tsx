import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LiveGameScreen() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <View style={styles.container}>
      {!gameStarted ? (
        <View style={styles.waitingRoom}>
          <Text style={styles.title}>Live Game Mode</Text>
          <Text style={styles.subtitle}>Players in lobby: 1/4</Text>
          
          <View style={styles.playerGrid}>
            <LinearGradient
              colors={['#1B1464', '#0652DD']}
              style={styles.playerCard}
            >
              <Text style={styles.playerName}>You</Text>
              <Text style={styles.playerStatus}>Ready</Text>
            </LinearGradient>
            
            {[1, 2, 3].map((i) => (
              <View key={i} style={[styles.playerCard, styles.emptySlot]}>
                <Text style={styles.waitingText}>Waiting...</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setGameStarted(true)}
          >
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameContainer}>
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>15</Text>
          </View>

          <Text style={styles.question}>
            Which Disney princess has a chameleon as a sidekick?
          </Text>

          <View style={styles.answersContainer}>
            {['Rapunzel', 'Mulan', 'Tiana', 'Merida'].map((answer, index) => (
              <TouchableOpacity
                key={index}
                style={styles.answerButton}
                onPress={() => {}}
              >
                <Text style={styles.answerText}>{answer}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  waitingRoom: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B1464',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  playerCard: {
    width: '48%',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  emptySlot: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
  },
  playerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  playerStatus: {
    color: '#fff',
    opacity: 0.8,
  },
  waitingText: {
    color: '#666',
  },
  button: {
    backgroundColor: '#1B1464',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameContainer: {
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1B1464',
  },
  question: {
    fontSize: 22,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 30,
  },
  answersContainer: {
    gap: 15,
  },
  answerButton: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
  },
  answerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});