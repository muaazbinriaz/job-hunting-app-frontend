
# Job Hunting App

A modern job-hunting platform built with **Node.js**, **Express**, **MongoDB**, **React.js**, **Next.js**, **TailwindCSS**, and deployed on **Vercel**.  
It allows users to upload and analyze CVs, search for jobs via external APIs, and manage authentication seamlessly.

---

## 🚀 Live Demo
- live: [Job Hunt App](https://job-hunt-frontend-green.vercel.app)  
- Demo Video: [Loom Walkthrough](https://www.loom.com/share/a4f5a8c72a1c486e8c90bd78542373b2)

---

## ✨ Features
- **CV Upload & Analysis**  
  - Upload resumes using **Multer**  
  - Analyze CVs with **Llama PDF-Parse**

- **Job Search**  
  - Integrated with **JSearch Rapid API** for real-time job listings

- **Authentication**  
  - Secure signup, login, and signout using **NextAuth**

- **UI/UX**  
  - Styled with **TailwindCSS**  
  - Built with **Next.js** and **Vite** for fast development and deployment

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Next.js, TailwindCSS, Vite  
- **Backend:** Node.js, Express.js, MongoDB  
- **Auth:** NextAuth  
- **APIs:** JSearch Rapid API, Llama PDF-Parse  
- **Deployment:** Vercel  

---

## 📂 Project Setup
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd job-hunting-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add environment variables:
   - MongoDB connection string  
   - Rapid API key  
   - NextAuth secret  

4. Run the app locally:
   ```bash
   npm run dev
   ```

---

## 🔑 Authentication Flow
- **Signup** → Create account  
- **Login** → Access dashboard  
- **Signout** → End session securely  

---

## 📌 Notes
- CV parsing is experimental and works best with PDF resumes.  
- Job search results depend on Rapid API quota limits.  
- Deployed frontend is live on Vercel.

---

## 📽️ Demo
Check out the Loom video for a walkthrough of the app’s features:  
[Watch Demo](https://www.loom.com/share/a4f5a8c72a1c486e8c90bd78542373b2)


