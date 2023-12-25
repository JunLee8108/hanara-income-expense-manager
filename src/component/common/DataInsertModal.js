import "../../App.css";

import { Fragment, useState, useEffect } from "react";
import { foodSortList, topTabList } from "../util/data";
import { selectMonthOptions } from "../util/data";
import { generateRandomID } from "../util/assignID";
import { isIDUnique } from "../util/assignID";

export default function DataInsertModal({
  setDataInsert,
  activeIndex,
  setDate,
  date,
  year,
  month,
  expenseData,
  setExpenseData,
  setSortBtnActive,
  setFilterSort,
  setFilterFrom,
}) {
  const { ipcRenderer } = window.require("electron");

  const [categoryInput, setCategoryInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleform = (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const body = {};
    for (const [key, value] of form.entries()) {
      body[key] = value;
    }

    if (body.amount.includes(",")) {
      ipcRenderer.send(
        "show-error-dialog",
        "Invalid amount! (올바르지 않은 금액)"
      );
      return;
    }

    const intDay = parseInt(body.day);
    const fixedDecimalAmount = parseFloat(body.amount).toFixed(2);

    if (
      typeof intDay !== "number" ||
      isNaN(intDay) ||
      intDay > 31 ||
      intDay < 1
    ) {
      ipcRenderer.send(
        "show-error-dialog",
        "Invalid day! (올바르지 않은 날짜)"
      );
      return;
    }

    if (
      typeof parseFloat(fixedDecimalAmount) !== "number" ||
      isNaN(parseFloat(fixedDecimalAmount))
    ) {
      ipcRenderer.send(
        "show-error-dialog",
        "Invalid amount! (올바르지 않은 금액)"
      );
      return;
    }

    const data = {
      date: date + "-" + pad(intDay),
      year: year,
      month: month,
      day: intDay,
      type: topTabList[activeIndex],
      sort: body.sort,
      categoryData: categoryInput.toUpperCase(),
      // categoryData: body.category.toUpperCase(),
      amountData: parseFloat(fixedDecimalAmount),
      id: "",
    };

    if (topTabList[activeIndex] === "Overview") {
      data.type = body.from;
    }

    if (month === "All") {
      const monthValue = monthConvertToInt(body.month);
      data.month = body.month;
      data.date = year + "-" + pad(monthValue) + "-" + pad(intDay);

      setDate(year + "-" + pad(monthValue));
    } else {
      const monthValue = monthConvertToInt(month);
      setDate(year + "-" + pad(monthValue));
    }

    const copy = [...expenseData];

    let uniqueID;
    do {
      uniqueID = generateRandomID();
    } while (!isIDUnique(uniqueID, copy));

    data.id = uniqueID;

    copy.push(data);

    if (copy.length >= 2) {
      sortByDate(copy);
    } else {
      setExpenseData(copy);
    }

    setDataInsert(false);
    setSortBtnActive(-1);
    setFilterSort("");
    setFilterFrom("");

    window.scrollTo(0, document.body.scrollHeight);
  };

  const pad = (d) => {
    return d < 10 ? "0" + d.toString() : d.toString();
  };

  const monthConvertToInt = (p) => {
    const index = selectMonthOptions.findIndex(
      (content) => content.value === p
    );
    return selectMonthOptions[index].id;
  };

  const sortByDate = (copy) => {
    copy.sort((a, b) => {
      let fa = a.sort.toLowerCase();
      let fb = b.sort.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });

    copy.sort((a, b) => {
      let fa = a.type.toLowerCase();
      let fb = b.type.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });

    copy.sort(
      (a, b) =>
        parseInt(a.date.replaceAll("-", "")) -
        parseInt(b.date.replaceAll("-", ""))
    );

    setExpenseData(copy);
  };

  useEffect(() => {
    if (categoryInput.length >= 2) {
      // const match = categoryInput.substring(0, 2).toUpperCase();

      const filteredSuggestions = expenseData
        .filter((item) =>
          item.categoryData
            .replace(" ", "")
            .toLocaleLowerCase()
            .includes(categoryInput.replace(" ", "").toLocaleLowerCase())
        )
        .map((item) => item.categoryData.toUpperCase()); // Extract the categoryData

      const uniqueSuggestions = Array.from(new Set(filteredSuggestions));

      setSuggestions(uniqueSuggestions);

      if (filteredSuggestions.length > 0) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [categoryInput, expenseData]);

  return (
    <div
      className="item-input-bg"
      onClick={(e) => {
        const target = document.querySelector(".item-input-bg");
        if (e.target === target) {
          setDataInsert(false);
        }
      }}
    >
      <form
        className="item-input-container animation"
        onSubmit={handleform}
        onClick={() => setShowSuggestions(false)}
      >
        <button
          className="item-input-closebtn"
          type="button"
          onClick={() => setDataInsert(false)}
        >
          X
        </button>

        <h2 className="item-input-header">Insert Item</h2>

        {month === "All" ? (
          <>
            <div className="item-input-box">
              <label htmlFor="year">Year (연도)</label>
              <input
                className="item-input"
                defaultValue={year}
                disabled={true}
              ></input>
            </div>

            <div className="item-input-box">
              <label htmlFor="month">* Month (월)</label>
              <select
                className="item-select"
                id="month"
                defaultValue=""
                required
                name="month"
              >
                <option value="" disabled>
                  Please Choose...
                </option>
                {selectMonthOptions.map((content, index) => {
                  return (
                    <Fragment key={index}>
                      {content.name !== "All (전체)" ? (
                        <option value={content.value}>{content.name}</option>
                      ) : null}
                    </Fragment>
                  );
                })}
              </select>
            </div>
          </>
        ) : (
          <div className="item-input-box">
            <label htmlFor="date">Date</label>
            <input
              className="item-input"
              id="date"
              value={date}
              disabled="disabled"
            ></input>
          </div>
        )}

        <div className="item-input-box">
          <label htmlFor="day">* Day</label>
          <input
            className="item-input"
            placeholder="몇일.."
            name="day"
            required
          ></input>
        </div>
        {topTabList[activeIndex] === "Overview" ? (
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
              {topTabList.map((content, index) => {
                return (
                  <Fragment key={index}>
                    {content !== "Overview" ? <option>{content}</option> : null}
                  </Fragment>
                );
              })}
            </select>
          </div>
        ) : (
          <div className="item-input-box">
            <label htmlFor="from">From (출처)</label>
            <input
              className="item-input"
              id="from"
              value={topTabList[activeIndex]}
              disabled={true}
            ></input>
          </div>
        )}

        <div className="item-input-box">
          <label htmlFor="sort">* Sort (분류)</label>
          <select className="item-select" id="sort" defaultValue="" name="sort">
            <option value="" disabled>
              Please Choose...
            </option>
            {foodSortList.map((content, index) => {
              return (
                <Fragment key={index}>
                  <option>{content.name}</option>
                </Fragment>
              );
            })}
          </select>
        </div>

        <div className="item-input-box">
          <label htmlFor="category">* Category (품목)</label>
          <div className="item-input-suggestion">
            <input
              className="item-input"
              id="category"
              placeholder="품목.."
              name="category"
              type="text"
              value={categoryInput}
              onChange={(e) => {
                setCategoryInput(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
            ></input>
            {showSuggestions && (
              <div className="suggestions-container">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={(e) => {
                      setCategoryInput(suggestion);
                      e.stopPropagation();

                      setTimeout(() => {
                        setShowSuggestions(false);
                        setSuggestions([]);
                      }, 50);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="item-input-box">
          <label htmlFor="amount">* Amount (가격)</label>
          <input
            className="item-input"
            id="amount"
            placeholder="$"
            name="amount"
            required
          ></input>
        </div>

        <button type="submit" className="item-input-submit">
          SUBMIT
        </button>
      </form>
    </div>
  );
}
