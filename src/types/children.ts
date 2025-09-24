import { Base } from "@/types";

export interface Children extends Base {
  name: string;
  surname: string;
  birthDate: Date;
  classroomId: string;
  guardiansIds: string[];
}
