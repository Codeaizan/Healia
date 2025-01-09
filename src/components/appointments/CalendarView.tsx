import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { usePatients } from "@/hooks/usePatients";
import { format } from "date-fns";

export const CalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { getAppointmentsForDate } = usePatients();
  const appointments = getAppointmentsForDate(date);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Card className="p-4 flex-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>
        <Card className="p-4 flex-1">
          <h3 className="font-semibold mb-4">
            Appointments for {date ? format(date, 'PP') : 'Selected Date'}
          </h3>
          <div className="space-y-2">
            {appointments?.map((appointment) => (
              <div
                key={appointment.id}
                className="p-3 bg-hsl(var(--background)) rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{appointment.patient?.name}</p>
                  {/* <p className="text-sm text-muted-foreground">
                    {format(new Date(appointment.appointmentDate), 'p')}
                  </p> */}
                </div>
                <span className="text-sm">₹{appointment.fees}</span>
              </div>
            ))}
            {(!appointments || appointments.length === 0) && (
              <p className="text-muted-foreground text-center py-4">
                No appointments for this date
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};