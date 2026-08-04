import api from "./api";

export const getEmployees = async () => {
    const response = await api.get("/employees");
    return response.data;
};

export const getEmployee = async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
};

export const createEmployee = async (data) => {
    const response = await api.post("/employees", data);
    return response.data;
};

export const updateEmployee = async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
};

export const deleteEmployee = async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
};

export const searchEmployees = async (query) => {
    const response = await api.get(
        `/employees/search?q=${query}`
    );
    return response.data;
};

export const getManagers = async () => {
    const response = await api.get("/employees");
    return response.data;
};
export const getEmployeesBySkills = async (skills = []) => {

    const response = await api.get(

        `/employees/filter-by-skills?skills=${skills.join(",")}`

    );

    return response.data;

};