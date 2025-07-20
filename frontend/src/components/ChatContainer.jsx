import React, { useEffect, useRef } from 'react'
import {useChat} from "../store/useChat"
import {ChatHeader} from "./ChatHeader.jsx"
import {MessageInput} from "./MessageInput.jsx"
import {MessageSkeleton} from "./skeleton/MessageSkeleton.jsx"
import {formatMessageTime} from "../lib/utils.js"
import { useAuth } from '../store/useAuth.js'
export const ChatContainer = () => {
  const {messages, getMessages, isLoadingMsg, selectedUser, subscribeToMessages, UnsubscribeToMessages} = useChat()
  const {authUser} = useAuth()
  
  const messageEndRef = useRef(null);
  
  useEffect(()=>{
    getMessages(selectedUser._id);
    subscribeToMessages(); 
    return ()=>UnsubscribeToMessages()
  },[getMessages, selectedUser._id, subscribeToMessages, UnsubscribeToMessages])

  useEffect(()=>{
    if(messageEndRef.current && messages) 
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
  },[messages])
  
  if(isLoadingMsg) return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>
  )

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput/>
    </div>
  )
}