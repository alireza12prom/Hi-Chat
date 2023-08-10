import { Socket } from 'socket.io';
import { Schema } from 'joi';

type Callback = (socket: Socket, arg: any) => Promise<void>;
export function validateSocketBody(socket: Socket, joiSchema: Schema, cb: Callback) {
  return async (arg: any) => {
    const { error, value } = joiSchema.validate(arg);
    if (error) {
      socket.emit('error', { msg: error.details[0].message });
    } else {
      await cb(socket, value);
    }
  };
}
