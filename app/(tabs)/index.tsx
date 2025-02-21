import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1920&auto=format&fit=crop' }}
        style={styles.banner}
      />
      <Text style={styles.title}>Disney Quiz</Text>
      <Text style={styles.subtitle}>Test your Disney knowledge!</Text>
      
      <Link href="/play" asChild>
        <TouchableOpacity style={styles.playButton}>
          <Text style={styles.playButtonText}>Start Playing</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B1464',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  playButton: {
    backgroundColor: '#1B1464',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});