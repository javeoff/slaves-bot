import React, { FC, useEffect, useState } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import {
  Avatar,
  Button,
  Caption,
  Card,
  CardGrid,
  Div,
  FixedLayout,
  Group,
  Header,
  MiniInfoCell,
  PanelHeaderClose,
  PanelSpinner,
  Title,
} from "@vkontakte/vkui";
import {
  Icon16Add,
  Icon20BugOutline,
  Icon20CommunityName,
  Icon20FreezeOutline,
  Icon20LockOutline,
  Icon20MoneyCircleOutline,
  Icon20PlayCircleFillSteelGray,
  Icon20StatisticCircleFillBlue,
  Icon20VotestTransferCircleFillTurquoise,
  Icon28LockOpenOutline,
  Icon28LockOutline,
  Icon28MarketOutline,
  Icon28MoneyCircleOutline,
  Icon28RoubleCircleFillBlue,
} from "@vkontakte/icons";
import { UserHeader } from "../components/UserHeader/UserHeader";
import { useParams, useRouter } from "@happysanta/router";
import { SlavesList } from "../components/SlavesList/SlavesList";
import { IWithUserInfo, withUserInfo } from "../features/App/hocs/withAppState";
import { UserInfo } from "@vkontakte/vk-bridge";
import { DefaultSlave, DefaultUserInfo } from "../common/defaults";
import { number } from "prop-types";
import { ISlaveData } from "../common/types/ISlaveData";
import { ISlaveWithUserInfo } from "../common/types/ISlaveWithUserInfo";

interface IProps extends IWithUserInfo {
  id?: string;
}

const kirill = {
  id: 2,
  first_name: "Кирилл",
  last_name: "Новак",
  photo_200:
    "https://sun9-53.userapi.com/s/v1/ig2/7TOOR_yziUBmT31673uENDtn-39pTbQt1b28QA1hai3aWfJYE499q3MxFHt2YQljJ_5Q2rLbCjwXpT9E6UoP9Tno.jpg?size=200x0&quality=96&crop=0,0,1024,1024&ava=1",
  slave_object: {
    id: 1,
    profit_per_min: 10,
    job: {
      name: "Блогер",
    },
    master_id: 0,
    fetter_to: 1617308426028,
    fetter_price: 0,
    sale_price: 0,
    price: 50,
    slaves_count: 10000,
    slaves_profit_per_min: 2 ** 32,
    balance: 2 ** 32,
    lst_time_update: 0,
  },
};

const user = {
  user_info: {
    id: 1,
    first_name: "Даниил",
    last_name: "Джейв",
    photo_200:
      "https://sun9-57.userapi.com/s/v1/ig2/CEsb2eYW3D2-jZhBJ2GLXj484UYpSC50pCCgG4gqNZBR0WTOBQhlHq21-S-WxuFV7OH2lENOzWFAv3Tdo3-oLQ6b.jpg?size=50x0&quality=96&crop=126,124,748,748&ava=1",
    photo_100:
      "https://sun9-57.userapi.com/s/v1/ig2/CEsb2eYW3D2-jZhBJ2GLXj484UYpSC50pCCgG4gqNZBR0WTOBQhlHq21-S-WxuFV7OH2lENOzWFAv3Tdo3-oLQ6b.jpg?size=50x0&quality=96&crop=126,124,748,748&ava=1",
    sex: 1,
    country: 0,
    city: 0,
    timezone: 0,
  },
  slave_object: {
    id: 1,
    profit_per_min: 1000,
    job: {
      name: "Уборщик",
    },
    master_id: 0,
    fetter_to: 0,
    fetter_price: 0,
    sale_price: 0,
    price: 50,
    slaves_count: 10000,
    slaves_profit_per_min: 2 ** 32,
    balance: 2 ** 32,
    lst_time_update: 0,
  },
  slaves_list: [kirill, kirill, kirill, kirill, kirill, kirill],
};

const User: FC<IProps> = ({ id, usersInfo, slaves }) => {
  let router = useRouter();
  let { id: userId } = useParams();

  let [loading, setLoading] = useState<boolean>(true);

  let [userInfo, setUserInfo] = useState<UserInfo>(DefaultUserInfo);
  let [slave, setSlave] = useState<ISlaveData>(DefaultSlave);
  let [userSlaves, setSlaves] = useState<ISlaveWithUserInfo[]>([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      // TODO: Загрузить юзера из API + его рабов
      if (usersInfo[Number(userId)]) {
        setUserInfo(usersInfo[Number(userId)]);
      }
      if (slaves[Number(userId)]) {
        setSlave(slaves[Number(userId)]);
      }
      if (slave.id && userInfo.id && userSlaves.length) {
        setLoading(false);
      }
    };
    void fetchUserInfo();
  });

  return (
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderClose onClick={() => router.popPage()} />}
      ></PanelHeader>
      {loading && <PanelSpinner size="large" style={{ marginTop: 128 }} />}
      {!loading && (
        <UserHeader user={userInfo} slave={slave} isMe={false}></UserHeader>
      )}
      {!loading && (
        <SlavesList slavesCount={0} slaves={userSlaves}></SlavesList>
      )}
      {!loading && (
        <FixedLayout vertical="bottom">
          <Div style={{ paddingBottom: 0 }}>
            <Button
              style={{ marginBottom: 8, width: "100%" }}
              before={<Icon28MarketOutline />}
              size="l"
              mode="commerce"
            >
              Купить за {user.slave_object.price} ₽
            </Button>
            <Button
              style={{
                marginBottom: 8,
                width: "100%",
                opacity: 1,
              }}
              before={<Icon28MoneyCircleOutline width={28} height={28} />}
              size="l"
            >
              Продать за {user.slave_object.sale_price} ₽
            </Button>
            <Button
              style={{ marginBottom: 8, width: "100%" }}
              before={<Icon20FreezeOutline width={28} height={28} />}
              size="l"
            >
              Надеть наручники за {user.slave_object.fetter_price} ₽
            </Button>
          </Div>
        </FixedLayout>
      )}
    </Panel>
  );
};

export default withUserInfo(User);
