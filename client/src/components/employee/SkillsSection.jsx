import { useEffect, useState } from "react";
import "./employeeSection.css";
import { getSkills } from "../../services/skillService";
import toast from "react-hot-toast";
import {
    Pencil,
    Trash2,
} from "lucide-react";

const SkillsSection = ({ skills, setSkills }) => {

    const [skill, setSkill] = useState("");
    const [rating, setRating] = useState(1);
    const [availableSkills, setAvailableSkills] = useState([]);

    // NEW
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {

        loadSkills();

    }, []);

    const loadSkills = async () => {

        try {

            const res = await getSkills();

            setAvailableSkills(res.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const addSkill = () => {

        if (!skill) {

            toast.error("Please select a skill");

            return;

        }

        const exists = skills.some(
            (s, index) =>
                s.skill === skill &&
                index !== editingIndex
        );

        if (exists) {

            toast.error("Skill already added");

            return;

        }

        // ============================
        // EDIT MODE
        // ============================

        if (editingIndex !== null) {

            const updatedSkills = [...skills];

            updatedSkills[editingIndex] = {

                skill,

                rating: Number(rating),

            };

            setSkills(updatedSkills);

            toast.success("Skill Updated");

            setEditingIndex(null);

        }

        // ============================
        // ADD MODE
        // ============================

        else {

            setSkills([

                ...skills,

                {

                    skill,

                    rating: Number(rating),

                },

            ]);

            toast.success("Skill Added");

        }

        clearForm();

    };

    // ============================
    // EDIT SKILL
    // ============================

    const editSkill = (item, index) => {

        setSkill(item.skill);

        setRating(item.rating);

        setEditingIndex(index);

    };

    // ============================
    // REMOVE SKILL
    // ============================

    const removeSkill = (index) => {

        setSkills(
            skills.filter((_, i) => i !== index)
        );

        // If the skill being edited is deleted
        if (editingIndex === index) {

            clearForm();

        }

        toast.success("Skill Removed");

    };

    // ============================
    // CLEAR FORM
    // ============================

    const clearForm = () => {

        setSkill("");

        setRating(1);

        setEditingIndex(null);

    };

    return (

        <>

            <div className="section-grid">

                <div className="field">

                    <label>Skill</label>

                    <select
                        value={skill}
                        onChange={(e) =>
                            setSkill(e.target.value)
                        }
                    >

                        <option value="">
                            Select Skill
                        </option>

                        {

                            availableSkills.map(item => (

                                <option
                                    key={item._id}
                                    value={item.name}
                                >

                                    {item.name}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <div className="field">

                    <label>Rating</label>

                    <select
                        value={rating}
                        onChange={(e) =>
                            setRating(
                                Number(e.target.value)
                            )
                        }
                    >

                        <option value={1}>
                            1 ★
                        </option>

                        <option value={2}>
                            2 ★★
                        </option>

                        <option value={3}>
                            3 ★★★
                        </option>

                        <option value={4}>
                            4 ★★★★
                        </option>

                        <option value={5}>
                            5 ★★★★★
                        </option>

                    </select>

                </div>

                <button
                    type="button"
                    className="primary-btn"
                    onClick={addSkill}
                >

                    {editingIndex !== null
                        ? "Update"
                        : "+ Add"}

                </button>

            </div>

            {

                skills.length === 0 ? (

                    <div className="empty">

                        No skills added

                    </div>

                ) : (

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Skill
                                </th>

                                <th>
                                    Rating
                                </th>

                                <th
                                    style={{
                                        textAlign: "right",
                                        paddingRight: "35px",
                                    }}
                                >
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                skills.map(
                                    (item, index) => (

                                        <tr
                                            key={index}
                                        >

                                            <td>

                                                {item.skill}

                                            </td>

                                            <td>

                                                {"★".repeat(
                                                    item.rating
                                                )}

                                            </td>

                                            <td
                                                style={{
                                                    textAlign:
                                                        "center",
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        justifyContent:
                                                            "flex-end",
                                                        gap: "8px",
                                                    }}
                                                >

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        className="skill-edit-btn"
                                                        title="Edit Skill"
                                                        onClick={() =>
                                                            editSkill(
                                                                item,
                                                                index
                                                            )
                                                        }
                                                    >

                                                        <Pencil
                                                            size={18}
                                                        />

                                                    </button>

                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="remove-btn"
                                                        title="Delete Skill"
                                                        onClick={() =>
                                                            removeSkill(
                                                                index
                                                            )
                                                        }
                                                    >

                                                        <Trash2
                                                            size={18}
                                                        />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            }

                        </tbody>

                    </table>

                )

            }

        </>

    );

};

export default SkillsSection;