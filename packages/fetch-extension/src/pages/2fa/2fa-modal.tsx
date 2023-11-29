import React, { useEffect, useRef, useState } from "react";
import { Input } from "@components/form";
import style from "./style.module.scss";

export const TwoFAInputModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: string) => void;
}) => {
  const [inputValues, setInputValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // Focus on the first input when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/\D/g, "").slice(0, 1);

    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = sanitizedValue;
      return newValues;
    });
    debugger;
    // Auto-focus on the next input
    if (index < inputValues.length - 1 && sanitizedValue !== "") {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleSubmit = () => {
    const inputValue = inputValues.join("");

    if (inputValue.length === 6) {
      onSubmit(inputValue);
    } else {
      alert("Please enter a valid six-digit input.");
    }
  };

  return (
    <React.Fragment>
      <div className={style["overlay"]} />
      <div className={style["popup"]}>
        <h4>2FA Verification</h4>
        <section>
          <p
            style={{ whiteSpace: "pre-wrap" }}
            className={style["textContainer"]}
          >
            Check your registered device for the code
          </p>
        </section>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {inputValues.map((value, index) => (
            <Input
              inputGroupClassName={style["inputText"]}
              key={index}
              type="text"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              maxLength={1}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        <div className={style["buttonContainer"]}>
          <button type="button" onClick={onClose}>
            Close
          </button>
          <button type="button" className={style["btn"]} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
