import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("UnicusWatchNFT", function () {
    async function contractFixture() {
        const [owner, user1, user2, user3] = await ethers.getSigners();
        const UnicusWatchNFT = await ethers.getContractFactory("UnicusWatchNFT");
        const nft = await UnicusWatchNFT.deploy();
        await nft.deployed();
        return { nft, owner, user1, user2, user3 };
    }

    describe("Create NFT", function () {
        it("Should revert if not a creator", async function () {
            const { nft, user1 } = await loadFixture(contractFixture);
            await expect(nft.connect(user1).mint("xxyyzz")).to.be.revertedWith("UW: Unauthorized");
        })
        it("Should mint NFT", async function () {
            const { nft, owner } = await loadFixture(contractFixture);
            await nft.connect(owner).mint("xxyyzz");
            const tokenURI = await nft.tokenURI(1);
            expect(tokenURI).to.equal("ipfs://xxyyzz");
            expect(await nft.balanceOf(owner.address)).to.equal(0);
            expect(await nft.totalSupply()).to.equal(1);
            expect(await nft.ownerOf(1)).to.equal(owner.address);
        })
        it("Should not transfer NFT after minting", async function () {
            const { nft, owner, user1 } = await loadFixture(contractFixture);
            await nft.connect(owner).mint("xxyyzz");
            await expect(nft.connect(owner).transferFrom(owner.address, user1.address, 1)).to.be.revertedWith("ERC721: caller is not token owner or approved");
        })
        it("Should transfer NFT after claiming it", async function () {
            const { nft, owner, user1 } = await loadFixture(contractFixture);
            await nft.connect(owner).mint("xxyyzz");
            await nft.connect(owner).claimMintedToken(1);
            expect(await nft.mintOwner(1)).to.equal(ethers.constants.AddressZero);
            expect(await nft.ownerOf(1)).to.equal(owner.address);
            await nft.connect(owner).transferFrom(owner.address, user1.address, 1);
            expect(await nft.mintOwner(1)).to.equal(ethers.constants.AddressZero);
            expect(await nft.balanceOf(user1.address)).to.equal(1);
            expect(await nft.balanceOf(owner.address)).to.equal(0);
            expect(await nft.ownerOf(1)).to.equal(user1.address);
        })

        it("Should mint if fee is paid", async function () {
            const { nft, owner, user1 } = await loadFixture(contractFixture);
            await nft.connect(user1).mint("xxyyzz", { value: ethers.utils.parseEther("0.15") });
            expect(await nft.balanceOf(user1.address)).to.equal(0);
            expect(await nft.ownerOf(1)).to.equal(user1.address);
            expect(await nft.totalSupply()).to.equal(1);
        })
    })
});