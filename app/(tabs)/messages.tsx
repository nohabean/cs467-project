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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const groupedThreads: { [key: string]: Thread } = {};

    mockMessages.forEach(msg => {
      const key = [msg.sender, msg.recipient].sort().join('-');
      const otherUser = msg.sender === CURRENT_USER ? msg.recipient : msg.sender;
      const otherUserDetails = sellers.find(user => user.username === otherUser);
      const userName = otherUserDetails?.name || otherUser;
      const image = otherUserDetails?.image;

      if (!groupedThreads[key] || new Date(msg.sent_datetime) > new Date(groupedThreads[key].date)) {
        groupedThreads[key] = {
          id: key,
          name: userName,
          message: msg.message_body,
          date: msg.sent_datetime,
          pinned: false,
          image
        };
      }
    });

    setThreads(Object.values(groupedThreads));
  }, []);

  const filteredThreads = threads
    .filter(t =>
      t.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
      t.message.toLowerCase().includes(messageSearch.toLowerCase())
    )
    .sort((a, b) => a.pinned === b.pinned
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : a.pinned ? -1 : 1
    );

  const openModal = (thread: Thread) => {
    setSelectedThread(thread);
    setRenameInput(thread.name);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedThread(null);
    setRenameInput('');
  };

  const handleRename = () => {
    if (selectedThread) {
      setThreads(prev =>
        prev.map(t => (t.id === selectedThread.id ? { ...t, name: renameInput } : t))
      );
      closeModal();
    }
  };

  const handleTogglePin = () => {
    if (selectedThread) {
      setThreads(prev =>
        prev.map(t => (t.id === selectedThread.id ? { ...t, pinned: !t.pinned } : t))
      );
      closeModal();
    }
  };

  const handleDelete = () => {
    if (selectedThread) {
      setThreads(prev => prev.filter(t => t.id !== selectedThread.id));
      closeModal();
    }
  };

  const renderItem = ({ item }: { item: Thread }) => {
    const otherUser = item.id.split('-').find(u => u !== CURRENT_USER) || 'unknown';

    return (
      <TouchableOpacity onPress={() => router.push(`/messages/${otherUser}?name=${item.name}`)}>
        <View style={[styles.item, item.pinned && styles.pinned]}>
          <View style={styles.messageAvatar}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {item.name.split(' ').map(w => w[0]).join('').toUpperCase()}
              </Text>
            )}
          </View>
          <View style={styles.content}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
          <TouchableOpacity onPress={() => openModal(item)}>
            <MaterialIcons name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search messages..."
          placeholderTextColor="#aaa"
          style={styles.messageSearch}
          value={messageSearch}
          onChangeText={setMessageSearch}
          autoCapitalize="none"
        />
      </View>
  
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <FlatList
              data={filteredThreads}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </TouchableWithoutFeedback>
  
        {/* Modal code remains the same */}
        {modalVisible && (
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modal}>
                  <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
                    <MaterialIcons name="close" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Manage Thread</Text>
                  {selectedThread && (
                    <>
                      <Text style={styles.modalThreadName}>{selectedThread.name}</Text>
                      <TextInput
                        style={styles.modalInput}
                        value={renameInput}
                        onChangeText={setRenameInput}
                        placeholder="New name"
                      />
                      <View style={styles.modalActions}>
                        <TouchableOpacity onPress={handleRename}>
                          <Text style={[styles.modalButton, styles.bold]}>Save</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.modalActions}>
                        <TouchableOpacity onPress={handleTogglePin}>
                          <Text style={styles.modalButton}>
                            {selectedThread.pinned ? 'Unpin' : 'Pin'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete}>
                          <Text style={[styles.modalButton, { color: 'red' }]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    paddingTop: 10,
  },
  messageSearch: {
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#3a3f47',
    color: '#fff',
    borderRadius: 8,
    fontSize: 16,
  },
  searchContainer: {
    backgroundColor: '#25292e',
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 0,
  },
  pinned: {
    backgroundColor: '#ad5ff5',
  },
  messageAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#5c5f66',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    resizeMode: 'cover',
  },
  avatarText: {
    fontWeight: 600,
    fontSize: 15,
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: 600,
    fontSize: 15,
    color: '#fff',
  },
  message: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    width: '100%',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontWeight: 600,
    fontSize: 18,
    marginBottom: 10,
  },
  modalThreadName: {
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 10,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    marginTop: 10,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    fontSize: 16,
    color: '#000',
  },
  bold: {
    fontWeight: 600,
  },
});
