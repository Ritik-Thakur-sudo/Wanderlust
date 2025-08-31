import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import "../css/rating.css";

export default function Review({ reviews, setReviews }) {
  const { id } = useParams();
  const { user } = useAuth();
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
        return setError("Failed to create review");
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

  return (
    <div className="p-6 mx-auto">
      <div className="p-4 border rounded-md shadow-sm mb-6">
        <h4 className="text-xl font-bold mb-2">Leave a Review</h4>

        <form onSubmit={handleSubmit}>
          <label htmlFor="rating">Rating:</label>
          <fieldset className="starability-slot">

            <input
              type="radio"
              id="rate1"
              name="rating"
              value="1"
              checked={rating === 1}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <label htmlFor="rate1" title="Terrible">
              1 star
            </label>

            <input
              type="radio"
              id="rate2"
              name="rating"
              value="2"
              checked={rating === 2}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <label htmlFor="rate2" title="Not good">
              2 stars
            </label>

            <input
              type="radio"
              id="rate3"
              name="rating"
              value="3"
              checked={rating === 3}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <label htmlFor="rate3" title="Average">
              3 stars
            </label>

            <input
              type="radio"
              id="rate4"
              name="rating"
              value="4"
              checked={rating === 4}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <label htmlFor="rate4" title="Very good">
              4 stars
            </label>

            <input
              type="radio"
              id="rate5"
              name="rating"
              value="5"
              checked={rating === 5}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <label htmlFor="rate5" title="Amazing">
              5 stars
            </label>
          </fieldset>

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
        <h4 className="text-xl font-bold mb-4">All Reviews</h4>

        {reviews?.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">
                    {review.owner?.username ||
                      review.owner?.email ||
                      "Anonymous"}
                  </p>

                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <span
                      className="starability-result"
                      data-rating={review.rating}
                    ></span>
                    <span className="ml-1">{review.rating}</span>
                  </div>
                </div>

                <p className="mt-3 text-gray-700 leading-relaxed">
                  {review.comment}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </p>

                {user && review.owner && user._id === review.owner._id && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={deletingId === review._id}
                    className={`mt-3 px-3 py-1 text-sm text-white rounded ${
                      deletingId === review._id
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {deletingId === review._id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 border rounded-md bg-gray-100 text-gray-500 text-center">
            No reviews yet!
          </div>
        )}
      </div>
    </div>
  );
}
