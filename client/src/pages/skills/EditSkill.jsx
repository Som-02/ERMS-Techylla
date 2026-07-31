import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import SkillForm from "../../components/skills/SkillForm";

import {
    getSkills,
    updateSkill
} from "../../services/skillService";

import Loader from "../../components/common/Loader";

const EditSkill = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [skill, setSkill] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadSkill();

    }, []);

    const loadSkill = async () => {

        try {

            const res = await getSkills();

            const found = res.data.find(s => s._id === id);

            setSkill(found);

        }

        catch (error) {

            toast.error("Unable to load skill");

        }

        setLoading(false);

    };

    const handleSubmit = async (data) => {

        try {

            await updateSkill(id, data);

            toast.success("Skill Updated");

            navigate("/skills");

        }

        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Update Failed"
            );

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <SkillForm

            initialData={skill}

            onSubmit={handleSubmit}

        />

    );

};

export default EditSkill;