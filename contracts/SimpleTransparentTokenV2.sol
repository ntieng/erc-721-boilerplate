// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract SimpleTransparentTokenV2 is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC721_init("SimpleTransparentToken", "STK");
        __Ownable_init();
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://test/{id}";
    }

    function safeMintV1(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function safeMintV2(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}