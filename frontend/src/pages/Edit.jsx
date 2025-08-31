import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axiosConfig";

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

  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        const data = res.data?.data || res.data;
        setListing({
          title: data.title || "",
          description: data.description || "",
          price: data.price ? String(data.price) : "",
          location: data.location || "",
          country: data.country || "",
        });
        if (data.image?.url) {
          setCurrentImage(data.image.url);
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
        alert("Failed to load listing.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => ({ ...prev, [name]: value }));
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

  const validateForm = () => {
    const newErrors = {};
    if (!listing.title.trim()) newErrors.title = "Title is required.";
    if (!listing.description.trim())
      newErrors.description = "Description is required.";

    const priceNum = Number(listing.price);
    if (!listing.price || Number.isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (!listing.location.trim()) newErrors.location = "Location is required.";
    if (!listing.country.trim()) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", listing.title);
      formData.append("description", listing.description);
      formData.append("price", Number(listing.price));
      formData.append("location", listing.location);
      formData.append("country", listing.country);
      if (image) {
        formData.append("image", image);
      }

      const res = await api.put(`/listings/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success === false) {
        return alert(res.data.error || "Failed to update listing.");
      }
      navigate(`/listings/${id}`);
    } catch (err) {
      console.error("Error updating listing:", err);
      alert("Failed to update listing.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-5">Loading...</div>;

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
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

        {currentImage && (
          <div>
            <p className="text-gray-600 text-sm mb-1">Current Image:</p>
            <img
              src={currentImage}
              alt="Listing"
              className="w-48 rounded mb-2"
            />
          </div>
        )}

        <input
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={handleImageChange}
        />

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
          disabled={submitting}
          className={`text-white px-4 py-2 rounded ${
            submitting
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {submitting ? "Updating..." : "Update Listing"}
        </button>
      </form>
    </div>
  );
}
