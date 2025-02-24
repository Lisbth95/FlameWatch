export type Notification = {
    id: string;
    type: "motion" | "fire" | "smoke";
    message: string;
    timestamp: string;
}