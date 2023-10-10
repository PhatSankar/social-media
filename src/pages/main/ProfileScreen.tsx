import {ActivityIndicator, Button, View} from 'react-native';
import React, {useContext, useMemo} from 'react';
import {useInfiniteQuery, useMutation, useQuery} from 'react-query';
import {AuthContext} from '../../context/AuthContext';
import PostService from '../../api/PostService';
import {useRefetchOnFocus} from '../../hooks/useRefetchHook';

import ImageContainer from '../../component/ImageContainer';
import {RouteProp, useRoute} from '@react-navigation/native';
import {SearchStackParamList} from '../../navigation/SearchRoute';
import HeaderProfile from '../../component/HeaderProfile';
import {FlashList} from '@shopify/flash-list';
import AuthService from '../../api/AuthService';

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

  const postLengthQuery = useQuery({
    queryKey: ['postLength', profileId],
    queryFn: () => PostService.fetchPostLength(profileId!),
  });

  useRefetchOnFocus(postLengthQuery.refetch);

  const postProfileInfiniteList = useInfiniteQuery(
    ['posts', profileId],
    ({pageParam}) =>
      PostService.fetchPostByRange({
        userId: profileId!,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 9 ? allPages.length : null;
      },
    },
  );

  useRefetchOnFocus(postProfileInfiniteList.refetch);

  const createDeleteTokenMutation = useMutation({
    mutationFn: AuthService.deleteToken,
    onSuccess: () => {
      logout();
    },
  });

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlashList
        data={postProfileInfiniteList.data?.pages.flatMap(page => page)}
        numColumns={3}
        estimatedItemSize={57}
        ListHeaderComponent={
          <HeaderProfile
            profileId={profileId}
            isMyProfile={isMyProfile}
            postLength={postLengthQuery.data ?? 0}
          />
        }
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          isMyProfile ? (
            <View>
              {postProfileInfiniteList.hasNextPage ? (
                <ActivityIndicator size={'large'} />
              ) : undefined}
              <Button
                title="Logout"
                onPress={() => {
                  createDeleteTokenMutation.mutate();
                }}
              />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (postProfileInfiniteList.hasNextPage) {
            postProfileInfiniteList.fetchNextPage();
          }
        }}
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
