interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export function ChatMessage({ message, isUser }: ChatMessageProps) {
  if (isUser) {
    return (
      <div className="self-end bg-primary text-white p-4 rounded-2xl rounded-tr-sm max-w-[85%]">
        <p className="text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="self-start bg-primary/10 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-4 rounded-2xl rounded-tl-sm max-w-[85%]">
      <p className="text-sm">{message}</p>
    </div>
  );
}
