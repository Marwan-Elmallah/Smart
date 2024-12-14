const { Company, AudioFile, Subscription } = require("../../database").models;
const axios = require('axios');
const config = require("../../config");


class AudioFileSTTController {
    static async upload(req, res) {
        const companyId = req.loginAuth.record.id;
        const { type, audio } = req.body
        const companyExist = await Company.findByPk(companyId);
        let record
        if (!companyExist) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Company is not Exist"
            });
        }
        if (!companyExist.status) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Company is not Activated"
            });
        }
        const subscriptionExist = await Subscription.findByPk(companyExist.currentSubscriptionId);
        if (!subscriptionExist || (subscriptionExist.endDate < new Date())) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Your Subscription is Expired"
            })
        }
        try {
            if (!req.file) {
                if (!audio || !type) {
                    return res.status(404).json({
                        error: true,
                        code: 404,
                        message: "Audio and type are required"
                    })
                }
                const { data } = await axios.post('http://91.106.108.98:5000/speechTotext', {
                    recording_path: audio
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                if (subscriptionExist.tier === "demo" && data.duration > (20 - subscriptionExist.numberOfMinutes)) {
                    return res.status(404).json({
                        error: true,
                        code: 404,
                        message: `Maximum audio length is ${20 - subscriptionExist.numberOfMinutes} minutes for your demo subscription`
                    })
                }
                record = await AudioFile.create({
                    companyId,
                    filepath: audio,
                    type,
                    filename: audio.split('/').pop(),
                    duration: data.duration,
                    text: data.text
                });
                const numberOfMinutes = subscriptionExist.numberOfMinutes + data.duration
                await subscriptionExist.update({ numberOfMinutes })
                await subscriptionExist.save()
                if (subscriptionExist.tier !== "demo") {
                    if (subscriptionExist.tier !== "demo") {
                        await axios.post(`${config.App_Url}/stt/billing`, {
                            subscriptionId: subscriptionExist.id
                        })
                    }
                }
            } else {
                console.log(`${config.App_Url}/audio/${req.file.filename}`);
                const { data } = await axios.post('http://91.106.108.98:5000/speechTotext', {
                    recording_path: `${config.App_Url}/audio/${req.file.filename}`
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (subscriptionExist.tier === "demo" && data.duration > (20 - subscriptionExist.numberOfMinutes)) {
                    return res.status(404).json({
                        error: true,
                        code: 404,
                        message: `Maximum audio length is ${20 - subscriptionExist.numberOfMinutes} minutes for your demo subscription`
                    })
                }
                record = await AudioFile.create({
                    companyId,
                    filepath: `${config.App_Url}/audio/${req.file.filename}`,
                    filename: req.file.originalname,
                    duration: data.duration,
                    type,
                    text: data.text
                });
                const numberOfMinutes = subscriptionExist.numberOfMinutes + data.duration
                await subscriptionExist.update({ numberOfMinutes })
                await subscriptionExist.save()
                if (subscriptionExist.tier !== "demo") {
                    if (subscriptionExist.tier !== "demo") {
                        await axios.post(`${config.App_Url}/stt/billing`, {
                            subscriptionId: subscriptionExist.id
                        })
                    }
                }
            }
            return res.status(200).json({
                error: false,
                code: 200,
                message: "File Uploaded Successfully",
                data: record
            });
        }
        catch (error) {
            // If an error occurs during parsing, return error
            console.error('Error processing uploaded audio:', error);
            return res.status(500).json({
                error: true,
                code: 500,
                message: "Error processing uploaded audio",
                error
            });
        }
    }

    static async delete(req, res) {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'File ID is required'
            })
        }
        const record = await AudioFile.findByPk(id);
        if (!record) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "File Not Found"
            })
        }
        // console.log(record.filepath.split("/"));
        fs.unlinkSync(`public/audio/${record.filepath.split("/")[4]}`)
        await record.destroy();
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Audio Deleted Successfully'
        })
    }

    static async allAudioFile(req, res) {
        const companyId = req.loginAuth.record.id;
        let records
        if (companyId) {
            records = await AudioFile.findAll({
                where: { companyId }
            })
        } else {
            records = await AudioFile.findAll({})
        }
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'All Audio Files',
            data: records,
        })
    }
}

module.exports = AudioFileSTTController