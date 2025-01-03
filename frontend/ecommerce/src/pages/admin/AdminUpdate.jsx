import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/AdminNavbar";

const AdminUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the bag ID from the URL
  const [loading, setLoading] = useState(true);
  const [updatedBag, setUpdatedBag] = useState({
    prod_name: "",
    prod_desc: "",
    price: "",
    stock: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);

  // Fetch the bag data from the database
  useEffect(() => {
    const fetchBag = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/bags_tbl/${id}`);
        const bag = res.data;
        setUpdatedBag({
          prod_name: bag.prod_name,
          prod_desc: bag.prod_desc,
          price: bag.price,
          stock: bag.stock,
          image: bag.image,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch bag data:", err);
        alert("Error fetching bag details.");
        navigate("/"); // Redirect if fetch fails
      }
    };

    fetchBag();
  }, [id, navigate]);

  const handleChange = (e) => {
    setUpdatedBag((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = updatedBag.image;

      // Upload the image if a file was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await axios.post("http://localhost:8800/upload", formData);
        imageUrl = uploadRes.data.imageUrl;
      }

      // Update the bag with the new details
      const updatedData = {
        prod_name: updatedBag.prod_name,
        prod_desc: updatedBag.prod_desc,
        price: updatedBag.price,
        stock: updatedBag.stock,
        image: imageUrl,
      };

      await axios.put(`http://localhost:8800/bags_tbl/${id}`, updatedData);
      alert("Bag updated successfully!");
      navigate("/dashboard"); // Navigate back to the homepage
    } catch (err) {
      console.error("Failed to update the bag:", err);
      alert("Failed to update the bag. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-5">Update a Bag</h2>

        {/* Two-column layout */}
        <div className="row">
          {/* Left Column: Form */}
          <div className="col-md-6">
            <form onSubmit={handleUpdate}>
              {/* Bag Name */}
              <div className="mb-3">
                <label className="form-label">Bag Name:</label>
                <input
                  type="text"
                  name="prod_name"
                  value={updatedBag.prod_name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Bag Description */}
              <div className="mb-3">
                <label className="form-label">Bag Description:</label>
                <textarea
                  className="form-control"
                  name="prod_desc"
                  value={updatedBag.prod_desc}
                  onChange={handleChange}
                  rows="3"
                  required
                ></textarea>
              </div>

              {/* Price and Stock No */}
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={updatedBag.price}
                    onChange={handleChange}
                    className="form-control text-center"
                    required
                  />
                </div>
                <div className="col">
                <label className="form-label">Stock No:</label>
                <div className="input-group">
                  <input
                    type="number"
                    name="stock"
                    value={updatedBag.stock}
                    onChange={(e) =>
                      setUpdatedBag((prev) => ({
                        ...prev,
                        stock: e.target.value ? parseInt(e.target.value) : 0,
                      }))
                    }
                    className="form-control text-center"
                    required
                  />
                </div>
              </div>
              </div>



              {/* Image Upload */}
              <div className="mb-3">
                <label className="form-label">Image:</label>
                <div>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary mt-3">
                Update Bag
              </button>
            </form>
          </div>

          {/* Right Column: Image Preview */}
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "400px",
                backgroundColor: "#b8b8b8",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {updatedBag.image && (
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile) // Preview new image
                      : updatedBag.image.startsWith("http")
                      ? updatedBag.image
                      : `http://localhost:8800${updatedBag.image}` // Existing image
                  }
                  alt="Bag Cover"a
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdate;
