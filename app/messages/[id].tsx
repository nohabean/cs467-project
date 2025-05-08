import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// null error to be fixed when actual data from DB is being loaded
export default function MessageThreadScreen() {
  const { id, name } = useLocalSearchParams();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello, is this still available?', myMessage: false, timestamp: '4/24/2025 10:00 AM' },
    { id: 2, text: 'Yes it is available', myMessage: true, timestamp: '4/24/2025 10:05 AM' },
    { id: 3, text: 'Great! When and where do you want to meet? Do you take cash?', myMessage: false, timestamp: '4/24/2025 10:10 AM' },
    { id: 4, text: 'I am available anytime after 5. We can meet at the police station. Cash is fine.', myMessage: true, timestamp: '4/24/2025 10:15 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef(null); 

  useEffect(() => {
    if (name) {
      navigation.setOptions({
        title: name,
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerTintColor: '#fff',
      });
    }
  }, [name, navigation]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObject = {
        id: messages.length + 1,
        text: newMessage,
        myMessage: true,
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessageObject]);
      setNewMessage('');
    }
  };

  const handleFocus = () => {
    inputRef.current.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {messages.map((message) => (
          <View key={message.id} style={styles.messageContainer}>
            <Text
              style={[
                styles.senderName,
                message.myMessage ? styles.mySenderName : styles.otherSenderName,
              ]}
            >
              {message.myMessage ? 'You' : name || 'Buyer'}
            </Text>
            <View style={[styles.message, message.myMessage ? styles.myMessage : styles.otherMessage]}>
              <Text style={styles.text}>{message.text}</Text>
              {message.timestamp && <Text style={styles.timestamp}>{message.timestamp}</Text>}
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          onFocus={handleFocus}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <MaterialIcons name="send" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
}


// syles to be moved later
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e'
  },
  messagesContainer: {
    flex: 1,
    padding: 16
  },
  messageContainer: {
    marginBottom: 16
  },
  message: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 0,
    maxWidth: '80%'
  },
  myMessage: {
    backgroundColor: '#ad5ff5',
    alignSelf: 'flex-end'
  },
  otherMessage: {
    backgroundColor: '#505050',
    alignSelf: 'flex-start'
  },
  text: {
    color: '#fff',
    fontSize: 16
  },
  timestamp: {
    color: '#bbb',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right'
  },
  senderName: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
    textAlign: 'left'
  },
  mySenderName: {
    textAlign: 'right'
  },
  otherSenderName: {
    textAlign: 'left'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#25292e'
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#505050',
    color: '#fff',
    borderRadius: 20
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#ad5ff5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    color: '#000'
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16
  },
});
