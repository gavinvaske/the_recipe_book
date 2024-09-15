import axios, { AxiosResponse } from 'axios';
import { MongooseId } from '../_types/typeAliases';
import { ICreditTerm } from '../../api/models/creditTerm.ts';

export const getCreditTerms = async (): Promise<ICreditTerm[]> => {
  const response : AxiosResponse = await axios.get('/credit-terms');
  const creditTerms: ICreditTerm[] = response.data;

  return creditTerms
}

export const getOneCreditTerm = async (mongooseId: MongooseId): Promise<ICreditTerm> => {
  const response : AxiosResponse = await axios.get(`/credit-terms/${mongooseId}`);
  const creditTerm: ICreditTerm = response.data;

  return creditTerm;
}