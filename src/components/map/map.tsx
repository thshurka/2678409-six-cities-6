import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Offer, Location } from '../../types/offer';

type MapProps = {
  offers: Offer[];
  city: Location;
  activeOfferId?: number | null;
  className?: string;
};

const defaultIcon = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});

const activeIcon = L.icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13, 39],
});

function Map({ offers, city, activeOfferId, className = 'cities__map map' }: MapProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = L.map(containerRef.current, {
      center: [city.latitude, city.longitude],
      zoom: 12,
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { attribution: '© OpenStreetMap contributors © CARTO' }
    ).addTo(mapRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mapRef.current?.setView([city.latitude, city.longitude], 12);
  }, [city.latitude, city.longitude]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const markers = offers.map((offer) =>
      L.marker([offer.location.latitude, offer.location.longitude], {
        icon: offer.id === activeOfferId ? activeIcon : defaultIcon,
      }).addTo(map)
    );

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [offers, activeOfferId]);

  return <div ref={containerRef} className={className} />;
}

export default Map;
