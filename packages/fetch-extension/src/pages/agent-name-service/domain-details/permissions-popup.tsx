import React from "react";
import style from "../../fetch-name-service/domain-details/style.module.scss";
import style2 from "../../fetch-name-service/explore-domain/style.module.scss";
export const PermissionsPopup = ({
  handleCancel,
  InnerTabName,
}: {
  handleCancel?: any;
  InnerTabName: string;
}) => {
  const handlePermission = () => {
    console.log(InnerTabName.toLocaleLowerCase());
  };
  return (
    <React.Fragment>
      <div className={style["popupCard"]}>
        <h3 style={{ color: "white" }}>Add Permissions</h3>
        <div style={{ width: "245px" }} className={style2["searchContainer"]}>
          <input
            type="text"
            className={style2["searchInput"]}
            placeholder="Enter Address"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {handleCancel && (
            <button
              style={{ marginTop: "10px" }}
              type="button"
              onClick={handleCancel}
            >
              cancel
            </button>
          )}
          <button
            style={{ marginTop: "10px", width: "99.41px", display: "flow" }}
            type="button"
            onClick={() => handlePermission()}
          >
            Add
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
