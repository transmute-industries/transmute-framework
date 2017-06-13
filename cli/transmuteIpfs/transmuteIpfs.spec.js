
const {
    transmuteIpfsDeploy,
} = require('./transmuteIpfs')

describe('CLI: TransmuteIpfs', async () => {
    contract('', (accounts) => {
        let account0 = accounts[0]
        describe('transmuteIpfsDeploy', async () => {
            it('should deploy the target directory to ipfs', async () => {
                let bindingModel = {
                    env: 'local',
                    directory: './cli/mock'
                }
                let response = await transmuteIpfsDeploy(bindingModel)

                assert(response[0].path === 'mock/test.json')
                assert(response[0].hash === 'Qme98eG7WKx6VEqf3Jza7rp9CRXgSHD7o8SL5KoDggH2VX')

                assert(response[1].path === 'mock')
                assert(response[1].hash === 'QmcQZeZSxck1Bu7LkY7VjiavbP88XNngR4dzZy2NVbPaBL')
            })
        })

    })
})
