export {};

declare global {
  interface WatchInfo {
    platform: "aplite" | "basalt" | "chalk" | "diorite" | "emery";
    model: string; // TODO: maybe we can make this a type union? would need to find all the models
    language: string;
    firmware: {
      major: number;
      minor: number;
      patch: number;
      suffix: string;
    };
  }
}
