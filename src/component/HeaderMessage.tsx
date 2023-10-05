import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {IUser} from '../models/IUser';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StringUtils from '../utils/StringUtils';

type HeaderMessageProps = {
  profile: IUser;
};
const HeaderMessage = (props: HeaderMessageProps) => {
  const {profile} = props;
  return (
    <View style={styles.headerContainer}>
      {profile.avatar ? (
        <Image
          resizeMethod="resize"
          style={styles.avatar}
          source={{
            uri: `${StringUtils.convertUrlToLocalEmulator(profile.avatar)}${
              profile.updated_at ? `?cache=${profile.updated_at}` : ''
            }`,
          }}
          onError={error => {
            console.log(error.nativeEvent);
          }}
        />
      ) : (
        <Image
          resizeMethod="resize"
          style={styles.avatar}
          source={require('../../public/images/default_ava.png')}
        />
      )}
      <Text style={{fontSize: wp(6), color: 'black', fontWeight: '500'}}>
        {profile.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10) / 2,
    resizeMode: 'contain',
  },
});

export default HeaderMessage;
