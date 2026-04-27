# 💸 Personal Finance API

> REST API for personal finance management. Allows you to manage transactions, categories, and get spending and income statistics by month, year, and category.
> 

🌐 **Base URL:** `https://personal-finance-api-jbd4.onrender.com`

---
## 🧪 Testing the API

The repository includes an `app.http` file with all the endpoints ready to run directly from VS Code.

### Requirements

Install the **REST Client** extension in VS Code:

```
Ext ID: humao.rest-client
```

Or find it in the Extensions panel (`Ctrl+Shift+X`) → **REST Client** → Install.

## How to Use

1. Open the `app.http` file in VS Code
2. Click **Send Request** on any endpoint
3. The response appears in a side panel

> 💡 The file uses a `@baseUrl` variable at the beginning. Change it just once to switch between local and production without touching each endpoint.

>
> ```http
> # Local
> @baseUrl = http://localhost:3000
>
> # Production
> @baseUrl = https://personal-finance-api-jbd4.onrender.com
> ```

---

## 🛠️ Tech stack
 
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)


---

## 📋 Endpoints

### 🔄 Transactions — `/api/transactions`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/transactions` | Get all transactions |
| `GET` | `/api/transactions/years` | Get available years |
| `GET` | `/api/transactions/:id` | Get a transaction by ID |
| `POST` | `/api/transactions` | Create a new transaction |
| `PATCH` | `/api/transactions/:id` | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |

### Available query params in `GET /api/transactions`

| Param | Type | Description | Example |
| --- | --- | --- | --- |
| `type` | `string` | Filter by transaction type | `income` | `expense` |
| `category` | `string` | Filter by category name | `food` |
| `month` | `number` | Filter by month (1-12) | `3` |
| `year` | `number` | Filter by year | `2024` |

### Request example — Create transaction

```
POST /api/transactions
Content-Type: application/json

{
  "description": "Supermarket",
  "amount": 150.00,
  "type": "expense",
  "category": "food",
  "date": "2024-03-15"
}
```

### Response example

```json
{
  "id": "a1f02605-aaaa-4a11-b111-000500200132",
  "description": "Supermarket",
  "amount": 150.00,
  "type": "expense",
  "category": "food",
  "date": "2024-03-15"
}
```

---

### 🏷️ Categories — `/api/categories`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/categories` | Get all categories |
| `GET` | `/api/categories/:id` | Get a category by ID |
| `POST` | `/api/categories` | Create a new category |
| `PUT` | `/api/categories/:id` | Update a category |
| `DELETE` | `/api/categories/:id` | Delete a category |

### Request example — Create category

```
POST /api/categories
Content-Type: application/json

{
  "name": "travels"
}
```

---

### 📊 Stats — `/api/stats`

All stats endpoints accept `month` and `year` as query params.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/stats/balance` | Total balance (income - expenses) |
| `GET` | `/api/stats/by-category` | Expenses grouped by category |
| `GET` | `/api/stats/monthly` | Monthly summary of income and expenses |
| `GET` | `/api/stats/top-categories` | Categories with highest spending |

### Required query params in `/api/stats`

| Param | Type | Description | Example |
| --- | --- | --- | --- |
| `month` | `number` | Month to query (1-12) | `3` |
| `year` | `number` | Year to query | `2024` |

### Request example

```
GET /api/stats/balance?month=3&year=2024
```

### Response example

```json
{
  "income": 3200.00,
  "expense": 1850.50,
  "balance": 1349.50
}
```

---

## ⚙️ Local Setup

### Prerequisites

- Node.js >= 18.0.0
- npm

### Steps

**1. Clone the repository**

```bash
git clone <https://github.com/your-username/personal-finance-api.git>
cd personal-finance-api
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

**4. Start the server**

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

**5. Test that it works**

Open `app.http` in VS Code and execute any request, or directly in the browser:

```
http://localhost:3000/api/transactions
```

---

## 🔗 Frontend

This backend is consumed by a React + TypeScript application.

👉 [**View frontend repository →**](https://github.com/wilker31vivas/personal-finance-web)

🌐 [**View frontend demo →**](https://wilker-finance-app.netlify.app/)

---

## 📌 Notes

- The data is stored in the transactions.json and categories files. When deployed to Render, the data is reset with each new deployment, as the file system is ephemeral.
- No authentication is implemented in this version. All endpoints are public.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
