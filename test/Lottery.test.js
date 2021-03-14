const assert = require("assert")
const ganache = require("ganache-cli")
const Web3 = require("web3")
const { interface, bytecode } = require("../compile")

const provider = ganache.provider()
const web3 = new Web3(provider)

let accounts
let lottery
const INITIAL_MESSAGE = "Hello World!"
const CHANGED_MESSAGE = "New Message"

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()
  // use one of the accounts to deploy contract
  lottery = await new web3.eth.Lottery(JSON.parse(interface))
    .deploy({
      data: bytecode,
    })
    .send({ from: accounts[0], gas: "1000000" })

  inbox.setProvider(provider)
})

describe("Lottery", () => {
  it("deploys a new lottery", async () => {
    assert.ok(lottery.options.address)
  })
})
