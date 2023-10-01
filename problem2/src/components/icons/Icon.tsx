import { AiOutlineReload } from "react-icons/ai"
import { ICurrency } from "../../data"
import { useEffect, useState } from "react"
import './icon.scss'

interface IconProps {
  currency: ICurrency
}

interface IFetchIcon {
  loading: boolean;
  raw: string
}

export default function Icon({ currency }: IconProps) {

  const [iconFetching, setIconFetching] = useState<IFetchIcon>({
    loading: false,
    raw: ''
  })

  useEffect(() => {
    setIconFetching(prev => ({ ...prev, loading: true }))
    fetch(`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.blob();
    })
    .then(data => {
      const id = setTimeout(() => {
        setIconFetching({
          loading: false,
          raw: URL.createObjectURL(data)
        })
        clearTimeout(id)
      }, 1000)
    })
    .catch(err => {
      setIconFetching({
        loading: false,
        raw: ''
      })
    })
  }, [currency])
  return <span className='coin-icon'>
  {
    iconFetching.loading ? <AiOutlineReload className='loading-icon' /> : <img src={iconFetching.raw} alt="" />
  }
</span>
}