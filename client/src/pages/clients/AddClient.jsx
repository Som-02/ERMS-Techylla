import PageHeader from "../../components/common/PageHeader";
import ClientForm from "../../components/client/ClientForm";

const AddClient = () => {

    return (

        <>

            <PageHeader
                title="Add Client"
                subtitle="Register a new business client."
            />

            <ClientForm mode="add" />

        </>

    );

};

export default AddClient;