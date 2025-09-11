import { Tag, Star, Gift, Snowflake, Users } from "lucide-react"; // icons

function DealMenuItem({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
      <Icon className="text-green-600 w-5 h-5 mt-1" />
      <div>
        <h4 className="text-gray-800 font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

export default function Deal() {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 w-[350px]">
      <DealMenuItem
        icon={Tag}
        title="Today's Deals"
        desc="Exclusive daily offers"
      />
      <DealMenuItem
        icon={Star}
        title="Top Offers"
        desc="Best discounts right now"
      />
      <DealMenuItem
        icon={Gift}
        title="Buy 1 Get 1"
        desc="Double the fun with BOGO"
      />
      <DealMenuItem
        icon={Snowflake}
        title="Seasonal Sales"
        desc="Limited time seasonal discounts"
      />
      <DealMenuItem
        icon={Users}
        title="Membership / Loyalty Deals"
        desc="Special perks for our loyal customers"
      />
    </div>
  );
}
