const T = require('../lib/transmute-framework').default

T.init()

const test = async () => {
  const accounts = await T.getAccounts()
  const address = accounts[0]
  const message = 'hello'
  const { messageBufferHex, signature } = await T.Toolbox.sign(address, message)
  let recoveredAddress = await T.Toolbox.recover(address, messageBufferHex, signature)
  console.log(address)
  console.log(recoveredAddress)
  if (address === recoveredAddress) {
    console.log('Success')
  } else {
    console.log('Failure')
  }
}

test()
