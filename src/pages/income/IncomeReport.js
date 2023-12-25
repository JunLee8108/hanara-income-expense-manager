import "./IncomeReport.css";

import { Fragment } from "react";

// eslint-disable-next-line
import Chart from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

export default function IncomeReport({
  checkIfIncomeDataEmpty,
  dataFromExpense,
  month,
  incomeDataNetTotal,
  incomeDataTax,
}) {
  const thisMonthExpenseData = dataFromExpense.filter((item) =>
    item.date.includes(month)
  );

  const filterStoreEmployeeExpenseData = (type) => {
    if (thisMonthExpenseData.length > 0) {
      return thisMonthExpenseData.filter((item) => item.type === type);
    } else {
      return [];
    }
  };

  const computeTotalExpenseNoStoreEmployee = () => {
    if (thisMonthExpenseData.length > 0) {
      return thisMonthExpenseData
        .filter((item) => item.type !== "Store" && item.type !== "Employee")
        .reduce((total, item) => total + item.amountData || 0, 0)
        .toFixed(2);
    } else {
      return 0;
    }
  };

  const computePercentage = (value) => {
    if (value !== parseFloat(incomeDataNetTotal)) {
      return ((value / parseFloat(incomeDataNetTotal)) * 100).toFixed(2) + "%";
    }
  };

  // 가게 운영비
  const storeExpenseData = filterStoreEmployeeExpenseData("Store");
  // 인건비
  const employeeExpenseData = filterStoreEmployeeExpenseData("Employee");
  // 매입 비용
  const expenseTotalNoStoreAndEmployee = computeTotalExpenseNoStoreEmployee();

  const generateFinalArray = () => {
    if (checkIfIncomeDataEmpty.length > 0 && thisMonthExpenseData.length > 0) {
      return [
        { name: "총 매출", value: parseFloat(incomeDataNetTotal) },
        {
          name: "매입비용",
          value: parseFloat(expenseTotalNoStoreAndEmployee),
        },
        { name: "Tax (세금)", value: parseFloat(incomeDataTax) },

        ...storeExpenseData.map((item) => ({
          name: item.categoryData,
          value: item.amountData,
        })),

        ...employeeExpenseData.map((item) => ({
          name: item.categoryData,
          value: item.amountData,
        })),
      ];
    } else {
      return [];
    }
  };

  const finalArray = generateFinalArray();

  const calculateNetTotalIncome = () => {
    let netTotal = parseFloat(incomeDataNetTotal);
    const withoutNetTotal = finalArray.filter(
      (item) => item.name !== "총 매출"
    );

    for (let i = 0; i < withoutNetTotal.length; i++) {
      netTotal -= withoutNetTotal[i].value;
    }

    return netTotal;
  };

  // 순 이익
  const calculatedNetTotalIncome = calculateNetTotalIncome();

  const showReportData = () => {
    return finalArray.map((content, index) => {
      // Render only for even indices or the last index
      if (index % 2 === 0) {
        return (
          <Fragment key={index}>
            <div className="income-report-info-box">
              <div className="income-report-info-box-left">
                <h2 className="income-report-info-box-header">
                  {content.name}
                </h2>
                <h2 className="income-report-info-box-header">
                  <span className="income-report-info-box-amount">
                    $
                    {content.value.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </h2>
                <p className="income-report-info-box-percentage">
                  {computePercentage(content.value)}
                </p>
              </div>

              {index < finalArray.length - 1 && (
                <div className="income-report-info-box-right">
                  <h2 className="income-report-info-box-header">
                    {finalArray[index + 1].name}
                  </h2>
                  <h2 className="income-report-info-box-header">
                    <span className="income-report-info-box-amount">
                      $
                      {finalArray[index + 1].value.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </h2>
                  <p className="income-report-info-box-percentage">
                    {computePercentage(finalArray[index + 1].value)}
                  </p>
                </div>
              )}
            </div>
          </Fragment>
        );
      }
      return null;
    });
  };

  const doughuntChartData = () => {
    return {
      labels: finalArray
        .filter((item) => item.name !== "총 매출")
        .map((item) => item.name),
      datasets: [
        {
          label: "$",
          data: finalArray
            .filter((item) => item.name !== "총 매출")
            .map((item) => item.value),
          backgroundColor: [
            // Add more colors for different categories
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "#006db5",
            "#ADF7B6",
            // TODO
            "#dbd8e3",
            "#FFEBD8",
            "#ff6f3c",
          ],
          borderColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "#006db5",
            "#ADF7B6",
            // TODO
            "#dbd8e3",
            "#FFEBD8",
            "#ff6f3c",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <>
      <div className="income-report-container animation">
        {checkIfIncomeDataEmpty.length > 0 &&
        thisMonthExpenseData.length > 0 ? (
          <>
            <h1 className="income-report-header">Income Report</h1>
            <p className="income-report-subheader">{month}</p>

            <div className="income-report-netTotal-container">
              <h2 className="income-report-netTotal-header">
                Net Total Income{" "}
                <span className="income-report-netTotal-korean">(순 이익)</span>
                :
              </h2>
              <h1 className="income-report-netTotal">
                $
                {calculatedNetTotalIncome.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </h1>
            </div>

            <div className="income-report-chart-container">
              <Doughnut data={doughuntChartData()} />
            </div>

            <div className="income-report-info-container">
              {showReportData()}
            </div>
          </>
        ) : (
          <h2 className="income-report-header">No Data to Show</h2>
        )}
      </div>
    </>
  );
}
