import PageHeader from "../../components/common/PageHeader";
import ProjectForm from "../../components/project/ProjectForm";

const AddProject = () => {

    return (

        <>

            <PageHeader
                title="Add Project"
                subtitle="Create a new project and assign it to a client."
            />

            <ProjectForm mode="add" />

        </>

    );

};

export default AddProject;