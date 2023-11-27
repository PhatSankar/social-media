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
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'}
        />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
        }}>
        <TouchableOpacity
          style={{
            ...styles.button,

            backgroundColor: 'rgb(0, 149, 246)',
          }}
          onPress={takePicture}>
          <Text style={styles.textButton}>Take picture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.button,

            backgroundColor: 'rgb(0, 149, 246)',
          }}
          onPress={pickImage}>
          <Text style={styles.textButton}>Get image gallery</Text>
        </TouchableOpacity>
      </View>
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
  button: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
  },
  textButton: {
    fontSize: hp(2),
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CameraScreen;
