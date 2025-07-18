import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Utensils } from "lucide-react"

export function RecipesTab() {
  const recipes = [
    { name: "Фруктовый салат", icon: "🥗", have: 15, need: 40 },
    { name: "Овощной салат", icon: "🥗", have: 10, need: 5 },
    { name: "Масло", icon: "🧈", have: 0, need: 0 },
    { name: "Картофельное пюре", icon: "🥔", have: 10, need: 10 },
    { name: "Тесто", icon: "🍞", have: 0, need: 0 },
    { name: "Рыбный фарш", icon: "🐟", have: 0, need: 0 },
    { name: "Мясной фарш", icon: "🥩", have: 0, need: 0 },
    { name: "Вареный рис", icon: "🍚", have: 10, need: 0 },
    { name: "Карамель", icon: "🍯", have: 5, need: 10 },
    { name: "Мороженое", icon: "🍦", have: 10, need: 70 },
    { name: "Сыр", icon: "🧀", have: 15, need: 5 },
    { name: "Бульон", icon: "🍲", have: 10, need: 50 },
    { name: "Стейк", icon: "🥩", have: 25, need: 20 },
    { name: "Стейк с фруктовым соусом", icon: "🥩", have: 60, need: 50 },
  ]

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Рецепты</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Алкоголь</span>
          <span className="text-gray-400">🍺</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск"
            className="pl-10 bg-gray-800 border-orange-500 border-2 text-white placeholder-gray-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        {recipes.map((recipe, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{recipe.icon}</span>
                <span className="text-sm">{recipe.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-orange-500">{recipe.have}</span>
                <span className="text-sm text-purple-500">{recipe.need}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
