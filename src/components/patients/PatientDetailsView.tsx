import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus } from "lucide-react";
import { Patient } from "@/db/database";
import { usePatients } from "@/hooks/usePatients";
import { format } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/database";

interface PatientDetailsViewProps {
  patient: Patient;
  onBack: () => void;
}

export const PatientDetailsView = ({ patient, onBack }: PatientDetailsViewProps) => {
  const { addPrescription, addMedicalRecord, getPatientAppointments, getPatientPrescriptions, getPatientMedicalRecords } = usePatients();
  const [newMedicine, setNewMedicine] = useState("");
  const [newScan, setNewScan] = useState({ file: null as File | null, description: "" });

  const appointments = getPatientAppointments(patient.id!);
  const prescriptions = getPatientPrescriptions(patient.id!);
  const medicalRecords = getPatientMedicalRecords(patient.id!);
  
  const purchasedMedicines = useLiveQuery(
    async () => {
      const bills = await db.bills
        .where('patientId')
        .equals(patient.id!)
        .toArray();
      
      return bills.flatMap(bill => bill.items);
    },
    [patient.id]
  );

  const handleAddPrescription = async () => {
    if (newMedicine.trim()) {
      await addPrescription({
        patientId: patient.id!,
        medicines: [newMedicine],
        date: new Date().toISOString().split('T')[0],
        notes: ""
      });
      setNewMedicine("");
    }
  };

  const handleAddScan = async () => {
    if (newScan.file && newScan.description) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await addMedicalRecord({
          patientId: patient.id!,
          scanUrl: reader.result as string,
          date: new Date().toISOString().split('T')[0],
          description: newScan.description
        });
        setNewScan({ file: null, description: "" });
      };
      reader.readAsDataURL(newScan.file);
    }
  };

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {patient.name}</p>
            <p><span className="font-medium">Age:</span> {patient.age}</p>
            <p><span className="font-medium">Contact:</span> {patient.contact}</p>
            <p><span className="font-medium">Address:</span> {patient.address}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Appointment History</h2>
          <div className="space-y-4">
            {appointments?.map((appointment) => (
              <div key={appointment.id} className="p-3 border rounded-lg">
                <p className="font-medium">
                  {format(new Date(appointment.appointmentDate), 'PPP')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Fees: ₹{appointment.fees} | Payment: {appointment.paymentMethod}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Prescribed Medicines</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add new medicine..."
                value={newMedicine}
                onChange={(e) => setNewMedicine(e.target.value)}
              />
              <Button onClick={handleAddPrescription}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {prescriptions?.map((prescription) => (
              <div key={prescription.id} className="p-3 border rounded-lg">
                <p className="font-medium">{format(new Date(prescription.date), 'PPP')}</p>
                <ul className="list-disc list-inside">
                  {prescription.medicines.map((medicine, index) => (
                    <li key={index} className="text-sm">{medicine}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Medical Records & Scans</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewScan({ ...newScan, file: e.target.files?.[0] || null })}
              />
              <Textarea
                placeholder="Scan description..."
                value={newScan.description}
                onChange={(e) => setNewScan({ ...newScan, description: e.target.value })}
              />
              <Button onClick={handleAddScan} className="w-full">
                Add Scan
              </Button>
            </div>
            {medicalRecords?.map((record) => (
              <div key={record.id} className="p-3 border rounded-lg">
                <p className="font-medium">{format(new Date(record.date), 'PPP')}</p>
                <p className="text-sm mb-2">{record.description}</p>
                <img src={record.scanUrl} alt="Medical scan" className="w-full rounded-lg" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Purchased Medicines</h2>
          <div className="space-y-4">
            {purchasedMedicines && purchasedMedicines.length > 0 ? (
              purchasedMedicines.map((medicine, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="font-medium">{medicine.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {medicine.quantity} | Price: ₹{medicine.price}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No purchases recorded yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
