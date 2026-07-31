import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loader from "../../components/common/Loader";
import EmployeeForm from "../../components/employee/EmployeeForm";

import {
    getEmployee,
    getManagers,
} from "../../services/employeeService";

import { getClients } from "../../services/clientService";
import { getProjects } from "../../services/projectService";

const EditEmployee = () => {

    const { id } = useParams();

    const [employee, setEmployee] = useState(null);

    const [clients, setClients] = useState([]);

    const [projects, setProjects] = useState([]);

    const [managers, setManagers] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            const [
                employeeRes,
                clientRes,
                projectRes,
                managerRes,
            ] = await Promise.all([
                getEmployee(id),
                getClients(),
                getProjects(),
                getManagers(),
            ]);

            setEmployee(employeeRes.data);
            setClients(clientRes.data);
            setProjects(projectRes.data);
            setManagers(managerRes.data);

        } catch (error) {

            console.log(error);

        }

        setLoading(false);

    };

    if (loading) {
        return <Loader />;
    }

    return (
        <EmployeeForm
            mode="edit"
            employee={employee}
            clients={clients}
            projects={projects}
            managers={managers}
        />
    );

};

export default EditEmployee;