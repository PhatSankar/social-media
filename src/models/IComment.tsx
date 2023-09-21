import {IUser} from './IUser';

export interface IComment {
  id: string;
  created_at: string;
  user_id: string;
  post_id: string;
  text: string;
  users: IUser;
}
