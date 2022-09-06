import classnames from "classnames";
import React from "react";
import { Container } from "reactstrap";
import deliveredIcon from "../../public/assets/icon/delivered.png";
import style from "./style.module.scss";

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  return hours + ":" + minutes.substr(-2);
};
let months: any[]=["january","February","March","April","May","June","July","August","September","October","November","December"]



export const ChatMessage = ({
  message,
  isSender,
  timestamp,
  showDate
}: {
  isSender: boolean;
  message: string;
  timestamp: number;
  showDate:boolean
}) => {

  const currentTime = (time: any) => {
    const d: any = new Date(time);
    if(d.getDate()===new Date().getDate()){
      return {
          time: `${d.getHours()}:${d.getMinutes()}`,
          date: `today`,
      }
    }
    if(d.getDate()===new Date().getDate()-1){
      return {
          time: `${d.getHours()}:${d.getMinutes()}`,
          date: `yesterday`,
      }
    }
    return {
      time: `${d.getHours()}:${d.getMinutes()}`,
      date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
    };
  };

  
  return (
    <>
    <div className={style.currentDateContainer}> {showDate ? (
      <span className={style.currentDate}>
        {currentTime(timestamp).date}
      </span>
    ) : null}
  </div>
    <div className={isSender ? style.senderAlign : ""}>
      <Container
        fluid
        className={classnames(style.messageBox, {
          [style.senderBox]: isSender,
        })}
      >
        <div className={style.message}>{message}</div>
        <div className={style.timestamp}>
          {formatTime(timestamp)}
          {isSender && <img src={deliveredIcon} />}
        </div>
      </Container>
    </div>
    </>
  );
};
