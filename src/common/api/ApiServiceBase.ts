import Axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { AnyObject } from 'immer/dist/types/types-internal';

import { ApiResponse } from './ApiResponse';
import { ApiErrorDto } from './ApiErrorDto';
import { IBasePayload } from './types/IBasePayload';
import { isAxiosError } from './typeGuards/isAxiosError';

export abstract class ApiServiceBase {
  private readonly axios: AxiosInstance;

  protected constructor(isSimplifiedBaseUrl?: boolean) {
    const baseUrlPrefix = isSimplifiedBaseUrl ? '' : '/reactApi';

    this.axios = Axios.create({
      baseURL: `${baseUrlPrefix}/`,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
  }

  protected get<Payload extends IBasePayload>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<Payload>> {
    return ApiServiceBase.response<Payload>(this.axios.get(url, config));
  }

  protected post<
    Request extends AnyObject | string,
    Payload extends IBasePayload
  >(
    url: string,
    data?: Request,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<Payload>> {
    return ApiServiceBase.response<Payload>(this.axios.post(url, data, config));
  }

  protected put<Request extends AnyObject, Payload extends IBasePayload>(
    url: string,
    data?: Request,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<Payload>> {
    return ApiServiceBase.response<Payload>(this.axios.put(url, data, config));
  }

  protected patch<Request extends AnyObject, Payload extends IBasePayload>(
    url: string,
    data?: Request,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<Payload>> {
    return ApiServiceBase.response<Payload>(
      this.axios.patch(url, data, config),
    );
  }

  protected delete<Payload extends IBasePayload>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<Payload>> {
    return ApiServiceBase.response<Payload>(this.axios.delete(url, config));
  }

  private static response<Payload extends IBasePayload>(
    promise: AxiosPromise,
  ): Promise<ApiResponse<Payload>> {
    return ApiServiceBase.createResponseFromAxios<Payload>(promise);
  }

  private static isApiResponseType<Payload extends IBasePayload>(
    response: AnyObject,
  ): response is ApiResponse<Payload> {
    return (
      response &&
      Number.isInteger(response.code) &&
      typeof response.message === 'string' &&
      (typeof response.payload === 'object' ||
        Array.isArray(response.payload)) &&
      (response.location === undefined || typeof response.location === 'string')
    );
  }

  private static transformResponse<Payload extends IBasePayload>(
    response: AxiosResponse,
  ): ApiResponse<Payload> | never {
    const { data } = response;

    if (ApiServiceBase.isApiResponseType<Payload>(data)) {
      return new ApiResponse<Payload>(data);
    }

    throw new TypeError(
      `There is wrong response format: ${JSON.stringify(data)}`,
    );
  }

  private static async createResponseFromAxios<Payload extends IBasePayload>(
    promise: AxiosPromise,
  ): Promise<ApiResponse<Payload>> {
    try {
      const response = await promise;

      return ApiServiceBase.transformResponse(response);

      /**
       * [INFO][API_ERRORS]
       * Здесь перехватываются только два типа ошибок
       *  - ошибки (AxiosError), при запросах выполненных с ошибкой (e.g. HTTP_CODE 404, 500 etc.)
       *  - ошибка (TypeError) неправильного формата из transformResponse, при запросе без ошибки (e.g. HTTP_CODE 200, 201 etc.)
       */
    } catch (error) {
      if (isAxiosError(error)) {
        const { response } = error;

        if (!response) {
          throw new TypeError(
            `There is no response in axios error: ${JSON.stringify(error)}`,
          );
        }

        /**
         * [INFO][API_ERRORS]
         * Здесь возможны два варианта
         *  - если в ответе в AxiosError лежит payload с правильным форматом, то выбросится instance ApiErrorDto
         *  - иначе выброситься TypeError с сообщением о неправильном формате
         */
        throw new ApiErrorDto(ApiServiceBase.transformResponse(response));
      }

      /**
       * [INFO][API_ERRORS]
       * Сюда попадает только ошибка (TypeError) неправильного формата ответа, при запросе без ошибки
       */
      throw error;
    }
  }
}
