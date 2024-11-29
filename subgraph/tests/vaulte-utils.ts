import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  LoanDisbursed,
  OwnershipTransferred,
  Subscription,
  SubscriptionPayment
} from "../generated/Vaulte/Vaulte"

export function createLoanDisbursedEvent(
  investorAccount: Address,
  merchantAccount: Address,
  amount: BigInt,
  loanCategory: i32
): LoanDisbursed {
  let loanDisbursedEvent = changetype<LoanDisbursed>(newMockEvent())

  loanDisbursedEvent.parameters = new Array()

  loanDisbursedEvent.parameters.push(
    new ethereum.EventParam(
      "investorAccount",
      ethereum.Value.fromAddress(investorAccount)
    )
  )
  loanDisbursedEvent.parameters.push(
    new ethereum.EventParam(
      "merchantAccount",
      ethereum.Value.fromAddress(merchantAccount)
    )
  )
  loanDisbursedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  loanDisbursedEvent.parameters.push(
    new ethereum.EventParam(
      "loanCategory",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(loanCategory))
    )
  )

  return loanDisbursedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSubscriptionEvent(
  userAccount: Address,
  merchantAccount: Address,
  tier: BigInt,
  subTime: BigInt
): Subscription {
  let subscriptionEvent = changetype<Subscription>(newMockEvent())

  subscriptionEvent.parameters = new Array()

  subscriptionEvent.parameters.push(
    new ethereum.EventParam(
      "userAccount",
      ethereum.Value.fromAddress(userAccount)
    )
  )
  subscriptionEvent.parameters.push(
    new ethereum.EventParam(
      "merchantAccount",
      ethereum.Value.fromAddress(merchantAccount)
    )
  )
  subscriptionEvent.parameters.push(
    new ethereum.EventParam("tier", ethereum.Value.fromUnsignedBigInt(tier))
  )
  subscriptionEvent.parameters.push(
    new ethereum.EventParam(
      "subTime",
      ethereum.Value.fromUnsignedBigInt(subTime)
    )
  )

  return subscriptionEvent
}

export function createSubscriptionPaymentEvent(
  userAccount: Address,
  merchantAccount: Address,
  paymentAmount: BigInt,
  paymentTime: BigInt
): SubscriptionPayment {
  let subscriptionPaymentEvent = changetype<SubscriptionPayment>(newMockEvent())

  subscriptionPaymentEvent.parameters = new Array()

  subscriptionPaymentEvent.parameters.push(
    new ethereum.EventParam(
      "userAccount",
      ethereum.Value.fromAddress(userAccount)
    )
  )
  subscriptionPaymentEvent.parameters.push(
    new ethereum.EventParam(
      "merchantAccount",
      ethereum.Value.fromAddress(merchantAccount)
    )
  )
  subscriptionPaymentEvent.parameters.push(
    new ethereum.EventParam(
      "paymentAmount",
      ethereum.Value.fromUnsignedBigInt(paymentAmount)
    )
  )
  subscriptionPaymentEvent.parameters.push(
    new ethereum.EventParam(
      "paymentTime",
      ethereum.Value.fromUnsignedBigInt(paymentTime)
    )
  )

  return subscriptionPaymentEvent
}
