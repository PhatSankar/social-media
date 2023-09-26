import {IUser} from './IUser';

export interface IPost {
  id: string;
  created_at: string;
  user_id: string;
  caption: string;
  image_url: string;
  users?: IUser;
  likes_count: number;
}
