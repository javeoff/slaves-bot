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
