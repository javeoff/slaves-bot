import axios, { AxiosRequestConfig } from "axios";
import {
  GetLSavesResponse,
  IUserActionResponseDto,
  IUserDataResponseDto,
} from "./types";

const API_ENDPOINT = "https://peostore.mydzin.ru/api";

class SimpleApi {
  endPoint: string;
  authorizationToken: string;

  constructor(endPoint: string = API_ENDPOINT, authToken: string = "") {
    this.endPoint = endPoint;
    this.authorizationToken = authToken;
  }

  callApi<T>(methodName: string, options: AxiosRequestConfig): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      axios(this.endPoint + "/" + methodName, {
        ...options,
        headers: {
          Authorization: this.authorizationToken,
          ...options.headers,
        },
      })
        .then((res) => {
          let bodyData: any = res;
          try {
            if (bodyData.data.payload) {
              resolve(bodyData.data.payload);
            } else {
              reject(new Error(bodyData.data.error_message));
            }
          } catch (e) {
            reject(e);
          }
        })
        .catch(reject);
    });
  }

  startApp(refId: number): Promise<IUserDataResponseDto> {
    return this.callApi<IUserDataResponseDto>("start", {
      params: {
        id: refId,
      },
    });
  }

  getUser(userId: number): Promise<IUserDataResponseDto> {
    return this.callApi<IUserDataResponseDto>("user", {
      params: {
        id: userId,
      },
    });
  }

  buySlave(slaveId: number): Promise<IUserActionResponseDto> {
    return this.callApi<IUserActionResponseDto>("buySlave", {
      params: {
        slave_id: slaveId,
      },
    });
  }

  fetterSlave(slaveId: number): Promise<IUserActionResponseDto> {
    return this.callApi<IUserActionResponseDto>("fetterSlave", {
      params: {
        slave_id: slaveId,
      },
    });
  }

  sellSlave(slaveId: number): Promise<IUserActionResponseDto> {
    return this.callApi<IUserActionResponseDto>("sellSlave", {
      params: {
        slave_id: slaveId,
      },
    });
  }

  jobSlave(slaveId: number, jobName: string): Promise<IUserActionResponseDto> {
    return this.callApi<IUserActionResponseDto>("jobSlave", {
      params: {
        slave_id: slaveId,
        job_name: jobName,
      },
    });
  }

  getSlaves(slaveIds: number[]): Promise<GetLSavesResponse> {
    return this.callApi<GetLSavesResponse>("getSlaves", {
      method: "POST",
      headers: {
        "content-type": "applications/json",
      },
      data: JSON.stringify({
        slave_ids: slaveIds.slice(0, 250),
      }),
    });
  }

  getTopUsers(): Promise<GetLSavesResponse> {
    return this.callApi<GetLSavesResponse>("getTopUsers", {});
  }
}

export const simpleApi = new SimpleApi(
  API_ENDPOINT,
  document.location.search.replace("?", "")
);
