import { GatewayException } from '../error';
import { Socket } from 'socket.io';

export function gatewayWrapper(socket: Socket, cb: Function) {
  return async (input: any) => {
    try {
      await cb(socket, input);
    } catch (error) {
      console.log(error);

      if (error instanceof GatewayException) {
        socket.emit('error', { status: 'faild', value: error.message });
      } else {
        socket.emit('error', { status: 'faild', value: 'somethign went wrong!' });
      }
    }
  };
}
