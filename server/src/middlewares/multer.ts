import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tempUploads")
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + file.originalname
    cb(null, fileName)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, //20mb limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    }
    else {
      cb(new Error('Only image files are allowed!'))
    }
  },
})

export default upload
