import classNames from "classnames";
import { EStepStatus } from "./stepper.types";

interface IStepperConnectorProps {
  previous?: EStepStatus;
  next?: EStepStatus;
}

function StepperConnector({
  previous = EStepStatus.PENDING,
  next = EStepStatus.PENDING,
}: IStepperConnectorProps) {
  return (
    <div
      className={classNames(
        "flex-auto transition duration-500 ease-in-out h-[2px] bg-gradient-to-r",
        {
          "from-green-600": previous === EStepStatus.COMPLETED,
          "from-red-700": previous === EStepStatus.REJECTED,
          "from-gray-600": previous === EStepStatus.PENDING,
        },
        {
          "to-green-600": next === EStepStatus.COMPLETED,
          "to-red-700": next === EStepStatus.REJECTED,
          "to-gray-600": next === EStepStatus.PENDING,
        }
      )}
    ></div>
  );
}

export default StepperConnector;
