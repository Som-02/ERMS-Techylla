import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import SkillTable from "../../components/skills/SkillTable";

import {
    getSkills,
    deleteSkill,
} from "../../services/skillService";

const SkillSets = () => {

    const [skills, setSkills] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [selectedSkill, setSelectedSkill] =
        useState(null);

    const [showDialog, setShowDialog] =
        useState(false);

    useEffect(() => {

        loadSkills();

    }, []);

    const loadSkills = async () => {

        try {

            const res = await getSkills();

            setSkills(res.data);

        }

        catch (error) {

            console.log(error);

        }

        setLoading(false);

    };

    const filteredSkills = skills.filter(skill =>
        skill.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const openDeleteDialog = (skill) => {

        setSelectedSkill(skill);

        setShowDialog(true);

    };

    const confirmDelete = async () => {

        try {

            await deleteSkill(selectedSkill._id);

            toast.success("Skill Deleted");

            loadSkills();

        }

        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Delete Failed"
            );

        }

        setShowDialog(false);

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <>

            <PageHeader

                title="Skill Sets"

                subtitle="Manage all available skills."

                buttonText="Add Skill"

                buttonLink="/skills/add"

            />

            <SearchBar

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

                placeholder="Search Skill"

            />

            <SkillTable

                skills={filteredSkills}

                onDelete={openDeleteDialog}

            />

            <ConfirmDialog

                open={showDialog}

                message={`Delete ${selectedSkill?.name}?`}

                onConfirm={confirmDelete}

                onCancel={()=>setShowDialog(false)}

            />

        </>

    );

};

export default SkillSets;