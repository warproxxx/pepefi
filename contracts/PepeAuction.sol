pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IVault.sol";

contract PepeAuction {
    uint256 private _nextId = 1;
    uint256[] public auctions;

    struct auctionDetails {
        uint256 timestamp; //unix timestamp of when the auction started
        uint256 loanId; //pepfi loan ID


        address collateral; //nft
        uint256 assetId; //ID

        uint startingPrice;

        uint256 duration; //every n
        uint256 decreasePercentage; //percentage to decrease

        address withdraw; //wallet to receive withdraw
        address liquidator;
        uint32 liquidatorFee;
    }

    mapping(uint256 => auctionDetails) public _auctions;

    constructor(){
        
    }

    function getAllAuctions() public view returns (uint256[] memory){
        return auctions;
    }

    function createAuction(uint256 _loanId, uint256 _startingPrice, uint256 _discountRate, address _nft, uint256 _nftId, uint256 _duration, address _liquidator, address _owner, uint32 liquidatorFee) public returns (uint256){
        IERC721(_nft).transferFrom(msg.sender, address(this), _nftId); //Transfer the NFT to our wallet. 

        _auctions[_nextId+1] = auctionDetails({
                timestamp: block.timestamp,
                loanId: _loanId,
                collateral: _nft,
                assetId: _nftId,
                startingPrice: _startingPrice,
                duration: _duration,
                decreasePercentage: _discountRate,
                withdraw: _owner,
                liquidator: _liquidator,
                liquidatorFee: liquidatorFee

            });

        auctions.push(_nextId+1);
        _nextId++;
        return _nextId;
    }

    function buy() external payable {
        // uint price = getPrice();
        // require(msg.value >= price, "ETH < price");

        // nft.transferFrom(seller, msg.sender, nftId);
        // uint refund = msg.value - price;
        // if (refund > 0) {
        //     payable(msg.sender).transfer(refund);
        // }
        // selfdestruct(seller);
    }

}