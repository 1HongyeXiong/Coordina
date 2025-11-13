export interface User {
  name: string;
  userEmail: string;
  userName: string;
  numEvents: string;
  role: UserRole;
}

enum UserRole {
  ORGANIZER = "organizer",
  PARTICIPANT = "participant"
}

export { UserRole };