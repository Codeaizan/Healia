import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/db/database";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export const PrintBillsDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const generateBillsPDF = async () => {
    try {
      const bills = await db.bills
        .where('date')
        .between(dateRange.start, dateRange.end)
        .toArray();

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Add header
      doc.addImage("/assets/images.jpg", "JPG", 10, 10, 30, 30);
      doc.setFontSize(22);
      doc.text("Healia - Bills Report", pageWidth/2, 25, { align: "center" });
      doc.setFontSize(12);
      doc.text(`Date Range: ${dateRange.start} to ${dateRange.end}`, pageWidth/2, 35, { align: "center" });

      let y = 50;
      for (const bill of bills) {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        const patient = await db.patients.get(bill.patientId);
        
        doc.setFontSize(14);
        doc.text(`Bill No: BILL-${String(bill.id).padStart(3, '0')}`, 15, y);
        doc.setFontSize(12);
        doc.text(`Patient: ${patient?.name}`, 15, y + 10);
        doc.text(`Contact: ${patient?.contact}`, 15, y + 20);
        doc.text(`Date: ${new Date(bill.date).toLocaleDateString()}`, 15, y + 30);
        
        // Items
        y += 45;
        bill.items.forEach((item, index) => {
          doc.text(`${index + 1}. ${item.name} - ${item.quantity} x ₹${item.price}`, 25, y);
          y += 10;
        });
        
        // Total centered
        doc.text(`Total Amount: ₹${bill.total}`, pageWidth/2, y + 10, { align: "center" });
        y += 30;
      }

      doc.save('bills-report.pdf');
      onOpenChange(false);
      toast.success("Bills report generated successfully");
    } catch (error) {
      toast.error("Failed to generate bills report");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Print Bills Report</DialogTitle>
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
          <Button onClick={generateBillsPDF} className="w-full">Generate Report</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};