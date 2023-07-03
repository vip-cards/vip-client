import { MainButton } from "components/Buttons";
import toastPopup from "helpers/toastPopup";
import { t } from "i18next";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import clientServices from "services/clientServices";
import { authActions } from "store/auth-slice";
import "leaflet/dist/leaflet.css";

const AccountLocation = () => {
  const userLocation = useSelector((state) => state.auth.userData.location);
  const dispatch = useDispatch();

  function handleUpdateLoaction() {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        clientServices
          .updateInfo({
            location: {
              long: position.coords.longitude,
              lat: position.coords.latitude,
            },
          })
          .then((data) => {
            dispatch(authActions.update({ userData: data.record }));
            toastPopup.success("Location Updated Successfully");
            window.location.reload();
          })
          .catch((e) => toastPopup.error("Something went wrong"));
      },
      function (error) {
        toastPopup.error(error.message);
      }
    );
  }

  return (
    <section>
      <header className="orders-header">
        <h1 className="text-primary text-center capitalize">{t("location")}</h1>
      </header>
      <main>
        <div className="shadow-lg w-full p-4 rounded-xl aspect-square max-w-xl mx-auto">
          <MapContainer
            className="w-full h-full z-0"
            center={[userLocation?.lat ?? 0, userLocation?.long ?? 0]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[userLocation?.lat ?? 0, userLocation?.long ?? 0]}
            ></Marker>
          </MapContainer>
        </div>
        <div className="flex">
          <MainButton
            className="mt-3 text-center mx-auto"
            onClick={handleUpdateLoaction}
            text="Set to current location"
          />
        </div>
      </main>
    </section>
  );
};

export default AccountLocation;
