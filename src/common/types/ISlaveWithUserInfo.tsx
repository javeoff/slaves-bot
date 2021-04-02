import { UserInfo } from "@vkontakte/vk-bridge";
import { ISlaveData } from "./ISlaveData";

export interface ISlaveWithUserInfo {
  slave_object: ISlaveData;
  user_info: UserInfo;
}
