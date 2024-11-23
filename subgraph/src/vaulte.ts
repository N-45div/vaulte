import {
  LoanDisbursed as LoanDisbursedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Subscription as SubscriptionEvent,
  SubscriptionPayment as SubscriptionPaymentEvent
} from "../generated/Vaulte/Vaulte"
import {
  LoanDisbursed,
  OwnershipTransferred,
  Sub,
  SubscriptionPayment
} from "../generated/schema"

export function handleLoanDisbursed(event: LoanDisbursedEvent): void {
  let entity = new LoanDisbursed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.investorAccount = event.params.investorAccount
  entity.merchantAccount = event.params.merchantAccount
  entity.amount = event.params.amount
  entity.loanCategory = event.params.loanCategory

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscription(event: SubscriptionEvent): void {
  let entity = new Sub(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.userAccount = event.params.userAccount
  entity.merchantAccount = event.params.merchantAccount
  entity.tier = event.params.tier
  entity.subTime = event.params.subTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscriptionPayment(
  event: SubscriptionPaymentEvent
): void {
  let entity = new SubscriptionPayment(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.userAccount = event.params.userAccount
  entity.merchantAccount = event.params.merchantAccount
  entity.paymentAmount = event.params.paymentAmount
  entity.paymentTime = event.params.paymentTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
