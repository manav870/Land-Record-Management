const hre = require("hardhat");

async function main() {
    const address = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    console.log(`Checking code at ${address} on network ${hre.network.name}...`);
    try {
        const code = await hre.ethers.provider.getCode(address);
        if (code === "0x") {
            console.log("No code found at this address (it's an EOA or empty).");
        } else {
            console.log("Code found! Contract exists.");
        }
    } catch (e) {
        console.log("Error connecting or fetching code:", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
