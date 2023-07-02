export function ChatContainer({ children }) {
  return (
    <div className="chat-page-container app-card-shadow max-w-[80vw] max-sm:max-w-full max-h-[80vh] max-sm:max-h-full min-w-[300px] mx-auto my-8">
      {children}
    </div>
  );
}
