import React from "react";
import "./Home.css";

function Home() {
  return (
    <section className="home-section" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <div className="home-content">
        <h1>Order your favourite food here</h1>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes crafted with the
          finest ingredients and culinary expertise. Our mission is to satisfy your cravings
          and elevate your dining experience, one delicious meal at a time.
        </p>
        {/* <button className="view-menu-btn">View Menu</button> */}
      </div>
      <div className="home-image">
        {/* <img
          src="frontend\src\assets\frontend_assets\food_1.png"
          alt="Food Plate"
        /> */}
      </div>
    </section>
  );
}

export default Home;
