import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { ICurrency } from '../../data'
import { AiOutlineReload, AiOutlineSwap } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import './swap-form.scss'
import CurrencySelector from '../currency-selector';
import { exchange } from '../../services/tokens';
import useExchange from './useExchange';

export interface IConfig {
  currency: ICurrency;
  amount: number;
  amountInUSD: number;
}

export default function SwapForm() {

  const [pay, setPay] = useState<IConfig>({
    currency: 'ETH',
    amount: 0,
    amountInUSD: 0,
  })

  const [receive, setReceive] = useState<IConfig>({
    currency: 'USDC',
    amount: 0,
    amountInUSD: 0
  })

  const onChangeCurrency = useCallback((type: 'pay' | 'rec') => {
    return (c: ICurrency) => {
      if(type === 'pay') {
        setPay(prev => ({ ...prev, currency: c }))
      } else {
        setReceive(prev => ({ ...prev, currency: c }))
      }
    }
  }, [])

  

  const { loading: loadingPTR, error: errorPTR } = useExchange(pay.currency, receive.currency, pay.amount, setReceive, 'amount')
  const { loading: loadingPTU, error: errorPTU } = useExchange(pay.currency, 'USD', pay.amount, setPay, 'amountInUSD')
  const { loading: loadingRTU, error: errorRTU } = useExchange(receive.currency, 'USD', receive.amount, setReceive, 'amountInUSD')

  const onSwitch = () => {
    if (loadingPTR) {
      return;
    }
    const temporary = { ...receive }
    setReceive(pay)
    setPay(temporary)
  }

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {

    const pattern=/^(\d+(\.\d*)?|\.\d*|)$/;
    const v = e.target.value
    if (pattern.test(v) || v === '') {
      setPay(p => ({ ...p, amount: v as unknown as number }))
    }

  }, [])

  return <div className='form'>
    <div className="form__title">Swap with <span style={{ color: 'red', textDecoration: 'line-through' }}>us</span></div>
    <div className="form__pay">
      <div className="form__input">
        <div className="form__input-title">
          You pay
        </div>
        <div className="form__input-body">
          <input 
            type="text" 
            value={pay.amount} 
            onChange={onChange} 
          />
          <CurrencySelector 
            currency={pay.currency} 
            onChange={onChangeCurrency('pay')} 
            avoid={receive.currency} 
          />
        </div>
        <div className="form__input-helper">
          <Helper loading={loadingPTU} error={errorPTU} amount={pay.amountInUSD} />
        </div>
      </div>
      <div className="form__switch-btn">
      <div onClick={onSwitch} className={`${loadingPTR ? 'disabled' : ''}`}>
        { loadingPTR ? 
          <AiOutlineReload className='spinner' /> : 
          <AiOutlineSwap />
        }
      </div>
    </div>
    </div>
    <div className="form__receive">
    <div className="form__input">
        <div className="form__input-title">
          You receive
        </div>
        <div className="form__input-body">
          <div className='receive-value' >{ receive.amount }</div>
          <CurrencySelector 
            currency={receive.currency} 
            onChange={onChangeCurrency('rec')} 
            avoid={pay.currency} 
          />

        </div>
        <div className="form__input-helper">
        <Helper loading={loadingRTU} error={errorRTU} amount={receive.amountInUSD} />
        </div>
      </div>
    </div>
  </div>
}

interface HelperProps {
  loading: boolean;
  error: string;
  amount: number
}
function Helper({ loading, error, amount }: HelperProps) {
  return (
    <>
    {
      loading && <AiOutlineReload className='spinner' />
    }
    {
      error && <span className='error'>
        <BiError className='' />
        <p>
        { error }  
        </p>
      </span>
    }
    {
      !loading && !error && !!amount &&
      <p className='in-usd'>
        {
          `$${amount}`
        }
      </p>
    }
    </>
  )
}