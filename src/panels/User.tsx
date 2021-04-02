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
import {
  PAGE_MAIN,
  useLocation,
  useParams,
  useRouter,
} from "@happysanta/router";
import { SlavesList } from "../components/SlavesList/SlavesList";
import { IWithUserInfo, withUserInfo } from "../features/App/hocs/withAppState";
import { UserInfo } from "@vkontakte/vk-bridge";
import { DefaultSlave, DefaultUserInfo } from "../common/defaults";
import { number } from "prop-types";
import { ISlaveData } from "../common/types/ISlaveData";
import { ISlaveWithUserInfo } from "../common/types/ISlaveWithUserInfo";
import { simpleApi } from "../common/simple_api/simpleApi";
import { bridgeClient } from "../common/bridge/bridge";
import { IUserDataResponseDto } from "../common/simple_api/types";
import { MODAL_ERROR_CARD } from "../modals/Error";
import { getSubDate } from "../common/helpers";

interface IProps extends IWithUserInfo {
  id?: string;
  key: string;
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

const User: FC<IProps> = ({
  id: panelId,
  usersInfo,
  slaves,
  updateSlave,
  updateSlaves,
  updateUsersInfo,
  currentUserInfo,
  key,
}) => {
  let router = useRouter();
  let location = useLocation();

  let { id } = useParams();
  let userId = Number(id);

  let [loading, setLoading] = useState<boolean>(true);

  let [userInfo, setUserInfo] = useState<UserInfo>(DefaultUserInfo);
  let [masterInfo, setMasterInfo] = useState<UserInfo>(DefaultUserInfo);
  let [slave, setSlave] = useState<ISlaveData>(DefaultSlave);
  let [userSlaves, setSlaves] = useState<ISlaveWithUserInfo[]>([]);
  let [loadedMaster, setLoadedMaster] = useState<boolean>(false);
  let [loadedUserPage, setUserPage] = useState<
    IUserDataResponseDto | undefined
  >();

  let gotUser = false;
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!loadedMaster && loadedUserPage) {
        // Загружаем инфу о владельце
        if (slave.master_id != 0) {
          if (usersInfo[slave.master_id]) {
            // Берем из кеша
            setMasterInfo(usersInfo[slave.master_id]);
          } else {
            let updatedMasterInfo = await bridgeClient.getUsersByIds([
              slave.master_id,
              -1,
            ]);
            setMasterInfo(updatedMasterInfo[0]);
          }
          setLoadedMaster(true);
        }
      }

      if (!loadedUserPage) {
        let userPage: IUserDataResponseDto = {
          user: DefaultSlave,
          slaves: [],
        };

        if (slaves[userId]) {
          userPage.user = slaves[userId];
          for (let slaveId in slaves) {
            if (slaves[slaveId].master_id === userId && slaves[slaveId]) {
              userPage.slaves.push(slaves[slaveId]);
            }
          }
        } else {
          userPage = await simpleApi.getUser(userId);
          updateSlaves(userPage.slaves);
          updateSlave(userPage.user);
        }

        setUserPage(userPage);

        if (!gotUser) {
          let slavesUsersInfo: UserInfo[] = [];
          let slaveIds: Record<number, ISlaveData> = {};

          userPage.slaves.forEach((slave) => {
            if (usersInfo[slave.id]) {
              slavesUsersInfo.push(usersInfo[slave.id]);
              slaveIds[slave.id] = slaves[slave.id];
            } else {
              slaveIds[slave.id] = slave;
            }
          });

          if (Object.keys(slaveIds).length) {
            let dataSlavesUsersInfo = await bridgeClient.getUsersByIds(
              Object.keys(slaveIds).map((a) => Number(a))
            );
            slavesUsersInfo = dataSlavesUsersInfo.concat(slavesUsersInfo);
          }

          let updatedUserInfo: UserInfo;

          if (usersInfo[userId]) {
            updatedUserInfo = usersInfo[userId];
          } else {
            let updatedDataUserInfo = await bridgeClient.getUsersByIds([
              userId,
              -1,
            ]);
            updatedUserInfo = updatedDataUserInfo[0];
            updateUsersInfo([updatedUserInfo]);
          }

          let slavesList: ISlaveWithUserInfo[] = [];
          slavesUsersInfo.forEach((user) => {
            slavesList.push({
              user_info: user,
              slave_object: slaveIds[user.id],
            });
          });

          setSlaves(slavesList);
          setSlave(userPage.user);
          setUserInfo(updatedUserInfo);
          updateUsersInfo(slavesUsersInfo);

          gotUser = true;
        }
      }

      if (usersInfo[userId]) {
        setUserInfo(usersInfo[userId]);
      }

      if (slaves[userId]) {
        setSlave(slaves[userId]);
      }
      if (slave.id && userInfo.id && loadedUserPage) {
        setLoading(false);
      }
    };
    void fetchUserInfo();
  });

  const buySlave = () => {
    simpleApi
      .buySlave(slave.id)
      .then((res) => {
        updateSlaves([res.user, res.slave]);
        setLoadedMaster(false);
        setSlave(res.slave);
      })
      .catch((e) => {
        router.pushModal(MODAL_ERROR_CARD, {
          message: e.message,
        });
      });
  };

  const fetterSlave = () => {
    simpleApi
      .fetterSlave(slave.id)
      .then((res) => {
        updateSlaves([res.user, res.slave]);
        setLoadedMaster(false);
        setSlave(res.slave);
      })
      .catch((e) => {
        router.pushModal(MODAL_ERROR_CARD, {
          message: e.message,
        });
      });
  };

  const sellSlave = () => {
    simpleApi
      .sellSlave(slave.id)
      .then((res) => {
        updateSlaves([res.user, res.slave]);
        setLoadedMaster(false);
        setSlave(res.slave);
      })
      .catch((e) => {
        router.pushModal(MODAL_ERROR_CARD, {
          message: e.message,
        });
      });
  };
  return (
    <Panel key={key} id={panelId}>
      <PanelHeader
        left={
          <PanelHeaderClose
            onClick={() => {
              if (location.isFirstPage()) {
                router.replacePage(PAGE_MAIN);
              } else {
                router.popPage();
              }
            }}
          />
        }
      ></PanelHeader>
      {loading && <PanelSpinner size="large" style={{ marginTop: 128 }} />}
      {!loading && (
        <UserHeader
          user={userInfo}
          master={masterInfo}
          slave={slave}
          isMe={false}
          onBuySelf={buySlave}
        ></UserHeader>
      )}
      {!loading && (
        <div style={{ marginBottom: 128 }}>
          <SlavesList
            isMe={slave.id === currentUserInfo.id}
            slavesCount={0}
            slaves={userSlaves}
          ></SlavesList>
        </div>
      )}
      {!loading && (
        <FixedLayout vertical="bottom">
          <Div style={{ paddingBottom: 0 }}>
            {slave.fetter_to >= Date.now() / 1000 && (
              <Div
                style={{
                  marginBottom: 8,
                  width: "100%",
                  opacity: 1,
                  color: "red",
                  textAlign: "center",
                }}
                onClick={sellSlave}
              >
                В цепях будет еще {getSubDate(new Date(slave.fetter_to * 1000))}
              </Div>
            )}
            {currentUserInfo.id !== slave.master_id && (
              <Button
                style={{ marginBottom: 8, width: "100%" }}
                before={<Icon28MarketOutline />}
                size="l"
                mode="commerce"
                onClick={buySlave}
              >
                Купить за {slave.price} ₽
              </Button>
            )}
            {currentUserInfo.id === slave.master_id && (
              <Button
                style={{
                  marginBottom: 8,
                  width: "100%",
                  opacity: 1,
                }}
                before={<Icon28MoneyCircleOutline width={28} height={28} />}
                size="l"
                onClick={sellSlave}
              >
                Продать за {slave.sale_price} ₽
              </Button>
            )}
            {currentUserInfo.id === slave.master_id &&
              slave.fetter_to <= Date.now() / 1000 && (
                <Button
                  style={{ marginBottom: 8, width: "100%" }}
                  before={<Icon20FreezeOutline width={28} height={28} />}
                  size="l"
                  onClick={fetterSlave}
                >
                  Надеть цепи за {slave.fetter_price} ₽
                </Button>
              )}
          </Div>
        </FixedLayout>
      )}
    </Panel>
  );
};

export default withUserInfo(User);
