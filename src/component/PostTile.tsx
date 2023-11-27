import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {IPost} from '../models/IPost';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StringUtils from '../utils/StringUtils';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../navigation/MainRoute';
import LikeService from '../api/LikeService';
import {AuthContext} from '../context/AuthContext';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CommentModal from './CommentModal';
import moment from 'moment';
import LottieView from 'lottie-react-native';

type PostTileProps = {
  post: IPost;
};

const PostTile = (props: PostTileProps) => {
  const {post} = props;
  const [showMore, setShowMore] = useState(false);
  const navigation = useNavigation<MainStackNavigation>();
  const {user} = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['100%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const queryClient = useQueryClient();

  const createInsertLikeMutation = useMutation({
    mutationFn: LikeService.insertikePost,
    onSuccess: data => {
      queryClient.invalidateQueries(['like', post.id, user?.id], {
        exact: true,
      });
      queryClient.invalidateQueries(['following-list', user?.id], {
        exact: true,
      });
    },
  });

  const createDeleteLikeMutation = useMutation({
    mutationFn: LikeService.deleteikePost,
    onSuccess: data => {
      queryClient.invalidateQueries(['like', post.id, user?.id], {
        exact: true,
      });
      queryClient.invalidateQueries(['following-list', user?.id], {
        exact: true,
      });
    },
  });

  const fetchIsLikesQuery = useQuery({
    queryKey: ['like', post.id, user?.id],
    queryFn: () => LikeService.fetchIsLike(post.id, user?.id!),
    onSuccess: data => {
      // console.log(!(data.length !== 0));
      setIsLiked(data.length !== 0);
    },
  });

  const animationLikeRef = useRef<LottieView>(null);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (!isFirstRun.current) {
      if (isLiked) {
        animationLikeRef.current?.play(0, 80);
      } else {
        animationLikeRef.current?.play(80, 181);
      }
    } else {
      if (isLiked) {
        animationLikeRef.current?.play(80, 80);
      } else {
        animationLikeRef.current?.play(0, 0);
      }
      isFirstRun.current = false;
    }
  }, [isLiked]);

  return (
    <View
      style={{
        // borderWidth: 0.5,
        marginBottom: 12,
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
            resizeMethod="resize"
            style={styles.avatar}
            source={{
              uri: `${StringUtils.convertUrlToLocalEmulator(
                post.users?.avatar!,
              )}${
                post.users?.updated_at ? `?cache=${post.users?.updated_at}` : ''
              }`,
            }}
          />
        ) : (
          <Image
            style={styles.avatar}
            resizeMethod="resize"
            source={require('../../public/images/default_ava.png')}
          />
        )}
        <Text
          style={{
            fontSize: wp(6),
            fontWeight: '500',
            color: 'black',
          }}>
          {post.users?.name}
        </Text>
      </View>
      <Image
        resizeMethod="resize"
        style={{
          width: '100%',
          aspectRatio: 1,
        }}
        source={{
          uri: `${StringUtils.convertUrlToLocalEmulator(post.image_url)}`,
        }}
      />
      <View
        style={{
          marginBottom: 12,
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
          }}>
          {/* <TouchableOpacity
            onPress={
              fetchIsLikesQuery.isLoading
                ? undefined
                : () =>
                    isLiked
                      ? createDeleteLikeMutation.mutate({
                          postId: post.id,
                          userId: user?.id!,
                        })
                      : createInsertLikeMutation.mutate({
                          postId: post.id,
                          userId: user?.id!,
                        })
            }>
            <AntDesign
              name={isLiked ? 'heart' : 'hearto'}
              size={wp(6)}
              color={isLiked ? 'red' : undefined}
            />
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={
              fetchIsLikesQuery.isLoading
                ? undefined
                : () =>
                    isLiked
                      ? createDeleteLikeMutation.mutate({
                          postId: post.id,
                          userId: user?.id!,
                        })
                      : createInsertLikeMutation.mutate({
                          postId: post.id,
                          userId: user?.id!,
                        })
            }>
            <LottieView
              ref={animationLikeRef}
              autoPlay={false}
              loop={false}
              style={{
                // backgroundColor: 'red',
                height: wp(15),
                width: wp(15),
              }}
              source={require('../../public/animations/like.json')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handlePresentModalPress();
            }}>
            <SimpleLineIcons
              name="bubble"
              size={wp(5)}
              color={'rgb(111,111,111)'}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginHorizontal: 8}}>
          <Text
            style={{
              fontSize: wp(4.5),
            }}>
            {post.likes_count} likes ∙ {moment(post.created_at).fromNow()}
          </Text>
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
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}>
        <CommentModal post={post} />
      </BottomSheetModal>
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
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  textName: {
    fontSize: wp(5.5),
    color: 'black',
    fontWeight: '700',
  },
  textCaption: {
    fontSize: wp(5.5),
    color: 'black',
  },
});
export default PostTile;
