import { useRef, useEffect } from "react";
import Message from "./Message";
import useListenMessages from "../hooks/useListenMessages";
import { useSelector } from "react-redux";

const Messages = () => {
  const messages = useSelector((state) => state.conversation.messages);
  const messagesEndRef = useRef(null);
  useListenMessages();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message._id}>
            <Message message={message} />
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center">Send a message to Start a Conversation</p>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;