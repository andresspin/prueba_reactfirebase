import "./App.css";
import { Routes, Route } from "react-router-dom";
import Orders from "./routes/orders";

export const App = () => {
  return (
    <>
      <h1>APP</h1>
      <Routes>
        <Route path="/" element={<Orders />} />
      </Routes>
    </>
  );
};

export default App;
