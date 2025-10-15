import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import RelatedProducts from "./RelatedProducts";
import { API as api } from "../../admin/api/api";
import { useCart } from "../../context/CartContext";

export default function ProductDetails() {
  const { subcategory, item, productSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
 const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${subcategory}/${item}/${productSlug}`);
        const prod = res.data;
        setProduct(prod);
        setMainImage(prod.images?.[0] || "");
        setSize(prod.sizes?.[0] || "");
        setColor(prod.colors?.[0] || "");

        // ✅ Default quantity = first element in quantity_options or 1
        if (prod.quantity_options && prod.quantity_options.length > 0) {
          setQuantity(prod.quantity_options[0]);
        } else {
          setQuantity(1);
        }

      } catch (err) {
        console.error(err);
        toast.error("Product not found");
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [subcategory, item, productSlug, navigate]);

  if (loading) return <h2 className="p-8">Loading product...</h2>;
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize: size, selectedColor: color }, quantity);
    toast.success(`${product.name} added to your basket`);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, selectedSize: size, selectedColor: color }, quantity);
    toast.success(`${product.name} added & redirecting to checkout`);
    navigate("/cart");
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left images */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-xl shadow-md mb-4 group">
            <img
              src={`${BACKEND_URL}/uploads/${mainImage}`}
              alt={product.name}
              className="w-full h-[400px] object-contain rounded-xl transition-transform duration-300 ease-in-out group-hover:scale-110 cursor-pointer"
            />
          </div>
          <div className="flex gap-4">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={`${BACKEND_URL}/uploads/${img}`}
                alt={`thumbnail ${idx}`}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition duration-200 ${
                  mainImage === img ? "border-green-500" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-green-600 mb-6">
            ${product.price}{product.unit ? `/${product.unit}` : ""}
          </p>
          <p
  className="text-gray-600 mb-6"
  dangerouslySetInnerHTML={{ __html: product.description }}
></p>


          {/* Size, Color, Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                {product.sizes?.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                {product.colors?.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <select
  value={quantity}
  onChange={(e) => setQuantity(Number(e.target.value))}
  className="w-full border rounded-lg px-3 py-2"
>
  {product.quantity_options.map((q) => (
    <option key={q} value={q}>
      {q}
    </option>
  ))}
</select>
 

            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="border border-green-500 text-green-500 px-6 py-3 rounded-lg hover:bg-green-100"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b flex gap-6 mb-4">
          {["description", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 capitalize ${
                activeTab === tab
                  ? "text-green-600 border-b-2 border-green-600 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "description" && <div className="text-gray-700">{product.description}</div>}
        {activeTab === "specifications" && (
          <ul className="list-disc ml-5 text-gray-700">
            {product.specifications &&
              Object.entries(product.specifications).map(([key, value], i) => (
                <li key={i}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
          </ul>
        )}
        {activeTab === "reviews" && (
          <div>
            {product.reviews?.map((r, i) => (
              <div key={i} className="border-b py-2">
                <p className="font-medium">{r.user}</p>
                <p className="text-gray-600">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      <div className="mt-12">
        <RelatedProducts currentProductId={product._id} subcategory={subcategory} item={item} />
      </div>
    </div>
  );
}
