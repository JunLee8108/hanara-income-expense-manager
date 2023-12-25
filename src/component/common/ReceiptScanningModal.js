import "./ReceiptScanningModal.css";
import "../../App.css";
import LoadingPage from "./LoadingPage";

import { useState, Fragment } from "react";

import Tesseract from "tesseract.js";

export default function ReceiptScanningModal({
  setReceiptScanning,
  expenseData,
}) {
  const { ipcRenderer } = window.require("electron");

  // New state variables for receipt scanning
  const [receiptImage, setReceiptImage] = useState(null);

  //   const [extractedText, setExtractedText] = useState("");

  const [parsedData, setParsedData] = useState([]);
  const [inputFrom, setInputFrom] = useState("");
  const [isReceiptEdit, setReceiptEdit] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [receiptData, setReceiptData] = useState([]);

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReceiptImage(file);
      processReceipt(file);
    }
  };

  // Function to process receipt image
  const processReceipt = (imageFile) => {
    setLoading(true);

    Tesseract.recognize(imageFile, "eng", {
      //   logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
      //   setExtractedText(text);
      parseReceiptData(text);
      setLoading(false);
    });
  };

  const parseReceiptData = (text) => {
    // Example regular expressions (these will need to be tailored to your specific receipt format)
    const priceRegex = /\d+\.\d{2}/g; // Matches prices like $10.99

    const itemRegex = /^[a-zA-Z].*/gm; // Matches item names - very basic example

    let prices = text.match(priceRegex) || [];
    let items = text.match(itemRegex) || [];

    if (inputFrom === "Sam's") {
      items = items.filter((item) => item.startsWith("E")).map((item) => item);
    }

    for (let i = 0; i < items.length; i++) {
      items[i] = items[i].replaceAll(/[0-9]/g, "").trim();
    }

    // Create structured data
    let structuredData = items.map((item, index) => ({
      item: item,
      price: parseFloat(prices[index]) || "Unknown",
    }));

    setParsedData(structuredData);
    // console.log({ date, structuredData }); // For debugging
  };

  const handleReceiptModalForm = (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const body = {};
    for (const [key, value] of form.entries()) {
      body[key] = value;
    }

    if (parsedData.length > 0) {
      let data = [...receiptData];
      for (let i = 0; i < parsedData.length; i++) {
        data.push({
          date: body.date,
          year: parseInt(body.date.substring(0, 4)),
          month: "",
          day: parseInt(body.date.substring(8, 10)),
          type: inputFrom,
          sort: "",
          categoryData: parsedData[i].item,
          amountData: parsedData[i].price,
          id: "",
        });
      }

      setReceiptData(data);

      setTimeout(() => {
        setReceiptEdit(true);
      }, 50);
    } else {
      ipcRenderer.send("show-warning-dialog", "No data. (데이터가 없습니다.)");
      return;
    }
  };

  const receiptTotal = receiptData
    .reduce((total, item) => total + parseFloat(item.amountData || 0), 0)
    .toFixed(2);

  const receiptTotalCount = receiptData.reduce((total, item) => total + 1, 0);

  const handleDeleteBtn = (index) => {
    const copy = [...receiptData];
    copy.splice(index, 1);
    setReceiptData(copy);
  };

  //   console.log(parsedData);
  //   console.log(parsedData);
  //   console.log(receiptData);

  return (
    <>
      <div
        className="receipt-scanning-modal-bg"
        onClick={(e) => {
          const target = document.querySelector(".receipt-scanning-modal-bg");
          if (e.target === target) {
            setReceiptScanning(false);
            document.body.style.overflow = "unset";
          }
        }}
      >
        <div className="receipt-scanning-modal-container animation">
          {!isReceiptEdit ? (
            <form
              className="receipt-scanning-modal-form"
              onSubmit={handleReceiptModalForm}
            >
              <label
                className="receipt-scanning-modal-form-header"
                htmlFor="from"
              >
                From
              </label>
              <select
                className="receipt-scanning-modal-select"
                name="from"
                id="from"
                value={inputFrom}
                required
                onChange={(e) => setInputFrom(e.target.value)}
              >
                <option value="" disabled>
                  Please Choose..
                </option>
                <option value="Costco">Costco</option>
                <option value="Restaurant Depo">Restaurant Depo</option>
                <option value="Sam's">Sam's</option>
                <option value="HEB">HEB</option>
                <option value="H Mart">H Mart</option>
                <option value="Hana">Hana</option>
              </select>

              <label
                className="receipt-scanning-modal-form-header"
                htmlFor="date"
              >
                Date
              </label>
              <input
                className="receipt-scanning-modal-input"
                type="date"
                name="date"
                id="date"
                required
              ></input>

              <label
                className="receipt-scanning-modal-form-header"
                htmlFor="file"
              >
                Receipt
              </label>
              <input
                className="receipt-scanning-modal-input"
                type="file"
                onChange={handleImageUpload}
                accept=".png, .jpg, .jpeg"
                name="file"
                id="file"
                required
                disabled={!inputFrom}
              />

              <button className="receipt-scanning-modal-submit-btn">
                Submit
              </button>
            </form>
          ) : (
            <>
              <h2 className="receipt-scanning-table-header">
                Scanning Result{" "}
                <span style={{ fontSize: "1.1rem" }}>
                  ({receiptData.length} items)
                </span>
              </h2>

              <table
                style={{
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

                {receiptData.map((content, index) => {
                  return (
                    <Fragment key={index}>
                      <>
                        <tbody>
                          <tr>
                            <td>{content.date}</td>
                            <td>{content.type}</td>
                            <td>{content.sort}</td>
                            <td>{content.categoryData}</td>
                            <td>
                              ${" "}
                              {parseFloat(content.amountData).toLocaleString(
                                "en-US",
                                {
                                  // minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </td>
                            <td>
                              <button
                                //   onClick={() => handleEditBtn(index)}
                                className="item-edit-btn"
                              >
                                EDIT
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  handleDeleteBtn(index);
                                }}
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
                <h2 className="item-total" style={{ width: "100%" }}>
                  Total: ${parseFloat(receiptTotal).toLocaleString("en-US")}
                </h2>
                <h3 className="item-count" style={{ width: "100%" }}>
                  ({receiptTotalCount} items)
                </h3>
              </div>
            </>
          )}
        </div>
      </div>

      {isLoading && <LoadingPage />}
    </>
  );
}
