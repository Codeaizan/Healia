import { useLiveQuery } from 'dexie-react-hooks';
import { db, Patient, Appointment, Prescription, MedicalRecord } from '../db/database';
import { startOfDay, endOfDay, format } from 'date-fns';

export function usePatients() {
  const patients = useLiveQuery(() => db.patients.toArray());
  const todaysAppointments = useLiveQuery(async () => {
    const today = new Date().toISOString().split('T')[0];
    const appointments = await db.appointments
      .where('appointmentDate')
      .equals(today)
      .toArray();

    const patientIds = appointments.map(app => app.patientId);
    const patientsWithAppointments = await db.patients
      .where('id')
      .anyOf(patientIds)
      .toArray();

    return appointments.map(app => ({
      ...app,
      patient: patientsWithAppointments.find(p => p.id === app.patientId)
    }));
  });

  const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    return await db.patients.add({
      ...patientData,
      createdAt: new Date()
    });
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    return await db.appointments.add({
      ...appointmentData,
      createdAt: new Date()
    });
  };

  const addPrescription = async (prescriptionData: Omit<Prescription, 'id'>) => {
    return await db.prescriptions.add(prescriptionData);
  };

  const addMedicalRecord = async (recordData: Omit<MedicalRecord, 'id'>) => {
    return await db.medicalRecords.add(recordData);
  };

  const searchPatients = async (query: string) => {
    if (!query) return [];
    return await db.patients
      .filter(patient => 
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.contact.includes(query)
      )
      .toArray();
  };

  const getPatientAppointments = (patientId: number) => {
    return useLiveQuery(
      () => db.appointments
        .where('patientId')
        .equals(patientId)
        .reverse()
        .toArray()
    );
  };

  const getPatientPrescriptions = (patientId: number) => {
    return useLiveQuery(
      () => db.prescriptions
        .where('patientId')
        .equals(patientId)
        .reverse()
        .toArray()
    );
  };

  const getPatientMedicalRecords = (patientId: number) => {
    return useLiveQuery(
      () => db.medicalRecords
        .where('patientId')
        .equals(patientId)
        .reverse()
        .toArray()
    );
  };

  const getAppointmentsForDate = (date?: Date) => {
    return useLiveQuery(async () => {
      if (!date) return [];
      
      const start = startOfDay(date).toISOString();
      const end = endOfDay(date).toISOString();
      
      const appointments = await db.appointments
        .where('appointmentDate')
        .between(start, end)
        .toArray();

      const patientIds = appointments.map(app => app.patientId);
      const patients = await db.patients
        .where('id')
        .anyOf(patientIds)
        .toArray();

      return appointments.map(app => ({
        ...app,
        patient: patients.find(p => p.id === app.patientId)
      }));
    }, [date]);
  };

  return {
    patients,
    todaysAppointments,
    addPatient,
    addAppointment,
    addPrescription,
    addMedicalRecord,
    searchPatients,
    getPatientAppointments,
    getPatientPrescriptions,
    getPatientMedicalRecords,
    getAppointmentsForDate,
  };
}
