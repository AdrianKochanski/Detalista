using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Nethereum.Hex.HexTypes;

namespace Core.Entities.Crypto
{
    public class CryptoProductParams
    {
        public int Id {get; set;}
        public string Name {get; set;}
        public int Brand {get; set;}
        public int Category {get; set;}
        public string Image {get; set;}
        public string Description {get; set;}
        public string Price {get; set;}
        public int Rating {get; set;}
        public int Stock {get; set;}
    }
}