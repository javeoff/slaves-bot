import { INullable } from '../../../../types/utils/INullable';
import { ISlaveData } from '../../../../../types/ISlaveData';

export interface IUserDataResponseDto {
  user: INullable<string>;
  slaves: INullable<ISlaveData[]>;
}
