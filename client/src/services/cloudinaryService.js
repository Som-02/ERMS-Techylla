import api from "./api";
export const uploadClientLogo = async (file) => {

    if (!file) {
        throw new Error("No image selected");
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
        throw new Error(
            "Only JPG, JPEG, PNG or WEBP images are allowed"
        );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
        throw new Error(
            "Image size must be less than 5 MB"
        );
    }

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    formData.append(
        "folder",
        "ehrms/client-logos"
    );

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {

        console.error(
            "Cloudinary upload error:",
            data
        );

        throw new Error(
            data.error?.message ||
            "Failed to upload client logo"
        );

    }

    return {
        url: data.secure_url,
        publicId: data.public_id,
    };
};