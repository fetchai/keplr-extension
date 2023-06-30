import { deleteGroup } from "@graphQL/groups-api";
import amplitude from "amplitude-js";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import style from "./style.module.scss";

export const DeleteGroupPopup = ({
  setConfirmAction,
}: {
  setConfirmAction: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleDelete = async () => {
    setProcessing(true);
    const groupId = location.pathname.split("/")[3];
    deleteGroup(groupId);
    setConfirmAction(false);
    amplitude.getInstance().logEvent("Delete group click", {});
    navigate("/chat");
  };

  const handleCancel = () => {
    setConfirmAction(false);
  };

  return (
    <React.Fragment>
      <div className={style["overlay"]} />
      <div className={style["popup"]}>
        <h4>Delete Group</h4>
        <section>
          <p className={style["textContainer"]}>
            You will lose all your messages in this group. This action cannot be
            undone
          </p>
        </section>
        <div className={style["buttonContainer"]}>
          <button type="button" onClick={handleCancel} disabled={processing}>
            Cancel
          </button>
          <button
            type="button"
            className={style["btn"]}
            onClick={handleDelete}
            disabled={processing}
          >
            Delete
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
