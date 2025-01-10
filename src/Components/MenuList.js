import React from "react";
import "./MenuList.css";
import { menu_list } from "../assets/frontend_assets/assets";

function MenuList({ selectedCategory, setSelectedCategory }) {
  return (
    <section className="menu-list">
      <div className="menu-item" onClick={() => setSelectedCategory("All")}>
        <p className={`menu-name ${selectedCategory === "All" ? "active" : ""}`}>
          All Items
        </p>
      </div>
      {menu_list.map((menu, index) => (
        <div
          key={index}
          className="menu-item"
          onClick={() => setSelectedCategory(menu.menu_name)}
        >
          <img src={menu.menu_image} alt={menu.menu_name} className="menu-image" />
          <p className={`menu-name ${selectedCategory === menu.menu_name ? "active" : ""}`}>
            {menu.menu_name}
          </p>
        </div>
      ))}
    </section>
  );
}

export default MenuList;
