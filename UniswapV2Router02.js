const Web3 = require('web3')
const web3_url = 'https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'

var web3_provider = new Web3.providers.HttpProvider(web3_url);
var web3 = new Web3(web3_provider);

var address_to = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

var factory_address = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f";

const { IUniswapV2Pair } = require('./UniswapV2Pair');
 
const { getReservesGlobal } = require('./reservesGlobale');

var UniswapV2Library = require('./UniswapV2Library')
var getamountsout = require('./UniswapV2Library')

const _swap = async function(amounts, tokens, address_to) {

    const [GlobalReserve0, GlobalReserve1] = getReservesGlobal();

    for (var i = 0; i < tokens.length - 1; i++) {
        if(tokens[i] !== 0 && tokens[i+1] !== 0) {
            var input = tokens[i]
            var output = tokens[i+1]
        
        }else {
            console.log('erreur');
        }
        
        var amountOut = amounts[i + 1];
        
        if(input === tokens[i]) {
            var amount0Out = 0;
            var amount1Out = amountOut
        }else if(input === tokens[i+1]){
            var amount0Out = amountOut;
            var amount1Out = 0;
        }

        if(i < tokens.length - 2) {
            var to = await UniswapV2Library.pairFor(factory_address, output, tokens[i + 2])
        }else {
            to = address_to
        }

        const pairResult = await UniswapV2Library.pairFor(input, output);
        
        new IUniswapV2Pair(pairResult).swap(amounts, to, GlobalReserve0, GlobalReserve1, tokens)
    }
}




/**VENTE */
const swapExactETHForTokens = async function(amountOutMin, tokens, account_address, deadline) {
    const [GlobalReserve0, GlobalReserve1] = getReservesGlobal();
    if(tokens[0] == "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6" || tokens[0] == "weth") {
        var amounts = await UniswapV2Library.getAmountsOut(amountOutMin, tokens);
        if(amounts >= amountOutMin) {
            _swap(amounts, tokens, address_to, GlobalReserve0, GlobalReserve1);
        }
        else {
            console.log('UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');
        }
    }
    else {
        console.log('UniswapV2Router: INVALID_PATH');
    }

    return amounts
}
exports.swapExactETHForTokens = swapExactETHForTokens;

const swapExactTokensForETH = async function(amountIn, amountOutMin, tokens, account_address, deadline) {
    const [GlobalReserve0, GlobalReserve1] = getReservesGlobal();
    if(tokens[tokens.length - 1] == "WETH" || tokens[tokens.length - 1] == "weth" || tokens[tokens.length -1] == "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6") {
        amounts = await UniswapV2Library.getAmountsOut(amountIn, tokens, GlobalReserve0, GlobalReserve1);
        if(amounts[amounts.length - 1] >= amountOutMin) {
            _swap(amounts, tokens, address_to, GlobalReserve0, GlobalReserve1);
        }
        else {
            console.log('UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');
        }
    }
    else {
        console.log('UniswapV2Router: INVALID_PATH');
    }
    return amounts
}
exports.swapExactTokensForETH = swapExactTokensForETH


const swapExactTokensForTokens = async function(amountIn, amountOutMin, tokens, account_address, deadline_sawp) {
    const [GlobalReserve0, GlobalReserve1] = getReservesGlobal();

    var amounts = await getamountsout.getAmountsOut(amountIn, tokens, GlobalReserve0, GlobalReserve1);
    if(amounts.length - 1 >= amountOutMin) {
        await _swap(amounts, tokens, address_to, GlobalReserve0, GlobalReserve1)
    }                                                                  
    else {
        console.log("INSUFFICIENT_OUTPUT_AMOUNT");
    }
    
    return amounts
}
exports.swapExactTokensForTokens = swapExactTokensForTokens;



/**ACHAT */
const swapETHForExactTokens = async function(amountOut, tokens, account_address, deadline) {
    const [GlobalReserve0, GlobalReserve1] = getReservesGlobal();
    if(tokens[0] == "WETH" || tokens[0] == "weth" || tokens[0] == "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6") {
        var amounts = await UniswapV2Library.getAmountsIn(amountOut, tokens, GlobalReserve0, GlobalReserve1);
        if(amounts[0] <= amounts[0]) {
            _swap(amounts, tokens, address_to, GlobalReserve0, GlobalReserve1);
        }
        else {
            console.log('UniswapV2Router: EXCESSIVE_INPUT_AMOUNT');
        }
    }else {
        console.log('UniswapV2Router: INVALID_PATH');
    }
    return amounts
}
exports.swapETHForExactTokens = swapETHForExactTokens


const swapTokensForExactETH = async function(amountOut, amountInMax, tokens, account_address, deadline) {
    const [GlobalReserve0, GlobalReserve1] = getReservesGlobal();
    if(tokens[tokens.length - 1] == "WETH" || tokens[tokens.length - 1] == "weth" || tokens[tokens.length - 1] == "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6") {
        var amounts = await UniswapV2Library.getAmountsIn(amountOut, tokens, GlobalReserve0, GlobalReserve1);
        if(amounts[0] <= amounts[0]) {
            _swap(amounts, tokens, address_to, GlobalReserve0, GlobalReserve1)
        }
        else {
            console.log('UniswapV2Router: EXCESSIVE_INPUT_AMOUNT');
        }
        
    }
    else {
        console.log('UniswapV2Router: INVALID_PATH');
    }    
    return amounts
}
exports.swapTokensForExactETH = swapTokensForExactETH


const swapTokensForExactTokens = async function(amountOut, amountInMax, tokens, account_address, deadline) {

    const [GlobalReserve0, GlobalReserve1] = getReservesGlobal();

    var amounts = await UniswapV2Library.getAmountsIn(amountOut, tokens, GlobalReserve0, GlobalReserve1);
    amountInMax = amounts[0]
    if(amounts[0] <= amountInMax) {
        _swap(amounts, tokens, address_to, GlobalReserve0, GlobalReserve1);
    }
    else {
        console.log('UniswapV2Router: EXCESSIVE_INPUT_AMOUNT');
    }
    return amounts
}
exports.swapTokensForExactTokens = swapTokensForExactTokens;



/** SupportingFeeOnTransferTokens */
async function getABI(token) {
    var myAPI_Key = "your api key";
    
    const response = await fetch(`https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${token}&apikey=${myAPI_Key}`);
    const responseJSON = await response.json();
    
    var contractABI = "";
    contractABI = JSON.parse(responseJSON.result);
    if (contractABI != "") return contractABI;
}

const _swapSupportingFeeOnTransferTokens = async(tokens, _to) => {

    const [GlobalReserve0, GlobalReserve1] = getReservesGlobal();

    for (let i=0; i < tokens.length - 1; i++) {
        var input = tokens[i];
        var output = tokens[i + 1];

        var pair = await UniswapV2Library.pairFor(input, output);

        var amountInput;
        var amountOutput;
        
        var reserveInput = input == tokens[0] ? (GlobalReserve0, GlobalReserve1) : (GlobalReserve1, GlobalReserve0);
        var reserveOutput = output == tokens[1] ? (GlobalReserve1, GlobalReserve0) : (GlobalReserve0, GlobalReserve1);
        amountInput = reserveInput - 2.98;
        amountOutput = await UniswapV2Library.getAmountOut(amountInput, reserveInput, reserveOutput);
        amountOutput= web3.utils.toWei(amountOutput.toString(), "ether")
        var amount0Out = input == tokens[0] ? (0, amountOutput) : (amountOutput, 0);
        var amount1Out = output == tokens[1] ? (amountOutput, 0) : (0, amountOutput)
        var amounts = [amount0Out, amount1Out]
        to = i < tokens.length - 2 ? await UniswapV2Library.pairFor(output, tokens[i + 2]) : _to;
        new IUniswapV2Pair(pair).swap(amounts, to, GlobalReserve0, GlobalReserve1, tokens)
    }
}
  

const swapExactTokensForTokensSupportingFeeOnTransferTokens = async(amountIn, amountOutMin, tokens, account_address, deadline) => {
    
    var token1ABI = await getABI(tokens[tokens.length - 1])
    var token1Details = new web3.eth.Contract(abi=token1ABI, address=tokens[tokens.length - 1])
    var balanceBefore = await token1Details.methods.balanceOf(account_address).call();
    _swapSupportingFeeOnTransferTokens(tokens, account_address)
    if(await token1Details.methods.balanceOf(account_address).call() - (balanceBefore) >= amountOutMin){
      console.log("OK");
    }
    else {
      console.log('UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');
    }
  
}
exports.swapExactTokensForTokensSupportingFeeOnTransferTokens = swapExactTokensForTokensSupportingFeeOnTransferTokens
  
  
const swapExactETHForTokensSupportingFeeOnTransferTokens = async(amountOutMin, tokens, account_address, deadline) => {
    var token0ABI = await getABI(tokens[0])
    var token1ABI = await getABI(tokens[1])
    
    var token0Details = new web3.eth.Contract(abi=token0ABI, address=tokens[0])
    var token1Details = new web3.eth.Contract(abi=token1ABI, address=tokens[1])
  
    if(tokens[0] === "weth" || tokens[0] === "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6")  {
  
        var amountIn = amountOutMin
        var balance1Before = await token1Details.methods.balanceOf(account_address).call();
        var amounts = await _swapSupportingFeeOnTransferTokens(tokens, account_address);
        if(token1Details.methods.balanceOf(account_address).call() - (balance1Before) >= amountOutMin) {
            console.log("COOL");
        }
        else {
            console.log('UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');
        }
    }else {
      console.log('UniswapV2Router: INVALID_PATH');
    }
}

exports.swapExactETHForTokensSupportingFeeOnTransferTokens = swapExactETHForTokensSupportingFeeOnTransferTokens
  
  
const swapExactTokensForETHSupportingFeeOnTransferTokens = async(amountIn, amountOutMin, tokens, account_address, deadline) => {
  
    if(tokens[tokens.length - 1] == "WETH" || tokens[tokens.length - 1] == "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6") {
  
        await _swapSupportingFeeOnTransferTokens(tokens, account_address);
        var amountOut = await web3.eth.getBalance(account_address).then(console.log);
        if(amountOut >= amountOutMin) {
            console.log("OK");
        }
        else {
            console.log('UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');
        }

    }else {
        console.log('UniswapV2Router: INVALID_PATH');
    }
}
exports.swapExactTokensForETHSupportingFeeOnTransferTokens = swapExactTokensForETHSupportingFeeOnTransferTokens