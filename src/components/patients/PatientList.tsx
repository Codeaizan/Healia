import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AppointmentForm } from "./AppointmentForm";
import { Patient } from "@/db/database";

export const PatientList = ({ patients, showAppointmentButton = true }: { patients: Patient[] | undefined, showAppointmentButton?: boolean }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);

  if (!patients) return null;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Contact</TableHead>
            {showAppointmentButton && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.contact}</TableCell>
              {showAppointmentButton && (
                <TableCell>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedPatient(patient);
                      setAppointmentDialogOpen(true);
                    }}
                  >
                    Add Appointment
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedPatient && (
        <AppointmentForm
          patient={selectedPatient}
          open={appointmentDialogOpen}
          onOpenChange={setAppointmentDialogOpen}
        />
      )}
    </>
  );
};