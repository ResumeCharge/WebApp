import React, { Suspense, useState } from "react";
import { useAppDispatch } from "../../../../../store/hooks";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import { Spin } from "antd";
import "./projects.scss";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";
import {
  addProject,
  getProjects,
  removeProject,
} from "../../../../../store/reducers/projectSlice";
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

interface IInitialValues {
  title: string;
}

interface props {
  onComplete?(): void;

  back?(): void;
}

function Projects(props: props) {
  const initialValues: IInitialValues = {
    title: "",
  };

  const [details, setDetails] = useState("");
  const ref = React.useRef<MDXEditorMethods>(null);
  const dispatch = useAppDispatch();

  const markdownProcessor = new MarkdownIt({ html: true });
  const projectsValue = useSelector(getProjects);

  const validationSchema = Yup.object({
    title: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
  });

  const submitForm = (values: FormikValues) => {
    const payload = {
      title: values.title,
      details,
    };
    dispatch(addProject(payload));
    setDetails("");
    ref.current?.setMarkdown("");
  };

  const deleteProject = (projectId: string) => {
    dispatch(removeProject(projectId));
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
    if (projectsValue.length !== 0) {
      return (
        <ul className={"proj_list"}>
          {projectsValue.map((project) => {
            const details = markdownProcessor.render(project.details);
            return (
              <li className={"proj_list_item"} key={project.id}>
                <div className={"proj_list_item_content"}>
                  <h2>{project.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: details }}></div>
                </div>
                <div className={"proj_list_item_button_container"}>
                  <button
                    className={"proj_list_item_delete_project"}
                    type={"button"}
                    onClick={() => {
                      deleteProject(project.id);
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
    <div className={"proj_container"}>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          await submitForm(values);
          resetForm();
        }}
        validationSchema={validationSchema}
      >
        <Form className={"proj_form"}>
          <div className={"proj_form_title"}>
            <h1>Projects</h1>
          </div>
          {getEducationItems()}
          <h1 className={"proj_add_new_project_title"}>Add New Project</h1>
          <div className={"proj_field_container proj_title_description"}>
            <div className={"proj_title"}>
              <label htmlFor="title">Title</label>
              <Field
                name="title"
                type="text"
                placeholder={"My awesome project"}
              />
              <ErrorMessage name="title" />
            </div>
            <h2 className={"project_description"}>Project Description</h2>
            <Suspense fallback={<Spin spinning={true} />}>
              <MDXEditor
                className={"light-theme light-editor"}
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
            <button className={"proj_add_new_project_button"}>
              Add project
            </button>
          </div>
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

export default Projects;
