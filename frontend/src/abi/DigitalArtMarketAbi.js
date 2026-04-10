export const DIGITAL_ART_MARKET_ABI = [
  "function registerArt(string title, string metadataURI) external",
  "function listArtForSale(uint256 artId, uint256 price) external",
  "function buyArt(uint256 artId) external",
  "function transferArtOwnership(uint256 artId, address newOwner) external",
  "function getArtItem(uint256 artId) external view returns (tuple(uint256 id, string title, string metadataURI, address currentOwner, uint256 price, bool isForSale, bool exists))",
  "function getTotalArtCount() external view returns (uint256)",
  "function paymentToken() external view returns (address)",
  "event ArtRegistered(uint256 indexed artId, string title, string metadataURI, address indexed owner)",
  "event ArtListedForSale(uint256 indexed artId, address indexed owner, uint256 price)",
  "event ArtSold(uint256 indexed artId, address indexed previousOwner, address indexed newOwner, uint256 price)",
  "event OwnershipTransferredForArt(uint256 indexed artId, address indexed previousOwner, address indexed newOwner)"
];