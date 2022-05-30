// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";

contract SimpleRoyalty721 is ERC721Royalty, Ownable {
    using Counters for Counters.Counter;
    string public baseURI;
    uint256 public cost = 0.08 ether;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Simple721", "STK") {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        baseURI = baseURI_;
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function mintNFT(address to, uint256 tokenId) public payable {
        require(msg.value == cost, "Incorrect amount");
        _safeMint(to, tokenId);
    }

    function withdrawETH(address receiver) public onlyOwner {
        uint256 contractBalance = address(this).balance;
        payable(receiver).transfer(contractBalance);
    }

    function setDefaultRoyaltyAmount(address receiver, uint96 feeNumerator) external {
        _setDefaultRoyalty(receiver,feeNumerator);
    }

    //Sets the royalty information for a specific token id, overriding the global default.
   function setCustomTokenRoyalty(uint256 tokenId,
        address receiver,
        uint96 feeNumerator) external onlyOwner {
        _setTokenRoyalty(tokenId,receiver,feeNumerator);
    }

    //Resets royalty information for the token id back to the global default.
   function resetTokenRoyalty(uint256 tokenId) external onlyOwner {
        _resetTokenRoyalty(tokenId);
    }

}