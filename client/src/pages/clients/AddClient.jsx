import ClientForm from "../../components/client/ClientForm";

const AddClient = () => {
    return (
        <>
            <h2>Add Client</h2>
            <br />

            <ClientForm mode="add" />
        </>
    );
};

export default AddClient;