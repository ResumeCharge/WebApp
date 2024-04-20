import React, { Suspense } from "react";
import { ErrorMessage, Form, Formik, FormikErrors, FormikValues } from "formik";
import "./aboutMe.scss";
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
  getAboutMe,
  setAboutMe,
} from "../../../../../store/reducers/aboutMeSlice";

interface props {
  back?(): void;

  onComplete?(): void;
}

function AboutMe(props: props) {
  const initialValues = useAppSelector(getAboutMe);
  const ref = React.useRef<MDXEditorMethods>(null);
  const dispatch = useAppDispatch();
  const validationSchema = Yup.object({
    aboutMe: Yup.string().max(5000, "Must be 5000 characters or less"),
  });

  const submitForm = (values: FormikValues) => {
    if (!ref.current) {
      return;
    }
    const aboutMe = ref.current.getMarkdown() ?? "";
    const payload = {
      aboutMe,
    };
    dispatch(setAboutMe(payload));
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
    await setFieldValue("aboutMe", text, true);
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
            <div className={"am_container"}>
              <div className={"am_summary"}>
                <div className={"am_title"}>
                  <h1>About Me</h1>
                  <p>
                    Write anything else you want visitors to your site to know
                    about you. The information will show up in the "About Me"
                    section of your website.
                  </p>
                </div>
                <div className={"am_input"}>
                  <Suspense fallback={<Spin spinning={true} />}>
                    <MDXEditor
                      className={"am_md_editor"}
                      contentEditableClassName={"am_md_editor_content"}
                      onChange={(e) => {
                        handleOnDetailsChange(e, setFieldValue);
                      }}
                      markdown={`${initialValues.aboutMe}`}
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

export default AboutMe;
