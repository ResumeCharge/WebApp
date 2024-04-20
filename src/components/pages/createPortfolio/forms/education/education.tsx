import React, { Suspense, useState } from "react";
import { useAppDispatch } from "../../../../../store/hooks";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import "./education.scss";
import "@mdxeditor/editor/style.css";
import {
  addEducation,
  getEducation,
  removeEducation,
} from "../../../../../store/reducers/educationSlice";
import "react-markdown-editor-lite/lib/index.css";
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
import MarkdownIt from "markdown-it";
import { Spin } from "antd";

interface IInitialValues {
  degree: String;
  university: String;
  details: String;
  startDate: String;
  endDate: String;
}

interface props {
  onComplete?(): void;
  back?(): void;
}

function Education(props: props) {
  const initialValues: IInitialValues = {
    degree: "",
    university: "",
    details: "",
    startDate: "",
    endDate: "",
  };

  const [details, setDetails] = useState("");
  const ref = React.useRef<MDXEditorMethods>(null);
  const dispatch = useAppDispatch();
  const markdownProcessor = new MarkdownIt({ html: true });
  const educationValues = useSelector(getEducation);

  const validationSchema = Yup.object({
    degree: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    university: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    startDate: Yup.string().max(50, "Must be 50 characters or less"),
    endDate: Yup.string().max(50, "Must be 50 characters or less"),
    details: Yup.string().max(50, "Must be 50 characters or less"),
  });

  const submitForm = (values: FormikValues) => {
    const payload = {
      degree: values.degree,
      university: values.university,
      details,
      startDate: values.startDate,
      endDate: values.endDate,
    };
    dispatch(addEducation(payload));
    setDetails("");
    ref.current?.setMarkdown("");
  };

  const deleteEducation = (educationId: string) => {
    dispatch(removeEducation(educationId));
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

  const getEducationItems = () => {
    if (educationValues.length !== 0) {
      return (
        <ul className={"edu_list"}>
          {educationValues.map((education) => {
            const educationDetails = markdownProcessor.render(
              education.details
            );
            return (
              <li className={"edu_list_item"} key={education.id}>
                <div className={"edu_list_item_content"}>
                  <h2>{education.university}</h2>
                  <p>{education.degree}</p>
                  <p>
                    {education.startDate} - {education.endDate}
                  </p>
                  <div
                    dangerouslySetInnerHTML={{ __html: educationDetails }}
                  ></div>
                </div>
                <div className={"edu_list_item_button_container"}>
                  <button
                    type={"button"}
                    onClick={() => {
                      deleteEducation(education.id);
                    }}
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
    <div className={"edu_container"}>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          await submitForm(values);
          resetForm();
        }}
        validationSchema={validationSchema}
      >
        <Form className={"edu_form"}>
          <div className={"edu_form_title"}>
            <h1>Education</h1>
          </div>
          {getEducationItems()}
          <h1 className={"edu_add_new_education_title"}>Add New Education</h1>
          <div className={"edu_field_container edu_university_degree"}>
            <div className={"edu_university"}>
              <label htmlFor="university">University</label>
              <Field
                name="university"
                type="text"
                placeholder={"University of Ottawa"}
              />
              <ErrorMessage name="university" />
            </div>
            <div className={"edu_degree"}>
              <label htmlFor="degree">Degree</label>
              <Field
                name="degree"
                type="text"
                placeholder={"B.ASc Software Engineering"}
              />
              <ErrorMessage name="degree" />
            </div>
          </div>
          <div className={"edu_field_container edu_start_end_date"}>
            <div className={"edu_start_date"}>
              <label htmlFor="startTime">Start Date</label>
              <Field
                name="startDate"
                type="text"
                placeholder={"September 2017"}
              />
              <ErrorMessage name="startDate" />
            </div>
            <div className={"edu_end_date"}>
              <label htmlFor="degree">End Date</label>
              <Field name="endDate" type="text" placeholder={"December 2021"} />
              <ErrorMessage name="endDate" />
            </div>
          </div>
          <h2 className={"additional_details"}>Additional Details</h2>
          <Suspense fallback={<Spin spinning={true} />}>
            <MDXEditor
              contentEditableClassName={"edu_md_editor_content"}
              className={"edu_md_editor"}
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

          <button type={"submit"} className={"edu_add_new_education_button"}>
            Add education
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

export default Education;
