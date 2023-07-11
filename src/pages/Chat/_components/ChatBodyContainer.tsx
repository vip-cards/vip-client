import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainImage } from "components";
import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectAuth } from "store/auth-slice";

interface IChatBodyContainer {
  children: React.ReactNode;
  messageList: IMessage[];
  activeRoom?: IRoom;
  onCreateModal: () => void;
}

export function ChatBodyContainer({
  children,
  messageList,
  activeRoom,
}: IChatBodyContainer) {
  const { i18n } = useTranslation();
  const user = useSelector(selectAuth);
  const userId = user.userData._id;
  const userRole = user?.userData?.role ?? user?.userRole;
  const lang = i18n.language;

  if (!activeRoom?._id) return null;

  const { members, _id: RoomId, lastUpdated, lastMessage } = activeRoom ?? {};
  const vipImg = require("assets/images/vip.png");

  if (!Object.keys(members).includes(userRole)) return null;

  const otherChatter: IChatter =
    members?.[
      Object.keys(members).filter((item) => members[item]._id !== userId)[0]
    ];

  const img = otherChatter?.name?.en?.includes("VIP")
    ? vipImg
    : otherChatter?.image?.Location;
  return (
    <div
      className={classNames("w-full h-full flex flex-col overflow-hidden", {
        // "bg-slate-200 duration-1000 animate-pulse":
        //   !messageList?.length && activeRoom?._id,
      })}
    >
      <div
        className={classNames(
          "bg-primary text-white/70 gap-3 text-xs w-full h-16 !opacity-100 shrink-0 min-h-8 flex flex-row items-center",
          { "!hidden": !activeRoom?._id }
        )}
      >
        <div className="w-11 h-11 shrink-0 grow-0 max-w-[3rem] max-h-12 rounded-full flex items-center border bg-slate-200/50 justify-center overflow-hidden">
          {img ? (
            <MainImage src={img} alt={getLocalizedWord(otherChatter?.name)} />
          ) : (
            <FontAwesomeIcon
              icon={faUserTie}
              size="xl"
              className="text-slate-800"
            />
          )}
        </div>
        <div className="flex w-full flex-col justify-between">
          <span className="flex-grow w-full text-lg whitespace-nowrap overflow-hidden text-ellipsis max-sm:text-xs max-sm:whitespace-normal max-sm:leading-3 max-sm:text-center">
            {getLocalizedWord(otherChatter?.name)}
          </span>

          <span className="text-xs whitespace-nowrap text-slate-600">
            {dayjs(lastUpdated).isBefore(dayjs().subtract(3, "day"))
              ? dayjs(lastUpdated).locale(lang).format("DD-MM-YYYY")
              : dayjs(lastUpdated).locale(lang).fromNow() + " ..."}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
