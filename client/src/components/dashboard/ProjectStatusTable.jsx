import { Building2, FolderKanban, Activity, Clock } from "lucide-react";
import ClientDisplay from "../client/ClientDisplay";

const ProjectStatusTable = ({ title, projects }) => {

    return (

        <section className="section">

            <div className="section-header">

                <h2 className="section-title">

                    {title}

                </h2>

            </div>

            {

                projects.length === 0 ?

                (

                    <div className="empty-state">

                        No projects found.

                    </div>

                )

                :

                (

                    <div className="table-wrapper">

                        <table className="dashboard-table">

                            <thead>

                                <tr>
                                    <th style={{ width: "25%" }}>
                                        <div className="th-content">
                                            <Building2 size={15} />
                                            <span>Client</span>
                                        </div>
                                    </th>

                                    <th style={{ width: "40%" }}>
                                        <div className="th-content">
                                            <FolderKanban size={15} />
                                            <span>Project</span>
                                        </div>
                                    </th>

                                    <th style={{ width: "20%" }}>
                                        <div className="th-content">
                                            <Activity size={15} />
                                            <span>Status</span>
                                        </div>
                                    </th>

                                    <th style={{ width: "15%" }}>
                                        <div className="th-content">
                                            <Clock size={15} />
                                            <span>Project Aging</span>
                                        </div>
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {

                                    projects.map(project => (

                                        <tr key={project._id}>

                                            <td>
                                                <ClientDisplay client={project.client} logoOnly={true} />
                                            </td>

                                            <td>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                    }}
                                                >

                                                    <strong>

                                                        {project.name}

                                                    </strong>

                                                </div>

                                            </td>

                                            <td>

                                                <span className={`status ${project.status.toLowerCase().replace(/\s/g, "-")}`}>

                                                    <span className="status-dot"></span>

                                                    {project.status}

                                                </span>

                                            </td>

                                            <td>

                                                {project.aging} {project.aging === 1 ? "Day" : "Days"}

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    </div>

                )

            }

        </section>

    );

};

export default ProjectStatusTable;