import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,
  TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { mockMessages } from '../shared/mockMessages';
import { sellers } from '../shared/mockSellers';

const CURRENT_USER = 'ikeafan'; // update this to get the current user

type Thread = {
  id: string;
  name: string;
  message: string;
  date: string;
  pinned: boolean;
  image?: string;
};

export default function MessagesScreen() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messageSearch, setMessageSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const generateThreads = () => {
      const groupedThreads: { [key: string]: Thread } = {};

      mockMessages.forEach((msg) => {
        const key = [msg.sender, msg.recipient].sort().join('-');
        const existingThread = groupedThreads[key];

        const otherUser = msg.sender === CURRENT_USER ? msg.recipient : msg.sender;
        const otherUserDetails = sellers.find(user => user.username === otherUser);
        const userName = otherUserDetails ? otherUserDetails.name || otherUser : otherUser;
        const image = otherUserDetails?.image;

        if (!existingThread || new Date(msg.sent_datetime) > new Date(existingThread.date)) {
          groupedThreads[key] = {
            id: key,
            name: userName,
            message: msg.message_body,
            date: msg.sent_datetime,
            pinned: false,
            image,
          };
        }
      });

      setThreads(Object.values(groupedThreads));
      setLoading(false);
    };

    generateThreads();
  }, []);

  const filteredThreads = threads
    .filter((t) => t.name.toLowerCase().includes(messageSearch.toLowerCase()))
    .sort((a, b) => (
      a.pinned === b.pinned
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : a.pinned ? -1 : 1
    ));

  const renderItem = ({ item }: { item: Thread }) => (
    <TouchableOpacity
      onPress={() => {
        const otherUser = item.id.split('-').find(u => u !== CURRENT_USER) || 'unknown';
        router.push(`/messages/${otherUser}?name=${item.name}`);
      }}
    >
      <View style={[styles.item, item.pinned && styles.pinned]}>
        <View style={styles.messageAvatar}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {item.name.split(' ').map((w) => w[0]).join('').toUpperCase()}
            </Text>
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity onPress={() => { /* menu actions */ }}>
          <MaterialIcons name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TextInput
            placeholder="Search messages..."
            placeholderTextColor="#aaa"
            style={styles.messageSearch}
            value={messageSearch}
            onChangeText={setMessageSearch}
          />
          <FlatList
            data={filteredThreads}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    paddingTop: 10
  },
  messageSearch: {
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#3a3f47',
    color: '#fff',
    borderRadius: 8,
    fontSize: 16
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 0
  },
  pinned: {
    backgroundColor: '#ad5ff5'
  },
  messageAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#5c5f66',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden'
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    resizeMode: 'cover'
  },
  avatarText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#fff'
  },
  content: {
    flex: 1
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    color: '#fff'
  },
  message: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 2
  },
  date: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 2
  }
});
