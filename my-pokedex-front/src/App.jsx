import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "./components/MyNavBar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyFooter from "./components/MyFooter.jsx";
import MyRegister from "./components/MyRegister.jsx";
import MyLogin from "./components/MyLogin.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <MyNavbar />
        <Routes>
          <Route path="/register" element={<MyRegister />} />
          <Route path="/login" element={<MyLogin />} />
        </Routes>

        <MyFooter />
      </BrowserRouter>
    </>
  );
}

export default App;
