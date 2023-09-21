import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTab from './BottomTab';
import CameraScreen from '../pages/main/CameraScreen';
import PostScreen from '../pages/main/PostScreen';
import {NavigationProp} from '@react-navigation/native';
import CommentScreen from '../pages/main/CommentScreen';
import {IPost} from '../models/IPost';

export type MainStackParamList = {
  Home: undefined;
  Camera: undefined;
  Comment: {
    post: IPost;
  };
  Post: {
    imageUri: string;
  };
};

export type MainStackNavigation = NavigationProp<MainStackParamList>;

const Stack = createStackNavigator<MainStackParamList>();

const MainRoute = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={BottomTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Comment" component={CommentScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Post" component={PostScreen} />
    </Stack.Navigator>
  );
};

export default MainRoute;
