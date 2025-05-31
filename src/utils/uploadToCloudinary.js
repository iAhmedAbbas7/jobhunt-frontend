// <= UPLOAD TO CLOUDINARY UTIL FUNCTION =>

const uploadToCloudinary = async (file) => {
  // UPLOAD URL
  const url = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
  // UPLOAD PRESET
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  // IF ENV VARIABLES ARE MISSING
  if (!url || !preset) {
    throw new Error("Missing Cloudinary Env Variables!");
  }
  // CREATING FORM DATA INSTANCE TO SEND FILE
  const formData = new FormData();
  // APPENDING FILE TO FORM DATA
  formData.append("file", file);
  formData.append("upload_preset", preset);
  // AWAITING RESPONSE
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  // IF RESPONSE NOT OK
  if (!response.ok) {
    const error = await response.text();
    throw new Error("Cloudinary Upload Failed", error);
  }
  // IF RESPONSE OK
  const json = await response.json();
  return {
    url: json.secure_url,
    publicId: json.public_id,
  };
};

export default uploadToCloudinary;
