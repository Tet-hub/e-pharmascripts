// MessageContext.js
import React, { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export const useMessageContext = () => {
	return useContext(MessageContext);
};

export const MessageProvider = ({ children }) => {
	const [messages, setMessages] = useState([]);

	const addMessage = (message) => {
		setMessages([...messages, message]);
	};

	return <MessageContext.Provider value={{ messages, addMessage }}>{children}</MessageContext.Provider>;
};
