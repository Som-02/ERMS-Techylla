import { useEffect, useState } from "react";

import Loader from "../../components/common/Loader";
import PageHeader from "../../components/common/PageHeader";

import SkillMatrixTable from "../../components/skills/SkillMatrixTable";
import EmployeeListModal from "../../components/skills/EmployeeListModal";
import SearchBar from "../../components/common/SearchBar";
import { getSkillMatrix } from "../../services/skillService";

const SkillMatrix = () => {
    const [search, setSearch] = useState("");
    const [matrix, setMatrix] = useState([]);

    const [loading, setLoading] = useState(true);

    const [modalData, setModalData] = useState({

        open: false,

        title: "",

        employees: []

    });

    useEffect(() => {

        loadMatrix();

    }, []);
const filteredMatrix = matrix.filter((item) =>
    item.skill
        .toLowerCase()
        .includes(search.toLowerCase())
);
    const loadMatrix = async () => {

        try {

            const res = await getSkillMatrix();

            setMatrix(res.data);

        }

        catch (error) {

            console.log(error);

        }

        setLoading(false);

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <>

            <PageHeader

                title="Skill Matrix"

                subtitle="Employee skill distribution"

            />
    <SearchBar
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search Skill..."
/>
            <SkillMatrixTable

                matrix={filteredMatrix}

                openModal={setModalData}

            />

            <EmployeeListModal

                modalData={modalData}

                closeModal={() =>

                    setModalData({

                        open: false,

                        title: "",

                        employees: []

                    })

                }

            />

        </>

    );

};

export default SkillMatrix;