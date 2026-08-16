import {Link} from "react-router-dom";

import {
Eye
} from "lucide-react";


const EmployeeProjectTable = ({
projects
})=>{

return (

<div className="table-wrapper">


<table className="dashboard-table">
<colgroup>
        <col style={{ width: "7%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "10%" }} />
    </colgroup>

<thead>

<tr>

<th>
S.No
</th>

<th>
Project
</th>

<th>
Client
</th>

<th>
Start Date
</th>

<th>
End Date
</th>

<th>
Status
</th>

<th style={{textAlign:"center",paddingRight: "40px",}}>
Action
</th>


</tr>


</thead>



<tbody>


{
projects.length===0 ?


<tr>

<td colSpan="7">

No assigned projects found.

</td>

</tr>


:

projects.map(
(project,index)=>(


<tr key={project._id}>


<td>
{index+1}
</td>



<td>

<strong>
{project.name}
</strong>

</td>



<td>


{
project.client?.logo ?

<img

src={project.client.logo}

alt={project.client.name}

style={{
width:"60px",
height:"45px",
objectFit:"contain"
}}

/>

:

project.client?.name || "-"

}


</td>



<td>

{
project.startDate
?
project.startDate.split("T")[0]
:
"-"
}

</td>



<td>

{
project.endDate
?
project.endDate.split("T")[0]
:
"-"
}

</td>



<td>

    <span 
        className={`status ${project.status
            .toLowerCase()
            .replace(/\s/g,"-")}`}
    >

        <span className="status-dot"></span>

        {project.status}

    </span>

</td>



<td>


<Link className="action-btn employee-view-btn"
to={`/employee/projects/${project._id}`}
>


<Eye size={18}/>


</Link>


</td>



</tr>


))


}



</tbody>


</table>


</div>


);


};


export default EmployeeProjectTable;