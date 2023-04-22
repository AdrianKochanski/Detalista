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

        public static async Task<Tuple<Web3, ContractHandler>> GetContractHandler(IConfiguration config) {
            BigInteger chainId =  Convert.ToInt32(config.GetSection("Hardhat:ChainId").Value);
            string deployerPrivateKey = config.GetSection("Hardhat:Account1_PK").Value;
            string dappazonAddress = config.GetSection("Hardhat:DappazonAddress").Value;

            var account = new Account(deployerPrivateKey, chainId);
            var web3 = new Web3(account);
            web3.TransactionManager.UseLegacyAsDefault = true;

            var code = await web3.Eth.GetCode.SendRequestAsync(dappazonAddress);

            if(code != null && code != "0x") {
                ContractHandler = web3.Eth.GetContractHandler(dappazonAddress);
                return new Tuple<Web3, ContractHandler>(web3, ContractHandler);
            }

            return new Tuple<Web3, ContractHandler>(web3, null);
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