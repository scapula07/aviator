# Aviator is a betting game .User deposit a wager to a smart contract deployed to lightchain. API3 contract is called to return a random number that is used to calculate the time of flight of a plane. Reward is calculated with odds associated with flight.Provided the user stops the game before the plane flews ,the reward is incremented on user balance in the smart contract. The reward can be withdrawn.But if a user fails to stop game before flight is completed,he loses his wager.

Best of luck!!!. May the odds be in your favor.





# Aviator contract

## Contract https://pegasus.lightlink.io/address/0x51246c9F480Cc6A46397b2A35684BC3231Acf41F


```sol  Aviator contract
    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;




contract Autobet{

    event DepositIncremented(address indexed user, uint256 newBalance);
    event DepositDecremented(address indexed user, uint256 newBalance);

    mapping(address => uint256) public userBalances;

    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;



    constructor() {}


   

    // Function to allow users to deposit funds
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        userBalances[msg.sender] += msg.value;
    }

    // Function to increment a user's deposit balance
    function incrementDeposit(address user, uint256 amount) external  {
        require(amount > 0, "Increment amount must be greater than 0");
        userBalances[user] += amount;
        emit DepositIncremented(user, userBalances[user]);
     }

    // Function to decrement a user's deposit balance
    function decrementDeposit(address user, uint256 amount) external  {
        require(amount > 0, "Decrement amount must be greater than 0");
        require(userBalances[user] >= amount, "Insufficient funds");
        userBalances[user] -= amount;
        emit DepositDecremented(user, userBalances[user]);
      }

    // Function to retrieve a user's deposit balance
    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }


}1

```


# Api3 QRNG contract
```sol API3 QRNG
   //SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts@4.9.5/access/Ownable.sol";

/// @title Example contract that uses Airnode RRP to access QRNG services
contract QrngExample is RrpRequesterV0, Ownable {
    event RequestedUint256(bytes32 indexed requestId);
    event ReceivedUint256(bytes32 indexed requestId, uint256 response);
    event RequestedUint256Array(bytes32 indexed requestId, uint256 size);
    event ReceivedUint256Array(bytes32 indexed requestId, uint256[] response);
    event WithdrawalRequested(address indexed airnode, address indexed sponsorWallet);

    address public airnode;                 // The address of the QRNG Airnode
    bytes32 public endpointIdUint256;       // The endpoint ID for requesting a single random number
    bytes32 public endpointIdUint256Array;  // The endpoint ID for requesting an array of random numbers
    address public sponsorWallet;           // The wallet that will cover the gas costs of the request
    uint256 public _qrngUint256;            // The random number returned by the QRNG Airnode
    uint256[] public _qrngUint256Array;     // The array of random numbers returned by the QRNG Airnode

    mapping(bytes32 => bool) public expectingRequestWithIdToBeFulfilled;

    constructor(address _airnodeRrp) RrpRequesterV0(_airnodeRrp) {}

    /// @notice Sets the parameters for making requests
    function setRequestParameters(
        address _airnode,
        bytes32 _endpointIdUint256,
        bytes32 _endpointIdUint256Array,
        address _sponsorWallet
    ) external {
        airnode = _airnode;
        endpointIdUint256 = _endpointIdUint256;
        endpointIdUint256Array = _endpointIdUint256Array;
        sponsorWallet = _sponsorWallet;
    }

    /// @notice To receive funds from the sponsor wallet and send them to the owner.
    receive() external payable {
        payable(owner()).transfer(msg.value);
        emit WithdrawalRequested(airnode, sponsorWallet);
    }

    /// @notice Requests a `uint256`
    /// @dev This request will be fulfilled by the contract's sponsor wallet,
    /// which means spamming it may drain the sponsor wallet.
    function makeRequestUint256() external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfillUint256.selector,
            ""
        );
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        emit RequestedUint256(requestId);
    }

    /// @notice Called by the Airnode through the AirnodeRrp contract to
    /// fulfill the request
    function fulfillUint256(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(
            expectingRequestWithIdToBeFulfilled[requestId],
            "Request ID not known"
        );
        expectingRequestWithIdToBeFulfilled[requestId] = false;
        uint256 qrngUint256 = abi.decode(data, (uint256));
        _qrngUint256 = qrngUint256;
        // Do what you want with `qrngUint256` here...
        emit ReceivedUint256(requestId, qrngUint256);
    }

    /// @notice Requests a `uint256[]`
    /// @param size Size of the requested array
    function makeRequestUint256Array(uint256 size) external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            endpointIdUint256Array,
            address(this),
            sponsorWallet,
            address(this),
            this.fulfillUint256Array.selector,
            // Using Airnode ABI to encode the parameters
            abi.encode(bytes32("1u"), bytes32("size"), size)
        );
        expectingRequestWithIdToBeFulfilled[requestId] = true;
        emit RequestedUint256Array(requestId, size);
    }

    /// @notice Called by the Airnode through the AirnodeRrp contract to
    /// fulfill the request
    function fulfillUint256Array(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(
            expectingRequestWithIdToBeFulfilled[requestId],
            "Request ID not known"
        );
        expectingRequestWithIdToBeFulfilled[requestId] = false;
        uint256[] memory qrngUint256Array = abi.decode(data, (uint256[]));
        // Do what you want with `qrngUint256Array` here...
        _qrngUint256Array = qrngUint256Array;
        emit ReceivedUint256Array(requestId, qrngUint256Array);
    }

    /// @notice Getter functions to check the returned value.
    function getRandomNumber() public view returns (uint256) {
        return _qrngUint256;
    }

    function getRandomNumberArray() public view returns(uint256[] memory) {
        return _qrngUint256Array;
    }

    /// @notice To withdraw funds from the sponsor wallet to the contract.
    function withdraw() external onlyOwner {
        airnodeRrp.requestWithdrawal(
        airnode,
        sponsorWallet
        );
    }
}


```


![Image Title](https://firebasestorage.googleapis.com/v0/b/reach-nft-auction.appspot.com/o/Screen%20Shot%202024-02-23%20at%202.36.57%20PM.png?alt=media&token=c764122b-2d89-4a89-85a4-dd11ccd6b003)

![Image Title](https://firebasestorage.googleapis.com/v0/b/reach-nft-auction.appspot.com/o/Screen%20Shot%202024-02-23%20at%202.44.49%20PM.png?alt=media&token=38812634-6efa-4fe8-8b8c-ba1507ff3fdb)

