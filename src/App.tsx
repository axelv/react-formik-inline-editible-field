import { Field, Form, Formik, useField, useFormikContext } from 'formik';
import React, { useRef, useState } from 'react';
import './App.css';
import './tailwind.css'

interface InlineEditableFormProps<T> {
  name: string
  children: (props: {
    isEditing: boolean,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
    value: T
    name: string
  }) => React.ReactNode
}

const InlineEditableForm = <T extends any>({ name, children }: InlineEditableFormProps<T>) => {
  // the state controlling edit mode vs read mode
  const [isEditing, setIsEditing] = useState(false)

  // we want to have access to the canonical form submit function of a native HTML form
  const formRef = useRef<HTMLFormElement>(null)

  const formik = useFormikContext()
  const [{ value }] = useField<T>(name)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // when submitting the editing is over, go back to read mode
    setIsEditing(false)
    formik.handleSubmit(event) // let formik process everything related to the submit event
  }
  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    // when resetting the editing is over, go back to read mode
    setIsEditing(false)
    formik.handleReset(event) // let formik process everything related to the reset event
  }
  // when pressing Escape => reset the form using the native reset of the HTML form
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Esc" || event.key === "Escape") {
      formRef.current?.reset()
    }
  }

  // when loosing focus => submit the form using the native reset of the HTML form
  const handleBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    if (!formRef.current.contains(event.relatedTarget as HTMLElement)) {
      // Not triggered when swapping focus between children
      formRef.current?.requestSubmit();
    }
  }

  return (
    <Form ref={formRef} onKeyDown={handleKeyDown} onSubmit={handleSubmit} onReset={handleReset} onBlur={handleBlur}>
      {/** pass some convenient methods to the children using render props */}
      {children({ isEditing, setIsEditing, value, name })}
    </Form>
  )
}

/**
 * Example usage 
 * @returns 
 */
function App() {
  return (
    <div className="py-20 w-full flex justify-center relative">
      <div>
        <h2 className="leading-6 text-2xl font-semibold">Inline Editable Field</h2>
        {/** once we submitted the content of the field (using enter or the submit button), we want to save these values as new initialValues! */}
        <Formik
          initialValues={{ value: "Initial text" }}
          onSubmit={(data, actions) => actions.resetForm({ values: data })}
        >
          <div className="w-96 mt-20">
            <InlineEditableForm<string> name="value">
              {({ isEditing, setIsEditing, value }) => isEditing ? (
                <span>
                  <Field
                    name="value"
                    autoFocus
                    type="text"
                    className="py-2 px-1.5 text-sm border-2 border-blue-700 rounded-md"
                  />
                  <span className="mx-2 space-x-1">
                    {/** if you want, you can hide these buttons but don't remove them */}
                    {/** [ENTER] triggers the submit button automatically */}
                    <button className="bg-gray-200 rounded text-sm px-1 py-1" type="submit">Submit</button>
                    <button className="bg-gray-200 rounded text-sm px-1 py-1" type="reset">Reset</button>
                  </span>
                </span>
              ) :
                <button
                  type="button"
                  onFocus={() => setIsEditing(true)}
                  onClick={() => setIsEditing(true)}
                  className="cursor-text hover:bg-gray-100 px-1.5 py-2 rounded-md"
                >
                  {value}
                </button>
              }
            </InlineEditableForm>
          </div>
        </Formik>

      </div>
    </div>
  );
}

export default App;
