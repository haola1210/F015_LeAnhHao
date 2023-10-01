
import { AiOutlineCaretDown, AiOutlineReload, AiOutlineCheck } from 'react-icons/ai'
import './currency-selector.scss'
import { ICurrency } from '../../data'
import { useCallback, useEffect, useState } from 'react';
import Icon from '../icons/Icon';
import Popup from 'reactjs-popup';
import { getTokenList } from '../../services/tokens';

interface CurrencySelectorProps {
  currency: ICurrency;
  onChange: (c: ICurrency) => void;
  avoid: ICurrency;
}

interface TokensFetching {
  loading: boolean;
  tokens: ICurrency[]
}

export default function CurrencySelector({ currency, onChange, avoid }: CurrencySelectorProps) {

  const [shouldOpen, setShouldOpen] = useState(false);
  const closeModal = useCallback(() => {
    setShouldOpen(false)
  }, [])
  const openModal = useCallback(() => {
    setShouldOpen(true)
  }, [])

  const [tokensFetching, setTokensFetching] = useState<TokensFetching>({
    loading: false,
    tokens: [],
  })

  useEffect(() => {
    if(shouldOpen) {
      setTokensFetching({ loading: true, tokens: [] })
      getTokenList()
      .then(tokens => setTokensFetching({
        loading: false,
        tokens
      }))
    }
  }, [shouldOpen]);

  const isSelected = useCallback((c: ICurrency) => {
    return currency === c;
  }, [currency])

  const isAvoided = (c: ICurrency) => avoid === c;

  const onChooseToken = (c: ICurrency) => {
    if (!isSelected(c) && !isAvoided(c)) {
      onChange(c)
      closeModal()
    }
  }

  return <>
    <div className="selector" onClick={openModal}>
      <div className="selector__pre">
        <Icon currency={currency} />
      </div>
      <div className="selector__title">
        { currency }
      </div>
      <div className="selector__icon">
        <AiOutlineCaretDown />
      </div>
    </div>

    <Popup open={shouldOpen} modal closeOnDocumentClick onClose={closeModal}>
      <div className="coin-list">
        <div className="coin-list__title">
        Select a token
        </div>
        <div className="coin-list__container">
          { tokensFetching.loading && 
            <div className='coin-list__container-loading'>
              <AiOutlineReload className='loading-icon' />
            </div>
          }
          {
            tokensFetching.tokens.map(token => (
              <div key={token} className={`coin-item ${
                  isSelected(token) || isAvoided(token) ? 
                  'disable' : 
                  ''
                }`} onClick={() => onChooseToken(token)}>
                <div className="coin-item__icon">
                  <Icon currency={token} />
                </div>
                <div className="coin-item__name">
                  { token }
                </div>
                {
                  isSelected(token) && <div className="coin-item__mark">
                    <AiOutlineCheck />
                  </div>
                }
              </div>
            ))
          }
        </div>
      </div>
    </Popup>
  </>
}