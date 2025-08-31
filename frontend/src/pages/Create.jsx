import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Create() {
  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/listings", listing);
      alert("Listing created successfully!");
      navigate(`/listings/${res.data._id}`);
    } catch (err) {
      console.error("Error creating listing:", err);
      alert("Failed to create listing.");
    }
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={listing.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={listing.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={listing.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={listing.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={listing.country}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Listing
        </button>
      </form>
    </div>
  );
}
