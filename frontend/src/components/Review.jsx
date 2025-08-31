import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Review({ reviews, addReview, setReviews }) {
  const { id } = useParams();
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      return setError("Rating must be between 1 and 5");
    }
    if (!comment.trim()) {
      return setError("Comment cannot be empty");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:8080/listings/${id}/reviews`,
        { review: { rating, comment } }
      );

      addReview(res.data);
      setError("");
      setRating(1);
      setComment("");
    } catch (err) {
      setError(err.response?.data || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(
        `http://localhost:8080/listings/${id}/reviews/${reviewId}`
      );
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
    } catch (error) {
      alert("Failed to delete review", error);
    }
  };

  const renderStarsImg = (n) => (
    <span
      className="inline-flex items-center gap-1 align-middle"
    >
      {Array.from({ length: n }).map((_, i) => (
        <img
          key={i}
          src="/OIP.jpg"
          alt="star"
          className="h-4 w-4 inline-block"
        />
      ))}
      <span className="text-gray-600 text-sm"></span>
    </span>
  );

  return (
    <div className="p-6 mx-auto">
      <div className="p-4 border rounded-md shadow-sm mb-6">
        <h4 className="text-xl font-bold mb-2">Leave a Review</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block font-medium">Rating (1-5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(event) => {
                setRating(Number(event.target.value));
                setError("");
              }}
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium">Comment</label>
            <textarea
              value={comment}
              onChange={(event) => {
                setComment(event.target.value);
                setError("");
              }}
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <hr className="mb-4" />

      <div>
        <h4 className="text-xl font-bold mb-3">All Reviews</h4>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="p-3 mb-3 border rounded-md bg-gray-50 shadow-sm"
            >
              <p className="font-medium">Ritik Thakur</p>
              <p className="text-yellow-500">
                {renderStarsImg(review.rating)}
                <span className="text-gray-600">({review.rating})</span>
              </p>
              <p className="mb-1">{review.comment}</p>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleString()}
              </p>

              <button
                onClick={() => handleDelete(review._id)}
                className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <div className="p-4 border rounded-md bg-gray-100 text-gray-500 text-center">
            No reviews yet!
          </div>
        )}
      </div>
    </div>
  );
}
