import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db/database";

export const BillingTable = () => {
  const bills = useLiveQuery(() => db.bills.toArray());

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bill No</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bills?.map((bill, i) => (
          <TableRow key={i}>
            <TableCell>BILL-{String(bill.id).padStart(3, '0')}</TableCell>
            <TableCell>{bill.patientName}</TableCell>
            <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
            <TableCell>₹{bill.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};