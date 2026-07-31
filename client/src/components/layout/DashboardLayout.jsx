import "./layout.css";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {

    return (

        <div className="layout">

            <Sidebar />

            <div className="content">

                <Navbar />

                <main className="page">

                    {children}

                </main>

            </div>

        </div>

    );

};

export default DashboardLayout;