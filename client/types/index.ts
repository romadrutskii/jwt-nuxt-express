export interface Notification {
  id?: number;
  type: "error" | "success";
  message: string;
}
