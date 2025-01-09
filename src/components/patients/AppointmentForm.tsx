import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usePatients } from "@/hooks/usePatients";
import { Patient } from "@/db/database";
import { startOfDay, isBefore } from "date-fns";

interface AppointmentFormData {
  appointmentDate: string;
  fees: number;
  paymentMethod: 'cash' | 'online';
}

export const AppointmentForm = ({ 
  patient,
  open,
  onOpenChange 
}: { 
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const form = useForm<AppointmentFormData>({
    defaultValues: {
      appointmentDate: new Date().toISOString().split('T')[0],
      fees: 0,
      paymentMethod: 'cash'
    }
  });
  const { addAppointment } = usePatients();

  const onSubmit = async (data: AppointmentFormData) => {
    const appointmentDate = new Date(data.appointmentDate);
    const today = startOfDay(new Date());

    if (isBefore(appointmentDate, today)) {
      toast.error("Cannot book appointments for past dates");
      return;
    }

    try {
      await addAppointment({
        patientId: patient.id!,
        ...data
      });
      toast.success("Appointment added successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add appointment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Appointment for {patient.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fees</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <select 
                      {...field} 
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Add Appointment</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};