 
import Recipes from "../../Pages/Recipes";

const recipes = [
  {
    name: "Grilled Chicken Salad",
    desc: "Low-calorie, protein-packed meal.",
    image: "/images/chicken-salad.jpg",
  },
  {
    name: "Smoothie Bowl",
    desc: "Nutritious and colorful breakfast bowl.",
    image: "/images/smoothie-bowl.jpg",
  },
  {
    name: "Avocado Toast",
    desc: "Rich in healthy fats and vitamins.",
    image: "/images/avocado-toast.jpg",
  },
];

export default function HealthyChoices() {
  return (
    <Recipes
      title="Healthy Choices"
      description="Nutritious and balanced recipes for a healthy lifestyle."
      recipes={recipes}
    />
  );
}
