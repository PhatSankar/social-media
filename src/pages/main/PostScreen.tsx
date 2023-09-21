import {View, Text, Image, Button, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainRoute';
import {TextInput} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useMutation} from 'react-query';
import PostService from '../../api/PostService';
import {AuthContext} from '../../context/AuthContext';

const PostScreen = ({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'Post'>) => {
  const [caption, setCaption] = useState('');
  const {user} = useContext(AuthContext);

  const createPostMutation = useMutation({
    mutationFn: PostService.uploadImagePost,
    onSuccess: data => {
      navigation.popToTop();
    },
  });

  const handlePost = () => {
    createPostMutation.mutate({
      imageUri: route.params.imageUri,
      caption,
      userId: user?.id!,
    });
  };

  return (
    <View style={{flex: 1, padding: 8}}>
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          placeholder="Write a caption"
          style={styles.input}
          onChangeText={text => setCaption(text)}
        />
        <Image style={styles.image} source={{uri: route.params.imageUri}} />
      </View>
      {createPostMutation.isError && (
        <Text>Error while uploading, please try again</Text>
      )}
      <Button title="Post" onPress={handlePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 8,
  },
  input: {flex: 1, fontSize: hp(2)},
  image: {width: wp(18), height: wp(18)},
});

export default PostScreen;
