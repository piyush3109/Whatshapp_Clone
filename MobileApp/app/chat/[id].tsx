import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useStore } from '../../store';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LucideChevronLeft, LucideVideo, LucidePhone, LucidePlus, LucideSend, LucideMic, LucideSmile, LucideMoreHorizontal, LucideX } from 'lucide-react-native';
import io from 'socket.io-client';

const BACKEND_URL = 'http://10.227.176.245:5001';
var socket: any;

export default function ChatWindow() {
  const { id } = useLocalSearchParams();
  const { user, selectedChat, messages, setMessages, chats }: any = useStore();
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState<any>(null);
  const [selection, setSelection] = useState<string | null>(null);
  const flatListRef: any = useRef();
  const router = useRouter();

  const fetchMessages = async () => {
    if (!id || !user?.token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${BACKEND_URL}/api/message/${id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', id);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    socket = io(BACKEND_URL);
    socket.emit('setup', user);
    fetchMessages();
    socket.on('message received', (newMessageReceived: any) => {
      if (id === newMessageReceived.chat._id) {
        setMessages((prev: any) => [...prev, newMessageReceived]);
      }
    });
    return () => socket.disconnect();
  }, [id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const payload = { 
        content: newMessage, 
        chatId: id,
        replyTo: replyMessage?._id || null 
      };
      setNewMessage('');
      setReplyMessage(null);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${BACKEND_URL}/api/message`, payload, config);
      socket.emit('new message', data);
      setMessages((prev: any) => [...prev, data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${BACKEND_URL}/api/message/reaction`, { messageId, emoji }, config);
      setSelection(null);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const getChatName = () => {
    if (!selectedChat) return 'Loading...';
    if (selectedChat.isGroupChat) return selectedChat.chatName;
    return selectedChat.users[0]?._id === user?._id ? selectedChat.users[1]?.name : selectedChat.users[0]?.name;
  };

  const getChatPic = () => {
   if (!selectedChat) return 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';
   if (selectedChat.isGroupChat) return 'https://icon-library.com/images/group-icon-png/group-icon-png-15.jpg';
   return selectedChat.users[0]?._id === user?._id ? selectedChat.users[1]?.pic : selectedChat.users[0]?.pic;
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isSender = item.sender._id === user._id;
    return (
      <View style={[styles.messageWrapper, isSender ? styles.senderRow : styles.receiverRow]}>
        <TouchableOpacity 
          onLongPress={() => setSelection(item._id)}
          style={[styles.messageBubble, isSender ? styles.senderBubble : styles.receiverBubble]}
        >
          {item.replyTo && (
            <View style={styles.replyPreviewInside}>
              <Text style={styles.replySender}>{item.replyTo.sender === user._id ? 'You' : 'Contact'}</Text>
              <Text style={styles.replyContent} numberOfLines={2}>{item.replyTo.content}</Text>
            </View>
          )}
          <View style={styles.messageContentRow}>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.messageTime}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true })}
            </Text>
          </View>
          {item.reactions?.length > 0 && (
            <View style={styles.reactionContainer}>
              {Array.from(new Set(item.reactions.map((r: any) => r.emoji))).map((emoji: any) => (
                <Text key={emoji} style={styles.reactionEmoji}>{emoji}</Text>
              ))}
              <Text style={styles.reactionCount}>{item.reactions.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        {selection === item._id && (
          <View style={styles.reactionOverlay}>
            <View style={styles.emojiRow}>
              {['❤️', '😂', '😮', '😢', '👍', '🙏'].map(emoji => (
                <TouchableOpacity key={emoji} onPress={() => handleReaction(item._id, emoji)}>
                  <Text style={styles.overlayEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => { setReplyMessage(item); setSelection(null); }} style={styles.actionBtn}><Text style={styles.actionText}>Reply</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setSelection(null)} style={styles.actionBtn}><Text style={styles.actionText}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <LucideChevronLeft color="#02c754" size={32} />
        </TouchableOpacity>
        <Image source={{ uri: getChatPic() }} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{getChatName()}</Text>
          <Text style={styles.headerStatus}>{selectedChat?.isGroupChat ? `${selectedChat.users.length} members` : 'online'}</Text>
        </View>
        <View style={styles.headerRight}>
          <LucideVideo color="#02c754" size={24} />
          <LucidePhone color="#02c754" size={24} />
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <Image source={{ uri: 'https://w0.peakpx.com/wallpaper/508/606/HD-wallpaper-whatsapp-dark-backgroun-background-dark-pattern.jpg' }} style={styles.bgImage} />
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {replyMessage && (
          <View style={styles.replyPreviewBar}>
            <View style={styles.replyBarColor} />
            <View style={styles.replyBarInfo}>
              <Text style={styles.replyBarName}>Replying to {replyMessage.sender === user._id ? 'yourself' : replyMessage.sender.name}</Text>
              <Text style={styles.replyBarContent} numberOfLines={1}>{replyMessage.content}</Text>
            </View>
            <TouchableOpacity onPress={() => setReplyMessage(null)}><LucideX color="#8e8e93" size={20} /></TouchableOpacity>
          </View>
        )}

        <View style={styles.inputContainer}>
          <LucidePlus color="#02c754" size={28} />
          <View style={styles.inputWrapper}>
             <TextInput style={styles.input} placeholder="Message" placeholderTextColor="#8e8e93" value={newMessage} onChangeText={setNewMessage} multiline />
             <LucideSmile color="#8e8e93" size={24} />
          </View>
          {newMessage.trim().length > 0 ? (
            <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}><LucideSend color="#fff" size={22} /></TouchableOpacity>
          ) : (
            <LucideMic color="#02c754" size={28} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#1c1c1e', borderBottomWidth: 0.5, borderBottomColor: '#2c2c2e' },
  backBtn: { paddingRight: 5 },
  headerAvatar: { width: 38, height: 38, borderRadius: 19 },
  headerInfo: { flex: 1, marginLeft: 10 },
  headerName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  headerStatus: { color: '#25d366', fontSize: 12 },
  headerRight: { flexDirection: 'row', gap: 20, paddingRight: 10 },
  keyboardView: { flex: 1 },
  bgImage: { ...StyleSheet.absoluteFillObject, opacity: 0.1 },
  messageList: { padding: 10 },
  messageWrapper: { marginBottom: 10, position: 'relative' },
  senderRow: { alignItems: 'flex-end' },
  receiverRow: { alignItems: 'flex-start' },
  messageBubble: { padding: 8, borderRadius: 15, maxWidth: '85%' },
  senderBubble: { backgroundColor: '#005c4b', borderTopRightRadius: 2 },
  receiverBubble: { backgroundColor: '#262628', borderTopLeftRadius: 2 },
  messageContentRow: { flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap' },
  messageText: { color: '#fff', fontSize: 16, marginRight: 8 },
  messageTime: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  replyPreviewInside: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 5, borderRadius: 5, borderLeftWidth: 3, borderLeftColor: '#02c754', marginBottom: 5 },
  replySender: { color: '#02c754', fontSize: 12, fontWeight: 'bold' },
  replyContent: { color: '#8e8e93', fontSize: 13 },
  reactionContainer: { position: 'absolute', bottom: -12, left: -5, backgroundColor: '#1c1c1e', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, paddingVertical: 2, borderWidth: 1, borderColor: '#2c2c2e' },
  reactionEmoji: { fontSize: 12, marginRight: 2 },
  reactionCount: { color: '#8e8e93', fontSize: 10 },
  reactionOverlay: { position: 'absolute', top: -100, zIndex: 100, backgroundColor: '#2c2c2e', borderRadius: 20, padding: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
  emojiRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  overlayEmoji: { fontSize: 24 },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 15 },
  actionBtn: { backgroundColor: '#3c3c3e', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
  actionText: { color: '#fff', fontWeight: 'bold' },
  replyPreviewBar: { flexDirection: 'row', padding: 10, backgroundColor: '#1c1c1e', borderTopLeftRadius: 15, borderTopRightRadius: 15, marginHorizontal: 10 },
  replyBarColor: { width: 4, backgroundColor: '#02c754', borderRadius: 2 },
  replyBarInfo: { flex: 1, paddingLeft: 10 },
  replyBarName: { color: '#02c754', fontSize: 13, fontWeight: 'bold' },
  replyBarContent: { color: '#8e8e93', fontSize: 14 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#1c1c1e', gap: 12 },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#2c2c2e', borderRadius: 25, paddingHorizontal: 15 },
  input: { flex: 1, color: '#fff', fontSize: 17, paddingVertical: 8 },
  sendBtn: { backgroundColor: '#02c754', width: 45, height: 45, borderRadius: 22.5, alignItems: 'center', justifyContent: 'center' },
});
