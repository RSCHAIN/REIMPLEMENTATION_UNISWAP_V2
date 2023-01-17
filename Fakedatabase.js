const Web3 = require("web3");
const web3_url =
  "https://eth-goerli.g.alchemy.com/v2/zCeQuHRZxylPkCVxv4T6n-fe3ubmcJj4";

var web3_provider = new Web3.providers.HttpProvider(web3_url);
var web3 = new Web3(web3_provider);

var Contract = require("web3-eth-contract");


const { rejects } = require("assert");
const fichier = require("fs");

const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");
const weth = require('./UniswapV2Library')

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


var BD = {};

exports.BD = BD;

function saveBD(json) {
  fichier.writeFileSync("./tokensList.json", JSON.stringify(json), async function (err) {
      if (err) 
        reject(err);
      resolve();
    }
  );
}

function getBD() {
  return JSON.parse(readFileSync("./tokensList.json", "utf-8") || '{}');
}
module.exports.getBD = getBD

//Pour ajouter un wallet et ses tokens dans la BD.
exports.AddWallet = async (walletID, tokenBalances) => {
  const BD = getBD();
  BD[walletID] = tokenBalances;
  saveBD(BD);
};

//Modifier les données d'un wallet après le swap, pour justement leur attribuer leurs nouvelles valeurs apres le swap.
exports.UpdateTokensWallet = (walletId, tokenId, newTokenBalance) => {
  const BD = getBD();
  BD[walletId].tokenBalances = BD[walletId].tokenBalances.map((token) => {
    if (token.contractAddress == tokenId) {
      return {
        contractAddress: tokenId,
        tokenBalance: newTokenBalance,
      };
    }
    return token;
  });

  saveBD(BD);


  console.log("\nWallet After Swap : ");
  let newObj = {};
  let i = 1;
  for(let items of tokensTosell) {
    for(let balance of BD[walletId].tokenBalances) {
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
};


//Obtenir les données d'un wallet existant déjà dans la BD après un swap.
exports.getAccountWallet = (accountAddress) => {
  const BD = getBD();
  return BD[accountAddress];
};