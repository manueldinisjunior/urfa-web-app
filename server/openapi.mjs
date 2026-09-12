const operation = (summary, admin = false) => ({
  summary,
  ...(admin ? { security: [{ adminCookie: [] }] } : {}),
  responses: {
    200: { description: "Success" },
    400: { description: "Validation error" },
    401: { description: "Authentication or private access token required" },
    409: { description: "Availability or state conflict" },
  },
});
export const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Urfa Grill API",
    version: "2.0.0",
    description:
      "JSON API. Mutations require an allowed Origin and X-Urfa-Request: 1. Monetary order values are integer EUR cents. Times are ISO-8601 instants; booking inputs use Europe/Berlin. Customer tracking requires X-Order-Token. Cancellation requires X-Reservation-Token.",
  },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: {
      adminCookie: { type: "apiKey", in: "cookie", name: "urfa_access" },
    },
  },
  paths: {
    "/api/auth/login": {
      post: {
        ...operation("Login; sets HttpOnly access/refresh cookies"),
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/verify": { get: operation("Verify active session", true) },
    "/api/auth/refresh": { post: operation("Rotate refresh token") },
    "/api/auth/logout": { post: operation("Revoke session", true) },
    "/api/products": {
      get: operation("Available public products"),
      post: operation("Create product", true),
    },
    "/api/products/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      get: operation("Product details"),
      put: operation("Replace product", true),
      delete: operation("Soft-delete product with audit", true),
    },
    "/api/orders": {
      get: operation("Filter orders by period, status and q", true),
      post: operation(
        "Create order with server pricing and requestKey idempotency",
      ),
    },
    "/api/orders/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      get: operation(
        "Private tracking via X-Order-Token; admin sees contact data",
      ),
    },
    "/api/orders/{id}/status": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      put: operation("Validate order state transition; queue email", true),
    },
    "/api/reservations": {
      get: operation("Reservations from/to (42-day maximum)", true),
      post: operation("Book a table transactionally; requestKey is required"),
    },
    "/api/reservations/availability": {
      get: {
        ...operation("Available slots and table counts"),
        parameters: [
          {
            name: "date",
            in: "query",
            required: true,
            schema: { type: "string", format: "date" },
          },
          {
            name: "people",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 20 },
          },
        ],
      },
    },
    "/api/reservations/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      put: operation("Edit slot, people, table; check overlap", true),
    },
    "/api/reservations/{id}/status": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      put: operation("Confirm or cancel reservation", true),
    },
    "/api/reservations/{id}/cancel": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string", format: "uuid" },
        },
      ],
      post: operation("Cancel with private token"),
    },
    "/api/settings": {
      get: operation("Public operating settings"),
      put: operation("Update hours, capacity and acceptance", true),
    },
    "/api/admin/products": {
      get: operation("All products including unavailable", true),
    },
    "/api/admin/dashboard": {
      get: operation("Today and period analytics", true),
    },
    "/api/admin/tables": { get: operation("Table allocation", true) },
    "/api/admin/audit": { get: operation("Last 100 audited changes", true) },
  },
};
