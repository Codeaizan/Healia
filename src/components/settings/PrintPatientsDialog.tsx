import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/db/database";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export const PrintPatientsDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const generatePatientsPDF = async () => {
    try {
      const patients = await db.patients
        .where('createdAt')
        .between(new Date(dateRange.start), new Date(dateRange.end))
        .toArray();

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Add header
      doc.addImage("/assets/images.jpg", "JPG", 10, 10, 30, 30);
      doc.setFontSize(22);
      doc.text("Healia - Patient Details Report", pageWidth/2, 25, { align: "center" });
      doc.setFontSize(12);
      doc.text(`Date Range: ${dateRange.start} to ${dateRange.end}`, pageWidth/2, 35, { align: "center" });

      let y = 50;
      for (const patient of patients) {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        // Basic Info
        doc.setFontSize(14);
        doc.text(`Patient: ${patient.name}`, 15, y);
        doc.setFontSize(12);
        doc.text(`Age: ${patient.age}`, 15, y + 10);
        doc.text(`Contact: ${patient.contact}`, 15, y + 20);
        doc.text(`Address: ${patient.address}`, 15, y + 30);
        
        // Appointments
        const appointments = await db.appointments
          .where('patientId')
          .equals(patient.id!)
          .toArray();

        if (appointments.length > 0) {
          y += 45;
          doc.text("Appointments:", 15, y);
          appointments.forEach((appointment, index) => {
            doc.text(`${index + 1}. Date: ${new Date(appointment.appointmentDate).toLocaleDateString()} - Fees: ₹${appointment.fees}`, 25, y + 10 + (index * 10));
          });
          y += 10 + (appointments.length * 10);
        }
        
        // Prescriptions
        const prescriptions = await db.prescriptions
          .where('patientId')
          .equals(patient.id!)
          .toArray();

        if (prescriptions.length > 0) {
          y += 15;
          doc.text("Prescriptions:", 15, y);
          prescriptions.forEach((prescription, index) => {
            doc.text(`${index + 1}. Date: ${new Date(prescription.date).toLocaleDateString()}`, 25, y + 10 + (index * 20));
            doc.text(`   Medicines: ${prescription.medicines.join(", ")}`, 25, y + 20 + (index * 20));
          });
          y += 20 + (prescriptions.length * 20);
        }

        // Medical Records
        const records = await db.medicalRecords
          .where('patientId')
          .equals(patient.id!)
          .toArray();

        if (records.length > 0) {
          y += 15;
          doc.text("Medical Records:", 15, y);
          records.forEach((record, index) => {
            doc.text(`${index + 1}. Date: ${new Date(record.date).toLocaleDateString()}`, 25, y + 10 + (index * 20));
            doc.text(`   Description: ${record.description}`, 25, y + 20 + (index * 20));
          });
          y += 20 + (records.length * 20);
        }

        // Purchased Medicines
        const bills = await db.bills
          .where('patientId')
          .equals(patient.id!)
          .toArray();

        if (bills.length > 0) {
          y += 15;
          doc.text("Purchased Medicines:", 15, y);
          bills.forEach((bill, billIndex) => {
            bill.items.forEach((item, itemIndex) => {
              doc.text(`${billIndex + 1}.${itemIndex + 1}. ${item.name} - Qty: ${item.quantity}, Price: ₹${item.price}`, 25, y + 10 + ((billIndex * bill.items.length + itemIndex) * 10));
            });
          });
        }

        y += 60; // Space for next patient
      }

      doc.save('patients-report.pdf');
      onOpenChange(false);
      toast.success("Patient details report generated successfully");
    } catch (error) {
      toast.error("Failed to generate patient details report");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Print Patient Details Report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label>Start Date</label>
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label>End Date</label>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
          <Button onClick={generatePatientsPDF} className="w-full">Generate Report</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};