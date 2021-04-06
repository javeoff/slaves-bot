import { ISlaveData } from "../types/ISlaveData";

export type INullable<Value> = Value | null;
export interface IUserDataResponseDto {
  user: ISlaveData;
  slaves: ISlaveData[];
  is_new_user: boolean;
}
export interface IUserActionResponseDto {
  user: ISlaveData;
  slave: ISlaveData;
}

export type GetLSavesResponse = ISlaveData[];
