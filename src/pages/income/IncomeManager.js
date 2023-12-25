import "./IncomeManager.css";

import { incomeNavbarList } from "../../component/util/data";
import IncomeInsertModal from "../../component/common/IncomeInsertModal";
import IncomeEditModal from "../../component/common/IncomeEditModal";
import IncomeViewDetailModal from "../../component/common/IncomeViewDetailModal";
import IncomeDashboard from "./IncomeDashboard";
import IncomeReport from "./IncomeReport";

import { useState, useEffect, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation } from "react-router-dom";

function IncomeManager({ sortByDate }) {
  const { ipcRenderer } = window.require("electron");

  const navigate = useNavigate();
  const location = useLocation();

  const currentDate = new Date();

  const formattedMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;

  const [navbarActiveIndex, setNavbarActiveIndex] = useState(0);

  const [dataFromExpense, setDataFromExpense] = useState([]);

  const [month, setMonth] = useState(formattedMonth);
  const [isDataInsert, setDataInsert] = useState(false);
  const [isDataEdit, setDataEdit] = useState(false);
  const [isViewDetail, setViewDetail] = useState(false);
  const [editDataID, setEditDataID] = useState(-1);
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    if (location.state) {
      const expenseInfo = location.state.value;
      const incomeData = location.state.incomeData;

      if (expenseInfo.length > 0) {
        setDataFromExpense([...expenseInfo]);
      }

      if (incomeData.length > 0) {
        setIncomeData([...incomeData]);
      }
    }
  }, [location.state]);

  const handleViewDetailModal = (id) => () => {
    setViewDetail(true);
    setEditDataID(id);
  };

  const handleNavigate = () => {
    navigate("/expense", {
      state: { value: dataFromExpense, incomeData: incomeData },
    });
  };

  const handleIncomeMonth = (e) => {
    setMonth(e.target.value);
  };

  const handleDataInsert = () => {
    setDataInsert(true);
  };

  const handleNavbarBtn = (index, name) => () => {
    setNavbarActiveIndex(index);
  };

  const handleDelete = (id) => () => {
    const copy = [...incomeData];
    const findIndexWithID = copy.findIndex((data) => data.id === id);
    copy.splice(findIndexWithID, 1);

    setIncomeData(copy);
  };

  const handleEdit = (id) => () => {
    setDataEdit(true);
    setEditDataID(id);
  };

  const checkIfIncomeDataEmpty = incomeData.filter(
    (item) => item.date === month
  );

  const showIncomeData = () => {
    return incomeData
      .filter((item) => item.date === month)
      .map((content, index) => {
        let cardHeader;
        let detailButton;
        let card;

        if (content.from === "DoorDash") {
          cardHeader = "card-header-doordash";
          detailButton = "income-detail-button-doordash";
          card = "doordash";
        } else if (content.from === "Square") {
          cardHeader = "";
          detailButton = "";
          card = "square";
        } else if (content.from === "Uber") {
          cardHeader = "card-header-uber";
          detailButton = "income-detail-button-uber";
          card = "uber";
        } else if (content.from === "Stripe") {
          cardHeader = "card-header-stripe";
          detailButton = "income-detail-button-stripe";
          card = "stripe";
        } else if (content.from === "Cash") {
          cardHeader = "card-header-cash";
          detailButton = "income-detail-button-cash";
          card = "cash";
        }

        return (
          <div className={`income-card ${card}`} key={index}>
            <div className={`card-header ${cardHeader}`}>
              <h2>{content.from}</h2>
            </div>

            <div className="card-content">
              <div className="card-content-box">
                <p className="card-content-header">Date: </p>
                <p> {content.date}</p>
              </div>

              <div className="card-content-box">
                <p className="card-content-header">Total Sales: </p>
                <p>
                  $
                  {content.total.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="card-content-box">
                <p className="card-content-header">
                  Tax (<span className="card-plus">+</span>):{" "}
                </p>
                <p>
                  $
                  {content.tax.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="card-content-box">
                <p className="card-content-header">
                  Tip (<span className="card-plus">+</span>):{" "}
                </p>
                <p>
                  $
                  {content.tip.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="card-content-box">
                <p className="card-content-header">
                  Service (<span className="card-minus">-</span>):{" "}
                </p>
                <p>
                  $
                  {content.service.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="card-content-box">
                <p className="card-content-header">Net Total:</p>
                <p>
                  $
                  {content.netTotal.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div className="card-edit-delete-container">
              <button
                className="card-edit-delete-button edit-button"
                onClick={handleEdit(content.id)}
              >
                EDIT
              </button>
              <button
                className="card-edit-delete-button delete-button"
                onClick={handleDelete(content.id)}
              >
                DELETE
              </button>
            </div>

            <div className="card-footer">
              <button
                className={`income-detail-button ${detailButton}`}
                onClick={handleViewDetailModal(content.id)}
              >
                View Details
              </button>
            </div>
          </div>
        );
      });
  };

  const incomeDataTotal = useMemo(() => {
    return checkIfIncomeDataEmpty
      .reduce((total, item) => total + item.total || 0, 0)
      .toFixed(2);
  }, [checkIfIncomeDataEmpty]);

  const incomeDataTax = useMemo(() => {
    return checkIfIncomeDataEmpty
      .reduce((total, item) => total + item.tax || 0, 0)
      .toFixed(2);
  }, [checkIfIncomeDataEmpty]);

  const incomeDataTip = useMemo(() => {
    return checkIfIncomeDataEmpty
      .reduce((total, item) => total + item.tip || 0, 0)
      .toFixed(2);
  }, [checkIfIncomeDataEmpty]);

  const incomeDataService = useMemo(() => {
    return checkIfIncomeDataEmpty
      .reduce((total, item) => total + item.service || 0, 0)
      .toFixed(2);
  }, [checkIfIncomeDataEmpty]);

  const incomeDataNetTotal = useMemo(() => {
    return checkIfIncomeDataEmpty
      .reduce((total, item) => total + item.netTotal || 0, 0)
      .toFixed(2);
  }, [checkIfIncomeDataEmpty]);

  //* SAVE DATA AS A JSON FILE *//
  const saveDataToFile = () => {
    const expenseData = dataFromExpense;
    const URLIncomeData = incomeData;

    ipcRenderer.send("save-data", { expenseData, URLIncomeData });
  };

  const loadDataFromFile = () => {
    ipcRenderer.send("load-data");
  };

  useEffect(() => {
    const handleDataLoad = (event, data) => {
      if (data) {
        const { expenseData, URLIncomeData } = data;

        sortByDate(expenseData, "on", setDataFromExpense);
        setIncomeData(URLIncomeData);
      }
    };

    ipcRenderer.on("loaded-data", handleDataLoad);

    return () => {
      ipcRenderer.removeListener("loaded-data", handleDataLoad);
    };
    // eslint-disable-next-line
  }, []);

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
            Expense Manager
          </button>

          <button onClick={loadDataFromFile} className="save-load-btn">
            Load Data (불러오기)
            <FontAwesomeIcon
              icon="fa-solid fa-download"
              style={{ marginLeft: "5px" }}
            />
          </button>
        </div>

        <h1 className="header">Income Manager</h1>
        <h3 className="sub-header">Hanara Sushi</h3>

        <div className="income-navbar-container">
          {incomeNavbarList.map((content, index) => {
            return (
              <button
                className={`income-navbar-btn ${
                  navbarActiveIndex === index
                    ? "income-navbar-btn-active"
                    : null
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

        <div className="income-date-input-container">
          <input
            type="month"
            className="income-data-input"
            onChange={handleIncomeMonth}
            value={month}
          ></input>
          <button
            className="income-data-insert-button"
            onClick={handleDataInsert}
            disabled={
              !month || navbarActiveIndex === 1 || navbarActiveIndex === 2
            }
          >
            DATA INSERT (데이터 삽입)
          </button>
        </div>

        {
          // CARD
          navbarActiveIndex === 0 ? (
            <>
              <div className="income-item-count-container">
                <p className="income-item-count">
                  {checkIfIncomeDataEmpty.length} item(s)
                </p>
              </div>

              <div className="income-card-container animation">
                {checkIfIncomeDataEmpty.length === 0 ? (
                  <h1>No Data to show</h1>
                ) : (
                  <>{showIncomeData()}</>
                )}
              </div>

              <div className="income-total-container">
                <h2 className="income-total-container-header">Summary</h2>
                <h3>
                  Total Sales:
                  <span className="income-total-no-bold">
                    {" "}
                    $
                    {parseFloat(incomeDataTotal).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </h3>
                <h3>
                  Total Tax (<span className="card-plus">+</span>):
                  <span className="income-total-no-bold">
                    {" "}
                    $
                    {parseFloat(incomeDataTax).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </h3>
                <h3>
                  Total Tip (<span className="card-plus">+</span>):
                  <span className="income-total-no-bold">
                    {" "}
                    $
                    {parseFloat(incomeDataTip).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </h3>
                <h3>
                  Total Service (<span className="card-minus">-</span>):
                  <span className="income-total-no-bold">
                    {" "}
                    $
                    {parseFloat(incomeDataService).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </h3>
                <h3 className="income-net-total">
                  Net Total:
                  <span className="income-total-no-bold">
                    {" "}
                    $
                    {parseFloat(incomeDataNetTotal).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </h3>
              </div>
            </>
          ) : // DASHBOARD
          navbarActiveIndex === 1 ? (
            <IncomeDashboard
              month={month}
              checkIfIncomeDataEmpty={checkIfIncomeDataEmpty}
              incomeDataTotal={incomeDataTotal}
              incomeDataNetTotal={incomeDataNetTotal}
              incomeDataTax={incomeDataTax}
              incomeDataTip={incomeDataTip}
              incomeDataService={incomeDataService}
              dataFromExpense={dataFromExpense}
            />
          ) : (
            // REPORT
            <IncomeReport
              checkIfIncomeDataEmpty={checkIfIncomeDataEmpty}
              dataFromExpense={dataFromExpense}
              month={month}
              incomeDataNetTotal={incomeDataNetTotal}
              incomeDataTax={incomeDataTax}
            />
          )
        }
      </div>

      {isDataInsert && (
        <IncomeInsertModal
          setDataInsert={setDataInsert}
          month={month}
          setIncomeData={setIncomeData}
          incomeData={incomeData}
        />
      )}

      {isDataEdit && (
        <IncomeEditModal
          setDataEdit={setDataEdit}
          editDataID={editDataID}
          incomeData={incomeData}
          setIncomeData={setIncomeData}
        />
      )}

      {isViewDetail && (
        <IncomeViewDetailModal
          setViewDetail={setViewDetail}
          editDataID={editDataID}
          incomeData={incomeData}
        />
      )}
    </>
  );
}

export default IncomeManager;
