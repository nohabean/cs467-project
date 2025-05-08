import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { mockMessages } from '../shared/mockMessages'; // Import mock messages

const CURRENT_USER = 'ikeafan'; // update this to get the current user

type Message = {
  id: number;
  text: string;
  myMessage: boolean;
  timestamp: string;
};

export default function MessageThreadScreen() {
  const { id: receiver, name } = useLocalSearchParams(); 
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (name) {
      navigation.setOptions({
        title: name,
        headerStyle: { backgroundColor: '#25292e' },
        headerTintColor: '#fff',
      });
    }

    fetchMessages();
  }, [name]);

  const fetchMessages = () => {
    const filteredMessages = mockMessages.filter(
      (msg) =>
        (msg.sender === CURRENT_USER && msg.recipient === receiver) ||
        (msg.sender === receiver && msg.recipient === CURRENT_USER)
    );

    const formattedMessages: Message[] = filteredMessages.map((msg) => ({
      id: msg.id,
      text: msg.message_body,
      myMessage: msg.sender === CURRENT_USER,
      timestamp: new Date(msg.sent_datetime).toLocaleString(),
    }));

    setMessages(formattedMessages);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        sender: CURRENT_USER,
        receiver,
        message_body: newMessage,
        sent_datetime: new Date().toISOString(),
      };

      const newMessageData = {
        id: Date.now(),
        ...messageData,
      };

      setMessages((prev) => [
        ...prev,
        {
          id: newMessageData.id,
          text: newMessageData.message_body,
          myMessage: true,
          timestamp: new Date(newMessageData.sent_datetime).toLocaleString(),
        },
      ]);

      setNewMessage('');
    }
  };

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container} accessibilityRole="summary" accessibilityLabel={`Message thread with ${name ?? 'user'}`}>
      <ScrollView style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <Text style={styles.noMessagesText}>No messages yet.</Text>
        ) : (
          messages.map((message) => (
            <View key={message.id} style={styles.messageContainer}>
              <Text style={[styles.senderName, message.myMessage ? styles.mySenderName : styles.otherSenderName]}>
                {message.myMessage ? 'You' : name || 'Buyer'}
              </Text>
              <View style={[styles.message, message.myMessage ? styles.myMessage : styles.otherMessage]}>
                <Text style={styles.text}>{message.text}</Text>
              </View>
              {message.timestamp && (
                <Text
                  style={[
                    styles.timestamp,
                    message.myMessage ? styles.timestampRight : styles.timestampLeft,  // Conditional alignment
                  ]}
                >
                  {message.timestamp}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

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
          <MaterialIcons name="send" size={16} color="#fff" />
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
  messageContainer: {
    marginBottom: 16,
  },
  message: {
    padding: 12,
    borderRadius: 15,
    marginBottom: 0,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#ad5ff5',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#505050',
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
    
    textAlign: 'left', 
  },
  timestampLeft: {
    textAlign: 'left', 
    marginLeft: 10
  },
  timestampRight: {
    textAlign: 'right', 
    marginRight: 10
  },
  senderName: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
    textAlign: 'left',
  },
  mySenderName: {
    textAlign: 'right',
    marginRight: 10
  },
  otherSenderName: {
    textAlign: 'left',
    marginLeft: 10
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
    borderRadius: 15,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#ad5ff5',
    width: 40,
    height: 40,
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noMessagesText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
