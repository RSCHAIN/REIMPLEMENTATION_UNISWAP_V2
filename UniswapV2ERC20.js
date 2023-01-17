const Web3 = require("web3");
const web3_url = "https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4";

var web3_provider = new Web3.providers.HttpProvider(web3_url);
var web3 = new Web3(web3_provider);

var Contract = require("web3-eth-contract");

const pair = require('./UniswapV2Library')

async function getABI(token) {
    var myAPI_Key = "your api key";
    
    const response = await fetch(`https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${token}&apikey=${myAPI_Key}`);
    const responseJSON = await response.json();
    
    var contractABI = "";
    contractABI = JSON.parse(responseJSON.result);
    if (contractABI != "") return contractABI;
}

async function _mint(to, value) {

    let tokenTo_ABI = await getABI(to)
    let tokenTo_Details = new web3.eth.Contract(abi=tokenTo_ABI, address=to)
    
    let totalSupply = await tokenTo_Details.methods.totalSupply().call()
    totalSupply = totalSupply + value;
    let balanceOfTo = tokenTo_Details.methods.balanceOf(pair.account_address).call()
    balanceOfTo = balanceOfTo + value
    
}
exports._mint = _mint