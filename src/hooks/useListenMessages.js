import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatApi } from "../api/chatApi";

const useListenMessages = () => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const messages = useSelector((state) => state.conversation.messages);
  const selectedConversation = useSelector(state => state.conversation.selectedConversation);

  useEffect(() => {
    socket.on("newMessage", ({content}) => {
      dispatch(
        chatApi.util.updateQueryData('getMessages', selectedConversation?._id, (draft) => {
          draft.push(content);  // Add the new message to the list
        })
      );
    });
    return () => socket?.off("newMessage");
  }, [socket, dispatch, messages, selectedConversation]);
};

export default useListenMessages;
