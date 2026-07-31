import api from "./api";

export const login = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const changePassword = async (data) => {
    const response = await api.put("/auth/change-password", data);
    return response.data;
};
export const getProfile = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};
export const updateProfile = async (data) => {
    const response = await api.put(
        "/auth/profile",
        data
    );

    return response.data;
};