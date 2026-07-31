import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import EmployeeForm from "../../components/employee/EmployeeForm";

import { getClients } from "../../services/clientService";
import { getProjects } from "../../services/projectService";
import { getManagers } from "../../services/employeeService";

const AddEmployee = () => {

    const [loading, setLoading] = useState(true);

    const [clients, setClients] = useState([]);

    const [projects, setProjects] = useState([]);

    const [managers, setManagers] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

    try {

        const [clientRes, projectRes, managerRes] =
            await Promise.all([
                getClients(),
                getProjects(),
                getManagers(),
            ]);

        setClients(clientRes.data);
        setProjects(projectRes.data);
        setManagers(managerRes.data);

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }

};

    if (loading) {
        return <Loader />;
    }

    return (
        <EmployeeForm
            mode="add"
            clients={clients}
            projects={projects}
            managers={managers}
        />
    );

};

export default AddEmployee;