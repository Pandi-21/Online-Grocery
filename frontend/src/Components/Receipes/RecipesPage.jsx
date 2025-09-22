import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../../admin/api/recipesApi";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRecipes().then((res) => setRecipes(res.data));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Our Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link
            key={recipe._id}
            to={`/recipes/${recipe.slug}`} // public route by slug
            className="block border rounded-lg overflow-hidden hover:shadow-lg"
          >
            {recipe.images?.length > 0 && (
              <img
                src={`/recipes/uploads/${recipe.images[0]}`}
                alt={recipe.title}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{recipe.title}</h2>
              {/* optionally show subcategory name */}
              {recipe.subcategory_name && (
                <p className="text-sm text-gray-500">
                  {recipe.subcategory_name}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
