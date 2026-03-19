import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useStore } from '../store';

const BACKEND_URL = 'http://10.227.176.245:5001';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pic, setPic] = useState('https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser }: any = useStore();
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password || (isRegister && !name)) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const config = { headers: { 'Content-type': 'application/json' } };
      let response;
      if (isRegister) {
        response = await axios.post(`${BACKEND_URL}/api/user`, { name, email, password, pic }, config);
      } else {
        response = await axios.post(`${BACKEND_URL}/api/user/login`, { email, password }, config);
      }
      setUser(response.data);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png' }} 
        style={styles.logo} 
      />
      <Text style={styles.title}>{isRegister ? 'Create Account' : 'WhatsApp Clone'}</Text>
      
      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#8e8e93"
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#8e8e93"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#8e8e93"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Profile Pic URL (Optional)"
          placeholderTextColor="#8e8e93"
          value={pic}
          onChangeText={setPic}
        />
      )}
      
      <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isRegister ? 'Sign Up' : 'Log In'}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister(!isRegister)} style={styles.toggleContainer}>
        <Text style={styles.toggleText}>
          {isRegister ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  button: {
    width: '100%',
    backgroundColor: '#25d366',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleContainer: {
    marginTop: 20,
  },
  toggleText: {
    color: '#25d366',
    fontSize: 15,
    fontWeight: '600',
  },
});
