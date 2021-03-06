import bridge, { UserInfo, ReceiveDataMap } from "@vkontakte/vk-bridge";

const APP_ID = 7809644;
const GROUP_ID = 203757860;
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
  handleTheme(): this {
    bridge.subscribe((event) => {
      if (event.detail && event.detail.type === "VKWebAppUpdateConfig") {
        document
          .getElementsByTagName("body")[0]
          ?.setAttribute("scheme", event.detail.data.scheme);
      }
    });
    return this;
  }

  getUserToken(): Promise<VKWebAppGetAuthTokenData> {
    return bridge.send("VKWebAppGetAuthToken", {
      app_id: APP_ID,
      scope: "friends",
    });
  }

  closeApp(): Promise<any> {
    return bridge.send("VKWebAppClose", {
      status: "success",
      payload: {},
    });
  }

  joinGroup(): Promise<any> {
    return bridge.send("VKWebAppJoinGroup", { group_id: GROUP_ID });
  }

  isSubscribed(): Promise<any> {
    return this.apiCall("groups.isMember", { group_id: GROUP_ID });
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

  copyToClipboard(text: string): Promise<any> {
    return bridge.send("VKWebAppCopyText", {
      text: text,
    });
  }

  opanShareDialog(link: string): Promise<any> {
    return bridge.send("VKWebAppShare", {
      link: link,
    });
  }

  getUserFriends(user_id: number, limit: number): Promise<UserInfo[]> {
    return this.apiCall("friends.get", {
      user_id,
      fields: "photo_100",
      count: limit,
    }).then((res) => {
      return res.response.items.map((friend: Record<any, any>) => {
        return {
          id: friend.id,
          first_name: friend.first_name,
          last_name: friend.last_name,
          photo_100: friend.photo_100,
        };
      });
    });
  }

  getAllFriends(user_id: number): Promise<UserInfo[]> {
    return this.apiCall("friends.get", {
      user_id,
      fields: "photo_100",
    }).then((res) => {
      return res.response.items.map((friend: Record<any, any>) => {
        return {
          id: friend.id,
          first_name: friend.first_name,
          last_name: friend.last_name,
          photo_100: friend.photo_100,
        };
      });
    });
  }

  searchUserFriends(q: string): Promise<UserInfo[]> {
    return this.apiCall("friends.search", {
      q,
      fields: "photo_100",
      count: 100,
    }).then((res) => {
      return res.response.items.map((friend: Record<any, any>) => {
        return {
          id: friend.id,
          first_name: friend.first_name,
          last_name: friend.last_name,
          photo_100: friend.photo_100,
        };
      });
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

  init(): this {
    bridge.send("VKWebAppInit");
    return this;
  }
}

export const bridgeClient = new BridgeClient().handleTheme().init();
