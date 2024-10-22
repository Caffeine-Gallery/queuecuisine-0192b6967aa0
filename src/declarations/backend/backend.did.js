export const idlFactory = ({ IDL }) => {
  const MenuItem = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'price' : IDL.Nat,
  });
  const Customer = IDL.Record({ 'name' : IDL.Text, 'phoneNumber' : IDL.Text });
  return IDL.Service({
    'addMenuItem' : IDL.Func([IDL.Text, IDL.Nat, IDL.Text], [IDL.Nat], []),
    'addToWaitlist' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'getMenu' : IDL.Func([], [IDL.Vec(MenuItem)], ['query']),
    'getWaitlist' : IDL.Func([], [IDL.Vec(Customer)], ['query']),
    'removeFromWaitlist' : IDL.Func([IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
