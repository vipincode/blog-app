JWT (JSON Web Token) is a compact, URL-safe way to securely transmit information between two parties (commonly a server and a client). It's widely used for authentication and authorization.

---

### **How JWT Works (High-level Flow)**

1. **User logs in** by providing credentials (username/password).
2. **Server validates** the credentials.
3. **Server creates a JWT** containing some user data (like `id`, `email`, `role`).
4. **Server signs the JWT** using a secret key (or private key if using asymmetric encryption).
5. **JWT is sent to the client** (browser, mobile app) and usually stored in **cookies**, **localStorage**, or **sessionStorage**.
6. **Client sends the JWT** in the `Authorization` header (usually as `Bearer <token>`) for each subsequent request.
7. **Server verifies the JWT** signature using the secret key.
8. **If valid**, the server trusts the claims in the token and processes the request; otherwise, rejects it.

---

### **Structure of a JWT**

A JWT is made of **three parts** separated by dots (`.`):

```
<Header>.<Payload>.<Signature>
```

Example:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJ1c2VySWQiOiIxMjM0NTYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjQ0NjYwMDB9
.abc123signature
```

---

### **1. Header**

- Contains **metadata about the token**, mainly:

  - `alg`: Algorithm used for signing (e.g., `HS256` for HMAC-SHA256)
  - `typ`: Type of token (`JWT`)

Example (before encoding):

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

---

### **2. Payload (Body)**

- Also called **claims**.
- Contains the actual **data about the user or session**.
- Types of claims:

  - **Registered claims** (predefined): `iss` (issuer), `sub` (subject), `exp` (expiry), `iat` (issued at)
  - **Public claims**: Agreed upon by both parties
  - **Private claims**: Custom claims like `userId`, `role`

Example (before encoding):

```json
{
  "userId": "123456",
  "role": "admin",
  "iat": 1724466000,
  "exp": 1724470000
}
```

**Important:** The payload is **Base64Url encoded** but **not encrypted**. Anyone with the token can read it, but **cannot modify it without invalidating the signature**.

---

### **3. Signature**

- Ensures the token is **not tampered with**.
- Created by taking the header and payload, encoding them, and signing them with a secret key.

For example, using HMAC-SHA256:

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

---

Would you like me to **draw a visual diagram of JWT parts (header, payload, signature)**? Or **show a working example in Node.js/Next.js**?
