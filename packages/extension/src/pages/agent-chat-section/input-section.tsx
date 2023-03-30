/* eslint-disable react-hooks/exhaustive-deps */
import loadingChatGif from "@assets/chat-loading.gif";
import agentCommandIcon from "@assets/icon/agent-command.png";
import paperAirplaneIcon from "@assets/icon/paper-airplane.png";
import { CommandsDropdown } from "@components/agents/commands-dropdown";
import React, { useRef, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { InputGroup } from "reactstrap";
import { AGENT_COMMANDS } from "../../config.ui.var";
import style from "./style.module.scss";

export const InactiveAgentMessage = () => {
  return (
    <InputGroup className={style.inputText}>
      <div
        style={{ textAlign: "center", color: "grey" }}
        className={`${style.inputArea} ${style["send-message-inputArea"]}`}
      >
        The Agent is inactive
      </div>
    </InputGroup>
  );
};

export const ProcessingLastMessage = () => {
  return (
    <InputGroup className={style.inputText}>
      <div
        style={{ textAlign: "center", color: "grey" }}
        className={`${style.inputArea} ${style["send-message-inputArea"]}`}
      >
        Generating Response, Please Wait
      </div>
      <div className={style["send-message-icon"]}>
        <img src={loadingChatGif} width={20} />
      </div>
    </InputGroup>
  );
};

export const InputField = ({
  newMessage,
  setNewMessage,
  setIsCommand,
  handleSendMessage,
}: {
  newMessage: string;
  setNewMessage: any;
  setIsCommand: any;
  handleSendMessage: any;
}) => {
  let enterKeyCount = 0;
  const [showCommandDropdown, setShowCommandDropdown] = useState(false);
  const messageInput = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: any) => {
    const isNotCommand =
      !AGENT_COMMANDS.find((command: any) =>
        command.command.includes(event.target.value)
      ) ||
      !event.target.value ||
      !event.target.value.includes("/");

    setIsCommand(!isNotCommand);
    setShowCommandDropdown(!isNotCommand);
    setNewMessage(event.target.value.substring(0, 100));
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    //it triggers by pressing the enter key
    const { key } = e as React.KeyboardEvent<HTMLTextAreaElement>;
    if (key === "Enter" && !e.shiftKey && enterKeyCount == 0) {
      enterKeyCount = 1;
      setShowCommandDropdown(false);
      handleSendMessage(e);
    }
  };

  const handleCommand = (command: string) => {
    setIsCommand(true);
    setShowCommandDropdown(false);
    setNewMessage(command);
    if (messageInput.current) messageInput.current.focus();
  };

  return (
    <InputGroup className={style.inputText}>
      <CommandsDropdown
        newMessage={newMessage}
        showDropdown={showCommandDropdown}
        handleClick={handleCommand}
      />

      <ReactTextareaAutosize
        ref={messageInput}
        maxRows={3}
        className={`${style.inputArea}`}
        placeholder={"Ask a question or type '/' for commands"}
        value={newMessage}
        onChange={handleChange}
        onKeyDown={handleKeydown}
      />
      <div className={style["send-message-icon"]}>
        {newMessage?.length && newMessage.trim() !== "" ? (
          <img
            src={paperAirplaneIcon}
            alt=""
            draggable="false"
            onClick={(e) => {
              setShowCommandDropdown(false);
              handleSendMessage(e);
              enterKeyCount = 0;
            }}
          />
        ) : (
          <img
            src={agentCommandIcon}
            alt=""
            draggable="false"
            onClick={() => setShowCommandDropdown(!showCommandDropdown)}
          />
        )}
      </div>
    </InputGroup>
  );
};
