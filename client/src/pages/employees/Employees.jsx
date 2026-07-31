import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import exportEmployees from "../../utils/exportEmployees";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import Loader from "../../components/common/Loader";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import EmployeeTable from "../../components/employee/EmployeeTable";

import {
    getEmployees,
    searchEmployees,
    deleteEmployee,
} from "../../services/employeeService";

const Employees = () => {

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);

    const [showDialog, setShowDialog] =
        useState(false);

    useEffect(() => {

        loadEmployees();

    }, []);

    const loadEmployees = async () => {

        try {

            const res = await getEmployees();

            setEmployees(res.data);

        } catch (error) {

            console.log(error);

        }

        setLoading(false);

    };

    const searchHandler = async (e) => {

        const value = e.target.value;

        setSearch(value);

        if (!value.trim()) {

            loadEmployees();

            return;

        }

        try {

            const res =
                await searchEmployees(value);

            setEmployees(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const openDeleteDialog = (employee) => {

        setSelectedEmployee(employee);

        setShowDialog(true);

    };

    const confirmDelete = async () => {

        try {

            await deleteEmployee(
                selectedEmployee._id
            );

            toast.success(
                "Employee Deleted"
            );

            loadEmployees();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                    "Delete Failed"
            );

        }

        setShowDialog(false);

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <>

            <PageHeader
    title="Employees"
    subtitle="Manage all employees in your organization."
    secondaryButtonText="Export Excel"

    onSecondaryClick={() =>
        exportEmployees(employees)
    }
    buttonText="Add Employee"
    buttonLink="/employees/add"
/>

            <SearchBar
                value={search}
                onChange={searchHandler}
            />

            <br />

            <EmployeeTable
                employees={employees}
                onDelete={openDeleteDialog}
            />

            <ConfirmDialog
                open={showDialog}
                message={`Delete ${selectedEmployee?.name}?`}
                onConfirm={confirmDelete}
                onCancel={() =>
                    setShowDialog(false)
                }
            />

        </>

    );

};

export default Employees;