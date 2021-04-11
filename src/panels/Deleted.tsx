import React, { FC } from "react";
import Panel from "@vkontakte/vkui/dist/components/Panel/Panel";
import { Button, Group, Placeholder } from "@vkontakte/vkui";
import { Icon56GhostOutline } from "@vkontakte/icons";
import { simpleApi } from "../common/simple_api/simpleApi";
interface IProps {
  id?: string;
}

const Deleted: FC<IProps> = ({ id }) => (
  <Panel id={id}>
    <Group style={{ marginTop: 56 }}>
      <Placeholder
        icon={<Icon56GhostOutline />}
        header="Аккаунт удален"
        action={
          <Button
            size="m"
            onClick={() => {
              simpleApi.restoreMyAccount().then(() => {
                window.location.reload();
              });
            }}
          >
            Восстановить аккаунт
          </Button>
        }
      >
        Ваш аккаунт удален из игры. Другие игроки не смогут купить вашего
        персонажа, пока вы не восстановите его. До тех пор, доступ к основным
        функциям приложения для вас ограничен.
      </Placeholder>
    </Group>
  </Panel>
);

export default Deleted;
