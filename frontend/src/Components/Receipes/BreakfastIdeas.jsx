 
import Recipes from "../../Pages/Recipes";

const recipes = [
  {
    name: "Pancakes with Berries",
    desc: "Fluffy pancakes topped with fresh berries.",
    image: "/images/pancakes.jpg",
  },
  {
    name: "Omelette",
    desc: "Protein-rich omelette with veggies.",
    image: "/images/omelette.jpg",
  },
  {
    name: "Granola Yogurt Bowl",
    desc: "Crunchy granola with creamy yogurt and fruits.",
    image: "/images/granola.jpg",
  },
];

export default function BreakfastIdeas() {
  return (
    <Recipes
      title="Breakfast Ideas"
      description="Start your day with energy-packed breakfast recipes."
      recipes={recipes}
    />
  );
}
