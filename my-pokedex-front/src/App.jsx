import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "./components/MyNavBar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyFooter from "./components/MyFooter.jsx";
import MyRegister from "./components/MyRegister.jsx";
import MyLogin from "./components/MyLogin.jsx";
import HomePublic from "./components/HomePublic.jsx";
import Pokedex from "./components/Pokedex.jsx";
import PokemonDetails from "./components/PokemonDetails.jsx";
import ScrollToTop from "./components/ScrollToTop";
import PokedexUser from "./components/PokedexUser.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <MyNavbar />
        <Routes>
          <Route path="/" element={<HomePublic />} />
          <Route path="/register" element={<MyRegister />} />
          <Route path="/login" element={<MyLogin />} />
          <Route path="/pokedex-pubblico" element={<PokedexUser />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/pokemon/:idPokemon" element={<PokemonDetails />} />
        </Routes>

        <MyFooter />
      </BrowserRouter>
    </>
  );
}

export default App;
