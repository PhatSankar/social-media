import {io} from 'socket.io-client';
export const socket = io('http://10.0.2.2:8001' ?? '', {
  autoConnect: false,
});
