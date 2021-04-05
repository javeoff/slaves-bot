import { UserInfo } from "@vkontakte/vk-bridge";
import { ISlaveData } from "./types/ISlaveData";

export const DefaultUserInfo: UserInfo = {
  id: 0,
  first_name: "DELETED",
  last_name: "",
  country: {
    id: 0,
    title: "",
  },
  city: {
    id: 0,
    title: "",
  },
  sex: 0,
  photo_100: "https://vk.com/images/deactivated_100.png",
  photo_200: "https://vk.com/images/deactivated_200.png",
  timezone: 0,
};

export const DefaultSlave: ISlaveData = {
  id: 0,
  profit_per_min: 0,
  job: {
    name: "",
  },
  master_id: 0,
  fetter_to: 0,
  fetter_price: 0,
  sale_price: 0,
  price: 0,
  slaves_count: 0,
  slaves_profit_per_min: 0,
  balance: 0,
  last_time_update: 0,
};
