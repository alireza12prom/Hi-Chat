import { isV6Format } from 'ip';
import { Address6 } from 'ip-address';

export function ipv6ToIpv4(ip: string) {
  if (isV6Format(ip)) {
    if (['::ffff:127.0.0.1', '::1'].includes(ip)) return '127.0.0.1';
    return new Address6(ip).inspectTeredo().client4;
  }
  return ip;
}
