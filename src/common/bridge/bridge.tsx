import bridge, { UserInfo, ReceiveDataMap } from "@vkontakte/vk-bridge";

const APP_ID = 7809644;
type VKWebAppGetAuthTokenData = {
  access_token: string;
  scope: string;
};

type VKWebAppCallAPIMethodData = {
  response: any;
};

type GetUsersByIdsData = UserInfo[];

class BridgeClient {
  accessToken: string = "";
  getUserInfo(): Promise<UserInfo> {
    return bridge.send("VKWebAppGetUserInfo");
  }
  getUserToken(): Promise<VKWebAppGetAuthTokenData> {
    return bridge.send("VKWebAppGetAuthToken", {
      app_id: APP_ID,
      scope: "friends",
    });
  }
  getApiRequestId(): string {
    return Date.now() + "_" + Math.random() * 1000;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  apiCall(
    methodName: string,
    params: Record<string, any>
  ): Promise<VKWebAppCallAPIMethodData> {
    return bridge.send("VKWebAppCallAPIMethod", {
      method: methodName,
      request_id: this.getApiRequestId(),
      params: {
        ...params,
        access_token: this.accessToken,
        v: "5.130",
      },
    });
  }

  getUsersByIds(ids: number[]): Promise<GetUsersByIdsData> {
    return this.apiCall("users.get", {
      user_ids: ids.join(","),
      fields: "photo_100,photo_200,sex",
    }).then((res) => {
      let users: UserInfo[] = [];
      res.response.forEach((itemUser: Record<any, any>) => {
        users.push({
          id: itemUser.id,
          first_name: itemUser.first_name,
          last_name: itemUser.last_name,
          sex: itemUser.sex,
          city: itemUser.city,
          photo_100: itemUser.photo_100,
          photo_200: itemUser.photo_200,
          country: itemUser.coutnry,
          timezone: itemUser.timezone,
        });
      });
      return users;
    });
  }
}

export const bridgeClient = new BridgeClient();
