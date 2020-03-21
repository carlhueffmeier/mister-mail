import { Destination } from '../../lib/types';

export interface RequestBody {
  name: string;
  questionText: string;
  destinations: Destination[];
}
