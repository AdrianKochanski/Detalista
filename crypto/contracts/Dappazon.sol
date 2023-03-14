// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Dappazon is Ownable {

  // Item
  struct Item {
    uint256 id;
    string name;
    string category;
    string image;
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
  function listItems(Item[] memory _items) public onlyOwner {
    for (uint i=0; i < _items.length; i++) {
      Item memory item = _items[i];
      listItem(item.id, item.name, item.category, item.image, item.cost, item.rating, item.stock);
    }
  }

  function unlistItems(Item[] memory _items) public onlyOwner {
    for(uint i=0; i < _items.length; i++) unlistItem(_items[i].id);
  }

  // Getters 
  function queryItems() public view returns(Item[] memory) {
    return items;
  }

  function getItem(uint256 itemId) public view returns(Item memory) {
      return items[itemsIdx[itemId]-1];
  }


  // Checkers
  function isListed(uint256 itemId) public view returns (bool) {
      return itemsIdx[itemId] > 0 && itemId <= itemsCounter;
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
      string memory _category,
      string memory _image,
      uint256 _cost,
      uint256 _rating,
      uint256 _stock
  ) internal {
    if (_id == 0 || _id > 0 && !isListed(_id)) {
        itemsCounter++;
        itemsIdx[itemsCounter] = items.length + 1;
        items.push(Item(itemsCounter, _name, _category, _image, _cost, _rating, _stock));
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
