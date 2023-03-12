import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { items } from "../assets/items/items.json";
import { Dappazon } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();
  const Dappazon = await ethers.getContractFactory("Dappazon");
  const dappazon = await Dappazon.deploy();

  await dappazon.deployed();

  console.log(
    `Dappazon deployed to ${dappazon.address}`
  );

  const arrayItems: Array<Dappazon.ItemStruct> = [];

  items.forEach(i => {
    arrayItems.push({
      id: BigNumber.from(i.id),
      category: i.category,
      image: i.image,
      name: i.name,
      cost: BigNumber.from(i.price),
      rating: BigNumber.from(i.rating),
      stock: BigNumber.from(i.stock)
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
