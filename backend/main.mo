import Bool "mo:base/Bool";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

actor Restaurant {
  // Types
  type MenuItem = {
    id: Nat;
    name: Text;
    price: Nat;
    description: Text;
  };

  type Customer = {
    name: Text;
    phoneNumber: Text;
  };

  // Stable variables
  stable var menuItems : [MenuItem] = [];
  stable var waitlist : [Customer] = [];
  stable var nextId : Nat = 0;

  // Menu functions
  public func addMenuItem(name: Text, price: Nat, description: Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let newItem : MenuItem = {
      id;
      name;
      price;
      description;
    };
    menuItems := Array.append(menuItems, [newItem]);
    id
  };

  public query func getMenu() : async [MenuItem] {
    menuItems
  };

  // Waitlist functions
  public func addToWaitlist(name: Text, phoneNumber: Text) : async Nat {
    let newCustomer : Customer = {
      name;
      phoneNumber;
    };
    waitlist := Array.append(waitlist, [newCustomer]);
    waitlist.size()
  };

  public query func getWaitlist() : async [Customer] {
    waitlist
  };

  public query func getWaitlistPosition(phoneNumber: Text) : async ?Nat {
    let position = Array.indexOf<Customer>({ name = ""; phoneNumber }, waitlist, func (a, b) { a.phoneNumber == b.phoneNumber });
    Option.map(position, func (p : Nat) : Nat { p + 1 })
  };

  public func removeFromWaitlist(phoneNumber: Text) : async Bool {
    let (newWaitlist, removed) = Array.foldLeft<Customer, ([Customer], Bool)>(
      waitlist,
      ([], false),
      func (acc, customer) {
        if (customer.phoneNumber == phoneNumber and not acc.1) {
          (acc.0, true)
        } else {
          (Array.append(acc.0, [customer]), acc.1)
        }
      }
    );
    waitlist := newWaitlist;
    removed
  };
}
