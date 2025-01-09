import { Card } from "@/components/ui/card";
import { Users, Pill, Receipt, AlertTriangle } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { usePatients } from "@/hooks/usePatients";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/database";
import { format, addMonths, isBefore } from "date-fns";
import { CalendarView } from "@/components/appointments/CalendarView";

const Index = () => {
  const { patients, todaysAppointments } = usePatients();
  
  const appointmentStats = useLiveQuery(async () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return format(d, 'EEE');
    }).reverse();

    const stats = await Promise.all(
      last7Days.map(async (day) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - last7Days.indexOf(day)));
        const dateStr = date.toISOString().split('T')[0];
        
        const count = await db.appointments
          .where('appointmentDate')
          .equals(dateStr)
          .count();

        return { name: day, patients: count };
      })
    );

    return stats;
  }, []);

  const todayRevenue = useLiveQuery(async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const appointmentFees = todaysAppointments?.reduce((sum, app) => {
      const fees = typeof app.fees === 'string' ? parseFloat(app.fees) : app.fees;
      return sum + (isNaN(fees) ? 0 : fees);
    }, 0) || 0;
    
    const bills = await db.bills
      .where('date')
      .startsWith(today)
      .toArray();
    
    const billsTotal = bills.reduce((sum, bill) => {
      const total = typeof bill.total === 'string' ? parseFloat(bill.total) : bill.total;
      return sum + (isNaN(total) ? 0 : total);
    }, 0);
    
    return appointmentFees + billsTotal;
  }, [todaysAppointments]);

  const alertMedicines = useLiveQuery(async () => {
    const allMedicines = await db.medicines.toArray();
    const oneMonthFromNow = addMonths(new Date(), 1);
    
    return allMedicines.filter(medicine => 
      medicine.stock < 10 || 
      isBefore(new Date(medicine.expiryDate), oneMonthFromNow)
    );
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary">
          Clinic Dashboard
        </h1>
        <p className="text-secondary-foreground mt-2">Welcome back, Dr.XYZ</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Patients</p>
              <h2 className="text-2xl font-bold mt-2">{patients?.length || 0}</h2>
            </div>
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </Card>

        <Card className="p-6 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Appointments</p>
              <h2 className="text-2xl font-bold mt-2">{todaysAppointments?.length || 0}</h2>
            </div>
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
              <Pill className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </Card>

        <Card className="p-6 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Revenue</p>
              <h2 className="text-2xl font-bold mt-2">₹{todayRevenue || 0}</h2>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full dark:bg-yellow-900">
              <Receipt className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
            </div>
          </div>
        </Card>

        <Card className="p-6 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stock Alerts</p>
              <h2 className="text-2xl font-bold mt-2">{alertMedicines?.length || 0}</h2>
            </div>
            <div className="p-3 bg-red-100 rounded-full dark:bg-red-900">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Patient Visits Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentStats || []}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  stroke="currentColor" 
                  className="text-sm opacity-70"
                />
                <YAxis 
                  stroke="currentColor" 
                  className="text-sm opacity-70"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Stock Alerts</h3>
          <div className="space-y-4">
            {alertMedicines?.map((medicine) => (
              <div 
                key={medicine.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{medicine.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {medicine.stock < 10 && `Low stock: ${medicine.stock}`}
                    {medicine.stock < 10 && isBefore(new Date(medicine.expiryDate), addMonths(new Date(), 1)) && ' | '}
                    {isBefore(new Date(medicine.expiryDate), addMonths(new Date(), 1)) && 
                      `Expires: ${format(new Date(medicine.expiryDate), 'PP')}`}
                  </p>
                </div>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            ))}
            {(!alertMedicines || alertMedicines.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No alerts</p>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Appointments Calendar</h2>
        <CalendarView />
      </div>
    </div>
  );
};

export default Index;
