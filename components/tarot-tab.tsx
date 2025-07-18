import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Plus } from "lucide-react"
import Image from "next/image"

export function TarotTab() {
  const cards = [
    {
      name: "THE FOOL",
      title: 'Несколько минут будет проигрываться смех "повара"',
      image: "/placeholder.svg?height=200&width=120",
    },
    {
      name: "THE MAGICIAN",
      title: "Все персонажи вашего пола поблизости копируют вашу внешность и одежду",
      image: "/placeholder.svg?height=200&width=120",
    },
    {
      name: "THE HIGH PRIESTESS",
      title: "У персонажа начинается",
      image: "/placeholder.svg?height=200&width=120",
    },
    {
      name: "THE EMPRESS",
      title: 'Включается "Женская походка"',
      image: "/placeholder.svg?height=200&width=120",
    },
  ]

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Реанимация</h1>
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Карты таро</h2>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700 overflow-hidden">
            <div className="aspect-[3/4] relative">
              <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-400 mb-1">
                {index}. {card.title}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
