import React, { useState } from "react";
import Header from "../../navigation/header/header";
import Footer from "../../navigation/footer/footer";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import "./contactUs.scss";
import * as Yup from "yup";
import { Spin } from "antd";

interface IInitialValues {
  name: string;
  email: string;
  message: string;
  botcheck: boolean;
}

const initialValues: IInitialValues = {
  name: "",
  email: "",
  message: "",
  botcheck: false,
};

const CONTACT_US_ENDPOINT =
  "https://formsubmit.co/ajax/support@resumecharge.com";

function ContactUs() {
  const [isLoading, setIsLoading] = useState(false);
  const validationSchema = Yup.object({
    name: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    email: Yup.string().email("email not in valid format").required("Required"),
    message: Yup.string().required("Required"),
  });

  const submitForm = async (
    values: FormikValues,
    restFormFunction: () => void
  ) => {
    setIsLoading(true);
    const body = {
      name: values.name,
      email: values.email,
      message: values.message,
    };
    const response = await fetch(CONTACT_US_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    try {
      const responseJson = await response.json();
      const success = responseJson.success;
      if (success === "true") {
        alert("Successfully submitted");
        restFormFunction();
      } else {
        alert("Something went wrong, please try again!");
      }
    } catch (err) {
      alert("Something went wrong, please try again!");
    }
    setIsLoading(false);
  };

  return (
    <div className={"contact_us_container"}>
      <Header />
      <div className={"contact_us_main_content"}>
        <h1 className={"contact_us_title"}>Contact Us</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { validateForm, resetForm }) => {
            await validateForm(values);
            await submitForm(values, () => resetForm());
          }}
          validateOnChange={false}
          validateOnBlur={false}
        >
          <Form className={"contact_us_form"}>
            <div className={"contact_us_name contact_us_field"}>
              <label htmlFor="name">Name</label>
              <Field name="name" type="text" placeholder={"John Doe"} />
              <ErrorMessage name="name" />
            </div>
            <div className={"contact_us_email contact_us_field"}>
              <label htmlFor="email">Email</label>
              <Field
                name="email"
                type="text"
                placeholder={"example@email.com"}
              />
              <ErrorMessage name="email" />
            </div>
            <div className={"contact_us_message contact_us_field"}>
              <label htmlFor="message">Message</label>
              <Field
                name="message"
                type="text"
                as="textarea"
                placeholder={""}
              />
              <ErrorMessage name="message" />
            </div>
            {isLoading ? (
              <Spin spinning={true} className={"contact_us_spinner"} />
            ) : (
              <button type={"submit"} className={"contact_us_submit"}>
                Submit
              </button>
            )}
            <div className={"hidden"} style={{ display: "none" }}>
              <Field name="botcheck" type="checkbox" />
            </div>
          </Form>
        </Formik>
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
