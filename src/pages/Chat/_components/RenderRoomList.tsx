import {
  faClock,
  faPaperPlane,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainImage } from "components";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { getLocalizedWord } from "helpers/lang";
import { useTranslation } from "react-i18next";

interface IRenderRoomList {
  roomList: IRoom[];
  userRole: string;
  userId: string;
  activeRoom?: IRoom;
  onSelectRoom: (room: IRoom) => void;
}

export const RenderRoomList = ({
  roomList,
  userRole,
  userId,
  activeRoom,
  onSelectRoom,
}: IRenderRoomList) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  if (!roomList.length) return null;

  return (
    <motion.div
      layoutScroll
      className="overflow-y-auto max-h-[73vh] max-w-full !h-min"
    >
      {roomList?.map((room, idx) => {
        const { members, _id: RoomId, lastUpdated, lastMessage } = room;
        const vipImg = require("assets/images/vip.png");

        if (
          !Object.keys(members).length ||
          !Object.keys(members)?.includes(userRole)
        )
          return null;

        const otherChatter: IChatter =
          members?.[
            Object.keys(members).filter(
              (item) => members[item]._id !== userId
            )[0]
          ];

        const img = otherChatter?.name.en?.includes("VIP")
          ? vipImg
          : otherChatter?.image?.Location;

        return (
          <motion.div
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.1, delay: idx * 0.03 }}
            key={otherChatter?._id}
            className={classNames(
              "flex sm:flex-row max-w-full overflow-hidden text-ellipsis items-center gap-3 sm:h-20 max-sm:flex-col",
              "hover:bg-slate-300/80 cursor-pointer transition-all duration-100 ease-in-out",
              "ltr:rounded-l-2xl rtl:rounded-r-2xl px-3 py-2 max-w-full overflow-hidden max-sm:!rounded-none",
              { "active-room-tab": activeRoom?._id === RoomId }
            )}
            onClick={() => onSelectRoom(room)}
          >
            <div className="w-9 h-9 md:w-11 md:h-11 shrink-0 grow-0 max-w-[3rem] max-h-12 rounded-full flex items-center border bg-slate-200/50 justify-center overflow-hidden">
              {img ? (
                <MainImage
                  src={img}
                  alt={getLocalizedWord(otherChatter?.name)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserTie}
                  size="xl"
                  className="text-slate-800"
                />
              )}
            </div>
            <div className="flex w-full flex-col h-full justify-between overflow-hidden">
              <span className="flex-grow w-full text-lg whitespace-nowrap overflow-hidden text-ellipsis max-sm:text-xs max-sm:whitespace-normal max-sm:leading-3 max-sm:text-center">
                {getLocalizedWord(otherChatter?.name)}
              </span>
              <span className="flex-grow text-xs w-full text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis max-sm:text-[0.6rem] max-sm:whitespace-normal max-sm:leading-3 text-start line-clamp-1">
                <FontAwesomeIcon icon={faPaperPlane} className="me-1" />

                {lastMessage?.text}
              </span>
              <span className="mt-auto text-xs whitespace-nowrap text-slate-600 leading-3">
                <FontAwesomeIcon icon={faClock} className="me-1" />
                {dayjs(lastUpdated).isBefore(dayjs().subtract(3, "day"))
                  ? dayjs(lastUpdated).locale(lang).format("DD-MM-YYYY")
                  : dayjs(lastUpdated).locale(lang).fromNow()}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
