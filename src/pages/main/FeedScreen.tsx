import {View, Text, ActivityIndicator, Button, StyleSheet} from 'react-native';
import React, {useContext, useMemo, useState} from 'react';
import {useInfiniteQuery, useMutation, useQuery} from 'react-query';
import {AuthContext} from '../../context/AuthContext';
import FollowingService from '../../api/FollowingService';
import PostService from '../../api/PostService';
import {IFollowing} from '../../models/IFollowing';
import PostTile from '../../component/PostTile';
import {useRefetchOnFocus} from '../../hooks/useRefetchHook';
import {IPost} from '../../models/IPost';
import {FlashList} from '@shopify/flash-list';
import SkeletonPostTile from '../../component/SkeletonPostTile';

const FeedScreen = () => {
  const {user} = useContext(AuthContext);
  const fetchFollowingListQuery = useQuery({
    queryKey: ['following-list', user?.id],
    queryFn: () => FollowingService.fetchFollowingList(user?.id!),
    onSuccess: data => {
      postFollowingInfiniteQuery.refetch();
    },
  });

  const followingList = useMemo(() => {
    return fetchFollowingListQuery.data;
  }, [fetchFollowingListQuery.data]);

  const postFollowingInfiniteQuery = useInfiniteQuery(
    ['postsFollowing', followingList],
    ({pageParam}) =>
      PostService.fetchFollowingPostFromRange({
        followingIdList: followingList ?? [],
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 8 ? allPages.length : null;
      },
    },
  );

  useRefetchOnFocus(postFollowingInfiniteQuery.refetch);

  if (fetchFollowingListQuery.isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlashList
        data={postFollowingInfiniteQuery.data?.pages.flatMap(page => page)}
        keyExtractor={item => item.id}
        renderItem={post => {
          return <PostTile post={post.item} />;
        }}
        onEndReached={() => {
          if (postFollowingInfiniteQuery.hasNextPage) {
            postFollowingInfiniteQuery.fetchNextPage();
          }
        }}
        ListFooterComponent={() =>
          postFollowingInfiniteQuery.hasNextPage ? (
            <SkeletonPostTile />
          ) : undefined
        }
        onEndReachedThreshold={3}
        estimatedItemSize={440}
      />
    </View>
  );
};

export default FeedScreen;
