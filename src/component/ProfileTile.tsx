import {useNavigation} from '@react-navigation/native';
import React, {memo, useContext} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {AuthContext} from '../context/AuthContext';
import {IUser} from '../models/IUser';
import {BottomTabNavigation} from '../navigation/BottomTab';
import {StackSearchNavigation} from '../navigation/SearchRoute';
import StringUtils from '../utils/StringUtils';
type ProfileTileProps = {
  user: IUser;
};

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
      <View style={styles.container}>
        {props.user.avatar ? (
          <Image
            resizeMethod="resize"
            style={styles.image}
            source={{
              uri: `${StringUtils.convertUrlToLocalEmulator(
                props.user.avatar,
              )}${
                props.user.updated_at ? `?cache=${props.user.updated_at}` : ''
              }`,
            }}
            onError={error => {
              console.log(error.nativeEvent);
            }}
          />
        ) : (
          <Image
            resizeMethod="resize"
            style={styles.image}
            source={require('../../public/images/default_ava.png')}
          />
        )}
        <Text style={styles.text}>{props.user.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(15) / 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  text: {
    fontSize: wp(6),
    color: 'black',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
});
export default memo(ProfileTile);
