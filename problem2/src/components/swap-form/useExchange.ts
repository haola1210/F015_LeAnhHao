import { useEffect, useState } from "react";
import { ICurrency } from "../../data";
import { IConfig } from "./SwapForm";
import { exchange } from "../../services/tokens";

export default function useExchange(
    fromToken: ICurrency, 
    toToken: ICurrency, 
    amount: number, 
    cb: React.Dispatch<React.SetStateAction<IConfig>>,
    key: 'amount' | 'amountInUSD'
  ) {
  const [exchangeStatus, setExchangeStatus] = useState({
    loading: false,
    error: ''
  })

  useEffect(() => {
    if (amount === 0) {
      return;
    }

    setExchangeStatus({ loading: true, error: '' })
    cb(prev => ({ ...prev, [key]: 0 })) // reset receive amount
    const id = setTimeout(() => {

      exchange(fromToken, toToken, amount)
      .then(amount => {
        setExchangeStatus({ loading: false, error: '' })
        cb(prev => ({ ...prev, [key]: amount }))
      })
      .catch(error => {
        setExchangeStatus({ loading: false, error })
        cb(prev => ({ ...prev, [key]: 0 })) // reset receive amount
      })

      clearTimeout(id)
    }, 1000)
        
  }, [fromToken, toToken, amount, key, cb])


  return exchangeStatus;
}