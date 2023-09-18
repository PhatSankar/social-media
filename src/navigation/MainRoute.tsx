import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTab from './BottomTab';
import CameraScreen from '../pages/main/CameraScreen';
import PostScreen from '../pages/main/PostScreen';
import {NavigationProp} from '@react-navigation/native';

export type MainStackParamList = {
  Home: undefined;
  Camera: undefined;
  Post: {
    imageUri: string;
  };
};

export type StackNavigation = NavigationProp<MainStackParamList>;

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
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Post" component={PostScreen} />
    </Stack.Navigator>
  );
};

export default MainRoute;
