// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Simple721 is ERC721, Ownable {
    constructor() ERC721("Simple721", "S721") {}

    function _baseURI() internal pure override returns (string memory) {
        return "test.com/{id}";
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}