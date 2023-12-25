import "./App.css";
import Landing from "./pages/home/Landing";
import LoadingPage from "./component/common/LoadingPage";

import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useCallback } from "react";

import ExpenseManager from "./pages/expense/ExpenseManager";
import IncomeManager from "./pages/income/IncomeManager";

// const ExpenseManager = lazy(() => import("./pages/expense/ExpenseManager"));
// const IncomeManager = lazy(() => import("./pages/income/IncomeManager"));

function App() {
  /**
   * sort data by date and set state
   * @param {array} copy data array
   */
  const sortByDate = useCallback((copy, toggle, setItem) => {
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

    if (toggle === "on") {
      setItem(copy);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/expense"
          element={<ExpenseManager sortByDate={sortByDate} />}
        />
        <Route
          path="/income"
          element={<IncomeManager sortByDate={sortByDate} />}
        />
        {/* <Route
          path="/expense"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ExpenseManager sortByDate={sortByDate} />
            </Suspense>
          }
        />
        <Route
          path="/income"
          element={
            <Suspense fallback={<LoadingPage />}>
              <IncomeManager sortByDate={sortByDate} />
            </Suspense>
          }
        /> */}
      </Routes>
    </>
  );
}

export default App;
