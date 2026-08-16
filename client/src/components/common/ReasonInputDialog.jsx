import Modal from "./Modal";
import "./confirmdialog.css";

const ReasonInputDialog = ({
    open,
    title = "Enter Reason",
    reason,
    setReason,
    onCancel,
    onSubmit,
}) => {

    return (

        <Modal
            open={open}
            title={title}
            onClose={onCancel}
        >

            <div className="confirm-dialog">


                <textarea

                    className="reason-textarea"

                    placeholder="Enter reason..."

                    value={reason}

                    onChange={(e)=>
                        setReason(e.target.value)
                    }

                />


                <div className="confirm-actions">


                    <button

                        className="btn btn-secondary"

                        onClick={onCancel}

                    >

                        Cancel

                    </button>


                    <button

                        className="btn btn-danger"

                        onClick={onSubmit}

                    >

                        Submit

                    </button>


                </div>


            </div>


        </Modal>

    );

};


export default ReasonInputDialog;