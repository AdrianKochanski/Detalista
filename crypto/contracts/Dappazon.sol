// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Dappazon is Ownable {

  // Filter
  struct Filter {
    uint256 brandIdSelected;
    uint256 categoryIdSelected;
    string sortSelected;
    uint256 pageNumber;
    uint256 pageSize;
    uint256 itemsCount;
    string search;
  }

  // Brand
  struct Brand {
    uint256 id;
    string name;
  }
  mapping(uint256 => Brand) public brands;

  struct Category {
    uint256 id;
    string name;
  }
  mapping(uint256 => Category) public categories;

  // Item
  struct Item {
    uint256 id;
    string name;
    Brand brand;
    Category category;
    string image;
    string description;
    uint256 cost;
    uint256 rating;
    uint256 stock;
  }

  struct NewItem {
    uint256 id;
    string name;
    uint256 brandId;
    uint256 categoryId;
    string image;
    string description;
    uint256 cost;
    uint256 rating;
    uint256 stock;
  }
  
  uint256 public itemsCounter;
  mapping(uint256 => uint256) internal itemsIdx;
  Item[] public items;

  // Order
  struct Order {
    uint256 time;
    Item item;
  }
  mapping(address => uint256) public orderCount;
  mapping(address => mapping(uint256 => Order)) public orders;

  // Events
  event ListItem(string name, uint256 cost, uint256 quantity);
  event Buy(address buyer, uint256 orderId, uint256 itemId);


  // Founds management
  function buy(uint256 _id) public payable {
    (bool success, Item memory item) = decreaseItemQuantity(_id);

    require(success, "Item out of stock");
    require(item.cost == msg.value, "Price do not equal");

    Order memory order = Order(block.timestamp, item);

    orderCount[msg.sender]++;
    orders[msg.sender][orderCount[msg.sender]] = order;

    emit Buy(msg.sender, orderCount[msg.sender], item.id);
  }

  function withdraw() public onlyOwner {
    (bool success,) = owner().call{value: address(this).balance}("");
    require(success);
  }


  // Listing management
  function listItems(NewItem[] memory _items) public onlyOwner {
    for (uint i=0; i < _items.length; i++) {
      NewItem memory item = _items[i];
      listItem(item.id, item.name, item.brandId, item.categoryId, item.image, item.description, item.cost, item.rating, item.stock);
    }
  }

  function unlistItems(uint256[] memory _itemIds) public onlyOwner {
    for(uint i=0; i < _itemIds.length; i++) unlistItem(_itemIds[i]);
  }

  // Brands & Categories
  function updateBrands(Brand[] memory _brands) public onlyOwner {
    for (uint i=0; i < _brands.length; i++) {
      Brand memory brand = _brands[i];
      brands[brand.id] = brand;
    }
  }

  function updateCategories(Category[] memory _category) public onlyOwner {
    for (uint i=0; i < _category.length; i++) {
      Category memory category = _category[i];
      categories[category.id] = category;
    }
  }

  // Getters 
  function queryItems(Filter memory filter) public view returns(Item[] memory, Filter memory) {
    uint256 arrayIdx = 0;
    // 0. Default filter
    if(filter.pageSize <= 0) {
      filter.pageSize = 6;
    }

    if(filter.pageNumber <= 0) {
      filter.pageNumber = 1;
    }

    // 1. filtrowanie
    Item[] memory itemsFiltered = new Item[](items.length);

    for (uint256 id = 0; id < items.length; id++) {
      Item memory item = items[id];

      if((filter.brandIdSelected == 0 || filter.brandIdSelected == item.brand.id)
      && (filter.categoryIdSelected == 0 || filter.categoryIdSelected == item.category.id)
      && (bytes(filter.search).length == 0 || ContainWord(filter.search, item.name) || ContainWord(filter.search, item.description))) {
        itemsFiltered[arrayIdx++] = item;
      }
    }

    // 2. sortowanie
    quickSort(itemsFiltered, int(0), int(itemsFiltered.length - 1));
    filter.itemsCount = itemsFiltered.length;

    // 3. stronicowanie
    arrayIdx = 0;
    Item[] memory pageItems = new Item[](filter.pageSize);
    uint256 startId = filter.pageSize * (filter.pageNumber - 1);
    uint256 endId = startId + filter.pageSize;
    
    if(endId > itemsFiltered.length) {
      endId = itemsFiltered.length;
    }

    for (uint256 id = startId; id < endId; id++) {
      pageItems[arrayIdx++] = itemsFiltered[id];
    }

    return (pageItems, filter);
  }

  function quickSort(Item[] memory arr, int left, int right) internal pure {
    int i = left;
    int j = right;
    if (i == j) return;
    Item memory pivot = arr[uint(left + (right - left) / 2)];
    while (i <= j) {
        while (arr[uint(i)].cost < pivot.cost) i++;
        while (pivot.cost < arr[uint(j)].cost) j--;
        if (i <= j) {
            (arr[uint(i)].cost, arr[uint(j)].cost) = (arr[uint(j)].cost, arr[uint(i)].cost);
            i++;
            j--;
        }
    }
    if (left < j)
        quickSort(arr, left, j);
    if (i < right)
        quickSort(arr, i, right);
  }

  function getItem(uint256 itemId) public view returns(Item memory) {
      return items[itemsIdx[itemId]-1];
  }

  function getLimitBrands(uint256 limit) public view returns(Brand[] memory) {
    Brand[] memory brandsFound = new Brand[](limit);
    uint256 arrayIdx = 0;
    
    for (uint256 id = 0; id < limit; id++) {
      Brand memory brand = brands[id];

      if(brand.id > 0) {
        brandsFound[arrayIdx++] = brand;
      }
    }

    return brandsFound;
  }

  function getLimitCategories(uint256 limit) public view returns(Category[] memory) {
    Category[] memory categoriesFound = new Category[](limit);
    uint256 arrayIdx = 0;

    for (uint256 id = 0; id < limit; id++) {
      Category memory category = categories[id];

      if(category.id > 0) {
        categoriesFound[arrayIdx++] = category;
      }
    }

    return categoriesFound;
  }


  // Checkers
  function isListed(uint256 itemId) public view returns (bool) {
    return itemsIdx[itemId] > 0 && itemId <= itemsCounter;
  }

  function brandExist(uint256 brandId) public view returns (bool) {
    return brands[brandId].id > 0;
  }

  function categoryExist(uint256 categoryId) public view returns (bool) {
    return categories[categoryId].id > 0;
  }

  function ContainWord (string memory what, string memory where) internal pure returns (bool found){
    bytes memory whatBytes = bytes (what);
    bytes memory whereBytes = bytes (where);

    //require(whereBytes.length >= whatBytes.length);
    if(whereBytes.length < whatBytes.length){ return false; }

    found = false;
    for (uint i = 0; i <= whereBytes.length - whatBytes.length; i++) {
        bool flag = true;
        for (uint j = 0; j < whatBytes.length; j++)
            if (whereBytes [i + j] != whatBytes [j]) {
                flag = false;
                break;
            }
        if (flag) {
            found = true;
            break;
        }
    }
    return found;
  }


  // Internals
  function decreaseItemQuantity(uint256 _id) internal returns (bool, Item memory) {
    Item storage item = getListItemStorage(_id);

    if(item.stock == 1) {
      item.stock--;
      unlistItem(item.id);
      return (true, item);
    }
    else if (item.stock > 1) {
      item.stock--;
      return (true, item);
    }

    return (false, item);
  }

  function getListItemStorage(uint256 itemId) internal view returns(Item storage) {
      return items[itemsIdx[itemId]-1];
  }

  function listItem(
      uint256 _id,
      string memory _name,
      uint256 _brandId,
      uint256 _categoryId,
      string memory _image,
      string memory _description,
      uint256 _cost,
      uint256 _rating,
      uint256 _stock
  ) internal {
    if (_id == 0 || _id > 0 && !isListed(_id)) {
      require(brandExist(_brandId), "Brand do not exist");
      require(categoryExist(_categoryId), "Category do not exist");
      itemsCounter++;
      itemsIdx[itemsCounter] = items.length + 1;
      items.push(Item(itemsCounter, _name, brands[_brandId], categories[_categoryId], _image, _description, _cost, _rating, _stock));
      emit ListItem(_name, _cost, _stock);
    }
  }

  function unlistItem(uint256 itemId
  ) internal {
      if (isListed(itemId)) {
          uint256 currentIdx = itemsIdx[itemId] - 1;
          uint256 lastIndex = items.length - 1;
          Item memory itemToMove = items[lastIndex];

          if (itemId != itemToMove.id) {
              itemsIdx[itemToMove.id] = currentIdx+1;
              items[currentIdx] = itemToMove;
          }

          delete itemsIdx[itemId];
          items.pop();
      }
  }
}
