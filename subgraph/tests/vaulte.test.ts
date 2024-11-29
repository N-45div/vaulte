import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { LoanDisbursed } from "../generated/schema"
import { LoanDisbursed as LoanDisbursedEvent } from "../generated/Vaulte/Vaulte"
import { handleLoanDisbursed } from "../src/vaulte"
import { createLoanDisbursedEvent } from "./vaulte-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let investorAccount = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let merchantAccount = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let loanCategory = 123
    let newLoanDisbursedEvent = createLoanDisbursedEvent(
      investorAccount,
      merchantAccount,
      amount,
      loanCategory
    )
    handleLoanDisbursed(newLoanDisbursedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("LoanDisbursed created and stored", () => {
    assert.entityCount("LoanDisbursed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "LoanDisbursed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "investorAccount",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "LoanDisbursed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "merchantAccount",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "LoanDisbursed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )
    assert.fieldEquals(
      "LoanDisbursed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "loanCategory",
      "123"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
