import React from 'react';
import {
  Formik,
  Field,
  Form,
  useField,
  FieldAttributes,
  FieldArray
} from 'formik';
import {
  TextField,
  Button,
  Checkbox,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import * as yup from 'yup';

const validationSchema = yup.object({
  firstName: yup
    .string()
    .required()
    .max(10)
})

interface ElementProps {
  label?: string,
  placeholder?: string,
  HTMLType: string,
}

type HTMLElementProps = ElementProps & FieldAttributes<{}>

enum Drink {
  capuchino = 'capuchino',
  milkCoffee = 'milkCoffee',
  darkCoffee = 'darkCoffee',
}

enum Food {
  ramen = 'ramen',
  sushi = 'sushi',
  udon = 'udon',
}


enum HTMLElementType {
  radio = 'radio',
  checkbox = 'checkbox',
  input = 'input',
}

const RenderHTMLElement: React.FC<HTMLElementProps> = ({ label, placeholder, HTMLType, ...props }) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  switch (HTMLType) {
    case HTMLElementType.radio:
      return (
        <FormControlLabel
          label={label}
          control={<Radio />}
          {...field}
        />
      )

    case HTMLElementType.checkbox:
      return (
        <FormControlLabel
          label={label}
          control={<Checkbox />}
          {...field}
        />
      )
    case HTMLElementType.input:
      return (
        <TextField
          placeholder={placeholder}
          helperText={errorText}
          error={!!errorText}
          {...field}
        />
      )
    default:
      return null;
  }
}

interface ValuesType {
  firstName: string,
  lastName: string,
  isTall: false,
  drinks: Array<string>,
  foods: string,
  pets: Array<Pet>
}

interface Pet {
  type: string,
  name: string
}

const defaultValues: ValuesType = {
  firstName: '',
  lastName: '',
  isTall: false,
  drinks: [],
  foods: '',
  pets: [{ type: 'cat', name: 'loli' }]
}

const App: React.FC = () => {
  return (
    <div className='formik-app'>
      <Formik
        initialValues={defaultValues}
        validationSchema={validationSchema}
        // validate={values => {
        //   const errors: Record<string, string> = {}
        //   if (values.firstName.includes('N')) {
        //     errors.firstName = 'no N'
        //   }
        //   return errors
        // }}
        onSubmit={(data, { setSubmitting }) => {
          setSubmitting(true);
          // make async call
          console.log('data', data)
          setSubmitting(false)
        }}
      >
        {({ values, errors, isSubmitting }) => (
          <Form>
            <div>
              <RenderHTMLElement
                HTMLType={HTMLElementType.input}
                placeholder='Your First Name'
                name='firstName'
              />
              <RenderHTMLElement
                HTMLType={HTMLElementType.input}
                placeholder='Your Last Name'
                name='lastName'
              />
            </div>
            <div>
              Is Tall:
              <RenderHTMLElement
                HTMLType={HTMLElementType.checkbox}
                name='isTall'
              />
            </div>
            <div>
              Drinks:
              {Object.values(Drink).map((drink, index) => (
                <RenderHTMLElement
                  key={`drink-${index}`}
                  HTMLType={HTMLElementType.checkbox}
                  name='drinks'
                  type='checkbox'
                  value={drink}
                  label={drink}
                />
              ))}
            </div>
            <div>
              Foods:
              {Object.values(Food).map((food, index) => (
                <RenderHTMLElement
                  key={`food-${index}`}
                  HTMLType={HTMLElementType.radio}
                  name='foods'
                  type='radio'
                  value={food}
                  label={food}
                />
              ))}
            </div>
            <div>
              <FieldArray name='pets'>
                {(arrayHelper) => (
                  <>
                    <Button onClick={() => arrayHelper.push({
                      type: 'frog',
                      name: '',
                      id: '' + Math.floor(Math.random() * Math.floor(100))
                    })}>Add Pet</Button>
                    {values.pets.map((pet, index) => (
                      <div key={`${index * 2}`}>
                        <RenderHTMLElement
                          HTMLType={HTMLElementType.input}
                          placeholder='Pet Name'
                          name={`pets.${index}.name`}
                        />
                        <Field type='select' name={`pets.${index}.type`} as={Select}>
                          <MenuItem value='cat'>cat</MenuItem>
                          <MenuItem value='dog'>dog</MenuItem>
                          <MenuItem value='frog'>frog</MenuItem>
                        </Field>
                        <Button onClick={() => arrayHelper.remove(index)}>X</Button>
                      </div>
                    ))}
                  </>
                )}
              </FieldArray>
            </div>
            <div>
              <Button type='submit' disabled={isSubmitting}>Submit</Button>
            </div>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;
