const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const cloud_name= import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const uploadToCloudinary = async (file) => {
    try {
        if (!file) throw new Error("No file provided");

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", upload_preset);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            {
                method: "POST",
                body: data
            }
        );

        if (!res.ok) {
            throw new Error("Upload failed");
        }

        const fileData = await res.json();

        console.log("Cloudinary:", fileData);

        return fileData.secure_url;

    } catch (error) {
        console.error("Upload error:", error.message);
        return null;
    }
};