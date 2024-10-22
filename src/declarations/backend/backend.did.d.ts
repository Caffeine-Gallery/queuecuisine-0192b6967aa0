import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Customer { 'name' : string, 'phoneNumber' : string }
export interface MenuItem {
  'id' : bigint,
  'name' : string,
  'description' : string,
  'price' : bigint,
}
export interface _SERVICE {
  'addMenuItem' : ActorMethod<[string, bigint, string], bigint>,
  'addToWaitlist' : ActorMethod<[string, string], undefined>,
  'getMenu' : ActorMethod<[], Array<MenuItem>>,
  'getWaitlist' : ActorMethod<[], Array<Customer>>,
  'removeFromWaitlist' : ActorMethod<[string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
