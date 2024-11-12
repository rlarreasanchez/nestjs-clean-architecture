import { Todo } from "@prisma/client";

export class PrismaTodoModel implements Todo {
  id: number;
  content: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}
