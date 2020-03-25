import axios from 'axios';
import { config } from '../config';
import { getJwtToken } from './auth-utils';

interface CreateCampaignRequest {
  name: string;
  questionText: string;
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  return { Authorization: await getJwtToken() };
}

export async function createCampaign(
  createRequest: CreateCampaignRequest,
): Promise<void> {
  try {
    const response = await axios.post(
      `${config.baseUrl}/campaigns/create`,
      createRequest,
      { headers: await getAuthHeaders() },
    );
    console.log('new campaign', response);
  } catch (error) {
    console.error(error);
  }
}

export async function getCampaigns(): Promise<any> {
  const response = await axios.get(
    `${config.baseUrl}/campaigns`,
    { headers: await getAuthHeaders() },
  );
  return response.data;
}
