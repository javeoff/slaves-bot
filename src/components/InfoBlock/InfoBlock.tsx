import { classNames } from "@vkontakte/vkjs";
import { Caption, Title } from "@vkontakte/vkui";
import React, { FC, ReactElement } from "react";

import "./InfoBlock.css";

interface IProps {
  icon?: ReactElement;
  variant?: "blue" | "green" | "orange" | "gray";
  title?: string;
  subtitle?: string;
  action?: ReactElement;
  style?: React.CSSProperties;
  after?: ReactElement;
  clickable?: boolean;
  onClick?: VoidFunction;
}

export const InfoBlock: FC<IProps> = ({
  icon,
  action,
  variant = "blue",
  title = "",
  subtitle = "",
  style,
  after,
  clickable = false,
  onClick,
}) => (
  <div
    className={classNames("info-block", "variant--" + variant, {
      "info-block--clickable": clickable,
    })}
    style={style}
    onClick={onClick}
  >
    {icon && <div className="info-block--icon">{icon}</div>}
    <div className="info-block--body">
      <Title level="3" weight="medium">
        {title}
      </Title>
      <Caption className="info-block--body-caption" level="1" weight="regular">
        {subtitle}
      </Caption>
      {action && <div className="info-block-action">{action}</div>}
    </div>
    {after && <div className="info-block--after">{after}</div>}
  </div>
);
