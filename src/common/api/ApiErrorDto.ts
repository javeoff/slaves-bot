import { ApiResponse } from './ApiResponse';
import { IBasePayload } from './types/IBasePayload';

export class ApiErrorDto<Payload extends IBasePayload> extends Error {
  public response?: ApiResponse<Payload>;

  public constructor(response?: ApiResponse<Payload>, message?: string) {
    super(message);

    this.response = response;
  }
}
