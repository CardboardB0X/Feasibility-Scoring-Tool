export type UserRole =
  | 'Lead Developer'
  | 'Data / ML Engineer'
  | 'QA & Testing Specialist'
  | 'Frontend / UI Developer'
  | 'Capstone / Thesis Adviser'
  | 'Panel Committee Member'
  | 'General Researcher';

export interface UserRoomRecord {
  roomCode: string;
  groupName: string;
  roleInRoom: string;
  joinedAt: string;
  titleCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  avatarColor: string;
  createdAt: string;
  rooms: UserRoomRecord[];
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarColor: string;
  };
  expiresAt: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export const AVAILABLE_ROLES: UserRole[] = [
  'Lead Developer',
  'Data / ML Engineer',
  'QA & Testing Specialist',
  'Frontend / UI Developer',
  'Capstone / Thesis Adviser',
  'Panel Committee Member',
  'General Researcher'
];
