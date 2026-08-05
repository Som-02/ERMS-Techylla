import Modal from "../common/Modal";

const EmployeeListModal = ({

    modalData,

    closeModal

}) => {

    return (

        <Modal

            open={modalData.open}

            title={modalData.title}

            onClose={closeModal}

        >

            {

                modalData.employees.length === 0 ?

                (

                    <p>No Employees Found</p>

                )

                :

                (

                    <table className="employee-table">

                        <thead>

                            <tr>

                                <th style={{
        textAlign: "left",
    }}>Employee ID</th>

                                <th style={{
        textAlign: "left",
    }}>Name</th>

                                <th style={{
        textAlign: "left",
    }}>Rating</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                modalData.employees.map(emp=>(

                                    <tr key={emp._id}>

                                        <td style={{
        textAlign: "left",
    }}>

                                            {emp.empId}

                                        </td>

                                        <td style={{
        textAlign: "left",
    }}>

                                            {emp.name}

                                        </td>

                                        <td style={{
        textAlign: "left",
    }}>

                                            {"★".repeat(emp.rating)}

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

        </Modal>

    );

};

export default EmployeeListModal;