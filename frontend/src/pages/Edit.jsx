import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function Edit() {
  const { id } = useParams();
  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/listings/${id}`)
      .then((res) => {
        setListing(res.data);
      })
      .catch((err) => {
        console.error("Error fetching listing:", err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/listings/${id}`, listing);
    //   alert("Listing updated successfully!");
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
        <textarea
          name="description"
          placeholder="Description"
          value={listing.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={listing.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={listing.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={listing.country}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
          Update Listing
        </button>
      </form>
    </div>
  );
}
