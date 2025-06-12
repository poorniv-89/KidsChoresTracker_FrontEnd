# 🧽 ChoreBlasterz — Frontend

ChoreBlasterz is a fun and interactive **chore tracking and reward app** designed for families. Built with the **MERN stack**, it helps children complete daily tasks while earning points and rewards, and gives parents an easy dashboard to assign and manage chores.

👉 **[Backend Repository](https://github.com/poorniv-89/KidsChoresTracker_Backend)**


---

## 🚀 Tech Stack

- **React** — frontend UI library  
- **React Router DOM** — client-side routing  
- **Axios** — handle HTTP requests to backend  
- **React Icons** — icon library for UI elements  
- **React Modal** — popup/modal component  
- **Context API** — global state management (e.g., authentication)  
- **CSS** — custom styling with external stylesheets  
- **Vite** — fast development build tool  
- **.env Configuration** — manage environment-specific variables  
- **LocalStorage** — persist modal state across sessions  
- **React Hooks** — like `useEffect`, `useRef`, `useState` for state and lifecycle handling  


## 🔑 Features

### 👪 Roles
- **Parent Dashboard** to:
  - Assign chores
  - Add rewards
  - Approve or reject completed chores
  - Approve or reject reward requests

- **Child Dashboard** to:
  - View available chores
  - Mark chores as done
  - Request rewards
  - Track points and completed tasks

  ## ⚙️ Capabilities Overview

### Parent Capabilities
- `/parent/login` — Parent login
- `/parent/dashboard` — View kids, assign chores, manage rewards
- Add and edit:
  - 📝 Chores
  - 🎁 Rewards
- View:
  - ⏳ Pending chore approvals
  - 🎉 Reward request approvals

### Child Capabilities
- `/child/:childId/dashboard` — View chores and rewards
- `/child/:childId/history` — View chore history and reward status
- Mark chores as done
- Request rewards
- See motivational quotes

## 🛠️ Project Setup Guide

### 1. Wireframing
Plan essential screens for both **Parent** and **Child** roles:
- Dashboard
- Chore & Reward Lists
- History Page
- Modals

---

### 2. Initialize Frontend

```bash
npm create vite@latest choreblasterz-frontend --template react
cd choreblasterz-frontend
npm install

### 3. Folder Structure

📦src
┣ 📂components // Navbar, Modals, Cards
┣ 📂pages // ParentDashboard, ChildDashboard, History
┣ 📂styles // Custom CSS
┣ App.jsx
┗ main.jsx


---

### 4. Setup Routing

Install React Router:

```bash
npm install react-router-dom

Then configure your routing in main.jsx and App.jsx using:

<BrowserRouter>
  <Routes>
    {/* Define your routes here */}
  </Routes>
</BrowserRouter>

### 5. API Integration

Install Axios:

npm install axios
Use Axios to connect your frontend with backend APIs for:

✅ Assigning & managing chores

✅ Completing chores

🎁 Requesting & approving rewards

👪 Fetching child/parent dashboards