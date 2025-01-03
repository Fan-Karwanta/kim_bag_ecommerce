import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useUser } from '../context/UserContext'; 

const CustomerCardBag = ({ bag }) => {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [ratings, setRatings] = useState([]);
  const { userEmail } = useUser(); // Access the user's email from context

  const handleShowModal = async () => {
    setShowModal(true);
    await fetchRatings();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === 'increase' ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!userEmail) {
      alert('Please log in first!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8800/cart', {
        email: userEmail,
        prod_name: bag.prod_name,
        price: bag.price * quantity,
        quantity: quantity,
      });

      if (response.data.success) {
        alert('Product added to cart!');
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred while adding to the cart.');
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/ratings?product_id=${bag.prod_name}`);
      if (response.data.success) {
        setRatings(response.data.ratings);
      } else {
        setRatings([]);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setRatings([]);
    }
  };

  return (
    <>
      <div className="card shadow-sm p-3 mb-4 bg-white rounded" style={{ width: '18rem' }}>
        <div className="bg-secondary d-flex justify-content-center align-items-center rounded mx-auto" style={{ width: '100%', aspectRatio: '4 / 5', overflow: 'hidden' }}>
          {bag.image && <img src={bag.image.startsWith('http') ? bag.image : `http://localhost:8800${bag.image}`} alt={bag.prod_name} className="w-100 h-100" style={{ objectFit: 'cover' }} />}
        </div>
        <div className="card-body">
          <h5 className="card-title d-flex justify-content-between">
            <span>{bag.prod_name || 'Bag Name'}</span>
            <span className="fw-bold">&#8369;{bag.price || 350}</span>
          </h5>
          <p className="card-text text-muted">{bag.prod_desc || 'lorem ipsum lorem ipsum lorem ipsum'}</p>
          <p>Stock No: {bag.stock || '99'}</p>
          <button className="btn btn-dark btn-sm w-100" onClick={handleShowModal}>
            View Details
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{bag.prod_name || "Bag Name"}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body d-flex">
                <div
                  className="bg-light me-4"
                  style={{
                    width: "240px",
                    aspectRatio: "4 / 5",
                    overflow: "hidden",
                  }}
                >
                  {bag.image && (
                    <img
                      src={
                        bag.image.startsWith("http")
                          ? bag.image
                          : `http://localhost:8800${bag.image}`
                      }
                      alt={bag.prod_name}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>

                <div>
                  <p>{bag.prod_desc || "Lorem ipsum lorem ipsum lorem ipsum"}</p>
                  <p>
                    <strong>Currently Available:</strong> {bag.stock || "999"}
                  </p>
                  <p>
                    <strong>Ratings:</strong> ⭐ {ratings.reduce((acc, rating) => acc + rating.rating, 0) / (ratings.length || 1)}/5
                  </p>
                  <div className="mt-3">
                    <strong>Customer Reviews:</strong>
                    <ul className="list-unstyled mt-2">
                      {ratings.length > 0 ? (
                        ratings.map((review) => (
                          <li key={review.rating_id} className="mb-2">
                            <strong>⭐ {review.rating}/5:</strong> {review.comment || 'No comment provided.'}
                          </li>
                        ))
                      ) : (
                        <li>No reviews available for this product.</li>
                      )}
                    </ul>
                  </div>
                  <div className="d-flex align-items-center mt-4">
                    <span className="me-2">Quantity:</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange("decrease")}
                    >
                      -
                    </button>
                    <span className="mx-2">{quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange("increase")}
                    >
                      +
                    </button>
                  </div>
                  <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerCardBag;
