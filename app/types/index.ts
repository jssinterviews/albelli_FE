interface INotification {
  type: "error" | "success" | "info";
  message: string;
}

export type { INotification };
