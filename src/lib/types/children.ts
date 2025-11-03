import { Base } from "@/lib/types";

export interface Children extends Base {
  name: string;
  surname: string;
  birthDate: Date;
  classroomId: string;
  guardiansIds: string[];
}
