import { IBasePayload } from './types/IBasePayload';

export interface IData<Payload extends IBasePayload> {
  code: number;
  payload: Payload;
  message: string;
  location?: string;
}

export class ApiResponse<Payload extends IBasePayload> {
  public code: number;

  public payload: Payload;

  public message: string;

  public location?: string;

  public constructor(data: IData<Payload>) {
    this.code = data.code;
    this.payload = data.payload;
    this.message = data.message;
    this.location = data.location;
  }
}
