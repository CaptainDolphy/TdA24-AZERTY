import mongoose from "mongoose"
import config from "config"


const lecturerSchema = new mongoose.Schema({
uuid: { type: String, required: true, unique: true },
},{

})

const LecturerModel = mongoose.model("Lecturer", lecturerSchema)

export default LecturerModel;