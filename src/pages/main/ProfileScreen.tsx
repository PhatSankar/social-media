import {View, Text, Button, Image, StyleSheet, ScrollView} from 'react-native';
import React, {useContext} from 'react';
import {useQuery} from 'react-query';
import {AuthContext} from '../../context/AuthContext';
import PostService from '../../api/PostService';
import {useRefetchOnFocus} from '../../hooks/useRefetchHook';
import {FlatList} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ProfileScreen = () => {
  const {user, logout} = useContext(AuthContext);
  const postQuery = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () => PostService.fetchPost(user?.id!),
    onSuccess: data => {
      // console.log(data);
    },
  });
  useRefetchOnFocus(postQuery.refetch);
  return (
    <ScrollView>
      <View>
        <View style={{height: hp(30)}}>
          <Text>Profile</Text>
        </View>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginVertical: 8,
          }}
        />
        <FlatList
          data={postQuery.data}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={item => {
            const post = item.item;
            if (post.image_url.includes('localhost')) {
              return (
                <Image
                  style={{flex: 1 / 3, aspectRatio: 1, marginHorizontal: 1}}
                  source={{
                    uri: post.image_url.replace('localhost', 'http://10.0.2.2'),
                  }}
                  onError={error => {
                    console.log(error.nativeEvent);
                  }}
                />
              );
            }
            return (
              <Image
                style={{flex: 1, aspectRatio: 1}}
                source={{uri: `http://${item.item.image_url}`}}
              />
            );
          }}
        />
        <Button
          title="Logout"
          onPress={() => {
            logout();
          }}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
