// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Floppy is ERC20, ERC20Burnable, Ownable {
    // biến cap này giới hạn cung cấp token của contract
    uint256 private cap = 50_000_000_000 * 10 ** uint256(18);

    // khởi tạo smart contract khi nó được tạo
    constructor() ERC20("Floppy", "FLP") Ownable(msg.sender) {
        // Creates a value amount of tokens and assigns them to account
        _mint(msg.sender, cap);
        // Transfers ownership of the contract to a new account (newOwner).
        // transferOwnership(msg.sender);
    }

    // tạo thêm
    function mint(address to, uint256 amount) public onlyOwner {
        // kiểm tra xem tổng cung của token sau khi thêm mới có vượt quá giới hạn cap hay không
        require(totalSupply() + amount <= cap, "Floppy: cap exceeded");
        // cho phép chủ sở hữu contract tạo ra thêm token bằng cách gọi hàm mint
        _mint(to, amount);
    }
}
