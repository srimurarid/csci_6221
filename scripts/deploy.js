const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners()
  const NAME = "TicketManager"
  const SYMBOL = "TM"

  // Deploy contract
  const TicketManager = await ethers.getContractFactory("TicketManager")
  const tokenMaster = await TicketManager.deploy(NAME, SYMBOL)
  await tokenMaster.deployed()

  console.log(`Deployed TicketManager Contract at: ${tokenMaster.address}\n`)

const results1 = await fetch("https://app.ticketmaster.com/discovery/v2/events.json?apikey=EPMPSsccSSLSZD4mgQb4hunHA7rKyVmW");
const data = await results1.json(); // Parse the JSON response
const results = data["_embedded"]["events"]; // Access the _embedded property
// console.log("Results: ", results); // Log the results

if (!data._embedded || !data._embedded.events) {
  console.log("No events found in the response.");
  return;
}

const occasions = results.map(event => {
  const getRandomTickets = Math.floor(Math.random() * 301);
  const getRandomPrices = () => Math.round(Math.random() * 5 * 100) / 100;;

  return {
      name: event.name || "N/A",
      cost: tokens(getRandomPrices()), // Placeholder, actual cost needs to be calculated or provided separately
      tickets: getRandomTickets % 5 == 0 ? 0 : getRandomTickets, // Placeholder, actual ticket count needs additional API or logic
      date: event.dates?.start?.localDate || "N/A",
      time: event.dates?.start?.localTime || "N/A",
      location: event._embedded?.venues?.[0]?.name || "N/A"
  };
});

// console.log("Events are : " , occasions);


  for (var i = 0; i < occasions.length; i++) {
    const transaction = await tokenMaster.connect(deployer).list(
      occasions[i].name,
      occasions[i].cost,
      occasions[i].tickets,
      occasions[i].date,
      occasions[i].time,
      occasions[i].location,
    )

    await transaction.wait()

    console.log(`Listed Event ${i + 1}: ${occasions[i].name}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});