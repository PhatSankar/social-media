import {Button, View} from 'react-native';
import React, {useContext, useMemo} from 'react';
import {useQuery} from 'react-query';
import {AuthContext} from '../../context/AuthContext';
import PostService from '../../api/PostService';
import {useRefetchOnFocus} from '../../hooks/useRefetchHook';

import ImageContainer from '../../component/ImageContainer';
import {RouteProp, useRoute} from '@react-navigation/native';
import {SearchStackParamList} from '../../navigation/SearchRoute';
import HeaderProfile from '../../component/HeaderProfile';
import {FlashList} from '@shopify/flash-list';

type RouteProps = RouteProp<SearchStackParamList, 'ProfileSearch'>;

const ProfileScreen = () => {
  const {user, logout} = useContext(AuthContext);
  const route = useRoute<RouteProps>();
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

  const postQuery = useQuery({
    queryKey: ['posts', profileId],
    queryFn: () => PostService.fetchPost(profileId!),
    onSuccess: data => {},
  });

  useRefetchOnFocus(postQuery.refetch);

  return (
    <View style={{flex: 1}}>
      <FlashList
        data={postQuery.data}
        numColumns={3}
        estimatedItemSize={57}
        ListHeaderComponent={
          <HeaderProfile
            profileId={profileId}
            isMyProfile={isMyProfile}
            postLength={postQuery.data?.length}
          />
        }
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          isMyProfile ? (
            <Button
              title="Logout"
              onPress={() => {
                logout();
              }}
            />
          ) : null
        }
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
          return <ImageContainer imageUrl={`http://${item.item.image_url}`} />;
        }}
      />
    </View>
  );
};

export default ProfileScreen;
