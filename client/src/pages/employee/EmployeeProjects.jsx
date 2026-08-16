import {useEffect,useState} from "react";

import Loader from "../../components/common/Loader";

import {
    getMyProjects
} from "../../services/projectService";

import EmployeeProjectTable 
from "../../components/employee/EmployeeProjectTable";


const EmployeeProjects = ()=>{


const [projects,setProjects]=useState([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{

    loadProjects();

},[]);



const loadProjects=async()=>{

    try{

        const res = await getMyProjects();

        setProjects(res.data || []);

    }
    catch(error){

        console.log(error);

    }
    finally{

        setLoading(false);

    }

};



if(loading){

    return <Loader/>;

}



return (

<>

<div className="page-header">

<div>

<h1>
Project Master
</h1>


<p>
View projects assigned to you.
</p>

</div>

</div>


<EmployeeProjectTable
projects={projects}
/>


</>


);


};


export default EmployeeProjects;