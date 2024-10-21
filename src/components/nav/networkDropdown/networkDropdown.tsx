import Link from '../../common/link/link';
import NavDropdown from '../dropdown/dropdown';

export default function NetworkDropdown({subnavOpen}: {subnavOpen: boolean}) {
  return (
    <NavDropdown id="navDropdown" subnavOpen={subnavOpen}>
      <Link href="/network/devices">Devices</Link>
      <Link href="/network/media-assets">Media Assets</Link>
      <Link href="/network/signage-sets">Signage Sets</Link>
      <Link href="/network/scheduling">Scheduling</Link>
      <Link href="/network/policies">Policies</Link>
      <Link href="/network/channels">Playlists</Link>
      <Link href="/network/rewards">Rewards</Link>
    </NavDropdown>
  );
}
