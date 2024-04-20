import React, { ChangeEvent, useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import * as Yup from "yup";
import "./personalInformation.scss";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
  getLanguages,
  getPersonalInformation,
  removeLanguage,
  setPersonalInformation,
} from "../../../../../store/reducers/personalDetailsSlice";
import userOutline from "../../../../../assets/images/common/user-outline.png";
import AddLanguage from "./addLanguage";
import { IPersonalDetails } from "../../../../../store/reducers/interfaces";
import { NextAndBackButtons } from "../../UI/forms.ui";
import { Button } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";

interface IProps {
  onComplete?(): void;
  back?(): void;
}

const PersonalInformation = (props: IProps) => {
  const nameRegExp: RegExp = new RegExp("[\\p{L}-]+", "ug");
  const avatarFilePath: RegExp = new RegExp("[.]*.(jpg|jpeg)", "gm");

  const initialValues = useAppSelector(getPersonalInformation);
  const languagesList = useAppSelector(getLanguages);
  const dispatch = useAppDispatch();

  const removeLanguageFromList = (id: string) => {
    dispatch(removeLanguage(id));
  };

  const submitForm = (values: FormikValues) => {
    console.log("submit form!");
    const payload: IPersonalDetails = {
      firstName: values.firstName,
      lastName: values.lastName,
      avatar: values.avatar,
      email: values.email,
      phone: values.phone,
      website: values.website,
      linkedin: values.linkedin,
      github: values.github,
      languages: languagesList,
    };
    dispatch(setPersonalInformation(payload));
    if (props.onComplete) {
      props.onComplete();
    }
  };

  const getLanguagesList = () => {
    if (languagesList && languagesList.length !== 0) {
      return (
        <ul className={"languages_list"}>
          {languagesList.map((language) => {
            return (
              <li className={"languages_list_item"} key={language.id}>
                <p>
                  {language.name} ({language.proficiency})
                </p>
                <Button
                  onClick={() => removeLanguageFromList(language.id)}
                  htmlType={"button"}
                >
                  <DeleteTwoTone twoToneColor="#D50000" />
                </Button>
              </li>
            );
          })}
        </ul>
      );
    }
    return null;
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .matches(nameRegExp, { message: "Must contain letters only" })
      .required("Required"),
    lastName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .matches(nameRegExp, { message: "Must contain letters only" })
      .required("Required"),
    avatar: Yup.string().matches(avatarFilePath, {
      message: "File must be JPG or JPEG",
    }),
    email: Yup.string().required("Required"),
    phone: Yup.number(),
    website: Yup.string(),
    linkedin: Yup.string(),
    github: Yup.string(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitForm}
    >
      <Form className={"pi_form"}>
        <h1 className={"pi_title"}>Personal Information</h1>
        <div className={"pi_field_container pi_first_last"}>
          <div className={"pi_fname"}>
            <label htmlFor="firstName">First Name</label>
            <Field
              name="firstName"
              type="text"
              placeholder={"Your first name"}
            />
            <ErrorMessage name="firstName" />
          </div>
          <div className={"pi_lname"}>
            <label htmlFor="lastName">Last Name</label>
            <Field name="lastName" type="text" placeholder={"Your last name"} />
            <ErrorMessage name="lastName" />
          </div>
        </div>
        <div className={"pi_field_container pi_email_phone"}>
          <div className={"pi_email"}>
            <label htmlFor="email">Email</label>
            <Field
              name="email"
              type="email"
              placeholder={"example@domain.com"}
            />
            <ErrorMessage name="email">
              {(msg) => <div className={"pi_error_message"}>{msg}</div>}
            </ErrorMessage>
          </div>
          <div className={"pi_phone"}>
            <label htmlFor="phone">Phone Number</label>
            <Field name="phone" type="tel" placeholder={"(555) 555-5555"} />
            <ErrorMessage name="phone">
              {(msg) => <div className={"pi_error_message"}>{msg}</div>}
            </ErrorMessage>
          </div>
        </div>
        <div className={"pi_field_container pi_languages_list"}>
          <h2>Languages</h2>
          {getLanguagesList()}
        </div>
        <AddLanguage />
        <h2 className={"pi_github_linkedin_title"}>LinkedIn & GitHub</h2>
        <div className={"pi_field_container pi_github_linked"}>
          <div className={"pi_linkedin"}>
            <label htmlFor="linkedin">LinkedIn</label>
            <Field name="linkedin" type="text" placeholder={"username"} />
            <ErrorMessage name="linkedin" />
          </div>
          <div className={"pi_github"}>
            <label htmlFor="github">Github</label>
            <Field name="github" type="text" placeholder={"username"} />
            <ErrorMessage name="github" />
          </div>
        </div>
        <NextAndBackButtons back={props.back} />
      </Form>
    </Formik>
  );
};

export default PersonalInformation;
