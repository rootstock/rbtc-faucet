import React, { ChangeEvent, RefObject, useCallback, useEffect, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { debounce } from '../utils/debounce';
import Spinner from './control/Spinner';
import CheckIcon from './icons/CheckIcon';
import CloseIcon from './icons/CloseIcon';
import { isCodeActive } from '@/utils/valid-promo-code';

export interface FaucetProps {
  siteKeyCaptcha: string
  dispenseAddress: string;
  captchaValue: RefObject<ReCAPTCHA | null>;
  onAddressChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDispenseClick: (code: string | undefined) => void;
  isMainnetRns: boolean;
  setIsMainnetRns: (state: boolean) => void;
}

const Faucet = (props: FaucetProps) => {
  const [error, setError] = useState({
    address: false,
    captchaValue: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [validCode, setValidCode] = useState<boolean>();
  const [msgError, setMsgError] = useState<string>();
  const [isRNS, setIsRNS] = useState<boolean>(false);
  const handleForm = () => {
    // validate form
    setError({ address: false, captchaValue: false });
    const addressError = !props.dispenseAddress;
    const captchaError = !props.captchaValue.current!.getValue();
    if (addressError || captchaError || (inputCode && !validCode)) {
      setTimeout(() => { 
        setError({ address: addressError, captchaValue: captchaError });
      }, 100);
      return;
    }
    props.onDispenseClick(inputCode);
    setError({ address: false, captchaValue: false });
  }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedGetCode = useCallback(debounce(async (code: string) => {
    const data = await isCodeActive(code);

    setLoading(false);
    setValidCode(data.validCode);
    setMsgError(data.msg);
  }, 1000), []);
  
  const handleInputCode = async (e: React.FormEvent<HTMLInputElement>) => {
    const code = e.currentTarget.value;
    setMsgError('');
    setInputCode(code);
    setLoading(true);
    debouncedGetCode(code);
  }

  useEffect(() => {
    if(props.dispenseAddress.includes('.rsk')) {
      setIsRNS(true);
    } else {
      setIsRNS(false);
    }
  }, [props.dispenseAddress]);

  return (
    <div className='content-form'>
      <div className='faucet-form'>
        <div>
          <input
            className={`faucet-control rounded-rsk ${error.address ? 'error' : '' }`}
            type="text"
            placeholder="Find address or RNS domain to receive tokens ... "
            value={props.dispenseAddress}
            onChange={props.onAddressChange}
          />
          <div className='content-code'>
            <div className='content-input'>
              <input
                className={`faucet-control rounded-rsk ${!validCode && inputCode && !loading ? 'error' : '' }`}
                type="text"
                placeholder="Promo code"
                value={inputCode}
                onChange={handleInputCode}
              />
              <div className='content-icon'>
                {
                  loading && (
                    <Spinner
                      radius='17px'
                    />
                  )
                }
                {
                  (validCode && !loading) && (
                    <CheckIcon />
                  )
                }
                {
                  (inputCode && !loading && !validCode) && (
                    <CloseIcon />
                  )
                }
              </div>
            </div>
            {
              (!validCode && inputCode && !loading) && (
                <div className='error-code'>{ msgError }</div>
              )
            }
          </div>
        </div>
        {isRNS && 
          <div 
            className="toggle-container mt-4 flex items-center justify-between p-2 bg-gray-800 rounded-lg"
            onClick={() => props.setIsMainnetRns(!props.isMainnetRns)}
          >
          <label htmlFor="toggle-feature" className="text-sm font-medium text-white">
            {'RNS From Mainnet'}
          </label>
          <div className="relative">
            <input
              id="toggle-feature"
              type="checkbox"
              checked={props.isMainnetRns}
              className="sr-only peer"
              onChange={() => props.setIsMainnetRns(!props.isMainnetRns)}
            />
            <div className="w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 transition duration-300"></div>
            <div className="peer-checked:translate-x-5 absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-300"></div>
          </div>
          </div>}
        <div className='captcha-content'>
          { props.siteKeyCaptcha ?
            <ReCAPTCHA
              ref={props.captchaValue}
              sitekey={props.siteKeyCaptcha}
              theme='dark'
              className={`re-captcha ${error.captchaValue ? 'error' : '' }`}
            />
            :
            <Spinner />
          }
        </div>
        <div className='content-btn'>
          <button onClick={handleForm} className="btn btn-primary btn-middle">
            Get test RBTC
          </button>
        </div>
      </div>
    </div>
  );
};

export default Faucet;
