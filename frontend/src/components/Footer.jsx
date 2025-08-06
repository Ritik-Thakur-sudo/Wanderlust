import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-10 mt-12 text-sm text-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl font-semibold mb-6">
          Inspiration for future getaways
        </h2>
        <div className="border-b mb-6">
          <button className="text-black font-medium border-b border-black pb-2">
            Unique stays
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-6 mb-10">
          {[
            ["Cabins", "United States"],
            ["Treehouses", "United States"],
            ["Tiny Houses", "United States"],
            ["Beach Houses", "United States"],
            ["Lakehouses", "United States"],
            ["Yurt Rentals", "United States"],
            ["Yurt Rentals", "United Kingdom"],
            ["Castle Rentals", "United States"],
            ["Houseboats", "United States"],
            ["Holiday Caravans", "United Kingdom"],
            ["Private Island Rentals", "United States"],
            ["Farm Houses", "United States"],
            ["Farm Cottages", "United Kingdom"],
            ["Cabin Rentals", "Australia"],
            ["Luxury Cabins", "United Kingdom"],
            ["Luxury Cabins", "United States"],
            ["Holiday Chalets", "United Kingdom"],
            ["Cottage Rentals", "United States"],
            ["Holiday Cottages", "United Kingdom"],
            ["Mansion Rentals", "United States"],
            ["Villa Rentals", "United Kingdom"],
            ["Holiday Bungalows", "United Kingdom"],
            ["Bungalow Rentals", "United States"],
            ["Condo Rentals", "United States"],
            ["Holiday Apartments", "Australia"],
            ["Holiday Houses", "United States"],
            ["Holiday Houses", "United Kingdom"],
            ["Private Holiday", "Rentals United Kingdom"],
            ["Big House Rentals", "United States"],
            ["Big Cottages", "Australia"],
            ["Large Villas", "United Kingdom"],
            ["House Rentals with a Pool", "United States"],
            ["Cabin Rentals with a Pool", "United States"],
            ["Villas with a Pool", "United Kingdom"],
            ["Apartments with a Hot Tub", "United States"],
            ["Holiday Cottages with a Hot Tub", "United Kingdom"],
            ["Beach Cabins", "United States"],
            ["Beach Condos", "United States"],
            ["Beachfront Rentals", "United States"],
            ["Beach Houses", "United Kingdom"],
            ["Beach Villas", "United Kingdom"],
            ["Coastal Cottages", "United Kingdom"],
            ["Pet-Friendly Vacation Rentals", "United States"],
            ["Pet-Friendly Beach Rentals", "United States"],
            ["Pet-Friendly Cabin Rentals", "United States"],
            ["Dog-Friendly Cottages", "United Kingdom"],
            ["Luxury Dog-Friendly Cottages", "United Kingdom"],
          ].map(([title, country], i) => (
            <div key={i}>
              <p className="font-medium">{title}</p>
              <p className="text-gray-500 text-sm">{country}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-b pb-10">
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="#">Help Centre</Link>
              </li>
              <li>
                <Link to="#">AirCover</Link>
              </li>
              <li>
                <Link to="#">Anti-discrimination</Link>
              </li>
              <li>
                <Link to="#">Disability support</Link>
              </li>
              <li>
                <Link to="#">Cancellation options</Link>
              </li>
              <li>
                <Link to="#">Report neighbourhood concern</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Hosting</h4>
            <ul className="space-y-3">
              <li>
                <Link to="#">Airbnb your home</Link>
              </li>
              <li>
                <Link to="#">Airbnb your experience</Link>
              </li>
              <li>
                <Link to="#">Airbnb your service</Link>
              </li>
              <li>
                <Link to="#">AirCover for Hosts</Link>
              </li>
              <li>
                <Link to="#">Hosting resources</Link>
              </li>
              <li>
                <Link to="#">Community forum</Link>
              </li>
              <li>
                <Link to="#">Hosting responsibly</Link>
              </li>
              <li>
                <Link to="#">Join a free Hosting class</Link>
              </li>
              <li>
                <Link to="#">Find a co‑host</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Airbnb</h4>
            <ul className="space-y-3">
              <li>
                <Link to="#">2025 Summer Release</Link>
              </li>
              <li>
                <Link to="#">Newsroom</Link>
              </li>
              <li>
                <Link to="#">Careers</Link>
              </li>
              <li>
                <Link to="#">Investors</Link>
              </li>
              <li>
                <Link to="#">Airbnb.org emergency stays</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex mt-3 text-center font-medium items-center">
            &copy; <p className="mx-2">2025 Airbnb, Inc</p>
            <ul className="space-x-3 flex">
              <li>
                <Link to={"/privacy"}>Privacy</Link>
              </li>
              <li>
                <Link to={"/term"}>Terms</Link>
              </li>
              <li>
                <Link to={"/sitemap"}>Sitemap</Link>
              </li>
              <li>
                <Link to={"/company_details"}>Comapny details</Link>
              </li>
            </ul>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Link className="flex gap-1">
                <img src="/world.svg" alt="world" className="w-4"/>
                <p>English(IN)</p>
            </Link>
            <Link>
            <p>INR</p>
            </Link>
            <Link>
                <img src="/facebook.svg" alt="facebook" />
            </Link>
             <Link>
                <img src="/x.svg" alt="facebook" />
            </Link>
             <Link>
                <img src="/instagram.svg" alt="facebook" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
