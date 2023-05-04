using System;
using System.Threading.Tasks;
using Nethereum.Web3;
using Nethereum.Web3.Accounts;
using System.Numerics;
using Microsoft.Extensions.Configuration;
using Nethereum.Contracts.ContractHandlers;

namespace Core.Helpers
{
    public static class CryptoConnector
    {
        public static ContractHandler ContractHandler { get; private set; }

        public static async Task<Tuple<Web3, ContractHandler>> GetContractHandler(IConfiguration config, string contractId = "") {
            string dappazonAddress = config.GetSection("Hardhat:DappazonAddress").Value;

            if(!string.IsNullOrWhiteSpace(contractId)) {
                dappazonAddress = contractId;
            }
            
            var url = config.GetSection("Hardhat:ChainUrl").Value;
            var privateKey = config.GetSection("Hardhat:Account1_PK").Value;
            var account = new Account(privateKey);
            var web3 = new Web3(account, url);

            web3.TransactionManager.UseLegacyAsDefault = true;

            var code = await web3.Eth.GetCode.SendRequestAsync(dappazonAddress);

            if(code != null && code != "0x") {
                Console.WriteLine("Contract found at: " + dappazonAddress);
                ContractHandler = web3.Eth.GetContractHandler(dappazonAddress);
                return new Tuple<Web3, ContractHandler>(web3, ContractHandler);
            }
            else {
                Console.WriteLine("Contract doesn't exist at: " + dappazonAddress);
                return new Tuple<Web3, ContractHandler>(web3, null);
            }
        }

        public static async Task<bool> ContractInitialized(IConfiguration config) {
            if(ContractHandler == null) {
                ContractHandler = (await CryptoConnector.GetContractHandler(config)).Item2;
            }

            if(ContractHandler == null) return false;
            else return true;
        }
    }
}