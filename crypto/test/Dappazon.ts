import { BigNumber, ContractTransaction } from "ethers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Dappazon } from "../typechain-types";

const tokens = (n: number) => {
  return ethers.utils.parseUnits(n.toString(10), 'ether')
}

const CATEGORY1: Dappazon.CategoryStruct = {
  id: BigNumber.from(1),
  name: "Category1"
}
const CATEGORY2: Dappazon.CategoryStruct = {
  id: BigNumber.from(2),
  name: "Category2"
}
const CATEGORY3: Dappazon.CategoryStruct = {
  id: BigNumber.from(3),
  name: "Category3"
}

const BRAND1: Dappazon.BrandStruct = {
  id: BigNumber.from(1),
  name: "Brand1"
}
const BRAND2: Dappazon.BrandStruct = {
  id: BigNumber.from(2),
  name: "Brand2"
}
const BRAND3: Dappazon.BrandStruct = {
  id: BigNumber.from(3),
  name: "Brand3"
}

const ITEM11: Dappazon.ItemStruct = {
  id: BigNumber.from(1),
  name: "Item",
  category: CATEGORY1,
  image: "Image",
  cost: BigNumber.from(tokens(1)),
  rating: BigNumber.from(10),
  stock: BigNumber.from(10),
  brand: BRAND1,
  description: "search11"
};

const ITEM12: Dappazon.ItemStruct = {
  id: BigNumber.from(2),
  name: "Item",
  category: CATEGORY1,
  image: "Image",
  cost: BigNumber.from(tokens(1)),
  rating: BigNumber.from(10),
  stock: BigNumber.from(10),
  brand: BRAND2,
  description: "search12"
};

const ITEM13: Dappazon.ItemStruct = {
  id: BigNumber.from(3),
  name: "Item",
  category: CATEGORY1,
  image: "Image",
  cost: BigNumber.from(tokens(1)),
  rating: BigNumber.from(10),
  stock: BigNumber.from(10),
  brand: BRAND3,
  description: "search13"
};

const ITEM23: Dappazon.ItemStruct = {
  id: BigNumber.from(4),
  name: "Item",
  category: CATEGORY2,
  image: "Image",
  cost: BigNumber.from(tokens(1)),
  rating: BigNumber.from(10),
  stock: BigNumber.from(10),
  brand: BRAND3,
  description: "search23"
};

const ITEM33: Dappazon.ItemStruct = {
  id: BigNumber.from(5),
  name: "Item",
  category: CATEGORY3,
  image: "Image",
  cost: BigNumber.from(tokens(1)),
  rating: BigNumber.from(10),
  stock: BigNumber.from(10),
  brand: BRAND3,
  description: "search33"
};

const toNewItem = (item: Dappazon.ItemStruct): Dappazon.NewItemStruct => {
  return {
    id: item.id,
    name: item.name,
    categoryId: item.category.id,
    image: item.image,
    cost: item.cost,
    rating: item.rating,
    stock: item.stock,
    brandId: item.brand.id,
    description: item.description
  }
};

const COMPARE_ITEM11: Omit<Dappazon.ItemStruct, "category" | "brand"> = {
  cost: ITEM11.cost,
  description: ITEM11.description,
  id: ITEM11.id,
  image: ITEM11.image,
  name: ITEM11.name,
  rating: ITEM11.rating,
  stock: ITEM11.stock
}

describe("Dappazon", () => {
  let dappazon: Dappazon;
  let deployer: SignerWithAddress;
  let buyer: SignerWithAddress;
  let items: Dappazon.ItemStruct[];
  let newItems: Dappazon.NewItemStruct[];

  beforeEach(async () => {
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy() as Dappazon;
    [deployer, buyer] = await ethers.getSigners();
    items = [ITEM11, ITEM12, ITEM13, ITEM23, ITEM33];
    newItems = [];
    items.forEach(i => newItems.push(toNewItem(i)));
    await dappazon.updateBrands([BRAND1, BRAND2, BRAND3]);
    await dappazon.updateCategories([CATEGORY1, CATEGORY2, CATEGORY3]);
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
      tListing = await dappazon.connect(deployer).listItems(newItems);
      await tListing.wait();
      item = await dappazon.getItem(1);
    });

    it('adds item', async () => {
      expect({...item}).to.deep.include(COMPARE_ITEM11);
      expect({...item.category}).to.deep.include(ITEM11.category);
      expect({...item.brand}).to.deep.include(ITEM11.brand);
    })

    it('emits event', async () => {
      expect(tListing).to.emit(dappazon, dappazon.interface.getEvent("ListItem").name);
    })

    it('query items', async () => {
      const filter: Dappazon.FilterStruct = {
        brandIdSelected: 0,
        categoryIdSelected: 0,
        itemsCount: 0,
        pageNumber: 3,
        pageSize: 2,
        search: "",
        sortSelected: "asc"
      }
      console.log(await dappazon.queryItems(filter));
    })
  })

  describe('Buying', async () => {
    let tBuying: ContractTransaction;
    let item: Dappazon.ItemStructOutput;

    beforeEach(async () => {
      await dappazon.connect(deployer).listItems(newItems);
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
      const ItemDecrease = {...COMPARE_ITEM11};
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
      await dappazon.connect(deployer).listItems(newItems);
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
