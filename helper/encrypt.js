const { default: axios } = require("axios")
const Logger = require("./logger")
const id = process.argv[2]
const runEncrypt = async (agentId) => {
    await axios.post(`http://localhost:8080/agent/auth/encrypt`, { id: agentId }).then(res => {
        Logger.success(`Password Of Agent ID ${agentId} Encrypted`);
    }).catch(err => {
        Logger.error(`Unable To Encrypt Password Of Agent ID ${agentId}`);
    })
}

runEncrypt(id)