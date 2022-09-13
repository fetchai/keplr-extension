declare namespace NodeJS {
  interface ProcessEnv {
    /** node environment */
    NODE_ENV: "production" | "development" | undefined;
    USER_ENV: "1" | "2" | undefined;
  }
}
