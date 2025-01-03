import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerNavbar from "../../components/CustomerNavbar";
import CustomerCardBag from "../../components/CustomerCardBag";
import { MdCancel } from "react-icons/md";

const CustomerDashboard = () => {
  const [bags_tbl, setBags] = useState([]); // State to hold all bags
  const [filteredBags, setFilteredBags] = useState([]); // State to hold filtered bags
  const [cart, setCart] = useState([]); // State to hold cart items
  const [searchTerm, setSearchTerm] = useState(""); // State to hold search input

  // Fetch all bags from the server
  useEffect(() => {
    const fetchAllBags = async () => {
      try {
        const res = await axios.get("http://localhost:8800/bags_tbl");
        setBags(res.data);
        setFilteredBags(res.data); // Initially set filtered bags to all bags
      } catch (err) {
        console.log("Error fetching bags:", err);
      }
    };
    fetchAllBags();
  }, []);

  // Add to Cart handler
  const handleAddToCart = (bag) => {
    setCart((prevCart) => [...prevCart, bag]);
    alert(`${bag.name} added to cart!`);
  };

  // Search handler
  const handleSearch = () => {
    const filtered = bags_tbl.filter(
      (bag) =>
        bag &&
        bag.prod_name &&
        bag.prod_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBags(filtered);
  };

  // Clear Search handler
  const handleClearSearch = () => {
    setSearchTerm(""); // Reset the search term
    setFilteredBags(bags_tbl); // Reset the filtered bags to all bags
  };

  // Handler to update search term
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <CustomerNavbar />
      <div className="m-5">
        {/* TITLE and SEARCH */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Marketplace</h2>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search Bags"
              value={searchTerm}
              onChange={handleSearchInputChange} // Only updates search term
            />
            {searchTerm && ( // Only show the "X" icon if there's a search term
              <button
                className="btn btn-link text-danger p-0 me-2"
                onClick={handleClearSearch} // Trigger clearing the search
                style={{ textDecoration: "none", fontSize: "1.5rem" }}
                aria-label="Clear Search"
              >
                <MdCancel />
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={handleSearch} // Trigger search only on button click
            >
              Search
            </button>
          </div>
        </div>

        {/* Bags DISPLAY */}
        <div className="row">
          {filteredBags.length > 0 ? (
            filteredBags.map(
              (bag) =>
                bag &&
                bag.id && (
                  <div className="col-md-4 col-lg-3 mb-4" key={bag.id}>
                    <CustomerCardBag
                      bag={bag}
                      handleAddToCart={() => handleAddToCart(bag)}
                    />
                  </div>
                )
            )
          ) : (
            <div className="col-12">
              <p>No bags found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
