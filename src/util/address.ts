
const web3 = require('web3')
export const validateAddress = (address: string) => {
    let result = web3.utils.isAddress(address)
    return result
}