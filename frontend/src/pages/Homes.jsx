import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

export default function Homes() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    axios
      .get("http://localhost:8080/listings")
      .then((res) => setListings(res.data))
      .catch((err) => console.error("Error fetching listings:", err));
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">All Listings</h1>
        <div className="grid grid-cols-4 gap-6">
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
                />
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold">{listing.title}</h2>
                <p className="text-gray-600 mb-2">{listing.description}</p>
                <p className="text-sm text-gray-700">
                  ₹{listing.price} - {listing.location}, {listing.country}
                </p>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
