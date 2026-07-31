import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loader from "../../components/common/Loader";

import { getClient } from "../../services/clientService";

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

        }

        setLoading(false);

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <>

            <h1>{client.name}</h1>

            <br />

            <h2>Projects</h2>

            {client.projects?.length ? (

                <table border="1" cellPadding="10">

                    <thead>

                        <tr>

                            <th>Project</th>

                        </tr>

                    </thead>

                    <tbody>

                        {client.projects.map(project => (

                            <tr key={project._id}>

                                <td>{project.name}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            ) : (

                <p>No Projects Assigned</p>

            )}

        </>

    );

};

export default ClientDetails;