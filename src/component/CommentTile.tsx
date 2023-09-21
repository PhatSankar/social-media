import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {IComment} from '../models/IComment';
import StringUtils from '../utils/StringUtils';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

type CommentTileProps = {
  comment: IComment;
};
const CommentTile = (props: CommentTileProps) => {
  const {comment} = props;
  const {users} = comment;

  return (
    <View style={{padding: 8, flexDirection: 'row', alignItems: 'center'}}>
      {users.avatar ? (
        <Image
          style={styles.avatar}
          source={{
            uri: StringUtils.convertUrlToLocalEmulator(users.avatar),
          }}
        />
      ) : (
        <Image source={require('../../public/images/default_ava.png')} />
      )}
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}>
          <Text style={styles.text}>{users.name}</Text>
          <Text
            style={{
              ...styles.text,
              color: 'grey',
            }}>
            {moment(comment.created_at).fromNow()}
          </Text>
        </View>
        <Text
          style={{
            ...styles.text,
            fontSize: wp(5),
          }}>
          {comment.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10) / 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  text: {
    color: 'black',
    fontSize: wp(4),
  },
});

export default CommentTile;
