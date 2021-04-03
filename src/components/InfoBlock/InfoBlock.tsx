import { classNames } from "@vkontakte/vkjs";
import { Title } from "@vkontakte/vkui";
import React, { FC, ReactElement } from "react";

import "./InfoBlock.css";

interface IProps {
  icon?: ReactElement;
  variant?: "blue" | "red";
  title?: string;
  subtitle?: string;
  action?: ReactElement;
}

export const InfoBlock: FC<IProps> = ({
  icon,
  action,
  variant = "blue",
  title = "",
  subtitle = "",
}) => (
  <div className={classNames("info-block", "variant--" + variant)}>
    {icon && <div className="info-block--icon">{icon}</div>}
    <div className="info-block--body">
      <Title level="3" weight="medium">
        {title}
      </Title>
      <div>{subtitle}</div>
      {action}
    </div>
  </div>
);
