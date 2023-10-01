# Problem:
- `FormattedWalletBalance` can inherit from `WalletBalance `
```js
interface FormattedWalletBalance  extends WalletBalance {
  formatted: string;
}
```
- Type of `currency` should be an Enum, or at least we should ensure its type matches the with **`as const`** keyword
```
// when assign the value
const currency = ['BLUR', 'bNEO', 'BUSD', 'USD', 'ETH', 'GMX', 'stEVMOS', 'LUNA', 'rATOM', 'STRD', 'EVMOS', 'IBCX', 'IRIS', 'ampLUNA', 'KUJI', 'stOSMO', 'axlUSDC', 'ATOM', 'stATOM', 'OSMO', 'rSWTH', 'stLUNA', 'LSI', 'OKB', 'OKT', 'SWTH', 'USC', 'USDC', 'WBTC', 'wstETH', 'YieldUSD', 'ZIL'] as const;

export type ICurrency = typeof currency[number]
``` 

- Redundant interface `Props`
- The type of `blockchain` is `any`, and we can customize the function `getPriority` like this:
```js
// declear this outsize the Component
const BlockchainPriority = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
} as const

const getPriority = (blockchain: keyof typeof BlockchainPriority) => BlockchainPriority[blockchain] ?? -99;
```
- We're using `useMemo` for `sortedBalances`, but how often does its dependency change? If the `balances` and the `prices` change too frequently, it will not limit the re-rendering, but it also consumes a lot of RAM for caching
- We should merge the implementation of the `formattedBalances` with the filtering in the implementation of the `sortedBalances`. We use a for loop to do that instead of the filter method. (1 loop is better than 2) - that function called **`preprocessingBallances`**
- An error here:
```js
const balancePriority = getPriority(balance.blockchain);
// balance: WalletBalance 
// => balance does not have the [blockchain] property
```
- The `getPriority` function is called once in the filtering and twice in the sorting. what if we calculate the priority for each balance in my `preprocessingBallances` function and store that value as a new property? So that in the sorting, we won't need to call `getPriority` anymore.
- The following code block can be changed to
```js
if (leftPriority > rightPriority) {
  return -1;
} else if (rightPriority > leftPriority) {
  return 1;
}

// change to :

return rightPriority - leftPriority;
```
- An error here:
```js
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  //...remain
})
```
Items of the `sortedBalances` don't have `formatted` property. Replace `sortedBalances` with `formattedBalances`

# Assumming:
- We really need to refactor that component.
- Depending on the business requirements and how often the balances and the prices change, the approach to optimizing the component can be different.