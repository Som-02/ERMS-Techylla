import Modal from "./Modal";
import "./confirmdialog.css";
const ConfirmDialog = ({
    open,
    title = "Confirm Delete",
    message,
    onCancel,
    onConfirm,
    confirmText = "Delete",
    cancelText = "Cancel",
}) => {
    return (
        <Modal open={open} title={title} onClose={onCancel}>
            <div className="confirm-dialog">
                <p>{message}</p>

                <div className="confirm-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;