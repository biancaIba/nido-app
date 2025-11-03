import { Base } from "@/lib/types";

export interface User extends Base {
  name: string;
  surname: string;
  email: string;
  role: Role;
}

interface Role {
  id: string;
  name: "teacher" | "student" | "family" | "admin";
}
