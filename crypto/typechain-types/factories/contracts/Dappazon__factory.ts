/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Dappazon, DappazonInterface } from "../../contracts/Dappazon";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
    ],
    name: "Buy",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "cost",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
    ],
    name: "ListItem",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
    ],
    name: "getItem",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "string",
            name: "image",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "cost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rating",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stock",
            type: "uint256",
          },
        ],
        internalType: "struct Dappazon.Item",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
    ],
    name: "isListed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "items",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "category",
        type: "string",
      },
      {
        internalType: "string",
        name: "image",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "cost",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rating",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stock",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "itemsCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "string",
            name: "image",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "cost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rating",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stock",
            type: "uint256",
          },
        ],
        internalType: "struct Dappazon.Item[]",
        name: "_items",
        type: "tuple[]",
      },
    ],
    name: "listItems",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "orderCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "orders",
    outputs: [
      {
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "string",
            name: "image",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "cost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rating",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stock",
            type: "uint256",
          },
        ],
        internalType: "struct Dappazon.Item",
        name: "item",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "queryItems",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "string",
            name: "image",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "cost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rating",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stock",
            type: "uint256",
          },
        ],
        internalType: "struct Dappazon.Item[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "category",
            type: "string",
          },
          {
            internalType: "string",
            name: "image",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "cost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rating",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stock",
            type: "uint256",
          },
        ],
        internalType: "struct Dappazon.Item[]",
        name: "_items",
        type: "tuple[]",
      },
    ],
    name: "unlistItems",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5062000032620000266200003860201b60201c565b6200004060201b60201c565b62000104565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b612ecb80620001146000396000f3fe6080604052600436106100dd5760003560e01c80638c1f68861161007f578063d96a094a11610059578063d96a094a146102b5578063e65c4978146102d1578063f2fde38b146102fa578063fcce488314610323576100dd565b80638c1f68861461021c5780638da5cb5b14610247578063bfb231d214610272576100dd565b8063713d856b116100bb578063713d856b14610161578063715018a61461019e578063793b8c6d146101b55780638268eec3146101f3576100dd565b806312848dec146100e25780633129e7731461010d5780633ccfd60b1461014a575b600080fd5b3480156100ee57600080fd5b506100f7610360565b604051610104919061209c565b60405180910390f35b34801561011957600080fd5b50610134600480360381019061012f91906120fe565b61059d565b60405161014191906121d5565b60405180910390f35b34801561015657600080fd5b5061015f6107d6565b005b34801561016d57600080fd5b5061018860048036038101906101839190612255565b61085e565b6040516101959190612291565b60405180910390f35b3480156101aa57600080fd5b506101b3610876565b005b3480156101c157600080fd5b506101dc60048036038101906101d791906122ac565b61088a565b6040516101ea9291906122ec565b60405180910390f35b3480156101ff57600080fd5b5061021a60048036038101906102159190612649565b610aa3565b005b34801561022857600080fd5b50610231610af5565b60405161023e9190612291565b60405180910390f35b34801561025357600080fd5b5061025c610afb565b60405161026991906126a1565b60405180910390f35b34801561027e57600080fd5b50610299600480360381019061029491906120fe565b610b24565b6040516102ac9796959493929190612706565b60405180910390f35b6102cf60048036038101906102ca91906120fe565b610d0e565b005b3480156102dd57600080fd5b506102f860048036038101906102f39190612649565b610fa8565b005b34801561030657600080fd5b50610321600480360381019061031c9190612255565b61101e565b005b34801561032f57600080fd5b5061034a600480360381019061034591906120fe565b6110a1565b60405161035791906127a5565b60405180910390f35b60606003805480602002602001604051908101604052809291908181526020016000905b8282101561059457838290600052602060002090600702016040518060e0016040529081600082015481526020016001820180546103c1906127ef565b80601f01602080910402602001604051908101604052809291908181526020018280546103ed906127ef565b801561043a5780601f1061040f5761010080835404028352916020019161043a565b820191906000526020600020905b81548152906001019060200180831161041d57829003601f168201915b50505050508152602001600282018054610453906127ef565b80601f016020809104026020016040519081016040528092919081815260200182805461047f906127ef565b80156104cc5780601f106104a1576101008083540402835291602001916104cc565b820191906000526020600020905b8154815290600101906020018083116104af57829003601f168201915b505050505081526020016003820180546104e5906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054610511906127ef565b801561055e5780601f106105335761010080835404028352916020019161055e565b820191906000526020600020905b81548152906001019060200180831161054157829003601f168201915b50505050508152602001600482015481526020016005820154815260200160068201548152505081526020019060010190610384565b50505050905090565b6105a5611ded565b6003600160026000858152602001908152602001600020546105c7919061284f565b815481106105d8576105d7612883565b5b90600052602060002090600702016040518060e00160405290816000820154815260200160018201805461060b906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054610637906127ef565b80156106845780601f1061065957610100808354040283529160200191610684565b820191906000526020600020905b81548152906001019060200180831161066757829003601f168201915b5050505050815260200160028201805461069d906127ef565b80601f01602080910402602001604051908101604052809291908181526020018280546106c9906127ef565b80156107165780601f106106eb57610100808354040283529160200191610716565b820191906000526020600020905b8154815290600101906020018083116106f957829003601f168201915b5050505050815260200160038201805461072f906127ef565b80601f016020809104026020016040519081016040528092919081815260200182805461075b906127ef565b80156107a85780601f1061077d576101008083540402835291602001916107a8565b820191906000526020600020905b81548152906001019060200180831161078b57829003601f168201915b5050505050815260200160048201548152602001600582015481526020016006820154815250509050919050565b6107de6110ce565b60006107e8610afb565b73ffffffffffffffffffffffffffffffffffffffff164760405161080b906128e3565b60006040518083038185875af1925050503d8060008114610848576040519150601f19603f3d011682016040523d82523d6000602084013e61084d565b606091505b505090508061085b57600080fd5b50565b60046020528060005260406000206000915090505481565b61087e6110ce565b610888600061114c565b565b600560205281600052604060002060205280600052604060002060009150915050806000015490806001016040518060e0016040529081600082015481526020016001820180546108da906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054610906906127ef565b80156109535780601f1061092857610100808354040283529160200191610953565b820191906000526020600020905b81548152906001019060200180831161093657829003601f168201915b5050505050815260200160028201805461096c906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054610998906127ef565b80156109e55780601f106109ba576101008083540402835291602001916109e5565b820191906000526020600020905b8154815290600101906020018083116109c857829003601f168201915b505050505081526020016003820180546109fe906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054610a2a906127ef565b8015610a775780601f10610a4c57610100808354040283529160200191610a77565b820191906000526020600020905b815481529060010190602001808311610a5a57829003601f168201915b505050505081526020016004820154815260200160058201548152602001600682015481525050905082565b610aab6110ce565b60005b8151811015610af157610ade828281518110610acd57610acc612883565b5b602002602001015160000151611210565b8080610ae9906128f8565b915050610aae565b5050565b60015481565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60038181548110610b3457600080fd5b9060005260206000209060070201600091509050806000015490806001018054610b5d906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054610b89906127ef565b8015610bd65780601f10610bab57610100808354040283529160200191610bd6565b820191906000526020600020905b815481529060010190602001808311610bb957829003601f168201915b505050505090806002018054610beb906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054610c17906127ef565b8015610c645780601f10610c3957610100808354040283529160200191610c64565b820191906000526020600020905b815481529060010190602001808311610c4757829003601f168201915b505050505090806003018054610c79906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054610ca5906127ef565b8015610cf25780601f10610cc757610100808354040283529160200191610cf2565b820191906000526020600020905b815481529060010190602001808311610cd557829003601f168201915b5050505050908060040154908060050154908060060154905087565b600080610d1a836115c4565b9150915081610d5e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d559061298c565b60405180910390fd5b34816080015114610da4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d9b906129f8565b60405180910390fd5b60006040518060400160405280428152602001838152509050600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000815480929190610e0d906128f8565b919050555080600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054815260200190815260200160002060008201518160000155602082015181600101600082015181600001556020820151816001019081610ed49190612bc4565b506040820151816002019081610eea9190612bc4565b506060820151816003019081610f009190612bc4565b506080820151816004015560a0820151816005015560c0820151816006015550509050507f1cbc5ab135991bd2b6a4b034a04aa2aa086dac1371cb9b16b8b5e2ed6b036bed33600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548460000151604051610f9a93929190612c96565b60405180910390a150505050565b610fb06110ce565b60005b815181101561101a576000828281518110610fd157610fd0612883565b5b60200260200101519050611006816000015182602001518360400151846060015185608001518660a001518760c00151611c21565b508080611012906128f8565b915050610fb3565b5050565b6110266110ce565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603611095576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161108c90612d3f565b60405180910390fd5b61109e8161114c565b50565b60008060026000848152602001908152602001600020541180156110c757506001548211155b9050919050565b6110d6611d9b565b73ffffffffffffffffffffffffffffffffffffffff166110f4610afb565b73ffffffffffffffffffffffffffffffffffffffff161461114a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161114190612dab565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b611219816110a1565b156115c157600060016002600084815260200190815260200160002054611240919061284f565b905060006001600380549050611256919061284f565b905060006003828154811061126e5761126d612883565b5b90600052602060002090600702016040518060e0016040529081600082015481526020016001820180546112a1906127ef565b80601f01602080910402602001604051908101604052809291908181526020018280546112cd906127ef565b801561131a5780601f106112ef5761010080835404028352916020019161131a565b820191906000526020600020905b8154815290600101906020018083116112fd57829003601f168201915b50505050508152602001600282018054611333906127ef565b80601f016020809104026020016040519081016040528092919081815260200182805461135f906127ef565b80156113ac5780601f10611381576101008083540402835291602001916113ac565b820191906000526020600020905b81548152906001019060200180831161138f57829003601f168201915b505050505081526020016003820180546113c5906127ef565b80601f01602080910402602001604051908101604052809291908181526020018280546113f1906127ef565b801561143e5780601f106114135761010080835404028352916020019161143e565b820191906000526020600020905b81548152906001019060200180831161142157829003601f168201915b50505050508152602001600482015481526020016005820154815260200160068201548152505090508060000151841461152b5760018361147f9190612dcb565b60026000836000015181526020019081526020016000208190555080600384815481106114af576114ae612883565b5b90600052602060002090600702016000820151816000015560208201518160010190816114dc9190612bc4565b5060408201518160020190816114f29190612bc4565b5060608201518160030190816115089190612bc4565b506080820151816004015560a0820151816005015560c082015181600601559050505b6002600085815260200190815260200160002060009055600380548061155457611553612dff565b5b60019003818190600052602060002090600702016000808201600090556001820160006115819190611e2a565b6002820160006115919190611e2a565b6003820160006115a19190611e2a565b600482016000905560058201600090556006820160009055505090555050505b50565b60006115ce611ded565b60006115d984611da3565b90506001816006015403611807578060060160008154809291906115fc90612e2e565b919050555061160e8160000154611210565b600181806040518060e001604052908160008201548152602001600182018054611637906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054611663906127ef565b80156116b05780601f10611685576101008083540402835291602001916116b0565b820191906000526020600020905b81548152906001019060200180831161169357829003601f168201915b505050505081526020016002820180546116c9906127ef565b80601f01602080910402602001604051908101604052809291908181526020018280546116f5906127ef565b80156117425780601f1061171757610100808354040283529160200191611742565b820191906000526020600020905b81548152906001019060200180831161172557829003601f168201915b5050505050815260200160038201805461175b906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054611787906127ef565b80156117d45780601f106117a9576101008083540402835291602001916117d4565b820191906000526020600020905b8154815290600101906020018083116117b757829003601f168201915b50505050508152602001600482015481526020016005820154815260200160068201548152505090509250925050611c1c565b600181600601541115611a275780600601600081548092919061182990612e2e565b9190505550600181806040518060e001604052908160008201548152602001600182018054611857906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054611883906127ef565b80156118d05780601f106118a5576101008083540402835291602001916118d0565b820191906000526020600020905b8154815290600101906020018083116118b357829003601f168201915b505050505081526020016002820180546118e9906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054611915906127ef565b80156119625780601f1061193757610100808354040283529160200191611962565b820191906000526020600020905b81548152906001019060200180831161194557829003601f168201915b5050505050815260200160038201805461197b906127ef565b80601f01602080910402602001604051908101604052809291908181526020018280546119a7906127ef565b80156119f45780601f106119c9576101008083540402835291602001916119f4565b820191906000526020600020905b8154815290600101906020018083116119d757829003601f168201915b50505050508152602001600482015481526020016005820154815260200160068201548152505090509250925050611c1c565b600081806040518060e001604052908160008201548152602001600182018054611a50906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054611a7c906127ef565b8015611ac95780601f10611a9e57610100808354040283529160200191611ac9565b820191906000526020600020905b815481529060010190602001808311611aac57829003601f168201915b50505050508152602001600282018054611ae2906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054611b0e906127ef565b8015611b5b5780601f10611b3057610100808354040283529160200191611b5b565b820191906000526020600020905b815481529060010190602001808311611b3e57829003601f168201915b50505050508152602001600382018054611b74906127ef565b80601f0160208091040260200160405190810160405280929190818152602001828054611ba0906127ef565b8015611bed5780601f10611bc257610100808354040283529160200191611bed565b820191906000526020600020905b815481529060010190602001808311611bd057829003601f168201915b505050505081526020016004820154815260200160058201548152602001600682015481525050905092509250505b915091565b6000871480611c425750600087118015611c415750611c3f876110a1565b155b5b15611d925760016000815480929190611c5a906128f8565b91905055506001600380549050611c719190612dcb565b6002600060015481526020019081526020016000208190555060036040518060e001604052806001548152602001888152602001878152602001868152602001858152602001848152602001838152509080600181540180825580915050600190039060005260206000209060070201600090919091909150600082015181600001556020820151816001019081611d099190612bc4565b506040820151816002019081611d1f9190612bc4565b506060820151816003019081611d359190612bc4565b506080820151816004015560a0820151816005015560c0820151816006015550507fe7a159d261acfce11f7883a880d1ec77857419d8e4001e5de6e574859407338d868483604051611d8993929190612e57565b60405180910390a15b50505050505050565b600033905090565b6000600360016002600085815260200190815260200160002054611dc7919061284f565b81548110611dd857611dd7612883565b5b90600052602060002090600702019050919050565b6040518060e00160405280600081526020016060815260200160608152602001606081526020016000815260200160008152602001600081525090565b508054611e36906127ef565b6000825580601f10611e485750611e67565b601f016020900490600052602060002090810190611e669190611e6a565b5b50565b5b80821115611e83576000816000905550600101611e6b565b5090565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000819050919050565b611ec681611eb3565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611f06578082015181840152602081019050611eeb565b60008484015250505050565b6000601f19601f8301169050919050565b6000611f2e82611ecc565b611f388185611ed7565b9350611f48818560208601611ee8565b611f5181611f12565b840191505092915050565b600060e083016000830151611f746000860182611ebd565b5060208301518482036020860152611f8c8282611f23565b91505060408301518482036040860152611fa68282611f23565b91505060608301518482036060860152611fc08282611f23565b9150506080830151611fd56080860182611ebd565b5060a0830151611fe860a0860182611ebd565b5060c0830151611ffb60c0860182611ebd565b508091505092915050565b60006120128383611f5c565b905092915050565b6000602082019050919050565b600061203282611e87565b61203c8185611e92565b93508360208202850161204e85611ea3565b8060005b8581101561208a578484038952815161206b8582612006565b94506120768361201a565b925060208a01995050600181019050612052565b50829750879550505050505092915050565b600060208201905081810360008301526120b68184612027565b905092915050565b6000604051905090565b600080fd5b600080fd5b6120db81611eb3565b81146120e657600080fd5b50565b6000813590506120f8816120d2565b92915050565b600060208284031215612114576121136120c8565b5b6000612122848285016120e9565b91505092915050565b600060e0830160008301516121436000860182611ebd565b506020830151848203602086015261215b8282611f23565b915050604083015184820360408601526121758282611f23565b9150506060830151848203606086015261218f8282611f23565b91505060808301516121a46080860182611ebd565b5060a08301516121b760a0860182611ebd565b5060c08301516121ca60c0860182611ebd565b508091505092915050565b600060208201905081810360008301526121ef818461212b565b905092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000612222826121f7565b9050919050565b61223281612217565b811461223d57600080fd5b50565b60008135905061224f81612229565b92915050565b60006020828403121561226b5761226a6120c8565b5b600061227984828501612240565b91505092915050565b61228b81611eb3565b82525050565b60006020820190506122a66000830184612282565b92915050565b600080604083850312156122c3576122c26120c8565b5b60006122d185828601612240565b92505060206122e2858286016120e9565b9150509250929050565b60006040820190506123016000830185612282565b8181036020830152612313818461212b565b90509392505050565b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61235982611f12565b810181811067ffffffffffffffff8211171561237857612377612321565b5b80604052505050565b600061238b6120be565b90506123978282612350565b919050565b600067ffffffffffffffff8211156123b7576123b6612321565b5b602082029050602081019050919050565b600080fd5b600080fd5b600080fd5b600080fd5b600067ffffffffffffffff8211156123f7576123f6612321565b5b61240082611f12565b9050602081019050919050565b82818337600083830152505050565b600061242f61242a846123dc565b612381565b90508281526020810184848401111561244b5761244a6123d7565b5b61245684828561240d565b509392505050565b600082601f8301126124735761247261231c565b5b813561248384826020860161241c565b91505092915050565b600060e082840312156124a2576124a16123cd565b5b6124ac60e0612381565b905060006124bc848285016120e9565b600083015250602082013567ffffffffffffffff8111156124e0576124df6123d2565b5b6124ec8482850161245e565b602083015250604082013567ffffffffffffffff8111156125105761250f6123d2565b5b61251c8482850161245e565b604083015250606082013567ffffffffffffffff8111156125405761253f6123d2565b5b61254c8482850161245e565b6060830152506080612560848285016120e9565b60808301525060a0612574848285016120e9565b60a08301525060c0612588848285016120e9565b60c08301525092915050565b60006125a76125a28461239c565b612381565b905080838252602082019050602084028301858111156125ca576125c96123c8565b5b835b8181101561261157803567ffffffffffffffff8111156125ef576125ee61231c565b5b8086016125fc898261248c565b855260208501945050506020810190506125cc565b5050509392505050565b600082601f8301126126305761262f61231c565b5b8135612640848260208601612594565b91505092915050565b60006020828403121561265f5761265e6120c8565b5b600082013567ffffffffffffffff81111561267d5761267c6120cd565b5b6126898482850161261b565b91505092915050565b61269b81612217565b82525050565b60006020820190506126b66000830184612692565b92915050565b600082825260208201905092915050565b60006126d882611ecc565b6126e281856126bc565b93506126f2818560208601611ee8565b6126fb81611f12565b840191505092915050565b600060e08201905061271b600083018a612282565b818103602083015261272d81896126cd565b9050818103604083015261274181886126cd565b9050818103606083015261275581876126cd565b90506127646080830186612282565b61277160a0830185612282565b61277e60c0830184612282565b98975050505050505050565b60008115159050919050565b61279f8161278a565b82525050565b60006020820190506127ba6000830184612796565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061280757607f821691505b60208210810361281a576128196127c0565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061285a82611eb3565b915061286583611eb3565b925082820390508181111561287d5761287c612820565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600081905092915050565b50565b60006128cd6000836128b2565b91506128d8826128bd565b600082019050919050565b60006128ee826128c0565b9150819050919050565b600061290382611eb3565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361293557612934612820565b5b600182019050919050565b7f4974656d206f7574206f662073746f636b000000000000000000000000000000600082015250565b60006129766011836126bc565b915061298182612940565b602082019050919050565b600060208201905081810360008301526129a581612969565b9050919050565b7f507269636520646f206e6f7420657175616c0000000000000000000000000000600082015250565b60006129e26012836126bc565b91506129ed826129ac565b602082019050919050565b60006020820190508181036000830152612a11816129d5565b9050919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302612a7a7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82612a3d565b612a848683612a3d565b95508019841693508086168417925050509392505050565b6000819050919050565b6000612ac1612abc612ab784611eb3565b612a9c565b611eb3565b9050919050565b6000819050919050565b612adb83612aa6565b612aef612ae782612ac8565b848454612a4a565b825550505050565b600090565b612b04612af7565b612b0f818484612ad2565b505050565b5b81811015612b3357612b28600082612afc565b600181019050612b15565b5050565b601f821115612b7857612b4981612a18565b612b5284612a2d565b81016020851015612b61578190505b612b75612b6d85612a2d565b830182612b14565b50505b505050565b600082821c905092915050565b6000612b9b60001984600802612b7d565b1980831691505092915050565b6000612bb48383612b8a565b9150826002028217905092915050565b612bcd82611ecc565b67ffffffffffffffff811115612be657612be5612321565b5b612bf082546127ef565b612bfb828285612b37565b600060209050601f831160018114612c2e5760008415612c1c578287015190505b612c268582612ba8565b865550612c8e565b601f198416612c3c86612a18565b60005b82811015612c6457848901518255600182019150602085019450602081019050612c3f565b86831015612c815784890151612c7d601f891682612b8a565b8355505b6001600288020188555050505b505050505050565b6000606082019050612cab6000830186612692565b612cb86020830185612282565b612cc56040830184612282565b949350505050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000612d296026836126bc565b9150612d3482612ccd565b604082019050919050565b60006020820190508181036000830152612d5881612d1c565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000612d956020836126bc565b9150612da082612d5f565b602082019050919050565b60006020820190508181036000830152612dc481612d88565b9050919050565b6000612dd682611eb3565b9150612de183611eb3565b9250828201905080821115612df957612df8612820565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fd5b6000612e3982611eb3565b915060008203612e4c57612e4b612820565b5b600182039050919050565b60006060820190508181036000830152612e7181866126cd565b9050612e806020830185612282565b612e8d6040830184612282565b94935050505056fea2646970667358221220c538049b0f771be2db8ce93ba908f6f94e51943ad5480b3dde48e3810d78f69464736f6c63430008120033";

type DappazonConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DappazonConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Dappazon__factory extends ContractFactory {
  constructor(...args: DappazonConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Dappazon> {
    return super.deploy(overrides || {}) as Promise<Dappazon>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Dappazon {
    return super.attach(address) as Dappazon;
  }
  override connect(signer: Signer): Dappazon__factory {
    return super.connect(signer) as Dappazon__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DappazonInterface {
    return new utils.Interface(_abi) as DappazonInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Dappazon {
    return new Contract(address, _abi, signerOrProvider) as Dappazon;
  }
}
