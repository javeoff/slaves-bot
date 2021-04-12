import React, { FC, useEffect, useState } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import {
  Avatar,
  Button,
  Card,
  Div,
  FixedLayout,
  Group,
  Header,
  HorizontalCell,
  HorizontalScroll,
  PanelHeaderBack,
  PanelSpinner,
  Placeholder,
  PullToRefresh,
  SizeType,
} from "@vkontakte/vkui";
import {
  Icon20FreezeOutline,
  Icon28MarketOutline,
  Icon28MoneyCircleOutline,
  Icon56GhostOutline,
} from "@vkontakte/icons";

import { UserHeader } from "../components/UserHeader/UserHeader";
import { SlavesList } from "../components/SlavesList/SlavesList";
import { IWithUserInfo, withUserInfo } from "../features/App/hocs/withAppState";
import { UserInfo } from "@vkontakte/vk-bridge";
import { DefaultSlave, DefaultUserInfo } from "../common/defaults";
import { ISlaveData } from "../common/types/ISlaveData";
import { ISlaveWithUserInfo } from "../common/types/ISlaveWithUserInfo";
import { API_ENDPOINT, simpleApi } from "../common/simple_api/simpleApi";
import { bridgeClient } from "../common/bridge/bridge";
import { IUserActionResponseDto } from "../common/simple_api/types";
import { beautyNumber, getSubDate, shuffle } from "../common/helpers";
import { openErrorModal } from "../modals/openers";
import { Router } from "../common/custom-router";
import { PAGE_MAIN } from "@happysanta/router";

interface IProps extends IWithUserInfo {
  id?: string;
  key: string;
  pageOpened: string;
  router: Router;
  routerType: string;
}

const User: FC<IProps> = ({
  id: panelId,
  usersInfo,
  currentUserInfo,
  pageOpened,
  slaves,
  key,
  router,
  loadedUsers,
  updateSlaves,
  updateUsersInfo,
  updateUserInfo,
  setUserLoaded,
  updateFriendsIds,
  friendsIds,
}) => {
  let params = router.getParams();
  let userId = Number(params.id);
  let imagePath = atob(
    "aHR0cHM6Ly9wZW9zdG9yZS5teWR6aW4ucnUvYXBwaWNvbi5pY28/dmVyc2lvbj0="
  );

  console.log("Render user profile page", Date.now(), params, slaves[userId]);

  let gotUserInfo = DefaultUserInfo;
  let gotSlave = DefaultSlave;
  let defaultUserSlaves: ISlaveWithUserInfo[] = [];

  let defaultLoading = true;
  if (usersInfo[userId] && slaves[userId]) {
    gotUserInfo = usersInfo[userId];
    gotSlave = slaves[userId];
    defaultLoading = false;
  }

  console.log("RELOADED FRIENDS");

  for (let slaveId in slaves) {
    if (slaves[slaveId].master_id === userId && usersInfo[slaveId]) {
      defaultUserSlaves.push({
        user_info: usersInfo[slaveId],
        slave_object: slaves[slaveId],
      });
    }
  }

  let [loading, setLoading] = useState<boolean>(defaultLoading);
  let [userInfo, setUserInfo] = useState<UserInfo>(gotUserInfo);
  let [masterInfo, setMasterInfo] = useState<UserInfo>(DefaultUserInfo);
  let [slave, setSlave] = useState<ISlaveData>(gotSlave);
  let [userSlaves, setSlaves] = useState<ISlaveWithUserInfo[]>(
    defaultUserSlaves
  );

  let [imageVersion] = useState<number>(Date.now());

  console.log("Slave", slave, gotSlave);

  let [loadedUserInfo, setLoadedUserInfo] = useState<boolean>(false);
  let [loadedMasterInfo, setLoadedMasterInfo] = useState<boolean>(false);
  let [loadedUserData, setLoadedUserData] = useState<boolean>(false);
  let [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    if (slaves[userId]) {
      setSlave(slaves[userId]);
    }
  }, [gotSlave]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      let loadedUserInfo = usersInfo[userId];
      if (!loadedUserInfo) {
        let newUserInfo = await bridgeClient.getUsersByIds([userId, -1]);
        loadedUserInfo = newUserInfo[0];
        updateUserInfo(loadedUserInfo);
      }
      setUserInfo(loadedUserInfo);
      setLoadedUserInfo(true);
    };
    void fetchUserInfo();
  }, []); // Первый запуск

  useEffect(() => {
    const getFriendsInfo = async () => {
      if (!friendsIds[userInfo.id] && userInfo) await getUserFriends();
    };
    void getFriendsInfo();
  }, [userInfo]);

  const getUserFriends = async () => {
    await bridgeClient
      .getAllFriends(userInfo.id)
      .catch((): UserInfo[] => {
        return [];
      })
      .then(async (newFriends) => {
        shuffle(newFriends);
        updateFriendsIds({
          [userInfo.id]: newFriends.slice(0, 30).map((u) => u.id),
        });

        updateUsersInfo(newFriends);
        console.log("UPDATED FRIENDS");
      })
      .catch(openErrorModal);
  };

  const fetchSlaveData = async () => {
    let newSlaveData = await simpleApi.getUser(userId);
    updateSlaves([newSlaveData.user, ...newSlaveData.slaves]);
    let slavesObjects: Record<number, ISlaveData> = {};
    let cachedSlavesInfo: Record<number, boolean> = {};
    let slaveIds = newSlaveData.slaves.map((slave) => {
      slavesObjects[slave.id] = slave;
      if (usersInfo[slave.id]) {
        cachedSlavesInfo[slave.id] = true;
        return 0;
      }
      return slave.id;
    });
    slaveIds = slaveIds.filter((slaveId) => slaveId);
    let slavesInfoWithObject: ISlaveWithUserInfo[] = [];

    if (slaveIds.length) {
      let slavesInfo = await bridgeClient.getUsersByIds(slaveIds);
      updateUsersInfo(slavesInfo);
      slavesInfoWithObject = slavesInfoWithObject.concat(
        slavesInfo.map((user) => {
          return {
            user_info: user,
            slave_object: slavesObjects[user.id],
          };
        })
      );
    }

    for (let slaveId in cachedSlavesInfo) {
      slavesInfoWithObject.push({
        user_info: usersInfo[slaveId],
        slave_object: slavesObjects[slaveId],
      });
    }

    setSlaves(slavesInfoWithObject);
    setSlave(newSlaveData.user);
    setLoadedUserData(true);
    setUserLoaded(userId);
  };

  const loadMasterInfo = async () => {
    if (slave.master_id) {
      let slaveMasterInfo = usersInfo[slave.master_id];
      if (!slaveMasterInfo && slave.master_id) {
        let newSlaveMasterInfo = await bridgeClient.getUsersByIds([
          slave.master_id,
          -1,
        ]);
        slaveMasterInfo = newSlaveMasterInfo[0];
        updateUserInfo(slaveMasterInfo);
      }
      setMasterInfo(slaveMasterInfo);
    } else {
      setMasterInfo(DefaultUserInfo);
    }
    setLoadedMasterInfo(true);
  };

  useEffect(() => {
    if (userInfo.id && loadedUsers.indexOf(userId) == -1) {
      void fetchSlaveData();
    }
  }, [userInfo]); // Когда получили инфу о пользователе, получаем инфу о рабах

  useEffect(() => {
    // Подгружаем инфу о владельце этого раба

    if (slave.id) {
      void loadMasterInfo();
    }
  }, [slave]); // Только, когда меняется инфа о рабе

  useEffect(() => {
    if (loadedUserInfo && loadedUserData && loadedMasterInfo) {
      setLoading(false);
    }
  }, [loadedUserInfo, loadedUserData, loadedMasterInfo]);

  const syncNewSlave = (res: IUserActionResponseDto) => (
    updateSlaves([res.user, res.slave]), setSlave(res.slave)
  );

  // Покупка
  const buySlave = () => {
    simpleApi.buySlave(slave.id).then(syncNewSlave).catch(openErrorModal);
  };

  // Цепь
  const fetterSlave = () => {
    simpleApi.fetterSlave(slave.id).then(syncNewSlave).catch(openErrorModal);
  };

  const refreshUserData = async () => {
    setLoadedMasterInfo(false);
    setLoadedUserData(false);
    setIsFetching(true);
    await fetchSlaveData();
    await loadMasterInfo();
    await getUserFriends();
    setLoadedMasterInfo(true);
    setLoadedUserData(true);
    setIsFetching(false);
  };

  const openSlave = (slaveId: number) => {
    router.pushPageRoute(pageOpened, { id: String(slaveId) });
  };

  // Продажа
  const sellSlave = () => {
    simpleApi.sellSlave(slave.id).then(syncNewSlave).catch(openErrorModal);
  };

  const slavesListStyles =
    slave.id === currentUserInfo.id ? {} : { marginBottom: 128 };

  return (
    <Panel key={key} id={panelId}>
      <PanelHeader
        left={
          <PanelHeaderBack
            onClick={() => {
              if (router.isFirstPage()) {
                console.log("is first page");
                router.replacePageRoute(PAGE_MAIN, {});
              } else {
                router.popPage();
              }
            }}
          />
        }
      />
      <img
        src={imagePath + imageVersion}
        className="app-icon"
        alt="Иконка приложения"
      />
      {loading && <PanelSpinner size="large" style={{ marginTop: 128 }} />}
      {!loading && !slave.deleted ? (
        <PullToRefresh onRefresh={refreshUserData} isFetching={isFetching}>
          <UserHeader
            user={userInfo}
            master={masterInfo}
            slave={slave}
            isMe={false}
            onBuySelf={buySlave}
            router={router}
            pageOpened={pageOpened}
            currentUserId={currentUserInfo.id}
          />
          {!friendsIds[userInfo.id]?.length || (
            <Group header={<Header mode="primary">Друзья</Header>}>
              <Div>
                <Card mode="outline">
                  <Div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      maxHeight: 93,
                      overflow: " hidden",
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                  >
                    {friendsIds[userInfo.id].map((friendId) => {
                      if (!usersInfo[friendId]) return null;

                      return (
                        <div style={{ padding: "5px 10px" }}>
                          <Avatar
                            size={40}
                            onClick={() => openSlave(usersInfo[friendId]?.id)}
                            src={usersInfo[friendId].photo_100}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      );
                    })}
                  </Div>
                </Card>
              </Div>
            </Group>
          )}
          <div style={slavesListStyles}>
            <SlavesList
              isMe={slave.id === currentUserInfo.id}
              slavesCount={slave.slaves_count}
              slaves={userSlaves}
              router={router}
              pageOpened={pageOpened}
              limitShow={true}
              showProfitPerMin={false}
              showPrice={true}
            />
          </div>
          <FixedLayout vertical="bottom">
            <Div style={{ paddingBottom: 0 }}>
              {slave.fetter_to >= Date.now() / 1000 && (
                <Div className="fettered-message">
                  В цепях будет еще{" "}
                  {getSubDate(new Date(slave.fetter_to * 1000))}
                </Div>
              )}
              {currentUserInfo.id !== slave.master_id &&
              currentUserInfo.id !== slave.id ? (
                <Button
                  style={{ marginBottom: 8, width: "100%" }}
                  before={<Icon28MarketOutline />}
                  size="l"
                  mode="commerce"
                  onClick={buySlave}
                >
                  Купить за {beautyNumber(slave.price)} ₽
                </Button>
              ) : null}
              {currentUserInfo.id === slave.master_id &&
                slave.fetter_to <= Date.now() / 1000 && (
                  <Button
                    style={{ marginBottom: 8, width: "100%" }}
                    before={<Icon20FreezeOutline width={28} height={28} />}
                    size="l"
                    onClick={fetterSlave}
                  >
                    Надеть цепи за {beautyNumber(slave.fetter_price)} ₽
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
                  Продать за {beautyNumber(slave.sale_price)} ₽
                </Button>
              )}
            </Div>
          </FixedLayout>
        </PullToRefresh>
      ) : slave && slave.deleted ? (
        <Placeholder icon={<Icon56GhostOutline />} header="Аккаунт удален">
          Этот персонаж удален по воле его владельца, поэтому вы не сможете
          купить или продать его, пока он не будет восстановлен.
        </Placeholder>
      ) : null}
    </Panel>
  );
};

export default withUserInfo(User);
