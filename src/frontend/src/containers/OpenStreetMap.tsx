import { useState } from "react";
import { DivIcon, LatLngExpression } from "leaflet";
import {
  Marker,
  MapContainer,
  TileLayer,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import { AddressData } from "./CompleteProfile";

const markerIcon = new DivIcon({
  iconUrl: "leaflet/dist/images/marker-icon.png",
});

function LocationMarker(props: OpenStreetMapProps) {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=en-US&lat=${e.latlng.lat}&lon=${e.latlng.lng}`,
        {
          method: "GET",
        }
      )
        .then((body) => body.json())
        .then((res) =>
          props.setAddressData({
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
            country: res.address.country,
            postCode: res.address.postcode,
            town: res.address.town,
          })
        )
        .catch((err) => toast(`Error occured when fetched location: ${err}`));
      setPosition(e.latlng);
      map.flyTo(e.latlng, 13);
    },
  });

  return position === null ? null : (
    <Marker icon={markerIcon} position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

interface OpenStreetMapProps {
  setAddressData: (data: AddressData) => void;
}

export default function OpenStreetMap(props: OpenStreetMapProps) {
  return (
    <MapContainer
      center={{ lat: 48.8589384, lng: 2.2646343 }}
      zoom={10}
      style={{ height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setAddressData={props.setAddressData} />
    </MapContainer>
  );
}
