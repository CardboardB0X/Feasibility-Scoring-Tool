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

export interface GuestSession {
  id: string;
  nickname: string;
  role: string;
  avatarColor: string;
  createdAt: string;
}

// For compatibility across components
export type AuthSession = GuestSession;

export const AVAILABLE_ROLES: UserRole[] = [
  'Lead Developer',
  'Data / ML Engineer',
  'QA & Testing Specialist',
  'Frontend / UI Developer',
  'Capstone / Thesis Adviser',
  'Panel Committee Member',
  'General Researcher'
];
