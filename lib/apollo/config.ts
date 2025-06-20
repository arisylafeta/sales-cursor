export const apolloConfig = {
  apiKey: process.env.APOLLO_API_KEY!,
  endpoint: "https://api.apollo.io",
};

export class ApolloError extends Error {
  constructor(
    public status: number,
    public body: string,
    message?: string
  ) {
    super(message);
    this.name = "ApolloError";
  }
} 