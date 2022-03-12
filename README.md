## IPFS Project

## SETUP
1) Run ganache locally on port 8545
2) run ipfs node on localhost:5001 
2) cd nest/blockchain
3) run npm install
4) run truffle deploy
5) copy UserDetails contract contract address  to fronend .env
6) cd nest/fronend
7) make .env file and fill data from .env.example
8) run npm install
9) run npm run start
10) cd nest/middleware
11) run npm install
12) run npm run start
13) setup metamask with an address in the network and manually connect to the fronend
There should be fronend and middle ware running now. go to localhost:3000 to view the fronend

Middleware should run in port 3001