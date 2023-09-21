import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {IPost} from '../models/IPost';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StringUtils from '../utils/StringUtils';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../navigation/MainRoute';
import LikeService from '../api/LikeService';
import {AuthContext} from '../context/AuthContext';

type PostTileProps = {
  post: IPost;
};

const PostTile = (props: PostTileProps) => {
  const {post} = props;
  const [showMore, setShowMore] = useState(false);
  const navigation = useNavigation<MainStackNavigation>();
  const {user} = useContext(AuthContext);

  return (
    <View
      style={{
        // borderWidth: 0.5,
        marginBottom: 8,
        // borderBottomWidth: 0.5,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
        }}>
        {post.users?.avatar ? (
          <Image
            style={styles.avatar}
            source={{
              uri: `${StringUtils.convertUrlToLocalEmulator(
                post.users?.avatar!,
              )}`,
            }}
          />
        ) : (
          <Image
            style={styles.avatar}
            source={require('../../public/images/default_ava.png')}
          />
        )}
        <Text
          style={{
            fontSize: wp(5),
          }}>
          {post.users?.name}
        </Text>
      </View>
      <Image
        style={{
          width: '100%',
          aspectRatio: 1,
        }}
        source={{
          uri: `${StringUtils.convertUrlToLocalEmulator(post.image_url)}`,
        }}
      />
      <View style={styles.divider} />

      <View
        style={{
          marginHorizontal: 8,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Comment', {
              post: post,
            });
          }}>
          <SimpleLineIcons name="bubble" size={wp(6)} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            gap: 4,
          }}>
          <Text numberOfLines={!showMore ? 2 : 0}>
            <Text
              style={{
                ...styles.textName,
              }}>
              {post.users?.name}{' '}
            </Text>
            <Text style={styles.textCaption}>
              {post.caption.length > 30 && !showMore
                ? `${post.caption.substring(0, 30 - 3)}... `
                : post.caption}
            </Text>
            {post.caption.length > 30 && (
              <Text
                style={{fontSize: wp(4.3)}}
                onPress={() => setShowMore(!showMore)}>
                {!showMore ? 'Show More' : 'Show Less'}
              </Text>
            )}
          </Text>
        </View>
      </View>
      <Button
        title="Like"
        onPress={async () => {
          await LikeService.updateLikePost(post.id, user?.id!);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(7) / 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  textName: {
    fontSize: wp(4.3),
    color: 'black',
    fontWeight: '700',
  },
  textCaption: {
    fontSize: wp(4.3),
    color: 'black',
  },
});
export default PostTile;
