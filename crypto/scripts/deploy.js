"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const items_json_1 = require("../../src/assets/items/items.json");
const ethers_1 = require("ethers");
async function main() {
    const [deployer] = await hardhat_1.ethers.getSigners();
    const Dappazon = await hardhat_1.ethers.getContractFactory("Dappazon");
    const dappazon = await Dappazon.deploy();
    await dappazon.deployed();
    console.log(`Dappazon deployed to ${dappazon.address}`);
    const arrayItems = [];
    items_json_1.items.forEach(i => {
        arrayItems.push({
            id: ethers_1.BigNumber.from(i.id),
            category: i.category,
            image: i.image,
            name: i.name,
            cost: ethers_1.BigNumber.from(i.price),
            rating: ethers_1.BigNumber.from(i.rating),
            stock: ethers_1.BigNumber.from(i.stock)
        });
    });
    const transaction = await dappazon.connect(deployer).listItems(arrayItems);
    await transaction.wait();
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
