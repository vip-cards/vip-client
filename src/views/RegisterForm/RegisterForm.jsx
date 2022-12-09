import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import MainButton from "../../components/MainButton/MainButton";
import MainInput from "../../components/MainInput/MainInput";
import { registerSchema } from "../../helpers/schemas";
import toastPopup from "../../helpers/toastPopup";
import clientServices from "../../services/clientServices";
import { useNavigate } from "react-router";

export default function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errorList, setErrorList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name_en: "",
    email: "",
    password: "",
    "re-password": "",
    gender: "male",
  });

  let formData = [
    { name: "name_en", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "password", type: "password", required: true },
    { name: "re-password", type: "password", required: true },
    { name: "phone", type: "tel", required: false },
  ];
  let timer;
  async function registerHandler() {
    const { value, error } = registerSchema.validate(user);

    const mappedData = {
      ...user,
      name: {
        en: user.name_en,
      },
    };
    delete mappedData.name_en;
    delete mappedData["re-password"];
    console.log(mappedData);
    setLoading(true);
    if (error) {
      setErrorList(error.details);

      setErrorMessage(error.message);
      console.log(error.details);
      toast.error(error.name);
    } else {
      try {
        const { data } = await clientServices.register(mappedData);
        console.log(data);
        if (data.success && data.code === 201) {
          setLoading(false);
          toastPopup.success(t("Success"));

          navigate("/login");
        }
      } catch (e) {
        console.log(e);
        if (e.response.data.code === 409) {
          toast.error(e.response.data.error);
          timer = setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
        setLoading(false);
        setErrorMessage(e.response.data.error);
      }
    }
    setLoading(false);
  }
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {errorMessage ? <div className="err">{errorMessage}</div> : null}
      {formData.map((formInput, index) => {
        return (
          <MainInput
            key={index}
            name={formInput.name}
            type={formInput.type}
            required={formInput.required}
            state={user}
            setState={setUser}
            pattern={formInput.name === "phone" ? "^01[0125][0-9]{8}$" : null}
          />
        );
      })}
      <div className="main-input-label">
        <input
          onChange={(e) => {
            const age = dayjs().diff(dayjs(e.target.value), "year");
            setUser((state) => ({ ...state, age }));
          }}
          className="main-input"
          type="date"
          name="age"
          id="age"
          placeholder=" "
        />
        <label className="main-label" htmlFor="age">
          {t("birthDate")}
        </label>
      </div>
      <div className="main-input-label radio-input">
        <div className="radio-checkbox">
          <label htmlFor="male">
            Male
            <input
              value={"male"}
              onChange={(e) => {
                setUser((state) => ({ ...state, gender: e.target.value }));
              }}
              required={true}
              disabled={false}
              className="radio-input"
              type="radio"
              name="gender"
              id="male"
              placeholder=" "
              checked={user.gender === "male"}
            />
          </label>
        </div>
        <div className="radio-checkbox">
          <label htmlFor="female">
            Female
            <input
              value={"female"}
              onChange={(e) => {
                setUser((state) => ({ ...state, gender: e.target.value }));
              }}
              required={true}
              disabled={false}
              className="radio-input"
              type="radio"
              name="gender"
              id="female"
              placeholder=" "
              checked={user.gender === "female"}
            />
          </label>
        </div>
        <label className="main-label" htmlFor="gender">
          gender
        </label>
      </div>
      <MainButton
        text={t("login")}
        loading={loading}
        onClick={registerHandler}
      />
    </>
  );
}
