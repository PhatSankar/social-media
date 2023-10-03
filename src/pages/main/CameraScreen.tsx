import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Camera, CameraType} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {useNavigation} from '@react-navigation/native';
import {
  MainStackNavigation,
  MainStackParamList,
} from '../../navigation/MainRoute';

const WINDOW_WIDTH = Dimensions.get('window').width;

const CameraScreen = () => {
  const [type, setType] = useState(CameraType.back);
  const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [camera, setCamera] = useState<Camera | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const navigation = useNavigation<MainStackNavigation>();
  useEffect(() => {
    (async () => {
      await requestCameraPermission();

      await requestGalleryPermission();
      if (
        galleryPermission?.status !== 'granted' ||
        cameraPermission?.status !== 'granted'
      ) {
        // Alert.alert('Need permission to work');
      }
    })();
  }, []);

  if (!cameraPermission || !galleryPermission) {
    return <></>;
  }

  if (!cameraPermission.granted || !galleryPermission?.granted) {
    return <></>;
  }

  const toggleCameraType = () => {
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  };

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync();
      navigation.navigate('Post', {
        imageUri: data.uri,
      });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate('Post', {
        imageUri: result.assets[0].uri,
      });
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'}
        />
      </View>

      {image && (
        <Image
          style={{flex: 1}}
          resizeMethod="resize"
          source={{
            uri: image,
          }}
        />
      )}

      <Button title="Take picture" onPress={takePicture} />
      <Button title="Get image gallery" onPress={pickImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
});

export default CameraScreen;
