import { useParams } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const dummyData = {
  1: {
    id: 1,
    name: "Organic Gala Apples",
    price: 2.99,
    img: "/apple.jpeg",
    description:
      "Crisp, sweet, and juicy. These organic gala apples are perfect for snacking, salads, or baking.",
    specifications: ["2 lb Bag", "Red Color", "Fresh from farms"],
    reviews: [
      { id: 1, user: "John", text: "Very fresh and tasty!", rating: 5 },
      { id: 2, user: "Emma", text: "Perfect for apple pie.", rating: 4 },
    ],
  },
  // Add more products...
};

export default function ProductDetails() {
  const { id } = useParams();
  const product = dummyData[id];

  if (!product) return <h2 className="p-8">Product not found</h2>;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      {/* Left - Image */}
      <div className="flex-1">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-[400px] object-contain rounded-xl shadow-md"
        />
      </div>

      {/* Right - Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-2xl font-semibold text-green-600 mb-4">
          ${product.price}/lb
        </p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
            <FaShoppingCart /> Add to Cart
          </button>
          <button className="border border-green-500 text-green-500 px-6 py-3 rounded-lg hover:bg-green-100">
            Buy Now
          </button>
        </div>

        {/* Specifications */}
        <h3 className="text-lg font-semibold mb-2">Specifications</h3>
        <ul className="list-disc ml-5 text-gray-600">
          {product.specifications.map((spec, i) => (
            <li key={i}>{spec}</li>
          ))}
        </ul>

        {/* Reviews */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Reviews</h3>
        {product.reviews.map((r) => (
          <div key={r.id} className="border-b py-2">
            <p className="font-medium">{r.user}</p>
            <p className="text-gray-600">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
