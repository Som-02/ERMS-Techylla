import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";

import SkillsSection
    from "../../components/employee/SkillsSection";

import {
    getMyEmployee
} from "../../services/employeeService";

import "./employeeEdit.css";


const EmployeeEdit = () => {

    const navigate = useNavigate();


    const [
        employee,
        setEmployee
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        try {

            const employeeRes =
                await getMyEmployee();


            setEmployee(
                employeeRes.data
            );

        }

        catch (error) {

            console.error(
                error
            );

            toast.error(
                "Failed to load employee data"
            );

        }

        finally {

            setLoading(false);

        }

    };


    if (loading) {

        return <Loader />;

    }


    if (!employee) {

        return (

            <h2>
                Employee not found.
            </h2>

        );

    }


    return (

        <div className="employee-edit-page">

            {/* ================================= */}
            {/* PAGE HEADER */}
            {/* ================================= */}

            <div className="employee-edit-header">

                <div>

                    <h1>
                        Edit Skills
                    </h1>

                    <p>
                        Update your skills and submit
                        changes for administrator approval.
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* SKILLS */}
            {/* ================================= */}

            <div className="employee-edit-card">

                <h3>
                    Current Skills
                </h3>


                <SkillsSection

                    skills={
                        employee.skills || []
                    }

                    setSkills={() => {}}

                />

            </div>


            {/* ================================= */}
            {/* BACK BUTTON */}
            {/* ================================= */}

            <div className="employee-edit-actions">

                <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                        navigate("/employee")
                    }
                >

                    Back

                </button>

            </div>


        </div>

    );

};


export default EmployeeEdit;