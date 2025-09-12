import { Link } from "react-router-dom";

export default function Recipes({ title, description, recipes, type }) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">{title}</h1>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="grid md:grid-cols-3 gap-6">
        {recipes.map((item) => (
          <div key={item.id} className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition">
            <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>

              {/* 👇 Button goes to detail page */}
              <Link to={`/recipes/${type}/${item.id}`}>
                <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  View Recipe
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
