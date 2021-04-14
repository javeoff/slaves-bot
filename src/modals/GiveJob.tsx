import {
  Button,
  Div,
  FormLayout,
  Group,
  Input,
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
} from "@vkontakte/vkui";
import React, { FC } from "react";
import { getActiveRouter } from "../common/routes";
import { simpleApi } from "../common/simple_api/simpleApi";
import {
  IWithCurrentUserInfo,
  withCurrentUserInfo,
} from "../features/App/hocs/withAppState";
import { MODAL_ERROR_CARD } from "./Error";
import { ErrorAlert } from "../popouts/errorAlert";

interface IProps extends IWithCurrentUserInfo {
  onClose: VoidFunction;
  id: string;
}

export const MODAL_GIVE_JOB_CARD = "modal_give_job_card";
export const ModalGiveJobPage: FC<IProps> = ({ id, onClose, updateSlaves }) => {
  let activeRouter = getActiveRouter();
  let textInput: HTMLDivElement | null;
  let params = activeRouter.getParams();
  let slaveId = params.id;

  const giveJob = (slaveId: number, jobName: string) => {
    simpleApi
      .jobSlave(slaveId, jobName)
      .then((res) => {
        updateSlaves([res.user, res.slave]);
      })
      .catch((e) => {
        getActiveRouter().pushPopout(ErrorAlert, {
          message: e.message,
        });
      });
  };

  const acceptGiveJob = () => {
    if (textInput) {
      let val: string = String(textInput.querySelector("input")?.value);
      giveJob(+slaveId, val);
    }
    onClose();
  };

  return (
    <ModalPage
      id={id}
      onClose={onClose}
      header={
        <ModalPageHeader left={<PanelHeaderClose onClick={onClose} />}>
          Выдача работы
        </ModalPageHeader>
      }
    >
      <Group>
        <Div style={{ paddingBottom: 18 }}>
          <FormLayout
            onSubmit={(e) => {
              e.preventDefault();
              acceptGiveJob();
            }}
          >
            <Input
              style={{ width: "100%", marginBottom: 12 }}
              placeholder="Учитель"
              getRootRef={(ref) => {
                textInput = ref;
              }}
            />
            <Button style={{ width: "100%" }} size="l" mode="primary">
              Дать работу
            </Button>
          </FormLayout>
        </Div>
      </Group>
    </ModalPage>
  );
};

export const ModalGiveJob = withCurrentUserInfo(ModalGiveJobPage);
