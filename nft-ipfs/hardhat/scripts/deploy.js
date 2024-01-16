const hre = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  // URL from where we can extract the metadata for a nft
  const metadataURL = "ipfs://QmTCuKodCzuRDHyJqKeXx41XM2vXmaXNCEbwfq1untP7By";

  // here we deploy the contract
 const amArtContract = await hre.ethers.deployContract("myNFTs", [
   metadataURL
 ]);

  await amArtContract.waitForDeployment();
  
 // print the address of the deployed contract
 console.log("your contract deployed sucessfully!");
  console.log("Contract Address:", amArtContract.target);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });