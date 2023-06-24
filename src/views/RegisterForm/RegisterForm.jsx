import { MainButton } from "components/Buttons";
import FormErrorMessage from "components/FormErrorMessage/FormErrorMessage";
import { MainInput } from "components/Inputs";
import dayjs from "dayjs";
import { clearEmpty } from "helpers";
import { getInitialFormData } from "helpers/forms";
import { registerFormData, registerSchema } from "helpers/forms/register";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import useSWR from "swr";
import toastPopup from "../../helpers/toastPopup";
import clientServices from "../../services/clientServices";
import { guestAxios } from "services/Axios";

export default function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const { data: professions } = useSWR("list-professions", () =>
    guestAxios.get("/profession/list")?.then(({ data }) => data.records)
  );
  const { data: interests } = useSWR("list-interests", () =>
    guestAxios.get("/interest/list")?.then(({ data }) => data.records)
  );

  const formData = [
    ...registerFormData,
    {
      name: "profession",
      type: "multi-select",
      identifier: "name",
      list: professions ?? [],
    },
    {
      name: "interests",
      type: "multi-select",
      identifier: "name",
      list: interests ?? [],
    },
  ];
  
  const [user, setUser] = useState(getInitialFormData(formData));
  let timer;
  async function registerHandler(e) {
    e.preventDefault();
    setErrorList([]);
    console.log(user);
    const filteredObj = clearEmpty(user);
    const { value: _user, error } = registerSchema.validate(filteredObj);
    console.log(filteredObj);
    setLoading(true);
    if (error) {
      setErrorList(error.details.map((e) => e.message));

      setLoading(false);
      return 1;
    }
    const arabicRegex = /[\u0600-\u06FF]/; // Arabic Unicode range
    const isArabic = arabicRegex.test(_user.name);
    const mappedData = {
      ..._user,
      name: {
        [isArabic ? "ar" : "en"]: _user.name,
      },
    };
    delete mappedData["re-password"];

    try {
      const { data } = await clientServices.register(mappedData);
      if (data.success && data.code === 201) {
        setLoading(false);
        toastPopup.success(t("Success"));
        navigate("/login");
      }
    } catch (e) {
      if (e.response.data.code === 409) {
        toastPopup.error(e.response.data.error);
        timer = setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
      setLoading(false);
      setErrorList([e.response.data.error]);
    }
  }
  useEffect(() => {
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <form
      className="flex flex-col w-full justify-center items-center mx-auto gap-4"
      onSubmit={registerHandler}
    >
      {formData.map((formInput, index) => {
        return (
          <MainInput
            {...formInput}
            key={formInput.name}
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
            {t("male")}
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
            {t("female")}
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
          {t("gender")}
        </label>
      </div>

      <FormErrorMessage errorList={errorList} />

      <MainButton
        text={t("register")}
        loading={loading}
        variant="primary"
        type="button"
        onClick={registerHandler}
      />
    </form>
  );
}
