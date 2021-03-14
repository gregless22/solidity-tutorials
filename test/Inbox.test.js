const assert = require("assert")
const ganache = require("ganache-cli")
const Web3 = require("web3")
const { interface, bytecode } = require("../compile")

const provider = ganache.provider()
const web3 = new Web3(provider)

let accounts
let inbox
const INITIAL_MESSAGE = "Hello World!"
const CHANGED_MESSAGE = "New Message"

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()
  // use one of the accounts to deploy contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [INITIAL_MESSAGE],
    })
    .send({ from: accounts[0], gas: "1000000" })

  inbox.setProvider(provider)
})

describe("Inbox", () => {
  it("deploys a contract", async () => {
    assert.ok(inbox.options.address)
  })
  it("initialiser the message", async () => {
    const message = await inbox.methods.message().call()
    assert.equal(message, INITIAL_MESSAGE)
  })

  it("can change the message", async () => {
    await inbox.methods.setMessage(CHANGED_MESSAGE).send({ from: accounts[0] })
    const message = await inbox.methods.message().call()
    assert.equal(message, CHANGED_MESSAGE)
  })
})
