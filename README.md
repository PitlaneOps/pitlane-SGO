<div align="center">

# xgrain402-scan

</div>

<div align="center">
    
  [![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/xgrain402)](https://x.com/xgrain402) 
  [![GitHub Repo stars](https://img.shields.io/github/stars/xgrain402/xgrain402-scan?style=social)](https://github.com/xgrain402/xgrain402-scan) 
  [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

</div>

[xgrain402-scan](https://explorer.xgrain402.xyz) is an ecosystem explorer for xgrain402, a BSC (Binance Smart Chain)-based payment rail platform scaling microtransactions to machine economies.


xgrain402 revolutionizes digital commerce by enabling instant, trustless transactions on BSC's high-performance blockchain. Our mission is to bridge the gap between traditional payments and the emerging machine economy, making microtransactions seamless and efficient.

xgrain402-scan provides comprehensive insights into our growing BSC ecosystem, offering real-time transaction monitoring, facilitator analytics, and seamless wallet integration for direct resource interaction.

## Development

_We're continuously improving the development experience. For any setup issues, feel free to reach out._

Configure your environment by copying `.env.example` to `.env` and filling in the required variables from [env.ts](https://github.com/xgrain402/xgrain402-scan/blob/main/src/env.ts).

Install dependencies and start the development server:

```bash
pnpm install && pnpm dev
```

## Contributing

Join us in building the future of decentralized payments! xgrain402-scan is designed to provide transparency and insights into our BSC-powered ecosystem, fostering trust and establishing best practices for the rapidly evolving machine economy.

### Add Resources

Discover a new resource? Submit BSC smart contract addresses through our resources page. Valid xgrain402-compatible schemas are automatically indexed and made available to the community.

### Add Facilitators

Expand our network by adding BSC-based facilitators to [`src/lib/facilitators`](https://github.com/xgrain402/xgrain402-scan/blob/main/src/lib/facilitators.ts). New facilitators are instantly reflected across the entire dashboard.
