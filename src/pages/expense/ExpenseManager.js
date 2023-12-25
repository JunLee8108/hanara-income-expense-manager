import "./ExpenseManager.css";

import {
  foodSortList,
  topTabList,
  navbarList,
  yearList,
  selectMonthOptions,
  sortBtnList,
} from "../../component/util/data";

import ExpenseDashboard from "./ExpenseDashboard";
import DataInsertModal from "../../component/common/DataInsertModal";
import DataEditModal from "../../component/common/DataEditModal";
import DeleteAllModal from "../../component/common/DeleteAllModal";
import ReceiptScanningModal from "../../component/common/ReceiptScanningModal";

import {
  Fragment,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation } from "react-router-dom";

function ExpenseManager({ sortByDate }) {
  const { ipcRenderer } = window.require("electron");

  const [activeIndex, setActiveIndex] = useState(0);

  const [year, setYear] = useState(2023);
  const [month, setMonth] = useState("All");
  const [date, setDate] = useState("");

  const [expenseData, setExpenseData] = useState([]);
  const [isDataInsert, setDataInsert] = useState(false);

  const [isEditBtn, setEditBtn] = useState(false);
  const [editIndex, setEditindex] = useState(-1);

  const [sticky, setSticky] = useState(false);
  const stickyRef = useRef(null);

  const [sortBtnActive, setSortBtnActive] = useState(-1);
  const [sortBtnAnimation, setSortBtnAnimation] = useState("");

  const [navbarActiveIndex, setNavbarActiveIndex] = useState(0);
  const [isDashboardVisible, setDashboardVisible] = useState(false);

  const [isDeleteBtnClick, setDeleteBtnClick] = useState(false);

  const [isFilterOn, setFilterOn] = useState(false);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterSort, setFilterSort] = useState("");

  const [searchInput, setSearchInput] = useState("");

  const [isReceiptScanning, setReceiptScanning] = useState(false);

  const [URLIncomeData, setURLIncomeData] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const yourElement = useRef(null);

  const handleNavigate = () => {
    sortByDate(expenseData, "off", setExpenseData);
    navigate("/income", {
      state: { value: expenseData, incomeData: URLIncomeData },
    });
  };

  const monthConvertToInt = (p) => {
    const index = selectMonthOptions.findIndex(
      (content) => content.value === p
    );
    return selectMonthOptions[index].id;
  };

  //* HANDLE TOP TAB *//
  const handleTopTab = (index) => () => {
    setActiveIndex(index);
    setSortBtnActive(-1);
    setFilterFrom("");
    setFilterSort("");
    setFilterOn(false);
    setSearchInput("");

    sortByDate(expenseData, "on", setExpenseData);
  };

  //* HANDLE YEAR TAB *//
  const hanldeYearTap = (e) => {
    setActiveIndex(0);
    setSortBtnActive(-1);
    setYear(parseInt(e.target.value));
    setFilterFrom("");
    setFilterSort("");
    setFilterOn(false);
    setSearchInput("");

    if (expenseData.length > 1) {
      sortByDate(expenseData, "on", setExpenseData);
    }

    setMonth("All");
  };

  //* HANDLE MONTH TAB *//
  const handleMonthTap = (e) => {
    setActiveIndex(0);
    setSortBtnActive(-1);
    setMonth(e.target.value);
    setFilterFrom("");
    setFilterSort("");
    setFilterOn(false);
    setSearchInput("");

    if (expenseData.length > 1) {
      sortByDate(expenseData, "on", setExpenseData);
    }

    if (e.target.value !== "All") {
      const monthValue = monthConvertToInt(e.target.value);
      setDate(year + "-" + pad(monthValue));
    }
  };

  const handleDataInsert = () => {
    setDataInsert(true);
    setFilterOn(false);
    setSearchInput("");
  };

  const handleFilterButton = () => {
    if (expenseData.length > 0 && searchInput.length === 0) {
      setFilterOn((current) => !current);
    }
  };

  const handleFilterReset = () => {
    setFilterFrom("");
    setFilterSort("");
  };

  const handleReceiptScanning = () => {
    setReceiptScanning(true);
    setFilterOn(false);
    setSearchInput("");

    document.body.style.overflow = "hidden";
  };

  const pad = (d) => {
    return d < 10 ? "0" + d.toString() : d.toString();
  };

  const handleDeleteItemBtn = (id) => () => {
    const copy = [...expenseData];
    const findIndexWithID = copy.findIndex((data) => data.id === id);
    copy.splice(findIndexWithID, 1);
    setExpenseData(copy);
    setFilterOn(false);
  };

  const handleEditBtn = (id) => () => {
    setEditBtn(true);
    setEditindex(id);
    setFilterOn(false);
  };

  const handleSortBtn = (e) => {
    setSearchInput("");

    const eachYearLength = expenseData.filter((x) => x.year === year);
    const eachMonthLength = expenseData.filter(
      (x) =>
        x.month === month &&
        x.type === topTabList[activeIndex] &&
        x.year === year
    ).length;
    const monthAllLength = expenseData.filter(
      (x) => x.type === topTabList[activeIndex] && x.year === year
    ).length;

    if (topTabList[activeIndex] === "Overview") {
      if (eachYearLength.length < 2) {
        ipcRenderer.send(
          "show-warning-dialog",
          "No sort to data! (정렬하기 위한 충분한 데이터가 없습니다.)"
        );
        return;
      }
    } else {
      if (month !== "All") {
        if (eachMonthLength < 2) {
          ipcRenderer.send(
            "show-warning-dialog",
            "No sort to data! (정렬하기 위한 충분한 데이터가 없습니다.)"
          );
          return;
        }
      } else {
        if (monthAllLength < 2) {
          ipcRenderer.send(
            "show-warning-dialog",
            "No sort to data! (정렬하기 위한 충분한 데이터가 없습니다.)"
          );
          return;
        }
      }
    }

    const copy = [...expenseData];

    setSortBtnActive(parseInt(e.target.value));
    setSortBtnAnimation("td-animation");

    setTimeout(() => {
      setSortBtnAnimation("");
    }, 400);

    setTimeout(() => {
      const name = e.target.value;

      // Date: 1 to 31
      if (name === "0") {
        sortByDate(copy, "off", setExpenseData);
      }
      // FROM: A to Z
      else if (name === "1") {
        sortByFrom(copy);
      }
      // SORT: A to Z
      else if (name === "2") {
        sortBySort(copy);
      }
      // CATEGORY: A to Z
      else if (name === "3") {
        sortByCategory(copy);
      }
      // AMOUNT: Low to High
      else if (name === "4") {
        sortByAmount(copy, "low");
      }
      // AMOUNT: High to Low
      else if (name === "5") {
        sortByAmount(copy, "high");
      }

      setExpenseData(copy);
    }, 430);
  };

  const handleNavbarBtn = (index, name) => () => {
    setNavbarActiveIndex(index);
    setFilterFrom("");
    setFilterSort("");
    setFilterOn(false);
    setSearchInput("");

    if (name === "Dashboard") {
      setDashboardVisible(true);
    } else {
      setDashboardVisible(false);
    }
  };

  //* ITEM TOTAL AMOUNT *//
  const total = useMemo(() => {
    return expenseData
      .filter((item) => {
        return (
          (item.type === topTabList[activeIndex] ||
            topTabList[activeIndex] === "Overview") &&
          (item.month === month || month === "All") &&
          item.year === year
        );
      })
      .reduce((total, item) => total + item.amountData || 0, 0)
      .toFixed(2);
  }, [expenseData, activeIndex, month, year]);

  //* ITEM TOTAL COUNT *//
  const itemCount = useMemo(() => {
    return expenseData
      .filter((item) => {
        return (
          (item.type === topTabList[activeIndex] ||
            topTabList[activeIndex] === "Overview") &&
          (item.month === month || month === "All") &&
          item.year === year
        );
      })
      .reduce((total, item) => total + 1, 0);
  }, [expenseData, activeIndex, month, year]);

  //*  HANDLE DATA INSERT STICKY *//
  useEffect(() => {
    const handleScroll = () => {
      const stickyElement = stickyRef.current;
      if (stickyElement) {
        const offsetTop = stickyElement.getBoundingClientRect().top;
        const isSticky = offsetTop <= 0;

        if (isSticky) {
          setSticky(true);
        } else {
          setSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //* SAVE DATA AS A JSON FILE *//
  const saveDataToFile = () => {
    ipcRenderer.send("save-data", { expenseData, URLIncomeData });
  };

  const loadDataFromFile = () => {
    ipcRenderer.send("load-data");
  };

  useEffect(() => {
    const handleDataLoad = (event, data) => {
      if (data) {
        const { expenseData, URLIncomeData } = data;

        sortByDate(expenseData, "on", setExpenseData);
        setURLIncomeData(URLIncomeData);
      }
    };

    ipcRenderer.on("loaded-data", handleDataLoad);

    return () => {
      ipcRenderer.removeListener("loaded-data", handleDataLoad);
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Save data as a excel file
   */
  const exportDataAsExcel = () => {
    if (expenseData.length === 0 && URLIncomeData.length === 0) {
      ipcRenderer.send(
        "show-warning-dialog",
        "No data to export! (데이터가 존재하지 않습니다.)"
      );
      return;
    }

    sortByDate(expenseData, "off", setExpenseData);

    const combinedData = {
      expenseData: expenseData.length > 0 ? expenseData : null,
      URLIncomeData: URLIncomeData.length > 0 ? URLIncomeData : null,
    };

    ipcRenderer.send("export-data-to-excel", combinedData);
  };

  /**
   * Improt data based on a excel file
   */
  const selectExcelFile = () => {
    ipcRenderer.send("open-file-dialog-for-excel");
  };

  useEffect(() => {
    ipcRenderer.on("excel-data", (event, expenseData, URLIncomeData) => {
      if (expenseData && expenseData.length > 0) {
        sortByDate(expenseData, "on", setExpenseData);
      }

      if (URLIncomeData && URLIncomeData.length > 0) {
        setURLIncomeData(URLIncomeData);
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    return () => {
      ipcRenderer.removeAllListeners("excel-data");
    };
    // eslint-disable-next-line
  }, []);

  const sortByFrom = useCallback((copy) => {
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

    copy.sort(
      (a, b) =>
        parseInt(a.date.replaceAll("-", "")) -
        parseInt(b.date.replaceAll("-", ""))
    );

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
  }, []);

  const sortBySort = useCallback((copy) => {
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
  }, []);

  //* SORT BY CATEGORY *//
  const sortByCategory = useCallback((copy) => {
    copy.sort(
      (a, b) =>
        parseInt(b.date.replaceAll("-", "")) -
        parseInt(a.date.replaceAll("-", ""))
    );
    copy.sort((a, b) => (a.categoryData > b.categoryData ? 1 : -1));
  }, []);

  //* SORT BY AMOUNT *//
  const sortByAmount = useCallback((copy, highOrLow) => {
    if (highOrLow === "low") {
      copy.sort(
        (a, b) =>
          parseInt(a.date.replaceAll("-", "")) -
          parseInt(b.date.replaceAll("-", ""))
      );

      copy.sort((a, b) => parseFloat(a.amountData) - parseFloat(b.amountData));
    } else {
      copy.sort(
        (a, b) =>
          parseInt(a.date.replaceAll("-", "")) -
          parseInt(b.date.replaceAll("-", ""))
      );

      copy.sort((a, b) => parseFloat(b.amountData) - parseFloat(a.amountData));
    }
  }, []);

  //* FILTERED DATA *//
  const filteredData = useMemo(() => {
    return expenseData.filter((item) => {
      return (
        (!filterFrom || item.type === filterFrom) &&
        (!filterSort || item.sort === filterSort)
      );
    });
  }, [expenseData, filterFrom, filterSort]);

  //* FILTERED DATA TOTAL AMOUNT *//
  const filteredDataTotal = useMemo(() => {
    return filteredData
      .filter((item) => {
        return (
          (item.type === topTabList[activeIndex] ||
            topTabList[activeIndex] === "Overview") &&
          (item.month === month || month === "All") &&
          item.year === year
        );
      })
      .reduce((total, item) => total + parseFloat(item.amountData || 0), 0)
      .toFixed(2);
  }, [filteredData, activeIndex, month, year]);

  //* FILTERED DATA TOTAL COUNT *//
  const filteredDataTotalCount = useMemo(() => {
    return filteredData
      .filter((item) => {
        return (
          (item.type === topTabList[activeIndex] ||
            topTabList[activeIndex] === "Overview") &&
          (item.month === month || month === "All") &&
          item.year === year
        );
      })
      .reduce((total, item) => total + 1, 0);
  }, [filteredData, activeIndex, month, year]);

  //* SEARCH ITEM *//
  const filteredSearch = useMemo(() => {
    return expenseData.filter(
      (p) =>
        p.categoryData
          .replace(" ", "")
          .toLocaleLowerCase()
          .includes(searchInput.replace(" ", "").toLocaleLowerCase()) ||
        p.sort
          .replace(" ", "")
          .toLocaleLowerCase()
          .includes(searchInput.replace(" ", "").toLocaleLowerCase()) ||
        p.type
          .replace(" ", "")
          .toLocaleLowerCase()
          .includes(searchInput.replace(" ", "").toLocaleLowerCase())
    );
  }, [searchInput, expenseData]);

  //* SEARCH ITEM TOTAL AMOUNT *//
  const filteredSearchTotal = useMemo(() => {
    return filteredSearch
      .reduce((total, item) => total + parseFloat(item.amountData || 0), 0)
      .toFixed(2);
  }, [filteredSearch]);

  //* SEARCH ITEM TOTAL COUNT *//
  const filteredSearchTotalCount = useMemo(() => {
    return filteredSearch.reduce((total, item) => total + 1, 0);
  }, [filteredSearch]);

  useEffect(() => {
    if (expenseData.length === 0) {
      setFilterFrom("");
      setFilterSort("");
      setFilterOn(false);
    }
  }, [expenseData.length]);

  useEffect(() => {
    if (yourElement.current === document.activeElement) {
      setFilterOn(false);
    }
  }, [searchInput]);

  useEffect(() => {
    if (location.state) {
      const expenseInfo = location.state.value;
      const incomeData = location.state.incomeData;

      if (expenseInfo.length > 0) {
        setExpenseData(expenseInfo);
      }

      if (incomeData.length > 0) {
        setURLIncomeData(incomeData);
      }
    }
  }, [location.state]);

  return (
    <>
      <div className="app">
        <div className="save-load-btn-container">
          <button onClick={saveDataToFile} className="save-load-btn">
            Save Data (저장)
            <FontAwesomeIcon
              icon="fa-solid fa-upload"
              style={{ marginLeft: "5px" }}
            />
          </button>

          <button onClick={handleNavigate} className="income-navigate-button">
            Income Manager
          </button>

          <button onClick={loadDataFromFile} className="save-load-btn">
            Load Data (불러오기)
            <FontAwesomeIcon
              icon="fa-solid fa-download"
              style={{ marginLeft: "5px" }}
            />
          </button>
        </div>

        <h1 className="header">Expense Manager</h1>
        <h3 className="sub-header">Hanara Sushi</h3>

        <div className="navbar-container">
          {navbarList.map((content, index) => {
            return (
              <button
                className={`navbar-btn ${
                  navbarActiveIndex === index ? "navbar-btn-active" : null
                }`}
                onClick={handleNavbarBtn(index, content.name)}
                key={index}
              >
                {content.name}
                {content.icon}
              </button>
            );
          })}
        </div>

        <div className="receipt-scanning-container">
          <button
            className="receipt-scanning-btn"
            onClick={handleReceiptScanning}
          >
            Receipt Scanning
            <FontAwesomeIcon
              icon="fa-solid fa-receipt"
              style={{ marginLeft: "5px" }}
              size="lg"
            />
          </button>
        </div>

        {/* SELECT MONTH AND YEAR */}
        <div className="month-year-container">
          <label htmlFor="yearSelect">*Year :</label>
          <select
            id="yearSelect"
            name="year"
            className="year"
            onChange={hanldeYearTap}
          >
            {yearList.map((content, index) => {
              return (
                <option value={content.year} key={index}>
                  {content.year}
                </option>
              );
            })}
          </select>

          <label htmlFor="monthSelect">*Month :</label>
          <select
            id="monthSelect"
            name="month"
            className="month"
            value={month}
            onChange={handleMonthTap}
          >
            {selectMonthOptions.map((content, index) => {
              return (
                <option value={content.value} key={index}>
                  {content.name}
                </option>
              );
            })}
          </select>
        </div>

        {isDashboardVisible ? (
          <ExpenseDashboard
            expenseData={expenseData}
            selectedYear={year.toString()}
            selectedMonth={month}
          />
        ) : (
          <div className="table-content-container animation">
            {/* TAP CONTAINER - COSTCO, SAM's ...  */}
            <div className="top-tab-container">
              {topTabList.map((content, index) => {
                return (
                  <button
                    className={`top-tab-button ${
                      activeIndex === index ? "active" : null
                    }`}
                    key={index}
                    onClick={handleTopTab(index)}
                  >
                    {content}
                  </button>
                );
              })}
            </div>

            {/* DATA INSERT BUTTON */}
            <div className="item-insert-container" ref={stickyRef}>
              <button
                className={`item-insert-button ${
                  sticky ? "item-insert-button-sticky" : null
                }`}
                onClick={handleDataInsert}
              >
                * INSERT DATA (데이터 삽입) *
              </button>
            </div>

            {/* MAIN CONTAINER TO SHOW THE DATA */}
            <div className="main-container">
              <h1 className="main-header">
                <span className="main-year">{year} - </span> {month}
                <FontAwesomeIcon
                  icon="fa-regular fa-calendar"
                  style={{ marginLeft: "10px" }}
                  size="sm"
                />
              </h1>

              <h2 className="main-sub-header">{topTabList[activeIndex]}</h2>

              <div className="item-total-count-container">
                <h3
                  className="item-count"
                  style={{ textAlign: "center", fontSize: "1rem" }}
                >
                  {filterFrom || filterSort
                    ? `${filteredDataTotalCount} items`
                    : `${itemCount} items`}
                </h3>
              </div>

              {/* FILTER */}
              <div className="main-filter-container">
                <button
                  className={
                    isFilterOn || filterSort || filterFrom
                      ? "main-filter-btn main-filter-btn-active"
                      : "main-filter-btn"
                  }
                  id="filter"
                  onClick={handleFilterButton}
                >
                  Filter (필터)
                </button>

                <div
                  className={
                    isFilterOn
                      ? "main-filter-select-container main-filter-select-container-active flash"
                      : "main-filter-select-container"
                  }
                >
                  <div className="main-filter-close-btn-container">
                    <button
                      className="main-filter-close-btn"
                      onClick={() => setFilterOn(false)}
                    >
                      X
                    </button>
                  </div>

                  <h2 className="main-filter-header">FILTER</h2>

                  <label htmlFor="filter-from">From:</label>
                  <select
                    className="main-filter-select"
                    id="filter-from"
                    onChange={(e) => setFilterFrom(e.target.value)}
                    value={filterFrom}
                  >
                    <option value="">Please Choose..</option>
                    {topTabList.map((content, index) => {
                      return (
                        <Fragment key={index}>
                          {content !== "Overview" ? (
                            <option value={content}>{content}</option>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </select>

                  <label htmlFor="filter-sort">Sort:</label>
                  <select
                    className="main-filter-select"
                    id="filter-sort"
                    onChange={(e) => setFilterSort(e.target.value)}
                    value={filterSort}
                  >
                    <option value="">Please Choose..</option>
                    {foodSortList.map((content, index) => {
                      return (
                        <option key={index} value={content.name}>
                          {content.name}
                        </option>
                      );
                    })}
                  </select>

                  <button
                    onClick={handleFilterReset}
                    className="main-filter-reset-btn"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {filterFrom || filterSort ? (
                <p className="main-filter-on">* FILTER IS ON *</p>
              ) : null}

              <p className="main-filter-on on-from">
                {filterFrom ? <>{filterFrom}</> : null}
                {filterFrom && filterSort ? <> & </> : null}
                {filterSort ? <>{filterSort}</> : null}
              </p>

              <div className="main-sort-icon-delete-container">
                {/* SEARCH */}
                <div className="main-search-container">
                  <label htmlFor="search-input">
                    <FontAwesomeIcon
                      icon="fa-solid fa-magnifying-glass"
                      style={{ marginRight: "11px" }}
                    />
                  </label>

                  <input
                    type="search"
                    id="search-input"
                    ref={yourElement}
                    placeholder="Search.."
                    className="main-search-input"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  ></input>
                </div>

                {/* SORT */}
                <div className="main-sort-icon-container">
                  <label htmlFor="sort">
                    <FontAwesomeIcon
                      icon="fa-solid fa-sort"
                      size="lg"
                      className="main-sort-icon"
                    />
                  </label>

                  <select
                    className="main-sort-selection"
                    id="sort"
                    value={sortBtnActive}
                    onChange={handleSortBtn}
                  >
                    <option value={-1} disabled>
                      Sort by (분류)
                    </option>
                    {sortBtnList.map((content, index) => {
                      return (
                        <option value={content.id} key={index}>
                          {content.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* SEARCH CONTAINER */}
                {searchInput.length > 0 && (
                  <div className="search-result-container">
                    <h1 className="search-result-header">
                      Search Result{" "}
                      <span style={{ fontSize: "1.2rem" }}>
                        ({filteredSearch.length} results)
                      </span>
                    </h1>

                    <table
                      className={`td-non-animation ${sortBtnAnimation}`}
                      style={{
                        width: "95%",
                        borderRadius: "unset",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ borderRadius: "unset" }}>Date</th>
                          <th>From</th>
                          <th>Sort</th>
                          <th>Category</th>
                          <th>Amount</th>
                          <th>Edit</th>
                          <th style={{ borderRadius: "unset" }}>Delete</th>
                        </tr>
                      </thead>

                      {filteredSearch.map((content, index) => {
                        return (
                          <Fragment key={index}>
                            <>
                              <tbody>
                                <tr>
                                  <td>{content.date}</td>
                                  <td style={{ whiteSpace: "normal" }}>
                                    {content.type}
                                  </td>
                                  <td>{content.sort}</td>
                                  <td>{content.categoryData}</td>
                                  <td>
                                    ${" "}
                                    {parseFloat(
                                      content.amountData
                                    ).toLocaleString("en-US", {
                                      // minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td>
                                    <button
                                      onClick={handleEditBtn(content.id)}
                                      className="item-edit-btn"
                                    >
                                      EDIT
                                    </button>
                                  </td>
                                  <td>
                                    <button
                                      onClick={handleDeleteItemBtn(content.id)}
                                      className="item-delete-btn"
                                    >
                                      X
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </>
                          </Fragment>
                        );
                      })}
                    </table>
                    <div className="item-total-count-container">
                      <h2 className="item-total" style={{ width: "95%" }}>
                        Total: $
                        {parseFloat(filteredSearchTotal).toLocaleString(
                          "en-US"
                        )}
                      </h2>
                      <h3 className="item-count" style={{ width: "95%" }}>
                        ({filteredSearchTotalCount} items)
                      </h3>
                    </div>
                  </div>
                )}
              </div>

              <table className={`td-non-animation ${sortBtnAnimation}`}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>From</th>
                    <th>Sort</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                {filterFrom || filterSort ? (
                  <>
                    {filteredData.map((content, index) => {
                      return (
                        <Fragment key={index}>
                          {content.amountData !== "" &&
                          (topTabList[activeIndex] === content.type ||
                            topTabList[activeIndex] === "Overview") &&
                          (content.month === month || month === "All") &&
                          content.year === year ? (
                            <>
                              <tbody>
                                <tr>
                                  <td>{content.date}</td>
                                  <td>{content.type}</td>
                                  <td>{content.sort}</td>
                                  <td>{content.categoryData}</td>
                                  <td>
                                    ${" "}
                                    {parseFloat(
                                      content.amountData
                                    ).toLocaleString("en-US", {
                                      // minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td>
                                    <button
                                      onClick={handleEditBtn(content.id)}
                                      className="item-edit-btn"
                                    >
                                      EDIT
                                    </button>
                                  </td>
                                  <td>
                                    <button
                                      onClick={handleDeleteItemBtn(content.id)}
                                      className="item-delete-btn"
                                    >
                                      X
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {expenseData.map((content, index) => {
                      return (
                        <Fragment key={index}>
                          {content.amountData !== "" &&
                          (topTabList[activeIndex] === content.type ||
                            topTabList[activeIndex] === "Overview") &&
                          (content.month === month || month === "All") &&
                          content.year === year ? (
                            <>
                              <tbody>
                                <tr>
                                  <td>{content.date}</td>
                                  <td>{content.type}</td>
                                  <td>{content.sort}</td>
                                  <td>{content.categoryData}</td>
                                  <td>
                                    ${" "}
                                    {parseFloat(
                                      content.amountData
                                    ).toLocaleString("en-US", {
                                      // minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td>
                                    <button
                                      onClick={handleEditBtn(content.id)}
                                      className="item-edit-btn"
                                    >
                                      EDIT
                                    </button>
                                  </td>
                                  <td>
                                    <button
                                      onClick={handleDeleteItemBtn(content.id)}
                                      className="item-delete-btn"
                                    >
                                      X
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </>
                )}
              </table>

              <div className="delete-all-and-total-container">
                <div className="delete-all-btn-container">
                  <button
                    className="delete-all-btn"
                    onClick={() => {
                      if (expenseData.length > 0) {
                        setDeleteBtnClick(true);
                      }
                    }}
                  >
                    DELETE ALL (전체 삭제)
                  </button>
                </div>

                {filterFrom || filterSort ? (
                  <div className="item-total-count-container">
                    <h2 className="item-total">
                      Total: $
                      {parseFloat(filteredDataTotal).toLocaleString("en-US")}
                    </h2>
                    <h3 className="item-count">
                      ({filteredDataTotalCount} items)
                    </h3>
                  </div>
                ) : (
                  <div className="item-total-count-container">
                    <h2 className="item-total">
                      Total: ${parseFloat(total).toLocaleString("en-US")}
                    </h2>
                    <h3 className="item-count">({itemCount} items)</h3>
                  </div>
                )}
              </div>

              <div className="item-export-btn-container">
                <button onClick={selectExcelFile} className="item-export-btn">
                  Import Excel file (엑셀을 불러오기)
                  <FontAwesomeIcon
                    icon="fa-solid fa-file-import"
                    style={{ marginLeft: "7px" }}
                    size="lg"
                  />
                </button>

                <button onClick={exportDataAsExcel} className="item-export-btn">
                  Export to Excel (엑셀로 내보내기)
                  <FontAwesomeIcon
                    icon="fa-solid fa-file-export"
                    style={{ marginLeft: "7px" }}
                    size="lg"
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DELETE ALL MODAL */}
      {isDeleteBtnClick && (
        <DeleteAllModal
          setDeleteBtnClick={setDeleteBtnClick}
          expenseData={expenseData}
          setExpenseData={setExpenseData}
        />
      )}

      {/* DATA INSERT MODAL */}
      {isDataInsert && (
        <DataInsertModal
          setDataInsert={setDataInsert}
          activeIndex={activeIndex}
          setDate={setDate}
          date={date}
          year={year}
          month={month}
          expenseData={expenseData}
          setExpenseData={setExpenseData}
          setSortBtnActive={setSortBtnActive}
          setFilterSort={setFilterSort}
          setFilterFrom={setFilterFrom}
        />
      )}

      {/* DATA EDIT MODAL */}
      {isEditBtn && (
        <DataEditModal
          setEditBtn={setEditBtn}
          editIndex={editIndex}
          setExpenseData={setExpenseData}
          expenseData={expenseData}
          setSortBtnActive={setSortBtnActive}
        />
      )}

      {isReceiptScanning && (
        <ReceiptScanningModal
          setReceiptScanning={setReceiptScanning}
          expenseData={expenseData}
        />
      )}
    </>
  );
}

export default ExpenseManager;
