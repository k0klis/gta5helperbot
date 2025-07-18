"use client"

import { Button } from "@/components/ui/button"
import { Clock, Utensils, BookOpen } from "lucide-react"
import { startTransition, useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "farm", label: "Фарм", icon: Clock },
    { id: "timers", label: "Таймеры", icon: Clock },
    { id: "cooking", label: "Кулинария", icon: Utensils },
    { id: "guides", label: "Гайды", icon: BookOpen },
  ]

  // Состояния для ширины и горизонтальной позиции индикатора
  const [indicatorWidth, setIndicatorWidth] = useState(0)
  const [indicatorX, setIndicatorX] = useState(0)

  // Массив рефов для каждой кнопки вкладки
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Константы для отступов индикатора от краев кнопки
  const INDICATOR_HORIZONTAL_PADDING = 32
  const INDICATOR_VERTICAL_PADDING = 8
  const INDICATOR_BORDER_RADIUS = "0.75rem"

  useEffect(() => {
    const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
    const activeTabButton = tabRefs.current[activeTabIndex]

    if (activeTabButton) {
      const buttonWidth = activeTabButton.offsetWidth
      const newWidth = Math.max(0, buttonWidth - INDICATOR_HORIZONTAL_PADDING)
      const newX = activeTabButton.offsetLeft + (buttonWidth - newWidth) / 2

      setIndicatorWidth(newWidth)
      setIndicatorX(newX)
    }
  }, [activeTab])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700">
      <div className="flex relative h-16 items-center justify-around">
        {/* Единый анимируемый индикатор */}
        <motion.span
          className="absolute bg-orange-600 z-0"
          style={{
            borderRadius: INDICATOR_BORDER_RADIUS,
            height: `calc(100% - ${INDICATOR_VERTICAL_PADDING * 2}px)`,
            top: `${INDICATOR_VERTICAL_PADDING}px`,
            left: 0,
          }}
          initial={false}
          animate={{ width: indicatorWidth, x: indicatorX }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <Button
              key={tab.id}
              ref={(el) => (tabRefs.current[index] = el)}
              variant="ghost"
              // Добавлен hover:bg-transparent для удаления эффекта наведения
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 h-auto rounded-none relative z-10 hover:bg-transparent`}
              onClick={() => startTransition(() => onTabChange(tab.id))}
            >
              {/* Контент (иконка и текст) с анимацией цвета */}
              <motion.div
                className="flex flex-col items-center gap-1"
                animate={{ color: isActive ? "#000000" : "#9ca3af" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </motion.div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
