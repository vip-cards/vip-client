import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { EStepStatus } from "./stepper.types";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

interface IStepperCircleProps {
  label?: string;
  status?: EStepStatus;
  icon?: FontAwesomeIconProps["icon"];
}

function StepperCircle({
  label = EStepStatus.PENDING,
  status = EStepStatus.PENDING,
  icon = faCircleCheck,
}: IStepperCircleProps) {
  const { t } = useTranslation();

  return (
    <div
      className={classNames("flex items-center relative", {
        "text-green-600": status === EStepStatus.COMPLETED,
        "text-red-600": status === EStepStatus.REJECTED,
        "text-gray-600": status === EStepStatus.PENDING,
      })}
    >
      <div
        className={classNames(
          "rounded-full flex justify-center transition duration-500 ease-in-out h-12 w-12 border-2 items-center",
          {
            "border-green-700": status === EStepStatus.COMPLETED,
            "border-red-700": status === EStepStatus.REJECTED,
            "border-gray-600": status === EStepStatus.PENDING,
          }
        )}
      >
        <FontAwesomeIcon
          icon={icon}
          className={classNames("w-full h-full", {
            "text-green-700/50": status === EStepStatus.COMPLETED,
            "text-red-700/50": status === EStepStatus.REJECTED,
            "text-gray-600/50": status === EStepStatus.PENDING,
          })}
        />
      </div>
      <div
        className={classNames(
          "absolute top-0 -ms-10 text-center mt-16 w-32 text-xs font-medium uppercase",
          {
            "text-green-700": status === EStepStatus.COMPLETED,
            "text-red-700": status === EStepStatus.REJECTED,
            "text-gray-600": status === EStepStatus.PENDING,
          }
        )}
      >
        {t(label)}
      </div>
    </div>
  );
}

export default StepperCircle;
