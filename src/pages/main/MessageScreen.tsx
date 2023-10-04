import {View, FlatList, ActivityIndicator, Keyboard} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {socket} from '../../socket/Socket';
import {IMessage} from '../../models/IMessage';
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainRoute';
import {FlashList} from '@shopify/flash-list';
import ChatTile from '../../component/ChatTile';
import {useQuery} from 'react-query';
import UserService from '../../api/UserService';
import {AuthContext} from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MessageScreen = ({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'Message'>) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chat, setChat] = useState('');
  const {user} = useContext(AuthContext);
  const flashListRef = useRef<any>(null);
  const fetchUserQuery = useQuery({
    queryKey: ['user', user?.id],
    queryFn: () => UserService.fetchUserById({id: user?.id!}),
    onSuccess: data => {},
  });

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit(
        'hello',
        {
          roomId: route.params.roomId,
          socketId: socket.id,
        },
        (val: IMessage[]) => {
          setMessages(val.reverse());
        },
      );
    });

    socket.on('chat', e => {
      setMessages(prev => [e, ...prev]);
      Keyboard.dismiss();
      setChat('');
    });

    socket.connect();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat');
      socket.off('hello');

      socket.disconnect();
    };
  }, []);

  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
        paddingHorizontal: 12,
      }}>
      <View style={{flex: 1, paddingVertical: 4}}>
        {fetchUserQuery.isLoading ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <FlashList
            estimatedItemSize={99}
            data={messages}
            ref={flashListRef}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            inverted
            renderItem={({item}) => (
              <ChatTile
                profile={
                  item.userId === route.params.currentProfile.id
                    ? route.params.currentProfile
                    : fetchUserQuery.data?.at(0)!
                }
                chat={item}
                userId={fetchUserQuery.data?.at(0)?.id!}
              />
            )}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingBottom: 12,
        }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 0.5,
            borderRadius: 15,
          }}
          placeholder="Enter a message"
          value={chat}
          onChangeText={text => setChat(text)}
        />
        <TouchableOpacity
          onPress={
            chat.length !== 0
              ? () => {
                  socket.emit('chat', {
                    message: chat,
                    userId: user?.id,
                    roomId: route.params.roomId,
                    toUserId: route.params.currentProfile.id,
                    name: fetchUserQuery.data?.at(0)?.name,
                  });
                }
              : undefined
          }>
          <Icon
            name="send"
            size={wp(7)}
            color={chat.length === 0 ? 'gray' : 'blue'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageScreen;
