import { useSelector } from "react-redux";
import { selectAuth } from "store/auth-slice";

export const ProtectedComponent = ({ children, role = "auth" }) => {
  const auth = useSelector(selectAuth);
  const userType = auth.userData?.type;
  if (role === "auth" || userType !== "guest") {
    return children;
  } else {
    return <></>;
  }
};
