import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";

import EmployeePortalTable
    from "../../components/employee/EmployeePortalTable";

import {
    getMyEmployee
} from "../../services/employeeService";

const EmployeePortal = () => {
    const { user } = useAuth();
    const [employee, setEmployee] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        loadEmployee();

    }, []);

    const loadEmployee = async () => {

        try {

            const res =
                await getMyEmployee();

            setEmployee(res.data);

        } catch (error) {

            console.error(
                "Failed to load employee:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <>

            <div className="page-header">

                <div>

                    <h1>
                        Employee Master
                    </h1>

                    <p>
                        View and manage your employee information.
                    </p>

                </div>

            </div>

            <EmployeePortalTable
                employee={employee}
            />

        </>

    );

};

export default EmployeePortal;