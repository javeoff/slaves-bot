import { FC, useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Caption,
  Card,
  Div,
  Group,
  Header,
  Title,
} from "@vkontakte/vkui";
import { Icon20LockOutline } from "@vkontakte/icons";
import { ISlaveWithUserInfo } from "../../common/types/ISlaveWithUserInfo";
import { MODAL_GIVE_JOB_CARD } from "../../modals/GiveJob";
import { FixedSizeList } from "react-window";

import "./SlavesList.css";
import { beautyNumber, decOfNum, toFixedSize } from "../../common/helpers";
import { classNames } from "@vkontakte/vkjs";
import { Router } from "../../common/custom-router";
import { getActiveRouter } from "../../common/routes";
import { MOBILE_SIZE } from "@vkontakte/vkui/dist/components/AdaptivityProvider/AdaptivityProvider";
import { ISlaveData } from "../../common/types/ISlaveData";

interface IProps {
  slaves: ISlaveWithUserInfo[];
  slavesCount: number;
  isMe: boolean;
  showHeader?: boolean;
  showPosition?: boolean;
  label?: "slaves_count" | "job_name";
  showProfitPerMin?: boolean;
  showPrice?: boolean;
  pageOpened: string;
  router: Router;
  slavesFilter?: (slave: ISlaveWithUserInfo) => boolean;
  limit?: number;
  limitShow?: boolean;
}

export const SlavesList: FC<IProps> = ({
  slaves,
  slavesFilter,
  limit,
  slavesCount,
  isMe,
  showHeader = true,
  showPosition = false,
  label = "job_name",
  showProfitPerMin = true,
  showPrice = false,
  pageOpened,
  router,
  limitShow = false,
}) => {
  const showOnlyDefault = !limitShow ? 10000 : 100;
  console.log(showOnlyDefault);
  if (!limit) {
    limit = slaves.length;
  }

  slaves = slaves.slice(0, limit);

  const openGiveJobModal = (slaveId: number) => {
    getActiveRouter().pushModal(MODAL_GIVE_JOB_CARD, {
      id: String(slaveId),
    });
  };

  const [showOnly, setShowOnly] = useState<number>(showOnlyDefault);

  const openSlave = (slaveId: number) => {
    router.pushPageRoute(pageOpened, { id: String(slaveId) });
  };

  const isPhone = window.innerWidth <= MOBILE_SIZE + 20;
  const avatarSize = isPhone ? 36 : 44;

  const onClickHandler = useCallback((a: any) => {
    if (!a.target.classList.contains("Button__content")) {
      let el: HTMLDivElement = a.currentTarget;
      let slaveId = 0;
      if (el.dataset.slaveId) slaveId = +el.dataset.slaveId;
      openSlave(slaveId);
    }
  }, []);

  const onGiveJobHandler = useCallback((a: any) => {
    let el: HTMLDivElement = a.currentTarget;
    let slaveId = 0;
    if (el.dataset.slaveId) slaveId = +el.dataset.slaveId;
    if (isMe) {
      openGiveJobModal(slaveId);
    }
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (
        window.innerHeight + window.scrollY - (61 + 48) >=
        document.body.offsetHeight
      ) {
        setShowOnly(showOnly + showOnlyDefault);
      }
    };
    window.addEventListener("scroll", scrollListener);
    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  const listStyles: React.CSSProperties = { marginBottom: 12 };
  let showed = 0;
  if (!slavesFilter) {
    slaves = slaves.slice(0, showOnly);
  }
  return (
    <Group>
      {showHeader && (
        <Header mode="primary" indicator={slavesCount}>
          {isMe ? "Мои рабы" : "Рабов"}
        </Header>
      )}
      <div style={listStyles} id="slaves-list">
        {slaves.map((slave, i) => {
          if (
            (slavesFilter && !slavesFilter(slave)) ||
            slave.slave_object.deleted
          )
            return null;
          showed++;
          if (showed > showOnly) return null;
          return (
            <Div
              key={"slave_" + slave.user_info.id + "_" + i}
              className="slaves-list--item"
            >
              <Card mode="shadow">
                <Div
                  onClick={onClickHandler}
                  data-slave-id={slave.user_info.id}
                  className="slave-list--item-container"
                >
                  <Avatar src={slave.user_info.photo_100} size={avatarSize}>
                    {showPosition && (
                      <span className="avatar-counter">{i + 1}</span>
                    )}
                  </Avatar>
                  <div className="slave-list--item-user-info">
                    <Title
                      level="3"
                      weight="medium"
                      className="slave-list--item-user-info-title"
                    >
                      {toFixedSize(slave.user_info.first_name, 18)}{" "}
                      {toFixedSize(slave.user_info.last_name, 12, true)}
                    </Title>
                    {label === "job_name" ? (
                      slave.slave_object.job.name !== "" ? (
                        <Button
                          mode="tertiary"
                          className="slave-list--item--button inactive"
                          data-slave-id={slave.user_info.id}
                          onClick={onGiveJobHandler}
                        >
                          {slave.slave_object.job.name}
                        </Button>
                      ) : null
                    ) : null}
                    {label === "slaves_count" && (
                      <Caption
                        level="1"
                        weight="regular"
                        className="slave-list--item-user-info-caption"
                      >
                        {slave.slave_object.slaves_count}{" "}
                        {decOfNum(slave.slave_object.slaves_count, [
                          "раб",
                          "раба",
                          "рабов",
                        ])}
                      </Caption>
                    )}
                    {slave.slave_object.job.name === "" && isMe ? (
                      <Button
                        mode="tertiary"
                        className="slave-list--item--button"
                        data-slave-id={slave.user_info.id}
                        onClick={onGiveJobHandler}
                      >
                        Дать работу
                      </Button>
                    ) : null}
                  </div>
                  <div>
                    {slave.slave_object.fetter_to
                      ? Date.now() / 1000 < slave.slave_object.fetter_to && (
                          <div className="slave-list-item--lock">
                            <Icon20LockOutline fill="#E64646" />
                          </div>
                        )
                      : null}
                    {showProfitPerMin && (
                      <div>
                        <Title
                          level="3"
                          weight="bold"
                          className={classNames("slave-list-item--profit", {
                            green: slave.slave_object.profit_per_min > 0,
                            gray: slave.slave_object.profit_per_min <= 0,
                          })}
                        >
                          {beautyNumber(slave.slave_object.profit_per_min)} ₽ /
                          мин.
                        </Title>
                      </div>
                    )}
                    {showPrice && (
                      <div>
                        <Title
                          level="3"
                          weight="bold"
                          className="slave-list-item--profit green"
                        >
                          {beautyNumber(slave.slave_object.price)} ₽
                        </Title>
                      </div>
                    )}
                  </div>
                </Div>
              </Card>
            </Div>
          );
        })}
      </div>
    </Group>
  );
};
