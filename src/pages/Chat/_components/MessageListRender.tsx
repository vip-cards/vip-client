import classNames from "classnames";
import dayjs from "dayjs";
import { motion } from "framer-motion";

interface IMessageListRender {
  messageList: IMessage[];
  userRole: string;
  userId: string;
}

export function MessageListRender({
  messageList,
  userRole,
  userId,
}: IMessageListRender) {
  if (!messageList.length) return null;
  return messageList?.map((message) => (
    <motion.div
      key={message.timestamp ?? new Date().toISOString() + Math.random() * 10}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.25 }}
      layoutScroll
      exit={{ opacity: 0, scale: 0.8 }}
      className={classNames("py-3 px-5 rounded max-w-[80%]", {
        "bg-slate-600 ml-auto w-fit rounded-l-3xl rounded-tr-3xl text-slate-100":
          message[userRole] === userId || message[userRole]?._id === userId,
        "bg-slate-300 mr-auto w-fit rounded-r-3xl rounded-bl-3xl text-slate-900":
          !(message[userRole] === userId || message[userRole]?._id === userId),
      })}
    >
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col"
      >
        <span className="whitespace-pre-line break-words max-w-full overflow-hidden">
          {message?.text}
        </span>
        <span className="text-xs self-end text-slate-400 leading-3 whitespace-pre">
          {message?.timestamp
            ? dayjs(message.timestamp).format("DD-MM-YYYY hh:mma")
            : null}
        </span>
      </motion.div>
    </motion.div>
  ));
}
