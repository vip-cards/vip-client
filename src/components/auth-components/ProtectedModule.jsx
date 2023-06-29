import { ReactComponent as BlockedImage } from "assets/images/errorBlocked.svg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "store/actions";
import { selectAuth } from "store/auth-slice";

export const ProtectedModule = ({ children, role = "auth" }) => {
  const auth = useSelector(selectAuth);
  const userType = auth.userData?.type;
  const isAuthUser = role === "auth";
  const isUserSubscribed = role === "subscribed" && auth.userData?.isSubscribed;
  const isGeneralClient = role === "client";
  const canView = isAuthUser || userType !== "guest";

  if (canView) return children;

  if (userType === "guest") {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col gap-5">
        <div className="max-w-[60vw] w-full h-auto mx-auto">
          <BlockedImage />
        </div>
        <h5>You don't have access to this page untill you are logged in</h5>
        <p>
          You can go{" "}
          <Link
            to="/login"
            onClick={() => logout()}
            className="text-blue-800 font-semibold hover:text-blue-500 cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    );
  }

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
};
