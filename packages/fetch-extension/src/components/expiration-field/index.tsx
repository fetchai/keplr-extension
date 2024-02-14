import React, { useState } from "react";
import style from "./style.module.scss";

interface ExpirationProps {
  setExpiryDateTime: any;
  styleProps?: React.CSSProperties;
}

export const ExpirationField: React.FC<ExpirationProps> = ({
  setExpiryDateTime,
  styleProps,
}) => {
  const getTimeDifferenceInSeconds = (
    dateTimeString: string | number | Date
  ) => {
    const givenDateTime = new Date(dateTimeString);
    const currentDateTime = new Date();
    const timeDifferenceMs =
      givenDateTime.getTime() - currentDateTime.getTime();
    const timeDifferenceSeconds = Math.floor(timeDifferenceMs / 1000);
    return timeDifferenceSeconds;
  };

  const handleExpiryDateTimeChange = (e: any) => {
    setExpiryDateTime(getTimeDifferenceInSeconds(e.target.value));
    setDate(e.target.value);
  };
  const [date, setDate] = useState();

  return (
    <div className={style["dateContainer"]} style={{ ...styleProps }}>
      <div className={style["label"]}>Expiration By:</div>
      <input
        type="datetime-local"
        id="expiryDateTime"
        name="expiryDateTime"
        value={date}
        onChange={handleExpiryDateTimeChange}
      />
    </div>
  );
};
