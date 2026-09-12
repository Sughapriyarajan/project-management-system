import "./App.css";
import { useEffect, useState } from "react";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
);
const token = localStorage.getItem("token");
const [showLogin, setShowLogin] = useState(!localStorage.getItem("token"));
const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [showRegister, setShowRegister] = useState(false);
const [registerName, setRegisterName] = useState("");
const [registerEmail, setRegisterEmail] = useState("");
const [registerPassword, setRegisterPassword] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectName, setProjectName] = useState("");
const [projectDescription, setProjectDescription] = useState("");
const [projectStartDate, setProjectStartDate] = useState("");
const [projectEndDate, setProjectEndDate] = useState("");
  const [projects, setProjects] = useState([]);
const [tasks, setTasks] = useState([]);
const [showNewTask, setShowNewTask] = useState(false);
const [taskName, setTaskName] = useState("");
const [taskDescription, setTaskDescription] = useState("");
const [taskDueDate, setTaskDueDate] = useState("");
const [taskProjectId, setTaskProjectId] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [taskFilter, setTaskFilter] = useState("All");
const [showNotifications, setShowNotifications] = useState(false);
const [showProfileMenu, setShowProfileMenu] = useState(false);

const totalTasks = tasks.length;

const completedTasks = tasks.filter(
  (task) => task.status === "COMPLETED"
).length;

const inProgressTasks = tasks.filter(
  (task) => task.status === "IN_PROGRESS"
).length;

const pendingTasks = tasks.filter(
  (task) => task.status === "PENDING"
).length;
useEffect(() => {
  if (!token) return;
 fetch("https://project-management-system-production-fc8b.up.railway.app/api/projects", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
    .then((res) => res.json())
    .then((data) => setProjects(data))
    .catch((error) => console.error("Failed to load projects:", error));

  fetch("https://project-management-system-production-fc8b.up.railway.app/api/tasks", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
    .then((res) => res.json())
    .then((data) => setTasks(data))
    .catch((error) => console.error("Failed to load tasks:", error));
}, []);
const handleRegister = async () => {
  try {
    if (
      !registerName.trim() ||
      !registerEmail.trim() ||
      !registerPassword.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    const response = await fetch(
      "https://project-management-system-production-fc8b.up.railway.app/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: registerName.trim(),
          email: registerEmail.trim(),
          password: registerPassword
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    alert("Registration successful! Please login.");

    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setShowRegister(false);
  } catch (error) {
    console.error("Registration error:", error);
    alert(error.message);
  }
};
const handleLogin = async () => {
  try {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      alert("Please enter email and password");
      return;
    }

    const response = await fetch("https://project-management-system-production-fc8b.up.railway.app/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: loginEmail.trim(),
        password: loginPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    setShowLogin(false);

    alert("Login successful!");
    window.location.reload();
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message);
  }
};
const handleCreateProject = async () => {
  try {
    if (!projectName.trim()) {
      alert("Please enter project name");
      return;
    }

    const response = await fetch("https://project-management-system-production-fc8b.up.railway.app/api/projects", {
      method: "POST",
      headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
},
      body: JSON.stringify({
       
        projectName: projectName.trim(),
        description: projectDescription.trim(),
        status: "NOT_STARTED",
        startDate: projectStartDate || null,
        endDate: projectEndDate || null
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create project");
    }

    setProjects((prevProjects) => [...prevProjects, data.project]);

    setProjectName("");
    setProjectDescription("");
    setProjectStartDate("");
    setProjectEndDate("");
    setShowNewProject(false);

    alert("Project created successfully!");
  } catch (error) {
    console.error("Create project error:", error);
    alert("Failed to create project");
  }
};

   const handleCreateTask = async () => {
  try {
    if (!taskName.trim()) {
      alert("Please enter task name");
      return;
    }

    if (projects.length === 0) {
      alert("Please create a project first");
      return;
    }

    const response = await fetch("https://project-management-system-production-fc8b.up.railway.app/api/tasks", {
      method: "POST",
     headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
},
      body: JSON.stringify({
        projectId: Number(taskProjectId),
        taskName: taskName.trim(),
        description: taskDescription.trim(),
        priority: "MEDIUM",
        status: "PENDING",
        dueDate: taskDueDate || null
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create task");
    }

    setTasks((prevTasks) => [data.task, ...prevTasks]);

    setTaskName("");
    setTaskDescription("");
    setTaskDueDate("");
    setShowNewTask(false);

    alert("Task created successfully!");
  } catch (error) {
    console.error("Create task error:", error);
    alert("Failed to create task");
  }
};
const handleUpdateTaskStatus = async (taskId, newStatus) => {
  try {
    const task = tasks.find((item) => item.id === taskId);

    if (!task) return;

    const response = await fetch(
      `https://project-management-system-production-fc8b.up.railway.app/api/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
},
        body: JSON.stringify({
          taskName: task.taskName,
          description: task.description || "",
          priority: task.priority,
          status: newStatus,
          dueDate: task.dueDate
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update task");
    }

    setTasks((prevTasks) =>
      prevTasks.map((item) =>
        item.id === taskId ? data.task : item
      )
    );
  } catch (error) {
    console.error("Update task status error:", error);
    alert("Failed to update task status");
  }
};
const handleEditTask = async (task) => {
  const newName = window.prompt(
    "Enter new task name:",
    task.taskName
  );

  if (newName === null) return;

  if (!newName.trim()) {
    alert("Task name cannot be empty");
    return;
  }

  try {
    const response = await fetch(
      `https://project-management-system-production-fc8b.up.railway.app/api/tasks/${task.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          taskName: newName.trim(),
          description: task.description || "",
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update task");
    }

    setTasks((prevTasks) =>
      prevTasks.map((item) =>
        item.id === task.id ? data.task : item
      )
    );

    alert("Task updated successfully!");
  } catch (error) {
    console.error("Edit task error:", error);
    alert(error.message || "Failed to update task");
  }
};
const handleDeleteTask = async (taskId) => {
  try {
    const response = await fetch(
      `https://project-management-system-production-fc8b.up.railway.app/api/tasks/${taskId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete task");
    }

    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );

    alert("Task deleted successfully!");
  } catch (error) {
    console.error("Delete task error:", error);
    alert(error.message || "Failed to delete task");
  }
};
const handleDeleteProject = async (projectId) => {
  try {
    const response = await fetch(
      `https://project-management-system-production-fc8b.up.railway.app/api/projects/${projectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete project");
    }

    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectId)
    );

    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.projectId !== projectId)
    );

    alert("Project deleted successfully!");
  } catch (error) {
    console.error("Delete project error:", error);
    alert(error.message || "Failed to delete project");
  }
};
const handleEditProject = async (project) => {
  const newName = window.prompt(
    "Enter new project name:",
    project.projectName
  );

  if (newName === null) return;

  if (!newName.trim()) {
    alert("Project name cannot be empty");
    return;
  }

  try {
    const response = await fetch(
      `https://project-management-system-production-fc8b.up.railway.app/api/projects/${project.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          projectName: newName.trim(),
          description: project.description || "",
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update project");
    }

    setProjects((prevProjects) =>
      prevProjects.map((item) =>
        item.id === project.id ? data.project : item
      )
    );

    alert("Project updated successfully!");
  } catch (error) {
    console.error("Edit project error:", error);
    alert(error.message || "Failed to update project");
  }
};
  const handleNavigation = (page) => {
  setActivePage(page);

  setTimeout(() => {
    const mainContent = document.querySelector(".main");

    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, 50);
};
if (showRegister) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="brand-icon">P</div>

        <h1>Create Account</h1>
        <p>Register to start managing your projects</p>

        <input
          type="text"
          placeholder="Full Name"
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />

        <button
          className="orange-button"
          onClick={handleRegister}
        >
          Create Account
        </button>

        <button
          type="button"
          onClick={() => setShowRegister(false)}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
if (showLogin) {
  return (
    <div className="login-screen">
      <div className="login-card">
      <button
  type="button"
  onClick={() => setShowRegister(true)}
>
  Create Account
</button>
        <div className="brand-icon">P</div>

        <h1>Welcome to ProManage</h1>
        <p>Login to manage your projects and tasks</p>

        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />

        <button
          className="orange-button"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">P</div>
          <div>
            <h2>ProManage</h2>
            <span>Project Management System</span>
          </div>
        </div>

        <nav className="navigation">
         <button
  className={`nav-link ${activePage === "Dashboard" ? "active" : ""}`}
  onClick={() => handleNavigation("Dashboard")}
>
  <span className="nav-icon">⌂</span>
  Dashboard
</button>

          <button
  className={`nav-link ${activePage === "Projects" ? "active" : ""}`}
  onClick={() => handleNavigation("Projects")}
>
  <span className="nav-icon">▣</span>
  Projects
</button>

          <button
  className={`nav-link ${activePage === "Tasks" ? "active" : ""}`}
  onClick={() => handleNavigation("Tasks")}
>
  <span className="nav-icon">✓</span>
  Tasks
</button>

         <button
  className={`nav-link ${activePage === "Team" ? "active" : ""}`}
  onClick={() => handleNavigation("Team")}
>
  <span className="nav-icon">♙</span>
  Team
</button>

         <button
  className={`nav-link ${activePage === "Reports" ? "active" : ""}`}
  onClick={() => handleNavigation("Reports")}
>
  <span className="nav-icon">▥</span>
  Reports
</button>

        <button
  className={`nav-link ${activePage === "Calendar" ? "active" : ""}`}
  onClick={() => handleNavigation("Calendar")}
>
  <span className="nav-icon">□</span>
  Calendar
</button>
        </nav>

        <div className="sidebar-bottom">

          <button
  className={`nav-link ${activePage === "Settings" ? "active" : ""}`}
  onClick={() => handleNavigation("Settings")}
>
  <span className="nav-icon">⚙</span>
  Settings
</button>

          <div className="upgrade-card">
            <div className="rocket">↗</div>
            <h3>Build Better<br />Together</h3>
            <p>Plan, track and deliver your projects with ease.</p>
      <button
  className="orange-button"
  onClick={() => setShowNewProject(true)}
>
  + New Project
</button>
          </div>

          <div className="profile">
            <div className="profile-avatar">S</div>
            <div>
              <strong>Sughapriya R</strong>
              <span>Administrator</span>
            </div>
            <div className="profile-arrow">⌄</div>
          </div>

        </div>
      </aside>


      {/* ================= MAIN ================= */}
     <main
  className={`main ${
    activePage === "Projects"
      ? "projects-active"
      : activePage === "Tasks"
      ? "tasks-active"
      : ""
  }`}
>
       {activePage === "Settings" ? (
  <div className="settings-page">
    <div className="settings-header">
      <div>
        <h1>Settings</h1>
        <p>Manage your workspace preferences and account settings.</p>
      </div>
    </div>

    <div className="settings-grid">

      <div className="settings-card">
        <div className="settings-card-header">
          <div>
            <h2>Workspace Settings</h2>
            <p>Configure your workspace preferences</p>
          </div>
          <span className="settings-icon">⚙</span>
        </div>

        <div className="setting-row">
          <div>
            <h3>Workspace Name</h3>
            <p>Change the name of your workspace</p>
          </div>
          <input
            className="settings-input"
            type="text"
            defaultValue="ProManage"
          />
        </div>

        <div className="setting-row">
          <div>
            <h3>Workspace Description</h3>
            <p>Short description for your workspace</p>
          </div>
          <input
            className="settings-input"
            type="text"
            defaultValue="Project Management Workspace"
          />
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <div>
            <h2>Notifications</h2>
            <p>Control how you receive notifications</p>
          </div>
          <span className="settings-icon">🔔</span>
        </div>

        <div className="setting-row">
          <div>
            <h3>Email Notifications</h3>
            <p>Receive project updates through email</p>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span></span>
          </label>
        </div>

        <div className="setting-row">
          <div>
            <h3>Task Reminders</h3>
            <p>Get reminders about upcoming deadlines</p>
          </div>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span></span>
          </label>
        </div>

        <div className="setting-row">
          <div>
            <h3>Project Alerts</h3>
            <p>Receive alerts when project status changes</p>
          </div>
          <label className="toggle">
            <input type="checkbox" />
            <span></span>
          </label>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <div>
            <h2>Appearance</h2>
            <p>Customize how ProManage looks</p>
          </div>
          <span className="settings-icon">◐</span>
        </div>

        <div className="setting-row">
          <div>
            <h3>Theme</h3>
            <p>Choose your preferred interface theme</p>
          </div>

          <select className="settings-select" defaultValue="Dark">
            <option>Dark</option>
            <option>Light</option>
          </select>
        </div>

        <div className="setting-row">
          <div>
            <h3>Compact Mode</h3>
            <p>Reduce spacing across the workspace</p>
          </div>
          <label className="toggle">
            <input type="checkbox" />
            <span></span>
          </label>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <div>
            <h2>Security</h2>
            <p>Manage your account security</p>
          </div>
          <span className="settings-icon">🔒</span>
        </div>

        <div className="setting-row">
          <div>
            <h3>Two-Factor Authentication</h3>
            <p>Add an extra layer of security to your account</p>
          </div>
          <button className="settings-action">Enable</button>
        </div>

        <div className="setting-row">
          <div>
            <h3>Password</h3>
            <p>Update your account password</p>
          </div>
          <button className="settings-action">Change</button>
        </div>
      </div>

    </div>
  </div>
) : null}
{activePage === "Team" && (
  <div className="projects-page">
    <div className="projects-page-header">
      <div>
        <p className="eyebrow">WORKSPACE / TEAM</p>
        <h1>Team</h1>
        <p>Manage your team members and workspace collaboration.</p>
      </div>
    </div>

    <div className="team-page-grid">
      <div className="team-page-card">
        <div className="team-page-avatar">S</div>
        <div>
          <h3>Sughapriya R</h3>
          <p>Administrator</p>
        </div>
      </div>

      <div className="team-page-card">
        <div className="team-page-avatar">R</div>
        <div>
          <h3>Riya</h3>
          <p>Developer</p>
        </div>
      </div>

      <div className="team-page-card">
        <div className="team-page-avatar">P</div>
        <div>
          <h3>Priya</h3>
          <p>Designer</p>
        </div>
      </div>
    </div>
  </div>
)}

{activePage === "Reports" && (
  <div className="projects-page">
    <div className="projects-page-header">
      <div>
        <p className="eyebrow">WORKSPACE / REPORTS</p>
        <h1>Reports</h1>
        <p>View project and task performance reports.</p>
      </div>
    </div>

    <div className="projects-page-stats">
      <div className="project-stat-card">
        <span>Total Projects</span>
        <strong>05</strong>
        <small>Workspace projects</small>
      </div>

      <div className="project-stat-card">
        <span>Total Tasks</span>
        <strong>12</strong>
        <small>Tasks across projects</small>
      </div>

      <div className="project-stat-card">
        <span>Completed</span>
        <strong>08</strong>
        <small>Successfully completed</small>
      </div>
    </div>
  </div>
)}

{activePage === "Calendar" && (
  <div className="projects-page">
    <div className="projects-page-header">
      <div>
        <p className="eyebrow">WORKSPACE / CALENDAR</p>
        <h1>Calendar</h1>
        <p>View project deadlines and upcoming tasks.</p>
      </div>
    </div>

    <div className="calendar-page-card">
      <h2>September 2026</h2>

      <div className="calendar-placeholder">
        <div>Upcoming Deadlines</div>
        <p>Project Management System</p>
        <span>Task deadlines will appear here.</span>
      </div>
    </div>
  </div>
)}

{activePage === "Projects" && (
  <div className="projects-page">
    <div className="projects-page-header">
      <div>
        <p className="eyebrow">WORKSPACE / PROJECTS</p>
        <h1>Projects</h1>
        <p>Manage and track all your projects in one place.</p>
      </div>

      <button
        className="orange-button"
        onClick={() => setShowNewProject(true)}
      >
        + New Project
      </button>
    </div>

    <div className="projects-page-stats">
      <div className="project-stat-card">
        <span>Total Projects</span>
        <strong>05</strong>
        <small>Active workspace projects</small>
      </div>

      <div className="project-stat-card">
        <span>In Progress</span>
        <strong>03</strong>
        <small>Projects currently active</small>
      </div>

      <div className="project-stat-card">
        <span>Completed</span>
        <strong>01</strong>
        <small>Projects completed</small>
      </div>

      <div className="project-stat-card">
        <span>On Hold</span>
        <strong>01</strong>
        <small>Projects waiting for action</small>
      </div>
    </div>

    <div className="projects-page-list">
      <div className="projects-list-header">
        <div>
          <h2>All Projects</h2>
          <p>Your current workspace projects</p>
        </div>

        <select className="project-filter" defaultValue="All">
          <option>All</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>On Hold</option>
        </select>
      </div>
{projects
  .filter((project) =>
    project.projectName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .map((project, index) => (
  <div className="project-page-row" key={project.id}>
    <div className="project-symbol orange-symbol">
      {index % 2 === 0 ? "</>" : "▣"}
    </div>

    <div className="project-page-details">
      <h3>{project.projectName}</h3>
      <p>{project.description || "No description available"}</p>
    </div>

    <span className={`status ${
      project.status === "COMPLETED"
        ? "green-status"
        : project.status === "IN_PROGRESS"
        ? "progress-status"
        : "not-started"
    }`}>
      {project.status.replace("_", " ")}
    </span>

    <div className="page-progress">
      <div className="progress">
        <div
          style={{
            width:
              project.status === "COMPLETED"
                ? "100%"
                : project.status === "IN_PROGRESS"
                ? "50%"
                : "10%"
          }}
        ></div>
      </div>

      <span>
        {project.status === "COMPLETED"
          ? "100%"
          : project.status === "IN_PROGRESS"
          ? "50%"
          : "10%"}
      </span>
    </div>

    <div className="page-deadline">
      <small>Due Date</small>
      <strong>
        {project.endDate
          ? new Date(project.endDate).toLocaleDateString()
          : "No due date"}
      </strong>
    </div>
    <button
  className="task-edit-button"
  onClick={() => handleEditProject(project)}
>
  ✏️
</button>
    <button
  className="task-delete-button"
  onClick={() => handleDeleteProject(project.id)}
>
  🗑️
</button>
  </div>
))}
   </div>
  </div>
)}

{activePage === "Tasks" && (
  <div className="tasks-page">
    <div className="tasks-page-header">
      <div>
        <p className="eyebrow">WORKSPACE / TASKS</p>
        <h1>Tasks</h1>
        <p>Track, organize and manage your tasks efficiently.</p>
      </div>

  <button
  className="orange-button"
  onClick={() => setShowNewTask(true)}
>
  + New Task
</button>
    </div>

    <div className="task-summary">
      <div className="task-summary-card">
        <span>Total Tasks</span>
       <strong>{totalTasks}</strong>
        <small>All workspace tasks</small>
      </div>

      <div className="task-summary-card">
        <span>Completed</span>
       <strong>{completedTasks}</strong>
        <small>Tasks completed</small>
      </div>

      <div className="task-summary-card">
        <span>In Progress</span>
       <strong>{inProgressTasks}</strong>
        <small>Currently active</small>
      </div>

      <div className="task-summary-card">
        <span>Pending</span>
        <strong>{pendingTasks}</strong>
        <small>Waiting for action</small>
      </div>
    </div>

    <div className="tasks-panel">
      <div className="tasks-panel-header">
        <div>
          <h2>All Tasks</h2>
          <p>Manage your current tasks</p>
        </div>

        <select
  className="task-filter"
  value={taskFilter}
  onChange={(e) => setTaskFilter(e.target.value)}
>
  <option value="All">All</option>
  <option value="Completed">Completed</option>
  <option value="In Progress">In Progress</option>
  <option value="Pending">Pending</option>
</select>
      </div>

     {tasks
  .filter((task) => {
    const matchesSearch = task.taskName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      taskFilter === "All" ||
      (taskFilter === "Completed" && task.status === "COMPLETED") ||
      (taskFilter === "In Progress" && task.status === "IN_PROGRESS") ||
      (taskFilter === "Pending" && task.status === "PENDING");

    return matchesSearch && matchesFilter;
  })
  .map((task) => (
  <div className="task-row" key={task.id}>
    <div className={`task-check ${
      task.status === "COMPLETED" ? "completed" : ""
    }`}>
      {task.status === "COMPLETED" ? "✓" : "○"}
    </div>

    <div className="task-info">
      <h3>{task.taskName}</h3>
      <p>Project ID: {task.projectId}</p>
    </div>

    <span className={`task-priority ${task.priority.toLowerCase()}`}>
      {task.priority}
    </span>

   <select
  className={`task-status-select ${
    task.status === "COMPLETED"
      ? "completed-task"
      : task.status === "IN_PROGRESS"
      ? "progress-task"
      : "pending-task"
  }`}
  value={task.status}
  onChange={(e) =>
    handleUpdateTaskStatus(task.id, e.target.value)
  }
>
  <option value="PENDING">PENDING</option>
  <option value="IN_PROGRESS">IN PROGRESS</option>
  <option value="COMPLETED">COMPLETED</option>
</select>

    <span className="task-date">
      {task.dueDate
        ? new Date(task.dueDate).toLocaleDateString()
        : "No due date"}
    </span>
    <button
  className="task-edit-button"
  onClick={() => handleEditTask(task)}
>
  ✏️
</button>
    <button
  className="task-delete-button"
  onClick={() => handleDeleteTask(task.id)}
>
  🗑️
</button>
  </div>
))}

      </div>
    </div>

)}
        {/* TOP BAR */}
        <header className="topbar">

          <div className="search-box">
  <span>⌕</span>
  <input
    type="text"
    placeholder="Search projects, tasks, or team members..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <kbd>Ctrl + K</kbd>
</div>
          <div className="top-right">
            <div className="notification-wrapper">
  <button
    className="notification"
    onClick={() => {
      setShowNotifications(!showNotifications);
      setShowProfileMenu(false);
    }}
  >
    🔔
    <span>3</span>
  </button>

  {showNotifications && (
    <div className="notification-panel">
      <div className="dropdown-header">
        <strong>Notifications</strong>
        <span>3 new</span>
      </div>

      <div className="notification-item">
        <div className="notification-icon">✓</div>
        <div>
          <strong>Task completed</strong>
          <p>You completed UI Design</p>
          <small>1 hour ago</small>
        </div>
      </div>

      <div className="notification-item">
        <div className="notification-icon">📁</div>
        <div>
          <strong>New project created</strong>
          <p>Mobile Application was created</p>
          <small>3 hours ago</small>
        </div>
      </div>

      <div className="notification-item">
        <div className="notification-icon">👤</div>
        <div>
          <strong>Team update</strong>
          <p>Sneha joined the Design Team</p>
          <small>Yesterday</small>
        </div>
      </div>
    </div>
  )}
</div>

           <div className="profile-wrapper">
  <div
    className="top-profile"
    onClick={() => {
      setShowProfileMenu(!showProfileMenu);
      setShowNotifications(false);
    }}
    style={{ cursor: "pointer" }}
  >
    <div className="small-avatar">S</div>

    <div>
      <strong>Sughapriya R</strong>
      <small>Administrator</small>
    </div>

    <span>⌄</span>
  </div>

  {showProfileMenu && (
    <div className="profile-menu">
      <div className="profile-menu-header">
        <div className="profile-menu-avatar">S</div>
        <div>
          <strong>Sughapriya R</strong>
          <small>Administrator</small>
        </div>
      </div>

      <div className="profile-menu-divider"></div>

      <button
        onClick={() => {
          setShowProfileMenu(false);
          handleNavigation("Team");
        }}
      >
        👤 Profile
      </button>

      <button
        onClick={() => {
          setShowProfileMenu(false);
          handleNavigation("Settings");
        }}
      >
        ⚙️ Settings
      </button>

      <button
        className="logout-option"
        onClick={() => {
  localStorage.removeItem("token");
  setShowProfileMenu(false);
  setShowLogin(true);
}}
      >
        ↪ Logout
      </button>
    </div>
  )}
</div>
</div>

        </header>


        {/* ================= CONTENT ================= */}
        <div className="content">

          {/* HERO */}
          <section className="hero">

            <div>
              <p className="eyebrow">WORKSPACE / DASHBOARD</p>

              
                <h1>
  {new Date().getHours() < 12
    ? "Good morning"
    : new Date().getHours() < 17
    ? "Good afternoon"
    : "Good evening"}
  , <span>Sughapriya.</span> 👋
</h1>
              

              <p className="hero-subtitle">
                Here's what's happening with your projects today.
              </p>
            </div>

            <div className="hero-side">

              <div className="date-card">
                <span className="date-icon">▣</span>
                <div>
                  <small>Today</small>
                  <strong>
  {new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}
</strong>
                </div>
              </div>

              <div className="quote-card">
                <strong>
                  “Small steps every day
                  lead to big results.”
                </strong>
              </div>

            </div>

          </section>


          {/* ================= STATS ================= */}
          <section className="stats">

            <div className="stat-card">
              <div className="stat-heading">
                <span>Total Projects</span>
                <div className="stat-icon orange">▣</div>
              </div>

              <h2>05</h2>

              <p className="growth">
                ↑ 20%
                <span> from last month</span>
              </p>

              <div className="mini-chart orange-chart">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>


            <div className="stat-card">
              <div className="stat-heading">
                <span>Total Tasks</span>
                <div className="stat-icon orange">✓</div>
              </div>

              <h2>24</h2>

              <p className="growth">
                ↑ 12%
                <span> from last month</span>
              </p>

              <div className="mini-chart orange-chart second">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>


            <div className="stat-card">
              <div className="stat-heading">
                <span>Completed Tasks</span>
                <div className="stat-icon green">✓</div>
              </div>

              <h2>16</h2>

              <p className="growth green-text">
                ↑ 28%
                <span> from last month</span>
              </p>

              <div className="mini-chart green-chart">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>


            <div className="stat-card">
              <div className="stat-heading">
                <span>Pending Tasks</span>
                <div className="stat-icon orange">!</div>
              </div>

              <h2>08</h2>

              <p className="growth red-text">
                ↓ 8%
                <span> from last month</span>
              </p>

              <div className="mini-chart orange-chart third">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
            </div>

          </section>


          {/* ================= MAIN GRID ================= */}
          <section className="dashboard-grid">

            {/* PROJECTS */}
            <div className="panel projects-panel">

              <div className="panel-header">
                <div>
                  <h2>My Projects</h2>
                  <p>Track your project progress and deadlines</p>
                </div>

                <button
  className="orange-button"
  onClick={() => setShowNewProject(true)}
>
  + New Project
</button>
              </div>


              <div className="project-list">

                <div className="project">

                  <div className="project-symbol orange-symbol">
                    &lt;/&gt;
                  </div>

                  <div className="project-details">
                    <h3>Website Development</h3>
                    <p>Build a modern and responsive website</p>

                    <div className="progress-wrapper">
                      <div className="progress">
                        <div style={{ width: "75%" }}></div>
                      </div>
                      <span>75%</span>
                    </div>
                  </div>

                  <span className="status progress-status">
                    In Progress
                  </span>

                  <div className="deadline">
                    <small>Due Date</small>
                    <strong>May 10, 2026</strong>
                  </div>

                  <button className="more">⋮</button>

                </div>


                <div className="project">

                  <div className="project-symbol green-symbol">
                    ▣
                  </div>

                  <div className="project-details">
                    <h3>Mobile Application</h3>
                    <p>Cross-platform mobile app development</p>

                    <div className="progress-wrapper">
                      <div className="progress">
                        <div className="green-progress" style={{ width: "45%" }}></div>
                      </div>
                      <span>45%</span>
                    </div>
                  </div>

                  <span className="status green-status">
                    In Progress
                  </span>

                  <div className="deadline">
                    <small>Due Date</small>
                    <strong>May 20, 2026</strong>
                  </div>

                  <button className="more">⋮</button>

                </div>


                <div className="project">

                  <div className="project-symbol purple-symbol">
                    ↗
                  </div>

                  <div className="project-details">
                    <h3>Marketing Campaign</h3>
                    <p>Social media and digital marketing</p>

                    <div className="progress-wrapper">
                      <div className="progress">
                        <div className="orange-progress" style={{ width: "90%" }}></div>
                      </div>
                      <span>90%</span>
                    </div>
                  </div>

                  <span className="status hold-status">
                    On Hold
                  </span>

                  <div className="deadline">
                    <small>Due Date</small>
                    <strong>May 15, 2026</strong>
                  </div>

                  <button className="more">⋮</button>

                </div>


                <div className="project">

                  <div className="project-symbol blue-symbol">
                    ✦
                  </div>

                  <div className="project-details">
                    <h3>Design System</h3>
                    <p>UI/UX design and component library</p>

                    <div className="progress-wrapper">
                      <div className="progress">
                        <div className="purple-progress" style={{ width: "30%" }}></div>
                      </div>
                      <span>30%</span>
                    </div>
                  </div>

                  <span className="status not-started">
                    Not Started
                  </span>

                  <div className="deadline">
                    <small>Due Date</small>
                    <strong>June 05, 2026</strong>
                  </div>

                  <button className="more">⋮</button>

                </div>


                <div className="project">

                  <div className="project-symbol cyan-symbol">
                    ⚙
                  </div>

                  <div className="project-details">
                    <h3>Backend API</h3>
                    <p>Develop and integrate REST APIs</p>

                    <div className="progress-wrapper">
                      <div className="progress">
                        <div className="blue-progress" style={{ width: "60%" }}></div>
                      </div>
                      <span>60%</span>
                    </div>
                  </div>

                  <span className="status green-status">
                    In Progress
                  </span>

                  <div className="deadline">
                    <small>Due Date</small>
                    <strong>May 25, 2026</strong>
                  </div>

                  <button className="more">⋮</button>

                </div>

              </div>

            </div>
             

            {/* RIGHT COLUMN */}
            <div className="right-column">

              {/* ACTIVITY */}
              <div className="panel activity-panel">

                <div className="panel-header">
                  <div>
                    <h2>Recent Activity</h2>
                    <p>Latest workspace updates</p>
                  </div>

                  <button
  className="view-all"
  onClick={() => handleNavigation("Projects")}
>
  View All →
</button>
                </div>


                <div className="activity-list">

                  <div className="activity">
                    <div className="activity-avatar">R</div>
                    <div>
                      <strong>Rahul updated task status</strong>
                      <span>API Integration · 2 hours ago</span>
                    </div>
                  </div>

                  <div className="activity">
                    <div className="activity-avatar">P</div>
                    <div>
                      <strong>Priya commented on a task</strong>
                      <span>“Looks good! Approved.” · 4 hours ago</span>
                    </div>
                  </div>

                  <div className="activity">
                    <div className="activity-avatar green">K</div>
                    <div>
                      <strong>Karthik created a new project</strong>
                      <span>Mobile Application · 6 hours ago</span>
                    </div>
                  </div>

                  <div className="activity">
                    <div className="activity-avatar purple">S</div>
                    <div>
                      <strong>Sneha added a new team member</strong>
                      <span>Design Team · 1 day ago</span>
                    </div>
                  </div>

                  <div className="activity">
                    <div className="activity-avatar blue">✓</div>
                    <div>
                      <strong>You completed a task</strong>
                      <span>UI Design · 1 day ago</span>
                    </div>
                  </div>

                </div>

              </div>


              {/* TASK STATUS */}
              <div className="panel task-status">

                <div className="panel-header">
                  <div>
                    <h2>Task Status</h2>
                    <p>Overview of task completion</p>
                  </div>
                </div>

                <div className="task-content">

                  <div className="donut">
                    <div className="donut-inner">
                      <strong>67%</strong>
                      <span>Completed</span>
                    </div>
                  </div>

                  <div className="legend">

                    <div>
                      <span className="dot completed-dot"></span>
                      Completed
                      <strong>16</strong>
                    </div>

                    <div>
                      <span className="dot progress-dot"></span>
                      In Progress
                      <strong>06</strong>
                    </div>

                    <div>
                      <span className="dot pending-dot"></span>
                      Pending
                      <strong>08</strong>
                    </div>

                    <div>
                      <span className="dot overdue-dot"></span>
                      Overdue
                      <strong>02</strong>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>
             
          {/* ================= BOTTOM ================= */}
          <section className="bottom-grid">

            <div className="panel team-panel">

              <div className="panel-header">
                <div>
                  <h2>Team Members</h2>
                  <p>Active members in your workspace</p>
                </div>

                <button
  className="view-team"
  onClick={() => handleNavigation("Team")}
>
  View Team
</button>
              </div>

              <div className="team-members">

                <div className="team-avatar">S</div>
                <div className="team-avatar orange-team">R</div>
                <div className="team-avatar green-team">P</div>
                <div className="team-avatar purple-team">K</div>

                <div className="team-more">
                  +2
                </div>

              </div>

            </div>


            <div className="premium-banner">

              <div>
                <small>KEEP GOING!</small>
                <h2>You're doing great.</h2>
                <p>
                  Stay focused, keep building.
                </p>
              </div>

              <div className="mountain">
                ▲
              </div>

            </div>

          </section>

        </div>
{showNewProject && (
                
  <div className="new-project-overlay">
    <div className="new-project-modal">
      <div className="modal-header">
        <div>
          <h2>New Project</h2>
          <p>Create a new project for your workspace</p>
        </div>

        <button
          className="modal-close"
          onClick={() => setShowNewProject(false)}
        >
          ×
        </button>
      </div>

      <input
  type="text"
  placeholder="Project title"
  value={projectName}
  onChange={(e) => setProjectName(e.target.value)}
/>
      <textarea
  placeholder="Project description"
  value={projectDescription}
  onChange={(e) => setProjectDescription(e.target.value)}
></textarea>
<div className="date-fields">
  <div>
    <label>Start Date</label>
    <input
      type="date"
      value={projectStartDate}
      onChange={(e) => setProjectStartDate(e.target.value)}
    />
  </div>

  <div>
    <label>End Date</label>
    <input
      type="date"
      value={projectEndDate}
      onChange={(e) => setProjectEndDate(e.target.value)}
    />
  </div>
</div>
      <div className="modal-actions">
        <button
          className="cancel-button"
          onClick={() => setShowNewProject(false)}
        >
          Cancel
        </button>

        <button
  className="orange-button"
  onClick={handleCreateProject}
>
  Create Project
</button>
      </div>
    </div>
  </div>
)}
{showNewTask && (
  <div className="new-project-overlay">
    <div className="new-project-modal">
      <div className="modal-header">
        <div>
          <h2>New Task</h2>
          <p>Create a new task for your project</p>
        </div>

        <button
          className="modal-close"
          onClick={() => setShowNewTask(false)}
        >
          ×
        </button>
      </div>
<select
  value={taskProjectId}
  onChange={(e) => setTaskProjectId(e.target.value)}
>
  <option value="">Select Project</option>

  {projects.map((project) => (
    <option key={project.id} value={project.id}>
      {project.projectName}
    </option>
  ))}
</select>
      <input
        type="text"
        placeholder="Task name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />

      <textarea
        placeholder="Task description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      ></textarea>

      <div className="date-fields">
        <div>
          <label>Due Date</label>
          <input
            type="date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="modal-actions">
        <button
          className="cancel-button"
          onClick={() => setShowNewTask(false)}
        >
          Cancel
        </button>

      <button
  className="orange-button"
  onClick={handleCreateTask}
>
  Create Task
</button>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}

export default App;