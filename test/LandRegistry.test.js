const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * @dev Test suite for LandRegistry contract
 * @notice Comprehensive tests for all contract functions
 */
describe("LandRegistry", function () {
  let landRegistry;
  let owner, addr1, addr2, addr3;
  
  // Land registration test data
  const testLocation = "123 Main Street, City, State";
  const testArea = 1000; // square meters
  const testDescription = "Residential property with 3 bedrooms";

  beforeEach(async function () {
    // Get signers (accounts)
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy contract
    const LandRegistry = await ethers.getContractFactory("LandRegistry");
    landRegistry = await LandRegistry.deploy();
    await landRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await landRegistry.getAddress()).to.be.properAddress;
    });

    it("Should initialize with zero lands", async function () {
      expect(await landRegistry.getTotalLands()).to.equal(0);
    });
  });

  describe("Land Registration", function () {
    it("Should register a new land parcel", async function () {
      const tx = await landRegistry
        .connect(addr1)
        .registerLand(testLocation, testArea, testDescription);
      
      await expect(tx)
        .to.emit(landRegistry, "LandRegistered")
        .withArgs(1, addr1.address, testLocation, testArea, await getTimestamp(tx));

      const totalLands = await landRegistry.getTotalLands();
      expect(totalLands).to.equal(1);
    });

    it("Should assign unique land IDs", async function () {
      await landRegistry.connect(addr1).registerLand("Location 1", 100, "Desc 1");
      await landRegistry.connect(addr2).registerLand("Location 2", 200, "Desc 2");
      await landRegistry.connect(addr3).registerLand("Location 3", 300, "Desc 3");

      const land1 = await landRegistry.getLandDetails(1);
      const land2 = await landRegistry.getLandDetails(2);
      const land3 = await landRegistry.getLandDetails(3);

      expect(land1.landId).to.equal(1);
      expect(land2.landId).to.equal(2);
      expect(land3.landId).to.equal(3);
    });

    it("Should set correct owner on registration", async function () {
      await landRegistry.connect(addr1).registerLand(testLocation, testArea, testDescription);
      
      const land = await landRegistry.getLandDetails(1);
      expect(land.currentOwner).to.equal(addr1.address);
    });

    it("Should reject empty location", async function () {
      await expect(
        landRegistry.connect(addr1).registerLand("", testArea, testDescription)
      ).to.be.revertedWith("Location cannot be empty");
    });

    it("Should reject zero area", async function () {
      await expect(
        landRegistry.connect(addr1).registerLand(testLocation, 0, testDescription)
      ).to.be.revertedWith("Area must be greater than zero");
    });

    it("Should track owner's lands", async function () {
      await landRegistry.connect(addr1).registerLand("Location 1", 100, "Desc 1");
      await landRegistry.connect(addr1).registerLand("Location 2", 200, "Desc 2");
      
      const ownerLands = await landRegistry.getLandsByOwner(addr1.address);
      expect(ownerLands.length).to.equal(2);
      expect(ownerLands[0]).to.equal(1);
      expect(ownerLands[1]).to.equal(2);
    });
  });

  describe("Ownership Transfer", function () {
    beforeEach(async function () {
      // Register a land parcel before each transfer test
      await landRegistry
        .connect(addr1)
        .registerLand(testLocation, testArea, testDescription);
    });

    it("Should transfer ownership successfully", async function () {
      const tx = await landRegistry
        .connect(addr1)
        .transferOwnership(1, addr2.address);

      await expect(tx)
        .to.emit(landRegistry, "OwnershipTransferred")
        .withArgs(1, addr1.address, addr2.address, await getTimestamp(tx));

      const land = await landRegistry.getLandDetails(1);
      expect(land.currentOwner).to.equal(addr2.address);
    });

    it("Should prevent non-owner from transferring", async function () {
      await expect(
        landRegistry.connect(addr2).transferOwnership(1, addr3.address)
      ).to.be.revertedWith("Only the owner can perform this action");
    });

    it("Should reject transfer to zero address", async function () {
      await expect(
        landRegistry.connect(addr1).transferOwnership(1, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid new owner address");
    });

    it("Should reject transfer to self", async function () {
      await expect(
        landRegistry.connect(addr1).transferOwnership(1, addr1.address)
      ).to.be.revertedWith("Cannot transfer to yourself");
    });

    it("Should update owner's land lists after transfer", async function () {
      // addr1 has land 1
      let ownerLands = await landRegistry.getLandsByOwner(addr1.address);
      expect(ownerLands.length).to.equal(1);

      // Transfer to addr2
      await landRegistry.connect(addr1).transferOwnership(1, addr2.address);

      // addr1 should have no lands
      ownerLands = await landRegistry.getLandsByOwner(addr1.address);
      expect(ownerLands.length).to.equal(0);

      // addr2 should have land 1
      ownerLands = await landRegistry.getLandsByOwner(addr2.address);
      expect(ownerLands.length).to.equal(1);
      expect(ownerLands[0]).to.equal(1);
    });

    it("Should maintain ownership history", async function () {
      // Transfer from addr1 to addr2
      await landRegistry.connect(addr1).transferOwnership(1, addr2.address);
      
      // Transfer from addr2 to addr3
      await landRegistry.connect(addr2).transferOwnership(1, addr3.address);

      const history = await landRegistry.getOwnershipHistory(1);
      expect(history.length).to.equal(2);
      expect(history[0].from).to.equal(addr1.address);
      expect(history[0].to).to.equal(addr2.address);
      expect(history[1].from).to.equal(addr2.address);
      expect(history[1].to).to.equal(addr3.address);
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await landRegistry
        .connect(addr1)
        .registerLand(testLocation, testArea, testDescription);
    });

    it("Should return correct land details", async function () {
      const land = await landRegistry.getLandDetails(1);
      
      expect(land.landId).to.equal(1);
      expect(land.currentOwner).to.equal(addr1.address);
      expect(land.location).to.equal(testLocation);
      expect(land.area).to.equal(testArea);
      expect(land.description).to.equal(testDescription);
      expect(land.exists).to.equal(true);
    });

    it("Should verify ownership correctly", async function () {
      expect(await landRegistry.verifyOwnership(1, addr1.address)).to.equal(true);
      expect(await landRegistry.verifyOwnership(1, addr2.address)).to.equal(false);
    });

    it("Should return empty history for new land", async function () {
      const history = await landRegistry.getOwnershipHistory(1);
      expect(history.length).to.equal(0);
    });

    it("Should return correct total lands count", async function () {
      expect(await landRegistry.getTotalLands()).to.equal(1);
      
      await landRegistry.connect(addr2).registerLand("Location 2", 200, "Desc 2");
      expect(await landRegistry.getTotalLands()).to.equal(2);
    });

    it("Should revert when accessing non-existent land", async function () {
      await expect(
        landRegistry.getLandDetails(999)
      ).to.be.revertedWith("Land does not exist");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple transfers correctly", async function () {
      // Register land
      await landRegistry.connect(addr1).registerLand(testLocation, testArea, testDescription);
      
      // Multiple transfers
      await landRegistry.connect(addr1).transferOwnership(1, addr2.address);
      await landRegistry.connect(addr2).transferOwnership(1, addr3.address);
      await landRegistry.connect(addr3).transferOwnership(1, addr1.address);

      const land = await landRegistry.getLandDetails(1);
      expect(land.currentOwner).to.equal(addr1.address);

      const history = await landRegistry.getOwnershipHistory(1);
      expect(history.length).to.equal(3);
    });

    it("Should handle multiple lands per owner", async function () {
      await landRegistry.connect(addr1).registerLand("Location 1", 100, "Desc 1");
      await landRegistry.connect(addr1).registerLand("Location 2", 200, "Desc 2");
      await landRegistry.connect(addr1).registerLand("Location 3", 300, "Desc 3");

      const ownerLands = await landRegistry.getLandsByOwner(addr1.address);
      expect(ownerLands.length).to.equal(3);
    });
  });
});

/**
 * Helper function to get timestamp from transaction
 */
async function getTimestamp(tx) {
  const receipt = await tx.wait();
  const block = await ethers.provider.getBlock(receipt.blockNumber);
  return block.timestamp;
}

