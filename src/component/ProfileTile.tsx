import {View, Text, Image} from 'react-native';
import React, {useContext} from 'react';
import {IUser} from '../models/IUser';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {SearchStackParamList} from '../navigation/SearchRoute';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '../navigation/BottomTab';
type ProfileTileProps = {
  user: IUser;
};

type StackSearchNavigation = StackNavigationProp<
  SearchStackParamList,
  'Search'
>;
type BottomTabNavigation = BottomTabNavigationProp<
  BottomTabParamList,
  'SearchContainer'
>;

const ProfileTile = (props: ProfileTileProps) => {
  const navigationSearchStack = useNavigation<StackSearchNavigation>();
  const navigationBottomTab = useNavigation<BottomTabNavigation>();

  const {user} = useContext(AuthContext);

  return (
    <TouchableOpacity
      onPress={() => {
        if (user?.id !== props.user.id) {
          navigationSearchStack.navigate('ProfileSearch', {
            user: props.user,
          });
        } else {
          navigationBottomTab.navigate('Profile');
        }
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
        }}>
        {props.user.avatar ? (
          <Image
            style={{
              width: wp(15),
              height: wp(15),
              borderRadius: wp(15) / 2,
              overflow: 'hidden',
              marginRight: 8,
            }}
            source={{
              uri: props.user.avatar.includes('localhost')
                ? props.user.avatar.replace('localhost', 'http://10.0.2.2')
                : `http://${props.user.avatar}`,
            }}
            onError={error => {
              console.log(error.nativeEvent);
            }}
          />
        ) : (
          <Image
            style={{
              width: wp(15),
              height: wp(15),
              borderRadius: wp(15) / 2,
              overflow: 'hidden',
              marginRight: 8,
            }}
            source={require('../../public/images/default_ava.png')}
          />
        )}
        <Text
          style={{
            fontSize: wp(6),
            color: 'black',
          }}>
          {props.user.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileTile;
