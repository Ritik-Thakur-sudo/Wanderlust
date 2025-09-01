import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

export default function Create() {
  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Only JPG, PNG, or WEBP images are allowed.");
        e.target.value = ""; 
        setImage(null);
        return;
      }
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(listing).forEach((key) => {
      const error = validateField(key, listing[key]);
      if (error) newErrors[key] = error;
    });
    if (!image) newErrors.image = "Image is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);
      Object.keys(listing).forEach((key) => {
        formData.append(key, listing[key]);
      });

      const res = await api.post("/listings", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newId = res.data?.data?._id;
      navigate(newId ? `/listings/${newId}` : "/");
    } catch (err) {
      console.error("Error creating listing:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Listing</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
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
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}

        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleImageChange}
        />
        {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={listing.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          min="1"
          step="1"
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
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading || Object.values(errors).some((err) => err)}
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
