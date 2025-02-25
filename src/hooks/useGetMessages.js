// hooks/useGetMessages.js
import { useSelector } from 'react-redux';
import { useGetMessagesQuery } from '../api/chatApi';
import toast from 'react-hot-toast';
import { setMessages } from '../features/Conversation/conversationsSlice';
import { useDispatch } from 'react-redux';

const useGetMessages = () => {
  const selectedConversation = useSelector(state => state.conversation.selectedConversation);
  const dispatch = useDispatch();

  const { data: messages = [] } = useGetMessagesQuery(selectedConversation?._id, {
    skip: !selectedConversation?._id,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  dispatch(setMessages(messages));
};

export default useGetMessages;
