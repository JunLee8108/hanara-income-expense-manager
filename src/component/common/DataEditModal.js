import "../../App.css";
import { topTabList } from "../util/data";
import { yearList } from "../util/data";
import { selectMonthOptions } from "../util/data";
import { foodSortList } from "../util/data";

import { Fragment, useState, useEffect, useRef } from "react";

export default function DataEditModal({
  setEditBtn,
  editIndex,
  setExpenseData,
  expenseData,
  setSortBtnActive,
}) {
  const { ipcRenderer } = window.require("electron");

  const [categoryInput, setCategoryInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const yourElement = useRef(null);

  const handleEditform = (e) => {
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
    const intYear = parseInt(body.year);
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

    const copy = [...expenseData];
    const findIndexWithID = copy.findIndex((data) => data.id === editIndex);

    const monthValue = monthConvertToInt(body.month);

    copy[findIndexWithID].month = body.month;
    // copy[editIndex].categoryData = body.category.toUpperCase();
    copy[findIndexWithID].categoryData = categoryInput.toUpperCase();
    copy[findIndexWithID].day = intDay;
    copy[findIndexWithID].amountData = parseFloat(fixedDecimalAmount);
    copy[findIndexWithID].year = intYear;
    copy[findIndexWithID].type = body.from;
    copy[findIndexWithID].sort = body.sort;
    copy[findIndexWithID].date =
      body.year + "-" + pad(monthValue) + "-" + pad(body.day);

    if (copy.length >= 2) {
      sortByDate(copy);
    } else {
      setExpenseData(copy);
    }

    setEditBtn(false);
    setSortBtnActive(-1);
  };

  const pad = (d) => {
    return d < 10 ? "0" + d.toString() : d.toString();
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

  const monthConvertToInt = (p) => {
    const index = selectMonthOptions.findIndex(
      (content) => content.value === p
    );
    return selectMonthOptions[index].id;
  };

  useEffect(() => {
    if (
      categoryInput.length >= 2 &&
      yourElement.current === document.activeElement
    ) {
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

  useEffect(() => {
    setCategoryInput(
      expenseData.filter((data) => data.id === editIndex)[0].categoryData
    );
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className="item-input-bg"
      onClick={(e) => {
        const target = document.querySelector(".item-input-bg");
        if (e.target === target) {
          setEditBtn(false);
        }
      }}
    >
      <form
        className="item-input-container animation"
        onSubmit={handleEditform}
        onClick={() => setShowSuggestions(false)}
      >
        <button
          className="item-input-closebtn"
          type="button"
          onClick={() => setEditBtn(false)}
        >
          X
        </button>
        <h2 className="item-input-header">Edit Item (수정)</h2>

        <div className="item-input-box">
          <label htmlFor="year">* Year (연도)</label>
          <select
            className="item-select"
            id="year"
            name="year"
            defaultValue={
              expenseData.filter((data) => data.id === editIndex)[0].year
            }
          >
            {yearList.map((content, index) => {
              return (
                <option value={content.year} key={index}>
                  {content.year}
                </option>
              );
            })}
          </select>
        </div>

        <div className="item-input-box">
          <label htmlFor="month">* Month (월)</label>
          <select
            className="item-select"
            id="month"
            name="month"
            defaultValue={
              expenseData.filter((data) => data.id === editIndex)[0].month
            }
          >
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
        <div className="item-input-box">
          <label htmlFor="day">* Day</label>
          <input
            className="item-input"
            placeholder="몇일.."
            defaultValue={
              expenseData.filter((data) => data.id === editIndex)[0].day
            }
            name="day"
          ></input>
        </div>

        <div className="item-input-box">
          <label htmlFor="from">* From (출처)</label>
          <select
            className="item-select"
            id="from"
            defaultValue={
              expenseData.filter((data) => data.id === editIndex)[0].type
            }
            required
            name="from"
          >
            {topTabList.map((content, index) => {
              return (
                <Fragment key={index}>
                  {content !== "Overview" ? <option>{content}</option> : null}
                </Fragment>
              );
            })}
          </select>
        </div>

        <div className="item-input-box">
          <label htmlFor="sort">* Sort (종류)</label>
          <select
            className="item-select"
            id="sort"
            defaultValue={
              expenseData.filter((data) => data.id === editIndex)[0].sort ===
              undefined
                ? ""
                : expenseData.filter((data) => data.id === editIndex)[0].sort
            }
            name="sort"
          >
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
              ref={yourElement}
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
            defaultValue={
              expenseData.filter((data) => data.id === editIndex)[0].amountData
            }
            placeholder="$"
            name="amount"
          ></input>
        </div>

        <button type="submit" className="item-input-submit">
          SUBMIT
        </button>
      </form>
    </div>
  );
}
