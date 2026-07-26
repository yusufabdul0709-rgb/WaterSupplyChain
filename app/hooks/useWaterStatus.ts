import { useQuery } from '@tanstack/react-query';
import { waterService } from '../services/waterService';
import { networkService } from '../services/networkService';

export function useWaterStatus(sectorId: string) {
  const scheduleQuery = useQuery({
    queryKey: ['waterSchedule', sectorId],
    queryFn: () => waterService.getScheduleForSector(sectorId),
    refetchInterval: 30000,
  });

  const nodesQuery = useQuery({
    queryKey: ['networkNodes'],
    queryFn: () => networkService.getNodes(),
    refetchInterval: 10000,
  });

  return {
    schedule: scheduleQuery.data,
    isLoadingSchedule: scheduleQuery.isLoading,
    nodes: nodesQuery.data?.data || [],
    isLoadingNodes: nodesQuery.isLoading,
  };
}
