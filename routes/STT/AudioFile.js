const router = require("express").Router()

const AudioFileSTTController = require("../../controller/STT/AudioFile")
const { uploadFile } = require("../../middleware/uploadFile")
const { DeleteRule } = require("../../middleware/validation")



router.post("/", uploadFile, AudioFileSTTController.upload)
router.delete("/", DeleteRule, AudioFileSTTController.delete)
router.get("/", AudioFileSTTController.allAudioFile)


module.exports = router