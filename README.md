
---

## **🏥 Hospital Management System (MERN Stack)**
A full-stack hospital management system built using **MongoDB, Express.js, React, and Node.js**.

---

### **📌 Prerequisites**
Before running the project, ensure you have the following installed:  
- **Node.js** (Download from [nodejs.org](https://nodejs.org/))  
- **Git** 

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

---

#### **4️⃣ Start the Servers**
##### **Backend**
```bash
cd backend
npm run dev
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
---

If you want to **pull changes from the main repo** to keep your fork updated before making new changes, follow these steps:  

---

### **🔄 Keeping Your Fork in Sync with the Main Repository**
Before making new changes, you should **sync your fork** with the latest updates from the main repository.

#### **1️⃣ Add the Main Repository as an Upstream Remote**  
You only need to do this **once** after forking:  
```bash
git remote add upstream https://github.com/SimonShangpliang/HMIS.git
```

#### **2️⃣ Fetch the Latest Changes from the Main Repository**  
```bash
git fetch upstream
```

#### **3️⃣ Switch to Your Local `main` Branch**  
```bash
git checkout main
```

#### **4️⃣ Merge the Latest Changes from Upstream**  
```bash
git merge upstream/main
```
or, to rebase for a cleaner history:  
```bash
git rebase upstream/main
```

#### **5️⃣ Push the Updated `main` Branch to Your Fork**  
```bash
git push origin main
```

Now your fork is in sync with the main repo! 🚀  

---

### **🔀 Syncing Before Creating a New Branch**  
If you are starting a new feature branch, always sync your fork **before creating the branch**:  
```bash
git checkout main
git pull upstream main
git checkout -b new-feature
```

---

### **💡 Alternative: Use GitHub’s Web UI**
If you **don’t want to use the terminal**, you can:  
1. Go to your fork on GitHub.  
2. Click **"Fetch upstream"** (found above the file list).  
3. Click **"Merge"** to update your fork.  
