import "./ExpenseDashboard.css";
import { selectMonthOptions } from "../../component/util/data";

import React, { useState } from "react";

import { Bar, Line } from "react-chartjs-2";
// eslint-disable-next-line
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ExpenseDashboard = ({ expenseData, selectedYear, selectedMonth }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [containerNumber, setContainerNumber] = useState(-1);

  const monthToInt = selectMonthOptions.findIndex(
    (content) => content.value === selectedMonth
  );

  const handleComputeTotalExpenses = (type) => {
    let copy;

    if (type === "month") {
      if (selectedMonth === "All") {
        return;
      }

      copy = [...expenseData].filter(
        (a) => a.year === parseInt(selectedYear) && a.month === selectedMonth
      );
    } else if (type === "year") {
      copy = [...expenseData].filter((a) => a.year === parseInt(selectedYear));
    }

    if (copy.length > 0) {
      return copy
        .reduce((total, item) => total + parseFloat(item.amountData || 0), 0)
        .toLocaleString("en-US", {
          maximumFractionDigits: 2,
        });
    } else {
      return 0.0;
    }
  };

  const handleCountItems = (type) => {
    let copy;

    if (type === "month") {
      if (selectedMonth === "All") {
        return;
      }

      copy = [...expenseData].filter(
        (a) => a.year === parseInt(selectedYear) && a.month === selectedMonth
      );
    } else if (type === "year") {
      copy = [...expenseData].filter((a) => a.year === parseInt(selectedYear));
    }

    return copy.length;
  };

  const handleExpensesBy = (type) => {
    let copy;

    if (selectedMonth === "All") {
      copy = [...expenseData]
        .filter(
          (a) =>
            a.year === parseInt(selectedYear) &&
            a.type !== "Store" &&
            a.type !== "Employee"
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      copy = [...expenseData]
        .filter(
          (a) =>
            a.year === parseInt(selectedYear) &&
            a.month === selectedMonth &&
            a.type !== "Store" &&
            a.type !== "Employee"
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (type === "from") {
      return copy.reduce((acc, item) => {
        if (item.type in acc) {
          acc[item.type] += parseFloat(item.amountData || 0);
        } else {
          acc[item.type] = parseFloat(item.amountData || 0);
        }

        return acc;
      }, {});
    } else if (type === "sort") {
      return copy.reduce((acc, item) => {
        if (item.sort in acc) {
          acc[item.sort] += parseFloat(item.amountData || 0);
        } else {
          acc[item.sort] = parseFloat(item.amountData || 0);
        }

        return acc;
      }, {});
    } else if (type === "category") {
      return copy.reduce((acc, item) => {
        if (item.categoryData in acc) {
          acc[item.categoryData] += parseFloat(item.amountData || 0);
        } else {
          acc[item.categoryData] = parseFloat(item.amountData || 0);
        }

        return acc;
      }, {});
    }
  };

  // Function to calculate monthly expenses
  const monthlyExpenses = () => {
    let monthData = {};
    let copy = [...expenseData].filter(
      (a) => a.year === parseInt(selectedYear)
    );

    // Accumulate expenses by month
    copy.forEach((item) => {
      const month = item.date.split("-")[1];
      if (monthData[month]) {
        monthData[month] += parseFloat(item.amountData || 0);
      } else {
        monthData[month] = parseFloat(item.amountData || 0);
      }
    });

    // Convert to array of objects
    return Object.keys(monthData)
      .sort()
      .map((month) => ({
        month: month,
        total: monthData[month],
      }));
  };

  // Prepare data for the bar chart (Monthly Expenses)
  const barChartData = () => {
    const monthlyData = monthlyExpenses();

    return {
      labels: monthlyData.map((data) => {
        // Convert month number to month name
        const date = new Date(2020, data.month - 1); // Year is arbitrary
        return date.toLocaleString("default", { month: "long" });
      }),
      datasets: [
        {
          label: "Monthly Expenses (월별 지출)",
          data: monthlyData.map((data) => data.total),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderWidth: 1,
        },
      ],
    };
  };

  const barChartDataByFrom = () => {
    const expenseDataByFrom = handleExpensesBy("from");

    return {
      labels: Object.keys(expenseDataByFrom),
      datasets: [
        {
          label: "Expense (지출) ",
          data: Object.values(expenseDataByFrom),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderWidth: 1,
        },
      ],
    };
  };

  const barChartDataByCategory = () => {
    const expenseDataByCategory = handleExpensesBy("category");

    return {
      labels: Object.keys(expenseDataByCategory),
      datasets: [
        {
          label: "Expense (지출) ",
          data: Object.values(expenseDataByCategory),
          backgroundColor: "#2ecc71",
          borderWidth: 1,
        },
      ],
    };
  };

  const barChartDataBySort = () => {
    const expenseDataBySort = handleExpensesBy("sort");

    return {
      labels: Object.keys(expenseDataBySort),
      datasets: [
        {
          label: "Expense (지출) ",
          data: Object.values(expenseDataBySort),
          backgroundColor: "#fff4bc",
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for the line chart (Trend of Expenses)
  const lineChartData = () => {
    let copy;
    if (selectedMonth === "All") {
      copy = [...expenseData]
        .filter(
          (a) =>
            a.year === parseInt(selectedYear) &&
            a.type !== "Store" &&
            a.type !== "Employee"
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      copy = [...expenseData]
        .filter(
          (a) =>
            a.year === parseInt(selectedYear) &&
            a.month === selectedMonth &&
            a.type !== "Store" &&
            a.type !== "Employee"
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return {
      labels: copy.map((item) => item.date),
      datasets: [
        {
          label: "Expense (지출) ",
          data: copy.map((item) => item.amountData),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  const dataForBarChart = barChartData();
  const dataForBarChartByFrom = barChartDataByFrom();
  const dataForBarChartByCategory = barChartDataByCategory();
  const dataForBarChartBySort = barChartDataBySort();
  const dataForLineChart = lineChartData();

  const handleContainer = (number) => {
    if (number === 1) {
      if (dataForBarChart.datasets[0].data.length > 0) {
        setModalOpen(true);
        setContainerNumber(number);
      }
    } else if (number === 2) {
      if (dataForBarChartByFrom.datasets[0].data.length > 0) {
        setModalOpen(true);
        setContainerNumber(number);
      }
    } else if (number === 3) {
      if (dataForBarChartByCategory.datasets[0].data.length > 0) {
        setModalOpen(true);
        setContainerNumber(number);
      }
    } else if (number === 4) {
      if (dataForLineChart.datasets[0].data.length > 0) {
        setModalOpen(true);
        setContainerNumber(number);
      }
    } else if (number === 5) {
      if (dataForBarChartBySort.datasets[0].data.length > 0) {
        setModalOpen(true);
        setContainerNumber(number);
      }
    } else if (number === 6) {
      if (expenseData.length > 0) {
        setModalOpen(true);
        setContainerNumber(number);
      }
    }
  };

  const chartOptions = {
    plugins: {
      legend: {
        onClick: () => {}, // Empty function
      },
    },
  };

  const modalContainer = (number) => {
    if (number === 1) {
      return (
        <div className="chart-modal-graph-container">
          <h3 className="dashboard-chart-header">
            {selectedYear} (1월 ~ 12월)
          </h3>
          <h3 className="dashboard-chart-subheader">
            * Monthly Expenses (월별 지출) *
          </h3>
          <Bar data={barChartData()} options={chartOptions} />
        </div>
      );
    } else if (number === 2) {
      return (
        <div className="chart-modal-graph-container">
          <h3 className="dashboard-chart-header">
            {selectedYear} {selectedMonth}{" "}
            {monthToInt !== 0 ? `(${monthToInt}월)` : `(1월 ~ 12월)`}
          </h3>
          <h3 className="dashboard-chart-subheader">
            * Expenses by From (출처별) *
          </h3>
          <p className="dashboard-chart-exception">
            * Except for "Store" and "Employee" (Store 및 Employee 제외)
          </p>
          <Bar data={barChartDataByFrom()} options={chartOptions} />
        </div>
      );
    } else if (number === 3) {
      return (
        <div className="chart-modal-graph-container">
          <h3 className="dashboard-chart-header">
            {selectedYear} {selectedMonth}{" "}
            {monthToInt !== 0 ? `(${monthToInt}월)` : `(1월 ~ 12월)`}
          </h3>
          <h3 className="dashboard-chart-subheader">
            * Expenses by Category (세부 품목별) *
          </h3>
          <p className="dashboard-chart-exception">
            * Except for "Store" and "Employee" (Store 및 Employee 제외)
          </p>
          <Bar data={barChartDataByCategory()} options={chartOptions} />
        </div>
      );
    } else if (number === 4) {
      return (
        <div className="chart-modal-graph-container">
          <h3 className="dashboard-chart-header">
            {selectedYear} {selectedMonth}{" "}
            {monthToInt !== 0 ? `(${monthToInt}월)` : `(1월 ~ 12월)`}
          </h3>
          <h3 className="dashboard-chart-subheader">
            * Expense Trend Over Time (지출 동향) *
          </h3>
          <p className="dashboard-chart-exception">
            * Except for "Store" and "Employee" (Store 및 Employee 제외)
          </p>
          <Line data={lineChartData()} options={chartOptions} />
        </div>
      );
    } else if (number === 5) {
      return (
        <div className="chart-modal-graph-container">
          <h3 className="dashboard-chart-header">
            {selectedYear} {selectedMonth}{" "}
            {monthToInt !== 0 ? `(${monthToInt}월)` : `(1월 ~ 12월)`}
          </h3>
          <h3 className="dashboard-chart-subheader">
            * Expenses by Sort (종류별) *
          </h3>
          <p className="dashboard-chart-exception">
            * Except for "Store" and "Employee" (Store 및 Employee 제외)
          </p>
          <Bar data={barChartDataBySort()} options={chartOptions} />
        </div>
      );
    } else if (number === 6) {
      return (
        <div className="chart-modal-graph-container">
          {handleLargestAmount()}
        </div>
      );
    }
  };

  const handleAmountChangeForMonth = () => {
    const previousMonthToInt = monthToInt - 1;

    if (previousMonthToInt > 0) {
      const IntToPreviousMonth = selectMonthOptions.find(
        (content) => content.id === previousMonthToInt
      );

      const IntToCurrentMonth = selectMonthOptions.find(
        (content) => content.id === monthToInt
      );

      let copyPreviousMonth = [...expenseData]
        .filter(
          (a) =>
            a.year === parseInt(selectedYear) &&
            a.month === IntToPreviousMonth.value
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      if (copyPreviousMonth.length === 0) {
        return;
      }

      let copyCurrentMonth = [...expenseData]
        .filter(
          (a) =>
            a.year === parseInt(selectedYear) &&
            a.month === IntToCurrentMonth.value
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const currentMonthTotal = copyCurrentMonth
        .reduce((total, item) => total + parseFloat(item.amountData || 0), 0)
        .toFixed(2);

      const previousMonthTotal = copyPreviousMonth
        .reduce((total, item) => total + parseFloat(item.amountData || 0), 0)
        .toFixed(2);

      const compareTwoMonths = (
        ((parseFloat(currentMonthTotal) - parseFloat(previousMonthTotal)) /
          parseFloat(previousMonthTotal)) *
        100
      ).toFixed(2);

      if (parseFloat(compareTwoMonths) > 0) {
        return (
          <span style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
            vs. last month
            <FontAwesomeIcon
              icon="fa-solid fa-up-long"
              // size="lg"
              color="#ff073a"
              style={{ marginRight: "5px", marginLeft: "8px" }}
            />
            {compareTwoMonths}%
          </span>
        );
      } else {
        return (
          <span style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
            vs. last month
            <FontAwesomeIcon
              icon="fa-solid fa-down-long"
              // size="lg"
              color="#39ff14"
              style={{ marginRight: "5px", marginLeft: "8px" }}
            />
            {Math.abs(compareTwoMonths)}%
          </span>
        );
      }
    }
  };

  const handleAmountChangeForYear = () => {
    if (selectedYear > 2023) {
      let copyPreviousYear = [...expenseData]
        .filter((a) => a.year === parseInt(selectedYear - 1))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      if (copyPreviousYear.length === 0) {
        return;
      }

      let copyCurrentYear = [...expenseData]
        .filter((a) => a.year === parseInt(selectedYear))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      if (copyCurrentYear.length === 0) {
        return;
      }

      const currentYearTotal = copyCurrentYear
        .reduce((total, item) => total + parseFloat(item.amountData || 0), 0)
        .toFixed(2);

      const previousYearTotal = copyPreviousYear
        .reduce((total, item) => total + parseFloat(item.amountData || 0), 0)
        .toFixed(2);

      const compareTwoMonths = (
        ((parseFloat(currentYearTotal) - parseFloat(previousYearTotal)) /
          parseFloat(previousYearTotal)) *
        100
      ).toFixed(2);

      if (parseFloat(compareTwoMonths) > 0) {
        return (
          <span style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
            vs. last year
            <FontAwesomeIcon
              icon="fa-solid fa-up-long"
              // size="lg"
              color="blue"
              style={{ marginRight: "5px", marginLeft: "8px" }}
            />
            {compareTwoMonths}%
          </span>
        );
      } else {
        return (
          <span style={{ marginLeft: "10px", fontSize: "0.9rem" }}>
            vs. last year
            <FontAwesomeIcon
              icon="fa-solid fa-down-long"
              // size="lg"
              color="#ff073a"
              style={{ marginRight: "5px", marginLeft: "8px" }}
            />
            {Math.abs(compareTwoMonths)}%
          </span>
        );
      }
    }
  };

  const handleLargestAmount = () => {
    let filteredData;

    if (selectedMonth === "All") {
      filteredData = [...expenseData].filter(
        (a) =>
          a.year === parseInt(selectedYear) &&
          a.type !== "Store" &&
          a.type !== "Employee"
      );
    } else {
      filteredData = [...expenseData].filter(
        (a) =>
          a.year === parseInt(selectedYear) &&
          a.month === selectedMonth &&
          a.type !== "Store" &&
          a.type !== "Employee"
      );
    }

    const largestAmount = Math.max(...filteredData.map((i) => i.amountData));
    const largestAmountIndex = filteredData.findIndex(
      (content) => parseFloat(content.amountData) === largestAmount
    );

    if (filteredData.length > 0) {
      return (
        <>
          <h3 className="dashboard-chart-header">
            {selectedYear} {selectedMonth}{" "}
            {monthToInt !== 0 ? `(${monthToInt}월)` : `(1월 ~ 12월)`}
          </h3>

          <h3 className="dashboard-chart-subheader">
            * Most Expensive Item (가장 비싼 아이템) *
          </h3>

          <p className="dashboard-chart-exception">
            * Except for "Store" and "Employee" (Store 및 Employee 제외)
          </p>

          <table className="dashboard-expensive-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={{ whiteSpace: "normal" }}>
                  {filteredData[largestAmountIndex].date}
                </td>
                <td style={{ whiteSpace: "normal" }}>
                  {filteredData[largestAmountIndex].type}
                </td>
                <td style={{ whiteSpace: "normal" }}>
                  {filteredData[largestAmountIndex].categoryData}
                </td>
                <td style={{ whiteSpace: "normal" }}>
                  ${" "}
                  {parseFloat(
                    filteredData[largestAmountIndex].amountData
                  ).toLocaleString("en-US", {
                    // minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      );
    } else {
      return (
        <h3 className="dashboard-chart-no-data-header">No Data to show</h3>
      );
    }
  };

  ///////////////// RETURN /////////////////
  return (
    <>
      <div className="dashboard-container animation">
        <h2 className="dashboard-header">
          {selectedYear} Dashboard{" "}
          <FontAwesomeIcon
            icon="fa-regular fa-clipboard"
            style={{
              marginLeft: "5px",
            }}
          />
        </h2>

        <h3 className="dashboard-total-expense">
          Total Annual Expenses{" "}
          <span className="dashboard-total-expense-korean">(연간 총 지출)</span>
          :
          <span className="dashboard-total">
            ${handleComputeTotalExpenses("year")}
          </span>
          {handleAmountChangeForYear()}
          <span className="dashobarod-month-items">
            ({handleCountItems("year")} items)
          </span>
        </h3>

        {selectedMonth !== "All" ? (
          <h3 className="dashboard-total-expense-month">
            <span style={{ display: "block" }}>
              Total Expenses {selectedMonth} ({monthToInt}월):
            </span>

            <span className="dashoboard-total-month">
              ${handleComputeTotalExpenses("month")}
            </span>

            {handleAmountChangeForMonth()}

            <span className="dashobarod-month-items">
              ({handleCountItems("month")} items)
            </span>
          </h3>
        ) : null}

        <div className="dashboard-chart-container">
          {/* BAR CHART */}
          <div
            className="dashboard-bar-container"
            onClick={() => {
              handleContainer(1);
            }}
          >
            {dataForBarChart.datasets[0].data.length === 0 ? (
              <h3 className="dashboard-chart-no-data-header">
                No Data to show{" "}
              </h3>
            ) : (
              <>
                <h3 className="dashboard-chart-header">
                  {selectedYear} (1월 ~ 12월){" "}
                </h3>
                <h3 className="dashboard-chart-subheader">
                  * Monthly Expenses (월별 지출) *
                </h3>
                <Bar data={barChartData()} options={chartOptions} />
              </>
            )}
          </div>

          {/* BAR CHART BY FROM */}
          <div
            className="dashboard-bar-container"
            onClick={() => {
              handleContainer(2);
            }}
          >
            {dataForBarChartByFrom.datasets[0].data.length === 0 ? (
              <h3 className="dashboard-chart-no-data-header">
                No Data to show
              </h3>
            ) : (
              <>
                <h3 className="dashboard-chart-header">
                  {selectedYear} {selectedMonth}{" "}
                  {monthToInt !== 0 ? `(${monthToInt}월)` : `(1월 ~ 12월)`}
                </h3>
                <h3 className="dashboard-chart-subheader">
                  * Expenses by From (출처별) *
                </h3>
                <p className="dashboard-chart-exception">
                  * Except for "Store" and "Employee" (Store 및 Employee 제외)
                </p>
                <Bar data={barChartDataByFrom()} options={chartOptions} />
              </>
            )}
          </div>

          {/* BAR CHART BY SORT*/}
          <div
            className="dashboard-bar-container"
            onClick={() => {
              handleContainer(5);
            }}
          >
            {dataForBarChartBySort.datasets[0].data.length === 0 ? (
              <h3 className="dashboard-chart-no-data-header">
                No Data to show
              </h3>
            ) : (
              <>
                <h3 className="dashboard-chart-header">
                  {selectedYear} {selectedMonth}{" "}
                  {monthToInt !== 0 ? `(${monthToInt}월)` : `(1월 ~ 12월)`}
                </h3>
                <h3 className="dashboard-chart-subheader">
                  * Expenses by Sort (종류별) *
                </h3>
                <p className="dashboard-chart-exception">
                  * Except for "Store" and "Employee" (Store 및 Employee 제외)
                </p>
                <Bar data={barChartDataBySort()} options={chartOptions} />
              </>
            )}
          </div>

          {/* BAR CHART BY CATEGORY */}
          <div
            className="dashboard-bar-container"
            onClick={() => {
              handleContainer(3);
            }}
          >
            {dataForBarChartByCategory.datasets[0].data.length === 0 ? (
              <h3 className="dashboard-chart-no-data-header">
                No Data to show
              </h3>
            ) : (
              <>
                <h3 className="dashboard-chart-header">
                  {selectedYear} {selectedMonth}{" "}
                  {monthToInt !== 0 ? `(${monthToInt}월)` : `(1월 ~ 12월)`}
                </h3>
                <h3 className="dashboard-chart-subheader">
                  * Expenses by Category (세부 품목별) *
                </h3>
                <p className="dashboard-chart-exception">
                  * Except for "Store" and "Employee" (Store 및 Employee 제외)
                </p>
                <Bar data={barChartDataByCategory()} options={chartOptions} />
              </>
            )}
          </div>

          {/* LINE CHART */}
          <div
            className="dashboard-line-container"
            onClick={() => {
              handleContainer(4);
            }}
          >
            {dataForLineChart.datasets[0].data.length === 0 ? (
              <h3 className="dashboard-chart-no-data-header">
                No Data to show
              </h3>
            ) : (
              <>
                <h3 className="dashboard-chart-header">
                  {selectedYear} {selectedMonth}{" "}
                  {monthToInt !== 0 ? `(${monthToInt}월)` : `(1월 ~ 12월)`}
                </h3>
                <h3 className="dashboard-chart-subheader">
                  * Expense Trend Over Time (지출 동향) *
                </h3>
                <p className="dashboard-chart-exception">
                  * Except for "Store" and "Employee" (Store 및 Employee 제외)
                </p>
                <Line data={lineChartData()} options={chartOptions} />
              </>
            )}
          </div>

          {/* MOST EXPENSIVE ITEM */}
          <div
            className="dashboard-line-container"
            onClick={() => {
              handleContainer(6);
            }}
          >
            {handleLargestAmount()}
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

export default ExpenseDashboard;
