// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LandRegistry
 * @dev A smart contract for managing land records on the blockchain
 * @notice This contract allows registration, transfer, and verification of land ownership
 */
contract LandRegistry {
    // ============ STATE VARIABLES ============
    
    // Struct to store land parcel information
    struct LandParcel {
        uint256 landId;              // Unique identifier for the land
        address currentOwner;        // Current owner's wallet address
        string location;             // Location/address of the land
        uint256 area;                // Area in square meters
        string description;          // Additional description
        uint256 registrationDate;     // Timestamp when land was registered
        bool exists;                 // Flag to check if land exists
    }
    
    // Struct to store ownership transfer history
    struct TransferRecord {
        address from;                // Previous owner
        address to;                  // New owner
        uint256 timestamp;           // Transfer timestamp
        string transactionHash;      // Transaction hash for reference
    }
    
    // Mapping from land ID to LandParcel
    mapping(uint256 => LandParcel) public landRecords;
    
    // Mapping from land ID to array of transfer records (ownership history)
    mapping(uint256 => TransferRecord[]) public ownershipHistory;
    
    // Mapping to track all land IDs owned by an address
    mapping(address => uint256[]) public ownerLands;
    
    // Counter for generating unique land IDs
    uint256 private landIdCounter;
    
    // ============ EVENTS ============
    
    /**
     * @dev Emitted when a new land parcel is registered
     */
    event LandRegistered(
        uint256 indexed landId,
        address indexed owner,
        string location,
        uint256 area,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when land ownership is transferred
     */
    event OwnershipTransferred(
        uint256 indexed landId,
        address indexed from,
        address indexed to,
        uint256 timestamp
    );
    
    // ============ MODIFIERS ============
    
    /**
     * @dev Modifier to check if land exists
     */
    modifier landExists(uint256 _landId) {
        require(landRecords[_landId].exists, "Land does not exist");
        _;
    }
    
    /**
     * @dev Modifier to check if caller is the owner
     */
    modifier onlyOwner(uint256 _landId) {
        require(
            landRecords[_landId].currentOwner == msg.sender,
            "Only the owner can perform this action"
        );
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    /**
     * @dev Constructor initializes the contract
     */
    constructor() {
        landIdCounter = 1; // Start land IDs from 1
    }
    
    // ============ MAIN FUNCTIONS ============
    
    /**
     * @dev Register a new land parcel
     * @param _location Location/address of the land
     * @param _area Area in square meters
     * @param _description Additional description of the land
     * @return landId The unique ID assigned to the land
     */
    function registerLand(
        string memory _location,
        uint256 _area,
        string memory _description
    ) public returns (uint256) {
        // Validate inputs
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(_area > 0, "Area must be greater than zero");
        
        // Generate unique land ID
        uint256 newLandId = landIdCounter;
        landIdCounter++;
        
        // Create new land parcel
        LandParcel memory newLand = LandParcel({
            landId: newLandId,
            currentOwner: msg.sender,
            location: _location,
            area: _area,
            description: _description,
            registrationDate: block.timestamp,
            exists: true
        });
        
        // Store land record
        landRecords[newLandId] = newLand;
        
        // Add to owner's land list
        ownerLands[msg.sender].push(newLandId);
        
        // Emit event
        emit LandRegistered(
            newLandId,
            msg.sender,
            _location,
            _area,
            block.timestamp
        );
        
        return newLandId;
    }
    
    /**
     * @dev Transfer land ownership to a new owner
     * @param _landId The ID of the land to transfer
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(
        uint256 _landId,
        address _newOwner
    ) public landExists(_landId) onlyOwner(_landId) {
        // Validate new owner address
        require(_newOwner != address(0), "Invalid new owner address");
        require(_newOwner != msg.sender, "Cannot transfer to yourself");
        
        // Get current land record
        LandParcel storage land = landRecords[_landId];
        address previousOwner = land.currentOwner;
        
        // Update ownership
        land.currentOwner = _newOwner;
        
        // Create transfer record
        TransferRecord memory transfer = TransferRecord({
            from: previousOwner,
            to: _newOwner,
            timestamp: block.timestamp,
            transactionHash: "" // Can be set externally if needed
        });
        
        // Add to ownership history
        ownershipHistory[_landId].push(transfer);
        
        // Update owner's land lists
        // Remove from previous owner's list
        _removeFromOwnerList(previousOwner, _landId);
        
        // Add to new owner's list
        ownerLands[_newOwner].push(_landId);
        
        // Emit event
        emit OwnershipTransferred(
            _landId,
            previousOwner,
            _newOwner,
            block.timestamp
        );
    }
    
    /**
     * @dev Get complete land details
     * @param _landId The ID of the land
     * @return LandParcel struct with all land information
     */
    function getLandDetails(
        uint256 _landId
    ) public view landExists(_landId) returns (LandParcel memory) {
        return landRecords[_landId];
    }
    
    /**
     * @dev Get ownership history of a land parcel
     * @param _landId The ID of the land
     * @return Array of TransferRecord structs
     */
    function getOwnershipHistory(
        uint256 _landId
    ) public view landExists(_landId) returns (TransferRecord[] memory) {
        return ownershipHistory[_landId];
    }
    
    /**
     * @dev Verify if an address is the current owner of a land
     * @param _landId The ID of the land
     * @param _owner Address to verify
     * @return true if the address is the owner, false otherwise
     */
    function verifyOwnership(
        uint256 _landId,
        address _owner
    ) public view landExists(_landId) returns (bool) {
        return landRecords[_landId].currentOwner == _owner;
    }
    
    /**
     * @dev Get all land IDs owned by an address
     * @param _owner Address of the owner
     * @return Array of land IDs
     */
    function getLandsByOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        return ownerLands[_owner];
    }
    
    /**
     * @dev Get total number of registered lands
     * @return Total count of registered lands
     */
    function getTotalLands() public view returns (uint256) {
        return landIdCounter - 1;
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    /**
     * @dev Remove land ID from owner's list (internal helper)
     * @param _owner Address of the owner
     * @param _landId ID of the land to remove
     */
    function _removeFromOwnerList(address _owner, uint256 _landId) internal {
        uint256[] storage lands = ownerLands[_owner];
        for (uint256 i = 0; i < lands.length; i++) {
            if (lands[i] == _landId) {
                // Move last element to current position
                lands[i] = lands[lands.length - 1];
                // Remove last element
                lands.pop();
                break;
            }
        }
    }
}

