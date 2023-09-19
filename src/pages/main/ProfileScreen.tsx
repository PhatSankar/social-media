import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useMemo} from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {AuthContext} from '../../context/AuthContext';
import PostService from '../../api/PostService';
import {useRefetchOnFocus} from '../../hooks/useRefetchHook';
import {FlatList} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImageContainer from '../../component/ImageContainer';
import {RouteProp, useRoute} from '@react-navigation/native';
import {SearchStackParamList} from '../../navigation/SearchRoute';
import UserService from '../../api/UserService';
import StatisticProfile from '../../component/StatisticProfile';
import ProfileButton from '../../component/ProfileButton';
import * as ImagePicker from 'expo-image-picker';

type RouteProps = RouteProp<SearchStackParamList, 'ProfileSearch'>;

const ProfileScreen = () => {
  const {user, logout} = useContext(AuthContext);
  const route = useRoute<RouteProps>();
  const queryClient = useQueryClient();
  const profileId = useMemo(() => {
    if (route.params) {
      return route.params.user.id;
    } else {
      return user?.id;
    }
  }, []);

  const isMyProfile = useMemo(() => {
    if (route.params) {
      return false;
    } else {
      return true;
    }
  }, []);

  const fetchUserQuery = useQuery({
    queryKey: ['user', profileId],
    queryFn: () =>
      UserService.fetchUserById({
        id: profileId!,
      }),
    onSuccess(data) {},
  });

  const postQuery = useQuery({
    queryKey: ['posts', profileId],
    queryFn: () => PostService.fetchPost(profileId!),
    onSuccess: data => {
      // console.log(data);
    },
  });
  useRefetchOnFocus(fetchUserQuery.refetch);
  useRefetchOnFocus(postQuery.refetch);

  const [galleryPermission, requestGalleryPermission] =
    ImagePicker.useMediaLibraryPermissions();

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
    <ScrollView>
      <View>
        <View style={styles.infoContainer}>
          <View style={{alignItems: 'center', gap: 4}}>
            {fetchUserQuery.data?.at(0)?.avatar ? (
              <Image
                style={styles.avatar}
                source={{
                  uri: fetchUserQuery.data?.at(0)?.avatar.includes('localhost')
                    ? fetchUserQuery.data
                        ?.at(0)
                        ?.avatar.replace('localhost', 'http://10.0.2.2')
                    : `http://${fetchUserQuery.data?.at(0)?.avatar}`,
                }}
              />
            ) : (
              <Image
                style={styles.avatar}
                source={require('../../../public/images/default_ava.png')}
              />
            )}

            <Text style={styles.text}>{fetchUserQuery.data?.at(0)?.name}</Text>
          </View>
          <View style={styles.statisticContainer}>
            <StatisticProfile
              quantity={postQuery.data?.length ?? 0}
              title={'Posts'}
            />
            <StatisticProfile quantity={0} title={'Follower'} />
            <StatisticProfile quantity={0} title={'Following'} />
          </View>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <ProfileButton title="Upload avatar" onPress={pickImage} />
          <ProfileButton title="Edit profile" onPress={() => {}} />
        </View>
        <View style={styles.divider} />
        <FlatList
          data={postQuery.data}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={item => {
            const post = item.item;
            if (post.image_url.includes('localhost')) {
              return (
                <ImageContainer
                  imageUrl={post.image_url.replace(
                    'localhost',
                    'http://10.0.2.2',
                  )}
                />
              );
            }
            return (
              <ImageContainer imageUrl={`http://${item.item.image_url}`} />
            );
          }}
        />
        {isMyProfile && (
          <Button
            title="Logout"
            onPress={() => {
              logout();
            }}
          />
        )}
      </View>
    </ScrollView>
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
export default ProfileScreen;
