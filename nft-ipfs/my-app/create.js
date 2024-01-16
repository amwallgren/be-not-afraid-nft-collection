var fs = require("fs");

for (let i = 1; i <= 6; i++) {
  var dictstring = JSON.stringify({
    name: i.toString(),
    description: "My NFT Collection Drop",
    image:
      "ipfs://QmTCuKodCzuRDHyJqKeXx41XM2vXmaXNCEbwfq1untP7By/" +
      i.toString() +
      ".jpg",
  });

  fs.writeFile(i + ".json", dictstring, function (err, result) {
    if (err) console.log("error", err);
  });
}
