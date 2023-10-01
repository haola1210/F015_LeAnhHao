import { ICurrency, currency, data } from "../data"

export function getTokenList(): Promise<ICurrency[]> {
  return new Promise(res => {
    const id = setTimeout(() => {
      res([...currency])
      clearTimeout(id)
    }, 1000)
  })
}

type Token = (typeof data)[number]

export function exchange(fromToken: ICurrency, toToken: ICurrency, amount: number): Promise<number> {
  return new Promise((res, rej) => {
    // fromToken
    const from = data.find(tk => tk.currency === fromToken);
    // toToken
    const to = data.find(tk => tk.currency === toToken);
    

    if (from === undefined || to === undefined) {
      rej('can not process')
    }

    const rate = (from as Token).price / (to as Token).price;
    

    res(Number((amount * rate).toFixed(5)));
  })
}