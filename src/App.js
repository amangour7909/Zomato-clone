import './App.css';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import FoodItems from './Components/FoodItems';
import MenuList from './Components/MenuList';
import Cart from './Components/Cart';
import "./Components/MenuList.css";
import { menu_list } from "./assets/frontend_assets/assets";
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import Payment from './Pages/Payment';
import Admin from './Pages/Admin';
import MyOrders from './Pages/MyOrders';

function App() {
  const [cart, setCart] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All Items");

  return (
    <Router>
      <div className="App">
        <Navbar cart={cart} />
        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <MenuList selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
              <FoodItems cart={cart} setCart={setCart} selectedCategory={selectedCategory} />
            </>
          } />
          <Route path="/menu" element={
            <>
              <MenuList selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
              <FoodItems cart={cart} setCart={setCart} selectedCategory={selectedCategory} />
            </>
          } />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
