"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search } from "lucide-react"
import { UserStorage } from "@/utils/user-storage"
import { getUserGameData, saveUserGameData } from "@/utils/game-storage"
import Image from "next/image"

// Интерфейс для структуры объекта рецепта
interface RecipeItem {
  name: string
  icon: string
  have: number
  need: number
  recipe: string
  ingredients: string
  stats: string[]
  image: string
  detailImage: string // Добавлено для консистентности с алкоголем, может быть таким же как image
}

export function CookingTab() {
  const [currentView, setCurrentView] = useState<"recipes" | "alcohol" | "dish" | "drink">("recipes")
  const [selectedDish, setSelectedDish] = useState<RecipeItem | null>(null)
  const [selectedDrink, setSelectedDrink] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Функция для сохранения текущего состояния кулинарии
  const saveCurrentCookingState = async (view: string, query: string) => {
    const userId = UserStorage.getUserId()
    const initData = UserStorage.getTelegramInitData()
    if (userId && initData) {
      const currentFullData = (await getUserGameData(userId, initData)) || {}
      await saveUserGameData(
        userId,
        { ...currentFullData, cookingState: { currentView: view, searchQuery: query } },
        initData,
      )
    }
  }

  // Загрузка состояния при инициализации
  useEffect(() => {
    const loadCookingState = async () => {
      const userId = UserStorage.getUserId()
      const initData = UserStorage.getTelegramInitData()
      if (userId && initData) {
        const savedData = await getUserGameData(userId, initData)
        if (savedData && savedData.cookingState) {
          setCurrentView(savedData.cookingState.currentView || "recipes")
          setSearchQuery(savedData.cookingState.searchQuery || "")
        }
      }
    }
    loadCookingState()
  }, [])

  // Сохранение состояния при изменениях currentView
  useEffect(() => {
    saveCurrentCookingState(currentView, searchQuery)
  }, [currentView])

  // Сохранение состояния при изменениях searchQuery
  useEffect(() => {
    saveCurrentCookingState(currentView, searchQuery)
  }, [searchQuery])

  const getRecipeIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("салат")) return "🥗"
    if (lowerName.includes("масло")) return "🧈"
    if (lowerName.includes("пюре")) return "🥔"
    if (lowerName.includes("тесто")) return "🍞"
    if (lowerName.includes("фарш")) return lowerName.includes("рыбн") ? "🐟" : "🥩"
    if (lowerName.includes("рис")) return "🍚"
    if (lowerName.includes("карамель")) return "🍯"
    if (lowerName.includes("мороженое")) return "🍦"
    if (lowerName.includes("сыр")) return "🧀"
    if (lowerName.includes("бульон")) return "🍲"
    if (lowerName.includes("стейк")) return "🥩"
    if (lowerName.includes("рыба")) return "🐟"
    if (lowerName.includes("смузи")) return "🥤"
    if (lowerName.includes("лёд")) return "🧊"
    if (lowerName.includes("яичница")) return "🍳"
    if (lowerName.includes("омлет")) return "🍳"
    if (lowerName.includes("оладьи")) return "🥞"
    if (lowerName.includes("суфле")) return "🍮"
    if (lowerName.includes("компот")) return "🍎"
    if (lowerName.includes("рагу")) return "🥘"
    if (lowerName.includes("оливье")) return "🥗"
    if (lowerName.includes("сашими")) return "🍣"
    if (lowerName.includes("крем-брюле")) return "🍮"
    if (lowerName.includes("котлета")) return "🍔"
    if (lowerName.includes("хлеб")) return "🍞"
    if (lowerName.includes("чизкейк")) return "🍰"
    if (lowerName.includes("коктейль")) return "🥛"
    if (lowerName.includes("макароны") || lowerName.includes("паста")) return "🍝"
    if (lowerName.includes("ролл")) return "🍣"
    if (lowerName.includes("суп") || lowerName.includes("борщ")) return "🍲"
    if (lowerName.includes("пицца")) return "🍕"
    if (lowerName.includes("бургер")) return "🍔"
    if (lowerName.includes("лазанья")) return "🍝"
    if (lowerName.includes("ризотто")) return "🍚"
    if (lowerName.includes("поке")) return "🍚"
    if (lowerName.includes("тако")) return "🌮"
    if (lowerName.includes("буррито")) return "🌯"
    if (lowerName.includes("сендвич")) return "🥪"
    return "🍳" // Default icon
  }

  // Массив рецептов в новом формате
  const recipes: RecipeItem[] = [
      {
        name: "Фруктовый салат",
        icon: getRecipeIcon("Фруктовый салат"),
        have: 15,
        need: 40,
        recipe: "Фрукты | Нож",
        ingredients: "Фрукты-1шт.",
        stats: ["+15%", "+40%", "-3", "0 ур."],
        image: "/images/dishes/image.png?height=64&width=64",
        detailImage: "/images/dishes/image.png?height=128&width=128",
      },
      {
        name: "Овощной салат",
        icon: getRecipeIcon("Овощной салат"),
        have: 10,
        need: 5,
        recipe: "Овощи | Нож",
        ingredients: "Овощи-1шт.",
        stats: ["+10%", "+5%", "0", "0 ур."],
        image: "/images/dishes/image copy.png?height=64&width=64",
        detailImage: "/images/dishes/image copy.png?height=128&width=128",
      },
      {
        name: "Масло",
        icon: getRecipeIcon("Масло"),
        have: 0,
        need: 0,
        recipe: "Молоко | Венчик",
        ingredients: "Молоко-1шт.",
        stats: ["+0%", "+0%", "0", "0 ур."],
        image: "/images/dishes/image copy 2.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 2.png?height=128&width=128",
      },
      {
        name: "Картофельное пюре",
        icon: getRecipeIcon("Картофельное пюре"),
        have: 10,
        need: 10,
        recipe: "Овощи | Масло | Молоко | Венчик | Огонь",
        ingredients: "Молоко-2шт.Овощи-1шт.",
        stats: ["+10%", "+10%", "-5", "2 ур."],
        image: "/images/dishes/image copy 4.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 4.png?height=128&width=128",
      },
      {
        name: "Тесто",
        icon: getRecipeIcon("Тесто"),
        have: 0,
        need: 0,
        recipe: "Мука | Яйца | Венчик | Вода",
        ingredients: "Мука-1шт.Яйца-1шт.",
        stats: ["+0%", "+0%", "0", "0 ур."],
        image: "/images/dishes/image copy 3.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 3.png?height=128&width=128",
      },
      {
        name: "Рыбный фарш",
        icon: getRecipeIcon("Рыбный фарш"),
        have: 0,
        need: 0,
        recipe: "Рыба | Нож",
        ingredients: "Рыба-1шт",
        stats: ["+0%", "+0%", "0", "2 ур."],
        image: "/images/dishes/image copy 5.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 5.png?height=128&width=128",
      },
      {
        name: "Мясной фарш",
        icon: getRecipeIcon("Мясной фарш"),
        have: 0,
        need: 0,
        recipe: "Мясо | Нож",
        ingredients: "Мясо-1шт.",
        stats: ["+0%", "+0%", "0", "2 ур."],
        image: "/images/dishes/image copy 6.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 6.png?height=128&width=128",
      },
      {
        name: "Вареный рис",
        icon: getRecipeIcon("Вареный рис"),
        have: 10,
        need: 0,
        recipe: "Сахар | Огонь",
        ingredients: "Сахар-1шт.",
        stats: ["+5%", "+10%", "-5", "-4 ур."],
        image: "/images/dishes/image copy 7.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 7.png?height=128&width=128",
      },
      {
        name: "Карамель",
        icon: getRecipeIcon("Карамель"),
        have: 5,
        need: 10,
        recipe: "Сахар | Огонь",
        ingredients: "Сахар-1шт.",
        stats: ["+5%", "+10%", "-5", "-4 ур."],
        image: "/images/dishes/image copy 8.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 8.png?height=128&width=128",
      },
      {
        name: "Мороженое",
        icon: getRecipeIcon("Мороженое"),
        have: 10,
        need: 70,
        recipe: "Сахар | Яйца | Молоко | Лёд | Венчик",
        ingredients: "Сахар-1шт.Яйца-1шт.Молоко-1шт.Лёд-1шт.",
        stats: ["+10%", "+70%", "-15", "0 ур."],
        image: "/images/dishes/image copy 9.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 9.png?height=128&width=128",
      },
      {
        name: "Сыр",
        icon: getRecipeIcon("Сыр"),
        have: 15,
        need: 5,
        recipe: "Молоко | Венчик | Огонь",
        ingredients: "Молоко-1шт.",
        stats: ["+15%", "+5%", "-1", "2 ур."],
        image: "/images/dishes/image copy 10.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 10.png?height=128&width=128",
      },
      {
        name: "Бульон",
        icon: getRecipeIcon("Бульон"),
        have: 10,
        need: 50,
        recipe: "Мясо | Огонь | Вода",
        ingredients: "Мясо-1шт.",
        stats: ["+10%", "+50%", "-25", "0 ур."],
        image: "/images/dishes/image copy 11.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 11.png?height=128&width=128",
      },
      {
        name: "Стейк",
        icon: getRecipeIcon("Стейк"),
        have: 25,
        need: 20,
        recipe: "Мясо | Огонь",
        ingredients: "Мясо-1шт.",
        stats: ["+25%", "+20%", "-8", "0 ур."],
        image: "/images/dishes/image copy 12.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 12.png?height=128&width=128",
      },
      {
        name: "Стейк с фруктовым соусом",
        icon: getRecipeIcon("Стейк с фруктовым соусом"),
        have: 60,
        need: 50,
        recipe: "Мясо | Фрукты | Сахар | Огонь",
        ingredients: "Мясо-1шт.Фрукты-1шт.Сахар-1шт.",
        stats: ["+60%", "+50%", "-10", "5 ур."],
        image: "/images/dishes/image copy 13.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 13.png?height=128&width=128",
      },
      {
        name: "Рыба с фруктовым соусом",
        icon: getRecipeIcon("Рыба с фруктовым соусом"),
        have: 60,
        need: 50,
        recipe: "Рыба | Фрукты | Сахар | Огонь",
        ingredients: "Рыба-1шт.Фрукты-1шт.Сахар-1шт.",
        stats: ["+60%", "+50%", "-10", "5 ур."],
        image: "/images/dishes/image copy 14.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 14.png?height=128&width=128",
      },
      {
        name: "Овощной смузи",
        icon: getRecipeIcon("Овощной смузи"),
        have: 20,
        need: 33,
        recipe: "Овощи | Венчик | Вода",
        ingredients: "Овощи-1шт.",
        stats: ["+20%", "+33%", "0", "2 ур."],
        image: "/images/dishes/image copy 15.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 15.png?height=128&width=128",
      },
      {
        name: "Фруктовый смузи",
        icon: getRecipeIcon("Фруктовый смузи"),
        have: 20,
        need: 50,
        recipe: "Фрукты | Венчик | Вода",
        ingredients: "Фрукты-1шт.",
        stats: ["+20%", "+50%", "-7", "2 ур."],
        image: "/images/dishes/image copy 16.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 16.png?height=128&width=128",
      },
      {
        name: "Фруктовый лёд",
        icon: getRecipeIcon("Фруктовый лёд"),
        have: 10,
        need: 65,
        recipe: "Фрукты | Лёд | Сахар | Венчик",
        ingredients: "Фрукты-1шт.Лёд-1шт.Сахар-1шт.",
        stats: ["+10%", "+65%", "-7", "2 ур."],
        image: "/images/dishes/image copy 17.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 17.png?height=128&width=128",
      },
      {
        name: "Рыба с овощами",
        icon: getRecipeIcon("Рыба с овощами"),
        have: 35,
        need: 15,
        recipe: "Рыба | Овощи | Огонь",
        ingredients: "Рыб-1шт.Овощи-1шт.",
        stats: ["+35%", "+15%", "-3", "2 ур."],
        image: "/images/dishes/image copy 18.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 18.png?height=128&width=128",
      },
      {
        name: "Мясо с овощами",
        icon: getRecipeIcon("Мясо с овощами"),
        have: 40,
        need: 10,
        recipe: "Мясо | Овощи | Огонь",
        ingredients: "Мясо-1шт.Овощи-1шт.",
        stats: ["+40%", "+10%", "-3", "2 ур."],
        image: "/images/dishes/image copy 19.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 19.png?height=128&width=128",
      },
      {
        name: "Яичница",
        icon: getRecipeIcon("Яичница"),
        have: 15,
        need: 5,
        recipe: "Яйца | Огонь",
        ingredients: "Яйца-1шт.",
        stats: ["+15%", "+5%", "-3", "2 ур."],
        image: "/images/dishes/image copy 20.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 20.png?height=128&width=128",
      },
      {
        name: "Омлет",
        icon: getRecipeIcon("Омлет"),
        have: 20,
        need: 10,
        recipe: "Яйца | Молоко | Венчик | Огонь",
        ingredients: "Яйца-1шт.Молоко-1шт.",
        stats: ["+20%", "+10%", "-4", "0 ур."],
        image: "/images/dishes/image copy 21.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 21.png?height=128&width=128",
      },
      {
        name: "Оладьи",
        icon: getRecipeIcon("Оладьи"),
        have: 20,
        need: 20,
        recipe: "Яйца | Молоко | Мука | Сахар | Венчик | Огонь",
        ingredients: "Яйца-1шт.Молоко-1шт.Мука-1шт.Сахар-1шт.",
        stats: ["+20%", "+20%", "-10", "0 ур."],
        image: "/images/dishes/image copy 22.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 22.png?height=128&width=128",
      },
      {
        name: "Суфле",
        icon: getRecipeIcon("Суфле"),
        have: 20,
        need: 80,
        recipe: "Яйца | Сахар | Венчик | Огонь",
        ingredients: "Яйца-1шт.Сахар-1шт.",
        stats: ["+20%", "+80%", "-2", "5 ур."],
        image: "/images/dishes/image copy 23.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 23.png?height=128&width=128",
      },
      {
        name: "Овощной омлет",
        icon: getRecipeIcon("Овощной омлет"),
        have: 25,
        need: 10,
        recipe: "Яйца | Молоко | Овощи | Венчик | Огонь",
        ingredients: "Яйца-1шт.Молоко-1шт.Овощи-1шт.",
        stats: ["+25%", "+10%", "-4", "0 ур."],
        image: "/images/dishes/image copy 24.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 24.png?height=128&width=128",
      },
      {
        name: "Компот",
        icon: getRecipeIcon("Компот"),
        have: 5,
        need: 50,
        recipe: "Сахар | Фрукты | Огонь | Вода",
        ingredients: "Сахар-1шт.Фрукты-1шт.",
        stats: ["+5%", "+50%", "-7", "0 ур."],
        image: "/images/dishes/image copy 25.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 25.png?height=128&width=128",
      },
      {
        name: "Жар. мясо на масле с овощами",
        icon: getRecipeIcon("Жар. мясо на масле с овощами"),
        have: 60,
        need: 50,
        recipe: "Мясо | Овощи | Масло | Огонь.",
        ingredients: "Молоко-1шт.Мясо-1шт.Овощи-1шт.",
        stats: ["+60%", "+50%", "-15", "0 ур."],
        image: "/images/dishes/image copy 26.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 26.png?height=128&width=128",
      },
      {
        name: "Жар. рыба на масле с овощами",
        icon: getRecipeIcon("Жар. рыба на масле с овощами"),
        have: 60,
        need: 50,
        recipe: "Рыба | Овощи | Масло | Огонь",
        ingredients: "Молоко-1шт.Рыба-1шт.Овощи-1шт.",
        stats: ["+60%", "+50%", "-15", "0 ур."],
        image: "/images/dishes/image copy 27.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 27.png?height=128&width=128",
      },
      {
        name: "Рагу",
        icon: getRecipeIcon("Рагу"),
        have: 60,
        need: 45,
        recipe: "Овощи | Мясо | Огонь | Вода",
        ingredients: "Овощи-1шт.Мясо-1шт.",
        stats: ["+60%", "+45%", "-20", "3 ур."],
        image: "/images/dishes/image copy 28.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 28.png?height=128&width=128",
      },
      {
        name: "Оливье",
        icon: getRecipeIcon("Оливье"),
        have: 60,
        need: 50,
        recipe: "Мясо | Овощи | Яйца | Нож | Огонь | Вода",
        ingredients: "Мясо-1шт.Овощи-1шт.Яйца-1шт.",
        stats: ["+60%", "+50%", "-25", "5 ур."],
        image: "/images/dishes/image copy 29.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 29.png?height=128&width=128",
      },
      {
        name: "Сашими из фугу",
        icon: getRecipeIcon("Сашими из фугу"),
        have: 20,
        need: 60,
        recipe: "Фугу | Нож",
        ingredients: "Фугу-1шт.",
        stats: ["+20%", "+60%", "0", "0 ур."],
        image: "/images/dishes/image copy 30.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 30.png?height=128&width=128",
      },
      {
        name: "Сашими из лосося",
        icon: getRecipeIcon("Сашими из лосося"),
        have: 10,
        need: 30,
        recipe: "Лосось | Нож",
        ingredients: "Лосось-1шт.",
        stats: ["+10%", "+30%", "0", "0 ур."],
        image: "/images/dishes/image copy 31.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 31.png?height=128&width=128",
      },
      {
        name: "Сашими из тунца",
        icon: getRecipeIcon("Сашими из тунца"),
        have: 0,
        need: 0,
        recipe: "Тунец | Нож",
        ingredients: "Тунец-1шт.",
        stats: ["+0%", "+0%", "0", "0 ур."],
        image: "/images/dishes/image copy 32.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 32.png?height=128&width=128",
      },
      {
        name: "Крем-брюле",
        icon: getRecipeIcon("Крем-брюле"),
        have: 10,
        need: 80,
        recipe: "Молоко | Сахар | Яйца | Огонь",
        ingredients: "Молоко-1шт.Сахар-1шт.Яйца-1шт.",
        stats: ["+10%", "+80%", "-7", "4 ур."],
        image: "/images/dishes/image copy 33.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 33.png?height=128&width=128",
      },
      {
        name: "Мальма в сливочном соусе",
        icon: getRecipeIcon("Мальма в сливочном соусе"),
        have: 75,
        need: 75,
        recipe: "Мальма | Овощи | Молоко | Огонь",
        ingredients: "Мальма-1шт.Овощи-1шт.Молоко-1шт.",
        stats: ["+75%", "+75%", "-13", "0 ур."],
        image: "/images/dishes/image copy 34.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 34.png?height=128&width=128",
      },
      {
        name: "Рыбная котлета",
        icon: getRecipeIcon("Рыбная котлета"),
        have: 25,
        need: 10,
        recipe: "Рыбный фарш | Масло | Огонь",
        ingredients: "Рыба-1шт.Молоко-1шт.",
        stats: ["+25%", "+10%", "-10", "2 ур."],
        image: "/images/dishes/image copy 35.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 35.png?height=128&width=128",
      },
      {
        name: "Мясная котлета",
        icon: getRecipeIcon("Мясная котлета"),
        have: 25,
        need: 10,
        recipe: "Мясной фарш | Масло | Огонь",
        ingredients: "Мясо-1шт.Молоко-1шт.",
        stats: ["+25%", "+10%", "-10", "2 ур."],
        image: "/images/dishes/image copy 36.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 36.png?height=128&width=128",
      },
      {
        name: "Хлеб",
        icon: getRecipeIcon("Хлеб"),
        have: 10,
        need: 0,
        recipe: "Тесто | Огонь",
        ingredients: "Мука-1шт.Яйца-1шт.",
        stats: ["+10%", "+0%", "-2", "0 ур."],
        image: "/images/dishes/image copy 37.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 37.png?height=128&width=128",
      },
      {
        name: "Чизкейк",
        icon: getRecipeIcon("Чизкейк"),
        have: 30,
        need: 60,
        recipe: "Тесто | Сыр | Сахар | Венчик | Огонь",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.Сахар-1шт.",
        stats: ["+30%", "+60%", "-15", "4 ур."],
        image: "/images/dishes/image copy 38.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 38.png?height=128&width=128",
      },
      {
        name: "Молочный коктейль",
        icon: getRecipeIcon("Молочный коктейль"),
        have: 20,
        need: 70,
        recipe: "Мороженое | Молоко | Венчик",
        ingredients: "Сахар-1шт.Молоко-2шт.Яйца-1шт.Лёд-1шт.",
        stats: ["+20%", "+70%", "-15", "3 ур."],
        image: "/images/dishes/image copy 39.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 39.png?height=128&width=128",
      },
      {
        name: "Макароны",
        icon: getRecipeIcon("Макароны"),
        have: 10,
        need: 0,
        recipe: "Тесто | Нож | Огонь | Вода",
        ingredients: "Мука-1шт.Яйца-1шт.",
        stats: ["+10%", "+0%", "-2", "1 ур."],
        image: "/images/dishes/image copy 40.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 40.png?height=128&width=128",
      },
      {
        name: "Ролл с лососем",
        icon: getRecipeIcon("Ролл с лососем"),
        have: 25,
        need: 20,
        recipe: "Лосось | Вареный рис | Нож",
        ingredients: "Рис-1шт.Лосось-1шт.",
        stats: ["+25%", "+20%", "-3", "0 ур."],
        image: "/images/dishes/image copy 41.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 41.png?height=128&width=128",
      },
      {
        name: "Ролл с тунцом",
        icon: getRecipeIcon("Ролл с тунцом"),
        have: 25,
        need: 20,
        recipe: "Тунец | Вареный рис | Нож",
        ingredients: "Рис-1шт.Тунец-1шт.",
        stats: ["+25%", "+20%", "-3", "0 ур."],
        image: "/images/dishes/image copy 42.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 42.png?height=128&width=128",
      },
      {
        name: "Овощной ролл",
        icon: getRecipeIcon("Овощной ролл"),
        have: 20,
        need: 10,
        recipe: "Овощи | Вареный рис | Нож",
        ingredients: "Рис-1шт.Овощи-1шт.",
        stats: ["+20%", "+10%", "-2", "2 ур."],
        image: "/images/dishes/image copy 43.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 43.png?height=128&width=128",
      },
      {
        name: "Рыба с рисом",
        icon: getRecipeIcon("Рыба с рисом"),
        have: 40,
        need: 10,
        recipe: "Рыба | Вареный рис | Огонь",
        ingredients: "Рис-1шт.Рыба-1шт.",
        stats: ["+40%", "+10%", "-5", "0 ур."],
        image: "/images/dishes/image copy 44.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 44.png?height=128&width=128",
      },
      {
        name: "Сухая рыбная котлета",
        icon: getRecipeIcon("Сухая рыбная котлета"),
        have: 10,
        need: 0,
        recipe: "Рыбный фарш | Огонь",
        ingredients: "Рыба-1шт.",
        stats: ["+10%", "+0%", "-3", "2 ур."],
        image: "/images/dishes/image copy 45.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 45.png?height=128&width=128",
      },
      {
        name: "Пельмени",
        icon: getRecipeIcon("Пельмени"),
        have: 45,
        need: 45,
        recipe: "Мясной фарш | Тесто | Огонь | Вода",
        ingredients: "Мяс-1шт.Мука-1шт.Яйца-1шт.",
        stats: ["+45%", "+45%", "-15", "3 ур."],
        image: "/images/dishes/image copy 46.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 46.png?height=128&width=128",
      },
      {
        name: "Сухая мясная котлета",
        icon: getRecipeIcon("Сухая мясная котлета"),
        have: 10,
        need: 40,
        recipe: "Мясной фарш | Огонь",
        ingredients: "Мясо-1шт.",
        stats: ["+10%", "+40%", "-3", "2 ур."],
        image: "/images/dishes/image copy 47.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 47.png?height=128&width=128",
      },
      {
        name: "Яблоко в карамели",
        icon: getRecipeIcon("Яблоко в карамели"),
        have: 20,
        need: 55,
        recipe: "Карамель | Фрукты",
        ingredients: "Сахар-1шт.Фрукты-1шт.",
        stats: ["+20%", "+55%", "-7", "0 ур."],
        image: "/images/dishes/image copy 48.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 48.png?height=128&width=128",
      },
      {
        name: "Фруктовый салат с карамелью",
        icon: getRecipeIcon("Фруктовый салат с карамелью"),
        have: 25,
        need: 60,
        recipe: "Карамель | Фруктовый салат",
        ingredients: "Сахар-1шт.Фрукты-1шт.",
        stats: ["+25%", "+60%", "-11", "0 ур."],
        image: "/images/dishes/image copy 49.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 49.png?height=128&width=128",
      },
      {
        name: "Карамельное мороженое",
        icon: getRecipeIcon("Карамельное мороженое"),
        have: 15,
        need: 80,
        recipe: "Карамель | Мороженое",
        ingredients: "Сахар-2шт.Яйца-1шт.Молоко-1шт.Лёд-1шт.",
        stats: ["+15", "+80%", "-20", "0 ур."],
        image: "/images/dishes/image copy 50.png?height=64&width=64",
        detailImage: "images/dishes/image copy 50.png?height=128&width=128",
      },
      {
        name: "Овощной суп",
        icon: getRecipeIcon("Овощной суп"),
        have: 25,
        need: 10,
        recipe: "Бульон | Овощи | Огонь",
        ingredients: "Мясо-1шт.Овощи-1шт.",
        stats: ["+25%", "+10%", "-1", "0 ур."],
        image: "/images/dishes/image copy 51.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 51.png?height=128&width=128",
      },
      {
        name: "Борщ",
        icon: getRecipeIcon("Борщ"),
        have: 50,
        need: 10,
        recipe: "Бульон | Овощи | Мясо | Огонь",
        ingredients: "Мясо-2шт.Овощи-1шт.",
        stats: ["+50%", "+10%", "-20", "3 ур."],
        image: "/images/dishes/image copy 52.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 52.png?height=128&width=128",
      },
      {
        name: "Салат Капрезе",
        icon: getRecipeIcon("Салат Капрезе"),
        have: 15,
        need: 10,
        recipe: "Сыр | Овощи | Огонь",
        ingredients: "Молоко-1шт.Овощи-1шт.",
        stats: ["+15%", "+10%", "0", "0 ур."],
        image: "/images/dishes/image copy 53.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 53.png?height=128&width=128",
      },
      {
        name: "Пицца",
        icon: getRecipeIcon("Пицца"),
        have: 30,
        need: 50,
        recipe: "Тесто | Овощи | Мясо | Сыр | Огонь",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.Овощи-1шт.Мясо-1шт.",
        stats: ["+30%", "+50%", "-25", "3 ур."],
        image: "/images/dishes/image copy 54.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 54.png?height=128&width=128",
      },
      {
        name: "Стейк с рисом",
        icon: getRecipeIcon("Стейк с рисом"),
        have: 50,
        need: 30,
        recipe: "Вареный рис | Стейк | Огонь",
        ingredients: "Рис-1шт.Мясо-1шт.",
        stats: ["+50%", "+30%", "-12", "2 ур."],
        image: "/images/dishes/image copy 55.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 55.png?height=128&width=128",
      },
      {
        name: "Стейк с салатом",
        icon: getRecipeIcon("Стейк с салатом"),
        have: 45,
        need: 30,
        recipe: "Стейк | Овощной салат",
        ingredients: "Мясо-1шт.Овощи-1шт.",
        stats: ["+45%", "+30%", "-8", "2 ур."],
        image: "/images/dishes/image copy 56.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 56.png?height=128&width=128",
      },
      {
        name: "Бургер",
        icon: getRecipeIcon("Бургер"),
        have: 40,
        need: 0,
        recipe: "Мясная котлета | Овощи | Хлеб",
        ingredients: "Мясо-1шт.Молоко-1шт.Мука-1шт.Яйца-1шт.Овощи-1шт.",
        stats: ["+40%", "+0%", "-10", "0 ур."],
        image: "/images/dishes/image copy 57.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 57.png?height=128&width=128",
      },
      {
        name: "Стейк с фруктовым соусом и рисом",
        icon: getRecipeIcon("Стейк с фруктовым соусом и рисом"),
        have: 80,
        need: 60,
        recipe: "Стейк с фруктовым соусом | Вареный рис",
        ingredients: "Мясо-1шт.Фрукты-1шт.Сахар-1шт.Рис-1шт.",
        stats: ["+80%", "+60%", "-13", "5 ур."],
        image: "/images/dishes/image copy 58.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 58.png?height=128&width=128",
      },
      {
        name: "Стейк с фруктовым соусом и пюре",
        icon: getRecipeIcon("Стейк с фруктовым соусом и пюре"),
        have: 80,
        need: 80,
        recipe: "Стейк с фруктовым соусом | Картофельное пюре",
        ingredients: "Мясо-1шт.Фрукты-1шт.Сахар-1шт.Молоко-1шт.Овощи-1шт.",
        stats: ["+80%", "+80%", "-15", "5 ур."],
        image: "/images/dishes/image copy 59.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 59.png?height=128&width=128",
      },
      {
        name: "Рыба с фруктовым соусом и рисом",
        icon: getRecipeIcon("Рыба с фруктовым соусом и рисом"),
        have: 80,
        need: 60,
        recipe: "Рыба с фруктовым соусом и рисом | Вареный рис",
        ingredients: "Рыба-1шт.Фрукты-1шт.Сахар-1шт.Рис-1шт.",
        stats: ["+80%", "+60%", "-13", "0 ур."],
        image: "/images/dishes/image copy 60.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 60.png?height=128&width=128",
      },
      {
        name: "Рыба с фруктовым соусом и пюре",
        icon: getRecipeIcon("Рыба с фруктовым соусом и пюре"),
        have: 80,
        need: 80,
        recipe: "Рыба с фруктовым соусом | Картофельное пюре",
        ingredients: "Рыба-1шт.Фрукты-1шт.Сахар-1шт.Молоко-1шт.Овощи-1шт.",
        stats: ["+80%", "+80%", "-15", "0 ур."],
        image: "/images/dishes/image copy 61.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 61.png?height=128&width=128",
      },
      {
        name: "Лазанья",
        icon: getRecipeIcon("Лазанья"),
        have: 65,
        need: 50,
        recipe: "Рыба с фруктовым соусом | Картофельное пюре",
        ingredients: "Молоко-2шт.Мясо-1шт.Мука-1шт.Овощи-1шт.",
        stats: ["+65%", "+50%", "-20", "5 ур."],
        image: "/images/dishes/image copy 62.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 62.png?height=128&width=128",
      },
      {
        name: "Ризотто",
        icon: getRecipeIcon("Ризотто"),
        have: 40,
        need: 20,
        recipe: "Бульон | Рисовая крупа | Сыр | Огонь",
        ingredients: "Мясо-1шт.Молоко-1шт.Рисовая крупа-1шт.",
        stats: ["+40%", "+20%", "-20", "0 ур."],
        image: "/images/dishes/image copy 63.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 63.png?height=128&width=128",
      },
      {
        name: "Поке",
        icon: getRecipeIcon("Поке"),
        have: 70,
        need: 50,
        recipe: "Вареный рис | Сыр | Овощи | Лосось",
        ingredients: "Рисовая крупа-1шт.Молоко-1шт.Овощи-1шт.Лосось-1шт.",
        stats: ["+70%", "+50%", "-15", "0 ур."],
        image: "/images/dishes/image copy 64.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 64.png?height=128&width=128",
      },
      {
        name: "Мясо по-французски",
        icon: getRecipeIcon("Мясо по-французски"),
        have: 60,
        need: 40,
        recipe: "Мясо | Овощи | Сыр | Огонь",
        ingredients: "Молоко-1шт.Мясо-1шт.Овощи-1шт.",
        stats: ["+60%", "+40%", "-15", "5 ур."],
        image: "/images/dishes/image copy 65.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 65.png?height=128&width=128",
      },
      {
        name: "Яичница с беконом",
        icon: getRecipeIcon("Яичница с беконом"),
        have: 25,
        need: 15,
        recipe: "Яйца | Мясо |Масло | Огонь",
        ingredients: "Молоко-1шт.Яйца-1шт.Мясо-1шт.",
        stats: ["+25%", "+15%", "-6", "0 ур."],
        image: "/images/dishes/image copy 66.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 66.png?height=128&width=128",
      },
      {
        name: "Мясная котлета с пюре",
        icon: getRecipeIcon("Мясная котлета с пюре"),
        have: 50,
        need: 50,
        recipe: "Картофельное пюре | Мясная котлета",
        ingredients: "Молоко-2шт.Овощи-1шт.Мясо-1шт.",
        stats: ["+50%", "+50%", "-20", "0 ур."],
        image: "/images/dishes/image copy 67.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 67.png?height=128&width=128",
      },
      {
        name: "Рыбная котлета с пюре",
        icon: getRecipeIcon("Рыбная котлета с пюре"),
        have: 50,
        need: 50,
        recipe: "Картофельное пюре | Рыбная котлета",
        ingredients: "Молоко-2шт.Овощи-1шт.Рыба-1шт.",
        stats: ["+50%", "+50%", "-20", "0 ур."],
        image: "/images/dishes/image copy 68.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 68.png?height=128&width=128",
      },
      {
        name: "Рыбная котлета с рисом",
        icon: getRecipeIcon("Рыбная котлета с рисом"),
        have: 45,
        need: 40,
        recipe: "Вареный рис | Рыбная котлета",
        ingredients: "Рис-1шт.Рыба-1шт.Молоко-1шт.",
        stats: ["+45%", "+40%", "-12", "0 ур."],
        image: "/images/dishes/image copy 69.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 69.png?height=128&width=128",
      },
      {
        name: "Котлета с рисом",
        icon: getRecipeIcon("Котлета с рисом"),
        have: 45,
        need: 40,
        recipe: "Вареный рис | Мясная котлета",
        ingredients: "Рис-1шт.Мясо-1шт.Молоко-1шт.",
        stats: ["+45%", "+40%", "-12", "0 ур."],
        image: "/images/dishes/image copy 70.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 70.png?height=128&width=128",
      },
      {
        name: "Карамельный чизкейк",
        icon: getRecipeIcon("Карамельный чизкейк"),
        have: 35,
        need: 85,
        recipe: "Чизкейк | Карамель",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.Сахар-2шт.",
        stats: ["+35%", "-85%", "-25", "5 ур."],
        image: "/images/dishes/image copy 71.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 71.png?height=128&width=128",
      },
      {
        name: "Фруктовый чизкейк",
        icon: getRecipeIcon("Фруктовый чизкейк"),
        have: 35,
        need: 70,
        recipe: "Чизкейк | Фрукты",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.Сахар-1шт.Фрукты-1шт.",
        stats: ["+35%", "+70%", "-25", "5 ур."],
        image: "/images/dishes/image copy 72.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 72.png?height=128&width=128",
      },
      {
        name: "Карамельный молочный коктейль",
        icon: getRecipeIcon("Карамельный молочный коктейль"),
        have: 25,
        need: 80,
        recipe: "Молочный коктейль | Карамель",
        ingredients: "Сахар-2шт.Молоко-2шт.Яйца-1шт.Лёд-1шт.",
        stats: ["+25%", "+80%", "-20", "0 ур."],
        image: "/images/dishes/image copy 73.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 73.png?height=128&width=128",
      },
      {
        name: "Сендвич с сыром",
        icon: getRecipeIcon("Сендвич с сыром"),
        have: 10,
        need: 20,
        recipe: "Сыр | Хлеб | Нож | Огонь",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.",
        stats: ["+10%", "+20%", "-9", "0 ур."],
        image: "/images/dishes/image copy 74.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 74.png?height=128&width=128",
      },
      {
        name: "Макароны с сыром",
        icon: getRecipeIcon("Макароны с сыром"),
        have: 20,
        need: 25,
        recipe: "Макароны | Сыр | Огонь",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.",
        stats: ["+20%", "+25%", "-15", "2 ур."],
        image: "/images/dishes/image copy 75.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 75.png?height=128&width=128",
      },
      {
        name: "Макароны с мясной котлетой",
        icon: getRecipeIcon("Макароны с мясной котлетой"),
        have: 45,
        need: 40,
        recipe: "Макароны | Мясная котлета",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.Мясо-1шт.",
        stats: ["+45%", "+40%", "-15", "0 ур."],
        image: "/images/dishes/image copy 76.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 76.png?height=128&width=128",
      },
      {
        name: "Макароны с рыбной котлетой",
        icon: getRecipeIcon("Макароны с рыбной котлетой"),
        have: 45,
        need: 40,
        recipe: "Рецепт пока не добавлен.",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.Рыба-1шт.",
        stats: ["+45%", "+40%", "-15", "0 ур."],
        image: "/images/dishes/image copy 77.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 77.png?height=128&width=128",
      },
      {
        name: "Паста Болоньезе",
        icon: getRecipeIcon("Паста Болоньезе"),
        have: 60,
        need: 40,
        recipe: "Макароны | Сыр | Овощи | Мясной фарш | Огонь",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.Мясо-1шт.Овощи-1шт.",
        stats: ["+60%", "+40%", "-25", "4 ур."],
        image: "/images/dishes/image copy 78.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 78.png?height=128&width=128",
      },
      {
        name: "Паста Карбонара",
        icon: getRecipeIcon("Паста Карбонара"),
        have: 60,
        need: 40,
        recipe: "Макароны | Сыр | Мясо | Яйца | Огонь",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.Мясо-1шт.",
        stats: ["+60%", "+40%", "-25", "4 ур."],
        image: "/images/dishes/image copy 79.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 79.png?height=128&width=128",
      },
      {
        name: "Рамен",
        icon: getRecipeIcon("Рамен"),
        have: 90,
        need: 70,
        recipe: "Макароны | Бульон | Мясо | Яйца | Огонь",
        ingredients: "Мука-1шт.Яйца-2шт.Мясо-2шт.",
        stats: ["+90%", "+70%", "-17", "0 ур."],
        image: "/images/dishes/image copy 80.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 80.png?height=128&width=128",
      },
      {
        name: "Стейк с макаронами",
        icon: getRecipeIcon("Стейк с макаронами"),
        have: 30,
        need: 25,
        recipe: "Макароны | Стейк",
        ingredients: "Мука-1шт.Яйца-1шт.Мясо-1шт.",
        stats: ["+30%", "+25%", "-8", "2 ур."],
        image: "/images/dishes/image copy 81.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 81.png?height=128&width=128",
      },
      {
        name: "Тако с мясом",
        icon: getRecipeIcon("Тако с мясом"),
        have: 30,
        need: 30,
        recipe: "Хлеб | Мясной фарш | Сыр | Овощи | Огонь",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.Мясо-1шт.Овощи-1шт.",
        stats: ["+30%", "+30%", "-10", "0 ур."],
        image: "/images/dishes/image copy 82.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 82.png?height=128&width=128",
      },
      {
        name: "Тако с рыбой",
        icon: getRecipeIcon("Тако с рыбой"),
        have: 30,
        need: 30,
        recipe: "Хлеб | Рыбный фарш | Сыр | Овощи | Огонь",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.Рыба-1шт.Овощи-1шт.",
        stats: ["+30%", "+30%", "-10", "0 ур."],
        image: "/images/dishes/image copy 83.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 83.png?height=128&width=128",
      },
      {
        name: "Буррито",
        icon: getRecipeIcon("Буррито"),
        have: 50,
        need: 50,
        recipe: "Вареный рис | Мясной фарш | Сыр | Овощи | Хлеб | Огонь",
        ingredients: "Мука-1шт.Яйца-1шт.Молоко-1шт.Мясо-1шт.Овощи-1шт.Рисовая крупа-1шт.",
        stats: ["+50%", "+50%", "-15", "0 ур."],
        image: "/images/dishes/image copy 84.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 84.png?height=128&width=128",
      },
      {
        name: "Оладьи с карамелью",
        icon: getRecipeIcon("Оладьи с карамелью"),
        have: 20,
        need: 20,
        recipe: "Оладьи | Карамель",
        ingredients: "Яйца-1шт.Молоко-1шт.Мука-1шт.Сахар-2шт.",
        stats: ["+20%", "+20%", "-10", "0 ур."],
        image: "/images/dishes/image copy 85.png?height=64&width=64",
        detailImage: "/images/dishes/image copy 85.png?height=128&width=128",
      },
      
  ]

  const alcoholItems = [
    {
      name: "Медовуха",
      icon: "🍯",
      price: 500,
      time: "120 с",
      effect: "100 %",
      ingredients: "Мед - 2шт, Вода - 1шт, Дрожжи - 1шт",
      stats: ["+25%", "+15%", "-5", "1 ур."],
      description: "Традиционный славянский напиток из меда",
      image: "/images/alko/image.png",
      detailImage: "/images/alko/image copy.png",
      location: "Медовая пасека",
      club: "Honey Club",
    },
    {
      name: "Арарат",
      icon: "🥃",
      price: 500,
      time: "120 с",
      effect: "100 %",
      ingredients: "Виноград - 5шт, Спирт - 1шт",
      stats: ["+35%", "+25%", "-8", "2 ур."],
      description: "Армянский коньяк высшего качества",
      image: "/images/alko/image copy 2.png",
      detailImage: "/images/alko/image copy 3.png",
      location: "ВАЙНВУД",
      club: "Comedy Club",
    },
    {
      name: "Бароло",
      icon: "🍷",
      price: 500,
      time: "120 с",
      effect: "100 %",
      ingredients: "Виноград Неббиоло - 3шт, Время - 1шт",
      stats: ["+45%", "+35%", "-10", "3 ур."],
      description: "Итальянское красное вино из Пьемонта",
      image: "/images/alko/image copy 4.png",
      detailImage: "/images/alko/image copy 5.png",
      location: "ПЬЕМОНТ",
      club: "Bahama Mama`s West",
    },
    {
      name: "Саке",
      icon: "🍶",
      price: 500,
      time: "120 с",
      effect: "100 %",
      ingredients: "Рис - 3шт, Вода - 2шт, Кодзи - 1шт",
      stats: ["+28%", "+18%", "-6", "1 ур."],
      description: "Японский рисовый алкогольный напиток",
      image: "/images/alko/image copy 6.png",
      detailImage: "/images/alko/image copy 7.png",
      location: "ТОКИО",
      club: "Oriental",
    },
    {
      name: "Текила",
      icon: "🥃",
      price: 500,
      time: "120 с",
      effect: "100 %",
      ingredients: "Агава - 4шт, Дрожжи - 1шт",
      stats: ["+30%", "+20%", "-7", "2 ур."],
      description: "Мексиканский напиток из голубой агавы",
      image: "/images/alko/image copy 8.png",
      detailImage: "/images/alko/image copy 9.png",
      location: "МЕКСИКА",
      club: "Galaxy",
    },
    {
      name: "Ром",
      icon: "🥃",
      price: 600,
      time: "120 с",
      effect: "100 %",
      ingredients: "Сахарный тростник - 3шт, Дрожжи - 1шт",
      stats: ["+32%", "+22%", "-7", "2 ур."],
      description: "Карибский напиток из сахарного тростника",
      image: "/images/alko/image copy 10.png",
      detailImage: "/images/alko/image copy 11.png",
      location: "КАРИБЫ",
      club: "Cayo Perico",
    },
    {
      name: "Водка",
      icon: "🍸",
      price: 300,
      time: "60 с",
      effect: "60 %",
      description: "Классический русский крепкий напиток",
      image: "/images/alko/image copy 12.png?height=64&width=64",
      detailImage: "/images/alko/image copy 13.png?height=128&width=128",
      location: "РУССКИЙ КЛУБ",
      club: "Vanilla Unicorn",
    },
    {
      name: "Самогон",
      icon: "🍶",
      price: 250,
      time: "30 с",
      effect: "30 %",
      description: "Домашний крепкий алкоголь",
      image: "/images/alko/image copy 14.png?height=64&width=64",
      detailImage: "/images/alko/image copy 15.png?height=128&width=128",
      location: "ДЕРЕВНЯ",
      club: "Vanilla Unicorn",
    },
    {
      name: "Ерофеич",
      icon: "🥃",
      price: 300,
      time: "80 с",
      effect: "60 %",
      description: "Травяная настойка",
      image: "/images/alko/image copy 16.png?height=64&width=64",
      detailImage: "/images/alko/image copy 17.png?height=128&width=128",
      location: "АПТЕКА",
      club: "Vanilla Unicorn",
    },
    {
      name: "Чинзаро",
      icon: "🍷",
      price: 400,
      time: "80 с",
      effect: "60 %",
      description: "Итальянский вермут",
      image: "/images/alko/image copy 18.png?height=64&width=64",
      detailImage: "/images/alko/image copy 19.png?height=128&width=128",
      location: "ИТАЛЬЯНСКИЙ РЕСТОРАН",
      club: "Comedy Club",
    },
    {
      name: "Мартини",
      icon: "🍸",
      price: 300,
      time: "60 с",
      effect: "60 %",
      description: "Классический коктейль",
      image: "/images/alko/image copy 20.png?height=64&width=64",
      detailImage: "/images/alko/image copy 21.png?height=128&width=128",
      location: "БАР",
      club: "Bahama Mama`s West",
    },
    {
      name: "Асти",
      icon: "🍾",
      price: 300,
      time: "60 с",
      effect: "60 %",
      description: "Игристое вино из Италии",
      image: "/images/alko/image copy 22.png?height=64&width=64",
      detailImage: "/images/alko/image copy 23.png?height=128&width=128",
      location: "ВИННЫЙ ПОГРЕБ",
      club: "Bahama Mama`s West",
    },
    {
      name: "Аморе",
      icon: "❤️",
      price: 250,
      time: "30 с",
      effect: "30 %",
      description: "Сладкий ликер",
      image: "/images/alko/image copy 24.png?height=64&width=64",
      detailImage: "/images/alko/image copy 25.png?height=128&width=128",
      location: "РОМАНТИЧЕСКОЕ КАФЕ",
      club: "Bahama Mama`s West",
    },
    {
      name: "Тоник",
      icon: "🥤",
      price: 300,
      time: "30 с",
      effect: "30 %",
      description: "Освежающий безалкогольный напиток",
      image: "/images/alko/image copy 26.png?height=64&width=64",
      detailImage: "/images/alko/image copy 27.png?height=128&width=128",
      location: "МАГАЗИН",
      club: "Cayo Perico",
    },
    {
      name: "Пина-колада",
      icon: "🍹",
      price: 500,
      time: "60 с",
      effect: "60 %",
      description: "Тропический коктейль",
      image: "/images/alko/image copy 28.png?height=64&width=64",
      detailImage: "/images/alko/image copy 29.png?height=128&width=128",
      location: "ПЛЯЖНЫЙ БАР",
      club: "Cayo Perico",
    },
    {
      name: "Брэнди",
      icon: "🍷",
      price: 600,
      time: "120 с",
      effect: "100 %",
      description: "Крепкий алкоголь из фруктов",
      image: "/images/alko/image copy 30.png?height=64&width=64",
      detailImage: "/images/alko/image copy 31.png?height=128&width=128",
      location: "ЭЛИТНЫЙ КЛУБ",
      club: "Cayo Perico",
    },
    {
      name: "Виски",
      icon: "🥃",
      price: 600,
      time: "120 с",
      effect: "100 %",
      description: "Благородный зерновой дистиллят",
      image: "/images/alko/image copy 32.png?height=64&width=64",
      detailImage: "/images/alko/image copy 31.png?height=128&width=128",
      location: "ШОТЛАНДСКИЙ ПАБ",
      club: "Cayo Perico",
    },
  ]

  const filteredRecipes = recipes.filter((recipe) => {
    const query = searchQuery.toLowerCase()
    return recipe.name.toLowerCase().includes(query) || (recipe.ingredients ?? "").toLowerCase().includes(query)
  })

  const filteredAlcohol = alcoholItems.filter((item) => {
    const query = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(query) ||
      (item.ingredients ?? "").toLowerCase().includes(query) ||
      (item.description ?? "").toLowerCase().includes(query)
    )
  })

  const renderDrinkDetail = () => (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("alcohol")}
            className="transition-colors hover:text-orange-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Назад</h1>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-6 break-words">{selectedDrink?.name}</h2>

          <div className="flex items-start gap-6 mb-8">
            <div className="w-32 h-32 relative flex-shrink-0">
              <Image
                src={selectedDrink?.image || "/placeholder.svg?height=128&width=128"}
                alt={selectedDrink?.name}
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-xs">💰</span>
                </div>
                <span className="text-lg font-semibold">{selectedDrink?.price}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-xs">⏱️</span>
                </div>
                <span className="text-lg">{selectedDrink?.time}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs">😊</span>
                </div>
                <span className="text-lg">{selectedDrink?.effect}</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-400 mb-2">Местоположение клуба</p>
            <h3 className="text-lg font-semibold">{selectedDrink?.club}</h3>
          </div>
        </div>
      </div>

      <div className="relative h-96 bg-gray-800">
        <Image src={selectedDrink?.detailImage || "/images/alcohol-detail-bg.png"} alt="Карта города" fill className="object-fit" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
          </div>
        </div>
      </div>
    </div>
  )

  const renderDishDetail = () => (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentView("recipes")}
          className="transition-colors hover:text-orange-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Назад</h1>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 break-words">{selectedDish?.name}</h2>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-yellow-400 rounded-full flex items-center justify-center relative overflow-hidden">
            {selectedDish?.image ? (
              <Image
                src={selectedDish.image || "/placeholder.svg"}
                alt={selectedDish.name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-2xl">{selectedDish?.icon}</span>
            )}
          </div>

          <div className="flex gap-4 flex-wrap">
            {selectedDish?.stats?.map((stat: string, index: number) => (
              <div key={index} className="flex items-center gap-1">
                <span>{["💪", "😊", "⚡", "💰"][index]}</span>
                <span className="text-sm text-gray-300">{stat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-right mb-4">
          <span className="text-sm text-gray-400">Ингредиенты</span>
          <span className="ml-4 text-sm">-1шт.</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Рецепт</h3>

        <Card className="bg-gray-800 border-orange-500 border-2 p-4 mb-4">
          <div className="text-center">
            <h4 className="font-semibold mb-2 break-words">{selectedDish?.name}</h4>
            <p className="text-sm text-gray-400 break-words whitespace-pre-wrap leading-relaxed">
              {selectedDish?.recipe}
            </p>
          </div>
        </Card>

        <h3 className="text-lg font-semibold mb-4">Ингредиенты</h3>
        <Card className="bg-gray-800 border-gray-700 p-4">
          <p className="text-sm text-gray-400 break-words whitespace-pre-wrap leading-relaxed">
            {selectedDish?.ingredients}
          </p>
        </Card>
      </div>
    </div>
  )

  const renderRecipes = () => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Рецепты</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("alcohol")}>
            Алкоголь 🍺
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск рецептов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-orange-500 border-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredRecipes.map((recipe, index) => (
          <Card
            key={index}
            className="bg-gray-800 border-gray-700 p-3 cursor-pointer hover:bg-gray-700 transition-transform duration-200 ease-out hover:scale-[1.01]"
            onClick={() => {
              setSelectedDish(recipe)
              setCurrentView("dish")
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 relative flex-shrink-0">
                  {recipe.image ? (
                    <Image
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.name}
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <span className="text-lg">{recipe.icon}</span>
                  )}
                </div>
                <span className="text-sm break-words">{recipe.name}</span>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-sm text-orange-500">{recipe.have}</span>
                <span className="text-sm text-purple-500">{recipe.need}</span>
              </div>
            </div>
          </Card>
        ))}
        {filteredRecipes.length === 0 && <div className="text-center text-gray-400 py-8">Рецепты не найдены</div>}
      </div>
    </div>
  )

  const renderAlcohol = () => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("recipes")}>
            Рецепты 🍳
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Алкоголь</span>
          <span className="text-gray-400">🍺</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск напитков..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-orange-500 border-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filteredAlcohol.map((item, index) => (
          <Card
            key={index}
            className="bg-gray-800 border-gray-700 p-3 text-center cursor-pointer hover:bg-gray-700 transition-transform duration-200 ease-out hover:scale-[1.01]"
            onClick={() => {
              setSelectedDrink(item)
              setCurrentView("drink")
            }}
          >
            <div className="w-12 h-12 mx-auto mb-2 relative">
              {item.image ? (
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded" />
              ) : (
                <div className="text-2xl">{item.icon}</div>
              )}
            </div>
            <div className="text-sm font-semibold mb-1 break-words">{item.name}</div>
            <div className="text-xs text-gray-400">
              <div>💰 {item.price}</div>
              <div>⏱️ {item.time}</div>
              <div>📊 {item.effect}</div>
            </div>
          </Card>
        ))}
        {filteredAlcohol.length === 0 && (
          <div className="col-span-3 text-center text-gray-400 py-8">Напитки не найдены</div>
        )}
      </div>
    </div>
  )

  switch (currentView) {
    case "drink":
      return renderDrinkDetail()
    case "dish":
      return renderDishDetail()
    case "alcohol":
      return renderAlcohol()
    default:
      return renderRecipes()
  }
}
