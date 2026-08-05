import "./projectImportPreviewModal.css";

const ProjectImportPreviewModal = ({
    open,
    preview,
    summary,
    onClose,
    onImport,
    loading,
}) => {

    if (!open) return null;

    return (

        <div className="preview-overlay">

            <div className="preview-modal">

                <h2>Import Preview</h2>

                <div className="preview-summary">

                    <p>
                        <strong>Total Projects:</strong> {summary.totalRows}
                    </p>

                    <p>
                        <strong>Projects Changed:</strong> {summary.changedProjects}
                    </p>

                    <p>
                        <strong>No Changes:</strong> {summary.unchangedProjects}
                    </p>

                </div>

                <div className="preview-list">

                    {

                        preview.map(project => (

                            <div
                                key={project.project}
                                className="preview-card"
                            >

                                <h3>

                                    {project.project}

                                </h3>
                                {

project.validationErrors?.length > 0 && (

<div className="validation-box">

<h4>

Validation Errors

</h4>

{

project.validationErrors.map((error,index)=>(

<div

key={index}

className="validation-row"

>

<strong>

{error.field}

</strong>

<p>

Entered :

{error.entered}

</p>

<p>

Expected :

{error.expected}

</p>

<p>

{error.message}

</p>

</div>

))

}

</div>

)

}
                                {

                                    project.changedFields.length === 0 ?

                                    (

                                        <p className="no-change">

                                            No Changes Detected

                                        </p>

                                    )

                                    :

                                    (

                                        project.changedFields.map(change => (

                                            <div
                                                key={change.field}
                                                className="change-row"
                                            >

                                                <strong>

                                                    {change.field}

                                                </strong>

                                                <div>

                                                    {change.oldValue}

                                                    <span>

                                                        →

                                                    </span>

                                                    {change.newValue}

                                                </div>

                                            </div>

                                        ))

                                    )

                                }

                            </div>

                        ))

                    }

                </div>

                <div className="preview-actions">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="save-btn"

                        onClick={onImport}

                        disabled={
loading ||

preview.some(

project=>

project.validationErrors?.length>0

)
}

                    >

                        {

                            loading

                                ? "Importing..."

                                : "Import"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

};

export default ProjectImportPreviewModal;