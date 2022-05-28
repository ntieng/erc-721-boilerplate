import { network, ethers, waffle } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Simple721, Simple721__factory } from "../typechain-types";
import { ContractTransaction } from "ethers";

let transaction: ContractTransaction | null = null;
let contractOwner: SignerWithAddress | null = null;
let tokenReceiver: SignerWithAddress | null = null;

beforeEach(async () => {
  [contractOwner, tokenReceiver] = await ethers.getSigners();
});

let simple721Factory: Simple721__factory | null = null;
let simple721Contract: Simple721 | null = null;
let simple721ContractAddress: string = "";

describe.only("Deploy contract and mint token", function () {
  it("Should deploy Simple721 and return contract address", async function () {
    simple721Factory = (await ethers.getContractFactory('Simple721')) as Simple721__factory;
    simple721Contract = await simple721Factory.deploy() as Simple721;
    simple721ContractAddress = simple721Contract.address;

    console.log("Simple721 Contract deployed to:", simple721ContractAddress);
    expect(simple721ContractAddress).to.be.properAddress;
  });

  it("Should mint 1 NFT to tokenReceiver", async function () {
    let Simple721ContractConnected = simple721Contract!.connect(contractOwner!);
    transaction = await Simple721ContractConnected.safeMint(tokenReceiver!.address, 1)

    var userTokenBalance = await Simple721ContractConnected.balanceOf(tokenReceiver!.address);
    expect(userTokenBalance).to.equal(1);
  })
})