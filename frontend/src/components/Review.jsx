import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axiosConfig";

export default function Review({ reviews, setReviews }) {
  const { id } = useParams();
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const validate = () => {
    if (!rating || rating < 1 || rating > 5)
      return "Rating must be between 1 and 5";
    if (!comment.trim()) return "Comment cannot be empty";
    if (comment.length > 1000) return "Comment is too long (max 1000 chars)";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const v = validate();
    if (v) return setError(v);

    try {
      setSubmitting(true);
      setError("");

      const res = await api.post(`/listings/${id}/reviews`, {
        review: { rating, comment },
      });

      const payload = res.data?.data ?? res.data; 
      if (!payload || !payload._id) {
        return setError("Review created");
      }

      setReviews((prev) => [...prev, payload]);
      setRating(1);
      setComment("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data ||
          "Failed to submit review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      setDeletingId(reviewId);
      await api.delete(`/listings/${id}/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const Stars = ({ value }) => {
    const full = Math.max(0, Math.min(5, Number(value) || 0));
    return (
      <span aria-label={`Rating: ${full} out of 5`} className="font-medium">
        {"★".repeat(full)}
        <span className="text-gray-300">{"★".repeat(5 - full)}</span>
      </span>
    );
  };

  return (
    <div className="p-6 mx-auto">
      <div className="p-4 border rounded-md shadow-sm mb-6">
        <h4 className="text-xl font-bold mb-2">Leave a Review</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="rating" className="block font-medium">
              Rating (1–5)
            </label>
            <input
              id="rating"
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => {
                setRating(Number(e.target.value));
                setError("");
              }}
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="comment" className="block font-medium">
              Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError("");
              }}
              className="border rounded px-2 py-1 w-full"
              rows={3}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1">
              {comment.length}/1000
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className={`mt-2 px-4 py-2 rounded text-white ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <hr className="mb-4" />

      <div>
        <h4 className="text-xl font-bold mb-3">All Reviews</h4>

        {reviews?.length ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="p-3 mb-3 border rounded-md bg-gray-50 shadow-sm"
            >
              <p className="font-medium">Ritik Thakur</p>
              <p className="flex items-center gap-2 text-yellow-500">
                <Stars value={review.rating} />
                <span className="text-gray-600">({review.rating})</span>
              </p>
              <p className="mb-1">{review.comment}</p>
              <p className="text-sm text-gray-500">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleString()
                  : ""}
              </p>

              <button
                onClick={() => handleDelete(review._id)}
                disabled={deletingId === review._id}
                className={`mt-2 px-3 py-1 text-sm text-white rounded ${
                  deletingId === review._id
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {deletingId === review._id ? "Deleting..." : "Delete"}
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
