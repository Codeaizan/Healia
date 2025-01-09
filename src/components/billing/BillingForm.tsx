import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "@/db/database";
import { toast } from "sonner";
import { Patient } from "@/db/database";
import { PatientSearch } from "@/components/billing/PatientSearch";
import { MedicineSelection } from "@/components/billing/MedicineSelection";
import { jsPDF } from "jspdf";
import { useLiveQuery } from "dexie-react-hooks";

interface BillFormData {
  patientId: number;
  items: Array<{
    medicineId: number;
    quantity: number;
    price: number;
  }>;
}

interface BillingFormProps {
  onSuccess: () => void;
}

export const BillingForm = ({ onSuccess }: BillingFormProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<Array<{
    medicineId: number;
    name: string;
    quantity: number;
    price: number;
  }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BillFormData>();
  const medicines = useLiveQuery(() => db.medicines.toArray());
  const [searchResults, setSearchResults] = useState<Patient[]>([]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await db.patients
        .filter(patient => 
          patient.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .toArray();
      setSearchResults(results);
    }
  };

  const handleAddMedicine = (medicineId: number, name: string, price: number) => {
    const existingMedicine = selectedMedicines.find(m => m.medicineId === medicineId);
    if (!existingMedicine) {
      setSelectedMedicines(prev => [
        ...prev,
        { medicineId, name, quantity: 1, price }
      ]);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setSelectedMedicines(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, quantity } : item
      )
    );
  };

  const generatePDF = (billData: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add logo - make sure the path is correct
    doc.addImage("/assets/images.jpg", "JPG", 10, 10, 30, 30);
    
    // Add header text
    doc.setFontSize(22);
    doc.text("Healia", pageWidth/2, 25, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("Dr.XYZ", pageWidth/2, 35, { align: "center" });
    
    // Add bill details
    doc.setFontSize(12);
    doc.text(`Bill No: BILL-${String(billData.id).padStart(3, '0')}`, 15, 50);
    doc.text(`Patient: ${billData.patientName}`, 15, 60);
    doc.text(`Date: ${new Date(billData.date).toLocaleDateString()}`, 15, 70);
    
    // Add table headers
    doc.text("Medicine", 15, 90);
    doc.text("Quantity", 90, 90);
    doc.text("Price", 130, 90);
    doc.text("Total", 170, 90);
    
    // Add items
    let y = 100;
    billData.items.forEach((item: any) => {
      doc.text(item.name, 15, y);
      doc.text(item.quantity.toString(), 90, y);
      doc.text(`₹${item.price}`, 130, y);
      doc.text(`₹${item.price * item.quantity}`, 170, y);
      y += 10;
    });
    
    // Add centered total
    doc.text(`Total Amount: ₹${billData.total}`, pageWidth/2, y + 20, { align: "center" });
    
    // Save the PDF
    doc.save(`bill-${billData.id}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }
    if (selectedMedicines.length === 0) {
      toast.error("Please add at least one medicine");
      return;
    }

    try {
      setIsSubmitting(true);
      const total = selectedMedicines.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      const billId = await db.bills.add({
        patientId: selectedPatient.id!,
        patientName: selectedPatient.name,
        items: selectedMedicines,
        total,
        date: new Date().toISOString(),
        status: "Pending"
      });

      // Update medicine stock and add to patient's purchased medicines
      for (const item of selectedMedicines) {
        const medicine = await db.medicines.get(item.medicineId);
        if (medicine) {
          await db.medicines.update(item.medicineId, {
            stock: medicine.stock - item.quantity
          });
        }
      }

      const newBill = await db.bills.get(billId);
      if (newBill) {
        generatePDF(newBill);
      }

      toast.success("Bill generated successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to generate bill");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PatientSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          searchResults={searchResults}
          onSelectPatient={setSelectedPatient}
          selectedPatient={selectedPatient}
        />

        {selectedPatient && (
          <MedicineSelection
            medicines={medicines}
            selectedMedicines={selectedMedicines}
            onAddMedicine={handleAddMedicine}
            onQuantityChange={handleQuantityChange}
          />
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          Generate Bill
        </Button>
      </form>
    </Form>
  );
};
