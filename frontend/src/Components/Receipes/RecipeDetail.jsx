import { useParams } from "react-router-dom";
import { dummyRecipes } from "../../data/dummyRecipes";

export default function RecipeDetail() {
  const { type, id } = useParams();

  // Find recipe by type + id
  const recipe = dummyRecipes[type]?.find(
    (item) => item.id === parseInt(id)
  );

  if (!recipe) return <p className="text-center mt-10">Recipe not found...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img src={recipe.image} alt={recipe.name} className="w-full h-64 object-cover rounded-xl" />
      <h1 className="text-3xl font-bold mt-4">{recipe.name}</h1>
      <p className="text-gray-600 mt-2">{recipe.desc}</p>

      <h2 className="text-xl font-semibold mt-6">Ingredients</h2>
      <ul className="list-disc list-inside text-gray-700">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6">Steps</h2>
      <ol className="list-decimal list-inside text-gray-700">
        {recipe.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
}
