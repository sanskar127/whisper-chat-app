import { useEffect } from "react";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import MessageIcon from "@mui/icons-material/Message";
import useGetConversations from "../hooks/useGetConversations";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, setSelectedConversation } from "../features/Conversation/conversationsSlice";
import useGetMessages from "../hooks/useGetMessages";

const NoChatSelected = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome {user.fullname}</p>
        <p>Select a Chat to Start Messaging</p>
        <MessageIcon className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};

const MessageContainer = () => {
  const { conversations } = useGetConversations();
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  useGetMessages();

  useEffect(() => {
    return () => {
      dispatch(setSelectedConversation(null));
      dispatch(setMessages([]));
    };
  }, [dispatch]);

  const isSelected = selectedConversation
    ? conversations.some((conv) => conv._id === selectedConversation._id)
    : false;

  return (
    <div className="w-full flex flex-col">
      {isSelected ? (
        <>
          <div className="bg-slate-500 px-4 py-2 mb-2">
            <div className="flex items-center">
              <div className="avatar-image-wrapper w-12 rounded-full">
                <img
                  src={selectedConversation.profilePicture}
                  alt="profile picture"
                  className="max-h-10"
                />
              </div>
              <span className="text-gray-100 font-bold">
                {selectedConversation.fullname}
              </span>
            </div>
          </div>
          <Messages />
          <MessageInput />
        </>
      ) : (
        <NoChatSelected />
      )}
    </div>
  );
};

export default MessageContainer;
