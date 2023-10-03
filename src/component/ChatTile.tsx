import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {IMessage} from '../models/IMessage';
import {IUser} from '../models/IUser';
import StringUtils from '../utils/StringUtils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type ChatTileProps = {chat: IMessage; profile: IUser; userId: string};
const ChatTile = (props: ChatTileProps) => {
  const {chat, profile, userId} = props;
  return (
    <View
      style={{
        flexDirection: userId === profile.id ? 'row-reverse' : 'row',
        gap: 8,
        marginVertical: 8,
      }}>
      {profile.avatar ? (
        <Image
          resizeMethod="resize"
          style={styles.avatar}
          source={{
            uri: `${StringUtils.convertUrlToLocalEmulator(profile.avatar!)}${
              profile.updated_at ? `?cache=${profile.updated_at}` : ''
            }`,
          }}
          onError={error => {
            console.log(error.nativeEvent);
          }}
        />
      ) : (
        <Image
          resizeMethod="resize"
          style={styles.avatar}
          source={require('../../public/images/default_ava.png')}
        />
      )}
      <View style={{flex: 1}}>
        <View
          style={{
            ...styles.bubbleChat,
            alignSelf: userId === profile.id ? 'flex-end' : 'flex-start',
            backgroundColor:
              userId === profile.id ? 'rgb(30,144,255)' : 'rgba(0, 0, 0, 0.1)',
          }}>
          <Text
            style={{
              ...styles.text,
              color: userId === profile.id ? 'white' : 'black',
            }}>
            {chat.message}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleChat: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    flex: 1,
    maxWidth: '90%',
  },
  text: {
    fontSize: wp(4.5),
  },
  avatar: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(11) / 2,
    resizeMode: 'contain',
  },
});

export default ChatTile;
