import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import SkillForm from "../../components/skills/SkillForm";
import { addSkill } from "../../services/skillService";

const AddSkill = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {

        try {

            setLoading(true);

            await addSkill(data);

            toast.success("Skill Added");

            navigate("/skills");

        }

        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to add skill"
            );

        }

        setLoading(false);

    };

    return (

        <SkillForm

            onSubmit={handleSubmit}

            loading={loading}

        />

    );

};

export default AddSkill;