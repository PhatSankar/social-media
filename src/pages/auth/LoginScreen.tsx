import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/RootRoute';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import TextInputField from '../../component/TextInputField';
import supabase from '../../supabase/supabaseClient';
import {useMutation} from 'react-query';
import AuthService from '../../api/AuthService';
import {AuthContext} from '../../context/AuthContext';

type StackNavigation = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const {setUser} = useContext(AuthContext);

  const signInMutatuon = useMutation({
    mutationFn: AuthService.signIn,
    onSuccess: data => {
      setUser(data.user);
    },
    onError: error => {
      setError('Wrong email or password');
    },
  });

  const handleSignIn = () => {
    setError('');
    signInMutatuon.mutate({email, password});
  };

  return (
    <View style={{...styles.container}}>
      <Text style={styles.introText}>Social Media</Text>
      <TextInputField placeholeder="Email" value={email} setValue={setEmail} />
      <TextInputField
        placeholeder="Password"
        value={password}
        setValue={setPassword}
        isSecure={true}
      />

      {error.length > 0 ? <Text style={{color: 'red'}}>{error}</Text> : <></>}

      <TouchableOpacity
        style={{
          ...styles.button,

          backgroundColor: signInMutatuon.isLoading
            ? 'gray'
            : 'rgb(0, 149, 246)',
        }}
        onPress={signInMutatuon.isLoading ? undefined : handleSignIn}>
        <Text style={styles.textButton}>Login</Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', marginTop: 16}}>
        <Text style={{...styles.textSignUp, color: 'black'}}>
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text
            style={{
              ...styles.textSignUp,
              color: 'rgb(0, 149, 246)',
            }}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  introText: {
    fontSize: wp(10),
    marginBottom: 32,
    color: 'black',
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
  textSignUp: {
    fontSize: hp(2),
  },
});
