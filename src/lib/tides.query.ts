import { queryOptions } from '@tanstack/react-query';
import { getPublicTides } from './tides.functions';

export const publicTidesOptions = queryOptions({
  queryKey: ['public-tides'],
  queryFn: () => getPublicTides(),
  staleTime: 5 * 60 * 1000,
  refetchInterval: 5 * 60 * 1000,
});