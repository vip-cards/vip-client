import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FormErrorMessage({ errorList }) {
  if (!errorList?.length) return null;
  return errorList?.map((error) => {
    return (
      <div
        key={error}
        className="mx-auto max-w-[95%] md:max-w-[80%] animate__animated animate__bounceIn duration-75"
      >
        <div className="err !text-sm font-serif !font-normal gap-3 flex flex-row whitespace-normal items-center !py-2 !px-3">
          <FontAwesomeIcon icon={faExclamationTriangle} size="xl" />
          <span>{error}</span>
        </div>
      </div>
    );
  });
}
export default FormErrorMessage;
