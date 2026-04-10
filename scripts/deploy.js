const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with account:", deployer.address);

    const MockToken = await hre.ethers.getContractFactory("MockToken");
    const mockToken = await MockToken.deploy();
    await mockToken.waitForDeployment();

    const mockTokenAddress = await mockToken.getAddress();
    console.log("MockToken deployed to:", mockTokenAddress);

    const DigitalArtMarket = await hre.ethers.getContractFactory("DigitalArtMarket");
    const digitalArtMarket = await DigitalArtMarket.deploy(mockTokenAddress);
    await digitalArtMarket.waitForDeployment();

    const digitalArtMarketAddress = await digitalArtMarket.getAddress();
    console.log("DigitalArtMarket deployed to:", digitalArtMarketAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});