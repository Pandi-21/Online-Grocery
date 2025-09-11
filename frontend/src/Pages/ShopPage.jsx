import { useParams, Link } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import SidebarFilters from "../Components/SidebarFilters";

const dummyData = {
  "fresh-fruits": [
    { id: 1, name: "Apples", price: 2.99, rating: 4.8, reviews: 124, img: "/apple.jpeg", category: "Fresh-Fruits" },
    { id: 2, name: "Bananas", price: 0.59, rating: 4.5, reviews: 98, img: "/banana.jpeg", category: "Fresh-Fruits" },
    { id: 3, name: "Oranges", price: 1.29, rating: 4.6, reviews: 85, img: "/orange.jpeg", category: "Fresh-Fruits" },
    { id: 4, name: "Grapes", price: 3.49, rating: 4.7, reviews: 67, img: "/grapes.jpeg", category: "Fresh-Fruits" },
  ],
};

export default function ShopPage() {
  const { category } = useParams();
  const products = dummyData[category] || [];

  return (
    <div className="flex gap-8 p-8">
      {/* Sidebar (left) */}
      <SidebarFilters />

      {/* Main content (right) */}
      <div className="flex-1">
        {/* Category Title */}
        <h1 className="text-2xl font-bold capitalize mb-6">
          {category.replace("-", " ")}
        </h1>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id}>
              <div className="bg-white w-[300px] rounded-xl shadow-md p-4 flex flex-col hover:shadow-lg transition">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-[160px] object-contain rounded-md"
                />
                <h2 className="mt-2 font-semibold text-lg">{item.name}</h2>
                <p className="text-gray-500 text-sm">{item.category}</p>

                {/* Rating */}
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-medium">{item.rating}</span>
                  <span className="ml-1 text-gray-400">({item.reviews})</span>
                </div>

                {/* Price + Button */}
                <div className="flex justify-between items-center mt-3">
                  <p className="text-lg font-bold">${item.price}/lb</p>
                  <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">
                    <FaShoppingCart />
                    Add
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
