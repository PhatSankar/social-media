import {View, Text, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React from 'react';

type ProfileButtonProps = {
  title: string;
  onPress: () => void;
};
const ProfileButton = (props: ProfileButtonProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: 'grey',
          borderRadius: 10,
        }}>
        <Text style={{color: 'white', fontSize: wp(5)}}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileButton;
