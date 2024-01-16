const hre = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const metadataURL = "ipfs://QmTCuKodCzuRDHyJqKeXx41XM2vXmaXNCEbwfq1untP7By";

 const amArtContract = await hre.ethers.deployContract("myNFTs", [
   metadataURL
 ]);

  await amArtContract.waitForDeployment();
  
 console.log("your contract deployed sucessfully!");
  console.log("Contract Address:", amArtContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });