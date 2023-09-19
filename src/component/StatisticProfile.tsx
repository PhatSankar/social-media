import {View, Text} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type StatisticProps = {
  quantity: number;
  title: string;
};
const StatisticProfile = (props: StatisticProps) => {
  return (
    <View style={{alignItems: 'center'}}>
      <Text
        style={{
          fontSize: wp(6),
          color: 'black',
          fontWeight: 'bold',
        }}>
        {props.quantity}
      </Text>
      <Text
        style={{
          fontSize: wp(4),
          color: 'black',
        }}>
        {props.title}
      </Text>
    </View>
  );
};

export default StatisticProfile;
