export default {
  production: true,
  serviceUrls: {
    clientUrl: 'https://20.108.188.208/', //for fallback controller should be only '/' ???
    baseApiUrl: 'https://localhost:7000/', //for fallback controller should be only '/'
    productsApiUrl: 'https://localhost:7001/', //for fallback controller should be only '/'
    authApiUrl: 'https://localhost:7002/', //for fallback controller should be only '/'
    ordersApiUrl: 'https://localhost:7003/', //for fallback controller should be only '/'
    cryptoApiUrl: 'https://localhost:7004/', //for fallback controller should be only '/'
    basketApiUrl: 'https://localhost:7005/', //for fallback controller should be only '/'
    paymentsApiUrl: 'https://localhost:7006/'
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
