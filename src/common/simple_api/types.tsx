import { ISlaveData } from "../types/ISlaveData";

export type INullable<Value> = Value | null;
export interface IUserDataResponseDto {
  user: ISlaveData;
  slaves: ISlaveData[];
}
