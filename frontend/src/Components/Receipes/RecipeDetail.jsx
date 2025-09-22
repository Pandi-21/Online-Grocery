import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipeBySlug } from "../../admin/api/recipesApi";

export default function RecipeDetailPage() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    getRecipeBySlug(slug).then((res) => setRecipe(res.data));
  }, [slug]);

  if (!recipe) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      {recipe.images?.length > 0 && (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recipe.images.map((img, i) => (
            <img
              key={i}
              src={`/recipes/uploads/${img}`}
              alt={recipe.title}
              className="w-full h-60 object-cover rounded"
            />
          ))}
        </div>
      )}

      {recipe.subcategory_name && (
        <p className="text-sm text-gray-500 mb-2">
          Subcategory: {recipe.subcategory_name}
        </p>
      )}

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
