import React, { useEffect } from "react";
import "./MenuList.css";
import { menu_list } from "../assets/frontend_assets/assets";

function MenuList({ selectedCategory, setSelectedCategory }) {
  useEffect(() => {
    setSelectedCategory("All Items");
  }, [setSelectedCategory]);

  return (
    <section className="menu-list">
      {menu_list.map((menu) => (
        <div
          key={menu.menu_name}
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
