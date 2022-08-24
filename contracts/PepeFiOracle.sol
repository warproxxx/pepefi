contract PepeFiOracle {
    event OracleUpdate(address collection, uint256 value, uint256 timestamp);
    mapping (address => uint256) public prices;

    address updater;

    modifier onlyUpdater {
        require(msg.sender == updater);
        _;
    }

    constructor(address _updater) {
        updater = _updater;
    }

    function updatePrice(address _collection, uint256 _value) public onlyUpdater{
        prices[_collection] = _value;
        emit OracleUpdate(_collection, _value, block.timestamp);
    }

    function getPrice(address _collection) public view returns (uint256) {
        return prices[_collection];
    }
}