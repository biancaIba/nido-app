import { Base } from "@/types";

export interface Classroom extends Base {
  name: string;
  teacherIds: string[];
  year: number;
}
