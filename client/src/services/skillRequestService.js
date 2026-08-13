import api from "./api";


// ==========================================
// EMPLOYEE
// ==========================================

export const createSkillRequest = async (data) => {

    const response =
        await api.post(
            "/skill-change-requests",
            data
        );

    return response.data;
};


export const getMySkillRequests = async () => {

    const response =
        await api.get(
            "/skill-change-requests/my"
        );

    return response.data;
};


// ==========================================
// ADMIN
// ==========================================

export const getPendingSkillRequests =
    async () => {

        const response =
            await api.get(
                "/skill-change-requests/pending"
            );

        return response.data;
    };


export const approveSkillRequest =
    async (id) => {

        const response =
            await api.put(
                `/skill-change-requests/${id}/approve`
            );

        return response.data;
    };


export const rejectSkillRequest =
    async (id, reason = "") => {

        const response =
            await api.put(
                `/skill-change-requests/${id}/reject`,
                {
                    reason,
                }
            );

        return response.data;
    };