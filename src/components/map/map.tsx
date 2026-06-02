import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Offer, Location } from '../../types/offer';

type MapProps = {
  offers: Offer[];
  city: Location;
};

const defaultIcon = L.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13, 39]
});

function Map({ offers, city }: MapProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = L.map(containerRef.current, {
      center: [city.latitude, city.longitude],
      zoom: 12
    });

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '© OpenStreetMap contributors © CARTO'
      }
    ).addTo(mapRef.current);
  }, [city]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const markers = offers.map((offer) =>
      L.marker([offer.location.latitude, offer.location.longitude], {
        icon: defaultIcon
      }).addTo(map)
    );

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [offers]);

  return <div ref={containerRef} className="cities__map map" />;
}

export default Map;
