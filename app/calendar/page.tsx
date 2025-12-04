"use client"

import { useState } from "react"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import { useData } from "@/contexts/data-context"
import { formatDate } from "@/lib/utils/date-helpers"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Onboarding } from "@/api/api-backend"
import esLocale from "@fullcalendar/core/locales/es"

export default function CalendarPage() {
  const { onboardings } = useData()
  const [selectedOnboarding, setSelectedOnboarding] = useState<Onboarding | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const events = onboardings.map((onboarding) => ({
    title: onboarding.name,
    start: onboarding.start_date,
    end: onboarding.end_date,
    backgroundColor: onboarding.color,
    borderColor: onboarding.color,
    extendedProps: {
      onboarding,
    },
  }))

  const handleEventClick = (info: any) => {
    setSelectedOnboarding(info.event.extendedProps.onboarding)
    setIsModalOpen(true)
  }

  return (
    <LayoutWithSidebar>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendario de Onboardings</h1>
          <p className="text-muted-foreground mt-1">Visualiza todos los eventos programados</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridYear",
                }}
                events={events}
                eventClick={handleEventClick}
                height="auto"
                locale={esLocale}
                buttonText={{
                  today: "Hoy",
                  month: "Mes",
                  year: "Año",
                }}
                views={{
                  dayGridYear: {
                    type: "dayGrid",
                    duration: { years: 1 },
                    buttonText: "Año",
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedOnboarding && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalle del Onboarding</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                  style={{ backgroundColor: selectedOnboarding.color }}
                >
                  {selectedOnboarding.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">{selectedOnboarding.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedOnboarding.description}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <span className="font-medium text-foreground">{selectedOnboarding.onboarding_type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de Inicio:</span>
                  <span className="font-medium text-foreground">{formatDate(selectedOnboarding.start_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de Fin:</span>
                  <span className="font-medium text-foreground">{formatDate(selectedOnboarding.end_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Color:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-border"
                      style={{ backgroundColor: selectedOnboarding.color }}
                    />
                    <span className="font-mono text-sm">{selectedOnboarding.color}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <style jsx global>{`
        .calendar-container {
          --fc-border-color: hsl(var(--border));
          --fc-button-bg-color: #003DA5;
          --fc-button-border-color: #003DA5;
          --fc-button-hover-bg-color: #0052CC;
          --fc-button-hover-border-color: #0052CC;
          --fc-button-active-bg-color: #002D7A;
          --fc-button-active-border-color: #002D7A;
          --fc-today-bg-color: hsl(var(--accent));
        }

        .calendar-container .fc {
          color: hsl(var(--foreground));
        }

        .calendar-container .fc-theme-standard td,
        .calendar-container .fc-theme-standard th {
          border-color: hsl(var(--border));
        }

        .calendar-container .fc-col-header-cell {
          background-color: hsl(var(--muted));
          font-weight: 600;
        }

        .calendar-container .fc-daygrid-day-number {
          color: hsl(var(--foreground));
          padding: 8px;
        }

        .calendar-container .fc-event {
          cursor: pointer;
          border-radius: 4px;
          padding: 2px 4px;
          margin: 1px 0;
        }

        .calendar-container .fc-event:hover {
          opacity: 0.85;
        }

        .calendar-container .fc-button {
          text-transform: capitalize;
          font-weight: 500;
        }

        .calendar-container .fc-toolbar-title {
          text-transform: capitalize;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .dark .calendar-container .fc-col-header-cell {
          background-color: hsl(var(--card));
        }
      `}</style>
    </LayoutWithSidebar>
  )
}
