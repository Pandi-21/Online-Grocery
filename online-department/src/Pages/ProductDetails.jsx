// src/components/ProductDetails.jsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import RelatedProducts from "./RelatedProducts";

const dummyData = {
  1: {
    id: 1,
    name: "Organic Gala Apples",
    price: 2.99,
    images: ["/apple.jpeg", "/carrort.jpeg", "/apple.jpeg"],
    description: `Our Organic Gala Apples are sourced from the finest orchards, grown with care and without the use of synthetic pesticides or fertilizers. Known for their mildly sweet flavor and crisp, aromatic flesh, these apples are a versatile favorite.`,
    specifications: ["2 lb Bag", "Red Color", "Fresh from farms", "No pesticides"],
    reviews: [
      { id: 1, user: "John", text: "Very fresh and tasty!", rating: 5 },
      { id: 2, user: "Emma", text: "Perfect for apple pie.", rating: 4 },
    ],
    category: "fruits",
  },
};

export default function ProductDetails() {
  const { id } = useParams();
  const product = dummyData[id];

  // for thumbnails
  const [mainImage, setMainImage] = useState(
    product?.images ? product.images[0] : ""
  );

  // for tabs
  const [activeTab, setActiveTab] = useState("description");

  // for dropdowns
  const [size, setSize] = useState("2 lb Bag");
  const [color, setColor] = useState("Red");
  const [quantity, setQuantity] = useState(1);

  if (!product) return <h2 className="p-8">Product not found</h2>;

  return (
    <div className="p-8">
      {/* Title & Price */}
       
      {/* top section: image + info */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Main Image + Thumbnails */}
        <div className="flex-1">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-[400px] object-contain rounded-xl shadow-md mb-4"
          />
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumbnail ${idx}`}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${
                  mainImage === img ? "border-green-500" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-2xl font-semibold text-green-600 mb-6">
        ${product.price}/lb
      </p>
 <p className="text-gray-600 mb-6">
            Crisp, sweet, and juicy. These organic gala apples are perfect for snacking,
            salads, or baking into your favorite dessert.
          </p>
          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option>2 lb Bag</option>
                <option>5 lb Bag</option>
                <option>10 lb Bag</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option>Red</option>
                <option>Green</option>
                <option>Yellow</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                {[1, 2, 3, 4, 5].map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-6">
            <button className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="border border-green-500 text-green-500 px-6 py-3 rounded-lg hover:bg-green-100">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ⬇️ Tabs now full width under image & info */}
      <div className="mt-8">
        <div className="border-b flex gap-6 mb-4">
          <button
            className={`pb-2 ${
              activeTab === "description"
                ? "text-green-600 border-b-2 border-green-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`pb-2 ${
              activeTab === "specifications"
                ? "text-green-600 border-b-2 border-green-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("specifications")}
          >
            Specifications
          </button>
          <button
            className={`pb-2 ${
              activeTab === "reviews"
                ? "text-green-600 border-b-2 border-green-600 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {activeTab === "description" && (
          <div className="text-gray-700">{product.description}</div>
        )}
        {activeTab === "specifications" && (
          <ul className="list-disc ml-5 text-gray-700">
            {product.specifications.map((spec, i) => (
              <li key={i}>{spec}</li>
            ))}
          </ul>
        )}
        {activeTab === "reviews" && (
          <div>
            {product.reviews.map((r) => (
              <div key={r.id} className="border-b py-2">
                <p className="font-medium">{r.user}</p>
                <p className="text-gray-600">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products full width */}
      <div className="mt-12">
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </div>
    </div>
  );
}
