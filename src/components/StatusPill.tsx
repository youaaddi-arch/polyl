import { Badge, statusTone } from './ui/Badge';
import { statusLabels } from '@/lib/mock-data';

export function StatusPill({ status }: { status: string }) {
  return <Badge tone={statusTone(status)} dot>{statusLabels[status] ?? status}</Badge>;
}
