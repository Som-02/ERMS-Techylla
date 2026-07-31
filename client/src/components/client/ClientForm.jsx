import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    createClient,
    updateClient,
} from "../../services/clientService";

const ClientForm = ({
    mode = "add",
    client = null,
}) => {

    const navigate = useNavigate();

    const [name, setName] = useState("");

    useEffect(() => {

        if (mode === "edit" && client) {
            setName(client.name);
        }

    }, [client, mode]);

    const submitHandler = async (e) => {

        e.preventDefault();

        if (!name.trim()) {
            toast.error("Client Name is required");
            return;
        }

        try {

            if (mode === "add") {

                await createClient({ name });

                toast.success("Client Added");

            } else {

                await updateClient(client._id, {
                    name,
                });

                toast.success("Client Updated");

            }

            navigate("/clients");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                    "Something went wrong"
            );

        }

    };

    return (

        <form onSubmit={submitHandler}>

            <input
                type="text"
                placeholder="Client Name"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

            <br /><br />

            <button type="submit">

                {mode === "add"
                    ? "Add Client"
                    : "Update Client"}

            </button>

        </form>

    );

};

export default ClientForm;