import * as http from "http";

/**
 * Route definition for the proxy router
 */
export interface RouteDefinition {
  pattern: RegExp;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  handler: string; // Handler name to map to actual function
  description: string;
}

/**
 * Declarative route table for the HChat Proxy
 * Routes are matched in order - first match wins
 */
export const routeTable: RouteDefinition[] = [
  // Status/Health
  {
    pattern: /^\/(v1\/?)?$/,
    method: "GET",
    handler: "status",
    description: "Status page",
  },

  // Unified OpenAI Compatible
  {
    pattern: /\/v1\/chat\/completions$/,
    method: "POST",
    handler: "openai",
    description: "OpenAI Chat Completions (Unified)",
  },

  // Native Anthropic
  {
    pattern: /\/(v1\/)?messages$/,
    method: "POST",
    handler: "anthropic",
    description: "Native Anthropic Messages",
  },

  // Native Google
  {
    pattern: /\/v1beta\/models\/.+/,
    method: "POST",
    handler: "google",
    description: "Native Google Gemini",
  },

  // Models List
  {
    pattern: /\/v1\/models$/,
    method: "GET",
    handler: "models",
    description: "List Models",
  },

  // Embeddings
  {
    pattern: /\/v1\/embeddings$/,
    method: "POST",
    handler: "embeddings",
    description: "OpenAI Embeddings",
  },
];

/**
 * Match a URL against the route table
 */
export function matchRoute(
  url: string,
  method: string
): RouteDefinition | undefined {
  return routeTable.find(
    (route) => route.pattern.test(url) && route.method === method
  );
}
