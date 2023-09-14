import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import TextInputField from '../../component/TextInputField';
import {StackNavigation} from './LoginScreen';
import {useMutation} from 'react-query';
import AuthService from '../../api/AuthService';
import supabase from '../../supabase/supabaseClient';
import {AuthContext} from '../../context/AuthContext';

const SignUpScreen = () => {
  const navigation = useNavigation<StackNavigation>();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const {setUser} = useContext(AuthContext);

  const signUpMutation = useMutation({
    mutationFn: AuthService.signUp,
    onSuccess: async dataSignIn => {
      if (dataSignIn) {
        setUser(dataSignIn.user);
      }
    },
    onError: error => {
      setError('' + error);
    },
  });

  const handleSubmit = () => {
    setError('');
    if (name.length > 0) {
      signUpMutation.mutate({email, password, name});
    } else {
      setError('Name not null');
    }
  };

  return (
    <View style={{...styles.container}}>
      <Text style={styles.introText}>Social Media</Text>
      <TextInputField placeholeder="Email" value={email} setValue={setEmail} />
      <TextInputField placeholeder="Name" value={name} setValue={setName} />
      <TextInputField
        placeholeder="Password"
        value={password}
        setValue={setPassword}
        isSecure={true}
      />
      {error.length > 0 ? <Text style={{color: 'red'}}>{error}</Text> : <></>}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.textButton}>Sign up</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', marginTop: 16}}>
        <Text style={{...styles.textSignUp, color: 'black'}}>
          Have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={{
              ...styles.textSignUp,
              color: 'rgb(0, 149, 246)',
            }}>
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpScreen;

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
    color: 'black',
    marginBottom: 32,
  },
  button: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgb(0, 149, 246)',
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
