import { ReactComponent as BlockedImage } from "assets/images/errorBlocked.svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectAuth } from "store/auth-slice";

export const ProtectedModule = ({ children, role = "auth" }) => {
  const auth = useSelector(selectAuth);
  const userType = auth.userData?.type;
  if (role === "auth" || userType !== "guest") {
    return children;
  } else {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col gap-5">
        <div className="max-w-[60vw] w-full h-auto mx-auto">
          <BlockedImage />
        </div>
        <h5>You don't have access to this page untill you are subscribed</h5>
        <p>
          You can go{" "}
          <Link
            to="/"
            className="text-blue-800 font-semibold hover:text-blue-500 cursor-pointer"
          >
            Home
          </Link>
        </p>
      </div>
    );
  }
};
