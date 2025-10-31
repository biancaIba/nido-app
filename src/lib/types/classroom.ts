import { Base } from "@/lib/types";

export interface Classroom extends Base {
  name: string;
  teacherIds: string[];
  year: number;
}
