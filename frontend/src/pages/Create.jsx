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

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "title":
        if (!value.trim()) message = "Title is required.";
        else if (value.length < 3)
          message = "Title must be at least 3 characters.";
        break;
      case "description":
        if (!value.trim()) message = "Description is required.";
        else if (value.length < 10)
          message = "Description must be at least 10 characters.";
        break;
      case "price":
        if (!value) message = "Price is required.";
        else if (value <= 0) message = "Price must be greater than 0.";
        break;
      case "location":
        if (!value.trim()) message = "Location is required.";
        break;
      case "country":
        if (!value.trim()) message = "Country is required.";
        else if (!/^[a-zA-Z\s]+$/.test(value))
          message = "Country name must contain only letters.";
        break;
      default:
        break;
    }

    return message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => ({ ...prev, [name]: value }));

    // field validation
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields before submit
    const newErrors = {};
    Object.keys(listing).forEach((key) => {
      const error = validateField(key, listing[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
        {["title", "description", "price", "location", "country"].map(
          (field) => (
            <div key={field}>
              {field === "description" ? (
                <textarea
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={listing[field]}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              ) : (
                <input
                  type={field === "price" ? "number" : "text"}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={listing[field]}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              )}
              {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
            </div>
          )
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={Object.values(errors).some((err) => err)}
        >
          Create Listing
        </button>
      </form>
    </div>
  );
}
