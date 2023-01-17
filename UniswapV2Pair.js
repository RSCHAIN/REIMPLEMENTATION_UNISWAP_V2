const Web3 = require('web3')
const web3_url = 'https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'

var web3_provider = new Web3.providers.HttpProvider(web3_url);
var web3 = new Web3(web3_provider);

var version = web3.version.api;

var Contract = require('web3-eth-contract');
const fichier = require('fs');

const { getReservesGlobal } = require('./reservesGlobale');

const pair = require('./UniswapV2Library')



class IUniswapV2Pair {

    constructor(factory, input, output) {
        this.factory = factory,
        this.input = input,
        this.output = output
    }

    async swap(amounts, address_to, r0, r1, tokens) {
        var [amount0Out, amount1Out] = amounts
        
        if(amount0Out > 0 || amount1Out > 0) {
            var _reserve0 = r0;
            var _reserve1 = r1;
        }else {
            console.log('UniswapV2: INSUFFICIENT_OUTPUT_AMOUNT');
        }
        
        if(amount0Out < _reserve0 && amount1Out < _reserve1) {
            var balance0;
            var balance1; 
        }
        else {
            console.log('UniswapV2: INSUFFICIENT_LIQUIDITY');
        }
        var [_token0, _token1] = tokens;
        
        if(address_to!= _token0 && address_to!= _token1) {
            balance0 = _reserve0 - amount1Out;
            balance1 = _reserve1 + amount0Out;           
        }
        else {
            console.log('UniswapV2: INVALID_TO');
        }
        var amount0OutWei = web3.utils.toWei(amount0Out.toString(), "ether")
        var amount1OutWei = web3.utils.toWei(amount1Out.toString(), "ether")
        var amount0In = balance0 >= _reserve0 - amount0OutWei ? balance0 - (_reserve0 - amount0OutWei) : 0;
        var amount1In = balance1 >= _reserve1 - amount1OutWei ? balance1 - (_reserve1 - amount1OutWei) : 0;

        if(amount0In > 0 || amount1In > 0) {
            
            var balance0Adjusted = balance0 * 1000 - (amount0In*0.003);
            var balance1Adjusted = balance1 * 1000 - (amount1In*0.003);

            async function writeToFile(fileName, data) {
                fichier.appendFile(fileName, JSON.stringify(data), function(err){
                if(err) throw err;
                    console.log('Update !');
                })
            }
            writeToFile("reserves.js", {balance0Adjusted, balance1Adjusted})
            console.log("RESERVE0 UPDATE : ", balance0Adjusted);
            console.log("RESERVE1 UPDATE : ", balance1Adjusted);

            let to = await pair.pairFor(_token0, _token1)
            let tokenTo_ABI = await getABI(to)
            let tokenTo_Details = new web3.eth.Contract(abi=tokenTo_ABI, address=to)


            let totalSupply = await tokenTo_Details.methods.totalSupply().call()
            totalSupply = Number(totalSupply)
            let mintValue = await mint(tokens, r0, r1)
            totalSupply += Number(mintValue)

            if(balance0Adjusted * balance1Adjusted <= r0 * r1 * (1000**2)) {
                console.log('UniswapV2: K');
            }
            
        }else {
            console.log('UniswapV2: INSUFFICIENT_INPUT_AMOUNT');
        }
         _update(balance0, balance1, _reserve0, _reserve1);
    }
}
module.exports.IUniswapV2Pair =  IUniswapV2Pair


function _update(balance0, balance1,  _reserve0, _reserve1) {
    const currentDate = new Date() 
    const timestamp = currentDate.getTime()
    if (timestamp > 0 && _reserve0 != 0 && _reserve1 != 0) {
        var price0CumulativeLast = ((_reserve1 / _reserve0)*timestamp);
        var price1CumulativeLast = ((_reserve0 / _reserve1)*timestamp);
    }
    else {
        console.log('UniswapV2: OVERFLOW update')
    }
    var reserve0 = balance0;
    var reserve1 = balance1;
}


const { _mint } = require("./UniswapV2ERC20");

async function getABI(tokens) {
    var myAPI_Key = "your api key";
  
    const response = await fetch(`https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${tokens}&apikey=${myAPI_Key}`);
    const responseJSON = await response.json();
  
    var contractABI = "";
    contractABI = JSON.parse(responseJSON.result);
    if (contractABI != "") return contractABI;
}

function _mintFee(_reserve0, _reserve1, to) {
    
    let feeTo = to;
    let feeOn = feeTo != web3.utils.toChecksumAddress("0x0000000000000000000000000000000000000000");
    if(feeOn) {
        let kLast = _reserve0 * _reserve1;
        let _kLast = kLast;
        if (feeOn) {
            if (_kLast != 0) {
                let rootK = Math.sqrt((_reserve0) * (_reserve1));
                let rootKLast = Math.sqrt(_kLast);
                if (rootK > rootKLast) {
                    let numerator = totalSupply * (rootK - (rootKLast));
                    let denominator = rootK * (5) + (rootKLast);
                    let liquidity = numerator / denominator;
                    if (liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        } else if (_kLast != 0) {
            kLast = 0;
        }
    }
    return feeOn
}



async function mint(tokens, reserve0, reserve1) {

    let [token0, token1] = tokens
    
    let token0ABI = await getABI(token0)
    let token0Details = new web3.eth.Contract(abi=token0ABI, address=token0)
    
    let token1ABI = await getABI(token1)
    let token1Details = new web3.eth.Contract(abi=token1ABI, address=token1)

    let to = await pair.pairFor(token0, token1)
    let tokenTo_ABI = await getABI(to)
    let tokenToDetails = new web3.eth.Contract(abi=tokenTo_ABI, address=to)


    let balance0 = await token0Details.methods.balanceOf(pair.account_address).call()
    let balance1 = await token1Details.methods.balanceOf(pair.account_address).call()

    let amount0 = balance0 - reserve0
    let amount1 = balance1 - reserve1

    let feeOn = _mintFee(reserve0, reserve1, to)
    
    let totalSupply = await tokenToDetails.methods.totalSupply().call()
    let _totalSupply = totalSupply;


    let MINIMUM_LIQUIDITY = 0.000000000000001
    if (_totalSupply == 0) {
        liquidity = Math.sqrt(amount0 * (amount1)) - MINIMUM_LIQUIDITY;
       _mint(address(0), MINIMUM_LIQUIDITY);
    } else {
        liquidity = Math.min(amount0 * (_totalSupply) / reserve0, amount1 * (_totalSupply) / reserve1);
    }
    try{if(liquidity > 0) {
        _mint(to, liquidity);
    }}
    catch(error) {
        console.error('UniswapV2: INSUFFICIENT_LIQUIDITY_MINTED');
    }
    _update(balance0, balance1, reserve0, reserve1);
    if (feeOn) kLast = (reserve0) * (reserve1); 

    return liquidity
}
