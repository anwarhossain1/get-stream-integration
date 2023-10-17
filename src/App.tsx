import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
} from '@stream-io/video-react-sdk';
import {
  ParticipantView,
  StreamVideoParticipant,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import './style.css';
const apiKey = 'mmhfdzb5evj2'; // the API key can be found in the "Credentials" section
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiQmlnZ3NfRGFya2xpZ2h0ZXIiLCJpc3MiOiJwcm9udG8iLCJzdWIiOiJ1c2VyL0JpZ2dzX0RhcmtsaWdodGVyIiwiaWF0IjoxNjk3NTIzMzM2LCJleHAiOjE2OTgxMjgxNDF9.31C37NGsAOZr-WgNuadlDeJXN1plMxrOslEJyMP19v8'; // the token can be found in the "Credentials" section
const userId = 'Biggs_Darklighter'; // the user id can be found in the "Credentials" section
const callId = 'vS66SdxQXGUT'; // the call id can be found in the "Credentials" section

// set up the user object
const user: User = {
  id: userId,
  name: 'Anwar',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};
const client = new StreamVideoClient({ apiKey, user, token });
// const call = client.call('default', callId);
// call.join({ create: true });

function App() {
  const [call, setCall] = useState<Call>();
  useEffect(() => {
    const myCall = client.call('default', callId);
    myCall.join({ create: true }).catch((err) => {
      console.error(`Failed to join the call`, err);
    });

    setCall(myCall);

    return () => {
      setCall(undefined);
      myCall.leave().catch((err) => {
        console.error(`Failed to leave the call`, err);
      });
    };
  }, []);

  if (!call) return null;

  return (
    <StreamVideo client={client}>
      
    <StreamCall call={call}>
      <MyUILayout />
    </StreamCall>
  </StreamVideo>
  )
}

export const MyUILayout = () => {
  const {
    useCallCallingState,
    useLocalParticipant,
    useRemoteParticipants,
    // ... other hooks
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }


  return (
    <StreamTheme>
       <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
     <MyParticipantList participants={remoteParticipants} />
      {/* <MyFloatingLocalParticipant participant={localParticipant} /> */}
    </StreamTheme>
  );
};

export const MyParticipantList = (props: {
  participants: StreamVideoParticipant[];
}) => {
  const { participants } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      {participants.map((participant) => (
        <ParticipantView
          participant={participant}
          key={participant.sessionId}
        />
      ))}
    </div>
  );
};

export const MyFloatingLocalParticipant = (props: {
  participant?: StreamVideoParticipant;
}) => {
  const { participant } = props;
  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        width: '240px',
        height: '135px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
        borderRadius: '12px',
      }}
    >
      <ParticipantView participant={participant} />
    </div>
  );
};

export default App
