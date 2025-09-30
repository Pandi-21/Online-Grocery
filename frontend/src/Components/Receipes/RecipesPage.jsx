import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecipes } from "../../admin/api/recipesApi";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // update your API

export default function RecipesPage() {
  const { categorySlug } = useParams(); // dynamic category
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await getRecipes(categorySlug); // pass categorySlug
        setRecipes(res.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };
    fetchRecipes();
  }, [categorySlug]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {categorySlug
          ? `Recipes – ${categorySlug.replace(/-/g, " ")}`
          : "Our Recipes"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Link
              key={recipe._id}
              to={`/recipes/${categorySlug}/${recipe.slug}`} // dynamic link
              className="block border rounded-lg overflow-hidden hover:shadow-lg"
            >
              {recipe.images?.length > 0 && (
                <img
                  src={`${BACKEND_URL}/recipes/uploads/${recipe.images[0]}`}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold">{recipe.title}</h2>
                {recipe.subcategory && (
                  <p className="text-sm text-gray-500">{recipe.subcategory}</p>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No recipes found.</p>
        )}
      </div>
    </div>
  );
}
