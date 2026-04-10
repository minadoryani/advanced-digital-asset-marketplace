// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DigitalArtMarket is Ownable, ReentrancyGuard {
    struct ArtItem {
        uint256 id;
        string title;
        string metadataURI;
        address currentOwner;
        uint256 price;
        bool isForSale;
        bool exists;
    }

    uint256 private nextArtId;
    mapping(uint256 => ArtItem) private artItems;

    IERC20 public paymentToken;

    event ArtRegistered(
        uint256 indexed artId,
        string title,
        string metadataURI,
        address indexed owner
    );

    event ArtListedForSale(
        uint256 indexed artId,
        address indexed owner,
        uint256 price
    );

    event ArtSold(
        uint256 indexed artId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 price
    );

    event OwnershipTransferredForArt(
        uint256 indexed artId,
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor(address tokenAddress) Ownable(msg.sender) {
        paymentToken = IERC20(tokenAddress);
    }

    function registerArt(
        string memory title,
        string memory metadataURI
    ) external {
        require(bytes(title).length > 0, "Titel darf nicht leer sein");
        require(bytes(metadataURI).length > 0, "Metadata URI darf nicht leer sein");

        uint256 artId = nextArtId;

        artItems[artId] = ArtItem({
            id: artId,
            title: title,
            metadataURI: metadataURI,
            currentOwner: msg.sender,
            price: 0,
            isForSale: false,
            exists: true
        });

        nextArtId++;

        emit ArtRegistered(artId, title, metadataURI, msg.sender);
    }

    function listArtForSale(uint256 artId, uint256 price) external {
        require(artItems[artId].exists, "Kunstwerk existiert nicht");
        require(artItems[artId].currentOwner == msg.sender, "Nur der Besitzer darf verkaufen");
        require(price > 0, "Preis muss groesser als 0 sein");

        artItems[artId].price = price;
        artItems[artId].isForSale = true;

        emit ArtListedForSale(artId, msg.sender, price);
    }

    function buyArt(uint256 artId) external nonReentrant {
        require(artItems[artId].exists, "Kunstwerk existiert nicht");
        require(artItems[artId].isForSale, "Kunstwerk steht nicht zum Verkauf");
        require(artItems[artId].currentOwner != msg.sender, "Eigene Kunst kann nicht gekauft werden");

        address previousOwner = artItems[artId].currentOwner;
        uint256 salePrice = artItems[artId].price;

        bool success = paymentToken.transferFrom(msg.sender, previousOwner, salePrice);
        require(success, "Token-Zahlung fehlgeschlagen");

        artItems[artId].currentOwner = msg.sender;
        artItems[artId].isForSale = false;
        artItems[artId].price = 0;

        emit OwnershipTransferredForArt(artId, previousOwner, msg.sender);
        emit ArtSold(artId, previousOwner, msg.sender, salePrice);
    }

    function transferArtOwnership(uint256 artId, address newOwner) external {
        require(artItems[artId].exists, "Kunstwerk existiert nicht");
        require(artItems[artId].currentOwner == msg.sender, "Nur der Besitzer darf uebertragen");
        require(newOwner != address(0), "Neue Adresse ungueltig");
        require(newOwner != msg.sender, "Uebertragung an sich selbst nicht erlaubt");

        address previousOwner = artItems[artId].currentOwner;

        artItems[artId].currentOwner = newOwner;
        artItems[artId].isForSale = false;
        artItems[artId].price = 0;

        emit OwnershipTransferredForArt(artId, previousOwner, newOwner);
    }

    function getArtItem(uint256 artId) external view returns (ArtItem memory) {
        require(artItems[artId].exists, "Kunstwerk existiert nicht");
        return artItems[artId];
    }

    function getTotalArtCount() external view returns (uint256) {
        return nextArtId;
    }
}