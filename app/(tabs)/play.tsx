import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlayScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Game Mode</Text>
      
      <Link href="/game/quiz-master" asChild>
        <TouchableOpacity style={styles.modeContainer}>
          <LinearGradient
            colors={['#1B1464', '#0652DD']}
            style={styles.gradientCard}
          >
            <Text style={styles.modeTitle}>Quiz Master Mode</Text>
            <Text style={styles.modeDescription}>
              One player reads questions while others answer. Perfect for group play!
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Link>

      <Link href="/game/live" asChild>
        <TouchableOpacity style={styles.modeContainer}>
          <LinearGradient
            colors={['#6F1E51', '#833471']}
            style={styles.gradientCard}
          >
            <Text style={styles.modeTitle}>Live Mode</Text>
            <Text style={styles.modeDescription}>
              Compete in real-time! Answer questions quickly to score more points.
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B1464',
    marginBottom: 20,
    textAlign: 'center',
  },
  modeContainer: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientCard: {
    padding: 20,
  },
  modeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modeDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
});