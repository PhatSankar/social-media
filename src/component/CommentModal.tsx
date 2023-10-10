import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useQuery, useQueryClient, useMutation} from 'react-query';
import CommentService from '../api/CommentService';
import UserService from '../api/UserService';
import {AuthContext} from '../context/AuthContext';
import StringUtils from '../utils/StringUtils';
import CommentTile from './CommentTile';
import {IPost} from '../models/IPost';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type CommentModalProp = {
  post: IPost;
};

const CommentModal = (props: CommentModalProp) => {
  const {user} = useContext(AuthContext);
  const {post} = props;

  const fetchUserQuery = useQuery({
    queryKey: ['user', user?.id],
    queryFn: () =>
      UserService.fetchUserById({
        id: user?.id!,
      }),
    onSuccess(data) {},
  });

  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const fetchCommentQuery = useQuery({
    queryKey: ['comment', post.id],
    queryFn: () => CommentService.fetchComments(post.id),
    onSuccess(data) {},
  });

  const createSendCommentMutation = useMutation({
    mutationFn: CommentService.uploadComment,
    onSuccess: data => {
      setText('');
      Keyboard.dismiss();
      queryClient.invalidateQueries(['comment', post.id], {
        exact: true,
      });
    },
  });
  if (fetchCommentQuery.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
  return (
    <View
      style={{
        ...styles.flex,
        backgroundColor: 'white',
      }}>
      <View style={styles.flex}>
        <FlashList
          // ListHeaderComponent={<PostTile post={post} />}
          estimatedItemSize={66}
          data={fetchCommentQuery.data}
          keyExtractor={item => item.id}
          renderItem={({item}) => <CommentTile comment={item} />}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: 4,
        }}>
        {fetchUserQuery.data?.at(0)?.avatar ? (
          <Image
            resizeMethod="resize"
            style={styles.avatar}
            source={{
              uri: StringUtils.convertUrlToLocalEmulator(
                fetchUserQuery.data?.at(0)?.avatar!,
              ),
            }}
          />
        ) : (
          <Image
            resizeMethod="resize"
            source={require('../../public/images/default_ava.png')}
          />
        )}

        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={newText => setText(newText)}
          placeholder={`Comment as ${
            fetchUserQuery.data ? fetchUserQuery.data.at(0)?.name : ''
          }`}
        />

        <TouchableOpacity
          onPress={
            text.length !== 0
              ? () => {
                  createSendCommentMutation.mutate({
                    postId: post.id,
                    userId: user?.id!,
                    text: text,
                  });
                }
              : undefined
          }>
          <Ionicons
            name="send-sharp"
            size={wp(7)}
            color={text.length !== 0 ? 'blue' : 'grey'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  avatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10) / 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: wp(4),
  },
});

export default CommentModal;
