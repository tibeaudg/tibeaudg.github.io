import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="quiz-master"
        options={{
          title: 'Quiz Master Mode',
          headerStyle: {
            backgroundColor: '#1B1464',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="live"
        options={{
          title: 'Live Mode',
          headerStyle: {
            backgroundColor: '#6F1E51',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  );
}