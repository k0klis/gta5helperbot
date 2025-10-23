"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, RotateCcw, Settings, Plus, Minus } from "lucide-react"
import { UserStorage } from "@/utils/user-storage"
import { getUserGameData, saveUserGameData } from "@/utils/game-storage"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface Activity {
  name: string
  icon: string
  maxCount: number
  currentCount: number
  baseBP: number
  isCompleted: boolean
  description: string
}

// Версия структуры данных для миграции
const DATA_VERSION = 2

// Эталонный список активностей (всегда актуальный)
const DEFAULT_ACTIVITIES: Activity[] = [
  {
    name: "Мафия",
    icon: "🎭",
    maxCount: 3,
    currentCount: 0,
    baseBP: 6,
    isCompleted: false,
    description: "Сыграть в мафию в казино",
  },
  {
    name: "Платеж по лизингу",
    icon: "🧾",
    maxCount: 1,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Сделать платеж по лизингу",
  },
  {
    name: "Трава",
    icon: "🌿",
    maxCount: 4,
    currentCount: 0,
    baseBP: 8,
    isCompleted: false,
    description: "Посадить траву в теплице",
  },
  {
    name: "Обезболивающие",
    icon: "💊",
    maxCount: 4,
    currentCount: 0,
    baseBP: 8,
    isCompleted: false,
    description: "Запустить переработку обезболивающих в лаборатории",
  },
  {
    name: "Аирдропы",
    icon: "📦",
    maxCount: 2,
    currentCount: 0,
    baseBP: 4,
    isCompleted: false,
    description: "Запустить переработку обезболивающих в лаборатории",
  },
  {
    name: "Лотерея",
    icon: "🎰",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Купить лотерейный билет. Доступно с 10:00 до 23:50",
  },
  {
    name: "Тир",
    icon: "🎯",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Успешно пройти тренировку в тире (>75% попаданий по целям)",
  },
  {
  name: "Посетить сайт",
  icon: "🌐",
  maxCount: 1,
  currentCount: 0,
  baseBP: 1,
  isCompleted: false,
  description: "Посетить любой сайт в браузере"
  },
  {
  name: "Зайти в канал Brawl",
  icon: "📺",
  maxCount: 1,
  currentCount: 0,
  baseBP: 1,
  isCompleted: false,
  description: "Зайти в любой канал в Brawl"
  },
  {
  name: "Лайк в Match",
  icon: "❤️",
  maxCount: 1,
  currentCount: 0,
  baseBP: 1,
  isCompleted: false,
  description: "Поставить лайк любой анкете в Match"
  },
  {
  name: "Кейс за DP",
  icon: "🎁",
  maxCount: 1,
  currentCount: 0,
  baseBP: 10,
  isCompleted: false,
  description: "Прокрутить за DP серебрянный или золотой кейс"
  },
  {
  name: "Броски питомцу",
  icon: "🐾",
  maxCount: 15,
  currentCount: 0,
  baseBP: 2,
  isCompleted: false,
  description: "Кинуть мяч питомцу 15 раз"
  },
  {
  name: "Команды питомца",
  icon: "🐶",
  maxCount: 15,
  currentCount: 0,
  baseBP: 2,
  isCompleted: false,
  description: "Выполнить 15 команд питомцем"
  },
  {
  name: "Колесо удачи",
  icon: "🎡",
  maxCount: 1,
  currentCount: 0,
  baseBP: 3,
  isCompleted: false,
  description: "Сделать ставку в межсерверном колесе удачи казино"
  },
  {
  name: "Метро",
  icon: "🚇",
  maxCount: 1,
  currentCount: 0,
  baseBP: 2,
  isCompleted: false,
  description: "Проехать одну станцию на метро"
  },
  {
  name: "Рыбалка",
  icon: "🎣",
  maxCount: 20,
  currentCount: 0,
  baseBP: 4,
  isCompleted: false,
  description: "Поймать 20 рыб"
  },
  {
  name: "Квесты клуба",
  icon: "🏆",
  maxCount: 2,
  currentCount: 0,
  baseBP: 4,
  isCompleted: false,
  description: "Выполнить 2 квеста любых клубов"
  },
  {
  name: "Автосервис",
  icon: "🔧",
  maxCount: 1,
  currentCount: 0,
  baseBP: 1,
  isCompleted: false,
  description: "Починить деталь в автосервисе"
  },
  {
  name: "Баскетбол",
  icon: "🏀",
  maxCount: 2,
  currentCount: 0,
  baseBP: 1,
  isCompleted: false,
  description: "Забросить 2 мяча в баскетболе"
  },
  {
  name: "Футбол",
  icon: "⚽",
  maxCount: 2,
  currentCount: 0,
  baseBP: 1,
  isCompleted: false,
  description: "Забить 2 гола в футболе"
  },
  {
  name: "Армрестлинг",
  icon: "💪",
  maxCount: 1,
  currentCount: 0,
  baseBP: 1,
  isCompleted: false,
  description: "Победить в армрестлинге"
  },
  {
  name: "Дартс",
  icon: "🎯",
  maxCount: 1,
  currentCount: 0,
  baseBP: 1,
  isCompleted: false,
  description: "Победить в дартс"
  },
  {
  name: "Волейбол",
  icon: "🏐",
  maxCount: 10,
  currentCount: 0,
  baseBP: 1,
  isCompleted: false,
  description: "Забить 10 голов в волейболе"
  },
  {
  name: "Настольный теннис 1 минута",
  icon: "🏓",
  maxCount: 0,
  currentCount: 0,
  baseBP: 1,
  isCompleted: false,
  description: "Играть в настольный теннис минуту"
  },
  {
  name: "Большой теннис 1 минута",
  icon: "🎾",
  maxCount: 10,
  currentCount: 0,
  baseBP: 1,
  isCompleted: false,
  description: "Играть в большой теннис минуту"
  },

  {
    name: "Киностудия",
    icon: "🎬",
    maxCount: 0,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Снять киностудию. Цена одиночной с платиновой вип - 2500$",
  },
  {
    name: "Кинотеатр",
    icon: "🍿",
    maxCount: 5,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "5 раз добавить видео в очередь в кинотеатре",
  },
  {
    name: "Гонка",
    icon: "🏁",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Поучавствовать в гонке со ставкой >1000$",
  },
  {
    name: "Арена",
    icon: "🏟️",
    maxCount: 3,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "3 раза победить в любом режиме со ставкой >100$",
  },
  {
    name: "Стройка",
    icon: "🏗️",
    maxCount: 25,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Совершить 25 действий на стройке",
  },
  {
    name: "Порт",
    icon: "🚢",
    maxCount: 25,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Совершить 25 действий в порту",
  },
  {
    name: "Шахта",
    icon: "⛏️",
    maxCount: 25,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Совершить 25 действий на шахте",
  },
  {
    name: "Ферма",
    icon: "🚜",
    maxCount: 10,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Совершить 10 действий на ферме",
  },
  {
    name: "Картинг",
    icon: "🏎️",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Выиграть гонку на картинге. Вход - 500$",
  },
  {
    name: "Сокровище",
    icon: "💎",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Найти сокровище (не хлам/семена) с помощью металоискателя и лопаты",
  },
  {
    name: "Автобус",
    icon: "🚌",
    maxCount: 2,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Проехать 2 любых рейса работая водителем автобуса",
  },
  {
    name: "Почта",
    icon: "✉️",
    maxCount: 10,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Отвезти 10 посылок с почты. К/Д на взятие посылки - 10 мин. Работа доступна с 7 уровня",
  },
  {
    name: "Нули в казино",
    icon: "🎲",
    maxCount: 0,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Выиграть в рулетку поставив на 0 или 00",
  },
  {
    name: "Денс батл",
    icon: "🕺",
    maxCount: 3,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "3 раза выиграть в дэнс батле. Ночной клуб должен быть открыт",
  },
  {
    name: "Тренажерный зал",
    icon: "🏋️",
    maxCount: 20,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Совершить 20 подходов на любом тренажёре в любом тренажёрном зале",
  },
  {
    name: "Тренер. комплекс",
    icon: "💪",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "5 раз победить в любом режиме со ставкой >100$",
  },
  {
    name: "Охота",
    icon: "🦌",
    maxCount: 5,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Разделать 5 шкур любых животных (100% прочности)",
  },
  {
    name: "Пожарный",
    icon: "🚒",
    maxCount: 25,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Потушить 25 огоньков. Работа пожарным доступна с наличием военного билета с 10 уровня",
  },
  {
    name: "Дальнобойщик",
    icon: "🚚",
    maxCount: 3,
    currentCount: 0,
    baseBP: 4,
    isCompleted: false,
    description:
      "3 Раза доставить груз в любую точку. Работа доступна с 7 уровня с лицензией на управление грузовым транспортом",
  },
  {
    name: "Заказ материалов для бизнеса",
    icon: "📦",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description:
      "Отключить и включить автоматический заказ материалов для своего бизнеса. Только для владельцев бизнеса",
  },
  {
    name: "Смена внешности",
    icon: "💇",
    maxCount: 2,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "2 раза сменить внешность у хирурга в EMS",
  },
  {
    name: "Граффити",
    icon: "🎨",
    maxCount: 7,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Закрасить 7 граффити (банда)",
  },
  {
    name: "Контрабанда",
    icon: "💼",
    maxCount: 5,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Сдать 5 контрабанды (мафия)",
  },
  {
    name: "Бизвар",
    icon: "🔫",
    maxCount: 5,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Участие в бизваре (мафия)",
  },
  {
    name: "Капт",
    icon: "👥",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Участие в капте (банда)",
  },
  {
    name: "Хаммер с ВЗХ",
    icon: "🚗",
    maxCount: 0,
    currentCount: 0,
    baseBP: 3,
    isCompleted: false,
    description: "Пригнать хаммер на респавн своей фракции на войне за хаммеры (крайм фракции)",
  },
  {
    name: "Медкарты в EMS",
    icon: "🏥",
    maxCount: 5,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Выдать 5 медкарт EMS",
  },
  {
    name: "Вызовы в EMS",
    icon: "🚑",
    maxCount: 15,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Закрыть 15 вызовов EMS",
  },
  {
    name: "Зелёная строка WN",
    icon: "📄",
    maxCount: 0,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Сообщения в зелёной строке (WN)",
  },
  {
    name: "Объявления WN",
    icon: "📰",
    maxCount: 40,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Отредактировать 40 объявлений (WN)",
  },
  {
    name: "Ограбления домов",
    icon: "🏠",
    maxCount: 15,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Взломать 15 замков на ограблениях домов или угонах авто (банды)",
  },
  {
    name: "Коды",
    icon: "🔢",
    maxCount: 5,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Закрыть 5 кодов (Силовые структуры)",
  },
  {
    name: "Регистрация авто",
    icon: "🚗",
    maxCount: 2,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Поставить на учёт 2 автомобиля (LSPD)",
  },
  {
    name: "Арест",
    icon: "👮",
    maxCount: 0,
    currentCount: 0,
    baseBP: 1,
    isCompleted: false,
    description: "Произвести 1 арест в КПЗ (LSSD, LSPD)",
  },
  {
    name: "Выкуп с КПЗ",
    icon: "🔓",
    maxCount: 2,
    currentCount: 0,
    baseBP: 2,
    isCompleted: false,
    description: "Выкупить 2 человек из КПЗ (Адвокат)",
  },
]

// Эталонный список достижений
const DEFAULT_ACHIEVEMENTS: Activity[] = [
    {
      name: "Дружелюбный сосед",
      icon: "🤝",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Пожать руку незнакомцам 1000 раз",
    },
    {
      name: "Игровой маньяк",
      icon: "🎮",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Отыграть на сервере за день 15 часов",
    },
    {
      name: "Приятный отдых",
      icon: "🍺",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Выпить 100 бутылок алкоголя (из любого клуба)",
    },
    {
      name: "Сторожила сервера",
      icon: "⏰",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Отыграть на сервере 1000 часов",
    },
    {
      name: "Ветеран войны",
      icon: "⚔️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Совершить 200 убийств на каптах или бизварах",
    },
    {
      name: "Я сажал фиалки, честно!",
      icon: "🌱",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Получить 5000 травы в теплице",
    },
    {
      name: "Пабло Аналгобар",
      icon: "⚗️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Получить 1000 анальгетиков в лаборатории",
    },
    {
      name: "Транжира",
      icon: "👔",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Потратить на покупках одежды 1000000$",
    },
    {
      name: "За проезд передаем",
      icon: "🚌",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Оплатить поездку 1000 раз на автобусе на разных рейсах НАГРАДА: (Shuttle Bus)",
    },
    {
      name: "Заслуженный строитель",
      icon: "🏗️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Совершить 1000 действий на стройке",
    },
    {
      name: "Каменный проныра",
      icon: "⛏️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Перетаскать 1000 камней на шахте",
    },
    {
      name: "Я раньше почему злой был?",
      icon: "📮",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Доставить 1000 почтовых отправлений НАГРАДА: (велосипед)",
    },
    {
      name: "Король дорог",
      icon: "🚛",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Сделать 100 перевозок груза работая дальнобойщиком",
    },
    {
      name: "Добрый самаритянин",
      icon: "🔧",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Выдать 5 ремонтных наборов NPC с поломанными машинами",
    },
    {
      name: "Водитель от Бога",
      icon: "🚕",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Совершить 1000 перевозок работая в Taxi",
    },
    {
      name: "Профессиональный ловец",
      icon: "🎣",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Поймать 2000 рыб",
    },
    {
      name: "Время загадать желание",
      icon: "🐠",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Поймать золотую рыбку",
    },
    
    {
      name: "Король мероприятий",
      icon: "👑",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Выиграть в мероприятиях 50 раз - награда 50 DP (Достижение недоступно для получения)",
    },
    {
      name: "Бракосочетание",
      icon: "💍",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Соедините брачные узы воедино",
    },
    {
      name: "Большой куш",
      icon: "💰",
      maxCount: 0,
      currentCount: 0,
      baseBP: 30,
      isCompleted: false,
      description: "Сорвать Джекпот",
    },
    {
      name: "Отчаянный ход",
      icon: "🎰",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Выиграть поставив на 0 или 00",
    },
    {
      name: "Счастливая рука",
      icon: "🎲",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Выбить 12 очков при игре в кости 12 раз",
    },
    {
      name: "Вращайте барабан",
      icon: "🎡",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Прокрутить колесо удачи 100 раз - награда 1000 DP (самая вкусная ачивка)",
    },
    {
      name: "Держим ритм",
      icon: "💃",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Победить 100 раз в Dance Battle",
    },
    {
      name: "Завсегдатый бара",
      icon: "🍸",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Выпить 10 бокалов алкоголя в казино",
    },
    {
      name: "Доброжелатель",
      icon: "🏛️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Пожертвовать 1.000.000$ в фонд Epsilon (в банке, достижение требуется для вступления в клуб Epsilon)",
    },
    {
      name: "Мать драконов",
      icon: "🥚",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Купить яйцо в магазине мебели за 1.000.000$",
    },
    {
      name: "Мастер навалить бочком",
      icon: "🏎️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Набрать 20000 очков дрифта за раз",
    },
    {
      name: "Не шей мне срок",
      icon: "🔒",
      maxCount: 0,
      currentCount: 0,
      baseBP: 100,
      isCompleted: false,
      description: "Отсидеть в тюрьме более 55 часов за раз",
    },
    {
      name: "Мясник из Болингброук",
      icon: "🔪",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Убить 50 заключенных заточкой",
    },
    {
      name: "За друзей и тюремный двор",
      icon: "🚪",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Освободить 10 заключенных при нападениях на тюрьму",
    },
    {
      name: "Ты знаешь с кем разговариваешь?",
      icon: "🚁",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Быть освобожденным при нападении на тюрьму",
    },
    {
      name: "Сомелье",
      icon: "🍷",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Выпить бутылку коллекционного вина - награда BP=уровень персонажа",
    },
    {
      name: "Руки-базуки",
      icon: "💪",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Безошибочно сделать 5 подходов подряд со 100кг штангой",
    },
    {
      name: "Самая быстрая рука в Сан-Андреас",
      icon: "🎯",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Набрать 200 очков в тире за одну попытку 5 раз (нужен 10 уровень стрельбы)",
    },
    {
      name: "Оставить след",
      icon: "🏆",
      maxCount: 0,
      currentCount: 0,
      baseBP: 100,
      isCompleted: false,
      description: "Получить свой памятник в Зале Славы",
    },
    {
      name: "Прирожденный фермер",
      icon: "🚜",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Выполнить 10.000 действий на ферме - награда ржавый трактор",
    },
    {
      name: "Король картинга",
      icon: "🏁",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Победить в 100 заездах из 6 человек в картинге - награда возможность надевать гоночные костюмы в картинге",
    },
    {
      name: "На страже Форта Занкудо",
      icon: "⚡",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Починить электричество на Форте Занкудо во время нападения до загрузки матовозок нападающими",
    },
    {
      name: "На страже федеральной тюрьмы",
      icon: "🔌",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Починить электричество в Федеральной тюрьме до освобождения заключенных нападающими",
    },
    {
      name: "Золотая лихорадка",
      icon: "⚱️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Найти и сдать скупщику сокровищ на 100.000$",
    },
    {
      name: "Особенности национальной охоты",
      icon: "🐆",
      maxCount: 0,
      currentCount: 0,
      baseBP: 100,
      isCompleted: false,
      description: "Убить пуму голыми руками в состоянии алкогольного опьянения",
    },
    {
      name: "Знаменосец",
      icon: "🚩",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Поставить флаг мотоклуба 10 раз при выполнении задания \"Покорение вершин\"",
    },
    {
      name: "Ангел дорог",
      icon: "🏍️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 30,
      isCompleted: false,
      description: "Достигнуть максимального ранга в любом мотоклубе",
    },
    {
      name: "Дом у дороги",
      icon: "🥊",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Победить в пьяной драке в общине деревенщин с активным заданием на неё против других игроков с этим же заданием",
    },
    {
      name: "Из-за этих гадов мы без работы сидим!",
      icon: "🤠",
      maxCount: 0,
      currentCount: 0,
      baseBP: 30,
      isCompleted: false,
      description: "Достигнуть максимального ранга в клубе Rednecks",
    },
    {
      name: "Глотай пыль",
      icon: "🏎️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Занять 1 место в 100 гонках за репутацию в автоклубе Car Meet",
    },
    {
      name: "Газ в пол",
      icon: "🏁",
      maxCount: 0,
      currentCount: 0,
      baseBP: 30,
      isCompleted: false,
      description: "Достигнуть максимального уровня в автоклубе Car Meet",
    },
    {
      name: "Небеса разверзлись",
      icon: "📦",
      maxCount: 0,
      currentCount: 0,
      baseBP: 100,
      isCompleted: false,
      description: "Победить в 50 аирдропах в составе фракции, будучи сотрудником Merryweather",
    },
    {
      name: "Боевое крещение",
      icon: "🎖️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 30,
      isCompleted: false,
      description: "Достигнуть максимального ранга в Merryweather",
    },
    {
      name: "Постижение непостижимого",
      icon: "🔮",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Обрести Киффлом, отказавшись от всех обязательств Программы Epsilon (у Криса за 10к репутации) - одежда послушника + статуя для топ 3 по пожертвованиям",
    },
    {
      name: "Таксую для души",
      icon: "🚖",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Выполнить 100 заказов такси на Truffade Fake Taxi",
    },
    {
      name: "Дядюшка Скрудж",
      icon: "💸",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Выкинуть на ветер 1.000.000$ (из пушки SUP) - маска Скруджа Макдака",
    },
    {
      name: "Томми не умеет плавать",
      icon: "🌊",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Умереть в воде в обличье Томми Версетти (достаточно маски Томми)",
    },
    {
      name: "Попа слиплась",
      icon: "🍭",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Получить по попе боевым леденцом находясь без сознания",
    },
    {
      name: "Соло на клавиатуре",
      icon: "🎹",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Поднять настроение окружающим 1000 раз, сыграв им на пианино или синтезаторе - награда Пианино",
    },
    {
      name: "Тонкий слух",
      icon: "👂",
      maxCount: 0,
      currentCount: 0,
      baseBP: 100,
      isCompleted: false,
      description: "Получить настроение от чьей-нибудь игры на пианино или синтезаторе 100 раз",
    },
    {
      name: "Заслуженный дрессировщик",
      icon: "🐕",
      maxCount: 0,
      currentCount: 0,
      baseBP: 100,
      isCompleted: false,
      description: "Достичь 100% дрессировки любого питомца",
    },
    {
      name: "Вкус лета",
      icon: "🍦",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Попробовать мороженое всех 8 видов на летнем фестивале",
    },
    {
      name: "Санта Клаус",
      icon: "🎁",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Подарить другим игрокам 50 подарков (из рук в руки) на новогодние праздники",
    },
    {
      name: "На страже рождества 2022",
      icon: "👹",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Отпугнуть Гринча, когда застанете его за попыткой вломиться в чужой дом - награда маска Гринча-обезьяны",
    },
    {
      name: "Лето 2021",
      icon: "☀️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Активировать сезонный пропуск Лето '21",
    },
    {
      name: "Зима 2021",
      icon: "❄️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Активировать сезонный пропуск Зима '21",
    },
    {
      name: "Лето 2022",
      icon: "☀️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Активировать сезонный пропуск Лето '22",
    },
    {
      name: "Зима 2022",
      icon: "❄️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Активировать сезонный пропуск Зима '22",
    },
    {
      name: "Лето 2023",
      icon: "☀️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Активировать сезонный пропуск Лето '23",
    },
    {
      name: "Зима 2023",
      icon: "❄️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Активировать сезонный пропуск Зима '23",
    },
    {
      name: "Лето 2024",
      icon: "☀️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Активировать сезонный пропуск Лето '24",
    },
    {
      name: "Зима 2024",
      icon: "❄️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Активировать сезонный пропуск Зима '24",
    },
    {
      name: "Годовщина 2021",
      icon: "📦",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Открыть кейс Годовщины 2021 года - награда браслет звезда",
    },
    {
      name: "Годовщина 2022",
      icon: "📦",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Открыть кейс Годовщины 2022 года - награда часы звезда",
    },
    {
      name: "Годовщина 2023",
      icon: "📦",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Открыть кейс Годовщины 2023 года - награда кроссовки звезда",
    },
    {
      name: "Новый год 2020",
      icon: "🎊",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Пройти новогодний квест с лабиринтом в новый год 2019-2020 - награды не было",
    },
    {
      name: "Новый год 2021",
      icon: "🎊",
      maxCount: 0,
      currentCount: 0,
      baseBP: 20,
      isCompleted: false,
      description: "Зайти в игру 31 декабря 2020 года",
    },
    {
      name: "Новый год 2022",
      icon: "🥗",
      maxCount: 0,
      currentCount: 0,
      baseBP: 20,
      isCompleted: false,
      description: "Съесть оливье 31 декабря 2021 года или 1 января 2022",
    },
    {
      name: "Новый год 2023",
      icon: "🥗",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Съесть оливье 31 декабря 2022 года или 1 января 2023",
    },
    {
      name: "Новый год 2024",
      icon: "🥗",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Съесть оливье 31 декабря 2023 года или 1 января 2024",
    },
    {
      name: "Новый год 2025",
      icon: "🥗",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Съесть оливье 31 декабря 2024 года или 1 января 2025 (изменено)",
    },
    {
      name: "Сентябрь 2020",
      icon: "📚",
      maxCount: 0,
      currentCount: 0,
      baseBP: 20,
      isCompleted: false,
      description: "Получить 5 по всем предметам",
    },
    {
      name: "Сентябрь 2021",
      icon: "👕",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Получить 5 по всем предметам - награда худи ULSA случайного цвета",
    },
    {
      name: "Сентябрь 2022",
      icon: "🎓",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Получить 5 по всем предметам - награда шапка выпускника",
    },
    {
      name: "Сентябрь 2023",
      icon: "👖",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Получить 5 по всем предметам - награда штаны ULSA случайного цвета",
    },
    {
      name: "Хэллоуин 2021",
      icon: "🧟",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Убить 500 зомби во время ивента - награда маска зомби",
    },
    {
      name: "Хэллоуин 2022",
      icon: "🧟",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Убить 500 зомби во время ивента",
    },
    {
      name: "Хэллоуин 2023",
      icon: "🧟",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Убить 500 зомби во время ивента",
    },
    {
      name: "Безупречная защита",
      icon: "🏰",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Защитить пряничный замок, недопустив повреждения ворот зимой 2023 года - награда \"Боевой леденец\" (оружие ближнего боя)",
    },
    {
      name: "Снежный чемпион 2024",
      icon: "❄️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Получить повышенную награду в соревновательных квестах события \"Новый год 2024\" 100 раз - награда \"Снежкомет\"",
    },
    {
      name: "Легенда Летнего фестиваля 2024",
      icon: "🏆",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Победить в соревнованиях Летнего фестиваля 150 раз - награда летательный аппарат Ultralight",
    },
    {
      name: "Успешный кейс",
      icon: "💼",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Доставить 30 кейсов Годовщины организатору - награда Пиротехническая установка (пушка стреляющая фейрверками)",
    },
    {
      name: "Палочки к бою",
      icon: "🪄",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Победить 50 раз в магических дуэлях во время проведения события \"Хэллоуин 2024\" - награда мантия дуэлянта",
    },
    {
      name: "Позолоти ручку",
      icon: "🃏",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Забрать у других людей 66 конфет в заданиях Гадалки во время проведения события \"Хэллоуин 2024\" - награда колода карт таро",
    },
    {
      name: "Алчности нет предела",
      icon: "😈",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Выполнить задание \"Сбор данных для Санты\" 25 раз, пометив всех детей плохими - награда Костюм новогоднего злодея",
    },
    {
      name: "Первая кровь",
      icon: "🩸",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Сделать первое убийство на капте",
    },
    {
      name: "Гурман",
      icon: "🍽️",
      maxCount: 0,
      currentCount: 0,
      baseBP: 100,
      isCompleted: false,
      description: "Пообедать в тюремной столовой 100 раз (Способ с сигаретами не работает с 10 мая 2021 года, только бесплатная еда)",
    },
    {
      name: "Нездоровое везение",
      icon: "🐡",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Съесть неправильно приготовленную рыбу фугу и выжить",
    },
    {
      name: "Слишком грубые руки",
      icon: "🐄",
      maxCount: 0,
      currentCount: 0,
      baseBP: -50,
      isCompleted: false,
      description: "Обидеть 200 коров - награда минус 50 BP",
    },
    {
      name: "Барон Дымхаузер",
      icon: "💨",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Получить настроение от использования вейпа 100 раз",
    },
    {
      name: "Аристократические замашки",
      icon: "🧐",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Получить настроение, покурив трубку с моноклем",
    },
    {
      name: "Тост за победителя",
      icon: "🍾",
      maxCount: 0,
      currentCount: 0,
      baseBP: 10,
      isCompleted: false,
      description: "Открыть бутылку шампанского после победы",
    },
    {
      name: "Ужасы Хэллоуина 2022",
      icon: "👻",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Одержать верх над любым из Ужасов Хэллоуина",
    },
    {
      name: "Ужасы Хэллоуина 2023",
      icon: "👻",
      maxCount: 0,
      currentCount: 0,
      baseBP: 50,
      isCompleted: false,
      description: "Одержать верх над любым из Ужасов Хэллоуина",
    },
    {
      name: "Изношенный реквизит",
      icon: "🦸",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Выполнить квест \"Реклама\" у учителя ритмики 50 раз в течение школьного ивента 2023 - награда костюм Impotent Rage",
    },
    {
      name: "Стремительная карьера",
      icon: "🚨",
      maxCount: 0,
      currentCount: 0,
      baseBP: 25,
      isCompleted: false,
      description: "Посадить себя в федеральную тюрьму и отсидеть не менее 4х часов (не через бота, а арестовать самого себя)",
    },
    {
      name: "Летние движения",
      icon: "🕺",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Повторить трудноразличимые танцы на Летнем фестивале 250 раз - награда Комбинезон AU",
    },
    {
      name: "Инвестировал в говно",
      icon: "💩",
      maxCount: 0,
      currentCount: 0,
      baseBP: 0,
      isCompleted: false,
      description: "Поддержать местный сельскохозяйственный бизнес на 1.000.000$ (купить навоз на миллион у NPC) - награда маска г*вна",
    }
    
  
]

export function FarmTab() {
  const [totalBP, setTotalBP] = useState(0)
  const [isVIP, setIsVIP] = useState(false)
  const [isX2, setIsX2] = useState(false)
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null)
  const [counterValue, setCounterValue] = useState(0)
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES)

  // Достижения
  const [achievements, setAchievements] = useState<Activity[]>(DEFAULT_ACHIEVEMENTS)
  const [achievementsBP, setAchievementsBP] = useState(0)

  // Функция для миграции и синхронизаци�� активностей
  const migrateActivities = (savedActivities: Activity[]): Activity[] => {
    const migratedActivities = DEFAULT_ACTIVITIES.map((defaultActivity) => {
      // Ищем соответствующую активность в сохраненных данных
      const savedActivity = savedActivities.find((saved) => saved.name === defaultActivity.name)

      if (savedActivity) {
        // Если активность найдена, сохраняем пользовательские данные, но обновляем структуру
        return {
          ...defaultActivity, // Берем актуальную структуру
          currentCount: savedActivity.currentCount || 0,
          isCompleted: savedActivity.isCompleted || false,
        }
      } else {
        // Если активность новая, используем значения по умолчанию
        return defaultActivity
      }
    })

    return migratedActivities
  }

  // Функция для сохранения текущего состояния фарма
  const saveCurrentFarmData = async (
    currentTotalBP: number,
    currentIsVIP: boolean,
    currentIsX2: boolean,
    currentActivities: Activity[],
    currentCounterValue: number,
  ) => {
    const userId = UserStorage.getUserId()
    const initData = UserStorage.getTelegramInitData()
    if (userId && initData) {
      const dataToSave = {
        version: DATA_VERSION,
        totalBP: currentTotalBP,
        isVIP: currentIsVIP,
        isX2: currentIsX2,
        activities: currentActivities,
        counterValue: currentCounterValue,
      }
      const currentFullData = (await getUserGameData(userId, initData)) || {}
      await saveUserGameData(userId, { ...currentFullData, farmData: dataToSave }, initData)
    }
  }

  // Сохранение достижений
  const saveAchievementsData = async (
    currentAchievements: Activity[],
    currentAchievementsBP: number
  ) => {
    const userId = UserStorage.getUserId()
    const initData = UserStorage.getTelegramInitData()
    if (userId && initData) {
      const currentFullData = (await getUserGameData(userId, initData)) || {}
      await saveUserGameData(
        userId,
        { ...currentFullData, achievementsData: { achievements: currentAchievements, achievementsBP: currentAchievementsBP } },
        initData
      )
    }
  }

  // Загрузка данных пользователя при инициализации
  useEffect(() => {
    const loadFarmData = async () => {
      const userId = UserStorage.getUserId()
      const initData = UserStorage.getTelegramInitData()
      if (userId && initData) {
        const savedData = await getUserGameData(userId, initData)
        if (savedData && savedData.farmData) {
          setTotalBP(savedData.farmData.totalBP || 0)
          setIsVIP(savedData.farmData.isVIP || false)
          setIsX2(savedData.farmData.isX2 || false)
          setCounterValue(savedData.farmData.counterValue || 0)

          // Проверяем версию данных и мигрируем при необходимости
          if (savedData.farmData.activities) {
            if (!savedData.farmData.version || savedData.farmData.version < DATA_VERSION) {
              // Нужна миграция
              const migratedActivities = migrateActivities(savedData.farmData.activities)
              setActivities(migratedActivities)
              // Сохраняем мигрированные данные
              saveCurrentFarmData(
                savedData.farmData.totalBP || 0,
                savedData.farmData.isVIP || false,
                savedData.farmData.isX2 || false,
                migratedActivities,
                savedData.farmData.counterValue || 0,
              )
            } else {
              // Данные актуальны, но все равно проверяем на новые активности
              const migratedActivities = migrateActivities(savedData.farmData.activities)
              setActivities(migratedActivities)
            }
          }
        }
      }
    }
    loadFarmData()
  }, [])

  // Загрузка достижений
  useEffect(() => {
    const loadAchievementsData = async () => {
      const userId = UserStorage.getUserId()
      const initData = UserStorage.getTelegramInitData()
      if (userId && initData) {
        const savedData = await getUserGameData(userId, initData)
        if (savedData && savedData.achievementsData) {
          setAchievements(savedData.achievementsData.achievements || DEFAULT_ACHIEVEMENTS)
          setAchievementsBP(savedData.achievementsData.achievementsBP || 0)
        }
      }
    }
    loadAchievementsData()
  }, [])

  const getMultiplier = () => {
    let multiplier = 1
    if (isVIP) multiplier *= 2
    if (isX2) multiplier *= 2
    return multiplier
  }

  const updateMultiplier = (type: "vip" | "x2") => {
    const oldMultiplier = getMultiplier()
    let newIsVIP = isVIP
    let newIsX2 = isX2

    if (type === "vip") {
      newIsVIP = !isVIP
      setIsVIP(newIsVIP)
    } else {
      newIsX2 = !isX2
      setIsX2(newIsX2)
    }

    // Пересчитываем totalBP с новым множителем
    setTimeout(() => {
      const newMultiplier =
        type === "vip"
          ? newIsVIP
            ? oldMultiplier * 2
            : oldMultiplier / 2
          : newIsX2
            ? oldMultiplier * 2
            : oldMultiplier / 2

      const updatedTotalBP = Math.floor((totalBP * newMultiplier) / oldMultiplier)
      setTotalBP(updatedTotalBP)
      saveCurrentFarmData(updatedTotalBP, newIsVIP, newIsX2, activities, counterValue)
    }, 0)
  }

  const increaseCount = (index: number) => {
    setActivities((prev) => {
      const newActivities = prev.map((activity, i) => {
        if (i === index && activity.currentCount < activity.maxCount && !activity.isCompleted) {
          const newCount = activity.currentCount + 1
          const updatedActivity = { ...activity, currentCount: newCount }

          // Автоматически выполняем задание при достижении максимума
          if (newCount === activity.maxCount && activity.maxCount > 0) {
            const finalBP = activity.baseBP * getMultiplier()
            setTotalBP((prevBP) => {
              const updatedBP = prevBP + finalBP
              saveCurrentFarmData(updatedBP, isVIP, isX2, newActivities, counterValue)
              return updatedBP
            })
            updatedActivity.isCompleted = true
          }
          return updatedActivity
        }
        return activity
      })
      saveCurrentFarmData(totalBP, isVIP, isX2, newActivities, counterValue)
      return newActivities
    })
  }

  const decreaseCount = (index: number) => {
    setActivities((prev) => {
      const newActivities = prev.map((activity, i) => {
        if (i === index && activity.currentCount > 0 && !activity.isCompleted) {
          return { ...activity, currentCount: activity.currentCount - 1 }
        }
        return activity
      })
      saveCurrentFarmData(totalBP, isVIP, isX2, newActivities, counterValue)
      return newActivities
    })
  }

  const completeTaskWithoutLimit = (index: number) => {
    setActivities((prev) => {
      const newActivities = prev.map((activity, i) => {
        if (i === index && !activity.isCompleted && activity.maxCount === 0) {
          const finalBP = activity.baseBP * getMultiplier()
          setTotalBP((prevBP) => {
            const updatedBP = prevBP + finalBP
            saveCurrentFarmData(updatedBP, isVIP, isX2, newActivities, counterValue)
            return updatedBP
          })
          return { ...activity, isCompleted: true }
        }
        return activity
      })
      saveCurrentFarmData(totalBP, isVIP, isX2, newActivities, counterValue)
      return newActivities
    })
  }

  const updateCounter = (increment: boolean) => {
    const newValue = increment ? counterValue + 1 : Math.max(0, counterValue - 1)
    setCounterValue(newValue)

    // Вычисляем BP: за каждые 3 единицы счётчика даём +2 BP
    const bpFromCounter = Math.floor(newValue / 3) * 2 * getMultiplier()
    const oldBpFromCounter = Math.floor(counterValue / 3) * 2 * getMultiplier()
    const bpDifference = bpFromCounter - oldBpFromCounter

    if (bpDifference !== 0) {
      setTotalBP((prevBP) => {
        const updatedBP = prevBP + bpDifference
        saveCurrentFarmData(updatedBP, isVIP, isX2, activities, newValue)
        return updatedBP
      })
    } else {
      saveCurrentFarmData(totalBP, isVIP, isX2, activities, newValue)
    }
  }

  // Универсальный сброс всего прогресса
  const resetAllProgress = async () => {
    // Сбросить фарм
    const resetActivities = DEFAULT_ACTIVITIES.map(a => ({ ...a }))
    // Сбросить достижения
    const resetAch = DEFAULT_ACHIEVEMENTS.map(a => ({ ...a }))
    setActivities(resetActivities)
    setCounterValue(0)
    setTotalBP(0)
    saveCurrentFarmData(0, false, false, resetActivities, 0)
  }

  // Сброс только достижений (и вычитание BP за них из общего BP)
  const resetAchievements = async () => {
    // Просто сбрасываем достижения без влияния на общий totalBP
    setAchievements(DEFAULT_ACHIEVEMENTS.map(a => ({ ...a })))
    setAchievementsBP(0)
    saveAchievementsData(DEFAULT_ACHIEVEMENTS.map(a => ({ ...a })), 0)
  }

  const toggleActivityExpansion = (index: number) => {
    setExpandedActivity(expandedActivity === index ? null : index)
  }

  // Логика для увеличения/уменьшения/завершения достижений
  const increaseAchievement = (index: number) => {
    setAchievements((prev) => {
      const newAchievements = prev.map((ach, i) => {
        if (i === index) {
          if (ach.maxCount === 0) return ach; // Для одноразовых достижений ничего не делаем
          if (ach.currentCount < ach.maxCount && !ach.isCompleted) {
            const newCount = ach.currentCount + 1
            const updatedAch = { ...ach, currentCount: newCount }
            if (newCount === ach.maxCount && ach.maxCount > 0) {
              // Для достижений множители НЕ применяются - используем baseBP как есть
              setAchievementsBP((prevBP) => {
                const updatedBP = prevBP + ach.baseBP
                saveAchievementsData(newAchievements, updatedBP)
                return updatedBP
              })
              // НЕ добавляем BP в общий totalBP - только в achievementsBP
              updatedAch.isCompleted = true
            }
            return updatedAch
          }
        }
        return ach
      })
      saveAchievementsData(newAchievements, achievementsBP + (newAchievements[index]?.isCompleted && !prev[index]?.isCompleted ? newAchievements[index].baseBP : 0))
      return newAchievements
    })
  }
  const decreaseAchievement = (index: number) => {
    setAchievements((prev) => {
      const newAchievements = prev.map((ach, i) => {
        if (i === index && ach.currentCount > 0 && !ach.isCompleted) {
          return { ...ach, currentCount: ach.currentCount - 1 }
        }
        return ach
      })
      saveAchievementsData(newAchievements, achievementsBP)
      return newAchievements
    })
  }
  const completeAchievement = (index: number) => {
    setAchievements((prev) => {
      const newAchievements = prev.map((ach, i) => {
        if (i === index && !ach.isCompleted && ach.maxCount === 0) {
          // Для достижений множители НЕ применяются - используем baseBP как есть
          setAchievementsBP((prevBP) => {
            const updatedBP = prevBP + ach.baseBP
            saveAchievementsData(newAchievements, updatedBP)
            return updatedBP
          })
          // НЕ добавляем BP в общий totalBP - только в achievementsBP
          return { ...ach, isCompleted: true }
        }
        return ach
      })
      saveAchievementsData(newAchievements, achievementsBP + (newAchievements[index]?.isCompleted && !prev[index]?.isCompleted ? newAchievements[index].baseBP : 0))
      return newAchievements
    })
  }

  

  return (
    <Tabs defaultValue="farm" className="w-full">
      <TabsList className="w-full flex justify-between p-8 bg-gray-1000 rounded-lg ">
        <TabsTrigger value="farm" className="text-lg">Фарм</TabsTrigger>
        <TabsTrigger value="achievements" className="text-lg">Достижения</TabsTrigger>
      </TabsList>
      <TabsContent value="farm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-orange-500">😊</span>
              <h1 className="text-lg font-semibold">Фарм</h1>
            </div>
            <div className="flex items-center gap-2">
            </div>
          </div>

          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-orange-500">😊</span>
              <span className="text-sm transition-all duration-200 ease-out">Получено: {totalBP} BP</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={isX2 ? "default" : "outline"}
                  onClick={() => updateMultiplier("x2")}
                  className={isX2 ? "bg-orange-600 transition-colors" : "transition-colors"}
                >
                  X2 Сервер
                </Button>
                <Button
                  size="sm"
                  variant={isVIP ? "default" : "outline"}
                  onClick={() => updateMultiplier("vip")}
                  className={isVIP ? "bg-yellow-600 transition-colors" : "transition-colors"}
                >
                  VIP GoldPlat
                </Button>
              </div>
              <span className="text-sm text-gray-400">Множитель: x{getMultiplier()}</span>
            </div>
          </div>

          {/* Счётчик */}
          <Card className="bg-gray-800 border-gray-700 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">🔢</span>
                <div>
                  <span className="text-sm font-semibold">Счётчик</span>
                  <p className="text-xs text-gray-400">За каждые 3 часа = +2 BP</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 transition-colors"
                  onClick={() => updateCounter(false)}
                  disabled={counterValue === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{counterValue}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 transition-colors"
                  onClick={() => updateCounter(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <div className="ml-2 text-center">
                  <span className="text-xs text-gray-400">+{Math.floor(counterValue / 3) * 2 * getMultiplier()} BP</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-2">
            {activities.map((activity, index) => {
              const finalBP = activity.baseBP * getMultiplier()

              return (
                <div key={index}>
                  <Card
                    className={`border-gray-700 p-3 cursor-pointer hover:bg-gray-700 transition-colors hover:scale-[1.01] duration-200 ease-out ${
                      activity.isCompleted ? "bg-green-900/20 border-green-700" : "bg-gray-800"
                    }`}
                    onClick={() => toggleActivityExpansion(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-lg flex-shrink-0">{activity.icon}</span>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm break-words">{activity.name}</span>
                          {activity.isCompleted && <span className="text-green-500 text-xs ml-2">✓ Выполнено</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {activity.maxCount > 0 ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                decreaseCount(index)
                              }}
                              disabled={activity.currentCount === 0 || activity.isCompleted}
                            >
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                            <span className="text-sm w-6 text-center text-orange-500">{activity.maxCount}</span>
                            <span className="text-sm w-6 text-center">{activity.currentCount}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation()
                                increaseCount(index)
                              }}
                              disabled={activity.currentCount >= activity.maxCount || activity.isCompleted}
                            >
                              <ChevronUp className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              disabled={activity.isCompleted}
                              onClick={(e) => {
                                e.stopPropagation()
                                // Сразу устанавливаем максимальное значение и выполняем задание
                                setActivities((prev) => {
                                  const newActivities = prev.map((act, i) => {
                                    if (i === index && !act.isCompleted && act.maxCount > 0) {
                                      const finalBP = act.baseBP * getMultiplier()
                                      setTotalBP((prevBP) => {
                                        const updatedBP = prevBP + finalBP
                                        saveCurrentFarmData(updatedBP, isVIP, isX2, newActivities, counterValue)
                                        return updatedBP
                                      })
                                      return { ...act, currentCount: act.maxCount, isCompleted: true }
                                    }
                                    return act
                                  })
                                  saveCurrentFarmData(totalBP, isVIP, isX2, newActivities, counterValue)
                                  return newActivities
                                })
                              }}
                              className={`text-xs w-12 ${
                                activity.isCompleted ? "bg-green-600" : "bg-orange-600 hover:bg-orange-700"
                              }`}
                            >
                              {activity.isCompleted ? "✓" : `+${finalBP}`}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            disabled={activity.isCompleted}
                            onClick={(e) => {
                              e.stopPropagation()
                              completeTaskWithoutLimit(index)
                            }}
                            className={`text-xs w-12 ${
                              activity.isCompleted ? "bg-green-600" : "bg-orange-600 hover:bg-orange-700"
                            }`}
                          >
                            {activity.isCompleted ? "✓" : `+${finalBP}`}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Выпадающее пояснение */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedActivity === index ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <Card className="bg-gray-700 border-gray-600 p-3 mt-1 ml-4">
                      <p className="text-sm text-gray-300 break-words whitespace-pre-wrap leading-relaxed text-center">
                        {activity.description}
                      </p>
                      {activity.maxCount > 0 && (
                        <div className="mt-2 text-xs text-gray-400 text-center">
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6">
            <Button
              onClick={resetAllProgress}
              className="w-full bg-orange-600 hover:bg-orange-700 border border-orange-500 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Сбросить прогресс выполнения заданий
            </Button>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs text-gray-500">ID: {UserStorage.getCurrentUserId().slice(-8)}</span>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="achievements">
        <div className="p-4">
          <div className="flex flex-col mb-4">
            <div className="flex items-center gap-2">
              <span className="text-orange-500">🏆</span>
              <h1 className="text-lg font-semibold">Достижения</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Всего BP:</span>
              <span className="text-yellow-500">{achievementsBP}</span>
            </div>
          </div>
          <div className="space-y-2">
            {achievements.map((ach, index) => {
              return (
                <div key={index}>
                  <Card
                    className={`border-gray-700 p-3 cursor-pointer hover:bg-gray-700 transition-colors hover:scale-[1.01] duration-200 ease-out ${ach.isCompleted ? "bg-green-900/20 border-green-700" : "bg-gray-800"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-lg flex-shrink-0">{ach.icon}</span>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm break-words">{ach.name}</span>
                          {ach.isCompleted && <span className="text-green-500 text-xs ml-2">✓ Выполнено</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {ach.maxCount > 0 ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 transition-colors"
                              onClick={() => decreaseAchievement(index)}
                              disabled={ach.currentCount === 0 || ach.isCompleted}
                            >
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                            <span className="text-sm w-6 text-center text-orange-500">{ach.maxCount}</span>
                            <span className="text-sm w-6 text-center">{ach.currentCount}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 transition-colors"
                              onClick={() => increaseAchievement(index)}
                              disabled={ach.currentCount >= ach.maxCount || ach.isCompleted}
                            >
                              <ChevronUp className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              disabled={ach.isCompleted}
                              onClick={() => {
                                // Сразу устанавливаем максимальное значение и выполняем достижение
                                setAchievements((prev) => {
                                  const newAchievements = prev.map((achievement, i) => {
                                    if (i === index && !achievement.isCompleted && achievement.maxCount > 0) {
                                      setAchievementsBP((prevBP) => {
                                        const updatedBP = prevBP + achievement.baseBP
                                        saveAchievementsData(newAchievements, updatedBP)
                                        return updatedBP
                                      })
                                      return { ...achievement, currentCount: achievement.maxCount, isCompleted: true }
                                    }
                                    return achievement
                                  })
                                  saveAchievementsData(newAchievements, achievementsBP + (newAchievements[index]?.isCompleted && !prev[index]?.isCompleted ? newAchievements[index].baseBP : 0))
                                  return newAchievements
                                })
                              }}
                              className={`text-xs w-12 ${
                                ach.isCompleted ? "bg-green-600" : "bg-orange-600 hover:bg-orange-700"
                              }`}
                            >
                              {ach.isCompleted ? "✓" : `+${ach.baseBP}`}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            disabled={ach.isCompleted}
                            onClick={() => completeAchievement(index)}
                            className={`text-xs w-12 ${ach.isCompleted ? "bg-green-600" : "bg-orange-600 hover:bg-orange-700"}`}
                          >
                            {ach.isCompleted ? "✓" : `+${ach.baseBP}`}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                  <div className="overflow-hidden transition-all duration-300 ease-in-out max-h-32 opacity-100">
                    <Card className="bg-gray-700 border-gray-600 p-3 mt-1 ml-4">
                      <p className="text-sm text-gray-300 break-words whitespace-pre-wrap leading-relaxed text-center">
                        {ach.description}
                      </p>
                      {ach.maxCount > 0 && (
                        <div className="mt-2 text-xs text-gray-400 text-center">
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6">
            <Button
              onClick={resetAchievements}
              className="w-full bg-orange-600 hover:bg-orange-700 border border-orange-500 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Сбросить прогресс достижений
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
