// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title NFTCollection
 * @dev ERC-721 NFT contract with two-phase minting:
 * Phase 1: Whitelist mint (free for X/Twitter followers with signature proof)
 * Phase 2: Public mint (1 USDC per NFT)
 */
contract NFTCollection is ERC721, ERC721URIStorage, Ownable, EIP712 {
    using ECDSA for bytes32;

    // Minting phases
    enum MintPhase { CLOSED, WHITELIST, PUBLIC }
    MintPhase public currentPhase;

    // USDC token address (Base mainnet)
    IERC20 public immutable USDC;
    uint256 public constant MINT_PRICE = 1_000_000; // 1 USDC (6 decimals)

    // Backend signer for whitelist verification
    address public signer;

    // Token counter
    uint256 private _nextTokenId;

    // Base URI for metadata
    string private _baseTokenURI;

    // Nonces to prevent signature replay
    mapping(address => uint256) public nonces;

    // EIP-712 type hash for whitelist minting
    bytes32 private constant WHITELIST_TYPEHASH =
        keccak256("Whitelist(address minter,uint256 nonce)");

    // Events
    event PhaseChanged(MintPhase newPhase);
    event SignerUpdated(address indexed newSigner);
    event WhitelistMinted(address indexed minter, uint256 tokenId);
    event PublicMinted(address indexed minter, uint256 tokenId);
    event USDCWithdrawn(address indexed owner, uint256 amount);

    /**
     * @dev Constructor
     * @param _signer Backend signer address for whitelist verification
     * @param _usdcAddress USDC token contract address
     */
    constructor(
        address _signer,
        address _usdcAddress
    ) ERC721("CustOMeow", "MEOW") EIP712("NFTCollection", "1") Ownable(msg.sender) {
        require(_signer != address(0), "Invalid signer address");
        require(_usdcAddress != address(0), "Invalid USDC address");
        
        signer = _signer;
        USDC = IERC20(_usdcAddress);
        currentPhase = MintPhase.CLOSED;
        _nextTokenId = 1;
    }

    /**
     * @dev Phase 1: Whitelist mint with signature verification
     * Free for X/Twitter followers
     * @param signature EIP-712 signature from backend
     * @param tokenURI IPFS URI for NFT metadata
     */
    function whitelistMint(
        bytes calldata signature,
        string calldata tokenURI
    ) external {
        require(currentPhase == MintPhase.WHITELIST, "Not in whitelist phase");
        
        // Verify signature
        uint256 nonce = nonces[msg.sender];
        bytes32 structHash = keccak256(abi.encode(WHITELIST_TYPEHASH, msg.sender, nonce));
        bytes32 hash = _hashTypedDataV4(structHash);
        address recoveredSigner = hash.recover(signature);
        
        require(recoveredSigner == signer, "Invalid signature");
        
        // Increment nonce to prevent replay
        nonces[msg.sender]++;
        
        // Mint NFT
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit WhitelistMinted(msg.sender, tokenId);
    }

    /**
     * @dev Phase 2: Public mint for 1 USDC
     * @param tokenURI IPFS URI for NFT metadata
     */
    function publicMint(string calldata tokenURI) external {
        require(currentPhase == MintPhase.PUBLIC, "Not in public phase");
        
        // Transfer 1 USDC from minter to contract
        require(
            USDC.transferFrom(msg.sender, address(this), MINT_PRICE),
            "USDC transfer failed"
        );
        
        // Mint NFT
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit PublicMinted(msg.sender, tokenId);
    }

    /**
     * @dev Set minting phase (owner only)
     * @param phase New minting phase
     */
    function setPhase(MintPhase phase) external onlyOwner {
        currentPhase = phase;
        emit PhaseChanged(phase);
    }

    /**
     * @dev Update backend signer address (owner only)
     * @param _signer New signer address
     */
    function setSigner(address _signer) external onlyOwner {
        require(_signer != address(0), "Invalid signer address");
        signer = _signer;
        emit SignerUpdated(_signer);
    }

    /**
     * @dev Set base URI for token metadata (owner only)
     * @param baseURI New base URI
     */
    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Withdraw collected USDC (owner only)
     */
    function withdrawUSDC() external onlyOwner {
        uint256 balance = USDC.balanceOf(address(this));
        require(balance > 0, "No USDC to withdraw");
        require(USDC.transfer(owner(), balance), "USDC transfer failed");
        emit USDCWithdrawn(owner(), balance);
    }

    /**
     * @dev Get current nonce for an address
     * @param minter Address to check
     */
    function getNonce(address minter) external view returns (uint256) {
        return nonces[minter];
    }

    /**
     * @dev Get total supply
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // Override required functions
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

