import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PatientForm } from "@/components/patients/PatientForm";
import { PatientList } from "@/components/patients/PatientList";
import { usePatients } from "@/hooks/usePatients";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const { patients, todaysAppointments } = usePatients();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setAddPatientOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
          <PatientList 
            patients={todaysAppointments?.map(app => app.patient!).filter(Boolean)}
            showAppointmentButton={false}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Patients</h2>
          <PatientList 
            patients={patients?.filter(patient => 
              patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              patient.contact.includes(searchQuery)
            )}
          />
        </Card>
      </div>

      <PatientForm 
        open={addPatientOpen}
        onOpenChange={setAddPatientOpen}
      />
    </div>
  );
};

export default Patients;