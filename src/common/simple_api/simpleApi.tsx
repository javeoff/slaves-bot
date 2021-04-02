import axios, { AxiosRequestConfig } from "axios";
import { IUserDataResponseDto } from "./types";

const API_ENDPOINT = "https://mydzin.ru/api";

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
}

export const simpleApi = new SimpleApi(
  API_ENDPOINT,
  document.location.search.replace("?", "")
);
