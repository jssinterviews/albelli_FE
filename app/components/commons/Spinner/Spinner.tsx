import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface SpinnerProps {
  size?: number;
}

function Spinner({ size = 16 }: SpinnerProps) {
  return (
    <FontAwesomeIcon
      className="basic_icon_wrapper rotate"
      fontSize={size}
      icon={faSpinner}
    />
  );
}

export default Spinner;
