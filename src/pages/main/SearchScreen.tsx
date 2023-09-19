import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {useMutation} from 'react-query';
import UserService from '../../api/UserService';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack/lib/typescript/src/types';
import {SearchStackParamList} from '../../navigation/SearchRoute';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProfileTile from '../../component/ProfileTile';

type StackNavigation = StackNavigationProp<SearchStackParamList, 'Search'>;

const SearchScreen = () => {
  const [search, setSearch] = useState('');
  const createFetchUser = useMutation({
    mutationFn: UserService.fetchUserByName,
    onSuccess: data => {
      //   console.log(data);
    },
  });
  const navigation = useNavigation<StackNavigation>();

  useEffect(() => {
    createFetchUser.mutate({
      search: search,
    });
  }, [search]);
  return (
    <View
      style={{
        flex: 1,
        padding: 8,
      }}>
      <View
        style={{
          borderWidth: 0.5,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 4,
          borderRadius: 12,
        }}>
        <MaterialCommunityIcons name="magnify" size={wp(7)} color={'grey'} />
        <TextInput
          placeholder="Type here"
          onChangeText={text => setSearch(text)}
          style={{
            flex: 1,
            fontSize: wp(5),
          }}
        />
      </View>
      <FlatList
        data={createFetchUser.data}
        keyExtractor={item => item.id}
        renderItem={item => {
          return <ProfileTile user={item.item} />;
        }}
      />
    </View>
  );
};

export default SearchScreen;
