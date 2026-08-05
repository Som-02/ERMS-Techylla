import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import techyllaLogo from "../../assets/techylla-logo.png";
const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <aside className="sidebar">

    <div className="sidebar-logo">

    <h2 className="sidebar-title">
        e-HRMS
    </h2>

    <img
        src={techyllaLogo}
        alt="Techylla"
        className="sidebar-logo-img"
    />

</div>

    <nav className="sidebar-nav">

        <NavLink to="/dashboard">
            Dashboard
        </NavLink>
<NavLink to="/clients">
            Clients
        </NavLink>

        <NavLink to="/projects">
            Projects
        </NavLink>
        <NavLink to="/employees">
            Employee Master
        </NavLink>

        <NavLink to="/skills">
    Role Sets
</NavLink>
<NavLink to="/skill-matrix">
    Role Matrix
</NavLink>
        

        <NavLink to="/settings">
            Settings
        </NavLink>

    </nav>

    <button
        className="logout-btn"
        onClick={handleLogout}
    >
        Logout
    </button>

</aside>
    );
};

export default Sidebar;