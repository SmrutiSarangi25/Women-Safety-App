
# API Testing Instructions for Women Safety App

Use these requests in Postman or Thunder Client to verify your backend and database connection.

## 1. Get All Users (Admin)

- **Method:** GET
- **URL:** [http://localhost:PORT/admin/users](http://localhost:PORT/admin/users)
- **Headers:**
  - Authorization: Bearer `<your_admin_token>`

## 2. Get All SOS Alerts

- **Method:** GET
- **URL:** [http://localhost:PORT/admin/sos-alerts](http://localhost:PORT/admin/sos-alerts)
- **Headers:**
  - Authorization: Bearer `<your_admin_token>`

## 3. Grant Admin Access

- **Method:** POST
- **URL:** [http://localhost:PORT/admin/grant-access](http://localhost:PORT/admin/grant-access)
- **Headers:**
  - Authorization: Bearer `<your_super_admin_token>`
  - Content-Type: application/json
- **Body (JSON):**

```json
{
  "userId": "<user_id>",
  "role": "admin",
  "permissions": ["manageUsers", "manageSOS", "manageReports", "manageSupport", "manageSettings", "accessControl"]
}
```

## 4. Revoke Admin Access

- **Method:** DELETE
- **URL:** [http://localhost:PORT/admin/revoke-access/<user_id>](http://localhost:PORT/admin/revoke-access/<user_id>)
- **Headers:**
  - Authorization: Bearer `<your_super_admin_token>`

## 5. Get All Reviews

- **Method:** GET
- **URL:** [http://localhost:PORT/review/allreviews](http://localhost:PORT/review/allreviews)

## 6. Submit Contact Form

- **Method:** POST
- **URL:** [http://localhost:PORT/contact-us](http://localhost:PORT/contact-us)
- **Body (form-data):**
  - name: (string)
  - email: (string)
  - phone: (string)
  - subject: (string)
  - message: (string)
  - attachment: (file, optional)

---

Replace `PORT` with your backend port (e.g., 5000). Replace tokens and IDs with real values from your database.

If you need a ready-to-import Postman collection, let me know!