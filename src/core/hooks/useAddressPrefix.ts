import {useSelector} from 'react-redux';
import {selectChainInfo} from '../../modules/network/store/selectors';

const DefaultPrefix = 'S';
export const useAddressPrefix = () => {
  const chainInfo = useSelector(selectChainInfo);
  return {addressPrefix: chainInfo ? chainInfo.addressPrefix : DefaultPrefix};
};
