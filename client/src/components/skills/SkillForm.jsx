import { useState, useEffect } from "react";

const SkillForm = ({ initialData = {}, onSubmit, loading }) => {

    const [name, setName] = useState("");

    useEffect(() => {

        if (initialData?.name) {
            setName(initialData.name);
        }

    }, [initialData]);

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({
            name
        });

    };

    return (

        <form
            className="employee-form"
            onSubmit={handleSubmit}
        >

            <div className="form-card">

                <h3>Role Information</h3>

                <div className="form-grid">

                    <div className="form-group">

                        <label>Role Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="React"
                            required
                        />

                    </div>

                </div>

            </div>

            <div className="form-actions">

                <button
                    className="save-btn"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Role"}
                </button>

            </div>

        </form>

    );

};

export default SkillForm;