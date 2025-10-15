import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipeBySlug } from "../../admin/api/recipesApi";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://13.60.199.20";

export default function RecipeDetail() {
  const { categorySlug, recipeSlug } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await getRecipeBySlug(recipeSlug);
        setRecipe(res.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    };
    fetchRecipe();
  }, [recipeSlug]);

  if (!recipe) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-2">
        <Link to={`/recipes/${categorySlug}`} className="hover:underline">
          {categorySlug.replace(/-/g, " ")}
        </Link>{" "}
        / {recipe.title}
      </p>

      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

      {recipe.images?.length > 0 && (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recipe.images.map((img, i) => (
            <img
              key={i}
              src={`${BACKEND_URL}/recipes/uploads/${img}`}
              alt={`${recipe.title} image ${i + 1}`}
              className="w-full h-60 object-cover rounded"
            />
          ))}
        </div>
      )}
{/* 
      {recipe.subcategory_name && (
        <p className="text-sm text-gray-500 mb-2">
          Subcategory: {recipe.subcategory_name}
        </p>
      )} */}

      <h2 className="text-xl font-semibold mt-4 mb-2">Ingredients</h2>
      <ul className="list-disc list-inside">
        {recipe.ingredients?.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">Steps</h2>
      <ol className="list-decimal list-inside">
        {recipe.steps?.map((step, i) => (
          <li key={i} className="mb-1">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
