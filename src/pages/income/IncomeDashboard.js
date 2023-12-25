import "./IncomeDashboard.css";

import React, { useState, useMemo } from "react";

import { Bar } from "react-chartjs-2";
// eslint-disable-next-line
import Chart from "chart.js/auto";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IncomeDashboard = ({
  month,
  checkIfIncomeDataEmpty,
  incomeDataTotal,
  incomeDataNetTotal,
  incomeDataTax,
  incomeDataTip,
  incomeDataService,
  dataFromExpense,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [containerNumber, setContainerNumber] = useState(-1);

  const infoBoxData = [
    {
      id: 0,
      name: "Total Sales (+):",
      value: parseFloat(incomeDataTotal),
    },

    {
      id: 1,
      name: "Total Taxes (+):",
      value: parseFloat(incomeDataTax),
    },
    {
      id: 2,
      name: "Total Tips (+):",
      value: parseFloat(incomeDataTip),
    },
    {
      id: 3,
      name: "Total Services (-):",
      value: parseFloat(incomeDataService),
    },
  ];

  const computePercentageForIncomeData = (value) => {
    const floatIncomeDataNetTotal = parseFloat(incomeDataNetTotal);

    if (isNaN((value / floatIncomeDataNetTotal) * 100)) {
      return 0;
    } else {
      return ((value / floatIncomeDataNetTotal) * 100).toFixed(2);
    }
  };

  const monthlyExpenseDataTotal = useMemo(() => {
    return dataFromExpense
      .filter((item) => item.date.includes(month))
      .reduce((total, item) => total + item.amountData || 0, 0)
      .toFixed(2);
  }, [dataFromExpense, month]);

  const handleChartData = (type) => {
    if (type === "netTotal") {
      return checkIfIncomeDataEmpty.reduce((acc, item) => {
        if (item.from in acc) {
          acc[item.from] += item.netTotal || 0;
        } else {
          acc[item.from] = item.netTotal || 0;
        }

        return acc;
      }, {});
    }
    // Sales
    else if (type === "sales") {
      return checkIfIncomeDataEmpty.reduce((acc, item) => {
        if (item.from in acc) {
          acc[item.from] += item.total || 0;
        } else {
          acc[item.from] = item.total || 0;
        }

        return acc;
      }, {});
    }
    // Tax
    else if (type === "tax") {
      return checkIfIncomeDataEmpty.reduce((acc, item) => {
        if (item.from in acc) {
          acc[item.from] += item.tax || 0;
        } else {
          acc[item.from] = item.tax || 0;
        }

        return acc;
      }, {});
    }
    // Tip
    else if (type === "tip") {
      return checkIfIncomeDataEmpty.reduce((acc, item) => {
        if (item.from in acc) {
          acc[item.from] += item.tip || 0;
        } else {
          acc[item.from] = item.tip || 0;
        }

        return acc;
      }, {});
    }
    // Service
    else if (type === "service") {
      return checkIfIncomeDataEmpty.reduce((acc, item) => {
        if (item.from in acc) {
          acc[item.from] += item.service || 0;
        } else {
          acc[item.from] = item.service || 0;
        }

        return acc;
      }, {});
    }
  };

  const chartOptions = {
    plugins: {
      legend: {
        onClick: () => {},
      },
    },
  };

  const incomeVsExpenseBarChart = () => {
    const data = {
      "Total Sales (+)": parseFloat(incomeDataTotal),
    };

    const data2 = {
      "Total Taxes (+)": parseFloat(incomeDataTax),
    };

    const data3 = {
      "Total Tips (+)": parseFloat(incomeDataTip),
    };

    const data4 = {
      "Total Services (-)": parseFloat(incomeDataService),
    };

    const label = [month];

    return {
      labels: label,
      datasets: [
        {
          label: "Sales (+)",
          data: Object.values(data),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderWidth: 1,
        },
        {
          label: "Taxes (+)",
          data: Object.values(data2),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
          borderWidth: 1,
        },
        {
          label: "Tips (+)",
          data: Object.values(data3),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderWidth: 1,
        },
        {
          label: "Services (-)",
          data: Object.values(data4),
          backgroundColor: "rgba(255, 206, 86, 0.6)",
          borderWidth: 1,
        },
      ],
    };
  };

  const handleBarChart = (name, bgColor) => {
    const data = handleChartData(name);

    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: "$",
          data: Object.values(data),
          backgroundColor: bgColor,
          borderWidth: 1,
        },
      ],
    };
  };

  const handleContainer = (number) => {
    if (checkIfIncomeDataEmpty.length > 0) {
      setModalOpen(true);
      setContainerNumber(number);
    }
  };

  const modalContainer = (number) => {
    if (number === 0) {
      return (
        <div className="chart-modal-graph-container">
          <h3 className="income-dashboard-chart-header">{month}</h3>
          <h3 className="income-dashboard-chart-subheader">
            * Monthly Income Data (월별 수입 항목) *
          </h3>
          <Bar data={incomeVsExpenseBarChart()} options={chartOptions} />
        </div>
      );
    } else if (number === 1) {
      return (
        <div className="chart-modal-graph-container">
          <h3 className="income-dashboard-chart-header">{month}</h3>
          <h3 className="income-dashboard-chart-subheader">
            * Net Total by From (출처별 총 판매) *
          </h3>
          <Bar
            data={handleBarChart("netTotal", "#fdfd96")}
            options={chartOptions}
          />
        </div>
      );
    } else if (number === 2) {
      return (
        <div className="chart-modal-graph-container">
          <h3 className="income-dashboard-chart-header">{month}</h3>
          <h3 className="income-dashboard-chart-subheader">
            * Sales by From (+) (출처별 판매) *
          </h3>
          <Bar
            data={handleBarChart("sales", "#2ecc71")}
            options={chartOptions}
          />
        </div>
      );
    } else if (number === 3) {
      return (
        <div className="chart-modal-graph-container">
          <h3 className="income-dashboard-chart-header">{month}</h3>
          <h3 className="income-dashboard-chart-subheader">
            * Tax by From (+) (출처별 세금) *
          </h3>
          <Bar data={handleBarChart("tax", "#b266ff")} options={chartOptions} />
        </div>
      );
    } else if (number === 4) {
      return (
        <div className="chart-modal-graph-container">
          <h3 className="income-dashboard-chart-header">{month}</h3>
          <h3 className="income-dashboard-chart-subheader">
            * Tip by From (+) (출처별 팁) *
          </h3>
          <Bar data={handleBarChart("tip", "#ff944d")} options={chartOptions} />
        </div>
      );
    } else if (number === 5) {
      return (
        <div className="chart-modal-graph-container">
          <h3 className="income-dashboard-chart-header">{month}</h3>
          <h3 className="income-dashboard-chart-subheader">
            * Service by From (-) (출처별 수수료) *
          </h3>
          <Bar
            data={handleBarChart("service", "#a0ced9")}
            options={chartOptions}
          />
        </div>
      );
    }
  };

  ///////////////// RETURN /////////////////
  return (
    <>
      <div className="income-dashboard-container animation">
        <h2 className="income-dashboard-header">
          Dashboard
          <FontAwesomeIcon
            icon="fa-regular fa-clipboard"
            style={{
              marginLeft: "10px",
            }}
          />
        </h2>

        <h2 className="income-dashboard-date">
          {month.replaceAll("-", " - ")}
        </h2>

        <h3 className="income-dashboard-total-expense">
          Net Total Sales
          <span className="income-dashboard-total-expense-korean">
            {" "}
            (총 매출)
          </span>
          :
          <span className="income-dashboard-total">
            $
            {parseFloat(incomeDataNetTotal).toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="income-dashboard-month-items">
            Vs. Total Expense{" "}
            <span className="income-dashboard-total-expense-korean">
              (총 지출)
            </span>
            :
          </span>
          <span className="income-dashboard-expense-total">
            $
            {parseFloat(monthlyExpenseDataTotal).toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </span>
        </h3>

        <div className="income-dashboard-info-container">
          {infoBoxData.map((content, index) => {
            return (
              <div className="income-dashboard-info-box" key={index}>
                <h2 className="income-dashboard-info-box-header">
                  {content.name}
                </h2>

                <h2 className="income-dashboard-info-box-header">
                  <span className="income-dashboard-info-box-amount">
                    $
                    {content.value.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </h2>

                <p className="income-dashboard-info-box-percentage">
                  ({computePercentageForIncomeData(content.value)}%)
                </p>
              </div>
            );
          })}
        </div>

        <div className="income-dashboard-chart-container">
          {/* DOUGHNUT CHART */}
          {/* <div
            className="income-dashboard-doughnut-container"
            onClick={() => {
              handleContainer(0);
            }}
          >
            {checkIfIncomeDataEmpty.length === 0 ? (
              <h3 className="income-dashboard-chart-no-data-header">
                No Data to show{" "}
              </h3>
            ) : (
              <>
                <h3 className="income-dashboard-chart-header">{month} </h3>
                <h3 className="income-dashboard-chart-subheader">
                  * Monthly Income Data (월별 수입 항목) *
                </h3>
                <div className="doughunt-chart-container">
                  <Doughnut data={doughuntChartData()} options={chartOptions} />
                </div>
              </>
            )}
          </div> */}

          {/* BAR CHART SALES BY FROM */}
          <div
            className="income-dashboard-bar-container"
            onClick={() => {
              handleContainer(0);
            }}
          >
            {checkIfIncomeDataEmpty.length === 0 ? (
              <h3 className="income-dashboard-chart-no-data-header">
                No Data to show
              </h3>
            ) : (
              <>
                <h3 className="income-dashboard-chart-header">{month}</h3>
                <h3 className="income-dashboard-chart-subheader">
                  * Monthly Income Data (월별 수입 항목) *
                </h3>
                <Bar data={incomeVsExpenseBarChart()} options={chartOptions} />
              </>
            )}
          </div>

          {/* BAR CHART SALES BY FROM */}
          <div
            className="income-dashboard-bar-container"
            onClick={() => {
              handleContainer(1);
            }}
          >
            {checkIfIncomeDataEmpty.length === 0 ? (
              <h3 className="income-dashboard-chart-no-data-header">
                No Data to show
              </h3>
            ) : (
              <>
                <h3 className="income-dashboard-chart-header">{month}</h3>
                <h3 className="income-dashboard-chart-subheader">
                  * Net Total by From (출처별 총 판매) *
                </h3>
                <Bar
                  data={handleBarChart("netTotal", "#fdfd96")}
                  options={chartOptions}
                />
              </>
            )}
          </div>

          {/* BAR CHART SALES BY FROM */}
          <div
            className="income-dashboard-bar-container"
            onClick={() => {
              handleContainer(2);
            }}
          >
            {checkIfIncomeDataEmpty.length === 0 ? (
              <h3 className="income-dashboard-chart-no-data-header">
                No Data to show
              </h3>
            ) : (
              <>
                <h3 className="income-dashboard-chart-header">{month}</h3>
                <h3 className="income-dashboard-chart-subheader">
                  * Sales by From (+) (출처별 판매) *
                </h3>
                <Bar
                  data={handleBarChart("sales", "#2ecc71")}
                  options={chartOptions}
                />
              </>
            )}
          </div>

          {/* BAR CHART TAX BY FROM */}
          <div
            className="income-dashboard-bar-container"
            onClick={() => {
              handleContainer(3);
            }}
          >
            {checkIfIncomeDataEmpty.length === 0 ? (
              <h3 className="income-dashboard-chart-no-data-header">
                No Data to show
              </h3>
            ) : (
              <>
                <h3 className="income-dashboard-chart-header">{month}</h3>
                <h3 className="income-dashboard-chart-subheader">
                  * Tax by From (+) (출처별 세금) *
                </h3>
                <Bar
                  data={handleBarChart("tax", "#b266ff")}
                  options={chartOptions}
                />
              </>
            )}
          </div>

          {/* BAR CHART TIP BY FROM */}
          <div
            className="income-dashboard-bar-container"
            onClick={() => {
              handleContainer(4);
            }}
          >
            {checkIfIncomeDataEmpty.length === 0 ? (
              <h3 className="income-dashboard-chart-no-data-header">
                No Data to show
              </h3>
            ) : (
              <>
                <h3 className="income-dashboard-chart-header">{month}</h3>
                <h3 className="income-dashboard-chart-subheader">
                  * Tip by From (+) (출처별 팁) *
                </h3>
                <Bar
                  data={handleBarChart("tip", "#ff944d")}
                  options={chartOptions}
                />
              </>
            )}
          </div>

          {/* BAR CHART SERVICE BY FROM */}
          <div
            className="income-dashboard-bar-container"
            onClick={() => {
              handleContainer(5);
            }}
          >
            {checkIfIncomeDataEmpty.length === 0 ? (
              <h3 className="income-dashboard-chart-no-data-header">
                No Data to show
              </h3>
            ) : (
              <>
                <h3 className="income-dashboard-chart-header">{month}</h3>
                <h3 className="income-dashboard-chart-subheader">
                  * Service by From (-) (출처별 수수료) *
                </h3>
                <Bar
                  data={handleBarChart("service", "#a0ced9")}
                  options={chartOptions}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div
          className="chart-modal-bg"
          onClick={(e) => {
            const target = document.querySelector(".chart-modal-bg");
            if (e.target === target) {
              setModalOpen(false);
            }
          }}
        >
          <div className="chart-modal-container animation">
            <div className="chart-modal-btn-container">
              <button
                className="chart-modal-close-btn"
                onClick={() => setModalOpen(false)}
              >
                X
              </button>
            </div>
            {modalContainer(containerNumber)}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default IncomeDashboard;
