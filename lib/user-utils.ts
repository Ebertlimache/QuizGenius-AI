import { User } from './types';

export const getStudentsForDocente = (docenteEmail: string): User[] => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.filter((user: User) => 
    user.role === 'estudiante' && user.assignedTo === docenteEmail
  );
};

export const updateProgressForStudent = (email: string, newData: Partial<User['progress']>) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex((u: User) => u.email === email);
  
  if (userIndex !== -1) {
    const user = users[userIndex];
    user.progress = {
      ...user.progress,
      ...newData
    };
    users[userIndex] = user;
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const assignStudentToDocente = (studentEmail: string, docenteEmail: string) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex((u: User) => u.email === studentEmail);
  
  if (userIndex !== -1) {
    users[userIndex].assignedTo = docenteEmail;
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const getDocenteForStudent = (studentEmail: string): User | null => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const student = users.find((u: User) => u.email === studentEmail);
  
  if (student?.assignedTo) {
    return users.find((u: User) => u.email === student.assignedTo) || null;
  }
  
  return null;
};

export const updateMaterialStatus = (
  studentEmail: string, 
  materialId: string, 
  status: 'pending' | 'approved' | 'rejected',
  feedback?: string
) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex((u: User) => u.email === studentEmail);
  
  if (userIndex !== -1 && users[userIndex].progress?.uploadedMaterials) {
    const materialIndex = users[userIndex].progress!.uploadedMaterials.findIndex(
      m => m.id === materialId
    );
    
    if (materialIndex !== -1) {
      users[userIndex].progress!.uploadedMaterials[materialIndex].status = status;
      if (feedback) {
        users[userIndex].progress!.uploadedMaterials[materialIndex].feedback = feedback;
      }
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
}; 