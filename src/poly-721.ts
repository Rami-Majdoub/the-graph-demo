import { BigInt } from "@graphprotocol/graph-ts"
import {
  Poly721,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  Transfer
} from "../generated/Poly721/Poly721"
import { 
  Approve as ApproveEntity,
  Transfer as TransferEntity,
  OwnershipTransfer as OwnershipTransferEntity
} from "../generated/schema"

/*
* 
this query returns a wrong response

query token_approvals{
  approves(
    first: 5
    where: {
      tokenId: "1"
      approved: "0x0000000000000000000000000000000000000000"
    }
    orderBy: tokenId
    orderDirection: asc
  ) {
    id
    tokenId
    owner
    approved
  }
}


the id is the transaction hash of a safeTransferFrom transaction !
{
  "id": "0xed1412bbb2ea8164fdcfe0550c31545e94ab441af8dd1fb2a104cbf20de10b52",
  "tokenId": "1",
  "owner": "0xf59be01d4ab24948c6cf80ff2cda354e76ebcade",
  "approved": "0x0000000000000000000000000000000000000000"
}
yet transfers work fine.
*
*/

export function handleApproval(event: Approval): void {
  const entity = new ApproveEntity(event.transaction.hash.toHex())

  entity.tokenId = event.params.tokenId
  entity.owner = event.params.owner
  entity.approved = event.params.approved

  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract._uri(...)
  // - contract.balanceOf(...)
  // - contract.getApproved(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenURI(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  const entity = new OwnershipTransferEntity(event.transaction.hash.toHex())
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleTransfer(event: Transfer): void {
  const entity = new TransferEntity(event.transaction.hash.toHex())

  entity.tokenId = event.params.tokenId
  entity.from = event.params.from
  entity.to = event.params.to

  entity.save()
}
