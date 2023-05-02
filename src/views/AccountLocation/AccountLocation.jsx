import { t } from "i18next";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useSelector } from "react-redux";

const AccountLocation = () => {
  const userLocation = useSelector((state) => state.auth.userData.location);
  return (
    <header className="orders-header">
      <h1 className="text-primary text-center capitalize">{t("location")}</h1>
      <div className="shadow-lg w-full p-4 rounded-xl aspect-square max-w-xl mx-auto">
        <MapContainer
          className="w-full h-full z-0"
          center={[userLocation.lat, userLocation.long]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[userLocation.lat, userLocation.long]}></Marker>
        </MapContainer>
      </div>
    </header>
  );
};

export default AccountLocation;
