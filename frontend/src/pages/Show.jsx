import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Review from "../components/Review";

export default function Show() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/listings/${id}`)
      .then((res) => {
        setListing(res.data);
        setReviews(res.data.reviews || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching listing:", err);
        setLoading(false);
      });
  }, [id]);

  const addReview = (review) => {
    setReviews((prev) => [...prev, review]);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await axios.delete(`http://localhost:8080/listings/${id}`);
        alert("Listing deleted successfully!");
        navigate("/");
      } catch (err) {
        console.error("Error deleting listing:", err);
        alert("Failed to delete listing.");
      }
    }
  };

  if (loading) return <div className="p-5">Loading...</div>;
  if (!listing) return <div className="p-5">Listing not found.</div>;

  return (
    <>
      <div className="p-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

        {listing.image?.url && (
          <img
            src={listing.image.url}
            alt={listing.title}
            className="w-full h-72 object-cover rounded-xl mb-4"
          />
        )}
        <p className="text-gray-700 text-lg mb-2">{listing.description}</p>
        <p className="text-gray-800 font-medium text-lg">
          ₹{listing.price} - {listing.location}, {listing.country}
        </p>

        <div className="mt-4 flex gap-8 items-center">
          <Link
            to={`/listings/${id}/edit`}
            className="text-gray-700 underline font-medium"
          >
            Edit this listing
          </Link>
          <button
            onClick={handleDelete}
            className="border px-4 py-2 rounded bg-red-500 text-white"
          >
            Delete this listing
          </button>
        </div>
      </div>
      <hr />
      <Review reviews={reviews} addReview={addReview} setReviews={setReviews} />
    </>
  );
}
