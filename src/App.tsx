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
  MenuItem
} from '@material-ui/core';
import * as yup from 'yup';

const validationSchema = yup.object({
  firstName: yup
    .string()
    .required()
    .max(10)
})

type MyRadioProps = { label: string } & FieldAttributes<{}>
type MyTextProps = { placeholder: string } & FieldAttributes<{}>

const MyRadio: React.FC<MyRadioProps> = ({ label, ...props }) => {
  const [field] = useField<{}>(props);
  return (
    <FormControlLabel
      label={label}
      control={<Radio />}
      {...field}
    />
  )
}

const MyTextField: React.FC<MyTextProps> = ({ placeholder, ...props }) => {
  const [field, meta] = useField<{}>(props)
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      placeholder={placeholder}
      helperText={errorText}
      error={!!errorText}
      {...field}
    />
  )
}

interface ValuesType {
  firstName: string,
  lastName: string,
  fullName: string,
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
  fullName: '',
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
              <MyTextField placeholder='Your First Name' name='firstName' />
              <MyTextField placeholder='Your Last Name' name='lastName' />
              <Field placeholder='Your Full Name' name='fullName' as={TextField} />
            </div>
            <div>
              Is Tall? (This is CheckBox with only one value)
              <Field name='isTall' type='checkbox' as={Checkbox}></Field>
            </div>
            <div>
              Drink? (This is CheckBox with many values)
              <Field name='drinks' type='checkbox' value='capuchino' as={Checkbox}></Field>
              <Field name='drinks' type='checkbox' value='milkCoffee' as={Checkbox}></Field>
              <Field name='drinks' type='checkbox' value='darkCoffee' as={Checkbox}></Field>
            </div>
            <div>
              Foods
              <MyRadio name='foods' type='radio' value='ramen' label='ramen'></MyRadio>
              <MyRadio name='foods' type='radio' value='sushi' label='sushi'></MyRadio>
              <MyRadio name='foods' type='radio' value='udon' label='udon'></MyRadio>
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
                      <div key={`${index}-${pet.name}`}>
                        <MyTextField
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
