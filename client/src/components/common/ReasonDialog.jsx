import Modal from "./Modal";


const ReasonDialog = ({
    open,
    title,
    reason,
    setReason,
    onCancel,
    onSubmit,
    readOnly=false
}) => {


return (

<Modal
    open={open}
    title={title}
    onClose={onCancel}
>


{
readOnly ? (

<div className="reason-view-box">

    {reason}

</div>

) : (

<textarea

className="reason-textarea"

value={reason}

onChange={(e)=>
    setReason(e.target.value)
}

/>

)
}


<div className="confirm-actions">


<button

className="btn btn-secondary"

onClick={onCancel}

>

Close

</button>


{
!readOnly && (

<button

className="btn btn-danger"

onClick={onSubmit}

>

Submit

</button>

)
}


</div>


</Modal>

);

};


export default ReasonDialog;