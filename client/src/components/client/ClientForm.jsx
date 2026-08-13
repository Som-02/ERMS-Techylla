import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    createClient,
    updateClient,
} from "../../services/clientService";

import "./client.css";

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

        <div
            className="client-form"
        >

            <form onSubmit={submitHandler}>

                <div
                    style={{
                        marginBottom: "22px"
                    }}
                >

                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600",
                            color: "#374151"
                        }}
                    >

                        Client Name

                    </label>

                    <input
                        type="text"
                        value={name}
                        placeholder="Enter Client Name"
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db",
                            fontSize: "15px"
                        }}
                    />

                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px"
                    }}
                >

                    <button
                        type="button"
                        onClick={() => navigate("/clients")}
                        className="cancel-btn"
                    >

                        Cancel

                    </button>

                    <button
                        type="submit"
                        className="edit-btn"
                    >

                        {

                            mode === "add"
                                ? "Add Client"
                                : "Update Client"

                        }

                    </button>

                </div>

            </form>

        </div>

    );

};

export default ClientForm;