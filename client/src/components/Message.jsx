import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
const Message = ({ message }) => {
    const [user] = useAuthState(auth);

    return (
        <div className="p-2 mb-2">
            <div
                className={`chat-bubble 
      ${message.uid === user.uid ?
                        "ml-auto rounded-br-[20px] rounded-tl-[20px] bg-teal-400 shadow-[ -2px 2px 1px 1px #F79706]" :
                        "rounded-bl-[20px] rounded-tr-[20px] bg-red-400 shadow-[ -2px 2px 1px 1px #2dd4bf]"
                    }
      p-4 text-[#1c2c4c] w-max max-w-[calc(100%-50px)] flex items-start mb-2`}
            >
                <img
                    className="w-9 h-9 rounded-full mr-2.5"
                    src={message.avatar}
                    alt="user avatar"
                />
                <div>
                    <p className="font-bold mb-2 text-sm text-[#1c2c4c]">{message.name}</p>
                    <p className="break-all">{message.text}</p>
                </div>
            </div>
        </div>

    );
};
export default Message;