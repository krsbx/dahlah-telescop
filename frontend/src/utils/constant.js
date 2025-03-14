export const OCCUPATION = [
  {
    value: 'researcher',
    title: 'Peneliti Luar/Dalam Negeri',
  },
  {
    value: 'itera_lector',
    title: 'Dosen ITERA',
  },
  {
    value: 'laboratory',
    title: 'Laboran ITERA',
  },
  {
    value: 'student_research',
    title: 'Mahasiswa TA/KP',
  },
  {
    value: 'student_practice',
    title: 'Mahasiswa Praktikum',
  },
  {
    value: 'student',
    title: 'Mahasiswa ITERA',
  },
  {
    value: 'other',
    title: 'Mahasiswa lainnya & umum',
  },
];

export const OBSERVATION_OBJECT = [
  {
    value: 'transient_object',
    title: 'Transient Objek (Supernova, Nova, Okultassi, BKTS Aneh',
  },
  {
    value: 'routine_observation',
    title:
      'Pengamatan Rutin (Program OAIL, Hilal, Bintang Variabel, Eksoplanet)',
  },
  {
    value: 'etc',
    title: 'Lain-lain (Plaet, Nebula, dan lainnya)',
  },
];

export const TELESCOPE_TYPE = [
  {
    value: 'IRT',
    title: 'IRT (ITERA Robotic Telescope)',
  },
  {
    value: 'OZT-ALTS',
    title: 'OZT-ALTS (Ofyar Z Tamin - Astelco Lunar Telescope System)',
  },
];

export const FILE_EXTENSION = {
  PDF: 'pdf',
  DOC: 'doc',
  DOCX: 'docx',
};

export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
};

export const USER_ROLES = [
  {
    value: 'user',
    title: 'User',
  },
  {
    value: 'admin',
    title: 'Admin',
  },
];

export const BORROWING_STATUS = {
  PENDING: 'pending', // IN REVIEW
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const BORROWING_STATUSES = [
  {
    value: 'pending',
    title: 'Pending',
  }, // IN REVIEW
  {
    value: 'approved',
    title: 'Approved',
  },
  {
    value: 'rejected',
    title: 'Rejected',
  },
  {
    value: 'cancelled',
    title: 'Cancelled',
  },
];
