import { ApiResponse } from '../../ApiResponse';
import { ApiServiceBase } from '../../ApiServiceBase';
import { IUserDataResponseDto } from '../../dto/features/UserData/response/IUserDataResponseDto';
class ApiUserData extends ApiServiceBase {
  public constructor() {
    super();
  }

  public getData(): Promise<ApiResponse<IUserDataResponseDto>> {
    return this.get('/user/');
  }
}

export const apiUserData = new ApiUserData();
