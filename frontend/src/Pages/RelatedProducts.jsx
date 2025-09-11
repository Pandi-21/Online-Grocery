import React from "react";

const relatedProducts = [
  {
    id: 1,
    name: "Organic Bananas",
    price: "$1.29/lb",
    desc: "Sweet and creamy",
    img: "/banana.jpg",
  },
  {
    id: 2,
    name: "Hass Avocados",
    price: "$1.99 each",
    desc: "Rich and buttery",
    img: "/avocado.jpg",
  },
  {
    id: 3,
    name: "Fresh Strawberries",
    price: "$4.99/pint",
    desc: "Juicy and sweet",
    img: "/strawberry.jpg",
  },
  {
    id: 4,
    name: "Organic Baby Spinach",
    price: "$3.49/bag",
    desc: "Tender and mild",
    img: "/spinach.jpg",
  },
];

export default function RelatedProducts() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-3"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <div className="text-sm font-medium">{item.name}</div>
            <div className="text-gray-600 text-sm">{item.price}</div>
            <p className="text-gray-500 text-xs">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
