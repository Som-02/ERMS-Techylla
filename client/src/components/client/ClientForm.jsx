import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    createClient,
    updateClient,
} from "../../services/clientService";

import {
    uploadClientLogo,
} from "../../services/cloudinaryService";

import "./client.css";


const ClientForm = ({
    mode = "add",
    client = null,
}) => {

    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [logoFile, setLogoFile] =
        useState(null);

    const [logoPreview, setLogoPreview] =
        useState("");

    const [saving, setSaving] =
        useState(false);


    // ==========================================
    // LOAD CLIENT DATA
    // ==========================================

    useEffect(() => {

        if (mode === "edit" && client) {

            setName(client.name || "");

            setLogoPreview(
                client.logo || ""
            );

            setLogoFile(null);

        }

        if (mode === "add") {

            setName("");

            setLogoPreview("");

            setLogoFile(null);

        }

    }, [client, mode]);


    // ==========================================
    // HANDLE LOGO SELECTION
    // ==========================================

    const handleLogoChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }


        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];


        if (!allowedTypes.includes(file.type)) {

            toast.error(
                "Only JPG, JPEG, PNG or WEBP images are allowed"
            );

            e.target.value = "";

            return;

        }


        const maxSize =
            5 * 1024 * 1024;


        if (file.size > maxSize) {

            toast.error(
                "Image size must be less than 5 MB"
            );

            e.target.value = "";

            return;

        }


        setLogoFile(file);


        /*
        Show preview immediately
        before uploading to Cloudinary.
        */

        const previewUrl =
            URL.createObjectURL(file);

        setLogoPreview(previewUrl);

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const submitHandler = async (e) => {

        e.preventDefault();


        if (!name.trim()) {

            toast.error(
                "Client Name is required"
            );

            return;

        }


        try {

            setSaving(true);


            let logoUrl =
                client?.logo || "";


            // ==================================
            // UPLOAD NEW LOGO
            // ==================================

            if (logoFile) {

                const uploadResult =
                    await uploadClientLogo(
                        logoFile
                    );

                logoUrl =
                    uploadResult.url;

            }


            // ==================================
            // ADD CLIENT
            // ==================================

            if (mode === "add") {

                await createClient({

                    name: name.trim(),

                    logo: logoUrl,

                });


                toast.success(
                    "Client Added"
                );

            }


            // ==================================
            // UPDATE CLIENT
            // ==================================

            else {

                await updateClient(
                    client._id,
                    {

                        name: name.trim(),

                        logo: logoUrl,

                    }
                );


                toast.success(
                    "Client Updated"
                );

            }


            navigate("/clients");

        }

        catch (error) {

            console.error(
                "Client save error:",
                error
            );


            toast.error(

                error.response?.data?.message ||

                error.message ||

                "Something went wrong"

            );

        }

        finally {

            setSaving(false);

        }

    };


    return (

        <div className="client-form">

            <form
                onSubmit={submitHandler}
            >


                {/* =================================
                    CLIENT NAME
                ================================== */}

                <div
                    style={{
                        marginBottom: "22px",
                    }}
                >

                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600",
                            color: "#374151",
                        }}
                    >

                        Client Name

                    </label>


                    <input
                        type="text"
                        value={name}
                        placeholder="Enter Client Name"
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        style={{
                            width: "100%",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border:
                                "1px solid #d1d5db",
                            fontSize: "15px",
                        }}
                    />

                </div>


                {/* =================================
                    CLIENT LOGO
                ================================== */}

                <div
                    style={{
                        marginBottom: "22px",
                    }}
                >

                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: "600",
                            color: "#374151",
                        }}
                    >

                        Client Logo
                        <span
                            style={{
                                color: "#9ca3af",
                                fontWeight: "400",
                                marginLeft: "6px",
                            }}
                        >
                            (Optional)
                        </span>

                    </label>


                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={
                            handleLogoChange
                        }
                    />


                    {/* ============================
                        IMAGE PREVIEW
                    ============================= */}

                    {logoPreview && (

                        <div
                            style={{
                                marginTop: "15px",
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: "15px",
                            }}
                        >

                            <div
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    border:
                                        "1px solid #e5e7eb",
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    background:
                                        "#ffffff",
                                    overflow: "hidden",
                                }}
                            >

                                <img
                                    src={
                                        logoPreview
                                    }
                                    alt="Client logo preview"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit:
                                            "contain",
                                        padding: "8px",
                                    }}
                                />

                            </div>


                            <div>

                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "13px",
                                        color: "#6b7280",
                                    }}
                                >

                                    {logoFile
                                        ? logoFile.name
                                        : "Current client logo"}

                                </p>


                                <p
                                    style={{
                                        margin:
                                            "4px 0 0",
                                        fontSize: "12px",
                                        color: "#9ca3af",
                                    }}
                                >

                                    JPG, PNG or WEBP
                                    · Max 5 MB

                                </p>

                            </div>

                        </div>

                    )}

                </div>


                {/* =================================
                    ACTIONS
                ================================== */}

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "flex-end",
                        gap: "12px",
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/clients")
                        }
                        className="cancel-btn"
                        disabled={saving}
                    >

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="edit-btn"
                        disabled={saving}
                    >

                        {saving

                            ? "Saving..."

                            : mode === "add"

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