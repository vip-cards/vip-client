import { MainButton } from "components/Buttons";
import FormErrorMessage from "components/FormErrorMessage/FormErrorMessage";
import { MainInput } from "components/Inputs";
import { clearEmpty } from "helpers";
import { getInitialFormData } from "helpers/forms";
import { registerFormData, registerSchema } from "helpers/forms/register";
import useCountriesArr from "helpers/useCountriesArr";
import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { guestAxios } from "services/Axios";
import useSWR from "swr";
import toastPopup from "../../helpers/toastPopup";
import clientServices from "../../services/clientServices";

export default function RegisterForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);

  const { countries, cities, setCities } = useCountriesArr();
  const { data: professions } = useSWR("list-professions", () =>
    guestAxios.get("/profession/list")?.then(({ data }) => data.records)
  );
  const { data: interests } = useSWR("list-interests", () =>
    guestAxios.get("/interest/list")?.then(({ data }) => data.records)
  );

  const formData = [
    ...registerFormData,
    {
      name: "country",
      type: "multi-select",
      list: countries,
      required: true,
      isMulti: false,
      identifier: "name",
      closeMenuOnSelect: true,
    },
    {
      name: "city",
      type: "multi-select",
      list: cities,
      required: true,
      isMulti: false,
      identifier: "name",
      closeMenuOnSelect: true,
    },
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
  let timer: NodeJS.Timer;
  async function registerHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErrorList([]);

    const filteredObj = clearEmpty(user);
    const { value: _user, error } = registerSchema.validate(filteredObj);

    setLoading(true);
    if (error) {
      setErrorList(error.details.map((e) => e.message));

      setLoading(false);
      return 1;
    }
    const mappedData = {
      ..._user,
      country: {
        en: _user?.country?.en,
        ar: _user?.country?.ar,
        index: _user?.country?.index,
      },
      city: {
        en: _user?.city?.en,
        ar: _user?.city?.ar,
        index: _user?.city?.index,
      },
      name: {
        en: _user.name,
      },
    };

    //! could be handled with destrcuturing
    delete mappedData["re-password"];
    delete mappedData["name_en"];
    delete mappedData["name_ar"];

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
      }
      setLoading(false);
      setErrorList([e.response.data.error]);
    }
  }

  useEffect(() => {
    setUser((state) => ({ ...state, city: null }));
    setCities(user.country);
  }, [setCities, user.country]);

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
      {formData.map((formInput) => {
        return (
          <MainInput
            key={formInput.name}
            {...formInput}
            state={user}
            setState={setUser}
            pattern={formInput.name === "phone" ? "^01[0125][0-9]{8}$" : null}
          />
        );
      })}

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
        active={true}
        text={t("register")}
        loading={loading}
        variant="primary"
        type="submit"
      />
    </form>
  );
}
