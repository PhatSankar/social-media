import {View, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';
import React, {memo, useContext} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StringUtils from '../utils/StringUtils';
import ProfileButton from './ProfileButton';
import StatisticProfile from './StatisticProfile';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import FollowingService from '../api/FollowingService';
import {AuthContext} from '../context/AuthContext';
import UserService from '../api/UserService';
import {useRefetchOnFocus} from '../hooks/useRefetchHook';
import * as ImagePicker from 'expo-image-picker';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigation} from '../navigation/MainRoute';

type HeaderProfileProps = {
  profileId?: string;
  isMyProfile: boolean;
  postLength?: number;
};

const HeaderProfile = (props: HeaderProfileProps) => {
  const {user} = useContext(AuthContext);
  const {profileId, isMyProfile, postLength} = props;
  const queryClient = useQueryClient();
  const [galleryPermission, requestGalleryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const navigationMainStack = useNavigation<MainStackNavigation>();

  const fetchIsFollowingQuery = useQuery({
    queryKey: ['following-list', user?.id],
    queryFn: () => FollowingService.fetchFollowingList(user?.id!),
    onSuccess(data) {},
    enabled: false,
  });

  const fetchUserQuery = useQuery({
    queryKey: ['user', profileId],
    queryFn: () =>
      UserService.fetchUserById({
        id: profileId!,
      }),
    onSuccess(data) {},
  });
  useRefetchOnFocus(fetchUserQuery.refetch);

  const followingCountQuery = useQuery({
    queryKey: ['following-count', profileId],
    queryFn: () => FollowingService.fetchFollowingCount(profileId!),
  });

  const followerCountQuery = useQuery({
    queryKey: ['follower-count', profileId],
    queryFn: () => FollowingService.fetchFollowerCount(profileId!),
  });
  useRefetchOnFocus(followingCountQuery.refetch);
  useRefetchOnFocus(followerCountQuery.refetch);

  const createHandleFollowMutation = useMutation({
    mutationFn: FollowingService.handleFollow,
    onSuccess: data => {
      fetchIsFollowingQuery.refetch();
      followerCountQuery.refetch();
    },
  });

  const onHandleFollow = () => {
    if (
      !fetchIsFollowingQuery.data?.some(
        following => following.following_id === profileId,
      )
    ) {
      createHandleFollowMutation.mutate({
        profileId: profileId!,
        currentUserId: user?.id!,
        isFollowing: false,
      });
    } else {
      createHandleFollowMutation.mutate({
        profileId: profileId!,
        currentUserId: user?.id!,
        isFollowing: true,
      });
    }
  };

  const createUploadAvatarMutation = useMutation({
    mutationFn: UserService.uploadUserAvatar,
    onSuccess: data => {
      queryClient.invalidateQueries(['user', profileId], {
        exact: true,
      });
    },
  });

  const pickImage = async () => {
    if (galleryPermission?.status !== 'granted') {
      await requestGalleryPermission();
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        createUploadAvatarMutation.mutate({
          imageUri: result.assets[0].uri,
          udid: profileId!,
        });
      }
    }
  };
  return (
    <View>
      {fetchUserQuery.isLoading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <>
          <View style={styles.infoContainer}>
            <View style={{alignItems: 'center', gap: 4}}>
              {fetchUserQuery.data?.at(0)?.avatar ? (
                <Image
                  resizeMethod="resize"
                  style={styles.avatar}
                  source={{
                    uri: `${StringUtils.convertUrlToLocalEmulator(
                      fetchUserQuery.data.at(0)?.avatar!,
                    )}${
                      fetchUserQuery.data?.at(0)?.updated_at
                        ? `?cache=${fetchUserQuery.data?.at(0)?.updated_at}`
                        : ''
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

              <Text style={styles.text}>
                {fetchUserQuery.data?.at(0)?.name}
              </Text>
            </View>
            <View style={styles.statisticContainer}>
              <StatisticProfile quantity={postLength ?? 0} title={'Posts'} />
              <StatisticProfile
                quantity={followerCountQuery.data ?? 0}
                title={'Follower'}
              />
              <StatisticProfile
                quantity={followingCountQuery.data ?? 0}
                title={'Following'}
              />
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            {isMyProfile ? (
              <>
                <ProfileButton title="Upload avatar" onPress={pickImage} />
                <ProfileButton title="Edit profile" onPress={() => {}} />
              </>
            ) : (
              <>
                <ProfileButton
                  title={
                    fetchIsFollowingQuery.isLoading
                      ? ''
                      : !fetchIsFollowingQuery.data?.some(
                          following => following.following_id === profileId,
                        )
                      ? 'Follow'
                      : 'Following'
                  }
                  onPress={
                    fetchIsFollowingQuery.isLoading ? () => {} : onHandleFollow
                  }
                />
                <ProfileButton
                  title="Message"
                  onPress={() => {
                    navigationMainStack.navigate('Message', {
                      profileId: profileId!,
                      roomId: [
                        user?.id.substring(0, user.id.indexOf('-')),
                        profileId?.substring(0, profileId.indexOf('-')),
                      ]
                        .sort()
                        .join(''),
                    });
                  }}
                />
              </>
            )}
          </View>
          <View style={styles.divider} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(25) / 2,
    resizeMode: 'contain',
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  text: {
    fontSize: wp(5),
    color: 'black',
  },
  statisticContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default memo(HeaderProfile);
