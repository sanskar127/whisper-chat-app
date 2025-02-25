import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { chatApi, useSendMessageMutation } from "../api/chatApi";

const useSendMessage = () => {
  const [sendMessage, { isLoading, isError, error }] = useSendMessageMutation();
  const socket = useSelector((state) => state.socket.socket);
  const authUser = useSelector(state => state.auth.user)

  // messages setMessages selected Conversations
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const handler = async (message) => {
    try {
      const response = await sendMessage({
        conversationId: selectedConversation._id,
        message,
      }).unwrap();

      if (response) {
        dispatch(
                chatApi.util.updateQueryData('getMessages', selectedConversation?._id, (draft) => {
                  draft.push(response);  // Add the new message to the list
                })
              );
        socket.emit("newMessage", {
            sender : authUser.uname,
            receiver : selectedConversation.uname,
            content : response
        })
      }
      if (isError) {
        throw new Error(error);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  return { handler, isLoading };
};

export default useSendMessage;
