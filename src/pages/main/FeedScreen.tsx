import {View, Text, ActivityIndicator, FlatList, Button} from 'react-native';
import React, {useContext, useState} from 'react';
import {useMutation, useQuery} from 'react-query';
import {AuthContext} from '../../context/AuthContext';
import FollowingService from '../../api/FollowingService';
import PostService from '../../api/PostService';
import {IFollowing} from '../../models/IFollowing';
import PostTile from '../../component/PostTile';
import {useRefetchOnFocus} from '../../hooks/useRefetchHook';
import {IPost} from '../../models/IPost';

const FeedScreen = () => {
  const {user} = useContext(AuthContext);
  const [postList, setPostList] = useState<IPost[]>([]);
  const fetchFollowingListQuery = useQuery({
    queryKey: ['following-list', user?.id],
    queryFn: () => FollowingService.fetchFollowingList(user?.id!),
    onSuccess: data => {
      fetchPostFeedFollowingQuery.mutate(data);
    },
  });
  const fetchPostFeedFollowingQuery = useMutation({
    mutationKey: ['post-feed', user?.id],
    mutationFn: PostService.fetchFollowingPost,
    onSuccess: data => {
      console.log(data);
      // console.log(data.at(0).users?.avatar);
      setPostList(data);
    },
  });

  if (fetchFollowingListQuery.isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
  return (
    <View>
      <FlatList
        data={postList}
        keyExtractor={item => item.id}
        renderItem={post => {
          return <PostTile post={post.item} />;
        }}
      />
    </View>
  );
};

export default FeedScreen;
