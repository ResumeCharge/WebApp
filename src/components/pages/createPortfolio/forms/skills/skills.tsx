import React, { Suspense } from "react";
import { ErrorMessage, Form, Formik, FormikErrors, FormikValues } from "formik";
import "./skills.scss";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
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
import {
  getSkills,
  setSkills,
} from "../../../../../store/reducers/skillsSlice";

interface props {
  back?(): void;

  onComplete?(): void;
}

function Skills(props: props) {
  const initialValues = useAppSelector(getSkills);
  const ref = React.useRef<MDXEditorMethods>(null);
  const dispatch = useAppDispatch();
  const validationSchema = Yup.object({
    skills: Yup.string().max(5000, "Must be 5000 characters or less"),
  });

  const submitForm = (values: FormikValues) => {
    if (!ref.current) {
      return;
    }
    const skills = ref.current.getMarkdown() ?? "";
    const payload = {
      skills,
    };
    dispatch(setSkills(payload));
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
    await setFieldValue("skills", text, true);
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
          <Form className={"sk_form"}>
            <div className={"sk_container"}>
              <div className={"sk_summary"}>
                <div className={"sk_title"}>
                  <h1>Skills</h1>
                  <p>Highlight your top skills and competencies</p>
                </div>
                <div className={"sk_input"}>
                  <Suspense fallback={<Spin spinning={true} />}>
                    <MDXEditor
                      className={"light-theme light-editor"}
                      onChange={(e) => {
                        handleOnDetailsChange(e, setFieldValue);
                      }}
                      markdown={`${initialValues.skills}`}
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
                    <ErrorMessage name="aboutMe" />
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

export default Skills;
