import "./LoadingPage.css";
import BeatLoader from "react-spinners/BeatLoader";

export default function LoadingPage() {
  return (
    <div className="loading-bg">
      <div className="loading-container">
        <BeatLoader color="#39b0a8" />
      </div>
    </div>
  );
}
