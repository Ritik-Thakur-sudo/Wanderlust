import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig";

export default function Homes() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/listings");
        if (res.data?.success) {
          setListings(res.data.data || []);
        } else {
          console.error(res.data?.error || "Failed to load listings");
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-5">Loading...</div>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">All Listings</h1>

      {listings.length === 0 ? (
        <p className="text-gray-600">No listings yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/listings/${listing._id}`)}
            >
              {listing.image?.url && (
                <img
                  src={listing.image.url}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold line-clamp-1">
                  {listing.title}
                </h2>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  {listing.description}
                </p>
                <p className="text-sm text-gray-700">
                  ₹{listing.price}/ day — {listing.location}, {listing.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
