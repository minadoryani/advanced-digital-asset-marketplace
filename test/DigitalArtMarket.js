const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DigitalArtMarket", function () {
    let owner;
    let seller;
    let buyer;
    let otherUser;

    let mockToken;
    let digitalArtMarket;

    const initialBuyerTokens = ethers.parseUnits("1000", 18);
    const salePrice = ethers.parseUnits("100", 18);

    beforeEach(async function () {
        [owner, seller, buyer, otherUser] = await ethers.getSigners();

        const MockToken = await ethers.getContractFactory("MockToken");
        mockToken = await MockToken.connect(owner).deploy();
        await mockToken.waitForDeployment();

        const DigitalArtMarket = await ethers.getContractFactory("DigitalArtMarket");
        digitalArtMarket = await DigitalArtMarket.connect(owner).deploy(
            await mockToken.getAddress()
        );
        await digitalArtMarket.waitForDeployment();

        await mockToken.connect(owner).mint(buyer.address, initialBuyerTokens);
    });

    it("setzt die Token-Adresse im Konstruktor korrekt", async function () {
        const savedTokenAddress = await digitalArtMarket.paymentToken();
        expect(savedTokenAddress).to.equal(await mockToken.getAddress());
    });

    it("registriert ein Kunstwerk korrekt", async function () {
        await expect(
            digitalArtMarket
                .connect(seller)
                .registerArt("Digital Sunset", "ipfs://digital-sunset")
        )
            .to.emit(digitalArtMarket, "ArtRegistered")
            .withArgs(0, "Digital Sunset", "ipfs://digital-sunset", seller.address);

        const artItem = await digitalArtMarket.getArtItem(0);

        expect(artItem.id).to.equal(0);
        expect(artItem.title).to.equal("Digital Sunset");
        expect(artItem.metadataURI).to.equal("ipfs://digital-sunset");
        expect(artItem.currentOwner).to.equal(seller.address);
        expect(artItem.price).to.equal(0);
        expect(artItem.isForSale).to.equal(false);
        expect(artItem.exists).to.equal(true);
    });

    it("listet ein Kunstwerk korrekt zum Verkauf", async function () {
        await digitalArtMarket
            .connect(seller)
            .registerArt("Golden Wave", "ipfs://golden-wave");

        await expect(
            digitalArtMarket.connect(seller).listArtForSale(0, salePrice)
        )
            .to.emit(digitalArtMarket, "ArtListedForSale")
            .withArgs(0, seller.address, salePrice);

        const artItem = await digitalArtMarket.getArtItem(0);

        expect(artItem.price).to.equal(salePrice);
        expect(artItem.isForSale).to.equal(true);
    });

    it("verkauft ein Kunstwerk korrekt gegen ERC20-Token und uebertraegt den Besitz", async function () {
        await digitalArtMarket
            .connect(seller)
            .registerArt("Neon Dreams", "ipfs://neon-dreams");

        await digitalArtMarket.connect(seller).listArtForSale(0, salePrice);

        const marketAddress = await digitalArtMarket.getAddress();

        await mockToken.connect(buyer).approve(marketAddress, salePrice);

        await expect(digitalArtMarket.connect(buyer).buyArt(0))
            .to.emit(digitalArtMarket, "ArtSold")
            .withArgs(0, seller.address, buyer.address, salePrice);

        const artItem = await digitalArtMarket.getArtItem(0);

        expect(artItem.currentOwner).to.equal(buyer.address);
        expect(artItem.isForSale).to.equal(false);
        expect(artItem.price).to.equal(0);

        const sellerBalance = await mockToken.balanceOf(seller.address);
        expect(sellerBalance).to.equal(salePrice);
    });

    it("uebertraegt den Besitz eines Kunstwerks direkt an eine andere Adresse", async function () {
        await digitalArtMarket
            .connect(seller)
            .registerArt("Gifted Art", "ipfs://gifted-art");

        await digitalArtMarket.connect(seller).listArtForSale(0, salePrice);

        await expect(
            digitalArtMarket
                .connect(seller)
                .transferArtOwnership(0, otherUser.address)
        )
            .to.emit(digitalArtMarket, "OwnershipTransferredForArt")
            .withArgs(0, seller.address, otherUser.address);

        const artItem = await digitalArtMarket.getArtItem(0);

        expect(artItem.currentOwner).to.equal(otherUser.address);
        expect(artItem.isForSale).to.equal(false);
        expect(artItem.price).to.equal(0);
    });

    it("verhindert, dass ein Nicht-Besitzer ein Kunstwerk zum Verkauf anbietet", async function () {
        await digitalArtMarket
            .connect(seller)
            .registerArt("Private Piece", "ipfs://private-piece");

        await expect(
            digitalArtMarket.connect(otherUser).listArtForSale(0, salePrice)
        ).to.be.revertedWith("Nur der Besitzer darf verkaufen");
    });

    it("verhindert den Kauf eines nicht zum Verkauf stehenden Kunstwerks", async function () {
        await digitalArtMarket
            .connect(seller)
            .registerArt("Hidden Art", "ipfs://hidden-art");

        const marketAddress = await digitalArtMarket.getAddress();
        await mockToken.connect(buyer).approve(marketAddress, salePrice);

        await expect(
            digitalArtMarket.connect(buyer).buyArt(0)
        ).to.be.revertedWith("Kunstwerk steht nicht zum Verkauf");
    });

    it("verhindert, dass der Besitzer sein eigenes Kunstwerk kauft", async function () {
        await digitalArtMarket
            .connect(seller)
            .registerArt("Self Buy Block", "ipfs://self-buy-block");

        await digitalArtMarket.connect(seller).listArtForSale(0, salePrice);

        await expect(
            digitalArtMarket.connect(seller).buyArt(0)
        ).to.be.revertedWith("Eigene Kunst kann nicht gekauft werden");
    });

    it("verhindert, dass ein Nicht-Besitzer den Besitz uebertraegt", async function () {
        await digitalArtMarket
            .connect(seller)
            .registerArt("Protected Transfer", "ipfs://protected-transfer");

        await expect(
            digitalArtMarket
                .connect(otherUser)
                .transferArtOwnership(0, buyer.address)
        ).to.be.revertedWith("Nur der Besitzer darf uebertragen");
    });

    it("verhindert die Uebertragung an die Null-Adresse", async function () {
        await digitalArtMarket
            .connect(seller)
            .registerArt("Null Address Block", "ipfs://null-address-block");

        await expect(
            digitalArtMarket
                .connect(seller)
                .transferArtOwnership(0, ethers.ZeroAddress)
        ).to.be.revertedWith("Neue Adresse ungueltig");
    });

    it("verhindert die Uebertragung an sich selbst", async function () {
        await digitalArtMarket
            .connect(seller)
            .registerArt("Self Transfer Block", "ipfs://self-transfer-block");

        await expect(
            digitalArtMarket
                .connect(seller)
                .transferArtOwnership(0, seller.address)
        ).to.be.revertedWith("Uebertragung an sich selbst nicht erlaubt");
    });
});