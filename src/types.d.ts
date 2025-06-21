export type UserRole = "SUPER_ADMIN" | "ADMIN" | "UNIT_MANAGER" | "USER";

export interface User_Tyeps {
  readonly userId: string;
  readonly Id: string;
  name: string;
  email: string;
  role: UserRole;
  createdBy: string;
  TimeZone: string;
  createdAt?: Date;
  updatedAt?: Date;
  groupId?: string;
}
export interface InitialState_types {
user:User_Tyeps|null;
  users: User[];
  loading: boolean;
  error: string | null;
}


export interface UserLogin_types{
    email:string;
    password:string;
    timezone:string
}

   export interface ErrorPayload {
  message: string;
  status?: number;

}