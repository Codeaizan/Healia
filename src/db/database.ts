import Dexie, { Table } from 'dexie';

export interface Patient {
  id?: number;
  name: string;
  age: number;
  contact: string;
  address: string;
  createdAt: Date;
}

export interface Appointment {
  id?: number;
  patientId: number;
  appointmentDate: string;
  fees: number;
  paymentMethod: 'cash' | 'online';
  createdAt: Date;
}

export interface Prescription {
  id?: number;
  patientId: number;
  medicines: string[];
  date: string;
  notes: string;
}

export interface MedicalRecord {
  id?: number;
  patientId: number;
  scanUrl: string;
  date: string;
  description: string;
}

export interface Medicine {
  id?: number;
  name: string;
  category: string;
  type: string;
  stock: number;
  price: number;
  expiryDate: string;
  createdAt: Date;
}

export interface Bill {
  id?: number;
  patientId: number;
  patientName?: string;
  items: Array<{
    medicineId: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  date: string;
  status: 'Pending' | 'Paid';
}

export class PerfectVisionDB extends Dexie {
  patients!: Table<Patient>;
  appointments!: Table<Appointment>;
  prescriptions!: Table<Prescription>;
  medicalRecords!: Table<MedicalRecord>;
  medicines!: Table<Medicine>;
  bills!: Table<Bill>;

  constructor() {
    super('perfectVisionDB');
    this.version(2).stores({
      patients: '++id, name, age, contact, address, createdAt',
      appointments: '++id, patientId, appointmentDate, fees, paymentMethod, createdAt',
      prescriptions: '++id, patientId, date',
      medicalRecords: '++id, patientId, date',
      medicines: '++id, name, category, type, stock, price, expiryDate, createdAt',
      bills: '++id, patientId, date, total, status'
    });
  }
}

export const db = new PerfectVisionDB();