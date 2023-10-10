import {View, Text} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const SkeletonPostTile = () => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          padding={8}>
          <SkeletonPlaceholder.Item
            width={wp(10)}
            height={wp(10)}
            borderRadius={wp(10) / 2}
            marginRight={8}
          />
          <SkeletonPlaceholder.Item width={wp(20)} height={wp(6)} />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item width={wp(100)} height={hp(45)} />
        <SkeletonPlaceholder.Item
          marginVertical={12}
          marginHorizontal={8}
          gap={8}>
          <SkeletonPlaceholder.Item width={wp(20)} height={wp(6)} />
          <SkeletonPlaceholder.Item width={wp(15)} height={wp(6)} />
          <SkeletonPlaceholder.Item width={wp(25)} height={wp(6)} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default SkeletonPostTile;
