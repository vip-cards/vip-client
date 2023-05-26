import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "react-router-dom";

const TransactionProcess = () => {
  const params = useSearchParams();
  console.log(params);
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-8">
      <h1>Transaction Done</h1>
      {params && <div></div>}
      <div>
        <FontAwesomeIcon
          icon={faCheckCircle}
          size="10x"
          className="text-secondary"
        />
      </div>
    </div>
  );
};

export default TransactionProcess;
