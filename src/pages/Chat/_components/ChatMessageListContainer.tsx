import { MessageListRender } from "./MessageListRender";

interface IChatMessageListContainer {
  chatRef: React.RefObject<HTMLDivElement>;
  messageList: IMessage[];
  userId: string;
  userRole: string;
}

export function ChatMessageListContainer({
  chatRef,
  messageList,
  userId,
  userRole,
}: IChatMessageListContainer) {
  return (
    <div
      ref={chatRef}
      className="m-3 scroll-smooth flex gap-3 flex-col h-full max-h-[75vh] overflow-y-auto p-2"
    >
      <MessageListRender
        messageList={messageList}
        userId={userId}
        userRole={userRole}
      />
    </div>
  );
}
