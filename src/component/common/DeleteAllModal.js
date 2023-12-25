import "../../App.css";
import { yearList } from "../util/data";

export default function DeleteAllModal({
  setDeleteBtnClick,
  expenseData,
  setExpenseData,
}) {
  const { ipcRenderer } = window.require("electron");

  const handleDeleteModal = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {};
    for (const [key, value] of form.entries()) {
      body[key] = value;
    }

    if (body.passcode === process.env.REACT_APP_HANARA) {
      handleDeleteAllBtn(body.year);
    } else {
      ipcRenderer.send(
        "show-warning-dialog",
        "Invalid Passcode! (잘못된 패스코드 입니다)"
      );
    }
  };

  const handleDeleteAllBtn = (year) => {
    if (year === "All") {
      setDeleteBtnClick(false);

      let copy = [...expenseData];
      copy = [];

      setExpenseData(copy);

      ipcRenderer.send(
        "show-info-dialog",
        "All data have been removed. (모든 데이터가 제거 되었습니다.)"
      );
    } else {
      let copy = [...expenseData].filter((a) => a.year === parseInt(year));

      if (copy.length > 0) {
        setDeleteBtnClick(false);
        const copyForSet = [...expenseData].filter(
          (a) => a.year !== parseInt(year)
        );
        setExpenseData(copyForSet);

        ipcRenderer.send(
          "show-info-dialog",
          `${year} data have been removed. (${year} 데이터가 제거 되었습니다.)`
        );
      } else {
        ipcRenderer.send(
          "show-warning-dialog",
          "No data to delete! (데이터가 존재하지 않습니다.)"
        );
      }
    }
  };

  return (
    <div
      className="item-input-bg"
      onClick={(e) => {
        const target = document.querySelector(".item-input-bg");
        if (e.target === target) {
          setDeleteBtnClick(false);
        }
      }}
      style={{ flexDirection: "column" }}
    >
      <div className="delete-modal-close-btn-container">
        <button
          className="delete-modal-close-btn"
          onClick={() => setDeleteBtnClick(false)}
        >
          X
        </button>
      </div>
      <div className="delete-modal-container animation">
        <h2 className="delete-modal-header">
          Please enter the code to <span style={{ color: "red" }}>DELETE</span>{" "}
          all data.
        </h2>

        <div className="delete-modal-btn-container">
          <form onSubmit={handleDeleteModal} className="delete-modal-form">
            <select className="delete-modal-select" name="year" id="year">
              <option value="All">All</option>
              {yearList.map((content, index) => {
                return (
                  <option key={index} value={content.year}>
                    {content.year}
                  </option>
                );
              })}
            </select>
            <input
              type="password"
              required
              name="passcode"
              id="passcode"
              className="delete-modal-input"
            ></input>
            <div className="delete-modal-submit-btn-container">
              <button type="submit" className="delete-modal-submit-btn">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
