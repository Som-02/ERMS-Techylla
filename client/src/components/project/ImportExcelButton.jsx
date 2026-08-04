import { useRef } from "react";
import toast from "react-hot-toast";
import { previewProjectImport } from "../../services/projectImportService";

const ImportExcelButton = () => {

    const fileInputRef = useRef();

    const handleClick = () => {

        fileInputRef.current.click();

    };

    const handleFileChange = async (e) => {

        const file = e.target.files[0];

        if (!file) return;

        try {

            const res = await previewProjectImport(file);

            console.log("Excel Preview");

            console.table(res.rows);

            toast.success("Excel uploaded successfully.");

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to read Excel."

            );

        }

    };

    return (

        <>

            <button

                className="secondary-btn"

                type="button"

                onClick={handleClick}

            >

                Import Excel

            </button>

            <input

                type="file"

                accept=".xlsx"

                ref={fileInputRef}

                style={{ display: "none" }}

                onChange={handleFileChange}

            />

        </>

    );

};

export default ImportExcelButton;