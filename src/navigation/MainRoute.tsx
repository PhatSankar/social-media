import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTab from './BottomTab';
import CameraScreen from '../pages/main/CameraScreen';

export type MainStackParamList = {
  Home: undefined;
  Camera: undefined;
};

const Stack = createStackNavigator();

const MainRoute = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="BottomTab"
        component={BottomTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Camera" component={CameraScreen} />
    </Stack.Navigator>
  );
};

export default MainRoute;
