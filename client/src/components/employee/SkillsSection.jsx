import { useEffect, useState } from "react";
import "./employeeSection.css";
import { getSkills } from "../../services/skillService";
import toast from "react-hot-toast";

const SkillsSection = ({ skills, setSkills }) => {
    const [skill, setSkill] = useState("");
    const [rating, setRating] = useState(1);
const [availableSkills, setAvailableSkills] = useState([]);
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

    if (!skill) return;

    const exists = skills.some(
        s => s.skill === skill
    );

    if (exists) {

        alert("Skill already added");

        return;

    }

    setSkills([

        ...skills,

        {

            skill,

            rating: Number(rating)

        }

    ]);

    setSkill("");

    setRating(1);

};

    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    return (

    <>

        <div className="section-grid">

            <div className="field">

                <label>Skill</label>

                <select
    value={skill}
    onChange={(e) => setSkill(e.target.value)}
>

    <option value="">

        Select Skill

    </option>

    {

        availableSkills.map(item=>(

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
                    onChange={(e)=>setRating(e.target.value)}
                >
                    <option value={1}>1 ★</option>
                    <option value={2}>2 ★★</option>
                    <option value={3}>3 ★★★</option>
                    <option value={4}>4 ★★★★</option>
                    <option value={5}>5 ★★★★★</option>
                </select>

            </div>

            <button
                type="button"
                className="primary-btn"
                onClick={addSkill}
            >
                + Add
            </button>

        </div>

        {skills.length===0 ? (

            <div className="empty">
                No skills added
            </div>

        ) : (

            <table className="data-table">

                <thead>

                    <tr>

                        <th>Skill</th>

                        <th>Rating</th>

                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {skills.map((item,index)=>(

                        <tr key={index}>

                            <td>{item.skill}</td>

                            <td>{"★".repeat(item.rating)}</td>

                            <td>

                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={()=>removeSkill(index)}
                                >
                                    Remove
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        )}

    </>

);
}
export default SkillsSection;