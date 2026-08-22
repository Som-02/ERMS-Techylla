import api from "./api";

export const getProjects = async (filter = {}) => {
    const params = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return;
        }

        // Handle array parameters (status, name, client)
        if (Array.isArray(value)) {
            value.forEach(item => {
                if (item !== undefined && item !== null && item !== "") {
                    params.append(key, item);
                }
            });
            return;
        }

        params.append(key, value);
    });

    const response = await api.get(
        "/projects",
        {
            params
        }
    );

    return response.data;
};
export const getMyProjects = async()=>{

    const response = await api.get(
        "/projects/my-projects"
    );

    return response.data;

};
export const getProject = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

export const createProject = async (data) => {
    const response = await api.post("/projects", data);
    return response.data;
};

export const updateProject = async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
};

export const deleteProject = async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
};

export const getProjectsForExport = async () => {

    const response = await api.get(

        "/projects/export"

    );

    return response.data;

};
export const updateAssignment = async (

    projectId,

    employeeId,

    data

) => {

    const response = await api.put(

        `/projects/${projectId}/assignment/${employeeId}`,

        data

    );

    return response.data;

};
export const deleteAssignment = async (

    projectId,

    employeeId,
    role

) => {

    const response = await api.delete(

        `/projects/${projectId}/assign/${employeeId}/${encodeURIComponent(role)}`

    );

    return response.data;

};
export const assignEmployee = async (

    projectId,

    data

) => {

    const response = await api.post(

        `/projects/${projectId}/assignment`,

        data

    );

    return response.data;

};
export const getProjectStaffingPlan = async (id) => {

    const response = await api.get(

        `/projects/${id}/staffing-plan`

    );

    return response.data;

};
export const getProjectCategories = async () => {

    const response = await api.get(
        "/projects/categories"
    );

    return response.data;

};


export const createProjectCategory = async (name) => {

    const response = await api.post(
        "/projects/categories",
        {
            name,
        }
    );

    return response.data;

};
export const updateProjectCategory = async (
    id,
    name
) => {

    const response = await api.put(
        `/projects/categories/${id}`,
        {
            name,
        }
    );

    return response.data;

};


export const deleteProjectCategory = async (
    id
) => {

    const response = await api.delete(
        `/projects/categories/${id}`
    );

    return response.data;

};
export const getProjectStatuses = async () => {

    const response = await api.get(
        "/projects/statuses"
    );

    return response.data;

};

export const createProjectStatus = async (name) => {

    const response = await api.post(
        "/projects/statuses",
        {
            name,
        }
    );

    return response.data;

};

export const updateProjectStatus = async (
    id,
    name
) => {

    const response = await api.put(
        `/projects/statuses/${id}`,
        {
            name,
        }
    );

    return response.data;

};

export const deleteProjectStatus = async (
    id
) => {

    const response = await api.delete(
        `/projects/statuses/${id}`
    );

    return response.data;

};