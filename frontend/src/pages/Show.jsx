import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../axiosConfig";
import Review from "../components/Review";
import { useAuth } from "../context/AuthContext";

export default function Show() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        const data = res.data?.data || res.data;

        setListing(data);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error fetching listing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const addReview = (review) => {
    setReviews((prev) => [...prev, review]);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        await api.delete(`/listings/${id}`);
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

        <p className="italic mb-2 text-lg">
          Owned by:{" "}
          <span className="font-semibold">{listing.owner.username}</span>
        </p>
        <p className="text-gray-700 text-lg mb-2">{listing.description}</p>
        <p className="text-gray-800 font-medium text-lg">
          ₹{listing.price} — {listing.location}, {listing.country}
        </p>

        {user && listing.owner._id === user._id && (
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
              Delete listing
            </button>
          </div>
        )}
      </div>

      <hr className="my-6" />
      <Review
        reviews={reviews}
        addReview={addReview}
        setReviews={setReviews}
        user={user}
        listingId={id}
      />
    </>
  );
}
