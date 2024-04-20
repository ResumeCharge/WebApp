import React, { Suspense } from "react";
import { ErrorMessage, Form, Formik, FormikErrors, FormikValues } from "formik";
import "./careerSummary.scss";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
  getCareerSummary,
  setCareerSummary,
} from "../../../../../store/reducers/careerSummarySlice";
import * as Yup from "yup";
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

interface props {
  back?(): void;

  onComplete?(): void;
}

function CareerSummary(props: props) {
  const initialValues = useAppSelector(getCareerSummary);
  const ref = React.useRef<MDXEditorMethods>(null);
  const dispatch = useAppDispatch();
  const validationSchema = Yup.object({
    summary: Yup.string()
      .max(1000, "Must be 1000 characters or less")
      .required("Required"),
  });

  const submitForm = (values: FormikValues) => {
    if (!ref.current) {
      return;
    }
    const payload = {
      summary: ref.current.getMarkdown(),
    };
    dispatch(setCareerSummary(payload));
    if (props.onComplete) {
      props.onComplete();
    }
  };

  const handleOnDetailsChange = async (
    text: string,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<FormikValues>>
  ) => {
    ref.current?.setMarkdown(text);
    await setFieldValue("summary", text, true);
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
          <Form className={"cs_form"}>
            <div className={"cs_container"}>
              <div className={"cs_summary"}>
                <div className={"cs_title"}>
                  <h1>Career Summary</h1>
                  <p>
                    Your career summary should be a few sentences introducing
                    yourself and your skills
                  </p>
                </div>
                <div className={"cs_input"}>
                  <Suspense fallback={<Spin spinning={true} />}>
                    <MDXEditor
                      className={"cs_md_editor"}
                      contentEditableClassName={"cs_md_editor_content"}
                      onChange={(e) => {
                        handleOnDetailsChange(e, setFieldValue);
                      }}
                      markdown={`${initialValues.summary}`}
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
                  <p>
                    <ErrorMessage name="summary" />
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

export default CareerSummary;
