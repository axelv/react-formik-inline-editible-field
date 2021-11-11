# Inline Editable Field using Formik

This repo contains a **headless** component wrapping the [**Formik**](https://formik.org) `<Form />` element that provides all the necessary state logic and event handlers for an **inline editable field**. 

*Why?* - I had a hard time to find a simple, elegant hand headlesss implementation, and decided to build a component myself.

Take a look at `<InlineEditableForm/>` [src/App.tsx](src/App.tsx) for to exact component.

⭐️ Main Features ⭐️:

- ✅ Headless form component
- ✅ Keyboard (Tab, Enter, Esc) and mouse interaction
- ✅ Autosubmit on blur
- ✅  Works with Formik