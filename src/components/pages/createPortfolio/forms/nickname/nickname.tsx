import React from "react";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import "./nickname.scss";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import * as Yup from "yup";
import { NextAndBackButtons } from "../../UI/forms.ui";
import {
  getResumeDetails,
  setResumeNickname,
} from "../../../../../store/reducers/resumeDetailsSlice";
import { TextField } from "@mui/material";

interface props {
  back?(): void;
  onComplete?(): void;
}

function Nickname(props: props) {
  const initialValues = useAppSelector(getResumeDetails);
  const dispatch = useAppDispatch();
  const validationSchema = Yup.object({
    nickname: Yup.string()
      .required()
      .max(5000, "Must be 200 characters or less"),
  });

  const submitForm = (values: FormikValues) => {
    const payload = values.nickname;
    dispatch(setResumeNickname(payload));
    if (props.onComplete) {
      props.onComplete();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitForm}
    >
      {(formik) => {
        const { setFieldValue } = formik;
        return (
          <Form className={"am_form"}>
            <div className={"nc_container"}>
              <div className={"nc_summary"}>
                <div className={"nc_title"}>
                  <h1>Resume Name</h1>
                  <p>
                    Choose a name for your resume, the name will only be visible
                    to you.
                  </p>
                </div>
                <div className={"nc_input"}>
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    onChange={(e) => setFieldValue("nickname", e.target.value)}
                    defaultValue={initialValues.nickname ?? ""}
                  />
                  <p>
                    <ErrorMessage name="nickname" />
                  </p>
                </div>
              </div>
            </div>
            <NextAndBackButtons back={props.back} onSubmitDisabled={false} />
          </Form>
        );
      }}
    </Formik>
  );
}

export default Nickname;
