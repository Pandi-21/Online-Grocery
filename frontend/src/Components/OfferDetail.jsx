import { useParams } from "react-router-dom";
import { dummyOffers } from "../data/dummyOffers";

export default function OfferDetail() {
  const { type, id } = useParams();

  // Find offer by menu type + per-menu id
  const offer = dummyOffers.find(
    (item) => item.offerType === type && item.id === parseInt(id)
  );

  if (!offer) return <p>Offer not found…</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img src={offer.image} alt={offer.name} className="w-full h-60 object-contain" />
      <h1 className="text-3xl font-bold mt-4">{offer.name}</h1>
      <p className="text-gray-500">{offer.description}</p>
      <p className="text-2xl font-bold mt-2">
        ₹{offer.offerType === "membership" && offer.subscriptionPrice
          ? offer.subscriptionPrice
          : offer.price}
      </p>
    </div>
  );
}
