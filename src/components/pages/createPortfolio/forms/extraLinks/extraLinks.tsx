import React, { createRef, RefObject, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import "./extraLinks.scss";
import * as Yup from "yup";
import { useAppDispatch } from "../../../../../store/hooks";
import {
  addExtraLink,
  getExtraLinks,
  removeLink,
  updateLink,
} from "../../../../../store/reducers/extraLinksSlice";
import { useSelector } from "react-redux";
import { IExtraLink } from "../../../../../store/reducers/interfaces";
import { NextAndBackButtons } from "../../UI/forms.ui";

interface props {
  onComplete?(): void;
  back?(): void;
}

interface IInitialValues {
  linkName: String;
  linkValue: String;
}

interface IExtraLinkState {
  isEditing: boolean;
  extraLink: IExtraLink;
  linkNameRef: RefObject<HTMLInputElement>;
  linkValueRef: RefObject<HTMLInputElement>;
  linkNameError?: string;
  linkValueError?: string;
}

function ExtraLinks(props: props) {
  const dispatch = useAppDispatch();
  const extraLinksValues = useSelector(getExtraLinks);
  const [extraLinksState, setExtraLinksState] = useState<
    Array<IExtraLinkState>
  >([]);

  useEffect(() => {
    const initialExtraLinksState: Array<IExtraLinkState> = [];
    extraLinksValues.forEach((value) => {
      initialExtraLinksState.push({
        isEditing: false,
        extraLink: value,
        linkNameRef: createRef(),
        linkValueRef: createRef(),
      });
    });
    setExtraLinksState(initialExtraLinksState);
  }, [extraLinksValues]);

  const initialValues: IInitialValues = {
    linkName: "",
    linkValue: "",
  };

  const stringSchema = Yup.object({
    value: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
  });

  const validationSchema = Yup.object({
    linkName: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
    linkValue: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
  });

  const emptyStringCheck = Yup.string().test(
    "empty-check",
    "Value cannot be empty, and must be less than 50 characters",
    (value, context) => {
      if (!value) {
        return false;
      }
      return value.length <= 50;
    }
  );

  const submitForm = (values: FormikValues) => {
    const payload = {
      linkName: values.linkName,
      linkValue: values.linkValue,
    };
    dispatch(addExtraLink(payload));
  };

  const deleteLink = (id: string) => {
    dispatch(removeLink(id));
  };

  const editLink = (linkBeingEdited: IExtraLinkState) => {
    const editedLinkIndex = extraLinksState.indexOf(linkBeingEdited);
    let updatedLinksState = [...extraLinksState];
    updatedLinksState[editedLinkIndex] = {
      ...linkBeingEdited,
      isEditing: true,
    };
    setExtraLinksState(updatedLinksState);
  };

  const saveLink = (linkBeingEdited: IExtraLinkState) => {
    let updatedLinksState = [...extraLinksState];
    const editedLinkIndex = extraLinksState.findIndex(
      (value) => value.extraLink.id === linkBeingEdited.extraLink.id
    );
    const updatedLinkName = linkBeingEdited.linkNameRef.current?.value ?? "";
    const updatedLinkValue = linkBeingEdited.linkValueRef.current?.value ?? "";
    let linkNameError: string | undefined = undefined;
    let linkValueError: string | undefined = undefined;
    try {
      stringSchema.validateSync({
        value: updatedLinkName,
      });
    } catch (err) {
      if (err instanceof Error) {
        linkNameError = err.message;
      }
    }
    try {
      stringSchema.validateSync({
        value: updatedLinkValue,
      });
    } catch (err) {
      if (err instanceof Error) {
        linkValueError = err.message;
      }
    }
    if (linkNameError || linkValueError) {
      updatedLinksState[editedLinkIndex] = {
        ...linkBeingEdited,
        linkNameError,
        linkValueError,
      };
      setExtraLinksState(updatedLinksState);
      return;
    }

    const updatedExtraLink: IExtraLink = {
      id: linkBeingEdited.extraLink.id,
      linkName: updatedLinkName,
      linkValue: updatedLinkValue,
    };
    updatedLinksState[editedLinkIndex] = {
      ...linkBeingEdited,
      extraLink: updatedExtraLink,
      isEditing: false,
      linkNameError: undefined,
      linkValueError: undefined,
    };
    setExtraLinksState(updatedLinksState);
    dispatch(updateLink(updatedExtraLink));
  };

  const handleOnComplete = () => {
    if (props.onComplete) {
      props.onComplete();
    }
  };

  const getLinksRows = (
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    if (extraLinksState && extraLinksState.length !== 0) {
      return (
        <ul className={"el_list"}>
          {extraLinksState.map((link) => {
            return (
              <li
                className={`el_list_item ${link.isEditing ? "editing" : ""}`}
                key={link.extraLink.id}
              >
                {!link.isEditing ? (
                  <div className={"link_immutable"}>
                    <h1 className={"link_immutable_name"}>
                      {link.extraLink.linkName}
                    </h1>
                    <h1 className={"link_immutable_value"}>
                      {link.extraLink.linkValue}
                    </h1>
                  </div>
                ) : null}
                {link.isEditing ? (
                  <div className={"link_editing"}>
                    <div className={"link_input_editing"}>
                      <input
                        type={"text"}
                        defaultValue={link.extraLink.linkName}
                        ref={link.linkNameRef}
                      />
                      {link.linkNameError ? <p>{link.linkNameError}</p> : null}
                    </div>
                    <div className={"link_input_editing"}>
                      <input
                        type={"text"}
                        ref={link.linkValueRef}
                        defaultValue={link.extraLink.linkValue}
                      />
                      {link.linkValueError ? (
                        <p>{link.linkValueError}</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {!link.isEditing ? (
                  <div className={"link_buttons_not_editing"}>
                    <button type={"button"} onClick={() => editLink(link)}>
                      Edit
                    </button>
                    <button
                      className={"link_buttons_not_editing_delete"}
                      type={"button"}
                      onClick={() => deleteLink(link.extraLink.id)}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
                {link.isEditing ? (
                  <div className={"link_button_editing"}>
                    <button onClick={() => saveLink(link)} type={"button"}>
                      Save
                    </button>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      );
    }
    return null;
  };

  return (
    <div className={"el_container"}>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { resetForm }) => {
          submitForm(values);
          resetForm();
        }}
        validationSchema={validationSchema}
      >
        {({ setFieldValue }) => (
          <Form className={"el_form"}>
            <div className={"el_form_title"}>
              <h1>Extra Links</h1>
              <p>
                Include links to your social media and projects across the web
              </p>
            </div>
            {getLinksRows(setFieldValue)}
            <h1 className={"el_add_new_link_title"}>Add New Link</h1>
            <div className={"el_field_container el_new_link_fields"}>
              <div className={"el_linkName"}>
                <label htmlFor="linkName">Name</label>
                <Field
                  name="linkName"
                  type="text"
                  placeholder={"Twitter, Bitbucket, Website..."}
                />
                <ErrorMessage name="linkName" />
              </div>
              <div className={"el_linkValue"}>
                <label htmlFor="linkValue">Link/Username</label>
                <Field
                  name="linkValue"
                  type="text"
                  placeholder={"username/link"}
                />
                <ErrorMessage name="linkValue" />
              </div>
              <button type={"submit"} className={"el_add_new_link_button"}>
                Add new link
              </button>
            </div>
            <NextAndBackButtons
              back={props.back}
              onSubmitDisabled={true}
              onContinueClick={handleOnComplete}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ExtraLinks;
