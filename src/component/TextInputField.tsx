import {View, Text, TextInput} from 'react-native';
import React, {memo} from 'react';

type TextInputFieldProps = {
  placeholeder: string;
  value: string;
  isSecure?: boolean;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

const TextInputField = (props: TextInputFieldProps) => {
  return (
    <TextInput
      placeholder={props.placeholeder}
      value={props.value}
      secureTextEntry={props.isSecure}
      onChangeText={newValue => props.setValue(newValue)}
      style={{
        width: '80%',
        borderWidth: 0.5,
        borderRadius: 8,
        margin: 8,
      }}
    />
  );
};

export default memo(TextInputField);
