import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import Loader from "../../components/common/Loader";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import ClientTable from "../../components/client/ClientTable";

import {
    getClients,
    searchClients,
    deleteClient,
} from "../../services/clientService";

const Clients = () => {

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [selectedClient, setSelectedClient] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {

        try {

            const res = await getClients();

            setClients(res.data);

        } catch (error) {

            console.log(error);

        }

        setLoading(false);

    };

    const searchHandler = async (e) => {

        const value = e.target.value;

        setSearch(value);

        if (!value.trim()) {

            loadClients();
            return;

        }

        try {

            const res = await searchClients(value);

            setClients(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const openDeleteDialog = (client) => {

        setSelectedClient(client);
        setShowDialog(true);

    };

    const confirmDelete = async () => {

        try {

            await deleteClient(selectedClient._id);

            toast.success("Client Deleted");

            loadClients();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Delete Failed"
            );

        }

        setShowDialog(false);

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <>

            <PageHeader
                title="Clients"
                buttonText="Add Client"
                buttonLink="/clients/add"
            />

            <div
    style={{
        marginBottom:"24px"
    }}
>

    <SearchBar
        value={search}
        onChange={searchHandler}
        placeholder="Search clients..."
    />

</div>

            <ClientTable
                clients={clients || []}
                onDelete={openDeleteDialog}
            />

            <ConfirmDialog
                open={showDialog}
                message={`Delete ${selectedClient?.name}?`}
                onConfirm={confirmDelete}
                onCancel={() => setShowDialog(false)}
            />

        </>

    );

};

export default Clients;