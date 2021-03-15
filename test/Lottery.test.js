const assert = require("assert")
const ganache = require("ganache-cli")
const Web3 = require("web3")
const { interface, bytecode } = require("../compile")

const provider = ganache.provider()
const web3 = new Web3(provider)

let accounts
let lottery
let MANAGER
let PLAYER1
let PLAYER2

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()
  MANAGER = accounts[0]
  PLAYER1 = accounts[1]
  PLAYER2 = accounts[2]
  // use one of the accounts to deploy contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: "0x" + bytecode,
    })
    .send({ from: MANAGER, gas: "1000000" })

  lottery.setProvider(provider)
})

describe("Lottery", () => {
  it("deploys a new lottery", async () => {
    assert.ok(lottery.options.address)
  })
  it("allows one account to enter a lottery", async () => {
    await lottery.methods.enter().send({
      from: PLAYER1,
      gas: "1000000",
      value: web3.utils.toWei("0.02", "ether"),
    })
    const participants = await lottery.methods
      .getParticipants()
      .call({ from: MANAGER })

    assert.equal(PLAYER1, participants[0])
    assert.equal(participants.length, 1)
  })
  it("allows multiple accounts to enter", async () => {
    await lottery.methods.enter().send({
      from: PLAYER1,
      gas: "1000000",
      value: web3.utils.toWei("0.02", "ether"),
    }),
      await lottery.methods.enter().send({
        from: PLAYER2,
        gas: "1000000",
        value: web3.utils.toWei("0.02", "ether"),
      })
    const participants = await lottery.methods
      .getParticipants()
      .call({ from: MANAGER })
    assert.equal(participants.length, 2)
  })
  it("dont allow to enter without enough ether", async () => {
    try {
      await lottery.methods.enter().send({
        from: PLAYER1,
        gas: "1000000",
        value: web3.utils.toWei("0.002", "ether"),
      })
      assert(false)
    } catch (err) {
      assert(err)
    }

    const participants = await lottery.methods
      .getParticipants()
      .call({ from: MANAGER })
    assert.equal(participants.length, 0)
  })

  it("pick winner is not manager", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: PLAYER1,
        gas: "1000000",
      })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it("pick winner is a manager", async () => {
    await lottery.methods.enter().send({
      from: PLAYER2,
      gas: "1000000",
      value: web3.utils.toWei("2", "ether"),
    })

    const intialBalance = await web3.eth.getBalance(PLAYER2)

    await lottery.methods.pickWinner().send({
      from: MANAGER,
      gas: "1000000",
    })

    const finalBalance = await web3.eth.getBalance(PLAYER2)
    const difference = finalBalance - intialBalance
    assert(difference > web3.utils.toWei("1.8", "ether")) // 1.8 allows for some gas loss

    const participants = await lottery.methods
      .getParticipants()
      .call({ from: MANAGER })
    assert.equal(participants.length, 0)
  })
})
