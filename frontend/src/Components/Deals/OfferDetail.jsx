import { useParams } from "react-router-dom";
import { dummyOffers } from "../../data/dummyOffers";

export default function OfferDetail() {
  const { type, id } = useParams();

  // Find offer by menu type + per-menu id
  const offer = dummyOffers.find(
    (item) => item.offerType === type && item.id === parseInt(id)
  );

  if (!offer) return <p>Offer not found…</p>;

  // Handle price (normal / membership)
  const finalPrice =
    offer.offerType === "membership" && offer.subscriptionPrice
      ? offer.subscriptionPrice
      : offer.price;

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      {/* Left Side – Product Image + thumbnails */}
      <div>
        <img
          src={offer.image}
          alt={offer.name}
          className="w-full h-80 object-contain rounded-lg shadow"
        />
        {/* Thumbnails */}
        <div className="flex gap-3 mt-3">
          {offer.thumbnails?.map((thumb, index) => (
            <img
              key={index}
              src={thumb}
              alt={`thumb-${index}`}
              className="w-20 h-20 object-cover border rounded cursor-pointer hover:border-green-500"
            />
          ))}
        </div>
      </div>

      {/* Right Side – Product Details */}
      <div>
        <h1 className="text-3xl font-bold">{offer.name}</h1>
        <p className="text-green-600 text-xl mt-2">₹{finalPrice}</p>
        <p className="text-gray-500 mt-3">{offer.description}</p>

        {/* Options – Size, Color, Quantity */}
        <div className="flex gap-4 mt-6">
          <select className="border p-2 rounded">
            <option>1 lb Bag</option>
            <option>2 lb Bag</option>
            <option>5 lb Bag</option>
          </select>

          <select className="border p-2 rounded">
            <option>Red</option>
            <option>Green</option>
          </select>

          <select className="border p-2 rounded">
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Add to Cart
          </button>
          <button className="border border-green-600 text-green-600 px-6 py-2 rounded-lg hover:bg-green-50">
            Buy Now
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="col-span-2 mt-10">
        <div className="flex gap-6 border-b">
          <button className="text-green-600 font-semibold border-b-2 border-green-600 pb-2">
            Description
          </button>
          <button className="text-gray-600 pb-2">Specifications</button>
          <button className="text-gray-600 pb-2">Reviews</button>
        </div>
        <p className="mt-4 text-gray-600">
          {offer.longDescription || offer.description}
        </p>
      </div>

      {/* Related Products */}
      <div className="col-span-2 mt-10">
        <h2 className="text-xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {offer.related?.map((rel, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-3 shadow-sm hover:shadow-md transition"
            >
              <img
                src={rel.image}
                alt={rel.name}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="font-semibold mt-2">{rel.name}</h3>
              <p className="text-green-600">{rel.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
