import { UserInfo } from "@vkontakte/vk-bridge";
import { ISlaveData } from "./ISlaveData";

export interface IUserData {
  id: number, 
  slaveIds: number[],
}