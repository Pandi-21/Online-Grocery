// src/components/OfferList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { dummyOffers } from "../../data/dummyOffers";

export default function OfferList({ type }) {
  const [offers, setOffers] = useState([]);

 
  useEffect(() => {
    // filter dummy offers by type
    const filtered = dummyOffers.filter((item) => item.offerType === type);
setOffers(filtered);
  }, [type]);

  const titleMap = {
    todaysDeals: "Today's Deals",
    topOffers: "Top Offers",
    buy1get1: "Buy 1 Get 1",
    seasonalSales: "Seasonal Sales",
    membership: "Membership / Loyalty Deals",
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{titleMap[type]}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offers.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow p-4 flex flex-col">
            {/* <Link to={`/offer/${item.id}`}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-contain rounded"
              />
            </Link> */}
            <Link to={`/offer/${item.offerType}/${item.id}`}>
  <img src={item.image} alt={item.name} className="w-full h-40 object-contain rounded" />
</Link>

            <h2 className="mt-3 font-semibold text-lg">{item.name}</h2>
            <p className="text-gray-500 text-sm">{item.description}</p>
            <p className="mt-2 text-lg font-bold">
              ₹
              {item.offerType === "membership" && item.subscriptionPrice
                ? item.subscriptionPrice
                : item.price}
            </p>
            <button className="mt-2 w-full flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
