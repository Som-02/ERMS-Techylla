import api from "./api";

export const previewProjectImport = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(

        "/projects/import/preview",

        formData

    );

    return response.data;

};

export const importProjectsExcel = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(

        "/projects/import",

        formData

    );

    return response.data;

};