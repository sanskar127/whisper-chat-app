import { PropTypes } from "prop-types"
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { useDispatch, useSelector } from "react-redux"
import { setSelectedConversation } from "../features/Conversation/conversationsSlice"

const Conversation = ({ conversation, lastIndex }) => {
  const { _id, fullname, profilePicture } = conversation

  const dispatch = useDispatch()
  const selectedConversation = useSelector(state => state.conversation.selectedConversation)
  const onlineUsers = useSelector(state => state.socket.onlineUsers)
  const isOnline = onlineUsers.includes(conversation.uname)

  const isSelected = selectedConversation?._id === _id

  const handleClick = () => {
    dispatch(setSelectedConversation(conversation))
  }

  return (
    <div
      className={`conversation-item flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${isSelected ? "bg-sky-500" : ""}`}
      onClick={handleClick}
    >
      <div className={`avatar ${isOnline ? "online": ""}`}>
        <div className="avatar-image-wrapper w-12 rounded-full">
          <img src={profilePicture} alt="DP" />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-3 justify-between">
          <p className="font-bold text-gray-200">{fullname}</p>
          <span className="text-xl"><NavigateNextIcon className="text-xl" /></span>
        </div>
      </div>
      {!lastIndex && <div className="divider my-0 py-0 h-1"></div>}
    </div>
  )
}

Conversation.propTypes = {
  conversation: PropTypes.object.isRequired,
  lastIndex: PropTypes.bool.isRequired,
}

export default Conversation
