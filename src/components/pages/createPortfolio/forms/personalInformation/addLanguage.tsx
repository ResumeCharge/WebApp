import React, { useState } from "react";
import "./addLanguage.scss";
import { useAppDispatch } from "../../../../../store/hooks";
import { addLanguage } from "../../../../../store/reducers/personalDetailsSlice";

interface IAddLanguageValidationError {
  name: { hasError: boolean; msg: string };
  proficiency: { hasError: boolean; msg: string };
}

const AddLanguage = () => {
  const [language, setLanguage] = useState({
    name: "",
    proficiency: "",
  });
  const [errors, setErrors] = useState<IAddLanguageValidationError>({
    name: { hasError: false, msg: "" },
    proficiency: { hasError: false, msg: "" },
  });

  const dispatch = useAppDispatch();

  const handleOnLanguageChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.name === "name") {
      setLanguage({
        name: event.currentTarget.value,
        proficiency: language.proficiency,
      });
    } else {
      setLanguage({
        name: language.name,
        proficiency: event.currentTarget.value,
      });
    }
  };

  const addNewLanguage = () => {
    let hasError = false;
    const errors = {
      name: { hasError: false, msg: "" },
      proficiency: { hasError: false, msg: "" },
    };
    if (language.name.length === 0) {
      errors.name.hasError = true;
      errors.name.msg = "Required";
      hasError = true;
    }
    if (language.proficiency.length === 0) {
      errors.proficiency.hasError = true;
      errors.proficiency.msg = "Required";
      hasError = true;
    }
    if (language.name.length >= 50) {
      errors.name.hasError = true;
      errors.name.msg = "Language name must be less than 50 characters";
      hasError = true;
    }
    if (language.proficiency.length >= 50) {
      errors.proficiency.hasError = true;
      errors.proficiency.msg =
        "Language proficiency must be less than 50 characters";
      hasError = true;
    }
    setErrors(errors);
    if (hasError) {
      return;
    }
    const payload = {
      name: language.name,
      proficiency: language.proficiency,
    };
    dispatch(addLanguage(payload));
    setLanguage({ name: "", proficiency: "" });
  };

  return (
    <div className={"add_lng_form"}>
      <div
        className={"pi_field_container add_lng_field_container add_lng_inputs"}
      >
        <div className={"add_lng_name"}>
          <label htmlFor="name">Language Name</label>
          <input
            value={language.name}
            onChange={(event) => handleOnLanguageChange(event)}
            name="name"
            type="text"
            placeholder={"(French, English, German...)"}
          />
          {errors.name ? (
            <p className={"add_lng_error_message"}>{errors.name.msg}</p>
          ) : null}
        </div>
        <div className={"add_lng_proficiency"}>
          <label htmlFor="proficiency">Proficiency</label>
          <input
            value={language.proficiency}
            onChange={(event) => handleOnLanguageChange(event)}
            name="proficiency"
            type="text"
            placeholder={"(Beginner, Fluent, Written, Oral...)"}
          />
          {errors.proficiency ? (
            <p className={"add_lng_error_message"}>{errors.proficiency.msg}</p>
          ) : null}
        </div>
      </div>
      <button
        type={"button"}
        onClick={addNewLanguage}
        className={"add_lng_submit"}
      >
        Add Language
      </button>
    </div>
  );
};

export default AddLanguage;
