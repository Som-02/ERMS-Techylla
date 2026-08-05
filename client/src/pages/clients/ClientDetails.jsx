import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Building2, FolderKanban } from "lucide-react";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

import { getClient } from "../../services/clientService";

import "../../components/client/client.css";

const ClientDetails = () => {

    const { id } = useParams();

    const [client, setClient] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadClient();

    }, []);

    const loadClient = async () => {

        try {

            const res = await getClient(id);

            setClient(res.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <>

            <PageHeader
                title="Client Details"
                subtitle="View client information and assigned projects."
                buttonText="Edit Client"
                buttonLink={`/clients/edit/${client._id}`}
            />

            <div className="client-table-wrapper">

                <div
                    style={{
                        padding: "30px",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        borderBottom: "1px solid #f3f4f6"
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: 0
                            }}
                        >

                            {client.name}

                        </h2>

                        <p
                            style={{
                                color: "#6b7280",
                                marginTop: "6px"
                            }}
                        >

                            Business Client

                        </p>

                    </div>

                </div>

                <div
                    style={{
                        padding: "30px"
                    }}
                >

                    <h3
                        style={{
                            marginBottom: "20px"
                        }}
                    >

                        {/* <FolderKanban
                            size={18}
                            style={{
                                display: "inline",
                                marginRight: "8px"
                            }}
                        /> */}

                        Assigned Projects

                    </h3>

                    {

                        client.projects?.length ? (

                            <table className="client-table">

                                <thead>

                                    <tr>

                                        <th style={{
        textAlign: "left",
    }}>

                                            Project Name

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        client.projects.map(project => (

                                            <tr
                                                key={project._id}
                                            >

                                                <td>

                                                    {project.name}

                                                </td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                        ) : (

                            <div className="empty-state">

                                <Building2
                                    size={42}
                                    className="mx-auto mb-3 text-gray-400"
                                />

                                No Projects Assigned

                            </div>

                        )

                    }

                </div>

            </div>

        </>

    );

};

export default ClientDetails;