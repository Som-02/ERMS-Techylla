import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import ClientForm from "../../components/client/ClientForm";

import { getClient } from "../../services/clientService";

const EditClient = () => {

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
                title="Edit Client"
                subtitle="Update client information."
            />

            <ClientForm
                mode="edit"
                client={client}
            />

        </>

    );

};

export default EditClient;