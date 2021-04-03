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
  PanelHeaderBack,
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
import {
  IUserActionResponseDto,
  IUserDataResponseDto,
} from "../common/simple_api/types";
import { MODAL_ERROR_CARD } from "../modals/Error";
import { beautyNumber, getSubDate } from "../common/helpers";
import { openErrorModal } from "../modals/openers";

interface IProps extends IWithUserInfo {
  id?: string;
  key: string;
}

const User: FC<IProps> = ({
  id: panelId,
  usersInfo,
  currentUserInfo,
  key,
  updateSlaves,
  updateUsersInfo,
  updateUserInfo,
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

  let [loadedUserInfo, setLoadedUserInfo] = useState<boolean>(false);
  let [loadedMasterInfo, setLoadedMasterInfo] = useState<boolean>(false);
  let [loadedUserData, setLoadedUserData] = useState<boolean>(false);

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
    };
    if (userInfo.id) {
      void fetchSlaveData();
    }
  }, [userInfo]); // Когда получили инфу о пользователе, получаем инфу о рабах

  useEffect(() => {
    // Подгружаем инфу о владельце этого раба
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

  // Продажа
  const sellSlave = () => {
    simpleApi.sellSlave(slave.id).then(syncNewSlave).catch(openErrorModal);
  };

  return (
    <Panel key={key} id={panelId}>
      <PanelHeader
        left={
          <PanelHeaderBack
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
            slavesCount={slave.slaves_count}
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
          </Div>
        </FixedLayout>
      )}
    </Panel>
  );
};

export default withUserInfo(User);
