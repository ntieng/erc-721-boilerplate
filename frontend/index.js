/*** SET THESE VARIABLES ***/
const contractAddress = "0x0868AE1dFae35D6419b672Dd68bAbdA45275e001"; // Update with the address of your smart contract
const contractAbi = "./Simple721.json"; // Update with an ABI file, for example "./sampleAbi.json"

/*** Global scope variables that will be automatically assigned values later on ***/
let infoSpace; // This is an <ul> element where we will print out all the info
let web3; // Web3 instance
let contract; // Contract instance
let account; // Your account as will be reported by Metamask
let networkId;
let connected = false;
let contractName;
let tokenSymbol;
let tokenDecimal;

$(document).ready(function () {
  document.getElementById("contract-address").innerHTML = "Contract Address: " + contractAddress;
  infoSpace = document.querySelector(".info");

  window.ethereum.on('accountsChanged', async () => {
    clearResult();
    await connectWallet();
  });

  window.ethereum.on('chainChanged', async () => {
    clearResult();
    await connectWallet();
  })

  $('#connect').click(async function () {
    clearResult();

    if (contractAddress === "" || contractAbi === "") {
      printResult(
        `Make sure to set the variables <code>contractAddress</code> and <code>contractAbi</code> in <code>./index.js</code> first. Check out <code>README.md</code> for more info.`
      );
      return;
    }

    if (typeof ethereum === "undefined") {
      printResult(
        `Metamask not connected. Make sure you have the Metamask plugin, you are logged in to your MetaMask account, and you are using a server or a localhost (simply opening the html in a browser won't work).`
      );
      return;
    }

    // Create a Web3 instance
    web3 = new Web3(window.ethereum);

    await connectWallet();
    await getChainId();
    await connectContract(contractAbi, contractAddress);
    await getBalance(account);
    await balanceOf(account);
  })

  $('#mint').click(async function () {
    clearResult();
    checkConnection();

    if (!connected) {
      return;
    }

    const receiverAddress = document.getElementById("receiver-address").value;
    if (!web3.utils.isAddress(receiverAddress)) {
      printResult(
        `Invalid receiver address`
      );
      return;
    }

    const mintId = document.getElementById("mint-id").value;
    if (!mintId) {
      printResult(
        `Invalid mint id`
      );
      return;
    }

    await mint(receiverAddress, mintId);
  })

  $('#transfer').click(async function () {
    clearResult();
    checkConnection();

    const transferAddress = document.getElementById("transfer-address").value;
    if (!web3.utils.isAddress(transferAddress)) {
      printResult(
        `Invalid transfer address`
      );
      return;
    }

    const transferAmount = document.getElementById("transfer-amount").value;
    if (!transferAmount) {
      printResult(
        `Invalid transfer amount`
      );
      return;
    }

    //calculate actual tokens amounts based on decimals in token
    let transferWeiAmount = web3.utils.toBN("0x" + (transferAmount * 10 ** tokenDecimal).toString(16));

    let balance = await contract.methods.balanceOf(account).call();
    let balanceInEther = convertToEther(balance);

    if (Number(balanceInEther) < Number(transferAmount)) {
      printResult(
        `Insufficient transfer amount`
      );
      return;
    }

    listenToTransferEvent(account, transferAddress, transferAmount); // Not an async function
    await transfer(transferAddress, transferWeiAmount);
  })
});

/*** Functions ***/
// Helper function to print results
const printResult = (text) => {
  infoSpace.innerHTML += `<li>${text}</li>`;
};

const clearResult = () => {
  infoSpace.innerHTML = '';
};

// Helper function to display readable address
const readableAddress = (address) => {
  return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
};

// Helper function to get JSON (in order to read ABI in our case)
const getContractJson = async (path) => {
  const response = await fetch(path);
  const data = await response.json();
  return data;
};

// Connect to the MetaMast wallet
const connectWallet = async () => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];
  printResult(`Connected account: ${readableAddress(account)}`);

  if (account) {
    connected = true;
    document.getElementById("wallet-address").innerHTML = "Wallet address: " + account;
  } else {
    connected = false;
  }
};

// Get current connected chainId
const getChainId = async () => {
  const networkId = await web3.eth.getChainId();

  if (networkId) {
    document.getElementById("chain-id").innerHTML = "Chain Id: " + networkId;
  }
}

// Connect to the contract
const connectContract = async (contractAbi, contractAddress) => {
  connected = false;
  
  await getContractJson(contractAbi).then(result => {
    const data = result;

    const contractABI = data.abi;
    contract = new web3.eth.Contract(contractABI, contractAddress);

    if (contract) {
      getContractInfo(contract);
    }
  }).catch(() => {
    printResult(`json not found`);
  })
};

const getContractInfo = async (contract) => {
  contractName = await contract.methods.name().call();
  document.getElementById("contract-name").innerHTML = "Contract Name: " + contractName;

  tokenSymbol = await contract.methods.symbol().call();
  document.getElementById("token-symbol").innerHTML = "Token Symbol: " + tokenSymbol;

  connected = true;
}

// Example of a web3 method
const getBalance = async (address) => {
  printResult(`getBalance() requested.`);
  const balance = await web3.eth.getBalance(address);
  printResult(`Account ${readableAddress(account)} has ${web3.utils.fromWei(balance)} currency`);
};

// Example of using call() on a contract's method that doesn't require gas
const balanceOf = async (account) => {
  printResult(`balanceOf() called.`);
  try {
    const balance = await contract.methods.balanceOf(account).call();
    printResult(`Account ${readableAddress(account)} has ${balance} NFT`);
  } catch (error) {
    printResult(`Error: ${error.message}`);
  }
};

// Convert units to ether
const convertToEther = (amount) => {
  let unit = '';
  if (tokenDecimal == 18) {
    unit = 'ether';
  }
  else if (tokenDecimal == 6) {
    unit = 'mwei';
  }
  else {
    printResult(
      `Invalid unit`
    );
    return;
  }
  return web3.utils.fromWei(amount, unit);
}

// Check connection before calling any functions
const checkConnection = () => {
  if (!connected) {
    printResult(
      `Kindly click connect.`
    );
    return;
  }

  if (contractAddress === "" || contractAbi === "") {
    printResult(
      `Make sure to set the variables <code>contractAddress</code> and <code>contractAbi</code> in <code>./index.js</code> first. Check out <code>README.md</code> for more info.`
    );
    return;
  }

  if (typeof ethereum === "undefined") {
    printResult(
      `Metamask not connected. Make sure you have the Metamask plugin, you are logged in to your MetaMask account, and you are using a server or a localhost (simply opening the html in a browser won't work).`
    );
    return;
  }
}

// Example of using mint() on a contract's method that requires gas
const mint = async (to, amount) => {
  printResult(`mint() called.`);
  try {
    const result = await contract.methods.safeMint(to, amount).send({ from: account });
    printResult(`Result: ${result.status}`);
  } catch (error) {
    printResult(`Error: ${error.message}`);
  }
};

// Example of using send() on a contract's method that requires gas
const transfer = async (to, amount) => {
  printResult(`transfer() called.`);
  try {
    const result = await contract.methods.transfer(to, amount).send({ from: account });
    printResult(`Result: ${result.status}`);
  } catch (error) {
    printResult(`Error: ${error.message}`);
  }
};

// Example of subscribing to an Event
const listenToTransferEvent = (account, receiverAccount, transferAmount) => {
  contract.events
    .Transfer(account, receiverAccount, transferAmount)
    .on("data", console.log)
    .on("error", console.error);
};