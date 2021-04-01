import { UserInfo } from "@vkontakte/vk-bridge";
import { ISlaveData } from "./ISlaveData";

export interface IUserData {
  info: UserInfo,
  slave_oject: ISlaveData,
  slaves_list: ISlaveData[], 
}