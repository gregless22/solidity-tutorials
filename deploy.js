const Web3 = require("web3")
const { interface, bytecode } = require("./compile")
const HDWalletProvider = require("truffle-hdwallet-provider")

// TODO
const provider = new HDWalletProvider(
  "tray sleep harvest enter rule lawn maze nuclear weather truly sample creek",
  "HTTP://127.0.0.1:7545"
)

const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()
  //   console.log(accounts)

  const contract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: "0x" + bytecode,
    })
    .send({ from: accounts[0] })

  console.log(contract.options.address)
}
deploy()
