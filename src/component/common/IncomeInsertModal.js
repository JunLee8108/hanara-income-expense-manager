import "./IncomeInsertModal.css";
import { incomeTopTabList } from "../util/data";
import { generateRandomID, isIDUnique } from "../util/assignID";

import { Fragment } from "react";

export default function IncomeInsertModal({
  setDataInsert,
  month,
  setIncomeData,
  incomeData,
}) {
  const handleBg = (e) => {
    const target = document.querySelector(".item-input-bg");
    if (e.target === target) {
      setDataInsert(false);
    }
  };

  const handleForm = (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const body = {};
    for (const [key, value] of form.entries()) {
      body[key] = value;
    }

    let uniqueID;

    if (incomeData.length === 0) {
      uniqueID = generateRandomID();
    } else {
      do {
        uniqueID = generateRandomID();
      } while (!isIDUnique(uniqueID, incomeData));
    }

    const floatTotal = parseFloat(body.total);

    let floatTax;
    let floatTip;
    let floatService;

    if (body.tax === "") {
      floatTax = 0;
    } else {
      floatTax = parseFloat(body.tax);
    }

    if (body.tip === "") {
      floatTip = 0;
    } else {
      floatTip = parseFloat(body.tip);
    }

    if (body.service === "") {
      floatService = 0;
    } else {
      floatService = parseFloat(body.service);
    }

    const netTotal = parseFloat(
      (floatTotal + floatTax + floatTip - floatService).toFixed(2)
    );

    const data = {
      id: uniqueID,
      date: month,
      from: body.from,
      total: floatTotal,
      tax: floatTax,
      tip: floatTip,
      service: floatService,
      netTotal: netTotal,
      memo: body.memo.trim(),
    };

    const copy = [...incomeData];
    copy.push(data);

    setIncomeData(copy);

    // FINISH //
    setDataInsert(false);
  };

  return (
    <>
      <div className="item-input-bg" onClick={handleBg}>
        <form
          className="item-input-container animation"
          onSubmit={handleForm}
          //   onClick={() => setShowSuggestions(false)}
        >
          <button
            className="item-input-closebtn"
            type="button"
            onClick={() => setDataInsert(false)}
          >
            X
          </button>

          <h2 className="item-input-header">Insert Item</h2>

          <div className="item-input-center-container">
            {/* LEFT */}
            <div className="item-input-left">
              <div className="item-input-box">
                <label htmlFor="date">Date</label>
                <input
                  className="item-input"
                  id="date"
                  name="date"
                  value={month}
                  disabled="disabled"
                ></input>
              </div>

              <div className="item-input-box">
                <label htmlFor="from">* From (출처)</label>
                <select
                  className="item-select"
                  id="from"
                  defaultValue=""
                  required
                  name="from"
                >
                  <option value="" disabled>
                    Please Choose...
                  </option>
                  {incomeTopTabList.map((content, index) => {
                    return <option key={index}>{content}</option>;
                  })}
                </select>
              </div>

              <div className="item-input-box">
                <label htmlFor="total">* Total (전체)</label>
                <input
                  className="item-input"
                  id="total"
                  placeholder="$"
                  name="total"
                  required
                ></input>
              </div>

              <div className="item-input-box">
                <label htmlFor="fee">Tax (세금)</label>
                <input
                  className="item-input"
                  id="tax"
                  placeholder="$"
                  name="tax"
                ></input>
              </div>
            </div>

            {/* RIGHT */}
            <div className="item-input-right">
              <div className="item-input-box">
                <label htmlFor="tip">Tip (팁)</label>
                <input
                  className="item-input"
                  id="tip"
                  placeholder="$"
                  name="tip"
                ></input>
              </div>

              <div className="item-input-box">
                <label htmlFor="service">Service (수수료)</label>
                <input
                  className="item-input"
                  id="service"
                  placeholder="$"
                  name="service"
                ></input>
              </div>
            </div>
          </div>

          <p className="item-input-required">
            <strong>(* required field)</strong>
          </p>

          <div className="item-input-box input-textarea">
            <label htmlFor="fee">Memo (메모)</label>
            <textarea
              id="memo"
              name="memo"
              className="item-input-textarea"
            ></textarea>
          </div>

          <button type="submit" className="item-input-submit">
            SUBMIT
          </button>
        </form>
      </div>
    </>
  );
}
