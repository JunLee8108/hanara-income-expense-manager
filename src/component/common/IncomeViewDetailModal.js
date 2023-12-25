import "./IncomeViewDetailModal.css";

export default function IncomeViewDetailModal({
  setViewDetail,
  editDataID,
  incomeData,
}) {
  const handleBg = (e) => {
    const target = document.querySelector(".item-input-bg");
    if (e.target === target) {
      setViewDetail(false);
    }
  };

  const handleClostBtn = () => {
    setViewDetail(false);
  };

  const editItem = [...incomeData].find((item) => item.id === editDataID);

  return (
    <>
      <div className="item-input-bg" onClick={handleBg}>
        <form className="item-input-container view-detail-container animation">
          <button
            className="item-input-closebtn"
            type="button"
            onClick={handleClostBtn}
          >
            X
          </button>

          <h2 className="item-input-header view-detail-header">
            {editItem.from}
          </h2>

          <div className="item-input-center-container">
            {/* LEFT */}
            <div className="item-input-left">
              <div className="item-input-box">
                <label htmlFor="date">Date</label>
                <input
                  className="item-input view-detail-input"
                  id="date"
                  name="date"
                  type="month"
                  readOnly
                  defaultValue={editItem.date}
                ></input>
              </div>

              <div className="item-input-box">
                <label htmlFor="from">From (출처)</label>
                <input
                  className="item-input view-detail-input"
                  id="from"
                  placeholder="$"
                  name="from"
                  defaultValue={editItem.from}
                  readOnly
                ></input>
              </div>

              <div className="item-input-box">
                <label htmlFor="total">Total (전체)</label>
                <input
                  className="item-input view-detail-input"
                  id="total"
                  placeholder="$"
                  name="total"
                  defaultValue={`$ ${editItem.total.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}`}
                  readOnly
                ></input>
              </div>

              <div className="item-input-box">
                <label htmlFor="fee">Tax (세금)</label>
                <input
                  className="item-input view-detail-input"
                  id="tax"
                  placeholder="$"
                  defaultValue={`$ ${editItem.tax.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}`}
                  name="tax"
                  readOnly
                ></input>
              </div>
            </div>

            {/* RIGHT */}
            <div className="item-input-right">
              <div className="item-input-box">
                <label htmlFor="tip">Tip (팁)</label>
                <input
                  className="item-input view-detail-input"
                  id="tip"
                  placeholder="$"
                  name="tip"
                  defaultValue={`$ ${editItem.tip.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}`}
                  readOnly
                ></input>
              </div>

              <div className="item-input-box">
                <label htmlFor="service">Service (수수료)</label>
                <input
                  className="item-input view-detail-input"
                  id="service"
                  placeholder="$"
                  name="service"
                  defaultValue={`$ ${editItem.service.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}`}
                  readOnly
                ></input>
              </div>
            </div>
          </div>

          <div className="item-input-box input-textarea income-view-textarea">
            <label htmlFor="fee">Memo (메모)</label>
            <textarea
              id="memo"
              name="memo"
              className="item-input-textarea view-detail-textarea"
              defaultValue={editItem.memo}
              readOnly
            ></textarea>
          </div>
        </form>
      </div>
    </>
  );
}
