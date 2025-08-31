import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:8080/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => console.error("Error fetching listing:", err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!listing.title.trim()) newErrors.title = "Title is required.";
    if (!listing.description.trim())
      newErrors.description = "Description is required.";
    if (!listing.price || listing.price <= 0)
      newErrors.price = "Price is required.";
    if (!listing.location.trim()) newErrors.location = "Location is required.";
    if (!listing.country.trim()) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:8080/listings/${id}`, listing);
      navigate(`/listings/${id}`);
    } catch (err) {
      console.error("Error updating listing:", err);
      alert("Failed to update listing.");
    }
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={listing.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <textarea
          name="description"
          placeholder="Description"
          value={listing.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={listing.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={listing.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location}</p>
        )}

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={listing.country}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country}</p>
        )}

        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Update Listing
        </button>
      </form>
    </div>
  );
}
