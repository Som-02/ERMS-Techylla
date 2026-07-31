import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loader from "../../components/common/Loader";
import ProjectForm from "../../components/project/ProjectForm";

import { getProject } from "../../services/projectService";

const EditProject = () => {

    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProject();
    }, []);

    const loadProject = async () => {

        try {

            const res = await getProject(id);

            setProject(res.data);

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
            <h2>Edit Project</h2>

            <br />

            <ProjectForm
                mode="edit"
                project={project}
            />
        </>
    );

};

export default EditProject;