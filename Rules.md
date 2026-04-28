You are building a Content Broadcasting System backend from scratch.
Tech stack: Node.js, Express, PostgreSQL, JWT auth, Multer for file uploads.
Follow these rules strictly throughout the entire project:
- Use ES Modules (import/export) everywhere
- Use async/await, never callbacks
- All errors must be handled with try/catch and passed to Express error middleware
- Never hardcode secrets — always use process.env
- Use proper HTTP status codes everywhere
- Every route must be validated before hitting the controller
- Use JSDoc comments on every function
- Use camelCase for variables/functions, PascalCase for classes
- All responses must follow the format: { success: true/false, data: {}, message: "" }
Do you understand? Reply "Ready" before I give you the first task.