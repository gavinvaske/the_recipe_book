import axios, { AxiosResponse } from 'axios';
import { CreditTerm } from '../_types/databasemodels/creditTerm.ts';
import { MongooseId } from '../_types/typeAliases';

export const getCreditTerms = async (): Promise<CreditTerm[]> => {
  const response : AxiosResponse = await axios.get('/credit-terms');
  const creditTerms: CreditTerm[] = response.data;

  return creditTerms
}

export const getOneCreditTerm = async (mongooseId: MongooseId): Promise<CreditTerm> => {
  const response : AxiosResponse = await axios.get(`/credit-terms/${mongooseId}`);
  const creditTerm: CreditTerm = response.data;

  return creditTerm;
}