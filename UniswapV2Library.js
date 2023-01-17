const Web3 = require('web3')
const web3_url = 'https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4'

var web3_provider = new Web3.providers.HttpProvider(web3_url);
var web3 = new Web3(web3_provider);

var Contract = require("web3-eth-contract");
var readline = require("readline-sync")

const factory_ABI = [{inputs: [{ internalType: "address", name: "_feeToSetter", type: "address" },],payable: false,  stateMutability: "nonpayable",  type: "constructor",},{  anonymous: false,  inputs: [    {      indexed: true,      internalType: "address",      name: "token0",      type: "address",    },    {      indexed: true,      internalType: "address",      name: "token1",      type: "address",    },    {      indexed: false,      internalType: "address",      name: "pair",      type: "address",    },    { indexed: false, internalType: "uint256", name: "", type: "uint256" },  ],  name: "PairCreated",  type: "event",},{  constant: true,  inputs: [{ internalType: "uint256", name: "", type: "uint256" }],  name: "allPairs",  outputs: [{ internalType: "address", name: "", type: "address" }],  payable: false,  stateMutability: "view",  type: "function",},{  constant: true,  inputs: [],  name: "allPairsLength",  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],  payable: false,  stateMutability: "view",  type: "function",},{  constant: false,  inputs: [    { internalType: "address", name: "tokenA", type: "address" },    { internalType: "address", name: "tokenB", type: "address" },  ],  name: "createPair",  outputs: [{ internalType: "address", name: "pair", type: "address" }],  payable: false,  stateMutability: "nonpayable",  type: "function",},{  constant: true,  inputs: [],  name: "feeTo",  outputs: [{ internalType: "address", name: "", type: "address" }],  payable: false,  stateMutability: "view",  type: "function",},{  constant: true,  inputs: [],  name: "feeToSetter",  outputs: [{ internalType: "address", name: "", type: "address" }],  payable: false,  stateMutability: "view",  type: "function",},{  constant: true,  inputs: [    { internalType: "address", name: "", type: "address" },    { internalType: "address", name: "", type: "address" },  ],  name: "getPair",  outputs: [{ internalType: "address", name: "", type: "address" }],  payable: false,  stateMutability: "view",  type: "function",},{  constant: false,  inputs: [{ internalType: "address", name: "_feeTo", type: "address" }],  name: "setFeeTo",  outputs: [],  payable: false,  stateMutability: "nonpayable",  type: "function",},{  constant: false,  inputs: [    { internalType: "address", name: "_feeToSetter", type: "address" },  ],  name: "setFeeToSetter",  outputs: [],  payable: false,  stateMutability: "nonpayable",  type: "function",},];
var factory_address = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f";

const my_account_address = "0xb1b741Fd19bc1dEdDb89D88040473f36101f1fcF";

const { Alchemy, Network } = require("alchemy-sdk");

const config = {
  apiKey: "your api key",
  network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(config);

var prompt = require("prompt")
const v2Router = require("./UniswapV2Router02");

const fichier = require("fs");

let tokensTosell = [
  {
    name: "usdc",
    address: "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557",
  },
  {
    name: "usdt",
    address: "0x509Ee0d083DdF8AC028f2a56731412edD63223B9",
  },
  {
    name: "uni",
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
  },
  {
    name: "dai",
    address: "0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844",
  },
  {
    name: "link",
    address: "0x63bfb2118771bd0da7a6936667a7bb705a06c1ba",
  },
  {
    name: "weth",
    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  },
  {
    name : "dai(DAI)",
    address: "0xdc31ee1784292379fbb2964b3b9c4124d8f89c60"
  },
  {
    name : "usdcoin(USDC)",
    address : "0xd87ba7a50b2e7e660f678a895e4b72e7cb4ccd9c"
  },
  {
    name : "thether(USDT)",
    address : "0x5c47740624eac41cbf60ff91b64a0500de4291e0"
  },
  {
    name : "chainLinktoken(LINK)",
    address : "0x326c977e6efc84e512bb9c30f76e30c160ed06fb"
  },
  {
    name : "usdcoin0(USDC)",
    address : "0x02f95dfd22dee01cf83c85632c58a6b85f2c559a"
  },
]


const { setReserves, getReservesGlobal } = require("./reservesGlobale");

const { AddWallet, UpdateTokensWallet } = require("./Fakedatabase");

const get = require('./Fakedatabase')
const BD = require("./Fakedatabase");

prompt.start();

async function getABI(pairResult) {
    var myAPI_Key = "your api key";

    const response = await fetch(`https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${pairResult}&apikey=${myAPI_Key}`);
    const responseJSON = await response.json();

    var contractABI = "";
    contractABI = JSON.parse(responseJSON.result);
    if (contractABI != "") return contractABI;
}

async function getReserves(pairResult) {
    pairABI = await getABI(pairResult);
    var content_pair = new web3.eth.Contract(
        (abi = pairABI),
        (address = pairResult)
    );

    var reserves = await content_pair.methods.getReserves().call();

    async function writeToFile(fileName, data) {
        fichier.appendFile(fileName, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log("Update !");
        });
    }
    writeToFile("reserves.js", { reserves });

    return reserves;
}

sortTokens = function (tokenA, tokenB) {
    return { token0 : tokenA, token1 : tokenB };
    if (tokenA === tokenB) {
        console.log("Vous avez renseignez deux fois le même token !");
    } else {
        var token0 = tokenA < tokenB ? tokenA : tokenB;
        var token1 = tokenA > tokenB ? tokenA : tokenB;
    }
    if (token0 == web3.utils.toChecksumAddress("0x0000000000000000000000000000000000000000") || token1 == web3.utils.toChecksumAddress("0x0000000000000000000000000000000000000000")) {
        console.log("Vous avez renseignez une adresse token null !");
    }

};
exports.sortTokens = sortTokens;


const pairFor = async function (tokenA, tokenB) {
    var factory = new web3.eth.Contract((abi = factory_ABI),(address = factory_address));

    var pair = await factory.methods.getPair(tokenA, tokenB).call();

    if (pair === web3.utils.toChecksumAddress("0x0000000000000000000000000000000000000000")) {
        console.log("Pair unknown");
        console.log(pair);
    } else {
        console.log("Pair address : ", pair);
        return pair;
    }
};
exports.pairFor = pairFor;


const getAmountIn = (amountOut) => {
    const [reserveIn, reserveOut] = getReservesGlobal();
    if(amountOut >= 0) {
        if(reserveIn > 0 && reserveOut > 0) {
            var numerator = reserveIn* amountOut * 1000;
            var denominator = reserveOut - amountOut * 997;
            var amountIn = (numerator / denominator) + 1;
        }
        else {
            console.log('UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        }
    }
    else {
        console.log('UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT');
    }
    return amountIn
}
exports.getAmountIn = getAmountIn;


const getAmountsIn = async function(amountOut, tokens) {
    if(tokens.length >= 2) {
        var amounts = [];
        amounts[1] = amountOut;
        for (let i = tokens.length - 1; i > 0; i--) {
        amounts[i - 1] = await getAmountIn(amounts[i]);
        }
    }
    else {
        console.log('UniswapV2Library: INVALID_PATH');
    }
    return amounts
}
exports.getAmountsIn = getAmountsIn;


const getAmountOut = async function (AmountIn) {
    const [r0, r1] = getReservesGlobal();
    
    if (AmountIn > 0) {
        if (r0 > 0 && r1 > 0) {
        var amountInWithFee = AmountIn * 0.997;
        var numerator = r0 * amountInWithFee;
        var denominator = r1 + amountInWithFee;
        var amountOut = numerator / denominator;
        } else {
        console.log("INSUFFICIENT_LIQUIDITY");
        }
    } else {
        console.log("UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT");
    }
    return amountOut
};
exports.getAmountOut = getAmountOut;
  
  
const getAmountsOut = async function (AmountIn, tokens) {
    if (tokens.length >= 2) {
        var amounts = [];
        amounts[0] = AmountIn;
        for (var i = 0; i < tokens.length - 1; i++) {
        amounts[i + 1] = await getAmountOut(amounts[i]);
        }
    } else {
        console.log("INVALID_PATH");
    }
    return amounts;
};
exports.getAmountsOut = getAmountsOut;


var swapQuestion = readline.question("*****************Bienvenue sur UNISWAP LOCAL, Souhaitez-vous faire un swap ? O/N***************** ")
if(swapQuestion == "O" || swapQuestion == "o" || swapQuestion == "OUI" || swapQuestion == "Oui" || swapQuestion == "oui") {

    var pairToExchange = readline.question("\n\nEntrez la paire de tokens que vous souhaitez échanger : \n\n")

    var youWantDo = readline.questionInt("\nQuel type swap sohaitez vous effectuer ?  \n\n1.Vendre \n\n2.Acheter \n\n3.SupportingFeeOnTransferTokens\n")

    if(youWantDo === 1) {
        async function main(message) {
            var tokenTosell_A = await readline.question("\n\nQuel token souhaitez vous vendre ? \n")
            
            var tokenToReceive_B = await readline.question("\n\nQuel token souhaitez vous recevoir ? \n")
            
            var amountToSell = await readline.question(`\n\nCombien de ${tokenTosell_A.toUpperCase()} souhaitez-vous vendre pour des ${tokenToReceive_B.toUpperCase()} ? \n`)
            
            tokenTosell_A = tokenTosell_A.toLowerCase() || tokenTosell_A.toUpperCase();
            tokenToReceive_B = tokenToReceive_B.toLowerCase() || tokenToReceive_B.toUpperCase();

            
            if(tokenTosell_A === "weth" || tokenTosell_A === "WETH") {
                console.log("SwapExactETHForTokens");

                if (message) console.log(message);
                const account_address = await readline.question("\nEntrez votre addresse Wallet :  ");
                exports.account_address = account_address
            
                let WETH = {
                name : "weth",
                address : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                balance : await web3.eth.getBalance(`${account_address}`)
                }
                
                if (!account_address) return;
                const handleAddress = async () => {
                
                let balances = BD.getAccountWallet(account_address);

                    if(balances) {
                        let i = 1;
                        console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}\n`);
                        for(let items of tokensTosell) {
                            for(let balance of balances.tokenBalances) {
                                if(balance.contractAddress == items.address) {
                                    newObj = {
                                        name : items.name,
                                        address : balance.contractAddress,
                                        balance : balance.tokenBalance
                                    }
                                    console.log(`${i++}. ${newObj.name.toUpperCase()} : ${Number(newObj.balance)}\n`);
                                }
                            }
                        }
                    }
                    else if (balances == undefined) {
                        balances = await alchemy.core.getTokenBalances(account_address);
                    
                        const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                        });
                        console.log(`Token balances of ${account_address} \n`);
                        console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}`);
                    
                        let i = 1;
                    
                        for (let token of nonZeroBalances) {
                            let balance = token.tokenBalance;
                            const metadata = await alchemy.core.getTokenMetadata(
                            token.contractAddress
                            );
                            balance = balance / Math.pow(10, metadata.decimals);
                            balance = balance.toFixed(2);
                            
                            console.log(`${i++}. ${metadata.symbol}: ${balance}`);
                        }
                    }
                    AddWallet(account_address, balances);
                    
                    if (account_address) {
                        
                        const nonZeroBalances = balances.tokenBalances.filter((token) => {
                            return token.tokenBalance !== "0";
                        });
                        for(let token of nonZeroBalances) {
                            const metadata = await alchemy.core.getTokenMetadata(
                            token.contractAddress
                            );
                            
                            if (tokenTosell_A === metadata.symbol.toLowerCase()) {
                                tokenTosell_A = token.contractAddress;
                            }else if(tokenTosell_A === WETH.name) {
                                tokenTosell_A = WETH.address
                            }
                            
                            if (tokenToReceive_B == metadata.symbol.toLowerCase()) {
                                tokenToReceive_B = token.contractAddress;
                            }
                            else if(tokenToReceive_B === WETH.name) {
                                tokenToReceive_B = WETH.address
                            }
                        }
                
                        const { token0, token1 } = sortTokens(tokenTosell_A, tokenToReceive_B);
                        const pairResult = await pairFor(token0, token1);
                    
                        if (pairResult != undefined) {

                            const reserves = await getReserves(pairResult);
                        
                            const { _reserve0: reserve0, _reserve1: reserve1 } = reserves;
                        
                            setReserves([reserve0, reserve1]);
                            console.log("RESERVE0 BEFORE SWAP : ", reserves._reserve0)
                            console.log("RESERVE1 BEFORE SWAP : ", reserves._reserve1)
                            const swapResult = await v2Router.swapExactETHForTokens(
                                amountToSell,
                                [token0, token1],
                                account_address,
                                Math.floor(Date.now() / 1000) + 60 * 10
                            );
                            console.log("swapResult", swapResult);
                            
                            let getdb = get.getAccountWallet(account_address)
                        
                            getdb.tokenBalances.forEach(item => {
                                if(item.contractAddress === tokenTosell_A) {
                                    let realTokenABalanceValue = item.tokenBalance
                                    let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                    UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                        
                                    return newTokenABalanceValue
                                }
                                else if(WETH.address === tokenTosell_A) {
                                    let realTokenABalanceValue = WETH.balance
                                    let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                    UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                                    console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenABalanceValue} \n`);
                    
                                    return newTokenABalanceValue
                                }
                
                
                                if(item.contractAddress === tokenToReceive_B) {
                                    let realTokenBBalanceValue = item.tokenBalance
                                    let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                    UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                        
                                    return newTokenBBalanceValue
                                }
                                else if(WETH.address === tokenToReceive_B) {
                                    let realTokenBBalanceValue = WETH.balance
                                    let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                    UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                                    console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenBBalanceValue} \n`);
                    
                                    return newTokenBBalanceValue
                                }     
                            })
                            
                        }
                        else {
                            console.log("Aucune paire trouvé pour ces addresses");
                        }
                        }
                    };
                
                    const runHandleAddress = async () => {
                        try {
                            await handleAddress();
                        } catch (error) {
                            console.log("Impossible de traiter l'adresse soumise Veuillez réessayer");
                            console.log(error);
                        }
                    };
                    await runHandleAddress();
            
                    let question = await readline.questionInt("Voulez vous continuer ? Si Oui tapez (1), Sinon (0) ");
                    if (question === 1) {
                        main();
                    }
                    else {
                        return
                    }
                main("Entrez une valeur vide pour arrêter le script");
                
            }
            else if(tokenToReceive_B === "weth" || tokenToReceive_B === "WETH") {
                console.log("swapExactTokensForETH");
                if (message) console.log(message);
                const account_address = await readline.question("\nEntrez votre addresse Wallet :  ");
                exports.account_address = account_address

                let WETH = {
                    name : "weth",
                    address : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                    balance : await web3.eth.getBalance(`${account_address}`)
                }
                
                if (!account_address) return;
                const handleAddress = async () => {
                
                    let balances = BD.getAccountWallet(account_address);
                    if(balances) {
                    let i = 1;
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}\n`);
                    for(let items of tokensTosell) {
                        for(let balance of balances.tokenBalances) {
                        if(balance.contractAddress == items.address) {
                            newObj = {
                            name : items.name,
                            address : balance.contractAddress,
                            balance : balance.tokenBalance
                            }
                            console.log(`${i++}. ${newObj.name.toUpperCase()} : ${Number(newObj.balance)}\n`);
                        }
                        }
                    }
                    }
                    else if (balances == undefined) {
                    balances = await alchemy.core.getTokenBalances(account_address);
                
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                    });
                    console.log(`Token balances of ${account_address} \n`);
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}`);
                    
                    let i = 1;
                    
                    for (let token of nonZeroBalances) {
                        let balance = token.tokenBalance;
                        const metadata = await alchemy.core.getTokenMetadata(
                        token.contractAddress
                        );
                        balance = balance / Math.pow(10, metadata.decimals);
                        balance = balance.toFixed(2);
                        
                        console.log(`${i++}. ${metadata.symbol}: ${balance}`);
                    }
                    }
                    AddWallet(account_address, balances);
                
                    if (account_address) {
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                    });
                    for(let token of nonZeroBalances) {
                        const metadata = await alchemy.core.getTokenMetadata(
                        token.contractAddress
                        );
                        
                        if (tokenTosell_A === metadata.symbol.toLowerCase()) {
                            tokenTosell_A = token.contractAddress;
                        }else if(tokenTosell_A === WETH.name) {
                        tokenTosell_A = WETH.address
                        }
                    
                        if (tokenToReceive_B == metadata.symbol.toLowerCase()) {
                            TokenB = token.contractAddress;
                        }
                        else if(tokenToReceive_B === WETH.name) {
                        tokenToReceive_B = WETH.address
                        }
                    }
                    
                    const { token0, token1 } = sortTokens(tokenTosell_A, tokenToReceive_B);
                    const pairResult = await pairFor(token0, token1);
                    
                    if (pairResult != undefined) {
                        const reserves = await getReserves(pairResult);
                    
                        const { _reserve0: reserve0, _reserve1: reserve1 } = reserves;
                    
                        setReserves([reserve0, reserve1]);
                        console.log("RESERVE0 BEFORE SWAP : ", reserves._reserve0)
                        console.log("RESERVE1 BEFORE SWAP : ", reserves._reserve1)

                        var amountIn = amountToSell

                        const swapResult = await v2Router.swapExactTokensForETH(
                            amountIn,
                            0,
                            [token0, token1],
                            account_address,
                            Math.floor(Date.now() / 1000) + 60 * 10
                        );
                        console.log("swapResult", swapResult);
                        
                        let getdb = get.getAccountWallet(account_address)
                        
                        getdb.tokenBalances.forEach(item => {
                            if(item.contractAddress === tokenTosell_A) {
                                let realTokenABalanceValue = item.tokenBalance
                                let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                    
                                return newTokenABalanceValue
                            }
                            else if(WETH.address === tokenTosell_A) {
                                let realTokenABalanceValue = WETH.balance
                                let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenABalanceValue} \n`);
    
                                return newTokenABalanceValue
                            }
    
    
                            if(item.contractAddress === tokenToReceive_B) {
                                let realTokenBBalanceValue = item.tokenBalance
                                let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                    
                                return newTokenBBalanceValue
                            }
                            else if(WETH.address === tokenToReceive_B) {
                                let realTokenBBalanceValue = WETH.balance
                                let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenBBalanceValue} \n`);
    
                                return newTokenBBalanceValue
                            }     
                        })
                    }
                    else {
                        console.log("Aucune paire trouvé pour ces addresses");
                    }
                    }
                };
                
                const runHandleAddress = async () => {
                    try {
                        await handleAddress();
                    } catch (error) {
                        console.log("Impossible de traiter l'adresse soumise Veuillez réessayer");
                        console.log(error);
                    }
                };
                await runHandleAddress();

                let question = await readline.questionInt("Voulez vous continuer ? Si Oui tapez (1), Sinon (0) ");
                if (question === 1) {
                    main();
                }
                else {
                    return
                }
                main("Entrez une valeur vide pour arrêter le script");
            }
            else {
                console.log("swapExactTokensForTokens");
                if (message) console.log(message);
    
                //const { account_address } = await prompt.get(["account_address"]);
                const account_address = await readline.question("\nEntrez votre addresse Wallet :  ");
                exports.account_address = account_address

                let WETH = {
                    name : "weth",
                    address : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                    balance : await web3.eth.getBalance(`${account_address}`)
                }
                exports.WETH = WETH

                if (!account_address) return;
                
                const handleAddress = async () => {
                
                    let balances = BD.getAccountWallet(account_address);
                    if(balances) {
                    let i = 1;
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}\n`);
                    for(let items of tokensTosell) {
                        for(let balance of balances.tokenBalances) {
                        if(balance.contractAddress == items.address) {
                            newObj = {
                            name : items.name,
                            address : balance.contractAddress,
                            balance : balance.tokenBalance
                            }
                            console.log(`${i++}. ${newObj.name.toUpperCase()} : ${Number(newObj.balance)}\n`);//, ${newObj.address}
                        }
                        }
                    }
                    }
                    else if (balances == undefined) {
                    balances = await alchemy.core.getTokenBalances(account_address);
            
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                        });
                    console.log(`Token balances of ${account_address} \n`);
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}`);
            
                    let i = 1;
            
                    for (let token of nonZeroBalances) {
                        let balance = token.tokenBalance;
                        const metadata = await alchemy.core.getTokenMetadata(
                            token.contractAddress
                        );
                        balance = balance / Math.pow(10, metadata.decimals);
                        balance = balance.toFixed(2);
                
                        console.log(`${i++}. ${metadata.symbol}: ${balance}`);
                    }
                    }
                    AddWallet(account_address, balances);
                
                    
                
                    if (account_address) {
                    // let { TokenA, TokenB, AmountIn } = await prompt.get(["TokenA", "TokenB", "AmountIn"]);
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                    });
                    for (let token of nonZeroBalances) {
                        const metadata = await alchemy.core.getTokenMetadata(
                        token.contractAddress
                        );
                
                        if (tokenTosell_A === metadata.symbol.toLowerCase()) {
                        tokenTosell_A = token.contractAddress;
                        }else if(tokenTosell_A === WETH.name) {
                        tokenTosell_A = WETH.address
                        }
                
                        if (tokenToReceive_B == metadata.symbol.toLowerCase()) {
                        tokenToReceive_B = token.contractAddress;
                        }
                        else if(tokenToReceive_B === WETH.name) {
                        tokenToReceive_B = WETH.address
                        }
                    }
                
                    const { token0, token1 } = sortTokens(tokenTosell_A, tokenToReceive_B);
                    const pairResult = await pairFor(token0, token1);
            
                    if (pairResult != undefined) {
                        const reserves = await getReserves(pairResult);
                
                        const { _reserve0: reserve0, _reserve1: reserve1 } = reserves;
                
                        setReserves([reserve0, reserve1]);
                        console.log("RESERVE0 BEFORE SWAP : ", reserves._reserve0)
                        console.log("RESERVE1 BEFORE SWAP : ", reserves._reserve1)
                        var amountIn = amountToSell
                        console.log("amountIn :::", amountIn);
                        const swapResult = await v2Router.swapExactTokensForTokens(
                            amountIn,
                            0,
                            [token0, token1],
                            account_address,
                            Math.floor(Date.now() / 1000) + 60 * 10
                        );
                        console.log("swapResult", swapResult);
                
                        let getdb = get.getAccountWallet(account_address)
                        
                        getdb.tokenBalances.forEach(item => {
                            if(item.contractAddress === tokenTosell_A) {
                                let realTokenABalanceValue = item.tokenBalance
                                let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                    
                                return newTokenABalanceValue
                            }
                            else if(WETH.address === tokenTosell_A) {
                                let realTokenABalanceValue = WETH.balance
                                let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenABalanceValue} \n`);
    
                                return newTokenABalanceValue
                            }
    
    
                            if(item.contractAddress === tokenToReceive_B) {
                                let realTokenBBalanceValue = item.tokenBalance
                                let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                    
                                return newTokenBBalanceValue
                            }
                            else if(WETH.address === tokenToReceive_B) {
                                let realTokenBBalanceValue = WETH.balance
                                let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenBBalanceValue} \n`);
    
                                return newTokenBBalanceValue
                            }     
                        })
                    } 
                    else {
                        console.log("Aucune paire trouvé pour ces addresses");
                    }
                    }
                };
                
                const runHandleAddress = async () => {
                    try {
                    await handleAddress();
                    } 
                    catch (error) {
                    console.log("Impossible de traiter l'adresse soumise Veuillez réessayer");
                    console.log(error);
                    }
                };
                await runHandleAddress();
                
                let question = await readline.questionInt("Voulez vous continuer ? Si Oui tapez (1), Sinon (0) ");
                if (question === 1) {
                    main();
                }
                else {
                    return
                }
                main("Entrez une valeur vide pour arrêter le script");
            }
        }
        main();
    }
    else if(youWantDo === 2) {
        async function main(message) {
            var tokenTobuy_A = await readline.question("\n\nQuel token souhaitez vous Acheter ? \n")
            var tokenToReceive_B = await readline.question(`\n\nA partir de quel token souhaitez vous acheter des ${tokenTobuy_A} ? \n`)
            var amountToSell = await readline.question(`\n\nCombien de ${tokenTobuy_A.toUpperCase()} souhaitez-vous recevoir a partir des ${tokenToReceive_B.toUpperCase()} ? \n`)
                
            if(tokenTobuy_A === "weth" || tokenTobuy_A === "WETH") {
                console.log("swapETHForExactTokens");
                if (message) console.log(message);
                const account_address = await readline.question("\nEntrez votre addresse Wallet :  ");
                exports.account_address = account_address

                let WETH = {
                    name : "weth",
                    address : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                    balance : await web3.eth.getBalance(`${account_address}`)
                }
                
                if (!account_address) return;
                const handleAddress = async () => {
                
                    let balances = BD.getAccountWallet(account_address);
                    if(balances) {
                        let i = 1;
                        console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}\n`);
                        for(let items of tokensTosell) {
                            for(let balance of balances.tokenBalances) {
                                if(balance.contractAddress == items.address) {
                                    newObj = {
                                    name : items.name,
                                    address : balance.contractAddress,
                                    balance : balance.tokenBalance
                                    }
                                    console.log(`${i++}. ${newObj.name.toUpperCase()} : ${Number(newObj.balance)}\n`);
                                }
                            }
                        }
                    }
                    else if (balances == undefined) {
                        balances = await alchemy.core.getTokenBalances(account_address);
                    
                        const nonZeroBalances = balances.tokenBalances.filter((token) => {
                            return token.tokenBalance !== "0";
                        });
                        console.log(`Token balances of ${account_address} \n`);
                        console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}`);
                        
                        let i = 1;
                        
                        for (let token of nonZeroBalances) {
                            let balance = token.tokenBalance;
                            const metadata = await alchemy.core.getTokenMetadata(
                            token.contractAddress
                            );
                            balance = balance / Math.pow(10, metadata.decimals);
                            balance = balance.toFixed(2);
                            
                            console.log(`${i++}. ${metadata.symbol}: ${balance}`);
                        }
                    }
                    AddWallet(account_address, balances);
                
                    if (account_address) {
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                    });
                    for(let token of nonZeroBalances) {
                        const metadata = await alchemy.core.getTokenMetadata(
                        token.contractAddress
                        );
                        
                        if (tokenTobuy_A === metadata.symbol.toLowerCase()) {
                            tokenTobuy_A = token.contractAddress;
                        }else if(tokenTobuy_A === WETH.name) {
                        tokenTobuy_A = WETH.address
                        }
                    
                        if (tokenToReceive_B == metadata.symbol.toLowerCase()) {
                            tokenToReceive_B = token.contractAddress;
                        }
                        else if(tokenToReceive_B === WETH.name) {
                        tokenToReceive_B = WETH.address
                        }
                    }
                    
                    const { token0, token1 } = sortTokens(tokenTobuy_A, tokenToReceive_B);
                    const pairResult = await pairFor(token0, token1);
                    
                    if (pairResult != undefined) {
                        const reserves = await getReserves(pairResult);
                    
                        const { _reserve0: reserve0, _reserve1: reserve1 } = reserves;
                    
                        setReserves([reserve0, reserve1]);
                        console.log("RESERVE0 BEFORE SWAP : ", reserves._reserve0)
                        console.log("RESERVE1 BEFORE SWAP : ", reserves._reserve1)
                        const swapResult = await v2Router.swapETHForExactTokens(
                            amountToSell,
                            [token0, token1],
                            account_address,
                            Math.floor(Date.now() / 1000) + 60 * 10
                        );
                        console.log("swapResult", swapResult);
                        
                        let getdb = get.getAccountWallet(account_address)
                        
                        getdb.tokenBalances.forEach(item => {
                            if(item.contractAddress === tokenTobuy_A) {
                                let realTokenABalanceValue = item.tokenBalance
                                let newTokenABalanceValue = Number(realTokenABalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenTobuy_A, `${newTokenABalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenABalanceValue} \n`);
                            
                                return newTokenABalanceValue
                            }
                            else if(WETH.address === tokenTobuy_A) {
                                let realTokenABalanceValue = WETH.balance
                                let newTokenABalanceValue = Number(realTokenABalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenTobuy_A, `${newTokenABalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenABalanceValue} \n`);
                                return newTokenABalanceValue
                            }


                            if(item.contractAddress === tokenToReceive_B) {
                                let realTokenBBalanceValue = item.tokenBalance
                                let newTokenBBalanceValue = Number(realTokenBBalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenBBalanceValue} \n`);
                            
                                return newTokenBBalanceValue
                            }
                            else if(WETH.address === tokenToReceive_B) {
                                let realTokenBBalanceValue = WETH.balance
                                let newTokenBBalanceValue = Number(realTokenBBalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenBBalanceValue} \n`);

                                return newTokenBBalanceValue
                            }
                        })
                    }
                    else {
                        console.log("Aucune paire trouvé pour ces addresses");
                    }
                    }
                };
                
                const runHandleAddress = async () => {
                    try {
                    await handleAddress();
                    } catch (error) {
                    console.log("Impossible de traiter l'adresse soumise Veuillez réessayer");
                    console.log(error);
                    }
                };
                await runHandleAddress();

                let question = await readline.questionInt("Voulez vous continuer ? Si Oui tapez (1), Sinon (0) ");
                if (question === 1) {
                    main();
                }
                else {
                    return
                }
                main("Entrez une valeur vide pour arrêter le script");
            }
            else if(tokenToReceive_B === "weth" || tokenToReceive_B === "WETH") {
                console.log("swapTokensForExactETH");
                if (message) console.log(message);
                const account_address = await readline.question("\nEntrez votre addresse Wallet :  ");
                exports.account_address = account_address

                let WETH = {
                    name : "weth",
                    address : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                    balance : await web3.eth.getBalance(`${account_address}`)
                }
                
                if (!account_address) return;
                const handleAddress = async () => {
                
                    let balances = BD.getAccountWallet(account_address);
                    if(balances) {
                    let i = 1;
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}\n`);
                    for(let items of tokensTosell) {
                        for(let balance of balances.tokenBalances) {
                        if(balance.contractAddress == items.address) {
                            newObj = {
                            name : items.name,
                            address : balance.contractAddress,
                            balance : balance.tokenBalance
                            }
                            console.log(`${i++}. ${newObj.name.toUpperCase()} : ${Number(newObj.balance)}\n`);
                        }
                        }
                    }
                    }
                    else if (balances == undefined) {
                    balances = await alchemy.core.getTokenBalances(account_address);
                
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                    });
                    console.log(`Token balances of ${account_address} \n`);
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}`);
                    
                    let i = 1;
                    
                    for (let token of nonZeroBalances) {
                        let balance = token.tokenBalance;
                        const metadata = await alchemy.core.getTokenMetadata(
                        token.contractAddress
                        );
                        balance = balance / Math.pow(10, metadata.decimals);
                        balance = balance.toFixed(2);
                        
                        console.log(`${i++}. ${metadata.symbol}: ${balance}`);
                    }
                    }
                    AddWallet(account_address, balances);
                
                    if (account_address) {
                   
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                    });
                    for(let token of nonZeroBalances) {
                        const metadata = await alchemy.core.getTokenMetadata(
                        token.contractAddress
                        );
                        
                        if (tokenTobuy_A === metadata.symbol.toLowerCase()) {
                            tokenTobuy_A = token.contractAddress;
                        }else if(tokenTobuy_A === WETH.name) {
                            tokenTobuy_A = WETH.address
                        }
                    
                        if (tokenToReceive_B == metadata.symbol.toLowerCase()) {
                            tokenToReceive_B = token.contractAddress;
                        }
                        else if(tokenToReceive_B === WETH.name) {
                        tokenToReceive_B = WETH.address
                        }
                    }
                    
                    const { token0, token1 } = sortTokens(tokenTobuy_A, tokenToReceive_B);
                    const pairResult = await pairFor(token0, token1);
                    
                    if (pairResult != undefined) {
                        const reserves = await getReserves(pairResult);
                    
                        const { _reserve0: reserve0, _reserve1: reserve1 } = reserves;
                    
                        setReserves([reserve0, reserve1]);
                        console.log("RESERVE0 BEFORE SWAP : ", reserves._reserve0)
                        console.log("RESERVE1 BEFORE SWAP : ", reserves._reserve1)
                        const swapResult = await v2Router.swapTokensForExactETH(
                        amountToSell,
                        0,
                        [token0, token1],
                        account_address,
                        Math.floor(Date.now() / 1000) + 60 * 10
                        );
                        console.log("swapResult", swapResult);
                        
                        let getdb = get.getAccountWallet(account_address)
                        
                        getdb.tokenBalances.forEach(item => {
                            if(item.contractAddress === tokenTobuy_A) {
                                let realTokenABalanceValue = item.tokenBalance
                                let newTokenABalanceValue = Number(realTokenABalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenTobuy_A, `${newTokenABalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenABalanceValue} \n`);
                            
                                return newTokenABalanceValue
                            }
                            else if(WETH.address === tokenTobuy_A) {
                                let realTokenABalanceValue = WETH.balance
                                let newTokenABalanceValue = Number(realTokenABalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenTobuy_A, `${newTokenABalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenABalanceValue} \n`);
                                return newTokenABalanceValue
                            }
    
    
                            if(item.contractAddress === tokenToReceive_B) {
                                let realTokenBBalanceValue = item.tokenBalance
                                let newTokenBBalanceValue = Number(realTokenBBalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenBBalanceValue} \n`);
                            
                                return newTokenBBalanceValue
                            }
                            else if(WETH.address === tokenToReceive_B) {
                                let realTokenBBalanceValue = WETH.balance
                                let newTokenBBalanceValue = Number(realTokenBBalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenBBalanceValue} \n`);
    
                                return newTokenBBalanceValue
                            }
                        })
                    }
                    else {
                        console.log("Aucune paire trouvé pour ces addresses");
                    }
                    }
                };
                
                const runHandleAddress = async () => {
                    try {
                    await handleAddress();
                    } catch (error) {
                    console.log("Impossible de traiter l'adresse soumise Veuillez réessayer");
                    console.log(error);
                    }
                };
                await runHandleAddress();

                let question = await readline.questionInt("Voulez vous continuer ? Si Oui tapez (1), Sinon (0) ");
                if (question === 1) {
                    main();
                }
                else {
                    return
                }
                main("Entrez une valeur vide pour arrêter le script");
                
            }
            else {
                console.log("swapTokensForExactTokens");
                if (message) console.log(message);
                const account_address = await readline.question("\nEntrez votre addresse Wallet :  ");
                exports.account_address = account_address

                let WETH = {
                    name : "weth",
                    address : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                    balance : await web3.eth.getBalance(`${account_address}`)
                }
                
                if (!account_address) return;
                const handleAddress = async () => {
                
                    let balances = BD.getAccountWallet(account_address);
                    if(balances) {
                    let i = 1;
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}\n`);
                    for(let items of tokensTosell) {
                        for(let balance of balances.tokenBalances) {
                        if(balance.contractAddress == items.address) {
                            newObj = {
                            name : items.name,
                            address : balance.contractAddress,
                            balance : balance.tokenBalance
                            }
                            console.log(`${i++}. ${newObj.name.toUpperCase()} : ${Number(newObj.balance)}\n`);
                        }
                        }
                    }
                    }
                    else if (balances == undefined) {
                    balances = await alchemy.core.getTokenBalances(account_address);
                
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                    });
                    console.log(`Token balances of ${account_address} \n`);
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}`);
                    
                    let i = 1;
                    
                    for (let token of nonZeroBalances) {
                        let balance = token.tokenBalance;
                        const metadata = await alchemy.core.getTokenMetadata(
                        token.contractAddress
                        );
                        balance = balance / Math.pow(10, metadata.decimals);
                        balance = balance.toFixed(2);
                        
                        console.log(`${i++}. ${metadata.symbol}: ${balance}`);
                    }
                    }
                    AddWallet(account_address, balances);
                
                    if (account_address) {
                    
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                    });
                    for(let token of nonZeroBalances) {
                        const metadata = await alchemy.core.getTokenMetadata(
                        token.contractAddress
                        );
                        
                        if (tokenTobuy_A === metadata.symbol.toLowerCase()) {
                            tokenTobuy_A = token.contractAddress;
                        }else if(tokenTobuy_A === WETH.name) {
                        tokenTobuy_A = WETH.address
                        }
                    
                        if (tokenToReceive_B == metadata.symbol.toLowerCase()) {
                            tokenToReceive_B = token.contractAddress;
                        }
                        else if(tokenToReceive_B === WETH.name) {
                        tokenToReceive_B = WETH.address
                        }
                    }
                    
                    const { token0, token1 } = sortTokens(tokenTobuy_A, tokenToReceive_B);
                    const pairResult = await pairFor(token0, token1);
                    
                    if (pairResult != undefined) {
                        const reserves = await getReserves(pairResult);
                    
                        const { _reserve0: reserve0, _reserve1: reserve1 } = reserves;
                    
                        setReserves([reserve0, reserve1]);
                        console.log("RESERVE0 BEFORE SWAP : ", reserves._reserve0)
                        console.log("RESERVE1 BEFORE SWAP : ", reserves._reserve1)
                        const swapResult = await v2Router.swapTokensForExactTokens(
                        amountToSell,
                        0,
                        [token0, token1],
                        account_address,
                        Math.floor(Date.now() / 1000) + 60 * 10
                        );
                        console.log("swapResult", swapResult);
                        
                        let getdb = get.getAccountWallet(account_address)
                        
                        getdb.tokenBalances.forEach(item => {
                            if(item.contractAddress === tokenTobuy_A) {
                                let realTokenABalanceValue = item.tokenBalance
                                let newTokenABalanceValue = Number(realTokenABalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenTobuy_A, `${newTokenABalanceValue}`);
                                console.log(":::", tokenTobuy_A);
                                return newTokenABalanceValue
                            }
                            else if(WETH.address === tokenTobuy_A) {
                                let realTokenABalanceValue = WETH.balance
                                let newTokenABalanceValue = Number(realTokenABalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenTobuy_A, `${newTokenABalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenABalanceValue} \n`);
                                return newTokenABalanceValue
                            }
    
    
                            if(item.contractAddress === tokenToReceive_B) {
                                let realTokenBBalanceValue = item.tokenBalance
                                let newTokenBBalanceValue = Number(realTokenBBalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                                console.log(":::", tokenToReceive_B);
                                return newTokenBBalanceValue
                            }
                            else if(WETH.address === tokenToReceive_B) {
                                let realTokenBBalanceValue = WETH.balance
                                let newTokenBBalanceValue = Number(realTokenBBalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                                console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenBBalanceValue} \n`);
    
                                return newTokenBBalanceValue
                            }
                        })
                    }
                    else {
                        console.log("Aucune paire trouvé pour ces addresses");
                    }
                    }
                };
                
                const runHandleAddress = async () => {
                    try {
                    await handleAddress();
                    } catch (error) {
                    console.log("Impossible de traiter l'adresse soumise Veuillez réessayer");
                    console.log(error);
                    }
                };
                await runHandleAddress();

                let question = await readline.questionInt("Voulez vous continuer ? Si Oui tapez (1), Sinon (0) ");
                if (question === 1) {
                    main();
                }
                else {
                    return
                }
                main("Entrez une valeur vide pour arrêter le script");
            }
        }
        main()
    }
    else if(youWantDo === 3) {
        async function main(message) {
            var tokenTosell_A = await readline.question("\n\nQuel token souhaitez vous vendre ? \n")
            
            var tokenToReceive_B = await readline.question("\n\nQuel token souhaitez vous recevoir ? \n")
            
            var amountToSell = await readline.question(`\n\nCombien de ${tokenTosell_A.toUpperCase()} souhaitez-vous vendre pour des ${tokenToReceive_B.toUpperCase()} ? \n`)
            
            tokenTosell_A = tokenTosell_A.toLowerCase() || tokenTosell_A.toUpperCase();
            tokenToReceive_B = tokenToReceive_B.toLowerCase() || tokenToReceive_B.toUpperCase();

            
            if(tokenTosell_A === "weth" || tokenTosell_A === "WETH") {
                console.log("swapExactETHForTokensSupportingFeeOnTransferTokens");
                
                if (message) console.log(message);
                const account_address = await readline.question("\nEntrez votre addresse Wallet :  ");
                exports.account_address = account_address
            
                let WETH = {
                name : "weth",
                address : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                balance : await web3.eth.getBalance(`${account_address}`)
                }
                
                if (!account_address) return;
                const handleAddress = async () => {
                
                let balances = BD.getAccountWallet(account_address);
                    if(balances) {
                        let i = 1;
                        console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}\n`);
                        for(let items of tokensTosell) {
                            for(let balance of balances.tokenBalances) {
                                if(balance.contractAddress == items.address) {
                                    newObj = {
                                        name : items.name,
                                        address : balance.contractAddress,
                                        balance : balance.tokenBalance
                                    }
                                    console.log(`${i++}. ${newObj.name.toUpperCase()} : ${Number(newObj.balance)}\n`);
                                }
                            }
                        }
                    }
                    else if (balances == undefined) {
                        balances = await alchemy.core.getTokenBalances(account_address);
                    
                        const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                        });
                        console.log(`Token balances of ${account_address} \n`);
                        console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}`);
                    
                        let i = 1;
                    
                        for (let token of nonZeroBalances) {
                            let balance = token.tokenBalance;
                            const metadata = await alchemy.core.getTokenMetadata(
                            token.contractAddress
                            );
                            balance = balance / Math.pow(10, metadata.decimals);
                            balance = balance.toFixed(2);
                            
                            console.log(`${i++}. ${metadata.symbol}: ${balance}`);
                        }
                    }
                    AddWallet(account_address, balances);
                    
                    if (account_address) {
                        const nonZeroBalances = balances.tokenBalances.filter((token) => {
                            return token.tokenBalance !== "0";
                        });
                        for(let token of nonZeroBalances) {
                            const metadata = await alchemy.core.getTokenMetadata(
                            token.contractAddress
                            );
                            
                            if (tokenTosell_A === metadata.symbol.toLowerCase()) {
                                tokenTosell_A = token.contractAddress;
                            }else if(tokenTosell_A === WETH.name) {
                                tokenTosell_A = WETH.address
                            }
                            
                            if (tokenToReceive_B == metadata.symbol.toLowerCase()) {
                                tokenToReceive_B = token.contractAddress;
                            }
                            else if(tokenToReceive_B === WETH.name) {
                                tokenToReceive_B = WETH.address
                            }
                        }
                
                        const { token0, token1 } = sortTokens(tokenTosell_A, tokenToReceive_B);
                        const pairResult = await pairFor(token0, token1);
                    
                        if (pairResult != undefined) {
                            const reserves = await getReserves(pairResult);
                        
                            const { _reserve0: reserve0, _reserve1: reserve1 } = reserves;
                        
                            setReserves([reserve0, reserve1]);
                            console.log("RESERVE0 BEFORE SWAP : ", reserves._reserve0)
                            console.log("RESERVE1 BEFORE SWAP : ", reserves._reserve1)
                            const swapResult = await v2Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
                                amountToSell,
                                [token0, token1],
                                account_address,
                                Math.floor(Date.now() / 1000) + 60 * 10
                            );
                            console.log("swapResult", swapResult);
                            
                            let getdb = get.getAccountWallet(account_address)
                        
                            getdb.tokenBalances.forEach(item => {
                                if(item.contractAddress === tokenTosell_A) {
                                    let realTokenABalanceValue = item.tokenBalance
                                    console.log(" realTokenABalanceValue = item.tokenBalance", realTokenABalanceValue," =", item.tokenBalance);
                                    let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                    console.log(" realTokenABalanceValue = item.tokenBalance", newTokenABalanceValue);
                                    
                                    UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                        
                                    return newTokenABalanceValue
                                }
                                else if(WETH.address === tokenTosell_A) {
                                    let realTokenABalanceValue = WETH.balance
                                    let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                                    UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                                    console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenABalanceValue} \n`);
                                    console.log(" realTokenABalanceValue = item.tokenBalance", newTokenABalanceValue);
                                    return newTokenABalanceValue
                                }
                
                
                                if(item.contractAddress === tokenToReceive_B) {
                                    let realTokenBBalanceValue = item.tokenBalance
                                    console.log("realTokenBBalanceValue ::", realTokenBBalanceValue);
                                    let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                    UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                        
                                    return newTokenBBalanceValue
                                }
                                else if(WETH.address === tokenToReceive_B) {
                                    let realTokenBBalanceValue = WETH.balance
                                    console.log("realTokenBBalanceValue ::", realTokenBBalanceValue);
                                    let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                                    UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                                    console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenBBalanceValue} \n`);
                    
                                    return newTokenBBalanceValue
                                }     
                            })
                        }
                        else {
                        console.log("Aucune paire trouvé pour ces addresses");
                    }
                        }
                    };
                
                    const runHandleAddress = async () => {
                        try {
                            await handleAddress();
                        } catch (error) {
                            console.log("Impossible de traiter l'adresse soumise Veuillez réessayer");
                            console.log(error);
                        }
                    };
                    await runHandleAddress();
            
                    let question = await readline.questionInt("Voulez vous continuer ? Si Oui tapez (1), Sinon (0) ");
                    if (question === 1) {
                        main();
                    }
                    else {
                        return
                    }
                main("Entrez une valeur vide pour arrêter le script");
                
            }
            else if(tokenToReceive_B === "weth" || tokenToReceive_B === "WETH") {
                console.log("swapExactTokensForETHSupportingFeeOnTransferTokens");
                if (message) console.log(message);
                const account_address = await readline.question("\nEntrez votre addresse Wallet :  ");
                exports.account_address = account_address

                let WETH = {
                    name : "weth",
                    address : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                    balance : await web3.eth.getBalance(`${account_address}`)
                }
                
                if (!account_address) return;
                const handleAddress = async () => {
                
                    let balances = BD.getAccountWallet(account_address);
                    if(balances) {
                    let i = 1;
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}\n`);
                    for(let items of tokensTosell) {
                        for(let balance of balances.tokenBalances) {
                        if(balance.contractAddress == items.address) {
                            newObj = {
                            name : items.name,
                            address : balance.contractAddress,
                            balance : balance.tokenBalance
                            }
                            console.log(`${i++}. ${newObj.name.toUpperCase()} : ${Number(newObj.balance)}\n`);
                        }
                        }
                    }
                    }
                    else if (balances == undefined) {
                    balances = await alchemy.core.getTokenBalances(account_address);
                
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                    });
                    console.log(`Token balances of ${account_address} \n`);
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}`);
                    
                    let i = 1;
                    
                    for (let token of nonZeroBalances) {
                        let balance = token.tokenBalance;
                        const metadata = await alchemy.core.getTokenMetadata(
                        token.contractAddress
                        );
                        balance = balance / Math.pow(10, metadata.decimals);
                        balance = balance.toFixed(2);
                        
                        console.log(`${i++}. ${metadata.symbol}: ${balance}`);
                    }
                    }
                    AddWallet(account_address, balances);
                
                    if (account_address) {
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                    });
                    for(let token of nonZeroBalances) {
                        const metadata = await alchemy.core.getTokenMetadata(
                        token.contractAddress
                        );
                        
                        if (tokenTosell_A === metadata.symbol.toLowerCase()) {
                            tokenTosell_A = token.contractAddress;
                        }else if(tokenTosell_A === WETH.name) {
                        tokenTosell_A = WETH.address
                        }
                    
                        if (tokenToReceive_B == metadata.symbol.toLowerCase()) {
                            tokenToReceive_B = token.contractAddress;
                        }
                        else if(tokenToReceive_B === WETH.name) {
                        tokenToReceive_B = WETH.address
                        }
                    }
                    
                    const { token0, token1 } = sortTokens(tokenTosell_A, tokenToReceive_B);
                    const pairResult = await pairFor(token0, token1);
                    
                    if (pairResult != undefined) {
                        const reserves = await getReserves(pairResult);
                    
                        const { _reserve0: reserve0, _reserve1: reserve1 } = reserves;
                    
                        setReserves([reserve0, reserve1]);
                        console.log("RESERVE0 BEFORE SWAP : ", reserves._reserve0)
                        console.log("RESERVE1 BEFORE SWAP : ", reserves._reserve1)

                        var amountIn = amountToSell

                        const swapResult = await v2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
                            amountIn,
                            0,
                            [token0, token1],
                            account_address,
                            Math.floor(Date.now() / 1000) + 60 * 10
                        );
                        console.log("swapResult", swapResult);
                        
                        let getdb = get.getAccountWallet(account_address)
                        
                        getdb.tokenBalances.forEach(item => {
                        if(item.contractAddress === tokenTosell_A) {
                            let realTokenABalanceValue = item.tokenBalance
                            let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                            UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                
                            return newTokenABalanceValue
                        }
                        else if(WETH.address === tokenTosell_A) {
                            let realTokenABalanceValue = WETH.balance
                            let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                            UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                            console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenABalanceValue} \n`);

                            return newTokenABalanceValue
                        }


                        if(item.contractAddress === tokenToReceive_B) {
                            let realTokenBBalanceValue = item.tokenBalance
                            let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                            UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                
                            return newTokenBBalanceValue
                        }
                        else if(WETH.address === tokenToReceive_B) {
                            let realTokenBBalanceValue = WETH.balance
                            let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                            UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                            console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenBBalanceValue} \n`);

                            return newTokenBBalanceValue
                        }     
                        })
                    }
                    else {
                        console.log("Aucune paire trouvé pour ces addresses");
                    }
                    }
                };
                
                const runHandleAddress = async () => {
                    try {
                        await handleAddress();
                    } catch (error) {
                        console.log("Impossible de traiter l'adresse soumise Veuillez réessayer");
                        console.log(error);
                    }
                };
                await runHandleAddress();

                let question = await readline.questionInt("Voulez vous continuer ? Si Oui tapez (1), Sinon (0) ");
                if (question === 1) {
                    main();
                }
                else {
                    return
                }
                main("Entrez une valeur vide pour arrêter le script");
            }
            else {
                console.log("swapExactTokensForTokensSupportingFeeOnTransferTokens");
                if (message) console.log(message);
    
                const account_address = await readline.question("\nEntrez votre addresse Wallet :  ");
                exports.account_address = account_address

                let WETH = {
                    name : "weth",
                    address : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
                    balance : await web3.eth.getBalance(`${account_address}`)
                }
                exports.WETH = WETH

                if (!account_address) return;
                
                const handleAddress = async () => {
                
                    let balances = BD.getAccountWallet(account_address);
                    if(balances) {
                    let i = 1;
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}\n`);
                    for(let items of tokensTosell) {
                        for(let balance of balances.tokenBalances) {
                        if(balance.contractAddress == items.address) {
                            newObj = {
                            name : items.name,
                            address : balance.contractAddress,
                            balance : balance.tokenBalance
                            }
                            console.log(`${i++}. ${newObj.name.toUpperCase()} : ${Number(newObj.balance)}\n`);//, ${newObj.address}
                        }
                        }
                    }
                    }
                    else if (balances == undefined) {
                    balances = await alchemy.core.getTokenBalances(account_address);
            
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                        });
                    console.log(`Token balances of ${account_address} \n`);
                    console.log(`\n0. ${WETH.name.toUpperCase()} : ${WETH.balance}`);
            
                    let i = 1;
            
                    for (let token of nonZeroBalances) {
                        let balance = token.tokenBalance;
                        const metadata = await alchemy.core.getTokenMetadata(
                            token.contractAddress
                        );
                        balance = balance / Math.pow(10, metadata.decimals);
                        balance = balance.toFixed(2);
                
                        console.log(`${i++}. ${metadata.symbol}: ${balance}`);
                    }
                    }
                    AddWallet(account_address, balances);
                
                    
                
                    if (account_address) {
                    const nonZeroBalances = balances.tokenBalances.filter((token) => {
                        return token.tokenBalance !== "0";
                    });
                    for (let token of nonZeroBalances) {
                        const metadata = await alchemy.core.getTokenMetadata(
                        token.contractAddress
                        );
                
                        if (tokenTosell_A === metadata.symbol.toLowerCase()) {
                        tokenTosell_A = token.contractAddress;
                        }else if(tokenTosell_A === WETH.name) {
                        tokenTosell_A = WETH.address
                        }
                
                        if (tokenToReceive_B == metadata.symbol.toLowerCase()) {
                        tokenToReceive_B = token.contractAddress;
                        }
                        else if(tokenToReceive_B === WETH.name) {
                        tokenToReceive_B = WETH.address
                        }
                    }
                
                    const { token0, token1 } = sortTokens(tokenTosell_A, tokenToReceive_B);
                    const pairResult = await pairFor(token0, token1);
            
                    if (pairResult != undefined) {
                        const reserves = await getReserves(pairResult);
                
                        const { _reserve0: reserve0, _reserve1: reserve1 } = reserves;
                
                        setReserves([reserve0, reserve1]);
                        console.log("RESERVE0 BEFORE SWAP : ", reserves._reserve0)
                        console.log("RESERVE1 BEFORE SWAP : ", reserves._reserve1)
                        var amountIn = amountToSell;
                        const swapResult = await v2Router.swapExactTokensForTokensSupportingFeeOnTransferTokens( //le calcul est bon aussi
                            amountIn,
                            0,
                            [token0, token1],
                            account_address,
                            Math.floor(Date.now() / 1000) + 60 * 10
                            );
                        console.log("swapResult", swapResult);

                        let getdb = get.getAccountWallet(account_address)
                        
                        getdb.tokenBalances.forEach(item => {
                        if(item.contractAddress === tokenTosell_A) {
                            let realTokenABalanceValue = item.tokenBalance
                            let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                            UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                
                            return newTokenABalanceValue
                        }
                        else if(WETH.address === tokenTosell_A) {
                            let realTokenABalanceValue = WETH.balance
                            let newTokenABalanceValue = Number(realTokenABalanceValue) - Number(web3.utils.toWei(swapResult[0].toString(), 'ether'));
                            UpdateTokensWallet(account_address, tokenTosell_A, `${newTokenABalanceValue}`);
                            console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenABalanceValue} \n`);

                            return newTokenABalanceValue
                        }


                        if(item.contractAddress === tokenToReceive_B) {
                            let realTokenBBalanceValue = item.tokenBalance
                            let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                            UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                
                            return newTokenBBalanceValue
                        }
                        else if(WETH.address === tokenToReceive_B) {
                            let realTokenBBalanceValue = WETH.balance
                            let newTokenBBalanceValue = Number(realTokenBBalanceValue) + Number(web3.utils.toWei(swapResult[1].toString(), 'ether'));
                            UpdateTokensWallet(account_address, tokenToReceive_B, `${newTokenBBalanceValue}`);
                            console.log(`X. ${WETH.name.toUpperCase()} : ${newTokenBBalanceValue} \n`);

                            return newTokenBBalanceValue
                        }     
                        })
                    } 
                    else {
                        console.log("Aucune paire trouvé pour ces addresses");
                    }
                    }
                };
                
                const runHandleAddress = async () => {
                    try {
                    await handleAddress();
                    } 
                    catch (error) {
                    console.log("Impossible de traiter l'adresse soumise Veuillez réessayer");
                    console.log(error);
                    }
                };
                await runHandleAddress();
                
                let question = await readline.questionInt("Voulez vous continuer ? Si Oui tapez (1), Sinon (0) ");
                if (question === 1) {
                    main();
                }
                else {
                    return
                }
                main("Entrez une valeur vide pour arrêter le script");
            }
        }
        main();
    }
}
else {
  console.log("Bye...");
  return
}