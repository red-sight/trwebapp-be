import { WebAppChat } from './WebAppChat.interface';
import { WebAppUser } from './WebAppUser.interface';

export interface WebAppInitData {
  query_id: string;
  user: Partial<WebAppUser>;
  receiver: Partial<WebAppUser>;
  chat: Partial<WebAppChat>;
  chat_type: string;
  chat_instance: string;
  start_param: string;
  can_send_after: number;
  auth_date: number;
  hash: string;
}
