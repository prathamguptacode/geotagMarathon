import cloud from "cloudinary"
const cloudinary = cloud.v2

cloudinary.config({ secure: true, })

export default cloudinary
