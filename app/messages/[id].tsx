import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function MessageThreadScreen() {
  const { id, name } = useLocalSearchParams();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, is this still available?', isMine: false, timestamp: '4/24/2025 10:00 AM' },
    { id: 2, text: 'Yes it is available', isMine: true, timestamp: '4/24/2025 10:05 AM' },
    { id: 3, text: 'Great! When and where do you want to meet? Do you take cash?', isMine: false, timestamp: '4/24/2025 10:10 AM' },
    { id: 4, text: 'I am available anytime after 5. We can meet at the police station. Cash is fine.', isMine: true, timestamp: '4/24/2025 10:15 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef(null); // Create a reference for the TextInput

  useEffect(() => {
    if (name) {
      navigation.setOptions({
        title: name,
        headerStyle: {
          backgroundColor: '#25292e', // Match the content background color
        },
        headerTintColor: '#fff', // Set the header title color
      });
    }
  }, [name, navigation]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObject = {
        id: messages.length + 1, // New message ID
        text: newMessage,
        isMine: true,
        timestamp: new Date().toLocaleString(), // Timestamp for the new message
      };
      setMessages((prevMessages) => [...prevMessages, newMessageObject]); // Add the new message
      setNewMessage(''); // Clear the input field
    }
  };

  const handleFocus = () => {
    // Focus the input when the user taps the TextInput
    inputRef.current.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.message, message.isMine ? styles.myMessage : styles.otherMessage]}
          >
            <Text style={styles.text}>{message.text}</Text>
            {message.timestamp && <Text style={styles.timestamp}>{message.timestamp}</Text>}
          </View>
        ))}
      </View>
      
      {/* Typing Field and Send Button */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef} // Attach the ref to the TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          onFocus={handleFocus} // Optionally focus when tapped
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  message: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#ad5ff5', // Color for the user's messages (right side)
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#505050', // Color for the other person's messages (left side)
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  timestamp: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#25292e',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#505050',
    color: '#fff',
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#ad5ff5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
