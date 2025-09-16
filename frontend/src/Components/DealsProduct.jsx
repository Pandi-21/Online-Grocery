import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";

export default function DealsProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [mainImage, setMainImage] = useState(product?.image || "");
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [cartQty, setCartQty] = useState(0);

  if (!product) return <h2 className="p-8">Product not found</h2>;

  const handleAddToCart = () => {
    setCartQty((prev) => prev + quantity);
    toast.success(`${product.name} added to your basket`, { id: "basket" });
  };

  const handleIncrement = () => setCartQty((prev) => prev + 1);
  const handleDecrement = () => setCartQty((prev) => Math.max(prev - 1, 0));

  const handleBuyNow = () => {
    if (cartQty === 0) setCartQty(quantity);
    navigate("/cart");
  };

  return (
    <div className="p-8">
      <button className="mb-4 text-blue-500" onClick={() => navigate(-1)}>← Back to Deals</button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left */}
        <div className="flex-1">
          <img src={mainImage} alt={product.name} className="w-full h-[400px] object-contain rounded-xl shadow-md mb-4" />
          {product.images && product.images.length > 0 && (
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumbnail ${idx}`}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? "border-green-500" : "border-transparent"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-green-600 mb-6">${product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2"
              >
                {[1,2,3,4,5].map(q => <option key={q}>{q}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            {cartQty === 0 ? (
              <button onClick={handleAddToCart} className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
                <FaShoppingCart /> Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={handleDecrement} className="bg-red-500 text-white px-4 py-2 rounded-full">–</button>
                <span className="text-lg font-medium">{cartQty}</span>
                <button onClick={handleIncrement} className="bg-green-500 text-white px-4 py-2 rounded-full">+</button>
              </div>
            )}
            <button onClick={handleBuyNow} className="border border-green-500 text-green-500 px-6 py-3 rounded-lg hover:bg-green-100">Buy Now</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b flex gap-6 mb-4">
          <button className={`pb-2 ${activeTab==="description"?"text-green-600 border-b-2 border-green-600 font-semibold":"text-gray-500"}`} onClick={()=>setActiveTab("description")}>Description</button>
          <button className={`pb-2 ${activeTab==="specifications"?"text-green-600 border-b-2 border-green-600 font-semibold":"text-gray-500"}`} onClick={()=>setActiveTab("specifications")}>Specifications</button>
          <button className={`pb-2 ${activeTab==="reviews"?"text-green-600 border-b-2 border-green-600 font-semibold":"text-gray-500"}`} onClick={()=>setActiveTab("reviews")}>Reviews</button>
        </div>

        {activeTab==="description" && <div className="text-gray-700">{product.description}</div>}
        {activeTab==="specifications" && product.specifications && <ul className="list-disc ml-5 text-gray-700">{product.specifications.map((s,i)=><li key={i}>{s}</li>)}</ul>}
        {activeTab==="reviews" && product.reviews && <div>{product.reviews.map(r=><div key={r.id} className="border-b py-2"><p className="font-medium">{r.user}</p><p className="text-gray-600">{r.text}</p></div>)}</div>}
      </div>
    </div>
  );
}
