import axios, { AxiosResponse } from 'axios';
import { CreditTerm } from '../_types/databaseModels/creditTerm';

export const getCreditTerms = async (): Promise<CreditTerm[]> => {
  const response : AxiosResponse = await axios.get('/credit-terms');
  const creditTerms: CreditTerm[] = response.data;

  return creditTerms
}