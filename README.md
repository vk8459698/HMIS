
---

## **🏥 Hospital Management System (MERN Stack)**
A full-stack hospital management system built using **MongoDB, Express.js, React, and Node.js**.

---

### **📌 Prerequisites**
Before running the project, ensure you have the following installed:  
- **Node.js** (Download from [nodejs.org](https://nodejs.org/))  
- **MongoDB** (Either local installation or [MongoDB Atlas](https://www.mongodb.com/atlas))  
- **Git** (Optional, but recommended)  

---

### **🚀 How to Run the Project**
#### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/SimonShangpliang/HMIS.git
cd HMIS
```

#### **2️⃣ Install Dependencies**
##### **Backend (Node.js + Express)**
```bash
cd backend
npm install
```
##### **Frontend (React + Vite)**
```bash
cd ../frontend
npm install
```

---

#### **3️⃣ Configure Environment Variables**
Create a `.env` file inside the `backend` folder and add:  
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```
For MongoDB, you can use **MongoDB Atlas** or a local MongoDB server.

---

#### **4️⃣ Start the Servers**
##### **Backend**
```bash
cd backend
npm start
```
##### **Frontend**
```bash
cd frontend
npm run dev
```
The frontend should now be running on `http://localhost:5173`, and the backend should be on `http://localhost:5000`.

---


### **📌 Project Structure**
```
HMIS/
│── backend/         # Express.js backend
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── .env
│   └── package.json
│
│── frontend/        # React (Vite) frontend
│   ├── src/
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
└── README.md        # Project documentation
```

---


### **🙌 Contributing**
1. Fork the repo  
2. Create a new branch (`git checkout -b feature-branch`)  
3. Commit changes (`git commit -m "Added new feature"`)  
4. Push (`git push origin feature-branch`)  
5. Submit a **Pull Request**  

---

### **📜 License**
This project is **open-source** and free to use.  

---
