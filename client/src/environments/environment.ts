export default {
  production: false,
  serviceUrls: {
    apiUrl: 'https://localhost:7000/',
    authApiUrl: 'https://localhost:7002/',
  },
  crypto: {
    31337: {
      jsonRPC: "http://127.0.0.1:8545/",
      dappazon: {
        address: "0xb5ae3e2883934457cb593793f034b401867e1372"
      }
    },
    11155111: {
      jsonRPC: "https://rpc.sepolia.org/",
      dappazon: {
        address: "0x969a288645b2d6aa40d43668caeef9ec36d8ba14"
      }
    },
    444444444500: {
      jsonRPC: "http://testchain.nethereum.com:8545/",
      dappazon: {
        address: "???"
      }
    }
  }
}
