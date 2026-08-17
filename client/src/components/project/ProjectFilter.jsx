import {useState} from "react";
import "./project.css";
const ProjectFilter = ({
    open,
    onClose,
    onApply
})=>{

const [type,setType]=useState("");
const [value,setValue]=useState("");

if(!open)
return null;


return (

<div className="filter-overlay">

    <div className="filter-modal">

<h3>
Filter Projects
</h3>


<select
value={type}
onChange={(e)=>{

setType(e.target.value);
setValue("");

}}
>

<option value="">
Select Filter
</option>

<option value="name">
Project Name
</option>

<option value="status">
Status
</option>

<option value="date">
Date
</option>

</select>



{
type==="status" &&

<select
value={value}
onChange={(e)=>setValue(e.target.value)}
>

<option>
Select Status
</option>

<option>
Lead
</option>

<option>
Pipeline
</option>

<option>
Active
</option>

<option>
On Hold
</option>

<option>
Completed
</option>

</select>

}



{
type==="name" &&

<input
placeholder="Enter project name"
value={value}
onChange={(e)=>setValue(e.target.value)}
/>

}



{
type==="date" &&

<input
placeholder="Example: 12 August, Monday, 2026..."
value={value}
onChange={(e)=>setValue(e.target.value)}
/>

}



<div className="filter-actions">

<button
className="apply-filter-btn"
onClick={()=>{

    onApply({
        type,
        value
    });

}}
>
Apply
</button>


<button
className="cancel-filter-btn"
onClick={onClose}
>
Cancel
</button>

</div>


</div>
</div>
)

}

export default ProjectFilter;