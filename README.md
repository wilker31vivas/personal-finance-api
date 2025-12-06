# 📘 Personal Finance API – Gestión de Transacciones e Información Financiera

Una API REST construida con **Node.js + Express** para gestionar ingresos y gastos, organizar transacciones y generar estadísticas financieras claras: balance, resúmenes mensuales, categorías más utilizadas y más.

---

# 🚀 Características Principales

## 1. 📝 Gestión de Transacciones

### **Crear Transacción**  
`POST /api/transactions`

Permite registrar un **ingreso** o **gasto** con validaciones.

**Características:**
- Tipo: `income` o `expense`
- Monto positivo obligatorio
- Categorías predefinidas
- Generación automática de UUID
- Validación de datos en middleware y servicio

---

### **Listar Transacciones**  
`GET /api/transactions`

Obtener todas las transacciones con múltiples filtros opcionales.

**Filtros disponibles:**
- `type=income | expense`
- `category=food`
- `month=11`
- `year=2024`

---

### **Obtener Transacción por ID**  
`GET /api/transactions/:id`

**Devuelve:**
- Detalles completos de una transacción  
- Error `404` si no existe

---

### **Actualizar Transacción**  
`PUT /api/transactions/:id`

Permite modificar cualquier campo excepto el `id`.

---

### **Eliminar Transacción**  
`DELETE /api/transactions/:id`

Elimina una transacción y devuelve una confirmación.

---

---

## 2. 📊 Estadísticas y Reportes

### **Balance General**  
`GET /api/stats/balance`

Calcula:
- Total de ingresos  
- Total de gastos  
- **Balance** (ingresos – gastos)

**Filtros opcionales:** `?month=11&year=2024`

---

### **Resumen por Categoría**  
`GET /api/stats/by-category`

Genera un resumen agrupado por categoría:

- Total gastado por categoría  
- Porcentaje de participación  
- Filtros: `month` / `year`

---

### **Resumen Mensual**  
`GET /api/stats/monthly`

Incluye:

- Total de ingresos del mes actual  
- Total de gastos del mes actual  
- Comparación con el mes anterior  
- Porcentaje de cambio (positivo o negativo)

---

### **Top Categorías (Top 5)**  
`GET /api/stats/top-categories`

Devuelve:

- Las 5 categorías con mayor gasto acumulado  
- Ordenadas de mayor a menor  
- Incluye porcentaje en relación al total general

---

## 🗂️ Modelo de Datos (JSON)

### **Transacción (Transaction)**

```json
{
  "id": "47047f7b-824b-4eb1-b41f-caaba7950d8e",
  "type": "income",
  "amount": 45.50,
  "category": "food",
  "description": "Almuerzo en restaurante",
  "date": "2024-11-15T14:30:00.000Z"
}
```
## **Categorías válidas (gastos)**

| Categoría | Descripción |
| --- | --- |
| `food` | Comida |
| `transport` | Transporte |
| `entertainment` | Entretenimiento |
| `utilities` | Servicios |
| `health` | Salud |
| `shopping` | Compras |
| `other` | Otros |

# 🚀 **Instalación**

### 1. Clonar el repositorio
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
### 2. Instalar dependencias
npm install
### 3. Ejecutar en modo desarrollo
npm run dev

# 📦 **Tecnologías usadas**

- Node.js
- Express.js
- UUID
- Middlewares personalizados
- Arquitectura en capas
- Filtrado avanzado de fechas
