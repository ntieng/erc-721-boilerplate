import { ethers, upgrades } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await run('compile');

  // Update proxy address here
  const proxyAddress = 'ENTER_PROXY_ADDRESS';

  // We get the contract to deploy
  const SimpleUUPSTokenV2 = await ethers.getContractFactory('SimpleUUPSTokenV2');
  console.log('Deploying SimpleUUPSTokenV2...');

  await upgrades.upgradeProxy(proxyAddress, SimpleUUPSTokenV2);
  const currentImplAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log('SimpleUUPSTokenV2 deployed to:', currentImplAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
