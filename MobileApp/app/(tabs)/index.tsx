import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView, TextInput, RefreshControl } from 'react-native';
import { useStore } from '../../store';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { LucideCamera, LucidePlus, LucideSearch, LucideMoreHorizontal } from 'lucide-react-native';

const BACKEND_URL = 'http://10.227.176.245:5001';

export default function ChatsScreen() {
  const { user, chats, setChats, setSelectedChat }: any = useStore();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchChats = async () => {
    if (!user?.token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${BACKEND_URL}/api/chat`, config);
      setChats(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchChats();
    setRefreshing(false);
  };

  const openChat = (chat: any) => {
    setSelectedChat(chat);
    router.push({ pathname: '/chat/[id]', params: { id: chat._id } });
  };

  const getChatName = (chat: any) => {
    if (chat.isGroupChat) return chat.chatName;
    return chat.users[0]?._id === user?._id ? chat.users[1]?.name : chat.users[0]?.name;
  };

  const getChatPic = (chat: any) => {
    if (chat.isGroupChat) return 'https://icon-library.com/images/group-icon-png/group-icon-png-15.jpg';
    return chat.users[0]?._id === user?._id ? chat.users[1]?.pic : chat.users[0]?.pic;
  };

  const filteredChats = chats?.filter((c: any) =>
    getChatName(c)?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.chatRow} onPress={() => openChat(item)}>
      <Image source={{ uri: getChatPic(item) }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{getChatName(item)}</Text>
          <Text style={styles.chatTime}>
            {item.latestMessage ? new Date(item.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </Text>
        </View>
        <Text style={styles.chatMessage} numberOfLines={1}>
          {item.latestMessage ? item.latestMessage.content : 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <LucideMoreHorizontal color="#fff" size={24} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn}>
            <LucideCamera color="#fff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerBtn, styles.plusBtn]}>
            <LucidePlus color="#000" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Chats</Text>

      <View style={styles.searchContainer}>
        <LucideSearch color="#8e8e93" size={18} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#8e8e93"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#25d366" />}
        ListEmptyComponent={<Text style={styles.emptyText}>No chats found yet.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#1c1c1e',
  },
  plusBtn: {
    backgroundColor: '#25d366',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
  },
  chatRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2c2c2e',
    paddingBottom: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  chatTime: {
    fontSize: 14,
    color: '#8e8e93',
  },
  chatMessage: {
    fontSize: 15,
    color: '#8e8e93',
  },
  emptyText: {
    color: '#8e8e93',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});
