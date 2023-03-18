import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { items, brands, types } from "../assets/items/items.json";
import { Dappazon } from "../typechain-types";

const tokens = (n: number) => {
  return ethers.utils.parseUnits(n.toString(10), 'ether')
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const Dappazon = await ethers.getContractFactory("Dappazon");
  const dappazon: Dappazon = await Dappazon.deploy() as Dappazon;

  await dappazon.deployed();

  console.log(
    `Dappazon deployed to ${dappazon.address}`
  );

  const arrayItems: Array<Dappazon.NewItemStruct> = [];
  const arrayBrands: Array<Dappazon.BrandStruct> = [];
  const arrayTypes: Array<Dappazon.CategoryStruct> = [];

  brands.forEach(b => {
    arrayBrands.push({
      id: BigNumber.from(b.id),
      name: b.name
    });

    console.log(
      `Packed brands ${b.id}: ${b.name}`
    );
  });

  const transBrand = await dappazon.connect(deployer).updateBrands(arrayBrands);
  await transBrand.wait();

  console.log(
    `Brands updated count: ${arrayBrands.length}`
  );

  types.forEach(c => {
    arrayTypes.push({
      id: BigNumber.from(c.id),
      name: c.name
    });

    console.log(
      `Packed types ${c.id}: ${c.name}`
    );
  });

  const transTypes = await dappazon.connect(deployer).updateCategories(arrayTypes);
  await transTypes.wait();

  console.log(
    `Categories updated count: ${arrayTypes.length}`
  );

  items.forEach(i => {
    arrayItems.push({
      id: BigNumber.from(i.id),
      categoryId: BigNumber.from(i.category),
      brandId: BigNumber.from(i.brand),
      description: i.description,
      image: i.image,
      name: i.name,
      cost: BigNumber.from(tokens(Number.parseFloat(i.price))),
      rating: BigNumber.from(i.rating),
      stock: BigNumber.from(i.stock)
    });

    console.log(
      `Packed items ${i.id}: ${i.name}`
    );
  });

  const transaction = await dappazon.connect(deployer).listItems(arrayItems);
  await transaction.wait();

  console.log(
    `Listed items count: ${arrayItems.length}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
