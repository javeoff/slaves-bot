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

interface IProps {
  slaves: ISlaveWithUserInfo[];
  slavesCount: number;
}

export const SlavesList: FC<IProps> = ({ slaves, slavesCount }) => {
  let router = useRouter();
  return (
    <Group>
      <Header mode="primary" indicator={slavesCount}>
        Рабы
      </Header>
      <div style={{ marginBottom: 12 }}>
        {slaves.map((slave) => {
          return (
            <Div
              key={"slave_" + slave.user_info.id}
              style={{ paddingBottom: 0 }}
            >
              <Card
                onClick={() =>
                  router.pushPage(PAGE_USER, { id: String(slave.user_info.id) })
                }
                mode="shadow"
              >
                <Div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={slave.user_info.photo_100} size={48}></Avatar>
                  <div style={{ marginLeft: 12, flex: 2 }}>
                    <Title level="3" weight="medium">
                      {slave.user_info.first_name} {slave.user_info.last_name}
                    </Title>
                    {slave.slave_object.job.name !== "" && (
                      <Caption
                        level="1"
                        weight="regular"
                        style={{ color: "#707070" }}
                      >
                        {slave.slave_object.job.name}
                      </Caption>
                    )}
                  </div>
                  <div>
                    <Title level="3" weight="bold" style={{ color: "#44CC50" }}>
                      + {slave.slave_object.profit_per_min} ₽ / мин.
                    </Title>
                  </div>
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
