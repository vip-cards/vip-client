import classNames from "classnames";
import MainImage from "components/MainImage/MainImage";
import dayjs from "dayjs";
import { motion } from "framer-motion";

export function notificationListRender(
  handleNotificationClick: (
    notificationId: any,
    notification: INotification
  ) => void
) {
  return (menu: INotification[]) =>
    menu?.map((item, idx: number) => (
      <motion.li
        key={item._id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ delay: idx * 0.015 }}
        className={classNames(
          "relative cursor-pointer px-3 py-5 hover:bg-gray-100 w-[21rem] max-w-[90vw]",
          {
            "bg-slate-100/40 border-0 border-b-2 border-b-slate-300/40":
              !item.seen,
          }
        )}
        onClick={() => handleNotificationClick(item._id, item)}
      >
        {!item.seen && (
          <span className="ml-auto absolute w-2 h-2 bg-primary rounded-full ltr:right-2 rtl:left-2 top-2 animate-pulse"></span>
        )}
        <div className="!flex w-full flex-row justify-center items-start gap-2 h-12">
          <div className="w-10 h-10 bg-primary rounded-xl overflow-hidden shrink-0">
            <MainImage
              src={item.image?.Location}
              alt={item.text.slice(0, 30)}
            />
          </div>
          <p className="me-auto !whitespace-normal line-clamp-2 text-ellipsis shrink-0 grow-0 w-[10rem]">
            {item.text ?? "No text"}
          </p>
          <time
            className="text-xs text-gray-600/50 lowercase mt-auto flex-grow-0 flex-shrink-0"
            dateTime={dayjs(item.timestamp).toISOString()}
          >
            {dayjs(item.timestamp).isBefore(dayjs().subtract(3, "day"))
              ? dayjs(item.timestamp).format("DD-MM-YYYY")
              : dayjs(item.timestamp).fromNow()}
          </time>
        </div>
      </motion.li>
    ));
}
