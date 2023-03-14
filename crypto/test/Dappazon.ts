import { BigNumber, ContractTransaction } from "ethers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ReadonlyExcludeIterableWithKeys } from "./helper/Helper";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Dappazon } from "../typechain-types";

const tokens = (n: number) => {
  return ethers.utils.parseUnits(n.toString(10), 'ether')
}

const ITEM: ReadonlyExcludeIterableWithKeys<Dappazon.ItemStructOutput> = {
  id: BigNumber.from(1),
  name: "Item",
  category: "Product",
  image: "Image",
  cost: BigNumber.from(tokens(1)),
  rating: BigNumber.from(10),
  stock: BigNumber.from(10)
};

describe("Dappazon", () => {
  let dappazon: Dappazon;
  let deployer: SignerWithAddress;
  let buyer: SignerWithAddress;

  beforeEach(async () => {
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
    [deployer, buyer] = await ethers.getSigners();
  });

  describe('Deployment', async () => {
    it('has an owner', async () => {
      expect(await dappazon.owner()).to.equal(deployer.address);
    })
  });

  describe('Listing', async () => {
    let tListing: ContractTransaction;
    let item: Dappazon.ItemStructOutput;

    beforeEach(async () => {
      tListing = await dappazon.connect(deployer).listItems([ITEM]);
      await tListing.wait();
      item = await dappazon.getItem(1);
    });

    it('adds item', async () => {
      expect({...item}).to.deep.include(ITEM);
    })

    it('emits event', async () => {
      expect(tListing).to.emit(dappazon, dappazon.interface.getEvent("ListItem").name);
    })
  })

  describe('Buying', async () => {
    let tBuying: ContractTransaction;
    let item: Dappazon.ItemStructOutput;

    beforeEach(async () => {
      await dappazon.connect(deployer).listItems([ITEM]);
      item = await dappazon.getItem(1);
      tBuying = await dappazon.connect(buyer).buy(item.id, { value: item.cost});
      await tBuying.wait();
    });

    it('updates contract balance', async () => {
      expect(await ethers.provider.getBalance(dappazon.address)).to.equal(item.cost);
    })

    it("updates buyer's order count", async () => {
      expect(await dappazon.orderCount(buyer.address)).to.equal(1);
    })

    it("adds the order", async () => {
      const order = await dappazon.orders(buyer.address, 1);
      const ItemDecrease = {...ITEM};
      ItemDecrease.stock = BigNumber.from(9);

      expect(order.time).to.be.greaterThan(0);
      expect({...order.item}).to.deep.include(ItemDecrease);
    })

    it("emits buy event", async () => {
      expect(tBuying).to.emit(dappazon, dappazon.interface.getEvent("Buy").name);
    })
  })

  describe('Withdrawing', async () => {
    let tWithdraw: ContractTransaction;
    let balanceBefore: BigNumber | null;

    beforeEach(async () => {
      await dappazon.connect(deployer).listItems([ITEM]);
      const item = await dappazon.getItem(1);
      await dappazon.connect(buyer).buy(item.id, { value: item.cost});

      balanceBefore = await ethers.provider.getBalance(deployer.address);
      tWithdraw = await dappazon.connect(deployer).withdraw();
      await tWithdraw.wait();
    });

    it("updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    })

    it("updates the contract balance", async () => {
      expect(await ethers.provider.getBalance(dappazon.address)).to.equal(0);
    })
  });
})
