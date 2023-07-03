import { Fragment } from "react";
import { EStepStatus } from "./_components/stepper.types";
import StepperConnector from "./_components/StepperConnector";
import StepperCircle from "./_components/StepperCircle";
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

interface IMainStepperProps {
  steps: {
    label: string;
    status: EStepStatus;
  }[];
}

function MainStepper({ steps }: IMainStepperProps) {
  return (
    <div className="flex items-center pb-5 mt-4 max-w-sm mx-auto">
      {!!steps.length &&
        steps?.map(({ status, label }, index) => {
          const icon =
            status === EStepStatus.COMPLETED
              ? faCircleCheck
              : status === EStepStatus.REJECTED
              ? faCircleXmark
              : faCircleExclamation;

          return (
            <Fragment key={index}>
              {index > 0 ? (
                <StepperConnector
                  previous={steps[index - 1].status as any}
                  next={steps[index]?.status as any}
                />
              ) : null}
              <StepperCircle label={label} status={status as any} icon={icon} />
            </Fragment>
          );
        })}
    </div>
  );
}

export default MainStepper;
