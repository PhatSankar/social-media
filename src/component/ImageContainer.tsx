import {View, Text, Image} from 'react-native';
import React from 'react';
type ImageContainerProps = {
  imageUrl: string;
};
const ImageContainer = (props: ImageContainerProps) => {
  return (
    <Image
      style={{flex: 1 / 3, aspectRatio: 1, marginHorizontal: 1}}
      source={{
        uri: props.imageUrl,
      }}
      onError={error => {
        console.log(error.nativeEvent);
      }}
    />
  );
};

export default ImageContainer;
