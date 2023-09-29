import {View, Text, Image} from 'react-native';
import React, {memo} from 'react';
type ImageContainerProps = {
  imageUrl: string;
};
const ImageContainer = (props: ImageContainerProps) => {
  return (
    <Image
      style={{flex: 1, aspectRatio: 1, marginHorizontal: 1, marginBottom: 1}}
      source={{
        uri: props.imageUrl,
      }}
      onError={error => {
        console.log(error.nativeEvent);
      }}
    />
  );
};

export default memo(ImageContainer);
