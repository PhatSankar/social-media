import {View, Text} from 'react-native';
import React, {useCallback, useRef} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainRoute';
import {JitsiMeeting} from '@jitsi/react-native-sdk';

const MeetingScreen = ({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'Meeting'>) => {
  const jitsiMeeting = useRef(null);
  return (
    <JitsiMeeting
      eventListeners={{
        onReadyToClose: () => {
          navigation.goBack();
          // @ts-ignore
          jitsiMeeting.current.close();
        },
      }}
      ref={jitsiMeeting}
      style={{flex: 1}}
      room={route.params.roomId}
      serverURL="http://10.0.2.2:8000"
      config={{
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: true,
        enableEmailInStats: false,
        prejoinPageEnabled: false,
      }}
    />
  );
};

export default MeetingScreen;
