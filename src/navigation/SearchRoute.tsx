import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import {NavigationProp} from '@react-navigation/native';
import SearchScreen from '../pages/main/SearchScreen';
import {IUser} from '../models/IUser';
import ProfileScreen from '../pages/main/ProfileScreen';

export type SearchStackParamList = {
  Search: undefined;
  ProfileSearch: {
    user: IUser;
  };
};

export type SearchStackNavigation = NavigationProp<SearchStackParamList>;

const Stack = createStackNavigator<SearchStackParamList>();

export type StackSearchNavigation = StackNavigationProp<
  SearchStackParamList,
  'Search'
>;

const SearchRoute = () => {
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileSearch"
        component={ProfileScreen}
        options={({route}) => ({title: route.params.user.name})}
      />
    </Stack.Navigator>
  );
};

export default SearchRoute;
