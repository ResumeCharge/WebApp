import React, { Suspense, useState } from "react";
import { useAppDispatch } from "../../../../../store/hooks";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import "./workExperience.scss";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";
import {
  addWorkExperience,
  getWorkExperience,
  removeWorkExperience,
} from "../../../../../store/reducers/workExperienceSlice";
import { NextAndBackButtons } from "../../UI/forms.ui";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { Spin } from "antd";

interface IInitialValues {
  roleName: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface props {
  onComplete?(): void;

  back?(): void;
}

function WorkExperience(props: props) {
  const initialValues: IInitialValues = {
    roleName: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  };

  const [details, setDetails] = useState("");
  const dispatch = useAppDispatch();
  const ref = React.useRef<MDXEditorMethods>(null);
  const markdownProcessor = new MarkdownIt({ html: true });
  const workExperienceValues = useSelector(getWorkExperience);

  const validationSchema = Yup.object({
    roleName: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    company: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    location: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    startDate: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    endDate: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    description: Yup.string().max(50, "Must be 50 characters or less"),
  });

  const submitForm = (values: FormikValues) => {
    const payload = {
      roleName: values.roleName,
      company: values.company,
      location: values.location,
      details,
      startDate: values.startDate,
      endDate: values.endDate,
    };
    dispatch(addWorkExperience(payload));
    setDetails("");
    ref.current?.setMarkdown("");
  };

  const deleteWorkExperience = (workExperienceId: string) => {
    dispatch(removeWorkExperience(workExperienceId));
  };

  const handleOnDetailsChange = (text: string) => {
    setDetails(text);
    ref.current?.setMarkdown(text);
  };

  const handleOnComplete = () => {
    if (props.onComplete) {
      props.onComplete();
    }
  };

  const getWorkExperienceItems = () => {
    if (workExperienceValues.length !== 0) {
      return (
        <ul className={"wrk_list"}>
          {workExperienceValues.map((workExperience) => {
            const details = markdownProcessor.render(workExperience.details);
            return (
              <li className={"wrk_list_item"} key={workExperience.id}>
                <div className={"wrk_list_item_content"}>
                  <h2>{workExperience.roleName}</h2>
                  <p>{workExperience.company}</p>
                  <p>{workExperience.location}</p>
                  <div dangerouslySetInnerHTML={{ __html: details }}></div>
                </div>
                <div className={"wrk_list_item_button_container"}>
                  <button
                    type={"button"}
                    onClick={() => deleteWorkExperience(workExperience.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      );
    }
    return null;
  };

  return (
    <div className={"wrk_container"}>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          await submitForm(values);
          resetForm();
        }}
        validationSchema={validationSchema}
      >
        <Form className={"wrk_form"}>
          <div className={"wrk_form_title"}>
            <h1>Work Experience</h1>
          </div>
          {getWorkExperienceItems()}
          <h1 className={"wrk_add_new_experience_title"}>
            Add New Work Experience
          </h1>
          <div className={"wrk_field_container wrk_university_degree"}>
            <div className={"wrk_rolename"}>
              <label htmlFor="roleName">Role</label>
              <Field
                name="roleName"
                type="text"
                placeholder={"Senior Software Engineer"}
              />
              <ErrorMessage name="roleName" />
            </div>
            <div className={"wrk_company"}>
              <label htmlFor="company">Company</label>
              <Field name="company" type="text" placeholder={"ACME Inc."} />
              <ErrorMessage name="company" />
            </div>
          </div>
          <div className={"wrk_field_container wrk_date_location_container"}>
            <div className={"wrk_location"}>
              <label htmlFor="location">Location</label>
              <Field
                name="location"
                type="text"
                placeholder={"(Ottawa, Vancouver, Toronto, Virtual...)"}
              />
              <ErrorMessage name="location" />
            </div>
            <div className={"wrk_field_container wrk_start_end_date"}>
              <div className={"wrk_start_date"}>
                <label htmlFor="startTime">Start Date</label>
                <Field
                  name="startDate"
                  type="text"
                  placeholder={"September 2017"}
                />
                <ErrorMessage name="startDate" />
              </div>
              <div className={"wrk_end_date"}>
                <label htmlFor="degree">End Date</label>
                <Field
                  name="endDate"
                  type="text"
                  placeholder={"December 2021"}
                />
                <ErrorMessage name="endDate" />
              </div>
            </div>
          </div>
          <h2 className={"work_details"}>Additional Details</h2>
          <Suspense fallback={<Spin spinning={true} />}>
            <MDXEditor
              className={"wrk_md_editor"}
              contentEditableClassName={"wrk_md_editor_content"}
              onChange={handleOnDetailsChange}
              markdown={""}
              ref={ref}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo />
                      <BoldItalicUnderlineToggles />
                      <ListsToggle />
                      <BlockTypeSelect />
                    </>
                  ),
                }),
              ]}
            />
          </Suspense>
          <button type={"submit"} className={"wrk_add_new"}>
            Add work experience
          </button>
          <NextAndBackButtons
            back={props.back}
            onSubmitDisabled={true}
            onContinueClick={handleOnComplete}
          />
        </Form>
      </Formik>
    </div>
  );
}

export default WorkExperience;
