import { FC } from "react";
import {
  Avatar,
  Button,
  Caption,
  Card,
  Div,
  Group,
  Header,
  Link,
  RichCell,
  Title,
} from "@vkontakte/vkui";
import { Icon20LockOutline } from "@vkontakte/icons";
import { ISlaveWithUserInfo } from "../../common/types/ISlaveWithUserInfo";
import { useLocation, useRouter } from "@happysanta/router";
import { PAGE_USER, PANEL_MAIN_USER, router } from "../../common/routes/routes";
import { string } from "prop-types";
import { MODAL_GIVE_JOB_CARD } from "../../modals/GiveJob";

import "./SlavesList.css";
import { decOfNum } from "../../common/helpers";

interface IProps {
  slaves: ISlaveWithUserInfo[];
  slavesCount: number;
  isMe: boolean;
  showHeader?: boolean;
  showPosition?: boolean;
  label?: "slaves_count" | "job_name";
  showProfitPerMin?: boolean;
}

type CustomClick = { target: HTMLElement };

export const SlavesList: FC<IProps> = ({
  slaves,
  slavesCount,
  isMe,
  showHeader = true,
  showPosition = false,
  label = "job_name",
  showProfitPerMin = true,
}) => {
  let router = useRouter();
  const openGiveJobModal = (slaveId: number) => {
    router.pushModal(MODAL_GIVE_JOB_CARD, {
      id: String(slaveId),
    });
  };
  const openSlave = (slaveId: number) => {
    router.pushPage(PAGE_USER, { id: String(slaveId) });
  };
  return (
    <Group>
      {showHeader && (
        <Header mode="primary" indicator={slavesCount}>
          Рабы
        </Header>
      )}
      <div style={{ marginBottom: 12 }}>
        {slaves.map((slave, i) => {
          return (
            <Div
              key={"slave_" + slave.user_info.id + "_" + i}
              style={{ paddingBottom: 0 }}
            >
              <Card mode="shadow">
                <Div
                  onClick={(a: any) => {
                    if (!a.target.classList.contains("Button__content")) {
                      openSlave(slave.slave_object.id);
                    }
                  }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Avatar src={slave.user_info.photo_100} size={48}>
                    {showPosition && (
                      <span className="avatar-counter">{i + 1}</span>
                    )}
                  </Avatar>
                  <div style={{ marginLeft: 12, flex: 2 }}>
                    <Title level="3" weight="medium">
                      {slave.user_info.first_name} {slave.user_info.last_name}
                    </Title>
                    {label === "job_name" ? (
                      slave.slave_object.job.name !== "" ? (
                        <Caption
                          level="1"
                          weight="regular"
                          style={{ color: "#707070" }}
                        >
                          {slave.slave_object.job.name}
                        </Caption>
                      ) : null
                    ) : null}
                    {label === "slaves_count" && (
                      <Caption
                        level="1"
                        weight="regular"
                        style={{ color: "#707070" }}
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
                        style={{
                          paddingLeft: 0,
                          paddingRight: 0,
                        }}
                        onClick={() => openGiveJobModal(slave.slave_object.id)}
                      >
                        Дать работу
                      </Button>
                    ) : null}
                  </div>
                  {showProfitPerMin && (
                    <div>
                      <Title
                        level="3"
                        weight="bold"
                        style={{
                          color:
                            slave.slave_object.profit_per_min > 0
                              ? "#44CC50"
                              : "#ddd",
                        }}
                      >
                        {slave.slave_object.profit_per_min} ₽ / мин.
                      </Title>
                    </div>
                  )}
                  {slave.slave_object.fetter_to
                    ? Date.now() / 1000 < slave.slave_object.fetter_to && (
                        <div style={{ marginLeft: 12 }}>
                          <Icon20LockOutline fill="#E64646" />
                        </div>
                      )
                    : null}
                </Div>
              </Card>
            </Div>
          );
        })}
      </div>
    </Group>
  );
};
