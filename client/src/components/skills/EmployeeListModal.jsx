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

                                <th>Employee ID</th>

                                <th>Name</th>

                                <th>Rating</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                modalData.employees.map(emp=>(

                                    <tr key={emp._id}>

                                        <td>

                                            {emp.empId}

                                        </td>

                                        <td>

                                            {emp.name}

                                        </td>

                                        <td>

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